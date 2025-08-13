import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';
import { normalizeBrandName } from '@/lib/validation';

export async function POST() {
  try {
    // Buscar todos os veículos com suas marcas
    const { data: vehicles, error: fetchError } = await supabase
      .from('veiculos')
      .select('id, marca');

    if (fetchError) {
      throw fetchError;
    }

    if (!vehicles || vehicles.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'Nenhum veículo encontrado para normalizar',
        updated: 0
      });
    }

    // Agrupar veículos por marca normalizada
    const brandGroups = new Map<string, Array<{id: number, originalBrand: string}>>();
    
    vehicles.forEach(vehicle => {
      const normalizedBrand = normalizeBrandName(vehicle.marca);
      
      if (!brandGroups.has(normalizedBrand)) {
        brandGroups.set(normalizedBrand, []);
      }
      
      brandGroups.get(normalizedBrand)!.push({
        id: vehicle.id,
        originalBrand: vehicle.marca
      });
    });

    let updatedCount = 0;
    const updates: Array<{id: number, from: string, to: string}> = [];

    // Atualizar cada grupo que precisa de normalização
    for (const [normalizedBrand, vehicleGroup] of brandGroups) {
      for (const vehicle of vehicleGroup) {
        if (vehicle.originalBrand !== normalizedBrand) {
          const { error: updateError } = await supabase
            .from('veiculos')
            .update({ marca: normalizedBrand })
            .eq('id', vehicle.id);

          if (updateError) {
            console.error(`Erro ao atualizar veículo ${vehicle.id}:`, updateError);
          } else {
            updatedCount++;
            updates.push({
              id: vehicle.id,
              from: vehicle.originalBrand,
              to: normalizedBrand
            });
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Normalização concluída. ${updatedCount} veículos atualizados.`,
      updated: updatedCount,
      changes: updates
    });

  } catch (error) {
    console.error('Erro na normalização de marcas:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Erro interno na normalização',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}