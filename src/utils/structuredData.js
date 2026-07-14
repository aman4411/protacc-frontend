import { SITE_URL } from '../config/seo';
import { SITE_CONTACT } from '../config/siteContact';

export const organizationSchema = () => ({
    '@context': 'https://schema.org',
    '@type': 'AccountingService',
    '@id': `${SITE_URL}/#organization`,
    name: 'Protacc',
    alternateName: 'Protacc Chartered Accountants',
    url: SITE_URL,
    logo: `${SITE_URL}/logo512.png`,
    image: `${SITE_URL}/logo512.png`,
    description:
        'Protacc is a Chartered Accountant and CA firm in Kaithal, Haryana offering GST registration, ITR filing, company registration, TDS returns, accounting and business compliance services across India.',
    telephone: SITE_CONTACT.phoneTel,
    email: SITE_CONTACT.email,
    priceRange: '₹₹',
    address: {
        '@type': 'PostalAddress',
        streetAddress: `${SITE_CONTACT.address.line1} ${SITE_CONTACT.address.line2}`,
        addressLocality: 'Kaithal',
        addressRegion: 'Haryana',
        postalCode: '136027',
        addressCountry: 'IN',
    },
    geo: {
        '@type': 'GeoCoordinates',
        latitude: 29.8013,
        longitude: 76.3998,
    },
    hasMap: SITE_CONTACT.mapsSearchUrl,
    openingHoursSpecification: [
        {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            opens: '09:30',
            closes: '19:00',
        },
    ],
    areaServed: [
        { '@type': 'City', name: 'Kaithal' },
        { '@type': 'City', name: 'Chandigarh' },
        { '@type': 'City', name: 'Gurgaon' },
        { '@type': 'AdministrativeArea', name: 'Haryana' },
        { '@type': 'Country', name: 'India' },
    ],
    knowsAbout: [
        'GST Registration',
        'GST Return Filing',
        'Income Tax Return Filing',
        'TDS Return Filing',
        'Company Registration',
        'LLP Registration',
        'ROC Compliance',
        'Accounting',
        'Bookkeeping',
        'Audit',
        'Tax Planning',
    ],
    sameAs: [SITE_CONTACT.social.facebook, SITE_CONTACT.social.instagram],
});

/**
 * FAQPage schema for rich results. Pass an array of { question, answer }.
 */
export const faqSchema = (faqs = []) => {
    if (!faqs.length) return null;
    return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map(({ question, answer }) => ({
            '@type': 'Question',
            name: question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: answer,
            },
        })),
    };
};

export const blogPostingSchema = (post) => ({
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt || '',
    image: post.cover_image || `${SITE_URL}/logo512.png`,
    datePublished: post.published_at || post.created_at,
    dateModified: post.updated_at || post.published_at || post.created_at,
    url: `${SITE_URL}/articles/${post.slug}`,
    author: { '@type': 'Organization', name: 'Protacc' },
    publisher: {
        '@type': 'Organization',
        name: 'Protacc',
        logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo512.png` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/articles/${post.slug}` },
});

export const serviceSchema = (service, summary = null, reviews = []) => {
    // Modelled as Product: Google supports aggregateRating/review rich results on
    // Product, but NOT on Service (which triggers "Invalid object type").
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: service.name,
        description: service.short_description || service.description,
        url: `${SITE_URL}/services/${service.slug}`,
        image: service.cover_image || `${SITE_URL}/logo512.png`,
        brand: {
            '@type': 'Brand',
            name: 'Protacc',
        },
        offers: service.price
            ? {
                  '@type': 'Offer',
                  price: service.price,
                  priceCurrency: 'INR',
                  availability: 'https://schema.org/InStock',
                  url: `${SITE_URL}/services/${service.slug}`,
              }
            : undefined,
    };

    // Only emit rating/review markup when real reviews exist (Google policy: no fake data).
    if (summary && summary.count > 0) {
        schema.aggregateRating = {
            '@type': 'AggregateRating',
            ratingValue: Number(summary.average).toFixed(1),
            reviewCount: summary.count,
            bestRating: 5,
            worstRating: 1,
        };
    }
    if (reviews && reviews.length > 0) {
        schema.review = reviews.slice(0, 5).map((r) => ({
            '@type': 'Review',
            reviewRating: { '@type': 'Rating', ratingValue: r.rating, bestRating: 5, worstRating: 1 },
            author: { '@type': 'Person', name: r.reviewer_name || 'Verified customer' },
            reviewBody: r.comment || '',
        }));
    }

    return schema;
};

export const breadcrumbSchema = (items) => ({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.url,
    })),
});
