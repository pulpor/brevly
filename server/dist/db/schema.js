"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.links = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.links = (0, pg_core_1.pgTable)('links', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    original_url: (0, pg_core_1.text)('original_url').notNull(),
    short_code: (0, pg_core_1.text)('short_code').notNull().unique(),
    clicks: (0, pg_core_1.integer)('clicks').notNull().default(0),
    created_at: (0, pg_core_1.timestamp)('created_at').notNull().defaultNow(),
});
