import express ,{ Application, Router} from "express";
import userRoutes from "./auth/user-auth.route";
import connectRoutes from "./connect/connect.routes";
import { chatRoutes } from "./chat/chat.routes";


const routesConfig = (app: Application) => {
  app.use('/api/v1/user', userRoutes()),
    app.use('/api/v1/user/connect', connectRoutes()),
    app.use('/api/v1/user/chat',chatRoutes())
}

export default routesConfig;
