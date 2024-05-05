import { Request, Response, Router } from "express";
import {
    loginUser, signupUser, verifyEmail, refreshAccessToken,
<<<<<<< Updated upstream
    forgotPasswordRequest, resetPasswordRequest,handleSocialLogin
=======
    forgotPasswordRequest, resetPasswordRequest,handleSocialLogin,
    logoutUser,
>>>>>>> Stashed changes
} from "../../controller/user.controller";
import {
    routeSchemaValidator, authSingupSchemaValidator,
    authLoginSchemaValidator, userForgotPasswordBodyValidator,
    userResetPasswordTokenValidator, userResetPasswordBodyValidator,
} from "../../validators/auth/user.validators";
import { validateItems } from "../../types/constants/validateItems";
import passport from "passport";
<<<<<<< Updated upstream
 
=======
import { verifyJWT } from "../../middlewares/authMiddlewares";
    
>>>>>>> Stashed changes

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
<<<<<<< Updated upstream
       
 
    router.get("/google", passport.authenticate("google", { scope: ['profile', 'email'] }), (req: Request, res: Response, next)=>{
        res.send('sucess'); 
    })

    router.get("/google/callback", passport.authenticate('google'), handleSocialLogin)
    
    // router.get('/github', passport.authenticate('github', { scope: ["profile", "email"] }), (req, res) => {
    //     res.send('redirecting to github')
    // })
=======
    router.post('/google', handleSocialLogin),
        
    router.post('/logout',verifyJWT,logoutUser)
>>>>>>> Stashed changes

    return router
} 
 
export default userRoutes; 