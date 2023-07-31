import { createPool } from 'mysql2/promise';

const dbConfig = {
    // host: process.env.DB_HOST || 'host.docker.internal',
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'platform_windows_19usljs',
};

let pool

export const connect = async () => {
    pool = createPool(dbConfig)
    return pool.getConnection();
}

export const closeConnection = async () => {
    await pool.end();
};



