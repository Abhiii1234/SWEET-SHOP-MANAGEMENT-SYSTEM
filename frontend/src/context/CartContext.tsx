import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export interface CartItem {
    sweetId: number;
    name: string;
    price: number;
    quantity: number;
    maxStock: number;
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
    removeFromCart: (sweetId: number) => void;
    updateQuantity: (sweetId: number, quantity: number) => void;
    clearCart: () => void;
    getTotalItems: () => number;
    getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [cart, setCart] = useState<CartItem[]>(() => {
        const saved = localStorage.getItem('cart');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(i => i.sweetId === item.sweetId);
            if (existingItem) {
                return prevCart.map(i =>
                    i.sweetId === item.sweetId
                        ? { ...i, quantity: Math.min(i.quantity + (item.quantity || 1), i.maxStock) }
                        : i
                );
            }
            return [...prevCart, { ...item, quantity: item.quantity || 1 }];
        });
    };

    const removeFromCart = (sweetId: number) => {
        setCart(prevCart => prevCart.filter(item => item.sweetId !== sweetId));
    };

    const updateQuantity = (sweetId: number, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(sweetId);
            return;
        }
        setCart(prevCart =>
            prevCart.map(item =>
                item.sweetId === sweetId
                    ? { ...item, quantity: Math.min(quantity, item.maxStock) }
                    : item
            )
        );
    };

    const clearCart = () => {
        setCart([]);
    };

    const getTotalItems = () => {
        return cart.reduce((sum, item) => sum + item.quantity, 0);
    };

    const getTotalPrice = () => {
        return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    };

    return (
        <CartContext.Provider value={{
            cart,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            getTotalItems,
            getTotalPrice
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
