const config = {
    database: {
        uri: process.env.MONGODB_URI,
    },
    server: {
        port: process.env.PORT,
    },
    bcrypt: {
        saltRounds: parseInt(process.env.SALT_ROUNDS),
    },
    jwt: {
        secret: process.env.JWT_SECRET,
    },

}

export default config;