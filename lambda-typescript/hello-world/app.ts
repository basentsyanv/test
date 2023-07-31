import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import axios from 'axios';

import { closeConnection, connect, createConnect } from './helpers';

export const BINANCE_API_BASE_URL = 'https://api.binance.com/api/v3/ticker/price';
const SYMBOLS = ['BTCUSDT', 'ETHUSDT', 'LTCUSDT'];


export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<any> => {
    try {
        console.log("aaa====================", event.body)
        const fetched = await fetchAndStorePrices();
        // const response = await axios.get(`${BINANCE_API_BASE_URL}?symbol=${SYMBOLS[1]}`);
        // console.log('responese--============', response.status, response.data);
        console.log('fetched--============', fetched);

        return {
            statusCode: 200,
            body: fetched.body,
        };
    } catch (err) {
        console.log(err);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: `some error happened ${err}`,
            }),
        };
    }
};



export async function fetchAndStorePrices() {
    try {
        const prices: Record<string, number> = {};
        for (const symbol of SYMBOLS) {
            const response = await axios.get(`${BINANCE_API_BASE_URL}?symbol=${symbol}`);
            if (response && response.data && response.data.price) {
                prices[symbol] = parseFloat(response.data.price);
            }
        }
        console.log('Fetched prices:', prices);

        await savePricesToDatabase(prices);
        await closeConnection()
        // await closeConnection();
        return {
            statusCode: 200,
            body: JSON.stringify(prices),
        };
    } catch (error) {
        console.error('Error fetching data:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to fetch data from Binance API' }),
        };
    }
}

async function savePricesToDatabase(prices: Record<string, number>): Promise<any> {
    const connection = await connect();

    const insertValues = Object.keys(prices).map((symbol) => `('${symbol}', ${prices[symbol]})`);
    const createTable = `CREATE TABLE IF NOT EXISTS prices (
            symbol VARCHAR(50) NOT NULL,
            price DECIMAL(10, 2) NOT NULL
        )`;
    const insertQuery = `INSERT INTO prices (symbol, price) VALUES ${insertValues.join(',')}`;

    const createTableResult = await connection.query(createTable);

    const insertQueryResult = await connection.query(insertQuery);

    console.log('createTableResult=====:', createTableResult);

    console.log('insertQueryResult=====', insertQueryResult);
    // await connection.end();
}

// export async function getPricesFromDatabase(): Promise<Record<string, number> | null> {
//     const prices: Record<string, number> = {};
//     const connection = await createConnect;
//     try {
//         const [results]: any = await connection.execute('SELECT symbol, price FROM prices');
//         results.forEach((row: any) => {
//             prices[row.symbol] = row.price;
//         });

//         console.log('results============', results);
//         console.log('prices===========', prices);

//         // await connection.end();
//         return results;
//     } catch (error) {
//         console.log('Error fetching prices from database:', error);
//         return null;
//     }
// }
