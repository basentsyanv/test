import { APIGatewayProxyEvent } from 'aws-lambda';
import { lambdaHandler } from '../../app';
import { expect, describe, it } from '@jest/globals';
import { fetchAndStorePrices } from '../../fetchAndStorePrices';

const mockEvent: APIGatewayProxyEvent = {
    httpMethod: 'get',
    body: '',
    headers: {},
    isBase64Encoded: false,
    multiValueHeaders: {},
    multiValueQueryStringParameters: {},
    path: '/hello',
    pathParameters: {},
    queryStringParameters: {},
    requestContext: {
        accountId: '123456789012',
        apiId: '1234',
        authorizer: {},
        httpMethod: 'get',
        identity: {
            accessKey: '',
            accountId: '',
            apiKey: '',
            apiKeyId: '',
            caller: '',
            clientCert: {
                clientCertPem: '',
                issuerDN: '',
                serialNumber: '',
                subjectDN: '',
                validity: {notAfter: '', notBefore: ''},
            },
            cognitoAuthenticationProvider: '',
            cognitoAuthenticationType: '',
            cognitoIdentityId: '',
            cognitoIdentityPoolId: '',
            principalOrgId: '',
            sourceIp: '',
            user: '',
            userAgent: '',
            userArn: '',
        },
        path: '/hello',
        protocol: 'HTTP/1.1',
        requestId: 'c6af9ac6-7b61-11e6-9a41-93e8deadbeef',
        requestTimeEpoch: 1428582896000,
        resourceId: '123456',
        resourcePath: '/hello',
        stage: 'dev',
    },
    resource: '',
    stageVariables: {},
};

jest.mock('../../fetchAndStorePrices');

describe('lambdaHandler', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return prices successfully', async () => {
        const prices = {BTC: 100.5};
        (fetchAndStorePrices as jest.Mock).mockResolvedValue({
            statusCode: 200,
            body: prices,
        });


        const result = await lambdaHandler(mockEvent);

        expect(result.statusCode).toBe(200);
        expect(result.body).toMatchObject(prices);
    });

    test('should handle errors', async () => {
        const errorMessage = 'Some error message';
        (fetchAndStorePrices as jest.Mock).mockRejectedValue(new Error(errorMessage));

        const result = await lambdaHandler(mockEvent);

        expect(result.statusCode).toBe(500);
        expect(result.body).toEqual({ message: "Error: " + errorMessage });
    });
})
