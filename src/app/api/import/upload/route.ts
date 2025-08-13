import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

// Tipos para upload
interface UploadResponse {
  success: boolean;
  data?: {
    upload_id: number;
    filename: string;
    file_size: number;
    total_rows?: number;
  };
  error?: string;
  details?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<UploadResponse>> {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const importType = formData.get('import_type') as string || 'csv';
    const sourceType = formData.get('source_type') as string || 'manual';

    // Validações básicas
    if (!file) {
      return NextResponse.json({
        success: false,
        error: 'Arquivo não fornecido'
      }, { status: 400 });
    }

    // Validar tipo de arquivo
    const allowedTypes = {
      'csv': ['text/csv', 'application/csv', 'text/plain'],
      'excel': [
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.oasis.opendocument.spreadsheet'
      ]
    };

    const acceptedMimeTypes = allowedTypes[importType as keyof typeof allowedTypes] || allowedTypes.csv;
    
    if (!acceptedMimeTypes.includes(file.type) && !file.name.match(/\.(csv|xlsx?|xls|ods)$/i)) {
      return NextResponse.json({
        success: false,
        error: 'Tipo de arquivo não suportado',
        details: `Tipos aceitos: ${acceptedMimeTypes.join(', ')}`
      }, { status: 400 });
    }

    // Validar tamanho do arquivo (50MB max)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      return NextResponse.json({
        success: false,
        error: 'Arquivo muito grande',
        details: 'Tamanho máximo permitido: 50MB'
      }, { status: 400 });
    }

    // Criar diretório de uploads se não existir
    const uploadsDir = path.join(process.cwd(), 'uploads', 'imports');
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Gerar nome único para o arquivo
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileExtension = path.extname(file.name);
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const uniqueFilename = `${timestamp}_${safeName}`;
    const filePath = path.join(uploadsDir, uniqueFilename);

    // Salvar arquivo no sistema
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Análise inicial do arquivo para contar linhas
    let totalRows = 0;
    try {
      if (importType === 'csv') {
        const content = buffer.toString('utf-8');
        const lines = content.split('\n').filter(line => line.trim().length > 0);
        totalRows = Math.max(0, lines.length - 1); // -1 para descontar o cabeçalho
      } else if (importType === 'excel') {
        // Para Excel, vamos usar uma biblioteca específica depois
        // Por enquanto, estimativa baseada no tamanho
        totalRows = Math.floor(file.size / 100); // Estimativa aproximada
      }
    } catch (error) {
      console.warn('Erro ao contar linhas:', error);
      totalRows = 0;
    }

    // Registrar upload no banco de dados
    const { data: uploadRecord, error: dbError } = await supabase
      .from('file_uploads')
      .insert({
        filename: uniqueFilename,
        original_name: file.name,
        mime_type: file.type,
        file_size: file.size,
        file_path: filePath,
        import_type: importType,
        source_type: sourceType,
        total_rows: totalRows,
        status: 'uploaded',
        uploaded_by: 'system' // TODO: Implementar autenticação
      })
      .select()
      .single();

    if (dbError) {
      console.error('Erro ao registrar upload:', dbError);
      throw new Error(`Erro ao registrar upload: ${dbError.message}`);
    }

    return NextResponse.json({
      success: true,
      data: {
        upload_id: uploadRecord.id,
        filename: uploadRecord.filename,
        file_size: uploadRecord.file_size,
        total_rows: uploadRecord.total_rows
      }
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({
      success: false,
      error: 'Erro interno do servidor',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 });
  }
}

// Listar uploads
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const importType = searchParams.get('import_type');

    // Query base
    let query = supabase
      .from('file_uploads')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    // Aplicar filtros
    if (status) {
      query = query.eq('status', status);
    }

    if (importType) {
      query = query.eq('import_type', importType);
    }

    // Aplicar paginação
    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1);

    const { data: uploads, count, error } = await query;

    if (error) throw error;

    // Buscar estatísticas dos uploads
    const uploadsWithStats = await Promise.all(
      (uploads || []).map(async (upload) => {
        const { data: logStats } = await supabase
          .from('import_logs')
          .select('status')
          .eq('file_upload_id', upload.id);

        const stats = {
          total: logStats?.length || 0,
          processed: logStats?.filter(l => l.status === 'processed').length || 0,
          errors: logStats?.filter(l => l.status === 'error').length || 0,
          duplicates: logStats?.filter(l => l.status === 'duplicate').length || 0
        };

        return {
          ...upload,
          stats
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: uploadsWithStats,
      pagination: {
        page,
        limit,
        total: count || 0,
        total_pages: Math.ceil((count || 0) / limit),
        has_next: page * limit < (count || 0),
        has_prev: page > 1
      }
    });

  } catch (error) {
    console.error('List uploads error:', error);
    return NextResponse.json({
      success: false,
      error: 'Erro ao listar uploads',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 });
  }
}