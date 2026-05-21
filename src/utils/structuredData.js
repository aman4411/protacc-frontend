import { SITE_URL } from '../config/seo';
import { SITE_CONTACT } from '../config/siteContact';

export const organizationSchema = () => ({
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'Protacc',
    url: SITE_URL,
    logo: `${SITE_URL}/logo512.png`,
    image: `${SITE_URL}/logo512.png`,
    description:
        'Professional tax filing, GST registration, ITR filing, company registration, accounting, and compliance services in India.',
    telephone: SITE_CONTACT.phoneTel,
    email: SITE_CONTACT.email,
    address: {
        '@type': 'PostalAddress',
        streetAddress: `${SITE_CONTACT.address.line1} ${SITE_CONTACT.address.line2}`,
        addressLocality: 'Kaithal',
        addressRegion: 'Haryana',
        postalCode: '136027',
        addressCountry: 'IN',
    },
    areaServed: {
        '@type': 'Country',
        name: 'India',
    },
    sameAs: [SITE_CONTACT.social.facebook, SITE_CONTACT.social.instagram],
});

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
