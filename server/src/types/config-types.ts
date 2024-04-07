export  interface configTypes{
    PORT: string,
    ORIGIN: string,
    MONGO_URL: string,
    DB_NAME: string,
    BASE_URL: string,
    HOST: string,
    SERVICE: string,
    MAIL: string,
    PASS: string,
    EXPRESS_SESSION_SECRET: string,
    ACCESS_TOKEN_SECRET:string,
    ACCESS_TOKEN_EXPIRY: string,
    REFRESH_TOKEN_SECRET: string,
    REFRESH_TOKEN_EXPIRY: string,
    NODE_ENV:string
}

export type corsOptionsType = { origin:string , optionSuccessStatus:number}