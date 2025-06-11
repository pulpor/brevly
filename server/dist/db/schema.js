"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.links = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.links = (0, pg_core_1.pgTable)('links', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    original_url: (0, pg_core_1.varchar)('original_url', { length: 2048 }).notNull(),
    short_code: (0, pg_core_1.varchar)('short_code', { length: 50 }).notNull().unique(),
    clicks: (0, pg_core_1.integer)('clicks').notNull().default(0),
    created_at: (0, pg_core_1.timestamp)('created_at').notNull().defaultNow(),
});
