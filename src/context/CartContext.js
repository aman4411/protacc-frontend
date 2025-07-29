import React, { createContext, useContext, useState, useEffect } from 'react';
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

    // Fetch cart items
    const fetchCartItems = async () => {
        if (!isAuthenticated) {
            setCartItems([]);
            setCartCount(0);
            setLoading(false);
            return;
        }

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
        // Don't add to local state - let refetch handle it for consistency
        fetchCartItems();
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

    // Refresh cart data
    const refreshCart = () => {
        fetchCartItems();
    };

    useEffect(() => {
        fetchCartItems();
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