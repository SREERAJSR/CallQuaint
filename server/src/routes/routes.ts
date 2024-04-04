import express ,{ Application, Router} from "express";
import userRoutes from "./user.route";


 const routesConfig = (app:Application) => {
    app.use('/api/user',userRoutes())
}

export default routesConfig;