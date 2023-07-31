import { savePricesToDatabase } from '../../fetchAndStorePrices';
import * as db from '../../connection'

describe('savePricesToDatabase', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should save prices to the database successfully', async () => {
        const mockConnection = {
            query: jest.fn().mockResolvedValue({}),
            release: jest.fn().mockResolvedValue(undefined),
        };
        jest.spyOn(db, 'connect').mockResolvedValue(mockConnection)
        jest.spyOn(db, 'closeConnection').mockResolvedValue(null)

        const prices = { BTC: 100.5, ETH: 200.75 };

        await savePricesToDatabase(prices);

        expect(mockConnection.query).toHaveBeenCalledTimes(2);
        expect(mockConnection.query).toHaveBeenCalledWith(expect.stringContaining('CREATE TABLE IF NOT EXISTS'));
        expect(mockConnection.query).toHaveBeenCalledWith(expect.stringContaining('INSERT INTO prices'));
        expect(mockConnection.release).toHaveBeenCalledTimes(1);
        expect(db.closeConnection).toHaveBeenCalledTimes(1);
    });
});
