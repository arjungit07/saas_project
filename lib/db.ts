'use server'
import { neon } from '@neondatabase/serverless'

export async function getDbConnection() {
    if (!process.env.DATABASE_URL) {
        throw new Error("Error in db connection")

    }
    const sql = neon(process.env.DATABASE_URL)
    return sql
}
