import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const MEASUREMENT_ID = process.env.REACT_APP_GA_MEASUREMENT_ID;

/**
 * Loads Google Analytics 4 when REACT_APP_GA_MEASUREMENT_ID is set.
 * Tracks page views on SPA route changes.
 */
const GoogleAnalytics = () => {
    const location = useLocation();

    useEffect(() => {
        if (!MEASUREMENT_ID || typeof window === 'undefined') return;

        if (!window.gtag) {
            const script = document.createElement('script');
            script.async = true;
            script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
            document.head.appendChild(script);

            window.dataLayer = window.dataLayer || [];
            window.gtag = function gtag() {
                window.dataLayer.push(arguments);
            };
            window.gtag('js', new Date());
            window.gtag('config', MEASUREMENT_ID, { send_page_view: false });
        }
    }, []);

    useEffect(() => {
        if (!MEASUREMENT_ID || !window.gtag) return;
        window.gtag('event', 'page_view', {
            page_path: location.pathname + location.search,
            page_title: document.title,
        });
    }, [location]);

    return null;
};

export default GoogleAnalytics;
