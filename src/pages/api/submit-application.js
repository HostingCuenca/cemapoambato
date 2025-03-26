// src/pages/api/submit-application.js
export const prerender = false;

import nodemailer from 'nodemailer';

// Configuración del transportador de correo
const transporter = nodemailer.createTransport({
    host: 'premium246.web-hosting.com',
    port: 465,
    secure: true, // true para 465, false para otros puertos
    auth: {
        user: 'webforms@cemapoedu.ec',
        pass: 'webforms2025cemapo'
    }
});

export async function POST({ request }) {
    try {
        // Obtener FormData del request
        const formData = await request.formData();

        // Extraer datos del formulario
        const fullName = formData.get('fullName');
        const city = formData.get('city');
        const phone = formData.get('phone');
        const email = formData.get('email');
        const experience = formData.get('experience');
        const vacancyTitle = formData.get('vacancyTitle');
        const coverLetter = formData.get('coverLetter') || '';
        const isGeneral = formData.get('isGeneral') === 'true';
        const area = formData.get('area') || '';

        // Obtener el archivo CV
        const cvFile = formData.get('cv');

        if (!cvFile) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: 'No se ha adjuntado ningún CV'
                }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Preparar el contenido del correo
        let emailSubject = isGeneral
            ? `Nueva aplicación laboral general: ${fullName}`
            : `Nueva aplicación a vacante "${vacancyTitle}": ${fullName}`;

        let emailHtml = `
      <h2>Nueva aplicación laboral</h2>
      ${vacancyTitle && !isGeneral ? `<p><strong>Vacante:</strong> ${vacancyTitle}</p>` : ''}
      ${area && isGeneral ? `<p><strong>Área de interés:</strong> ${area}</p>` : ''}
      <p><strong>Nombre:</strong> ${fullName}</p>
      <p><strong>Ciudad:</strong> ${city}</p>
      <p><strong>Teléfono:</strong> ${phone}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Experiencia:</strong> ${experience}</p>
      ${coverLetter ? `<p><strong>Carta de presentación:</strong> ${coverLetter}</p>` : ''}
      <p><em>CV adjunto en este correo.</em></p>
    `;

        // Convertir el archivo a buffer
        const arrayBuffer = await cvFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Configurar opciones de correo
        const mailOptions = {
            from: '"CEMAPO Reclutamiento" <webforms@cemapoedu.ec>',
            to: 'seleccion@cemapoedu.ec',
            subject: emailSubject,
            html: emailHtml,
            attachments: [
                {
                    filename: cvFile.name,
                    content: buffer
                }
            ]
        };

        // Enviar el correo
        await transporter.sendMail(mailOptions);

        return new Response(
            JSON.stringify({
                success: true,
                message: 'Aplicación enviada correctamente'
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        console.error('Error al enviar aplicación:', error);

        return new Response(
            JSON.stringify({
                success: false,
                message: 'Error al enviar la aplicación',
                error: error.message
            }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}