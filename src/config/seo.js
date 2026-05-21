/**
 * Site-wide SEO configuration.
 * Set REACT_APP_SITE_URL in .env.production (e.g. https://protacc.in)
 */
export const SITE_URL = (process.env.REACT_APP_SITE_URL || 'https://protacc.in').replace(/\/$/, '');

export const SITE_NAME = 'Protacc';

export const DEFAULT_SEO = {
    title: 'Protacc | Tax, GST, ITR Filing & Business Compliance Services in India',
    description:
        'Protacc offers professional tax filing, GST registration, ITR filing, company registration, accounting, and compliance services across India. Expert support in Kaithal & pan-India.',
    keywords:
        'Protacc, ITR filing, GST registration, tax consultant, company registration, TDS filing, accounting services, compliance, Kaithal, Haryana, India',
    image: `${SITE_URL}/logo512.png`,
    locale: 'en_IN',
    twitterHandle: '@protacc',
};

export const PAGE_SEO = {
    home: {
        title: 'Protacc | Tax, GST, ITR & Business Compliance Services',
        description: DEFAULT_SEO.description,
        path: '/',
    },
    services: {
        title: 'Our Services | Protacc – Tax, GST & Compliance',
        description:
            'Browse Protacc services: ITR filing, GST registration & returns, TDS, company/LLP registration, bookkeeping, and tax consultancy.',
        path: '/services',
    },
    consultancy: {
        title: 'Free Business Consultation | Protacc',
        description:
            'Book a free consultation with Protacc experts for tax planning, GST compliance, business registration, and financial advisory.',
        path: '/consultancy',
    },
    contact: {
        title: 'Contact Us | Protacc',
        description:
            'Contact Protacc for tax, GST, and compliance services. Call +91 9034819324 or email info@protacc.in. Office in Kaithal, Haryana.',
        path: '/contact',
    },
    privacy: {
        title: 'Privacy Policy | Protacc',
        description: 'Learn how Protacc collects, uses, and protects your personal and business information.',
        path: '/privacy-policy',
        noindex: false,
    },
    terms: {
        title: 'Terms of Service | Protacc',
        description: 'Terms governing your use of the Protacc website and professional services.',
        path: '/terms-of-service',
    },
    refund: {
        title: 'Refund Policy | Protacc',
        description: 'Protacc refund and cancellation policy for taxation, compliance, and consultancy services.',
        path: '/refund-policy',
    },
    search: {
        title: 'Search Services | Protacc',
        description: 'Search Protacc services for tax filing, GST, registration, and compliance.',
        path: '/search',
        noindex: true,
    },
};

export const getCanonicalUrl = (path = '/') => {
    const normalized = path.startsWith('/') ? path : `/${path}`;
    return `${SITE_URL}${normalized}`;
};

export default DEFAULT_SEO;
