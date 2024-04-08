import { Request, Response, Router } from "express";
import { loginUser, signupUser, verifyEmail ,refreshAccessToken ,forgotPasswordRequest, resetPasswordRequest} from "../../controller/user.controller";
import {
    routeSchemaValidator, authSingupSchemaValidator,
    authLoginSchemaValidator, userForgotPasswordBodyValidator,
    userResetPasswordTokenValidator, userResetPasswordBodyValidator,
} from "../../validators/auth/user.validators";
import { validateItems } from "../../types/constants/validateItems";


const userRoutes = () => {
    const router = Router();
    router.post('/signup', authSingupSchemaValidator(validateItems.REQUEST_BODY), signupUser)
    router.post('/login',authLoginSchemaValidator(validateItems.REQUEST_BODY),loginUser)
    router.get('/verify/:verificationToken', routeSchemaValidator(validateItems.ROUTE_PARAMS), verifyEmail)
    router.post('/refreshToken', refreshAccessToken)
    router.post('/forgot-password', userForgotPasswordBodyValidator(validateItems.REQUEST_BODY), forgotPasswordRequest)
    router.post('/reset-password/:resetToken',
        userResetPasswordTokenValidator(validateItems.ROUTE_PARAMS),
        userResetPasswordBodyValidator(validateItems.REQUEST_BODY),resetPasswordRequest)
       
 
    return router
}
 
export default userRoutes; 