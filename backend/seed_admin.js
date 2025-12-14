const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

// Database is in backend/sweetshop.db
const dbPath = path.resolve(__dirname, 'sweetshop.db');
const db = new sqlite3.Database(dbPath);

const createAdmin = () => {
    const password = bcrypt.hashSync('admin123', 8);

    db.serialize(() => {
        // Ensure table exists (in case it runs before app init, though unlikely)
        // But app likely created it.

        db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='users'", (err, row) => {
            if (!row) {
                console.log('Tables not ready. Run the app first.');
                return;
            }

            db.run(`INSERT OR IGNORE INTO users (username, password, role) VALUES ('admin', ?, 'admin')`, [password], function (err) {
                if (err) {
                    console.error(err.message);
                } else {
                    if (this.changes > 0) {
                        console.log('Admin user created (admin/admin123)');
                    } else {
                        console.log('Admin user already exists. Updating role...');
                        db.run(`UPDATE users SET role = 'admin' WHERE username = 'admin'`, [], (err) => {
                            if (err) console.error(err);
                            else console.log('User "admin" role set to admin.');
                        });
                    }
                }
            });
        });
    });
};

createAdmin();
