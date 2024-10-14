function errorMiddleware(err, req, res, next) {
    if (err) {
        res.status(500).json({
            notice: "some error occured",
            message: err.message
        });
    }

    else {
        next();
    }

}
export default errorMiddleware;