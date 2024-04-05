import express ,{ Application, Router} from "express";
import userRoutes from "./user-auth.route";



 const routesConfig = (app:Application) => {
     app.use('/api', userRoutes())
}

export default routesConfig;