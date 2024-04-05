import { Request, Response, Router } from "express";
import { signupUser, verifyUser } from "../controller/user-auth";
import { schemaValidator,routeSchemaValidator} from "../middlewares/schema-validator";
import { validateItems } from "../types/schema.types";


const userRoutes = () => {
    const router = Router();
    router.post('/signup', schemaValidator(validateItems.REQUEST_BODY), signupUser),
    router.get('/verify/:id/:token',routeSchemaValidator(validateItems.ROUTE_PARAMS),verifyUser)

    return router
}

export default userRoutes;