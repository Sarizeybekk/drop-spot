import db from './database.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const schemaPath = join(__dirname, 'schema.sql');
const schema = readFileSync(schemaPath, 'utf-8');

try {
  db.exec(schema);
  console.log('✅ Database schema created successfully');
} catch (error) {
  console.error('❌ Error creating database schema:', error);
  process.exit(1);
}

