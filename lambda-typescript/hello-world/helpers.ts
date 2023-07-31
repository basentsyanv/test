import { createPool } from 'mysql2/promise';

const dbConfig = {
    host: process.env.DB_HOST || 'host.docker.internal',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'platform_windows_19usljs',
};

export const pool = createPool(dbConfig)


export const connect = async () => {
    return pool.getConnection();
}

export const closeConnection = async () => {
    await (await connect()).release();
};



