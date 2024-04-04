export  interface configTypes{
    PORT: string,
    ORIGIN: string,
    MONGO_URL: string,
    DB_NAME:string
}

export type corsOptionsType = { origin:string , optionSuccessStatus:number}