/* eslint-disable */
/**
 * Prerenders the built SPA with react-snap.
 * Unlike the default static config, this:
 *   1. warms the API (Render free tier sleeps, so cold starts would snapshot empty pages),
 *   2. explicitly enumerates every service and article detail route so they are prerendered
 *      with real content (react-snap otherwise misses data-driven dynamic pages),
 *   3. allows cross-origin requests so the onrender.com API loads during prerender.
 * GA/Clarity are guarded against the ReactSnap user agent, so they do not fire here.
 */
const { run } = require('react-snap');

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

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchJson(url) {
    const res = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!res.ok) throw new Error(`${url} -> ${res.status}`);
    return res.json();
}

// Wake the backend and wait until it responds, so prerendered pages capture real data.
async function warmApi() {
    for (let i = 0; i < 8; i++) {
        try {
            const res = await fetch(`${API}/api/v1/services`, { headers: { Accept: 'application/json' } });
            if (res.ok) {
                console.log(`[prerender] API warm after ${i + 1} attempt(s)`);
                return true;
            }
        } catch (e) {
            // backend still waking up
        }
        await sleep(5000);
    }
    console.warn('[prerender] API did not warm up in time — dynamic pages may be thin');
    return false;
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
        (data.posts || []).forEach((p) => {
            if (p && p.slug) routes.push(`/articles/${p.slug}`);
        });
        totalPages = (data.pagination && data.pagination.total_pages) || 1;
        page += 1;
    } while (page <= totalPages);
    return routes;
}

(async () => {
    await warmApi();

    let dynamicRoutes = [];
    try {
        const [services, articles] = await Promise.all([getServiceRoutes(), getArticleRoutes()]);
        dynamicRoutes = [...services, ...articles];
        console.log(`[prerender] ${services.length} service pages, ${articles.length} article pages`);
    } catch (err) {
        console.warn(`[prerender] could not fetch dynamic routes: ${err.message}`);
    }

    const include = [...STATIC_ROUTES, ...dynamicRoutes];
    console.log(`[prerender] rendering ${include.length} routes`);

    try {
        await run({
            source: 'build',
            include,
            // Serve on a fixed port that the backend CORS allows, so the API loads during prerender.
            port: 45678,
            // Allow cross-origin requests so the onrender.com API is not blocked here.
            skipThirdPartyRequests: false,
            inlineCss: false,
            puppeteerArgs: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
    } catch (err) {
        console.error('[prerender] react-snap failed:', err);
        process.exit(1);
    }
})();
