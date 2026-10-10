// scratch/fix_admin_password.mjs
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const password = 'admin123';
const salt = bcrypt.genSaltSync(10);
const passwordHash = bcrypt.hashSync(password, salt);

console.log("Generated passwordHash for admin123:", passwordHash);

// 1. Update server/data/db.json
const dbPath = path.join(rootDir, 'server', 'data', 'db.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
db.admin.passwordHash = passwordHash;
fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
console.log("Successfully updated server/data/db.json");

// 2. Update server/seed.js
const seedPath = path.join(rootDir, 'server', 'seed.js');
fs.writeFileSync(seedPath, `// Database Seed Data\nexport const initialData = ${JSON.stringify(db, null, 2)};\n`, 'utf8');
console.log("Successfully updated server/seed.js");

// Verify match immediately
const isValid = bcrypt.compareSync('admin123', db.admin.passwordHash);
console.log("Verification check for 'admin123':", isValid ? "PASS ✓" : "FAIL ✗");
