import { Types } from "mongoose";

export interface IPayment extends Document {
  userId: Types.ObjectId;
  transactionReference: string;
  platform: string;
  productId: string;
  amount: number;
  currency: string;
  status: string;
  // channel?: string;        // card, bank, mobile_money, etc
 // Paystack transaction id
  metadata?: any;
  subscriptionExpiresAt: Date;
  autoRenewing: boolean;
  notificationType: string;
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
