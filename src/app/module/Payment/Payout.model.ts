import { Schema, model, models } from "mongoose";
import {ENUM_PAYOUT_STATUS} from "../../../utilities/enum";
import {IPayout} from "./Payment.interface";

const PayoutSchema = new Schema<IPayout>({
  orderId: { type: Schema.Types.ObjectId, ref: 'Order' },
  supplierId: { type: Schema.Types.ObjectId, ref: 'Supplier' },

  amount: { type: Number, required: true },
  commission: { type: Number, required: true },
  netAmount: { type: Number, required: true },

  status: {
    type: String,
    enum: Object.values(ENUM_PAYOUT_STATUS),
    default: ENUM_PAYOUT_STATUS.NOT_ELIGIBLE
  },

  transferCode: { type: String, default: '' },
  attempts: { type: Number, default: 0 },
  lastError: {
     type: String,
     default: ''
  },

}, { timestamps: true });

const PayoutModel = models.Payout || model<IPayout>('Payout', PayoutSchema);

export default PayoutModel;
