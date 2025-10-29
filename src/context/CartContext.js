import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
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

    // Fetch cart items
    const fetchCartItems = async () => {
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

        fetchingRef.current = true;
        
        try {
            const items = await getCartItems();
            setCartItems(items || []);
            setCartCount(items ? items.length : 0);
        } catch (error) {
            console.error('Failed to fetch cart items:', error);
            setCartItems([]);
            setCartCount(0);
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
    const addToCartState = (serviceId) => {
        // Optimistically update local state instead of refetching
        setCartCount(prevCount => prevCount + 1);
        // The actual cart items will be updated when the page refreshes or user navigates to cart
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
    const refreshCart = () => {
        fetchCartItems();
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
        fetchCartItems
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
}; 