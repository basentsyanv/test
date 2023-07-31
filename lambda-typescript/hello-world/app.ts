import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import {fetchAndStorePrices} from "./fetchAndStorePrices";

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<any> => {
    try {
        const fetched = await fetchAndStorePrices();
        console.log('fetched:', fetched);

        return {
            statusCode: 200,
            body: fetched.body,
        };
    } catch (err) {
        console.log(err);
        return {
            statusCode: 500,
            body: {
                message: `${err}`,
            },
        };
    }
};