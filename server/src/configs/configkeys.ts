import dotenv from 'dotenv'
import configTypes from '../types/config-types';
dotenv.config();

function configKey():configTypes {
    return {
        PORT: process.env.PORT as string,
        ORIGIN: process.env.ORIGIN as string,
        MONGO_URL: process.env.MONGO_URL as string,
        DB_NAME: process.env.DB_NAME as string
    }
}

export  default   configKey