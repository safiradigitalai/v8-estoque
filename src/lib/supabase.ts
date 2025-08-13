import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Helper para uploads de fotos
export async function uploadVeiculoFoto(
  veiculoId: number,
  file: File,
  tipo: 'principal' | 'galeria' | 'vitrine'
) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${veiculoId}/${tipo}/${Date.now()}.${fileExt}`;
  
  const { data, error } = await supabase.storage
    .from('veiculo-fotos')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    });
  
  if (error) throw error;
  
  // Salva referência no banco
  const { data: foto, error: dbError } = await supabase
    .from('veiculo_fotos')
    .insert({
      veiculo_id: veiculoId,
      url: data.path,
      tipo,
      ordem: 0
    })
    .select()
    .single();
    
  if (dbError) throw dbError;
  return foto;
}

// Helper para buscar URL pública das fotos
export function getPublicUrl(path: string) {
  const { data } = supabase.storage
    .from('veiculo-fotos')
    .getPublicUrl(path);
  return data.publicUrl;
}