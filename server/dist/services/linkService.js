"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportLinksToCsv = exports.deleteLink = exports.getAllLinks = exports.getLinkByCode = exports.createLink = void 0;
const node_postgres_1 = require("drizzle-orm/node-postgres");
const pg_1 = require("pg");
const schema_1 = require("../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const client_s3_1 = require("@aws-sdk/client-s3");
const sync_1 = require("csv-stringify/sync");
const uuid_1 = require("uuid");
const pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL,
});
pool.on('error', (err) => {
    console.error('Database pool error:', err.stack);
});
const db = (0, node_postgres_1.drizzle)(pool);
const createLink = async (original_url, short_code) => {
    console.log('Creating link:', { original_url, short_code });
    if (!/^https?:\/\/[^\s/$.?#].[^\s]*$/.test(original_url)) {
        throw new Error('URL inválida');
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(short_code)) {
        throw new Error('Código de encurtamento mal formatado');
    }
    const existing = await db.select().from(schema_1.links).where((0, drizzle_orm_1.eq)(schema_1.links.short_code, short_code)).limit(1);
    if (existing.length > 0) {
        throw new Error('Encurtamento já existe');
    }
    const [newLink] = await db.insert(schema_1.links).values({ original_url, short_code }).returning();
    return {
        id: newLink.id,
        original_url: newLink.original_url,
        short_code: newLink.short_code,
        clicks: newLink.clicks,
        created_at: newLink.created_at.toISOString(),
    };
};
exports.createLink = createLink;
const getLinkByCode = async (short_code) => {
    const [link] = await db
        .select()
        .from(schema_1.links)
        .where((0, drizzle_orm_1.eq)(schema_1.links.short_code, short_code))
        .limit(1);
    if (!link) {
        return null;
    }
    await db.update(schema_1.links).set({ clicks: link.clicks + 1 }).where((0, drizzle_orm_1.eq)(schema_1.links.short_code, short_code));
    return {
        id: link.id,
        original_url: link.original_url,
        short_code: link.short_code,
        clicks: link.clicks + 1,
        created_at: link.created_at.toISOString(),
    };
};
exports.getLinkByCode = getLinkByCode;
const getAllLinks = async () => {
    try {
        const result = await db.select().from(schema_1.links).orderBy(schema_1.links.created_at);
        return result.map((link) => ({
            id: link.id,
            original_url: link.original_url,
            short_code: link.short_code,
            clicks: link.clicks,
            created_at: link.created_at.toISOString(),
        }));
    }
    catch (error) {
        console.error('Error fetching links:', error);
        if (error instanceof Error) {
            throw new Error(`Failed to fetch links: ${error.message}`);
        }
        else {
            throw new Error('Failed to fetch links: Unknown error');
        }
    }
};
exports.getAllLinks = getAllLinks;
const deleteLink = async (short_code) => {
    const result = await db.delete(schema_1.links).where((0, drizzle_orm_1.eq)(schema_1.links.short_code, short_code)).returning();
    return result.length > 0;
};
exports.deleteLink = deleteLink;
const exportLinksToCsv = async () => {
    const allLinks = await (0, exports.getAllLinks)();
    const records = allLinks.map((link) => ({
        'URL Original': link.original_url,
        'URL Encurtada': link.short_code,
        Cliques: link.clicks,
        'Data de Criação': link.created_at,
    }));
    const csv = (0, sync_1.stringify)(records, { header: true });
    const fileName = `${(0, uuid_1.v4)()}.csv`;
    const s3Client = new client_s3_1.S3Client({
        region: 'auto',
        endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
        credentials: {
            accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID,
            secretAccessKey: process.env.CLOUDFLARE_SECRET_ACCESS_KEY,
        },
    });
    await s3Client.send(new client_s3_1.PutObjectCommand({
        Bucket: process.env.CLOUDFLARE_BUCKET,
        Key: fileName,
        Body: csv,
        ContentType: 'text/csv',
    }));
    return `${process.env.CLOUDFLARE_PUBLIC_URL}/${fileName}`;
};
exports.exportLinksToCsv = exportLinksToCsv;
