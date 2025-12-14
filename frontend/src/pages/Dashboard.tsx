import React, { useEffect, useState } from 'react';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ToastContainer, type ToastMessage } from '../components/Toast';
import CartModal from '../components/CartModal';

interface Sweet {
    id: number;
    name: string;
    category: string;
    price: number;
    quantity: number;
}

const Dashboard = () => {
    const { user } = useAuth();
    const { addToCart, cart, clearCart, getTotalItems } = useCart();
    const [sweets, setSweets] = useState<Sweet[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [showCartModal, setShowCartModal] = useState(false);

    // Toast State
    const [toasts, setToasts] = useState<ToastMessage[]>([]);
    const addToast = (message: string, type: 'success' | 'error') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
    };
    const removeToast = (id: number) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    // Admin Forms State
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [newSweet, setNewSweet] = useState({ name: '', category: '', price: 0, quantity: 0 });
    const [editingSweet, setEditingSweet] = useState<Sweet | null>(null);

    const fetchSweets = async (query = '') => {
        setLoading(true);
        try {
            const endpoint = query ? `/sweets/search?q=${query}` : '/sweets';
            const res = await client.get(endpoint);
            setSweets(res.data);
        } catch (err) {
            console.error(err);
            addToast('Failed to fetch sweets', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSweets();
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchSweets(search);
    };

    const handleAddToCart = (sweet: Sweet) => {
        addToCart({
            sweetId: sweet.id,
            name: sweet.name,
            price: sweet.price,
            maxStock: sweet.quantity
        });
        addToast(`${sweet.name} added to cart!`, 'success');
    };

    const handleCheckout = async () => {
        if (cart.length === 0) {
            addToast('Cart is empty', 'error');
            return;
        }
        try {
            const items = cart.map(item => ({ sweetId: item.sweetId, quantity: item.quantity }));
            await client.post('/sweets/checkout', { items });
            clearCart();
            setShowCartModal(false);
            await fetchSweets(search);
            addToast('Checkout successful!', 'success');
        } catch (err: any) {
            addToast(err.response?.data?.error || 'Checkout failed', 'error');
        }
    };

    const handleAddSweet = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await client.post('/sweets', newSweet);
            setShowAddModal(false);
            setNewSweet({ name: '', category: '', price: 0, quantity: 0 });
            await fetchSweets(search);
            addToast('Sweet added successfully', 'success');
        } catch (err: any) {
            addToast(err.response?.data?.error || 'Failed to add sweet', 'error');
        }
    };

    const handleEditClick = (sweet: Sweet) => {
        setEditingSweet(sweet);
        setShowEditModal(true);
    };

    const handleUpdateSweet = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingSweet) return;
        try {
            await client.put(`/sweets/${editingSweet.id}`, editingSweet);
            setShowEditModal(false);
            setEditingSweet(null);
            await fetchSweets(search);
            addToast('Sweet updated successfully', 'success');
        } catch (err: any) {
            addToast(err.response?.data?.error || 'Failed to update sweet', 'error');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this sweet?')) return;
        try {
            await client.delete(`/sweets/${id}`);
            await fetchSweets(search);
            addToast('Sweet deleted successfully', 'success');
        } catch (err: any) {
            addToast(err.response?.data?.error || 'Delete failed', 'error');
        }
    };

    const handleRestock = async (id: number) => {
        const qty = prompt('Enter quantity to add:');
        if (!qty) return;
        try {
            await client.post(`/sweets/${id}/restock`, { quantity: parseInt(qty) });
            await fetchSweets(search);
            addToast('Restock successful', 'success');
        } catch (err: any) {
            addToast(err.response?.data?.error || 'Restock failed', 'error');
        }
    };

    // Calculate Stats
    const totalSweets = sweets.length;
    const totalValue = sweets.reduce((acc, s) => acc + (s.price * s.quantity), 0);
    const lowStockCount = sweets.filter(s => s.quantity < 10).length;

    return (
        <div className="container" style={{ paddingTop: '100px', paddingBottom: '50px' }}>
            <ToastContainer toasts={toasts} removeToast={removeToast} />

            <div className="flex justify-between items-center" style={{ marginBottom: '2rem' }}>
                <h1 className="text-secondary">Dashboard</h1>
                <div className="flex items-center gap-md">
                    <button
                        onClick={() => setShowCartModal(true)}
                        style={{
                            background: 'transparent',
                            border: '1px solid rgba(255,255,255,0.2)',
                            borderRadius: 'var(--radius-md)',
                            padding: '0.75rem 1.5rem',
                            color: 'var(--text-main)',
                            cursor: 'pointer',
                            position: 'relative',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            fontSize: '1rem',
                            fontWeight: 600
                        }}
                    >
                        🛒 Cart ({getTotalItems()})
                    </button>
                    {user?.role === 'admin' && (
                        <button onClick={() => setShowAddModal(true)} className="btn btn-primary">
                            + Add Sweet
                        </button>
                    )}
                </div>
            </div>

            {/* Admin Stats Dashboard */}
            {user?.role === 'admin' && (
                <div className="stats-grid animate-fade-in">
                    <div className="stat-card">
                        <div className="stat-label">Total Products</div>
                        <div className="stat-value">{totalSweets}</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-label">Total Inventory Value</div>
                        <div className="stat-value">${totalValue.toLocaleString()}</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-label">Low Stock Alerts</div>
                        <div className="stat-value" style={{
                            color: lowStockCount > 0 ? 'var(--error)' : 'inherit',
                            WebkitTextFillColor: lowStockCount > 0 ? 'var(--error)' : 'transparent'
                        }}>
                            {lowStockCount}
                        </div>
                    </div>
                </div>
            )}

            <form onSubmit={handleSearch} className="flex gap-sm" style={{ marginBottom: '2rem' }}>
                <input
                    type="text"
                    className="input-field"
                    placeholder="Search sweets..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ maxWidth: '300px' }}
                />
                <button type="submit" className="btn btn-secondary">Search</button>
                {search && <button type="button" className="btn btn-secondary" onClick={() => { setSearch(''); fetchSweets(); }}>Clear</button>}
            </form>

            {loading ? (
                <div className="text-center" style={{ padding: '4rem', color: 'var(--text-muted)' }}>
                    <div className="animate-pulse">Loading sweets...</div>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                    {sweets.map(sweet => (
                        <div key={sweet.id} className="card animate-fade-in flex flex-col justify-between"
                            style={{
                                borderColor: sweet.quantity < 10 ? 'rgba(239, 68, 68, 0.3)' : 'rgba(255, 255, 255, 0.1)'
                            }}>
                            <div>
                                <h3 className="text-primary">{sweet.name}</h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{sweet.category}</p>
                                <div className="flex justify-between items-center" style={{ marginTop: '1rem' }}>
                                    <span style={{ fontSize: '1.25rem', fontWeight: 600 }}>${sweet.price}</span>
                                    <span style={{
                                        padding: '0.25rem 0.5rem',
                                        borderRadius: 'var(--radius-sm)',
                                        background: sweet.quantity > 0 ? (sweet.quantity < 10 ? 'rgba(245, 158, 11, 0.2)' : 'rgba(34, 197, 94, 0.2)') : 'rgba(239, 68, 68, 0.2)',
                                        color: sweet.quantity > 0 ? (sweet.quantity < 10 ? '#f59e0b' : 'var(--success)') : 'var(--error)',
                                        fontSize: '0.85rem'
                                    }}>
                                        {sweet.quantity > 0 ? `${sweet.quantity} in stock` : 'Out of Stock'}
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-sm" style={{ marginTop: '1.5rem' }}>
                                <button
                                    onClick={() => handleAddToCart(sweet)}
                                    disabled={sweet.quantity <= 0}
                                    className="btn btn-primary"
                                    style={{ width: '100%', opacity: sweet.quantity <= 0 ? 0.5 : 1 }}
                                >
                                    🛒 Add to Cart
                                </button>

                                {user?.role === 'admin' && (
                                    <div className="flex gap-sm">
                                        <button onClick={() => handleEditClick(sweet)} className="btn btn-secondary" style={{ flex: 1, fontSize: '0.8rem' }}>Edit</button>
                                        <button onClick={() => handleRestock(sweet.id)} className="btn btn-secondary" style={{ flex: 1, fontSize: '0.8rem' }}>Restock</button>
                                        <button onClick={() => handleDelete(sweet.id)} className="btn btn-secondary text-danger" style={{ flex: 1, fontSize: '0.8rem', borderColor: 'var(--error)' }}>Delete</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Cart Modal */}
            <CartModal
                isOpen={showCartModal}
                onClose={() => setShowCartModal(false)}
                onCheckout={handleCheckout}
            />

            {/* Add Sweet Modal (Simplified) */}
            {showAddModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100
                }}>
                    <div className="card animate-fade-in" style={{ width: '400px', maxWidth: '90%' }}>
                        <h2 className="text-center" style={{ marginBottom: '1.5rem' }}>Add New Sweet</h2>
                        <form onSubmit={handleAddSweet}>
                            <div className="input-group">
                                <label className="input-label">Name</label>
                                <input className="input-field" required value={newSweet.name} onChange={e => setNewSweet({ ...newSweet, name: e.target.value })} />
                            </div>
                            <div className="input-group">
                                <label className="input-label">Category</label>
                                <input className="input-field" required value={newSweet.category} onChange={e => setNewSweet({ ...newSweet, category: e.target.value })} />
                            </div>
                            <div className="flex gap-md">
                                <div className="input-group">
                                    <label className="input-label">Price</label>
                                    <input type="number" step="0.01" className="input-field" required value={newSweet.price} onChange={e => setNewSweet({ ...newSweet, price: parseFloat(e.target.value) })} />
                                </div>
                                <div className="input-group">
                                    <label className="input-label">Qty</label>
                                    <input type="number" className="input-field" required value={newSweet.quantity} onChange={e => setNewSweet({ ...newSweet, quantity: parseInt(e.target.value) })} />
                                </div>
                            </div>
                            <div className="flex gap-md" style={{ marginTop: '1rem' }}>
                                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowAddModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Sweet Modal */}
            {showEditModal && editingSweet && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100
                }}>
                    <div className="card animate-fade-in" style={{ width: '400px', maxWidth: '90%' }}>
                        <h2 className="text-center" style={{ marginBottom: '1.5rem' }}>Edit Sweet</h2>
                        <form onSubmit={handleUpdateSweet}>
                            <div className="input-group">
                                <label className="input-label">Name</label>
                                <input className="input-field" required value={editingSweet.name} onChange={e => setEditingSweet({ ...editingSweet, name: e.target.value })} />
                            </div>
                            <div className="input-group">
                                <label className="input-label">Category</label>
                                <input className="input-field" required value={editingSweet.category} onChange={e => setEditingSweet({ ...editingSweet, category: e.target.value })} />
                            </div>
                            <div className="flex gap-md">
                                <div className="input-group">
                                    <label className="input-label">Price</label>
                                    <input type="number" step="0.01" className="input-field" required value={editingSweet.price} onChange={e => setEditingSweet({ ...editingSweet, price: parseFloat(e.target.value) })} />
                                </div>
                                <div className="input-group">
                                    <label className="input-label">Qty</label>
                                    <input type="number" className="input-field" required value={editingSweet.quantity} onChange={e => setEditingSweet({ ...editingSweet, quantity: parseInt(e.target.value) })} />
                                </div>
                            </div>
                            <div className="flex gap-md" style={{ marginTop: '1rem' }}>
                                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowEditModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Update</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
