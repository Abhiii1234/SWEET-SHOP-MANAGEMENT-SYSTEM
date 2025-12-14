const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');

const dbPath = path.resolve(__dirname, 'sweetshop.db');
const db = new sqlite3.Database(dbPath);

const passwordRaw = 'admin123';
const salt = bcrypt.genSaltSync(10);
const hash = bcrypt.hashSync(passwordRaw, salt);

db.serialize(() => {
    db.run("DELETE FROM users WHERE username = 'admin'", [], function (err) {
        if (err) return console.error(err.message);
        console.log(`Deleted admin (if existed). Changes: ${this.changes}`);

        db.run("INSERT INTO users (username, password, role) VALUES (?, ?, ?)", ['admin', hash, 'admin'], function (err) {
            if (err) return console.error(err.message);
            console.log(`Inserted admin with password 'admin123'. ID: ${this.lastID}`);
            db.close(); // Close inside callback
        });
    });
});
