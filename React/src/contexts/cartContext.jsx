import React, { createContext, useContext, useReducer } from 'react';

// Create the context
const CartContext = createContext();

// Custom hook to use the CartContext
export const useCart = () => useContext(CartContext);

// Reducer to manage cart state
const cartReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_TO_CART':
            // Check if item is already in cart
            const existingItem = state.find(item => item.id === action.payload.id);
            if (existingItem) {
                return state.map(item => 
                    item.id === action.payload.id 
                    ? { ...item, quantity: item.quantity + 1 } 
                    : item
                );
            }
            return [...state, { ...action.payload, quantity: 1 }];
        case 'REMOVE_FROM_CART':
            return state.filter(item => item.id !== action.payload.id);
        case 'UPDATE_QUANTITY':
            return state.map(item =>
                item.id === action.payload.id
                    ? { ...item, quantity: action.payload.quantity }
                    : item
            );
        case 'CLEAR_CART':
            return [];
        default:
            return state;
    }
};

// CartProvider component to wrap around components that need access to the cart
export const CartProvider = ({ children }) => {
    const [cart, dispatch] = useReducer(cartReducer, []);

    const addToCart = (product) => {
        dispatch({ type: 'ADD_TO_CART', payload: product });
    };

    const removeFromCart = (id) => {
        dispatch({ type: 'REMOVE_FROM_CART', payload: { id } });
    };

    const clearCart = () => {
        dispatch({ type: 'CLEAR_CART' });
    };

    const updateQuantity = (id, quantity) => {
        dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, updateQuantity }}>
            {children}
        </CartContext.Provider>
    );
};
