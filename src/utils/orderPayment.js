/**
 * Order is considered fully paid when final payment is recorded or the order is completed.
 */
export const isOrderFullyPaid = (order) => {
    if (!order) return false;
    if (order.remaining_amount === 0 || order.remaining_amount === '0') {
        return true;
    }
    return ['full_payment_received', 'completed'].includes(order.status);
};

export const isOrderPendingBookingPayment = (order) => {
    return order?.status === 'pending_booking_payment';
};
