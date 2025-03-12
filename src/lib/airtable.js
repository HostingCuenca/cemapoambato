// src/lib/airtable.js

/**
 * Funciones para interactuar con la API de Airtable
 */

// Constantes de configuración
const AIRTABLE_BASE_ID = import.meta.env.AIRTABLE_BASE_ID;
const AIRTABLE_PERSONAL_TOKEN = import.meta.env.AIRTABLE_PERSONAL_TOKEN;
const AIRTABLE_TABLE_NAME = import.meta.env.AIRTABLE_TABLE_NAME || 'tblnTchpMxxemcEOi';

/**
 * Obtiene todos los cursos desde Airtable
 */
export async function getAllCourses() {
  try {
    // URL para obtener todos los cursos
    const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}?maxRecords=100`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${AIRTABLE_PERSONAL_TOKEN}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Error al obtener cursos: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Transformar los registros de Airtable al formato que espera tu aplicación
    return data.records.map(record => ({
      id: record.id,
      title: record.fields['Nombre del Curso'] || 'Sin título',
      // Manejar el formato específico de las imágenes en Airtable
      imageUrl: record.fields['Imagen'] && record.fields['Imagen'][0] ? 
                record.fields['Imagen'][0].url : 
                'https://via.placeholder.com/600x400?text=Imagen+no+disponible',
      whatsappUrl: record.fields['URL de WhatsApp'] || 
                   `https://wa.me/593961870303?text=Hola,%20estoy%20interesado%20en%20el%20curso%20de%20${encodeURIComponent(record.fields['Nombre del Curso'] || 'Sin título')}` 
    }));
  } catch (error) {
    console.error('Error al obtener cursos desde Airtable:', error);
    // En caso de error, devuelve un array vacío para que tu aplicación no se rompa
    return [];
  }
}

/**
 * Obtiene solo los cursos destacados
 */
export async function getFeaturedCourses(limit = 6) {
  try {
    const allCourses = await getAllCourses();
    return allCourses.slice(0, limit);
  } catch (error) {
    console.error('Error al obtener cursos destacados:', error);
    return [];
  }
}