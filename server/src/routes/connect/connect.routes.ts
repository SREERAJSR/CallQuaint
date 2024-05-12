import { Router } from "express"
import { callSetup, getCallHistory, saveCallInfoToDb, sendFriendRequest } from "../../controller/connect.controller";
import { verifyJWT } from "../../middlewares/authMiddlewares";

const connectRoutes = () => {
    const router = Router();

    router.get('/call', verifyJWT, callSetup),
        router.post('/saveCallInfo', verifyJWT, saveCallInfoToDb),
        router.get('/callhistory', verifyJWT, getCallHistory),
        router.post('/sendfriendrequest',verifyJWT,sendFriendRequest)
    return router;
}

export default connectRoutes;