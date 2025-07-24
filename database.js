const Database = require('better-sqlite3');
const path = require('path');

// Create database connection
const dbPath = path.join(__dirname, 'database.sqlite');
const db = new Database(dbPath);

// Create users table if it doesn't exist
const createUsersTable = `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    gender TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`;

// Execute table creation
db.exec(createUsersTable);

// Prepared statements for user operations
const statements = {
  createUser: db.prepare(`
    INSERT INTO users (username, email, password, gender) 
    VALUES (?, ?, ?, ?)
  `),
  
  getUserByUsername: db.prepare(`
    SELECT * FROM users WHERE username = ?
  `),
  
  getUserByEmail: db.prepare(`
    SELECT * FROM users WHERE email = ?
  `),
  
  getUserById: db.prepare(`
    SELECT * FROM users WHERE id = ?
  `),
  
  updateUser: db.prepare(`
    UPDATE users 
    SET username = ?, email = ?, gender = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `),
  
  deleteUser: db.prepare(`
    DELETE FROM users WHERE id = ?
  `)
};

// Database operations
const dbOperations = {
  createUser: (userData) => {
    try {
      const result = statements.createUser.run(
        userData.username,
        userData.email,
        userData.password,
        userData.gender
      );
      return { success: true, userId: result.lastInsertRowid };
    } catch (error) {
      if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        return { success: false, error: 'Username or email already exists' };
      }
      return { success: false, error: error.message };
    }
  },

  getUserByUsername: (username) => {
    try {
      const user = statements.getUserByUsername.get(username);
      return { success: true, user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  getUserByEmail: (email) => {
    try {
      const user = statements.getUserByEmail.get(email);
      return { success: true, user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  getUserById: (id) => {
    try {
      const user = statements.getUserById.get(id);
      return { success: true, user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  updateUser: (id, userData) => {
    try {
      const result = statements.updateUser.run(
        userData.username,
        userData.email,
        userData.gender,
        id
      );
      return { success: true, changes: result.changes };
    } catch (error) {
      if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        return { success: false, error: 'Username or email already exists' };
      }
      return { success: false, error: error.message };
    }
  },

  deleteUser: (id) => {
    try {
      const result = statements.deleteUser.run(id);
      return { success: true, changes: result.changes };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

// Close database connection on process exit
process.on('exit', () => db.close());
process.on('SIGHUP', () => process.exit(128 + 1));
process.on('SIGINT', () => process.exit(128 + 2));
process.on('SIGTERM', () => process.exit(128 + 15));

module.exports = {
  db,
  dbOperations
};