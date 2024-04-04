import express,{Application, NextFunction, Request, Response} from "express";
import expressConfig from "./configs/express.config";
import databaseConfg from "./configs/db.config";
import serverConfig from "./configs/server.config";
import routesConfig from "./routes/routes";
import errorHandling from "./middlewares/global-error-handling";
import AppError from "./utils/AppError";
import asynchHandler from 'express-async-handler';

const app: Application = express();


// database config
databaseConfg()

//express config 
expressConfig(app);


//server config 
serverConfig(app)

//routes config
routesConfig(app)

app.use(errorHandling)

 
app.all('*', asynchHandler(async(req,res,next:NextFunction) => {
    next(new AppError('Not found', 404));
}));


