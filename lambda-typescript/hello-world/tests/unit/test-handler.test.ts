import { lambdaHandler, fetchAndStorePrices, savePricesToDatabase, BINANCE_API_BASE_URL } from '../../app'; // adjust the path
import { ConnectionType } from '../../helpers'; 

import { APIGatewayProxyEvent } from 'aws-lambda';
import axios from 'axios';
import { createConnect } from '../../helpers';
import { describe, it, jest, expect } from '@jest/globals';



interface MockedConnection {
    query: jest.Mock;
}


jest.mock('axios');
jest.mock('./helpers');


const mockQuery = jest.fn((sql: string) => Promise.resolve({})) as jest.MockedFunction<ConnectionType['query']>;


jest.mock('./helpers', () => {
    const mockConnection = {
        query: (sql: string) => Promise.resolve({})
    };
    return {
        createConnect: Promise.resolve(mockConnection)
    };
});

describe('Unit tests for Lambda handler', () => {
    it('should return 200 status and correct body', async () => {
        (axios.get as jest.MockedFunction<typeof axios.get>).mockResolvedValueOnce({
            data: {
                price: "30000"
            }
        });

        const event: APIGatewayProxyEvent = {
            httpMethod: 'GET',
            body: '',
            headers: {},
            multiValueHeaders: {},
            isBase64Encoded: false,
            path: '/',
            pathParameters: {},
            queryStringParameters: {},
            multiValueQueryStringParameters: {},
            stageVariables: {},
            requestContext: {
                accountId: 'sampleAccountId',
                apiId: 'sampleApiId',
                authorizer: {},
                httpMethod: 'GET',
                identity: {
                    accessKey: '',
                    accountId: '',
                    apiKey: '',
                    apiKeyId: '',
                    caller: '',
                    cognitoAuthenticationProvider: '',
                    cognitoAuthenticationType: '',
                    cognitoIdentityId: '',
                    cognitoIdentityPoolId: '',
                    principalOrgId: '',
                    sourceIp: '',
                    user: '',
                    userAgent: '',
                    userArn: '',
                    clientCert: null as any,
                },
                path: '/',
                protocol: 'HTTP/1.1',
                requestId: 'sampleRequestId',
                requestTimeEpoch: 123456789,
                resourceId: 'sampleResourceId',
                resourcePath: '/',
                stage: 'dev',
            },
            resource: '/'
        };

        const result = await lambdaHandler(event);
        expect(result.statusCode).toEqual(200);
    });

    it('should fetch and store prices successfully', async () => {
        (axios.get as jest.MockedFunction<typeof axios.get>).mockResolvedValueOnce({
            data: {
                price: "30000"
            }
        });

        const result = await fetchAndStorePrices();
        expect(result.statusCode).toEqual(200);
        expect(JSON.parse(result.body)).toHaveProperty('BTCUSDT');
    });

    it('should save prices to the database', async () => {
        const prices = {
            BTCUSDT: 30000,
            ETHUSDT: 2500,
            LTCUSDT: 150
        };

        mockQuery.mockResolvedValueOnce({}); // mock for CREATE TABLE query
        mockQuery.mockResolvedValueOnce({}); // mock for INSERT query

        await savePricesToDatabase(prices);
        expect(mockQuery).toHaveBeenCalledTimes(2);
    });
});
