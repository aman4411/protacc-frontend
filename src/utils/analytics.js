/**
 * Thin wrapper around gtag for GA4 conversion events. Safe no-op when GA isn't
 * loaded (no measurement ID set, or during react-snap prerender).
 */
export const trackEvent = (name, params = {}) => {
    if (typeof window === 'undefined') return;
    if (navigator.userAgent === 'ReactSnap') return;
    if (typeof window.gtag !== 'function') return;
    window.gtag('event', name, params);
};

// Convenience wrappers for the events we care about (GA4 recommended event names).
export const trackLead = (source) => trackEvent('generate_lead', { source });
export const trackAddToCart = (service) =>
    trackEvent('add_to_cart', {
        currency: 'INR',
        value: Number(service?.price) || 0,
        items: [{ item_id: service?.id, item_name: service?.name }],
    });
export const trackPurchase = (orderNumber, valueInr) =>
    trackEvent('purchase', {
        transaction_id: orderNumber,
        currency: 'INR',
        value: Number(valueInr) || 0,
    });
