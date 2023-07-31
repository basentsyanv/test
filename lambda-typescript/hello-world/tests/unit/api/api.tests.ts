import axios, { AxiosResponse } from 'axios';

// Endpoint URL
const BASE_URL = 'http://127.0.0.1:3000/hello';

describe('Lambda API tests', () => {
  test('Test Lambda function with GET request', async () => {
    try {
      // Send a GET request to the Lambda function endpoint
      const response: AxiosResponse = await axios.get(BASE_URL);

      // Verify the response status code
      expect(response.status).toBe(200);

      // Assuming the response is a plain text with format "SYMBOL:PRICE" e.g., "AAPL:150"
      // Splitting the response data into symbol and price for further validation
      console.log(response.data);
      const symbol = [];
      const price = [];
      for (let currencyPair in response.data) {
        symbol.push(currencyPair);
        price.push(response.data[currencyPair]);
      }
      // Verify the response data
      expect(symbol).toBeDefined();
      expect(price).toBeDefined();
      
    } catch (error) {
      console.error('Error during the test:', error.message);
      throw error;
    }
  }, 30000); 
});

