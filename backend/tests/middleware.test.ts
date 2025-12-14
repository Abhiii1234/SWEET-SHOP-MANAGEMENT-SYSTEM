import request from 'supertest';
import express from 'express';
import jwt from 'jsonwebtoken';
import { verifyToken, isAdmin } from '../src/middleware/authMiddleware';

const app = express();
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

// Mock Protected Routes
app.get('/test/user', verifyToken, (req: express.Request, res: express.Response) => {
    res.status(200).json({ message: 'User content', user: req.user });
});

app.get('/test/admin', [verifyToken, isAdmin], (req: express.Request, res: express.Response) => {
    res.status(200).json({ message: 'Admin content' });
});

describe('Auth Middleware', () => {
    let userToken: string;
    let adminToken: string;

    beforeAll(() => {
        userToken = jwt.sign({ id: 1, role: 'user' }, JWT_SECRET);
        adminToken = jwt.sign({ id: 2, role: 'admin' }, JWT_SECRET);
    });

    it('should block requests without token', async () => {
        const res = await request(app).get('/test/user');
        expect(res.statusCode).toEqual(403);
    });

    it('should block requests with invalid token', async () => {
        const res = await request(app).get('/test/user').set('x-access-token', 'invalid_token');
        expect(res.statusCode).toEqual(401);
    });

    it('should allow requests with valid token', async () => {
        const res = await request(app).get('/test/user').set('x-access-token', userToken);
        expect(res.statusCode).toEqual(200);
        expect(res.body.user.role).toEqual('user');
    });

    it('should block non-admins from admin routes', async () => {
        const res = await request(app).get('/test/admin').set('x-access-token', userToken);
        expect(res.statusCode).toEqual(403);
    });

    it('should allow admins to admin routes', async () => {
        const res = await request(app).get('/test/admin').set('x-access-token', adminToken);
        expect(res.statusCode).toEqual(200);
    });
});
