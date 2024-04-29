import { Request, Response, Router } from "express";
import {
    loginUser, signupUser, verifyEmail, refreshAccessToken,
    forgotPasswordRequest, resetPasswordRequest,handleSocialLogin
} from "../../controller/user.controller";
import {
    routeSchemaValidator, authSingupSchemaValidator,
    authLoginSchemaValidator, userForgotPasswordBodyValidator,
    userResetPasswordTokenValidator, userResetPasswordBodyValidator,
} from "../../validators/auth/user.validators";
import { validateItems } from "../../types/constants/validateItems";
import passport from "passport";
    

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
router.post("/google",passport.authenticate("google", { scope: ['profile', 'email'] }), (req: Request, res: Response, next) => {
        res.send('sucess'); 
    })
router.get("/google/callback", passport.authenticate('google',{ scope: ['profile', 'email'] }), handleSocialLogin)
    
    // router.get('/github', passport.authenticate('github', { scope: ["profile", "email"] }), (req, res) => {
    //     res.send('redirecting to github')
    // })

    // router.get('/github/callback',passport.authenticate('github'),handleSocialLogin)
    return router
} 
 
export default userRoutes; 