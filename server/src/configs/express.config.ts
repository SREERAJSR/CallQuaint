import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import configKey from './configkeys';
import { Application } from 'express';


const corsOptions: { origin: string } = { origin: configKey().ORIGIN };

const expressConfig = (app: Application) => {
    app.use(morgan('dev')),
    app.use(cookieParser()),
    app.use(express.json()),
    app.use(express.urlencoded({ extended: true })),
    app.use(cors(corsOptions))
}

export default expressConfig;