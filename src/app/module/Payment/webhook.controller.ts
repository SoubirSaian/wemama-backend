import { Request, Response } from "express";
import PaymentModel from "./Payment.model";
import { ENUM_PAYMENT_STATUS } from "../../../utilities/enum";
import OrderModel from "../Order/Order.model";
import PayoutModel from "./Payout.model";

export const paystackWebhookHandler = async (req: Request, res: Response) => {

  const event = req.body.event;
  const eventData = req.body.data;

  
  //webhook will hit after refund also
  try {
      if (event === "charge.success") {
        console.log("Payment Confirmed: webhook hit. ", eventData);
    
        // TODO: 
        // - update order/payment record in DB
        // Get existing payment record
        const payment = await PaymentModel.findOne({ reference: eventData?.reference });

        // Idempotency — avoid double update
            if (payment.status === ENUM_PAYMENT_STATUS.SUCCESS) {
                return res.status(200).send("Update payment already handled.");
            }

        const updatedPayment = await PaymentModel.findOneAndUpdate(
            { reference: eventData?.reference },
            {
                status: ENUM_PAYMENT_STATUS.SUCCESS,
                channel: eventData.channel,
                transactionId: eventData.id,
                paidAt: eventData.paid_at,
            },
            { new: true }
        );
        console.log("webhook payment data =====: ", updatedPayment);

        // - send email to user
        // send notification to user, admin
    
        return res.status(200).send("Webhook received");
      }
        // Handle Refund Processed
        else if (event === "refund.processed" || event === "charge.refund") {

            const reference = eventData?.transaction?.reference;

            console.log("Refund processed webhook hit",eventData);

            if (!reference) {
                return res.status(400).send("No reference found to update payment after refund");
            }

            // Get existing payment record
            const payment = await PaymentModel.findOne({ reference });

            if (!payment) {
                // logger?.error?.(`Refund webhook: payment not found for ${reference}`);
                return res.status(404).send("Payment not found to update with status refund.");
            }

            // Idempotency — avoid double update
            // if (payment.status === ENUM_PAYMENT_STATUS.REFUNDED) {
            //     return res.status(200).send("Payment Refund already handled");
            // }

            // Update Payment record
            await PaymentModel.findOneAndUpdate(
                { reference },
                {
                    status: ENUM_PAYMENT_STATUS.REFUNDED,
                    metadata: {
                        ...payment.metadata,
                        refund: {
                            refundId: eventData.id,
                            refundedAmount: eventData.amount / 100,
                            currency: eventData.currency,
                            refundedAt: eventData.processed_at,
                            reason: eventData.reason,
                        },
                    },
                }
            );

            // OPTIONAL: update the related order
            if (payment.orderId) {
                await OrderModel.findByIdAndUpdate(payment.orderId, {
                    paymentStatus: "Refunded",
                });
            }

            // logger?.info?.(`Refund processed for ${reference}`);

            return res.status(200).send("Refund processed.");

        }

        // Handle Refund Failure
        else if (event === "refund.failed") {
            const reference = eventData?.transaction?.reference;

            // logger?.error?.("Refund failed: ", data);
            console.log("Refund failed webhook hit.", eventData);

            // You can store failure logs
            await PaymentModel.findOneAndUpdate(
                { reference },
                {
                // status: ENUM_PAYMENT_STATUS.REFUND_PENDING,
                metadata: {
                    refundFailure: {
                        refundId: eventData.id,
                        amount: eventData.amount / 100,
                        failedAt: new Date(),
                        reason: eventData.status || "unknown",
                    },
                },
            }
            );

            return res.status(200).send("Refund failure logged.");
        }

        //handle payout transfer success and failure
        else if (event === "transfer.success") {
            const reference = event.data.reference;

            await PayoutModel.findOneAndUpdate(
            { reference, status: "PAYOUT_PROCESSING" },
            { status: "PAYOUT_SUCCESS" }
            );

            return res.status(200).send("Payout transfer handled successfully.");
        }

        else if (event === "transfer.failed" || event === "transfer.reversed") {
            const reference = event.data.reference;

            await PayoutModel.findOneAndUpdate(
            { reference },
            { status: "PAYOUT_FAILED" }
            );

            return res.status(200).send("Payout transfer failed.");
        }


        return res.status(200).send("Event ignored.");

    } catch (error: any) {
        console.error("Refund webhook error:", error.message);
        return res.status(500).send("Webhook Error");
    }
};


//   console.log("webhook failed to hit.")
//   return res.status(200).send("Event ignored");
// };
