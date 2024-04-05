import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import configKey from './configkeys';
import { Application } from 'express';
import { corsOptionsType } from '../types/config-types';



const corsOptions:corsOptionsType = { origin: configKey().ORIGIN ,optionSuccessStatus:200};

const expressConfig = (app: Application) => {
    app.use(cors(corsOptions)),
        app.use(morgan('dev')),
        app.use(cookieParser()),
        app.use(express.json()),
        app.use(express.urlencoded({ extended: true }));
}

export default expressConfig;