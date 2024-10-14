import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
const app = express();
dotenv.config()
//================middlewares================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


export default app;