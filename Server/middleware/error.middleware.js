function errorMiddleware(err, req, res, next) {
    if (err) {

        res.status(500).json({
            notice: "some error occurred",
            message: err.message
        });
    }
    else {
        next();
    }
}

export default errorMiddleware;