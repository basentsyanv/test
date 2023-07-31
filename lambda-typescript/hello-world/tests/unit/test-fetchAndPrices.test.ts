import { fetchAndStorePrices } from '../../fetchAndStorePrices';
import axios from 'axios';

jest.mock('axios');

describe('fetchAndStorePrices', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should fetch and store prices successfully', async () => {
        const mockResponse = { data: { price: '100.5' } };
        (axios.get as jest.Mock).mockResolvedValue(mockResponse);

        jest.mock('../../fetchAndStorePrices', () => ({
            savePricesToDatabase: jest.fn(),
        }));

        const result = await fetchAndStorePrices();

        expect(result.statusCode).toBe(200);
        expect(result.body).toEqual({ "LTCUSDT": 100.5, "BTCUSDT": 100.5, "ETHUSDT": 100.5,});
    });

    it('should handle errors', async () => {
        const errorMessage = 'Some error message';
        (axios.get as jest.Mock).mockRejectedValue(new Error(errorMessage));

        const result = await fetchAndStorePrices();

        expect(result.statusCode).toBe(500);
        expect(result.body).toEqual(JSON.stringify({ error: 'Failed to fetch data from Binance API' }));
    });
});