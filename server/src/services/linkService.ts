import { drizzle } from 'drizzle-orm/node-postgres';
   import { Pool } from 'pg';
   import { links } from '../db/schema';
   import { Link } from '../types/link';
   import { eq } from 'drizzle-orm';
   import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
   import { stringify } from 'csv-stringify/sync';
   import { v4 as uuidv4 } from 'uuid';

   const pool = new Pool({
     connectionString: process.env.DATABASE_URL,
   });

   pool.on('error', (err) => {
     console.error('Database pool error:', err.stack);
   });

   const db = drizzle(pool);

   export const createLink = async (original_url: string, short_code: string): Promise<Link> => {
     console.log('Creating link:', { original_url, short_code });
     if (!/^https?:\/\/[^\s/$.?#].[^\s]*$/.test(original_url)) {
       throw new Error('URL inválida');
     }
     if (!/^[a-zA-Z0-9_-]+$/.test(short_code)) {
       throw new Error('Código de encurtamento mal formatado');
     }
     const existing = await db.select().from(links).where(eq(links.short_code, short_code)).limit(1);
     if (existing.length > 0) {
       throw new Error('Encurtamento já existe');
     }
     const [newLink] = await db.insert(links).values({ original_url, short_code }).returning();
     return {
       id: newLink.id,
       original_url: newLink.original_url,
       short_code: newLink.short_code,
       clicks: newLink.clicks,
       created_at: newLink.created_at.toISOString(),
     };
   };

   export const getLinkByCode = async (short_code: string): Promise<Link | null> => {
     const [link] = await db
       .select()
       .from(links)
       .where(eq(links.short_code, short_code))
       .limit(1);
     if (!link) {
       return null;
     }
     await db.update(links).set({ clicks: link.clicks + 1 }).where(eq(links.short_code, short_code));
     return {
       id: link.id,
       original_url: link.original_url,
       short_code: link.short_code,
       clicks: link.clicks + 1,
       created_at: link.created_at.toISOString(),
     };
   };

   export const getAllLinks = async (): Promise<Link[]> => {
     try {
       const result = await db.select().from(links).orderBy(links.created_at);
       return result.map((link) => ({
         id: link.id,
         original_url: link.original_url,
         short_code: link.short_code,
         clicks: link.clicks,
         created_at: link.created_at.toISOString(),
       }));
     } catch (error) {
       console.error('Error fetching links:', error);
       if (error instanceof Error) {
         throw new Error(`Failed to fetch links: ${error.message}`);
       } else {
         throw new Error('Failed to fetch links: Unknown error');
       }
     }
   };

   export const deleteLink = async (short_code: string): Promise<boolean> => {
     const result = await db.delete(links).where(eq(links.short_code, short_code)).returning();
     return result.length > 0;
   };

   export const exportLinksToCsv = async (): Promise<string> => {
     const allLinks = await getAllLinks();
     const records = allLinks.map((link) => ({
       'URL Original': link.original_url,
       'URL Encurtada': link.short_code,
       Cliques: link.clicks,
       'Data de Criação': link.created_at,
     }));
     const csv = stringify(records, { header: true });
     const fileName = `${uuidv4()}.csv`;
     const s3Client = new S3Client({
       region: 'auto',
       endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
       credentials: {
         accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID!,
         secretAccessKey: process.env.CLOUDFLARE_SECRET_ACCESS_KEY!,
       },
     });
     await s3Client.send(
       new PutObjectCommand({
         Bucket: process.env.CLOUDFLARE_BUCKET,
         Key: fileName,
         Body: csv,
         ContentType: 'text/csv',
       }),
     );
     return `${process.env.CLOUDFLARE_PUBLIC_URL}/${fileName}`;
   };