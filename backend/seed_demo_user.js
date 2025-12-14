const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.resolve(__dirname, 'sweetshop.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
    // Check if users table exists
    db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='users'", [], (err, row) => {
        if (err) {
            console.error('Error checking table:', err.message);
            db.close();
            return;
        }

        if (!row) {
            console.log('Users table does not exist yet. Run the server first to initialize the database.');
            db.close();
            return;
        }

        // Delete existing demo user if exists
        db.run("DELETE FROM users WHERE username = 'user'", [], function (err) {
            if (err) {
                console.error('Error deleting user:', err.message);
                return;
            }
            console.log(`Deleted demo user (if existed). Changes: ${this.changes}`);

            // Insert demo user with hashed password
            const hashedPassword = bcrypt.hashSync('user123', 10);
            db.run(
                "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
                ['user', hashedPassword, 'user'],
                function (err) {
                    if (err) {
                        console.error('Error inserting demo user:', err.message);
                    } else {
                        console.log(`✅ Inserted demo user with password 'user123'. ID: ${this.lastID}`);
                    }
                    db.close();
                }
            );
        });
    });
});
