import { useEffect } from 'react';

const CLARITY_ID = process.env.REACT_APP_CLARITY_ID;

/**
 * Loads Microsoft Clarity (free heatmaps + session recordings) when
 * REACT_APP_CLARITY_ID is set. Skipped during react-snap prerender.
 */
const MicrosoftClarity = () => {
    useEffect(() => {
        if (!CLARITY_ID || typeof window === 'undefined') return;
        if (navigator.userAgent === 'ReactSnap') return;
        if (window.clarity) return;

        (function (c, l, a, r, i, t, y) {
            c[a] = c[a] || function () {
                (c[a].q = c[a].q || []).push(arguments);
            };
            t = l.createElement(r);
            t.async = 1;
            t.src = 'https://www.clarity.ms/tag/' + i;
            y = l.getElementsByTagName(r)[0];
            y.parentNode.insertBefore(t, y);
        })(window, document, 'clarity', 'script', CLARITY_ID);
    }, []);

    return null;
};

export default MicrosoftClarity;
