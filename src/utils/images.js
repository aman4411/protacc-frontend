/**
 * Returns a width-constrained version of an image URL where the host supports it.
 * Google Drive-hosted images (lh3.googleusercontent.com/d/<id>) support an on-the-fly
 * size suffix (=w400), which cuts a ~1.4 MB original to ~120 KB. Other URLs are returned
 * unchanged. Use for display <img> src only — keep the original for og:image/schema.
 */
export const sizedImage = (url, width = 800) => {
    if (!url || typeof url !== 'string') return url;
    if (url.includes('googleusercontent.com/d/')) {
        const base = url.split('=')[0]; // strip any existing size suffix
        return `${base}=w${width}`;
    }
    return url;
};
