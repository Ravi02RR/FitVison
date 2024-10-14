import { Router, json } from 'express';
import { Log } from '../middleware/admin.log.middleware.js';

const adminLogRouter = Router();


adminLogRouter.get('/', async (req, res) => {
    const adminToken = req.headers.admintoken;

    if (!adminToken) {
        return res.status(401).json({ message: "Required admin passkey" });
    }

    if (adminToken !== process.env.ADMIN_TOKEN) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const logs = await Log.find();
        return res.status(200).json({
            data: logs
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
});

export default adminLogRouter;
