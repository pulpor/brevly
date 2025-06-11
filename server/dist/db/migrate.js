"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_postgres_1 = require("drizzle-orm/node-postgres");
const migrator_1 = require("drizzle-orm/node-postgres/migrator");
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
async function main() {
    const pool = new pg_1.Pool({
        connectionString: process.env.DATABASE_URL,
    });
    const db = (0, node_postgres_1.drizzle)(pool);
    console.log('Running migrations...');
    await (0, migrator_1.migrate)(db, { migrationsFolder: './src/db/migrations' });
    console.log('Migrations completed.');
    await pool.end();
}
main().catch((err) => {
    console.error('Migration failed:', err);
    process.exit(1);
});
