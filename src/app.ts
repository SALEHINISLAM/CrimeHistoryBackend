import express, { Application, Request, Response } from 'express';
import cors from 'cors'
import router from './app/Routes';
import globalErrorHandler from './app/middleware/globalErrorHandler';
import notFound from './app/middleware/notFound';
import cookieParser from 'cookie-parser';
import config from './app/config';

const app:Application = express();

app.use(cookieParser())
app.use(cors({origin:config.mode==="Development"?config.devFrontEnd :config.prodFrontEnd,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE","PATCH"], 
}))
app.use(express.json())

const test= async(req:Request,res:Response)=>{
    console.log(req.body);
    res.send("Your super duper server is running")
}

app.get("/",test);

app.use("/api/v1",router)

//not found
app.use(notFound)

app.use(globalErrorHandler as express.ErrorRequestHandler)

export default app;