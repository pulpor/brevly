import { pgTable, serial, text, integer, timestamp } from 'drizzle-orm/pg-core';

   export const links = pgTable('links', {
     id: serial('id').primaryKey(),
     original_url: text('original_url').notNull(),
     short_code: text('short_code').notNull().unique(),
     clicks: integer('clicks').notNull().default(0),
     created_at: timestamp('created_at').notNull().defaultNow(),
   });