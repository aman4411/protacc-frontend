/* eslint-disable */
/**
 * Build-time sitemap generator.
 * Pulls active service slugs and published article slugs from the API and writes
 * public/sitemap.xml (on the site's own domain, static + fast, no runtime dependency).
 * Runs automatically before `build` (npm prebuild lifecycle).
 * If the API is unreachable at build time it still writes the static URLs.
 */
const fs = require('fs');
const path = require('path');

const SITE = process.env.SITE_URL || 'https://protacc.in';
const API = process.env.REACT_APP_PROTACC_API_BASE_URL || 'https://protacc-backend.onrender.com';

const STATIC_URLS = [
    { loc: '/', changefreq: 'weekly', priority: '1.0' },
    { loc: '/services', changefreq: 'weekly', priority: '0.9' },
    { loc: '/articles', changefreq: 'weekly', priority: '0.7' },
    { loc: '/consultancy', changefreq: 'monthly', priority: '0.8' },
    { loc: '/contact', changefreq: 'monthly', priority: '0.8' },
    { loc: '/privacy-policy', changefreq: 'yearly', priority: '0.3' },
    { loc: '/terms-of-service', changefreq: 'yearly', priority: '0.3' },
    { loc: '/refund-policy', changefreq: 'yearly', priority: '0.3' },
];

async function fetchJson(url) {
    const res = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!res.ok) throw new Error(`${url} -> ${res.status}`);
    return res.json();
}

async function getServiceUrls() {
    const data = await fetchJson(`${API}/api/v1/services`);
    const list = Array.isArray(data) ? data : [];
    return list
        .filter((s) => s && s.slug)
        .map((s) => ({ loc: `/services/${s.slug}`, changefreq: 'weekly', priority: '0.8', lastmod: s.updated_at }));
}

async function getArticleUrls() {
    const urls = [];
    let page = 1;
    let totalPages = 1;
    do {
        const data = await fetchJson(`${API}/api/v1/posts?page=${page}&limit=50`);
        (data.posts || []).forEach((p) => {
            if (p && p.slug) urls.push({ loc: `/articles/${p.slug}`, changefreq: 'monthly', priority: '0.7', lastmod: p.updated_at || p.published_at });
        });
        totalPages = (data.pagination && data.pagination.total_pages) || 1;
        page += 1;
    } while (page <= totalPages);
    return urls;
}

function isoDate(value) {
    if (!value) return '';
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? '' : d.toISOString().slice(0, 10);
}

function toXml(urls) {
    const body = urls
        .map((u) => {
            const lastmod = isoDate(u.lastmod);
            const lastmodLine = lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : '';
            return `  <url>\n    <loc>${SITE}${u.loc}</loc>${lastmodLine}\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`;
        })
        .join('\n');
    return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}

(async () => {
    let dynamicUrls = [];
    try {
        const [services, articles] = await Promise.all([getServiceUrls(), getArticleUrls()]);
        dynamicUrls = [...services, ...articles];
        console.log(`[sitemap] ${services.length} services, ${articles.length} articles`);
    } catch (err) {
        console.warn(`[sitemap] could not fetch dynamic URLs, writing static only: ${err.message}`);
    }

    const xml = toXml([...STATIC_URLS, ...dynamicUrls]);
    const outPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
    fs.writeFileSync(outPath, xml);
    console.log(`[sitemap] wrote ${STATIC_URLS.length + dynamicUrls.length} URLs to ${outPath}`);
})();
