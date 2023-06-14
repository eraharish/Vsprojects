const db = require('./db');

// Create the users table
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE
  )
`, (err) => {
  if (err) {
    console.error(err.message);
    throw err;
  }
  console.log('Users table created.');
});

// Close the database connection
db.close();
