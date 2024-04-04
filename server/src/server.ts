import express, { Application } from "express";

const app: Application = express();

app.listen(3000, () => {
    console.log('connected to 3000 port');
})

