/**
 * Service price-type options. Value is stored on the service; label is shown in admin.
 * On the public site: 'onwards' / 'monthly' add an inline qualifier next to the price,
 * 'govt_charges_extra' shows a small note, and 'fixed' shows nothing extra.
 */
export const PRICE_TYPE_OPTIONS = [
    { value: 'fixed', label: 'Fixed' },
    { value: 'onwards', label: 'Onwards' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'govt_charges_extra', label: 'Govt Charges Extra' },
];

// Short qualifier rendered right after the price (e.g. "₹999 onwards"). '' when none.
export const priceInlineSuffix = (priceType) => {
    switch (priceType) {
        case 'onwards':
            return 'onwards';
        case 'monthly':
            return '/month';
        default:
            return '';
    }
};

// A separate small note shown near the price. '' when none.
export const priceNote = (priceType) => (priceType === 'govt_charges_extra' ? 'Govt charges extra' : '');
