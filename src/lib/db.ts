import { neon } from "@neondatabase/serverless";

/**
 * Cliente SQL para Neon.
 * Uso: const rows = await sql`SELECT * FROM tools WHERE slug = ${slug}`;
 */
export const sql = neon(process.env.DATABASE_URL!);
