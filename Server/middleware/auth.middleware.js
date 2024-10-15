import jwt from 'jsonwebtoken';
import config from '../config/congif.js';
const userAuthMiddleware = (req, res, next) => {
    const token = req.cookies.access_token;
    try {
        const decodedData = jwt.verify(token, config.jwt.secret);

        if (decodedData) {
            req.userID = decodedData.id;
            return next();
        }
    } catch (error) {
        return res.status(403).json({
            message: "Unauthorized user Please Login Again.."
        });
    }

    res.status(403).json({
        message: "Unauthorized user"
    });
}

export default userAuthMiddleware;