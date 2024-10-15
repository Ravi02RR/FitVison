import cron from 'node-cron';
import UserModel from '../Models/user.model.js';


cron.schedule('0 0 * * *', async () => {
    try {
        const now = new Date();
        await UserModel.updateMany(
            { isPro: true, proExpirationDate: { $lte: now } },
            { isPro: false, proExpirationDate: null }
        );
        console.log('Pro status expiration check completed');
    } catch (error) {
        console.error('Error in pro status expiration task:', error);
    }
});