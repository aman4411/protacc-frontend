/**
 * Formats a service delivery estimate as a working-days range.
 * Returns '' when neither bound is set (callers should guard visibility on that).
 *   (3, 5) -> "3–5 working days"
 *   (0, 5) -> "5 working days"
 *   (4, 4) -> "4 working days"
 */
export const formatDeliveryDays = (min, max) => {
    const a = Number(min) || 0;
    const b = Number(max) || 0;
    const lo = Math.min(a || b, b || a);
    const hi = Math.max(a, b);
    if (!hi) return '';
    if (!lo || lo === hi) return `${hi} working days`;
    return `${lo}–${hi} working days`;
};

// True when a service has any delivery estimate to show.
export const hasDeliveryEstimate = (service) =>
    Boolean(service && ((service.min_delivery_days || 0) > 0 || (service.max_delivery_days || 0) > 0));
