import { Router } from "express"
import { loginAdmin } from "../../controller/admin.controller";

export const adminRoutes = () => {
    const router = Router();

    router.post('/login', loginAdmin)
    return router
}