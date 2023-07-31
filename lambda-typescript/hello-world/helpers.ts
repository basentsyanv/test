import { createConnection } from 'mysql2/promise';

const dbConfig = {
    host: process.env.DB_HOST || 'host.docker.internal',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'aggregator_collector_windows_19usljs',
};

export const createConnect = () => createConnection(dbConfig);
export type ConnectionType = {
    query: (sql: string) => Promise<any>;



};


