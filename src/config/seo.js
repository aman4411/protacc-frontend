/**
 * Site-wide SEO configuration.
 * Set REACT_APP_SITE_URL in .env.production (e.g. https://protacc.in)
 */
export const SITE_URL = (process.env.REACT_APP_SITE_URL || 'https://protacc.in').replace(/\/$/, '');

export const SITE_NAME = 'ProtAcc';

export const DEFAULT_SEO = {
    title: 'Chartered Accountant in Kaithal | CA Firm, GST & ITR Filing – ProtAcc',
    description:
        'ProtAcc is a leading CA firm in Kaithal, Haryana for GST registration, ITR filing, company registration, TDS returns, accounting & business compliance. Trusted Chartered Accountant & tax consultant serving Kaithal and all of India.',
    keywords:
        'Chartered Accountant in Kaithal, CA firm in Kaithal, best CA in Kaithal, GST consultant Kaithal, income tax consultant Kaithal, GST registration, ITR filing, company registration, TDS return filing, accounting services, ROC compliance, tax consultant Haryana, online CA services India',
    image: `${SITE_URL}/logo512.png`,
    locale: 'en_IN',
    twitterHandle: '@protacc',
};

export const PAGE_SEO = {
    home: {
        title: 'ProtAcc: Your Chartered Accountant for GST, ITR & Company Registration | CA Firm',
        description:
            'ProtAcc — trusted Chartered Accountant & CA firm in Kaithal, Haryana. GST registration & return filing, ITR filing, company registration, TDS, accounting and ROC compliance. Online CA services across India.',
        keywords: DEFAULT_SEO.keywords,
        path: '/',
    },
    services: {
        title: 'CA Services in Kaithal | GST, ITR & Company Registration',
        description:
            'Explore ProtAcc CA services in Kaithal: GST registration & return filing, GST notice reply, ITR filing, TDS returns, private limited / LLP / MSME registration, bookkeeping, payroll, audit and ROC compliance.',
        keywords:
            'CA services Kaithal, GST return filing, GST registration online, ITR filing online, company registration, LLP registration, MSME registration, TDS return filing, ROC compliance, audit services, payroll services, bookkeeping',
        path: '/services',
    },
    consultancy: {
        title: 'Free CA Consultation in Kaithal | Tax & GST Advisory',
        description:
            'Book a free consultation with ProtAcc Chartered Accountants in Kaithal for tax planning, GST compliance, business & company registration, and financial advisory. Online CA consultation across India.',
        keywords:
            'free CA consultation, tax consultant near me, GST expert near me, tax planning services, income tax consultant in Kaithal, online CA services India',
        path: '/consultancy',
    },
    articles: {
        title: 'Articles | Tax, GST & Compliance Updates – ProtAcc',
        description:
            'Latest amendments, announcements and expert insights on GST, income tax, TDS, company registration and business compliance from ProtAcc Chartered Accountants.',
        keywords: 'tax articles, GST updates, income tax amendments, ITR tips, company registration guide, compliance news India',
        path: '/articles',
    },
    contact: {
        title: 'Contact ProtAcc | Best CA Firm in Kaithal, Haryana',
        description:
            'Contact ProtAcc, a top CA firm in Kaithal, Haryana for GST, ITR, tax and compliance services. Call +91 9034819324 or email info@protacc.in. Office on Dhand Road, Kaithal.',
        keywords:
            'CA firm near me, chartered accountant in Kaithal Haryana, tax consultant in Kaithal, GST consultant in Kaithal, contact CA Kaithal',
        path: '/contact',
    },
    privacy: {
        title: 'Privacy Policy | ProtAcc',
        description: 'Learn how ProtAcc collects, uses, and protects your personal and business information.',
        path: '/privacy-policy',
        noindex: false,
    },
    terms: {
        title: 'Terms of Service | ProtAcc',
        description: 'Terms governing your use of the ProtAcc website and professional services.',
        path: '/terms-of-service',
    },
    refund: {
        title: 'Refund Policy | ProtAcc',
        description: 'ProtAcc refund and cancellation policy for taxation, compliance, and consultancy services.',
        path: '/refund-policy',
    },
    search: {
        title: 'Search Services | ProtAcc',
        description: 'Search ProtAcc services for tax filing, GST, registration, and compliance.',
        path: '/search',
        noindex: true,
    },
};

export const getCanonicalUrl = (path = '/') => {
    const normalized = path.startsWith('/') ? path : `/${path}`;
    return `${SITE_URL}${normalized}`;
};

export default DEFAULT_SEO;
