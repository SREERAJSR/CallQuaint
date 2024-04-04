import { Request, Response, Router } from "express";

const userRoutes = () => {
    const router = Router();
    router.get('/', async (req: Request, res: Response) => {
        res.send('welcome guys')
    })

    return router
}

export default userRoutes;