// src/pages/sitemap.xml.ts
import type { APIRoute } from 'astro';
import { getAllArticles } from '../lib/airtable';

export const GET: APIRoute = async ({ site }) => {
    if (!site) {
        return new Response('Configuración del sitio no encontrada', { status: 500 });
    }

    // Define las páginas estáticas del sitio
    const staticPages = [
        { url: '/' },
        { url: '/servicios' },
        { url: '/cursos' },
        { url: '/servicios/educacion-continua' },
        { url: '/servicios/empresas' },
        { url: '/servicios/psicologia-clinica' },
        { url: '/nosotros' },
        { url: '/trabaja-con-nosotros' },
    ];

    // Obtener todos los artículos dinámicos de Airtable
    let dynamicArticles = [];
    try {
        const articles = await getAllArticles();
        dynamicArticles = articles.map((article: any) => ({
            url: `/articulos/${article.slug}`,
            lastmod: article.updatedAt || article.createdAt || new Date().toISOString().split('T')[0]
        }));
    } catch (error) {
        console.error('Error al obtener artículos para el sitemap:', error);
    }

    // Combinar páginas estáticas y dinámicas
    const allPages = [
        ...staticPages.map(page => ({
            url: page.url,
            lastmod: new Date().toISOString().split('T')[0]
        })),
        ...dynamicArticles
    ];

    // Generar el XML del sitemap
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(page => `
  <url>
    <loc>${site.origin}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.url === '/' ? 'daily' : 'weekly'}</changefreq>
    <priority>${page.url === '/' ? '1.0' : '0.7'}</priority>
  </url>`).join('')}
</urlset>`;

    return new Response(sitemap, {
        headers: {
            'Content-Type': 'application/xml',
            'Cache-Control': 'max-age=3600'
        }
    });
};