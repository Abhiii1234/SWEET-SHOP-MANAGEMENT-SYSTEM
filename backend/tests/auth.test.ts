import request from 'supertest';
import { app } from '../src/app';
import db from '../src/db/database';

describe('Auth API', () => {
    beforeAll((done) => {
        // Wait for DB connection
        setTimeout(() => done(), 1000);
    });

    afterAll((done) => {
        db.run('DELETE FROM users', () => {
            db.close(() => done());
        });
    });

    describe('POST /api/auth/register', () => {
        it('should register a new user', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    username: 'testuser',
                    password: 'password123'
                });
            expect(res.statusCode).toEqual(201);
            expect(res.body).toHaveProperty('id');
            expect(res.body).toHaveProperty('username', 'testuser');
            expect(res.body).not.toHaveProperty('password');
        });

        it('should not register a user with an existing username', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    username: 'testuser', // Already exists from previous test
                    password: 'newpassword'
                });
            expect(res.statusCode).toEqual(409);
        });

        it('should fail if fields are missing', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    username: 'incomplete'
                });
            expect(res.statusCode).toEqual(400);
        });
    });

    describe('POST /api/auth/login', () => {
        beforeAll(async () => {
            await request(app)
                .post('/api/auth/register')
                .send({
                    username: 'loginuser',
                    password: 'password123'
                });
        });

        it('should login successfully with correct credentials', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    username: 'loginuser',
                    password: 'password123'
                });
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('token');
            expect(res.body).toHaveProperty('username', 'loginuser');
        });

        it('should fail with incorrect password', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    username: 'loginuser',
                    password: 'wrongpassword'
                });
            expect(res.statusCode).toEqual(401);
            expect(res.body).toHaveProperty('error', 'Invalid credentials');
        });

        it('should fail with non-existent user', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    username: 'nonexistent',
                    password: 'password123'
                });
            expect(res.statusCode).toEqual(401);
            expect(res.body).toHaveProperty('error', 'Invalid credentials');
        });
    });
});
