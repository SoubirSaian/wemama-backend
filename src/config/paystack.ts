import axios from "axios";
import config from "../config";

export const paystackClient = axios.create({
  
  baseURL: config.paystack.paystack_base_url,

  headers: {
    Authorization: `Bearer ${config.paystack.paystack_secret_key}`,

    "Content-Type": "application/json",
  },
});
