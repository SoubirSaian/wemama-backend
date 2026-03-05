import { model, Schema, models } from "mongoose";
import { IPayment } from "./Payment.interface";
import { ENUM_PAYMENT_STATUS } from "../../../utilities/enum";

const PaymentSchema = new Schema<IPayment>(
  {
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true,"Customer id is required to make payment"],
    },

    orderId: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: [true,"Order id is required to make payment."],
    },

    reference: {
      type: String,
      required: true,
      unique: [true,"Unique payment reference is required to make payment"],
    },

    provider: {
      type: String,
      enum: ["paystack"],
      default: "paystack",
    },

    amount: {
      type: Number,
      required: [true,"Amount is required to make payment"],
    },

    currency: {
      type: String,
      default: "NGN",
    },

    status: {
      type: String,
      enum: Object.values(ENUM_PAYMENT_STATUS),
      default: ENUM_PAYMENT_STATUS.PENDING,
    },

    channel: {
      type: String,
      default: ''
    },

    transactionId: {
      type: String,
      default: ''
    },

    metadata: {
      type: Object,
    },

    paidAt: {
        type: Date
    }

    
  },
  {
    timestamps: true,
  }
);


const PaymentModel = models.Payment || model<IPayment>("Payment", PaymentSchema);

export default PaymentModel;