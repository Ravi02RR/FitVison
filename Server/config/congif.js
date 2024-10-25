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
    nodemailer: {
        email: process.env.EMAIL_USER,
        password: process.env.EMAIL_PASS,
    },
    razorpay: {
        keyId: process.env.RAZORPAY_KEY_ID,
        keySecret: process.env.RAZORPAY_KEY_SECRET
    },
    Groq: {
        apikey: process.env.GROQ_API_KEY,
    },
    GenAI: {
        apikey: process.env.GOOGLE_AI_API_KEY
    },
    WorkerLink: {
        nuriScan: process.env.HONO_SERVER_URL
    }, EmbadedLink: {
        uri: process.env.EMBEDED_LINK
    }

}

export default config;