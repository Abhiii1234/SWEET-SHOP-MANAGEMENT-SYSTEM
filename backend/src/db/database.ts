import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';
import bcrypt from 'bcryptjs';

// Vercel Serverless environment check
const isVercel = process.env.VERCEL === '1';

// Use /tmp for write access on Vercel, otherwise local path
const dbPath = isVercel
    ? path.join('/tmp', 'sweetshop.db')
    : path.resolve(__dirname, '../../sweetshop.db');

console.log(`Using database at: ${dbPath}`);

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        initDb();
    }
});

const initDb = () => {
    db.serialize(() => {
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role TEXT DEFAULT 'user'
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS sweets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            category TEXT NOT NULL,
            price REAL NOT NULL,
            quantity INTEGER NOT NULL
        )`, (err) => {
            if (!err) {
                seedData(); // Seed data after table creation
            }
        });
    });
};

const seedData = () => {
    // Check if admin exists
    db.get("SELECT id FROM users WHERE username = 'admin'", (err, row) => {
        if (!row) {
            console.log('Seeding Admin User...');
            const hash = bcrypt.hashSync('admin123', 10);
            db.run("INSERT INTO users (username, password, role) VALUES (?, ?, ?)", ['admin', hash, 'admin']);
        }
    });

    // Check if sweets exist
    db.get("SELECT count(*) as count FROM sweets", (err, row: any) => {
        if (row && row.count === 0) {
            console.log('Seeding Sweets...');
            const sweets = [
                { name: 'Chocolate Truffle', category: 'Chocolate', price: 2.99, quantity: 50 },
                { name: 'Strawberry Lollipop', category: 'Candy', price: 0.99, quantity: 100 },
                { name: 'Vanilla Fudge', category: 'Fudge', price: 3.49, quantity: 30 },
                { name: 'Caramel Candy', category: 'Candy', price: 1.49, quantity: 75 },
                { name: 'Mint Chocolate Bar', category: 'Chocolate', price: 2.49, quantity: 8 },
                { name: 'Gummy Bears', category: 'Gummy', price: 1.99, quantity: 120 },
                { name: 'Sour Patch Kids', category: 'Gummy', price: 2.29, quantity: 5 },
                { name: 'Peanut Butter Cup', category: 'Chocolate', price: 1.79, quantity: 60 },
                { name: 'Rainbow Lollipop', category: 'Candy', price: 1.29, quantity: 90 },
                { name: 'Cotton Candy', category: 'Candy', price: 3.99, quantity: 40 }
            ];

            const stmt = db.prepare("INSERT INTO sweets (name, category, price, quantity) VALUES (?, ?, ?, ?)");
            sweets.forEach(sweet => {
                stmt.run(sweet.name, sweet.category, sweet.price, sweet.quantity);
            });
            stmt.finalize();
        }
    });
};

export default db;
