import React, { createContext, useContext, useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { getCartItems } from '../services/api';
import { trackAddToCart } from '../utils/analytics';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const { isAuthenticated, token } = useAuth();
    const fetchingRef = useRef(false);
    const pendingRefreshRef = useRef(false);
    const lastFetchTimeRef = useRef(0);
    const fetchIdRef = useRef(0);
    const authRef = useRef({ isAuthenticated, token });

    authRef.current = { isAuthenticated, token };

    const fetchCartItems = useCallback(async (force = false) => {
        const { isAuthenticated: authed, token: tok } = authRef.current;
        if (!authed || !tok) {
            setCartItems([]);
            setLoading(false);
            return;
        }

        if (fetchingRef.current) {
            if (force) {
                pendingRefreshRef.current = true;
            }
            return;
        }

        const now = Date.now();
        if (!force && (now - lastFetchTimeRef.current) < 1000) {
            return;
        }

        const fetchId = ++fetchIdRef.current;
        fetchingRef.current = true;
        lastFetchTimeRef.current = now;
        setLoading(true);

        try {
            const items = await getCartItems();
            if (fetchId !== fetchIdRef.current) {
                return;
            }
            const normalized = Array.isArray(items) ? items : [];
            setCartItems(normalized);
        } catch (error) {
            console.error('Failed to fetch cart items:', error);
        } finally {
            if (fetchId === fetchIdRef.current) {
                setLoading(false);
                fetchingRef.current = false;
                if (pendingRefreshRef.current) {
                    pendingRefreshRef.current = false;
                    fetchCartItems(true);
                }
            }
        }
    }, []);

    const cartCount = useMemo(() => cartItems.length, [cartItems]);

    const isInCart = (serviceId) => {
        return cartItems.some(item =>
            item.service_id === serviceId ||
            item.service?.id === serviceId ||
            (item.service && item.service.id === serviceId)
        );
    };

    const addToCartState = (serviceId, serviceData = null) => {
        setCartItems(prevItems => {
            const exists = prevItems.some(item =>
                item.service_id === serviceId ||
                item.service?.id === serviceId ||
                (item.service && item.service.id === serviceId)
            );

            if (exists) {
                return prevItems;
            }

            const placeholderItem = {
                id: `temp-${serviceId}-${Date.now()}`,
                service_id: serviceId,
                quantity: 1,
                isPlaceholder: true,
                service: serviceData ? {
                    id: serviceId,
                    name: serviceData.name || 'Loading...',
                    price: serviceData.price || 0,
                    booking_amount: serviceData.booking_amount || 0,
                    category: serviceData.category || null,
                    ...serviceData
                } : {
                    id: serviceId,
                    name: 'Loading...',
                    price: 0,
                    booking_amount: 0
                }
            };
            return [...prevItems, placeholderItem];
        });
    };

    const removeFromCartState = (serviceId) => {
        setCartItems(prevItems =>
            prevItems.filter(item =>
                item.service_id !== serviceId &&
                item.service?.id !== serviceId
            )
        );
    };

    const refreshCart = useCallback(() => {
        fetchCartItems(true);
    }, [fetchCartItems]);

    const addToCartSmart = async (serviceId, serviceData = null) => {
        addToCartState(serviceId, serviceData);
        trackAddToCart(serviceData || { id: serviceId });
        await fetchCartItems(true);
    };

    useEffect(() => {
        if (isAuthenticated && token) {
            fetchCartItems(true);
        } else if (!isAuthenticated) {
            setCartItems([]);
            setLoading(false);
        }
    }, [isAuthenticated, token, fetchCartItems]);

    const value = {
        cartItems,
        cartCount,
        loading,
        isInCart,
        addToCartState,
        removeFromCartState,
        refreshCart,
        fetchCartItems,
        addToCartSmart
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};
