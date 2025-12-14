const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'sweetshop.db');
const db = new sqlite3.Database(dbPath);

const sampleSweets = [
    { name: 'Chocolate Truffle', category: 'Chocolate', price: 2.99, quantity: 50 },
    { name: 'Strawberry Lollipop', category: 'Lollipop', price: 0.99, quantity: 100 },
    { name: 'Vanilla Fudge', category: 'Fudge', price: 3.49, quantity: 30 },
    { name: 'Caramel Candy', category: 'Candy', price: 1.49, quantity: 75 },
    { name: 'Mint Chocolate Bar', category: 'Chocolate', price: 2.49, quantity: 8 },
    { name: 'Gummy Bears', category: 'Gummy', price: 1.99, quantity: 120 },
    { name: 'Sour Patch Kids', category: 'Gummy', price: 2.29, quantity: 5 },
    { name: 'Peanut Butter Cup', category: 'Chocolate', price: 1.79, quantity: 60 },
    { name: 'Rainbow Lollipop', category: 'Lollipop', price: 1.29, quantity: 90 },
    { name: 'Cotton Candy', category: 'Candy', price: 3.99, quantity: 40 }
];

db.serialize(() => {
    // Clear existing sweets (optional - comment out if you want to keep existing data)
    db.run("DELETE FROM sweets", [], function (err) {
        if (err) {
            console.error('Error clearing sweets:', err.message);
            return;
        }
        console.log(`Cleared ${this.changes} existing sweets`);

        // Insert sample sweets
        const stmt = db.prepare("INSERT INTO sweets (name, category, price, quantity) VALUES (?, ?, ?, ?)");

        let insertedCount = 0;
        sampleSweets.forEach((sweet, index) => {
            stmt.run([sweet.name, sweet.category, sweet.price, sweet.quantity], function (err) {
                if (err) {
                    console.error(`Error inserting ${sweet.name}:`, err.message);
                } else {
                    insertedCount++;
                    console.log(`✅ Added: ${sweet.name} - $${sweet.price} (${sweet.quantity} in stock)`);
                }

                // Close database after last insert
                if (index === sampleSweets.length - 1) {
                    stmt.finalize();
                    console.log(`\n🎉 Successfully added ${insertedCount} sweets to the database!`);
                    db.close();
                }
            });
        });
    });
});
