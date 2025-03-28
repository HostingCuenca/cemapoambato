
/**
 * Funciones para interactuar con la API de Airtable
 */

// Constantes de configuración
const AIRTABLE_BASE_ID = import.meta.env.AIRTABLE_BASE_ID;
const AIRTABLE_PERSONAL_TOKEN = import.meta.env.AIRTABLE_PERSONAL_TOKEN;

// IDs de tablas
const COURSES_TABLE_ID = import.meta.env.AIRTABLE_COURSES_TABLE_ID || 'tblnTchpMxxemcEOi';
const VACANCIES_TABLE_ID = import.meta.env.AIRTABLE_VACANCIES_TABLE_ID || 'tblARj0OGP2u7kG1Q';
const APPLICATIONS_TABLE_ID = import.meta.env.AIRTABLE_APPLICATIONS_TABLE_ID || 'tblZuka4T5uW3vGhK';

const ARTICLES_TABLE_ID = import.meta.env.AIRTABLE_ARTICLES_TABLE_ID || 'tblbpl62ezxFYb2yV';

/**
 * Función auxiliar para realizar solicitudes a la API de Airtable
 */
async function fetchFromAirtable(tableName, options = {}) {
  const defaultOptions = {
    maxRecords: 100,
    filterByFormula: '',
    sort: []
  };

  const queryOptions = { ...defaultOptions, ...options };
  let queryString = `maxRecords=${queryOptions.maxRecords}`;

  if (queryOptions.filterByFormula) {
    queryString += `&filterByFormula=${encodeURIComponent(queryOptions.filterByFormula)}`;
  }

  if (queryOptions.sort.length > 0) {
    queryOptions.sort.forEach((sortItem, index) => {
      queryString += `&sort[${index}][field]=${encodeURIComponent(sortItem.field)}`;
      queryString += `&sort[${index}][direction]=${encodeURIComponent(sortItem.direction || 'asc')}`;
    });
  }

  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${tableName}?${queryString}`;

  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${AIRTABLE_PERSONAL_TOKEN}`
      }
    });

    if (!response.ok) {
      throw new Error(`Error en solicitud a Airtable: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error al comunicarse con Airtable:', error);
    throw error;
  }
}

function formatDate(dateString) {
  if (!dateString) return '';

  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('es-ES', options);
}

/**
 * Obtiene todos los cursos desde Airtable
 */
// export async function getAllCourses() {
//   try {
//     const data = await fetchFromAirtable(COURSES_TABLE_ID);
//
//     // Transformar los registros de Airtable al formato que espera tu aplicación
//     return data.records.map(record => ({
//       id: record.id,
//       title: record.fields['Nombre del Curso'] || 'Sin título',
//       // Manejar el formato específico de las imágenes en Airtable
//       imageUrl: record.fields['Imagen'] && record.fields['Imagen'][0] ?
//           record.fields['Imagen'][0].url :
//           'https://via.placeholder.com/600x400?text=Imagen+no+disponible',
//       whatsappUrl: record.fields['URL de WhatsApp'] ||
//           `https://wa.me/593982121145?text=Hola,%20estoy%20interesado%20en%20el%20curso%20de%20${encodeURIComponent(record.fields['Nombre del Curso'] || 'Sin título')}`,
//       category: record.fields['Categoría'] || 'General'
//     }));
//   } catch (error) {
//     console.error('Error al obtener cursos desde Airtable:', error);
//     // En caso de error, devuelve un array vacío para que tu aplicación no se rompa
//     return [];
//   }
// }

/**
 * Obtiene todos los cursos desde Airtable, ordenados del ID más alto al más bajo
 */
/**
 * Obtiene todos los cursos desde Airtable, ordenados por fecha (del más reciente al más antiguo)
 */
export async function getAllCourses() {
  try {
    // Usamos la opción de ordenación por el campo "Date" en orden descendente
    const data = await fetchFromAirtable(COURSES_TABLE_ID, {
      sort: [
        { field: 'Date', direction: 'desc' }
      ]
    });

    // Transformar los registros de Airtable al formato que espera tu aplicación
    return data.records.map(record => ({
      id: record.id,
      title: record.fields['Nombre del Curso'] || 'Sin título',
      // Ahora obtenemos la imagen desde el campo "url-img" que contiene URLs estáticas
      imageUrl: record.fields['url-img'] ||
          'https://via.placeholder.com/600x400?text=Imagen+no+disponible',
      whatsappUrl: record.fields['URL de WhatsApp'] ||
          `https://wa.me/593982121145?text=Hola,%20estoy%20interesado%20en%20el%20curso%20de%20${encodeURIComponent(record.fields['Nombre del Curso'] || 'Sin título')}`,
      category: record.fields['Categoría'] || 'General',
      // Opcionalmente puedes incluir la fecha en el objeto retornado si la necesitas para mostrarla
      date: record.fields['Date'] || null
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

/**
 * Obtiene todas las categorías de cursos disponibles
 */
export async function getAllCategories() {
  try {
    const allCourses = await getAllCourses();
    // Extraer categorías únicas
    return [...new Set(allCourses.map(course => course.category).filter(Boolean))];
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    return [];
  }
}

/**
 * Obtiene las vacantes laborales activas
 */
/**
 * Obtiene las vacantes laborales activas
 */
export async function getActiveJobVacancies() {
  try {
    // La estructura del filtro puede estar causando el problema
    // Vamos a simplificarlo para asegurar que obtenga todas las vacantes
    const data = await fetchFromAirtable(VACANCIES_TABLE_ID, {
      sort: [{ field: 'Fecha Publicación', direction: 'desc' }]
    });

    console.log('Vacantes recibidas de Airtable:', data.records.length); // Agregar log para depuración

    return data.records.map(record => ({
      id: record.id,
      title: record.fields['Título de Vacante'] || 'Sin título',
      department: record.fields['Departamento'] || 'General',
      description: record.fields['Descripción'] || '',
      requirements: record.fields['Requisitos'] || '',
      publishDate: record.fields['Fecha Publicación'] || null,
      imageUrl: record.fields['Imagen'] && record.fields['Imagen'][0] ?
          record.fields['Imagen'][0].url :
          'https://images.unsplash.com/photo-1521737711867-e3b97375f902?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
    }));
  } catch (error) {
    console.error('Error al obtener vacantes desde Airtable:', error);
    return [];
  }
}

/**
 * Obtiene una vacante específica por su ID
 */
export async function getJobVacancyById(vacancyId) {
  try {
    const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${VACANCIES_TABLE_ID}/${vacancyId}`;

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${AIRTABLE_PERSONAL_TOKEN}`
      }
    });

    if (!response.ok) {
      throw new Error(`Error al obtener vacante: ${response.status}`);
    }

    const record = await response.json();

    return {
      id: record.id,
      title: record.fields['Título de Vacante'] || 'Sin título',
      department: record.fields['Departamento'] || 'General',
      description: record.fields['Descripción'] || '',
      requirements: record.fields['Requisitos'] || '',
      publishDate: record.fields['Fecha Publicación'] || null,
      imageUrl: record.fields['Imagen'] && record.fields['Imagen'][0] ?
          record.fields['Imagen'][0].url :
          'https://via.placeholder.com/600x400?text=Imagen+no+disponible'
    };
  } catch (error) {
    console.error(`Error al obtener vacante con ID ${vacancyId}:`, error);
    return null;
  }
}

/**
 * Obtiene los departamentos disponibles para vacantes
 */
export async function getAllDepartments() {
  try {
    const vacancies = await fetchFromAirtable(VACANCIES_TABLE_ID);
    // Extraer departamentos únicos
    const departments = [...new Set(
        vacancies.records
            .map(record => record.fields['Departamento'])
            .filter(Boolean)
    )];

    return departments;
  } catch (error) {
    console.error('Error al obtener departamentos:', error);
    return [];
  }
}


/**
 * Obtiene todos los artículos publicados desde Airtable
 */
export async function getAllArticles() {
  try {
    const data = await fetchFromAirtable(ARTICLES_TABLE_ID, {
      filterByFormula: "{Estado} = 'Publicado'",
      sort: [{ field: 'Fecha Publicación', direction: 'desc' }]
    });

    return data.records.map(record => ({
      id: record.id,
      title: record.fields['Título'] || 'Sin título',
      slug: record.fields['Slug'] || `articulo-${record.id}`, // Fallback para slug
      summary: record.fields['Resumen'] || 'No hay resumen disponible para este artículo.',
      content: record.fields['Contenido'] || 'El contenido de este artículo no está disponible en este momento.',
      imageUrl: record.fields['url-img'] || '/images/placeholder-article.jpg',
      category: record.fields['Categoría'] || 'General',
      author: record.fields['Autor'] || 'Equipo CEMAPO',
      publishDate: record.fields['Fecha Publicación'] || null,
      formattedDate: formatDate(record.fields['Fecha Publicación']),
      featured: record.fields['Destacado'] || false,
      tags: record.fields['Tags'] || []
    }));
  } catch (error) {
    console.error('Error al obtener artículos desde Airtable:', error);
    return [];
  }
}

/**
 * Obtiene un artículo específico por su ID
 */
export async function getArticleById(articleId) {
  if (!articleId) return null;

  try {
    const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${ARTICLES_TABLE_ID}/${articleId}`;

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${AIRTABLE_PERSONAL_TOKEN}`
      }
    });

    if (!response.ok) {
      throw new Error(`Error al obtener artículo: ${response.status}`);
    }

    const record = await response.json();

    return {
      id: record.id,
      title: record.fields['Título'] || 'Sin título',
      slug: record.fields['Slug'] || `articulo-${record.id}`,
      summary: record.fields['Resumen'] || 'No hay resumen disponible para este artículo.',
      content: record.fields['Contenido'] || 'El contenido de este artículo no está disponible en este momento.',
      imageUrl: record.fields['url-img'] || '/images/placeholder-article.jpg',
      category: record.fields['Categoría'] || 'General',
      author: record.fields['Autor'] || 'Equipo CEMAPO',
      publishDate: record.fields['Fecha Publicación'] || null,
      formattedDate: formatDate(record.fields['Fecha Publicación']),
      featured: record.fields['Destacado'] || false,
      tags: record.fields['Tags'] || []
    };
  } catch (error) {
    console.error(`Error al obtener artículo con ID ${articleId}:`, error);
    return null;
  }
}

/**
 * Obtiene un artículo específico por su slug
 */
export async function getArticleBySlug(slug) {
  if (!slug) return null;

  try {
    const data = await fetchFromAirtable(ARTICLES_TABLE_ID, {
      filterByFormula: `{Slug} = '${slug}'`,
      maxRecords: 1
    });

    if (data.records.length === 0) {
      return null;
    }

    const record = data.records[0];

    return {
      id: record.id,
      title: record.fields['Título'] || 'Sin título',
      slug: record.fields['Slug'] || `articulo-${record.id}`,
      summary: record.fields['Resumen'] || 'No hay resumen disponible para este artículo.',
      content: record.fields['Contenido'] || 'El contenido de este artículo no está disponible en este momento.',
      imageUrl: record.fields['Imagen'] && record.fields['Imagen'][0] ?
          record.fields['Imagen'][0].url :
          '/images/placeholder-article.jpg',
      category: record.fields['Categoría'] || 'General',
      author: record.fields['Autor'] || 'Equipo CEMAPO',
      publishDate: record.fields['Fecha Publicación'] || null,
      formattedDate: formatDate(record.fields['Fecha Publicación']),
      featured: record.fields['Destacado'] || false,
      tags: record.fields['Tags'] || []
    };
  } catch (error) {
    console.error(`Error al obtener artículo con slug ${slug}:`, error);
    return null;
  }
}





/**
 * Para implementaciones futuras: Crear una nueva aplicación laboral
 * Nota: Esta función requiere credenciales de escritura y posiblemente un backend
 */
export async function createJobApplication(applicationData) {
  // Este es un ejemplo de cómo podría implementarse, pero requiere acceso de escritura
  // y posiblemente un endpoint serverless o backend para manejar archivos adjuntos

  try {
    const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${APPLICATIONS_TABLE_ID}`;

    const payload = {
      fields: {
        'Nombre Candidato': applicationData.fullName,
        'Email': applicationData.email,
        'Teléfono': applicationData.phone,
        'Carta Presentación': applicationData.coverLetter || '',
        'Fecha Aplicación': new Date().toISOString().split('T')[0],
        'Estado': 'Nueva',
        'Vacante': [applicationData.vacancyId] // Formato requerido para links en Airtable
      }
    };

    // Nota: La carga de archivos adjuntos (CV) requiere un manejo especial
    // que podría necesitar un backend o serverless function

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AIRTABLE_PERSONAL_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error al crear aplicación: ${JSON.stringify(errorData)}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error al crear aplicación laboral:', error);
    throw error;
  }
}