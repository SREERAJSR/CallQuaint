import { Socket } from "socket.io"
import { UserDocument } from "./usermodel.types"
import { Application } from "express";

export interface CustomSocketInterface extends Socket{
    user?: UserDocument;
}

export interface RequestSocketInterface extends Request{
    app:Application
}