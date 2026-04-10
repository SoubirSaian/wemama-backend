import express, { Application } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';
import allRouter from './app/routes';
// import {webhookRouter} from './app/module/Payment/Payment.routes';



const app: Application = express();

//use webhook route before app.use(express.json())
// app.use("/paystack", webhookRouter);

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

//cors
app.use(cors({
  origin: [
    "http://localhost:1001",
    "http://localhost:2002",
    "10.10.20.43:2002"
  ]
}));

app.use('/uploads', express.static('uploads'));

// application routers ----------------
app.use('/', allRouter);


app.get('/', (req, res) => {
  res.send("We mama server is running ---- Welcome");
});



// global error handler
app.use(globalErrorHandler);
// not found
app.use(notFound);

export default app;
