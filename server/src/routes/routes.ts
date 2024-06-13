import express ,{ Application, Router} from "express";
import userRoutes from "./auth/user-auth.route";
import connectRoutes from "./connect/connect.routes";
import { chatRoutes } from "./chat/chat.routes";
import { messageRoutes } from "./chat/message.routes";
import { subscriptionRoutes } from "./subscription/subscription.routes";


const routesConfig = (app: Application) => {
  app.use('/api/v1/user', userRoutes()),
    app.use('/api/v1/user/connect', connectRoutes()),
    app.use('/api/v1/user/chat', chatRoutes()),
    app.use('/api/v1/user/messages', messageRoutes()),
    app.use('/api/v1/user/subscription',subscriptionRoutes())
}

export default routesConfig;
