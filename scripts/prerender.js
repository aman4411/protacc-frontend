/* eslint-disable */
/**
 * Fail-soft prerenderer using a modern headless Chromium (Puppeteer).
 * Replaces react-snap, whose bundled Chromium was too old to parse modern JS
 * (optional chaining `?.`), which broke the build.
 *
 * Design: prerendering is a best-effort enhancement — it must NEVER fail the build.
 * Any error (no Chromium, a page that throws, API down) is logged and skipped, and
 * the script exits 0 so the normal SPA still deploys.
 *
 * It: warms the API (Render cold start), enumerates every service + article route,
 * serves build/ on a fixed port the backend CORS allows, and writes the rendered
 * HTML back into build/<route>/index.html.
 */
const fs = require('fs');
const path = require('path');
const http = require('http');

let puppeteer;
try {
    puppeteer = require('puppeteer');
} catch (e) {
    console.warn('[prerender] puppeteer not installed — skipping prerender (SPA still deploys)');
    process.exit(0);
}

const BUILD = path.join(__dirname, '..', 'build');
const PORT = 45678; // must be allowed by the backend CORS config
const API = process.env.REACT_APP_PROTACC_API_BASE_URL || 'https://protacc-backend.onrender.com';

const STATIC_ROUTES = [
    '/',
    '/services',
    '/articles',
    '/consultancy',
    '/contact',
    '/privacy-policy',
    '/terms-of-service',
    '/refund-policy',
];

const MIME = {
    '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json',
    '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon', '.webp': 'image/webp', '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf',
    '.txt': 'text/plain', '.xml': 'application/xml', '.map': 'application/json',
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchJson(url) {
    const res = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!res.ok) throw new Error(`${url} -> ${res.status}`);
    return res.json();
}

async function warmApi() {
    for (let i = 0; i < 8; i++) {
        try {
            const res = await fetch(`${API}/api/v1/services`, { headers: { Accept: 'application/json' } });
            if (res.ok) { console.log(`[prerender] API warm after ${i + 1} attempt(s)`); return; }
        } catch (e) { /* still waking */ }
        await sleep(5000);
    }
    console.warn('[prerender] API did not warm up — dynamic pages may be thin');
}

async function getServiceRoutes() {
    const data = await fetchJson(`${API}/api/v1/services`);
    return (Array.isArray(data) ? data : []).filter((s) => s.slug).map((s) => `/services/${s.slug}`);
}

async function getArticleRoutes() {
    const routes = [];
    let page = 1;
    let totalPages = 1;
    do {
        const data = await fetchJson(`${API}/api/v1/posts?page=${page}&limit=50`);
        (data.posts || []).forEach((p) => { if (p && p.slug) routes.push(`/articles/${p.slug}`); });
        totalPages = (data.pagination && data.pagination.total_pages) || 1;
        page += 1;
    } while (page <= totalPages);
    return routes;
}

function startServer() {
    return new Promise((resolve) => {
        const server = http.createServer((req, res) => {
            const urlPath = decodeURIComponent(req.url.split('?')[0]);
            let file = path.join(BUILD, urlPath);
            try {
                if (urlPath.endsWith('/')) file = path.join(file, 'index.html');
                if (fs.existsSync(file) && fs.statSync(file).isFile()) {
                    res.setHeader('Content-Type', MIME[path.extname(file).toLowerCase()] || 'application/octet-stream');
                    fs.createReadStream(file).pipe(res);
                    return;
                }
            } catch (e) { /* fall through to SPA shell */ }
            res.setHeader('Content-Type', 'text/html');
            fs.createReadStream(path.join(BUILD, 'index.html')).pipe(res);
        });
        server.listen(PORT, () => resolve(server));
    });
}

function writeHtml(route, html) {
    const dir = route === '/' ? BUILD : path.join(BUILD, route);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), html);
}

(async () => {
    if (!fs.existsSync(path.join(BUILD, 'index.html'))) {
        console.warn('[prerender] build/ not found — skipping');
        process.exit(0);
    }

    await warmApi();

    let dynamicRoutes = [];
    try {
        const [services, articles] = await Promise.all([getServiceRoutes(), getArticleRoutes()]);
        dynamicRoutes = [...services, ...articles];
        console.log(`[prerender] ${services.length} service pages, ${articles.length} article pages`);
    } catch (err) {
        console.warn(`[prerender] could not fetch dynamic routes: ${err.message}`);
    }

    const routes = [...STATIC_ROUTES, ...dynamicRoutes];
    console.log(`[prerender] rendering ${routes.length} routes`);

    let server;
    let browser;
    try {
        server = await startServer();
        browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    } catch (err) {
        console.warn(`[prerender] could not start renderer — skipping (SPA still deploys): ${err.message}`);
        if (server) server.close();
        process.exit(0);
    }

    let ok = 0;
    let skipped = 0;
    for (const route of routes) {
        let page;
        try {
            page = await browser.newPage();
            await page.goto(`http://localhost:${PORT}${route}`, { waitUntil: 'networkidle0', timeout: 45000 });
            await sleep(300);
            writeHtml(route, await page.content());
            ok += 1;
        } catch (err) {
            skipped += 1;
            console.warn(`[prerender] skip ${route}: ${err.message}`);
        } finally {
            if (page) { try { await page.close(); } catch (e) { /* ignore */ } }
        }
    }

    try { await browser.close(); } catch (e) { /* ignore */ }
    server.close();
    console.log(`[prerender] done — ${ok} prerendered, ${skipped} skipped`);
    process.exit(0);
})();
