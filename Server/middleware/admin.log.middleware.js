import mongoose from 'mongoose';

const LogSchema = new mongoose.Schema({
    type: { type: String, required: true, enum: ['request', 'error'] },
    method: { type: String, required: true },
    url: { type: String, required: true },
    status: { type: Number, required: true },
    responseTime: { type: Number },
    ip: String,
    userAgent: String,
    headers: Object,
    query: Object,
    body: Object,
    error: Object,
    timestamp: { type: Date, default: Date.now }
});

export const Log = mongoose.model('Log', LogSchema);

async function saveLog(logData) {
    try {
        const logEntry = new Log(logData);
        await logEntry.save();
        console.log('Log saved successfully');
    } catch (err) {
        console.error('Error saving log:', err);
    }
}

function logMiddleware(req, res, next) {
    const startTime = Date.now();


    const originalEnd = res.end;


    res.end = function (chunk, encoding) {

        res.end = originalEnd;


        res.end(chunk, encoding);

        const responseTime = Date.now() - startTime;

        const logData = {
            type: 'request',
            method: req.method,
            url: req.url,
            status: res.statusCode,
            responseTime: responseTime,
            ip: req.ip,
            userAgent: req.get('User-Agent'),
            headers: req.headers,
            query: req.query,
            body: req.body
        };

        saveLog(logData);
    };


    res.on('finish', () => {
        if (res.statusCode >= 400) {
            const errorLogData = {
                type: 'error',
                method: req.method,
                url: req.url,
                status: res.statusCode,
                error: res.locals.error || 'Unknown error'
            };

            saveLog(errorLogData);
        }
    });

    next();
}

export default logMiddleware;