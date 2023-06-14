const sqlite3 = require('sqlite3').verbose();

// Connect to the database

const db = new sqlite3.Database('database.db', (err) => {
  if (err) {
    console.error(err.message);
    throw err;
  }
  console.log('Connected to the SQLite database.');
});

module.exports = db;
