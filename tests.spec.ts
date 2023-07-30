// import { fetchAndStorePrices } from './lambda'; // Adjust the import to your filename
// import axios from 'axios';
// // import { createConnection } from 'mysql2';

// // Mocking Axios
// jest.mock('axios');
// const mockedAxios = axios as jest.Mocked<typeof axios>;

// // Mocking MySQL
// jest.mock('mysql2', () => ({
//   createConnection: jest.fn().mockImplementation(() => ({
//     connect: jest.fn(),
//     query: jest.fn(),
//     end: jest.fn(),
//   })),
// }));

// describe('fetchAndStorePrices', () => {
//   it('should fetch prices and store them in the database', async () => {
//     // Mock successful API response
//     mockedAxios.get.mockResolvedValueOnce({ data: { price: '50000' } })
//                .mockResolvedValueOnce({ data: { price: '3000' } })
//                .mockResolvedValueOnce({ data: { price: '150' } });

//     const result = await fetchAndStorePrices();

//     expect(result).toEqual({
//       statusCode: 200,
//       body: JSON.stringify({
//         BTCUSDT: 50000,
//         ETHUSDT: 3000,
//         LTCUSDT: 150,
//       }),
//     });

//     // Add any other assertions if needed, e.g., to ensure database methods were called as expected
//   });

//   it('should handle API failures', async () => {
//     mockedAxios.get.mockRejectedValue(new Error('API Error'));

//     const result = await fetchAndStorePrices();

//     expect(result).toEqual({
//       statusCode: 500,
//       body: JSON.stringify({ error: 'Failed to fetch data from Binance API' }),
//     });
//   });

//   // ... Write more tests to handle edge cases, e.g., database connection failures, etc.
// });