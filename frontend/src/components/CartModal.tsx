import React from 'react';
import { useCart } from '../context/CartContext';

interface CartModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCheckout: () => void;
}

const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose, onCheckout }) => {
    const { cart, removeFromCart, updateQuantity, getTotalPrice, getTotalItems } = useCart();

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            justifyContent: 'flex-end',
            zIndex: 1000
        }} onClick={onClose}>
            <div
                className="card animate-fade-in"
                style={{
                    width: '450px',
                    maxWidth: '90%',
                    height: '100vh',
                    borderRadius: 0,
                    margin: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    overflowY: 'auto'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1.5rem',
                    paddingBottom: '1rem',
                    borderBottom: '1px solid rgba(255,255,255,0.1)'
                }}>
                    <h2 style={{ margin: 0 }}>Shopping Cart ({getTotalItems()})</h2>
                    <button
                        onClick={onClose}
                        className="btn btn-secondary"
                        style={{ padding: '0.5rem 1rem', fontSize: '1.2rem' }}
                    >
                        ✕
                    </button>
                </div>

                {cart.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '3rem 1rem',
                        color: 'var(--text-muted)'
                    }}>
                        <p style={{ fontSize: '3rem', margin: 0 }}>🛒</p>
                        <p style={{ marginTop: '1rem' }}>Your cart is empty</p>
                    </div>
                ) : (
                    <>
                        <div style={{ flex: 1, overflowY: 'auto', marginBottom: '1rem' }}>
                            {cart.map(item => (
                                <div
                                    key={item.sweetId}
                                    style={{
                                        background: 'rgba(255,255,255,0.03)',
                                        padding: '1rem',
                                        borderRadius: 'var(--radius-md)',
                                        marginBottom: '1rem',
                                        border: '1px solid rgba(255,255,255,0.05)'
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                        <h4 className="text-primary" style={{ margin: 0 }}>{item.name}</h4>
                                        <button
                                            onClick={() => removeFromCart(item.sweetId)}
                                            style={{
                                                background: 'transparent',
                                                border: 'none',
                                                color: 'var(--error)',
                                                cursor: 'pointer',
                                                fontSize: '1.2rem'
                                            }}
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: '1.1rem', fontWeight: 600 }}>${item.price.toFixed(2)}</span>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <button
                                                onClick={() => updateQuantity(item.sweetId, item.quantity - 1)}
                                                className="btn btn-secondary"
                                                style={{ padding: '0.25rem 0.75rem', fontSize: '1rem' }}
                                            >
                                                −
                                            </button>
                                            <span style={{
                                                minWidth: '40px',
                                                textAlign: 'center',
                                                fontSize: '1rem',
                                                fontWeight: 600
                                            }}>
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() => updateQuantity(item.sweetId, item.quantity + 1)}
                                                className="btn btn-secondary"
                                                style={{ padding: '0.25rem 0.75rem', fontSize: '1rem' }}
                                                disabled={item.quantity >= item.maxStock}
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                    <div style={{
                                        marginTop: '0.5rem',
                                        textAlign: 'right',
                                        color: 'var(--text-muted)',
                                        fontSize: '0.9rem'
                                    }}>
                                        Subtotal: ${(item.price * item.quantity).toFixed(2)}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div style={{
                            borderTop: '2px solid rgba(255,255,255,0.1)',
                            paddingTop: '1rem'
                        }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                marginBottom: '1rem',
                                fontSize: '1.3rem',
                                fontWeight: 700
                            }}>
                                <span>Total:</span>
                                <span className="text-primary">${getTotalPrice().toFixed(2)}</span>
                            </div>
                            <button
                                onClick={onCheckout}
                                className="btn btn-primary"
                                style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}
                            >
                                Proceed to Checkout
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default CartModal;
