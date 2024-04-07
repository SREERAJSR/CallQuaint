import { Request, Response, Router } from "express";
import { loginUser, signupUser, verifyEmail } from "../../controller/user.controller";
import {routeSchemaValidator, authSingupSchemaValidator, authLoginSchemaValidator} from "../../validators/auth/user.validators";
import { validateItems } from "../../types/constants/validateItems";


const userRoutes = () => {
    const router = Router();
    router.post('/signup', authSingupSchemaValidator(validateItems.REQUEST_BODY), signupUser)
    router.post('/login',authLoginSchemaValidator(validateItems.REQUEST_BODY),loginUser)
    router.get('/verify/:verificationToken',routeSchemaValidator(validateItems.ROUTE_PARAMS), verifyEmail)

    return router
}
 
export default userRoutes; 