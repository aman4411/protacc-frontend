import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { getCartItems } from '../services/api';
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
    const [cartCount, setCartCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const { isAuthenticated } = useAuth();
    const fetchingRef = useRef(false); // Prevent concurrent API calls
    const lastFetchTimeRef = useRef(0); // Track last fetch time for debouncing

    // Fetch cart items with debouncing
    const fetchCartItems = async (force = false) => {
        if (!isAuthenticated) {
            setCartItems([]);
            setCartCount(0);
            setLoading(false);
            return;
        }

        // Prevent concurrent API calls
        if (fetchingRef.current) {
            return;
        }

        // Debounce: Don't fetch if we fetched recently (unless forced)
        const now = Date.now();
        if (!force && (now - lastFetchTimeRef.current) < 1000) { // 1 second debounce
            return;
        }

        fetchingRef.current = true;
        lastFetchTimeRef.current = now;
        
        try {
            const items = await getCartItems();
            setCartItems(items || []);
            setCartCount(items ? items.length : 0);
        } catch (error) {
            console.error('Failed to fetch cart items:', error);
            // Don't clear existing items on error, just log it
            if (cartItems.length === 0) {
                setCartItems([]);
                setCartCount(0);
            }
        } finally {
            setLoading(false);
            fetchingRef.current = false;
        }
    };

    // Check if a service is in cart
    const isInCart = (serviceId) => {
        return cartItems.some(item => 
            item.service_id === serviceId || 
            item.service?.id === serviceId ||
            (item.service && item.service.id === serviceId)
        );
    };

    // Add item to cart state
    const addToCartState = (serviceId, serviceData = null) => {
        // Optimistically update local state
        setCartCount(prevCount => prevCount + 1);
        
        // Add a placeholder item to cartItems so isInCart works immediately
        setCartItems(prevItems => {
            // Check if item already exists
            const exists = prevItems.some(item => 
                item.service_id === serviceId || 
                item.service?.id === serviceId ||
                (item.service && item.service.id === serviceId)
            );
            
            if (!exists) {
                // Create placeholder item with available service data
                const placeholderItem = {
                    id: `temp-${serviceId}-${Date.now()}`, // Temporary ID
                    service_id: serviceId,
                    quantity: 1,
                    isPlaceholder: true, // Mark as placeholder for identification
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
            }
            return prevItems;
        });
    };

    // Remove item from cart state  
    const removeFromCartState = (serviceId) => {
        setCartItems(prevItems => 
            prevItems.filter(item => 
                item.service_id !== serviceId && 
                item.service?.id !== serviceId
            )
        );
        setCartCount(prevCount => Math.max(0, prevCount - 1));
    };

    // Refresh cart data (only when explicitly needed)
    const refreshCart = useCallback(() => {
        fetchCartItems(true); // Force refresh
    }, []);

    // Smart add to cart - optimistic update with delayed refresh
    const addToCartSmart = (serviceId, serviceData = null) => {
        // Update optimistically with service data if available
        addToCartState(serviceId, serviceData);
        
        // Schedule a refresh after a short delay to get real data
        // This ensures the cart page has proper data when user navigates to it
        setTimeout(() => {
            fetchCartItems(true);
        }, 500); // 500ms delay to allow API call to complete
    };

    useEffect(() => {
        // Only fetch if user is actually authenticated, not on initial undefined->false transition
        if (isAuthenticated === true) {
            fetchCartItems();
        } else if (isAuthenticated === false) {
            // Clear cart data when user logs out
            setCartItems([]);
            setCartCount(0);
            setLoading(false);
        }
    }, [isAuthenticated]);

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