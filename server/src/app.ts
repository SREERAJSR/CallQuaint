import express,{Application} from "express";
import expressConfig from "./configs/express.config";
import databaseConfg from "./configs/db.config";
import serverConfig from "./configs/server.config";
import routesConfig from "./routes/routes";

const app: Application = express();

// started database config
databaseConfg()

//express config started
expressConfig(app);

//routes config
routesConfig(app)

//server config started
serverConfig(app)
