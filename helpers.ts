import {createConnection } from 'mysql2/promise';

const dbConfig = {
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'platform_windows_19usljs',
  };

export const createConnect = createConnection(dbConfig);

export async function getPricesFromDatabase(): Promise<Record<string, number> | null> {
    let prices: Record<string, number> = {};
    const connection = await createConnect
    try {
        const [results]: any = await connection.execute('SELECT symbol, price FROM prices');
        results.forEach((row: any) => {
            prices[row.symbol] = row.price;
        });

        console.log("results============", results)
        console.log("prices===========", prices)

        await connection.end()
        return results;
    } catch (error) {
        console.log('Error fetching prices from database:', error);
        return null;
    }
}

getPricesFromDatabase()