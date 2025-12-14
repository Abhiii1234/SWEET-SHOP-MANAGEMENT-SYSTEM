import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers['x-access-token'] as string;

    if (!token) {
        return res.status(403).json({ error: 'No token provided' });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded: any) => {
        if (err) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        (req as any).user = decoded;
        next();
    });
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (user && user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ error: 'Require Admin Role' });
    }
};
