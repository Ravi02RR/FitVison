import { Router } from 'express';
import axios from 'axios';
import config from '../config/congif.js';
import multer from 'multer';

const v2HonoRoute = Router();
const HONO_SERVER_URL = config.WorkerLink.nuriScan;


const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024,
    }
});

const getDataFromHonoServer = async (fileBuffer) => {
    try {
        const formData = new FormData();
        formData.append('foodImage', new Blob([fileBuffer], { type: 'image/jpeg' }));

        const response = await axios.post(HONO_SERVER_URL, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response;
    } catch (err) {
        // console.error('Error in getDataFromHonoServer:', err);
        throw err;
    }
};

v2HonoRoute.post('/getfooddetail', upload.single('foodImage'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: "No file uploaded"
            });
        }

        const data = await getDataFromHonoServer(req.file.buffer);

        if (!data) {
            return res.status(400).json({
                message: "Unable to scan the food"
            });
        }

        res.status(200).json(data.data);
    } catch (error) {
        // console.error('Error processing request:', error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
});

export default v2HonoRoute;