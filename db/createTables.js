const db = require('./db');

const createUsersTable = () => {
  db.prepare('DROP TABLE IF EXISTS users').run();
  const statement = db.prepare(`
    CREATE TABLE IF NOT EXISTS users (
    user_id TEXT PRIMARY KEY,
    created_at DATE NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL    
    )
    `);

  statement.run();
};

const createFightersTable = () => {
  db.prepare('DROP TABLE IF EXISTS fighters').run();
  const statement = db.prepare(`
    CREATE TABLE IF NOT EXISTS fighters (
    fighter_id INTEGER PRIMARY KEY AUTOINCREMENT,
    created_at DATE NOT NULL,
    fighter_name TEXT NOT NULL,
    fighter_lastname TEXT NOT NULL,
    contador INTEGER
    )
    `);

  statement.run();
};

const createTables = async () => {
  console.log('Creando tablas...');
  createUsersTable();
  createFightersTable();
  console.log('Tablas creadas!');
};

createTables();
