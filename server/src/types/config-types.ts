export  interface configTypes{
    PORT: string,
    ORIGIN: string,
    MONGO_URL: string,
    DB_NAME: string,
    BASE_URL: string,
    HOST: string,
    SERVICE: string,
    MAIL: string,
    PASS:string
}

export type corsOptionsType = { origin:string , optionSuccessStatus:number}