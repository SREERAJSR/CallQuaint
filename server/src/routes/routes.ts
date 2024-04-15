import express ,{ Application, Router} from "express";
import userRoutes from "./auth/user-auth.route";



const routesConfig = (app: Application) => {
  app.use('/api/v1/user', userRoutes())
}

export default routesConfig;