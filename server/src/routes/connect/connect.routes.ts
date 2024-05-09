import { Router } from "express"
import { callSetup } from "../../controller/connect.controller";
import { verifyJWT } from "../../middlewares/authMiddlewares";

const connectRoutes = () => {
    const router = Router();

    router.get('/call',verifyJWT ,callSetup)
    return router;
}

export default connectRoutes;