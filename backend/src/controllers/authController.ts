import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../db/database';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

export const register = (req: Request, res: Response) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    const hashedPassword = bcrypt.hashSync(password, 8);

    db.run(
        'INSERT INTO users (username, password) VALUES (?, ?)',
        [username, hashedPassword],
        function (err) {
            if (err) {
                if (err.message.includes('UNIQUE constraint failed')) {
                    return res.status(409).json({ error: 'Username already exists' });
                }
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ id: this.lastID, username });
        }
    );
};

export const login = (req: Request, res: Response) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    db.get('SELECT * FROM users WHERE username = ?', [username], (err, row: any) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!row) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const passwordIsValid = bcrypt.compareSync(password, row.password);
        if (!passwordIsValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: row.id, role: row.role }, JWT_SECRET, {
            expiresIn: 86400 // 24 hours
        });

        res.status(200).json({
            id: row.id,
            username: row.username,
            role: row.role,
            token
        });
    });
};
