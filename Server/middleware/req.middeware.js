const requestLimiter = (maxRequests, resetInterval) => {
   
    const requestCounts = new Map();

    return async (req, res, next) => {
        try {
            const clientIP = req.ip || req.connection.remoteAddress;

            
            let requestCount = requestCounts.get(clientIP) || 0;

            
            if (requestCount >= maxRequests) {
                return res.status(429).json({ 
                    error: "Too Many Requests",
                    message: "Please try again later" 
                });
            }

            
            requestCounts.set(clientIP, requestCount + 1);

            
            if (requestCount === 0) {
                setTimeout(() => {
                    requestCounts.delete(clientIP);
                }, resetInterval);
            }

            
            next();
        } catch (error) {
            console.error('Rate limiter error:', error);
            next(error);
        }
    };
};


const reqMiddleware = requestLimiter(2,1000);

export default reqMiddleware;