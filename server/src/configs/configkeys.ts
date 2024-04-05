import dotenv from 'dotenv'
import {configTypes} from '../types/config-types';
dotenv.config();

function configKey():configTypes {
    return {
        PORT: process.env.PORT as string,
        ORIGIN: process.env.ORIGIN as string,
        MONGO_URL: process.env.MONGO_URL as string,
        DB_NAME: process.env.DB_NAME as string,
        BASE_URL: process.env.BASE_URL as string,
        HOST: process.env.HOST as string,
        SERVICE: process.env.SERVICE as string,
        MAIL: process.env.MAIL as string,
        PASS: process.env.PASS as string
    }
}

export  default   configKey