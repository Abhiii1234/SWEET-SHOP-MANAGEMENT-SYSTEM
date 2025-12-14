import request from 'supertest';
// import express from 'express'; // Unused
// We need to import app from a file that exports it, OR mock it.
// Re-using strict implementation from ../src/app might be better for integration test.
// But for unit test isolation, we often mock. Given the project scale, integration test against real DB/App is fine.
import { app } from '../src/app';
import db from '../src/db/database';
import * as jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

describe('Sweets API', () => {
    let adminToken: string;
    let userToken: string;
    let sweetId: number;

    beforeAll((done) => {
        // Wait for DB to init tables
        setTimeout(() => {
            adminToken = jwt.sign({ id: 1, role: 'admin' }, JWT_SECRET);
            userToken = jwt.sign({ id: 2, role: 'user' }, JWT_SECRET);
            // Clean sweets
            db.run('DELETE FROM sweets', [], () => done());
        }, 1000);
    });

    it('should allow admin to add a sweet', async () => {
        const res = await request(app)
            .post('/api/sweets')
            .set('x-access-token', adminToken)
            .send({
                name: 'Chocolate Bar',
                category: 'Chocolate',
                price: 2.5,
                quantity: 10
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('id');
        sweetId = res.body.id;
    });

    it('should block user from adding a sweet', async () => {
        const res = await request(app)
            .post('/api/sweets')
            .set('x-access-token', userToken)
            .send({ name: 'Candy', category: 'Hard', price: 1, quantity: 10 });
        expect(res.statusCode).toEqual(403);
    });

    it('should list sweets for user', async () => {
        const res = await request(app)
            .get('/api/sweets')
            .set('x-access-token', userToken);
        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toBeGreaterThan(0);
    });

    it('should search sweets', async () => {
        const res = await request(app)
            .get('/api/sweets/search?q=Choco')
            .set('x-access-token', userToken);
        expect(res.statusCode).toEqual(200);
        expect(res.body[0].name).toEqual('Chocolate Bar');
    });

    it('should update sweet (Admin)', async () => {
        const res = await request(app)
            .put(`/api/sweets/${sweetId}`)
            .set('x-access-token', adminToken)
            .send({
                name: 'Dark Chocolate Bar',
                category: 'Chocolate',
                price: 3.0,
                quantity: 15
            });
        expect(res.statusCode).toEqual(200);
    });

    it('should purchase sweet (User)', async () => {
        const res = await request(app)
            .post(`/api/sweets/${sweetId}/purchase`)
            .set('x-access-token', userToken);
        expect(res.statusCode).toEqual(200);
    });

    it('should fail purchase if out of stock', async () => {
        // Manually set stock to 0
        await new Promise<void>((resolve) => {
            db.run('UPDATE sweets SET quantity = 0 WHERE id = ?', [sweetId], () => resolve());
        });

        const res = await request(app)
            .post(`/api/sweets/${sweetId}/purchase`)
            .set('x-access-token', userToken);
        expect(res.statusCode).toEqual(400);
    });

    it('should restock sweet (Admin)', async () => {
        const res = await request(app)
            .post(`/api/sweets/${sweetId}/restock`)
            .set('x-access-token', adminToken)
            .send({ quantity: 10 });
        expect(res.statusCode).toEqual(200);
    });

    it('should delete sweet (Admin)', async () => {
        const res = await request(app)
            .delete(`/api/sweets/${sweetId}`)
            .set('x-access-token', adminToken);
        expect(res.statusCode).toEqual(200);
    });
});
