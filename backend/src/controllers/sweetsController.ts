import { Request, Response } from 'express';
import db from '../db/database';

// Add Sweet
export const addSweet = (req: Request, res: Response) => {
    const { name, category, price, quantity } = req.body;
    if (!name || !category || !price || quantity === undefined) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    db.run(
        'INSERT INTO sweets (name, category, price, quantity) VALUES (?, ?, ?, ?)',
        [name, category, price, quantity],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ id: this.lastID, name, category, price, quantity });
        }
    );
};

// List Sweets
export const getAllSweets = (req: Request, res: Response) => {
    db.all('SELECT * FROM sweets', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(rows);
    });
};

// Search Sweets
export const searchSweets = (req: Request, res: Response) => {
    const { q } = req.query;
    if (!q) {
        return res.status(400).json({ error: 'Query parameter q is required' });
    }
    const query = `%${q}%`;
    db.all(
        'SELECT * FROM sweets WHERE name LIKE ? OR category LIKE ?',
        [query, query],
        (err, rows) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(200).json(rows);
        }
    );
};

// Update Sweet
export const updateSweet = (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, category, price, quantity } = req.body;

    db.run(
        'UPDATE sweets SET name = ?, category = ?, price = ?, quantity = ? WHERE id = ?',
        [name, category, price, quantity, id],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (this.changes === 0) {
                return res.status(404).json({ error: 'Sweet not found' });
            }
            res.status(200).json({ message: 'Sweet updated successfully' });
        }
    );
};

// Delete Sweet
export const deleteSweet = (req: Request, res: Response) => {
    const { id } = req.params;
    db.run('DELETE FROM sweets WHERE id = ?', [id], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Sweet not found' });
        }
        res.status(200).json({ message: 'Sweet deleted successfully' });
    });
};

// Purchase Sweet
export const purchaseSweet = (req: Request, res: Response) => {
    const { id } = req.params;

    // Transaction-like logic (SQLite serialize ensures sequential execution)
    db.serialize(() => {
        db.get('SELECT quantity FROM sweets WHERE id = ?', [id], (err, row: any) => {
            if (err) return res.status(500).json({ error: err.message });
            if (!row) return res.status(404).json({ error: 'Sweet not found' });
            if (row.quantity <= 0) return res.status(400).json({ error: 'Out of stock' });

            db.run('UPDATE sweets SET quantity = quantity - 1 WHERE id = ?', [id], function (err) {
                if (err) return res.status(500).json({ error: err.message });
                res.status(200).json({ message: 'Purchase successful' });
            });
        });
    });
};

// Restock Sweet
export const restockSweet = (req: Request, res: Response) => {
    const { id } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
        return res.status(400).json({ error: 'Valid quantity required' });
    }

    db.run('UPDATE sweets SET quantity = quantity + ? WHERE id = ?', [quantity, id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: 'Sweet not found' });
        res.status(200).json({ message: 'Restock successful' });
    });
};

// Batch Checkout (Cart)
export const checkoutCart = (req: Request, res: Response) => {
    const { items } = req.body; // items: [{ sweetId, quantity }]

    if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: 'Cart items required' });
    }

    // Validate all items exist and have sufficient stock
    const sweetIds = items.map((item: any) => item.sweetId);
    const placeholders = sweetIds.map(() => '?').join(',');

    db.all(`SELECT * FROM sweets WHERE id IN (${placeholders})`, sweetIds, (err, sweets: any[]) => {
        if (err) return res.status(500).json({ error: err.message });

        // Check if all items exist
        if (sweets.length !== items.length) {
            return res.status(404).json({ error: 'Some items not found' });
        }

        // Check stock availability
        for (const item of items) {
            const sweet = sweets.find((s: any) => s.id === item.sweetId);
            if (!sweet || sweet.quantity < item.quantity) {
                return res.status(400).json({
                    error: `Insufficient stock for ${sweet?.name || 'item'}`
                });
            }
        }

        // Process all purchases (decrease stock)
        let completed = 0;
        let hasError = false;

        items.forEach((item: any) => {
            db.run(
                'UPDATE sweets SET quantity = quantity - ? WHERE id = ?',
                [item.quantity, item.sweetId],
                function (err) {
                    if (err && !hasError) {
                        hasError = true;
                        return res.status(500).json({ error: 'Checkout failed' });
                    }
                    completed++;
                    if (completed === items.length && !hasError) {
                        res.status(200).json({ message: 'Checkout successful' });
                    }
                }
            );
        });
    });
};

