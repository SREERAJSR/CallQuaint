import { Request, Response, Router } from "express";
import { signupUser } from "../controller/user-auth";


const userRoutes = () => {
    const router = Router();
    router.post('/signup',signupUser)

    return router
}

export default userRoutes;