// // src/pages/api/submit-application.js
// export const prerender = false;

// import nodemailer from 'nodemailer';

// // Configuración del transportador de correo
// const transporter = nodemailer.createTransport({
//     host: 'premium246.web-hosting.com',
//     port: 465,
//     secure: true, // true para 465, false para otros puertos
//     auth: {
//         user: 'webforms@cemapoedu.ec',
//         pass: 'webforms2025cemapo'
//     }
// });

// export async function POST({ request }) {
//     try {
//         // Obtener FormData del request
//         const formData = await request.formData();

//         // Extraer datos del formulario
//         const fullName = formData.get('fullName');
//         const city = formData.get('city');
//         const phone = formData.get('phone');
//         const email = formData.get('email');
//         const experience = formData.get('experience');
//         const vacancyTitle = formData.get('vacancyTitle');
//         const coverLetter = formData.get('coverLetter') || '';
//         const isGeneral = formData.get('isGeneral') === 'true';
//         const area = formData.get('area') || '';

//         // Obtener el archivo CV
//         const cvFile = formData.get('cv');

//         if (!cvFile) {
//             return new Response(
//                 JSON.stringify({
//                     success: false,
//                     message: 'No se ha adjuntado ningún CV'
//                 }),
//                 { status: 400, headers: { 'Content-Type': 'application/json' } }
//             );
//         }

//         // Preparar el contenido del correo
//         let emailSubject = isGeneral
//             ? `Nueva aplicación laboral general: ${fullName}`
//             : `Nueva aplicación a vacante "${vacancyTitle}": ${fullName}`;

//         let emailHtml = `
//       <h2>Nueva aplicación laboral</h2>
//       ${vacancyTitle && !isGeneral ? `<p><strong>Vacante:</strong> ${vacancyTitle}</p>` : ''}
//       ${area && isGeneral ? `<p><strong>Área de interés:</strong> ${area}</p>` : ''}
//       <p><strong>Nombre:</strong> ${fullName}</p>
//       <p><strong>Ciudad:</strong> ${city}</p>
//       <p><strong>Teléfono:</strong> ${phone}</p>
//       <p><strong>Email:</strong> ${email}</p>
//       <p><strong>Experiencia:</strong> ${experience}</p>
//       ${coverLetter ? `<p><strong>Carta de presentación:</strong> ${coverLetter}</p>` : ''}
//       <p><em>CV adjunto en este correo.</em></p>
//     `;

//         // Convertir el archivo a buffer
//         const arrayBuffer = await cvFile.arrayBuffer();
//         const buffer = Buffer.from(arrayBuffer);

//         // Configurar opciones de correo
//         const mailOptions = {
//             from: '"CEMAPO Reclutamiento" <webforms@cemapoedu.ec>',
//             to: 'seleccion@cemapoedu.ec',
//             subject: emailSubject,
//             html: emailHtml,
//             attachments: [
//                 {
//                     filename: cvFile.name,
//                     content: buffer
//                 }
//             ]
//         };

//         // Enviar el correo
//         await transporter.sendMail(mailOptions);

//         return new Response(
//             JSON.stringify({
//                 success: true,
//                 message: 'Aplicación enviada correctamente'
//             }),
//             { status: 200, headers: { 'Content-Type': 'application/json' } }
//         );
//     } catch (error) {
//         console.error('Error al enviar aplicación:', error);

//         return new Response(
//             JSON.stringify({
//                 success: false,
//                 message: 'Error al enviar la aplicación',
//                 error: error.message
//             }),
//             { status: 500, headers: { 'Content-Type': 'application/json' } }
//         );
//     }
// }


// api/submit-psicologia.js
import nodemailer from 'nodemailer';

// Configuración del transportador de correo
const transporter = nodemailer.createTransport({
  host: 'premium246.web-hosting.com',
  port: 465,
  secure: true,
  auth: {
    user: 'webforms@cemapoedu.ec',
    pass: 'webforms2025cemapo'
  }
});

export default async function handler(req, res) {
  // Manejar solicitudes OPTIONS para CORS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Solo permitir solicitudes POST
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Método no permitido' });
  }

  try {
    // Obtener los datos del request
    const { nombre, email, telefono, servicio, mensaje = 'No se proporcionó mensaje adicional' } = req.body;
    
    // Validar campos requeridos
    if (!nombre || !email || !telefono || !servicio) {
      return res.status(400).json({
        success: false,
        message: 'Por favor complete todos los campos requeridos'
      });
    }
    
    // Mapear valores del servicio a nombres más descriptivos
    const serviciosMapa = {
      'terapia-individual': 'Terapia Individual',
      'terapia-empresarial': 'Psicoterapia para Empresas',
      'atencion-crisis': 'Atención en Crisis',
      'evaluaciones': 'Evaluaciones Psicológicas'
    };
    
    const servicioNombre = serviciosMapa[servicio] || servicio;
    
    // Preparar el contenido del correo
    const emailSubject = `Nueva solicitud de información: ${servicioNombre}`;
    
    const emailHtml = `
      <h2>Nueva solicitud de información de servicios de psicología</h2>
      <p><strong>Nombre:</strong> ${nombre}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Teléfono:</strong> ${telefono}</p>
      <p><strong>Servicio de interés:</strong> ${servicioNombre}</p>
      <p><strong>Mensaje adicional:</strong> ${mensaje}</p>
    `;
    
    // Configurar opciones de correo
    const mailOptions = {
      from: '"CEMAPO Psicología" <webforms@cemapoedu.ec>',
      to: 'psicologia@cemapoedu.ec',
      subject: emailSubject,
      html: emailHtml
    };
    
    // Enviar el correo
    await transporter.sendMail(mailOptions);
    
    return res.status(200).json({
      success: true,
      message: 'Solicitud enviada correctamente'
    });
  } catch (error) {
    console.error('Error al enviar solicitud:', error);
    
    return res.status(500).json({
      success: false,
      message: 'Error al enviar la solicitud',
      error: error.message
    });
  }
}