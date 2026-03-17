import crypto from "crypto";
import { Request, Response, NextFunction } from "express";
import config from "../../config";

//how to generate random webhook secret key 
// node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"


export const verifyPaystackWebhook = (req: Request, res: Response, next: NextFunction) => {

    // Extra layer: Validate IP
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

    // const PAYSTACK_IPS = [
    //     "52.31.139.75",
    //     "52.49.173.169",
    //     "52.214.14.220",
    // ];

    // if (!PAYSTACK_IPS.includes(String(ip))) {
    //     console.log("Blocked invalid IP:", ip);
    //     return res.status(200).send("ignored: IP address is not valid");
    // }

  //check paystack webhook secret
  const hash = crypto
    .createHmac("sha512", config.paystack.paystack_webhook_secret as string)
    .update(JSON.stringify(req.body))
    .digest("hex");

  if (hash == req.headers["x-paystack-signature"]) {
    return next();
  }

  return res.status(401).json({ error: "Invalid signature" });

};
