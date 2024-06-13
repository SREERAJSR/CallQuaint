import { Router } from "express"
import { verifyJWT } from "../../middlewares/authMiddlewares";
import { createSubscriptionPlan, getSubscriptionPlans } from "../../controller/subscription.controller";


export const subscriptionRoutes = () => {
    const router = Router();
    router.use(verifyJWT)
    router.
        get('/', getSubscriptionPlans)
        .post('/',createSubscriptionPlan)
    return router;
}