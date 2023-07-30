import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

// /**
//  *
//  * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
//  * @param {Object} event - API Gateway Lambda Proxy Input Format
//  *
//  * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
//  * @returns {Object} object - API Gateway Lambda Proxy Output Format
//  *
//  */
// import axios from 'axios';
// export const BINANCE_API_BASE_URL = 'https://api.binance.com/api/v3/ticker/price';
// const SYMBOLS = ['BTCUSDT', 'ETHUSDT', 'LTCUSDT'];

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<any> => {
    try {
        console.log("aaa====================", event)
        const fetched = await fetchAndStorePrices();
        const response = await axios.get(`${BINANCE_API_BASE_URL}?symbol=${SYMBOLS[1]}`);
        console.log('responese--============', response.status, response.data);
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

import axios from 'axios';

import { closeConnection, createConnect } from './helpers';

export const BINANCE_API_BASE_URL = 'https://api.binance.com/api/v3/ticker/price';
const SYMBOLS = ['BTCUSDT', 'ETHUSDT', 'LTCUSDT'];

export async function fetchAndStorePrices() {
    try {
        const prices: Record<string, number> = {};
        for (const symbol of SYMBOLS) {
            const response = await axios.get(`${BINANCE_API_BASE_URL}?symbol=${symbol}`);
            if (response && response.data && response.data.price) {
                prices[symbol] = parseFloat(response.data.price);
            }
        }
        console.log('Fetched pricesАЯА:', prices);

        await savePricesToDatabase(prices);
        await closeConnection();
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
    const connection = await createConnect;
    
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

fetchAndStorePrices()