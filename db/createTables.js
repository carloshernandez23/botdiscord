const db = require('./db');

const createUsersTable = () => {
  const statement = db.prepare(`
    CREATE TABLE IF NOT EXISTS users (
    user_id TEXT PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL    
    )
    `);

  statement.run();
};

const createTables = async () => {
  console.log('Creando tablas...');
  await createUsersTable();
  console.log('Tablas creadas!');
};

createTables();