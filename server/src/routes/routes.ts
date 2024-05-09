import express ,{ Application, Router} from "express";
import userRoutes from "./auth/user-auth.route";
import connectRoutes from "./connect/connect.routes";


const routesConfig = (app: Application) => {
  app.use('/api/v1/user', userRoutes()),
  app.use('/api/v1/user/connect',connectRoutes())
}

export default routesConfig;
// channel2dc75590 - e37a - 467d - 9912 - 4de3230ad3f4