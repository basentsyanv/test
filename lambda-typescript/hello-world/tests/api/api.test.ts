import axios, { AxiosResponse } from 'axios';

const BASE_URL = 'http://127.0.0.1:3000/hello';

describe('Lambda API tests', () => {
  test('Test Lambda function with GET request', async () => {
    try {
      const response: AxiosResponse = await axios.get(BASE_URL);

      expect(response.status).toBe(200);

      console.log(response.data);
      const symbol = [];
      const price = [];
      for (let currencyPair in response.data) {
        symbol.push(currencyPair);
        price.push(response.data[currencyPair]);
      }

      expect(symbol).toBeDefined();
      expect(price).toBeDefined();

    } catch (error) {
      console.error('Error during the test:', error.message);
      throw error;
    }
  }, 30000);
});

