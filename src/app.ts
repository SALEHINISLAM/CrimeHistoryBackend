import express, { Application, Request, Response } from 'express';
import cors from 'cors'
import router from './app/Routes';
import globalErrorHandler from './app/middleware/globalErrorHandler';
import notFound from './app/middleware/notFound';

const app:Application = express();

app.use(cors())
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