import { model, Schema, models } from "mongoose";
import { IPayment } from "./Payment.interface";
import { ENUM_PAYMENT_STATUS } from "../../../utilities/enum";

const PaymentSchema = new Schema<IPayment>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true,"user id is required to make payment"],
    },
    transactionReference: {   // originalTransactionId (Apple) or purchaseToken (Google)
        type: String,
        required: false,
    },
    platform: {
        type: String,
        enum: ['apple', 'google'],
        required: true,
    },
    productId: { type: String , default: ''},        // subscription product ID
    subscriptionExpiresAt: { type: Date , default: null},
    autoRenewing: { type: Boolean, default: false },
    notificationType: { type: String, default: '' },
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
    metadata: {
      type: Object,
    },
    paidAt: {
        type: Date,
        default: Date.now
    }

    
  },
  {
    timestamps: true,
  }
);


const PaymentModel = models.Payment || model<IPayment>("Payment", PaymentSchema);

export default PaymentModel;