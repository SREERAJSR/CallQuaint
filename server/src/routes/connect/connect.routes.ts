import { Router } from "express"
import { acceptFriendRequest, callSetup, fetchFriendRequestsFromDb, fetchFriendsList, getCallHistory, rejectFriendRequest, saveCallInfoToDb, sendFriendRequest } from "../../controller/connect.controller";
import { verifyJWT } from "../../middlewares/authMiddlewares";

const connectRoutes = () => { 
    const router = Router();

    router.get('/call', verifyJWT, callSetup),
        router.post('/saveCallInfo', verifyJWT, saveCallInfoToDb),
        router.get('/callhistory', verifyJWT, getCallHistory),
        router.post('/sendfriendrequest', verifyJWT, sendFriendRequest),
        router.get("/getfriendrequests", verifyJWT, fetchFriendRequestsFromDb),
        router.patch('/acceptrequest', verifyJWT, acceptFriendRequest),
        router.delete('/rejectfriendrequest', verifyJWT, rejectFriendRequest),
        router.get('/getFriends',verifyJWT,fetchFriendsList)
    return router;
}

export default connectRoutes;