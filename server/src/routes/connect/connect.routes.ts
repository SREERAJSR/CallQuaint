import { Router } from "express"
import { callSetup, saveCallInfoToDb } from "../../controller/connect.controller";
import { verifyJWT } from "../../middlewares/authMiddlewares";

const connectRoutes = () => {
    const router = Router();

    router.get('/call', verifyJWT, callSetup),
    router.post('/saveCallInfo',verifyJWT,saveCallInfoToDb)
    return router;
}

export default connectRoutes;