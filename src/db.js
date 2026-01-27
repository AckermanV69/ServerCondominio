import pg from 'pg'

export const pool = new pg.Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'pruebas',
    password: 'mu123456',
    port: 5432,
})
