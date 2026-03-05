import { IInitiateTransferPayload, ITransferRecipientPayload } from "../app/module/Payment/Payment.interface";
import { paystackClient } from "../config/paystack";


//initialize payment
export const initializePayment = async (email: string, amount: number, metadata?: any) => {

  const response = await paystackClient.post("/transaction/initialize", {
    email,
    amount: amount * 100,  // Paystack accepts amount in kobo/cent
    metadata,
  });

  return response.data;
};

//verify payment
export const verifyPayment = async (reference: string) => {

  const response = await paystackClient.get(`/transaction/verify/${reference}`);

  return response.data;
};

//refund payment
export const refundPayment = async (reference: string, amount?: number) => {
  const response = await paystackClient.post("/refund", {
    transaction: reference,
    amount: amount ? amount * 100 : undefined,
  });

  return response.data;
}

//create transfer recipient
export async function createTransferRecipient({name,accountNumber,bankCode}: ITransferRecipientPayload) {

  const response = await paystackClient.post("/transferrecipient", {
    type: "nuban",
    name,
    account_number: accountNumber,
    bank_code: bankCode,
    currency: "NGN"
  });

  if (!response.data.status) {
    throw new Error("Failed to create new paystack transfer receipent.",response.data.message);
  }

  return response.data.data.recipient_code;
}

//initiate transfer
export async function initiateTransfer({ amount, recipientCode, reference }: IInitiateTransferPayload) {

  const response = await paystackClient.post("/transfer", {
    source: "balance",
    amount: amount * 100, // in kobo
    recipient: recipientCode,
    reference
  });

  if (!response.data.status) {
    throw new Error("Failed to initiate transfer : ",response.data.message);
  }

  return {
    transferCode: response.data.data.transfer_code,
    reference: response.data.data.reference
  };
}

//get all banks from paystack
export const getAllNigerianBanks = async () => {
  const response = await paystackClient.get("/bank", {
    params: { country: "nigeria" }
  });

  return response.data.data;

}

//resolve bank account
export const resolveBankAccount = async (accountNumber: string, bankCode: string) => {
  // const { bankCode, accountNumber } = req.body;

  // if (!bankCode || !accountNumber) {
  //   return res.status(400).json({ message: "Invalid input" });
  // }

  const response = await paystackClient.get("/bank/resolve", {
    params: {
      account_number: accountNumber,
      bank_code: bankCode
    }
  });

  // if (!response.data.status) {
  //   return res.status(400).json({ message: "Account not found" });
  // }

  // return res.json({
  //   status: "success",
  //   accountName: response.data.data.account_name
  // });

  return response;
};

  

