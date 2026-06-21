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
            opens: '09:00',
            closes: '18:00',
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

export const serviceSchema = (service) => ({
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    description: service.short_description || service.description,
    url: `${SITE_URL}/services/${service.slug}`,
    provider: {
        '@type': 'Organization',
        name: 'Protacc',
        url: SITE_URL,
    },
    offers: service.price
        ? {
              '@type': 'Offer',
              price: service.price,
              priceCurrency: 'INR',
          }
        : undefined,
});

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
