import { Types } from "mongoose";

export interface IPayment extends Document {
  customerId?: Types.ObjectId;
  orderId?: Types.ObjectId;

  reference: string;
  provider: "paystack";

  amount: number;
  currency: string;

  status: string;

  channel?: string;        // card, bank, mobile_money, etc
  transactionId?: string;  // Paystack transaction id

  metadata?: any;

  paidAt?: Date;
  
//   createdAt: Date;
//   updatedAt: Date;
}

export interface IPayout {
  orderId: Types.ObjectId,
  supplierId: Types.ObjectId,

  amount: Number,
  commission: Number,
  netAmount?: Number,

  status: String

  transferCode: String,
  attempts?: Number
  lastError?: String,
}

export interface IPaymentPayload {
  email: string;
  amount: number;
  metadata: {
    orderId: string;
    profileId: string;
    [key: string]: any;
  };
  // profileId: string;
  // orderId: string;
}

export interface ITransferRecipientPayload {
  name: string;
  accountNumber: string;
  bankCode: string;
}

export interface IInitiateTransferPayload {
  amount: number; // in kobo
  recipientCode: string;
  reference: string;
}
