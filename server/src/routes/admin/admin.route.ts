import { Router } from "express"
import {
    loginAdmin, fetchDashBoardData, fetchAllUsers, blockUser,
    createSubscriptionPlan, getAllSubscriptonPlans,fetchSalesReports,logoutAdmin
} from "../../controller/admin.controller";
import { authLoginSchemaValidator } from "../../validators/auth/user.validators";
import { validateItems } from "../../types/constants/validateItems";
import { verifyJWT } from "../../middlewares/authMiddlewares";
import { mongoIdPathVariableValidator } from "../../validators/chat/chat.validator";

export const adminRoutes = () => {
    const router = Router();

    router.post('/login',authLoginSchemaValidator(validateItems.REQUEST_BODY), loginAdmin)
    router.get("/dashboard", fetchDashBoardData)
    router.get('/users', fetchAllUsers)
    router.patch('/block-user/:userId', mongoIdPathVariableValidator(validateItems.ROUTE_PARAMS, 'userId'), blockUser)
    router.get('/susbscriptions',getAllSubscriptonPlans)
        .post('/subscriptions', createSubscriptionPlan)
    router.get('/sales-report/:period', mongoIdPathVariableValidator(validateItems.ROUTE_PARAMS, 'period'), fetchSalesReports);
    router.post('/logout',logoutAdmin)
    return router
}