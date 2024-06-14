import { Router } from "express"
import { verifyJWT } from "../../middlewares/authMiddlewares";
import { createOrder, createSubscriptionPlan, getSubscriptionPlans, savePaymentInfoToDb,saveFailedInfoToDb } from "../../controller/subscription.controller";


export const subscriptionRoutes = () => {
    const router = Router();
    router.use(verifyJWT)
    router.
        get('/', getSubscriptionPlans)
        .post('/', createSubscriptionPlan)
        router.post('/createOrder',createOrder)
    router.post('/orderSuccess', savePaymentInfoToDb)
    router.post('/orderFailed',saveFailedInfoToDb)
    return router;
}