import axios from 'axios';
import { BINANCE_API_BASE_URL, fetchAndStorePrices } from './lambda';
import {createConnect, getPricesFromDatabase} from "./helpers";
// import { connection, getPricesFromDatabase } from './helpers';



// beforeAll(async () => {
//   await createConnect;
// });

describe('Integration Tests', () => {

  it('should fetch prices successfully from Binance', async () => {
    const response = await axios.get(`${BINANCE_API_BASE_URL}?symbol=BTCUSDT`);
    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('price');
  });

  it('should store fetched prices to the database and retrieve them', async () => {
    const initialResponse = await fetchAndStorePrices();
    console.log("initialResponse==aaa======", initialResponse)

    expect(initialResponse.statusCode).toBe(200);

    const prices = JSON.parse(initialResponse.body);
    
    // Here, you'd ideally have a function to read prices from the DB to verify.
    const retrievedPrices = await getPricesFromDatabase();
    console.log("aaa========", retrievedPrices)
    expect(prices).toEqual(retrievedPrices);
  });

  // it('should handle errors gracefully if Binance API fetch fails', async () => {
  //   // Intentionally providing a wrong endpoint or parameters to induce an error.
  //   const response = await axios.get(`${BINANCE_API_BASE_URL}?symbol=WRONG_SYMBOL`);
  //   expect(response.status).not.toBe(500);
  // });

});


// afterAll(() => {
//     connection.end();
// });