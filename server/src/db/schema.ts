import { pgTable, uuid, varchar, integer, timestamp } from 'drizzle-orm/pg-core';

export const links = pgTable('links', {
  id: uuid('id').primaryKey().defaultRandom(),
  original_url: varchar('original_url', { length: 2048 }).notNull(),
  short_code: varchar('short_code', { length: 50 }).notNull().unique(),
  clicks: integer('clicks').notNull().default(0),
  created_at: timestamp('created_at').notNull().defaultNow(),
});