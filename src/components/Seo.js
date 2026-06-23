import { useEffect } from 'react';
import { DEFAULT_SEO, getCanonicalUrl } from '../config/seo';

const upsertMeta = (attribute, key, content) => {
    if (!content) return;
    let el = document.querySelector(`meta[${attribute}="${key}"]`);
    if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attribute, key);
        document.head.appendChild(el);
    }
    el.setAttribute('content', content);
};

const upsertLink = (rel, href) => {
    if (!href) return;
    let el = document.querySelector(`link[rel="${rel}"]`);
    if (!el) {
        el = document.createElement('link');
        el.setAttribute('rel', rel);
        document.head.appendChild(el);
    }
    el.setAttribute('href', href);
};

const removeJsonLd = (id) => {
    const existing = document.getElementById(id);
    if (existing) existing.remove();
};

const upsertJsonLd = (id, data) => {
    removeJsonLd(id);
    if (!data) return;
    const script = document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
};

/**
 * Updates document title and meta tags for SEO / social sharing.
 */
const Seo = ({
    title,
    description = DEFAULT_SEO.description,
    keywords = DEFAULT_SEO.keywords,
    path = '/',
    image = DEFAULT_SEO.image,
    type = 'website',
    noindex = false,
    jsonLd = null,
    jsonLdId = 'protacc-jsonld',
}) => {
    const fullTitle = title?.toLowerCase().includes('protacc') ? title : `${title} | ProtAcc`;
    const canonical = getCanonicalUrl(path);
    const robots = noindex ? 'noindex, nofollow' : 'index, follow';

    useEffect(() => {
        document.title = fullTitle;

        upsertMeta('name', 'description', description);
        upsertMeta('name', 'keywords', keywords);
        upsertMeta('name', 'robots', robots);
        upsertMeta('name', 'author', 'ProtAcc');

        upsertLink('canonical', canonical);

        upsertMeta('property', 'og:title', fullTitle);
        upsertMeta('property', 'og:description', description);
        upsertMeta('property', 'og:type', type);
        upsertMeta('property', 'og:url', canonical);
        upsertMeta('property', 'og:image', image);
        upsertMeta('property', 'og:site_name', 'ProtAcc');
        upsertMeta('property', 'og:locale', DEFAULT_SEO.locale);

        upsertMeta('name', 'twitter:card', 'summary_large_image');
        upsertMeta('name', 'twitter:title', fullTitle);
        upsertMeta('name', 'twitter:description', description);
        upsertMeta('name', 'twitter:image', image);

        upsertJsonLd(jsonLdId, jsonLd);

        return () => removeJsonLd(jsonLdId);
    }, [fullTitle, description, keywords, canonical, robots, image, type, jsonLd, jsonLdId]);

    return null;
};

export default Seo;
