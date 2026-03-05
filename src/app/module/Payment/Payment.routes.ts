import express from "express";
import { createPayment, verifyPaymentController, refundController, getBankList } from "./Payment.controller";
import { verifyPaystackWebhook } from "../../middlewares/verifyPaystackWebhook";
import { paystackWebhookHandler } from "./webhook.controller";
import PaymentValidations from "./Payment.validation";
import validateRequest from "../../middlewares/validateRequest";

const paymentRouter = express.Router();
const webhookRouter = express.Router();

paymentRouter.post("/initialize-payment", 
        validateRequest( PaymentValidations.CreatePaymentSchemaValidation),
        createPayment
);

paymentRouter.get("/verify-payment/:reference", verifyPaymentController);

paymentRouter.post("/refund-payment", refundController);

paymentRouter.get("/get-bank-list",
        getBankList
)


//webhook
// RAW BODY MIDDLEWARE
// router.use(express.raw({ type: "*/*" }));
paymentRouter.post("/webhook-v1-9e8f0soubir2025",
        express.raw({type: "*/*"}),
        // express.raw({ type: "application/json" }),
        verifyPaystackWebhook, 
        paystackWebhookHandler
);

export {paymentRouter,webhookRouter};
