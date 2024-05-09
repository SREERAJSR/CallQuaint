import { Application } from "express";
import configKey from "./configkeys";

const PORT = configKey().PORT || 3000;

const serverConfig =  (app: Application) => {
    app.listen(PORT,() => {
        console.log(`SERVER IS CONNECTED ${PORT}`);
    })  
    
} 
 
export default serverConfig;  