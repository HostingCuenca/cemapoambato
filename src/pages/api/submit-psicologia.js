// // src/pages/api/submit-psicologia.js
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
//         // Obtener los datos del request
//         const data = await request.json();

//         // Extraer datos del formulario
//         const { nombre, email, telefono, servicio, mensaje = 'No se proporcionó mensaje adicional' } = data;

//         // Validar campos requeridos
//         if (!nombre || !email || !telefono || !servicio) {
//             return new Response(
//                 JSON.stringify({
//                     success: false,
//                     message: 'Por favor complete todos los campos requeridos'
//                 }),
//                 { status: 400, headers: { 'Content-Type': 'application/json' } }
//             );
//         }

//         // Mapear valores del servicio a nombres más descriptivos
//         const serviciosMapa = {
//             'terapia-individual': 'Terapia Individual',
//             'terapia-empresarial': 'Psicoterapia para Empresas',
//             'atencion-crisis': 'Atención en Crisis',
//             'evaluaciones': 'Evaluaciones Psicológicas'
//         };

//         const servicioNombre = serviciosMapa[servicio] || servicio;

//         // Preparar el contenido del correo
//         const emailSubject = `Nueva solicitud de información: ${servicioNombre}`;

//         const emailHtml = `
//       <h2>Nueva solicitud de información de servicios de psicología</h2>
//       <p><strong>Nombre:</strong> ${nombre}</p>
//       <p><strong>Email:</strong> ${email}</p>
//       <p><strong>Teléfono:</strong> ${telefono}</p>
//       <p><strong>Servicio de interés:</strong> ${servicioNombre}</p>
//       <p><strong>Mensaje adicional:</strong> ${mensaje}</p>
//     `;

//         // Configurar opciones de correo
//         const mailOptions = {
//             from: '"CEMAPO Psicología" <webforms@cemapoedu.ec>',
//             to: 'psicologia@cemapoedu.ec',
//             subject: emailSubject,
//             html: emailHtml
//         };

//         // Enviar el correo
//         await transporter.sendMail(mailOptions);

//         return new Response(
//             JSON.stringify({
//                 success: true,
//                 message: 'Solicitud enviada correctamente'
//             }),
//             { status: 200, headers: { 'Content-Type': 'application/json' } }
//         );
//     } catch (error) {
//         console.error('Error al enviar solicitud:', error);

//         return new Response(
//             JSON.stringify({
//                 success: false,
//                 message: 'Error al enviar la solicitud',
//                 error: error.message
//             }),
//             { status: 500, headers: { 'Content-Type': 'application/json' } }
//         );
//     }
// }



// api/submit-psicologia.js
const nodemailer = require('nodemailer');

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

module.exports = async (req, res) => {
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
};