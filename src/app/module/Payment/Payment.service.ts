import ApiError from "../../../error/ApiError";
import { IPayment, ITransferRecipientPayload } from "./Payment.interface";
import PaymentModel from "./Payment.model";

const updateUserProfile = async () => {
    
};

//Payout processing serice function
// async function processPayout(payoutId: string) {
//   const payout = await PayoutModel.findById(payoutId);
//   if (!payout) return;

//   if (payout.status !== "PAYOUT_PENDING") return;

//   payout.status = "PAYOUT_PROCESSING";
//   payout.attempts += 1;
//   await payout.save();

//   try {
//     const result = await initiateTransfer({
//       amount: payout.netAmount * 100,
//       recipientCode: payout.recipientCode,
//       reference: `payout_${payout._id}`
//     });

//     payout.transferCode = result.transferCode;
//     await payout.save();
//   } catch (err: any) {
//     payout.status = "PAYOUT_FAILED";
//     payout.lastError = err.message;
//     await payout.save();
//   }
// }



const PaymentServices = { updateUserProfile };
export default PaymentServices;