import { Request, Response, Router } from "express";
import { signupUser, verifyEmail } from "../../controller/user.controller";
import { schemaValidator,routeSchemaValidator} from "../../validators/auth/user.validators";
import { validateItems } from "../../types/constants/validateItems";


const userRoutes = () => {
    const router = Router();
    router.post('/signup', schemaValidator(validateItems.REQUEST_BODY), signupUser)
    router.get('/verify/:verificationToken',routeSchemaValidator(validateItems.ROUTE_PARAMS), verifyEmail)

    return router
}
 
export default userRoutes; 