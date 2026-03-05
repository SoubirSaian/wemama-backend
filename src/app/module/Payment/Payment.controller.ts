import { Request, Response } from "express";
import mongoose from "mongoose";
import { initializePayment, verifyPayment, refundPayment, getAllNigerianBanks } from "../../../helper/paystackHelper";
import PaymentModel from "./Payment.model";
import ApiError from "../../../error/ApiError";
import { ENUM_PAYMENT_STATUS } from "../../../utilities/enum";
import OrderModel from "../Order/Order.model";
import { success } from "zod";



export const createPayment = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const { email, amount, metadata, } = req.body;

    // 1️⃣ Call Paystack initialize
    const paystackResponse = await initializePayment(email, amount, metadata);

    if (!paystackResponse?.status || !paystackResponse?.data?.reference) {
      throw new ApiError(500, "Failed to initialize Paystack payment.");
    }

    const reference = paystackResponse.data.reference;

    // 2️⃣ Create payment record locally (atomic)
    const payment = await PaymentModel.create(
      [
        {
          customerId: metadata?.profileId,
          orderId: metadata?.orderId,
          amount,
          reference,
          metadata,
          status: ENUM_PAYMENT_STATUS.PENDING,
        },
      ],
      { session }
    );

    if (!payment || payment.length === 0) {
      throw new ApiError(500, "Failed to create payment record");
    }

    // 3️⃣ Update the order with reference (atomic)
    // const updatedOrder = await OrderModel.findByIdAndUpdate(
    //   metadata.orderId,
    //   {
    //     $set: {
    //       paymentStatus: "Pending",
    //       paymentReference: reference,
    //     },
    //   },
    //   { new: true, session }
    // );

    // if (!updatedOrder) {
    //   throw new ApiError(500, "Failed to update order payment status");
    // }

    // 4️⃣ Commit all DB operations
    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      success: true,
      message: "Payment initialized successfully",
      data: paystackResponse,
    });
  } catch (error: any) {
    console.log("Payment initialization failed:", error.message);

    // rollback all DB operations
    await session.abortTransaction();
    session.endSession();

    return res.status(500).json({
      status: "error",
      success: false,
      message: error.message || "Failed to initialize payment",
    });
  }
};


//verify payment controller
export const verifyPaymentController = async (req: Request, res: Response) => {
  try {

    const { reference } = req.params;

    const paystackData = await verifyPayment(reference);
    console.log("verify payment data ==== : ", paystackData);

    //update payment data
    const payment = await PaymentModel.findOneAndUpdate(
        { reference: reference },
        {
          status: paystackData.data.status === "success" ? ENUM_PAYMENT_STATUS.SUCCESS : ENUM_PAYMENT_STATUS.FAILED,
          channel: paystackData.data.channel,
          transactionId: paystackData.data.id,
          paidAt: paystackData.data.paid_at,
          metadata: paystackData.data.metadata,
        },
        { new: true }
    );
    console.log("Updated payment after verification === : ",payment);

    if(!payment){
        throw new ApiError(500,"Failed to update payment data after paystack verification")
    }
    return res.status(200).json({

      success: true,
      message: "Payment verified successfully.",
      data: paystackData,
    });
  } catch (error: any) {

    console.log("Failed to verify payment.");
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//refund payment controller
export const refundController = async (req: Request, res: Response) => {
  try {

    const { reference, amount } = req.body;

    const result = await refundPayment(reference, amount);
    console.log("Payment refunded ==== : ",result);

    //update payment data
    const payment = await PaymentModel.findOneAndUpdate(
        { reference: reference },
        { status: ENUM_PAYMENT_STATUS.REFUNDED },
        { new: true }
    );
    console.log("after successfull refund payment data ====: ",payment);

    //update payment status in the order model

    // if(!payment){
    //     throw new ApiError(500,"Failed to refund payment")
    // }

    return res.status(200).json({

      success: true,
      message: "Payment refunded successfully.",
      data: result,
    });

  } catch (error: any) {

    console.log("Failed to refund payment.");
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//get all banks from paystack
export const getBankList = async (req: Request, res: Response) => {
  
  const banks = await getAllNigerianBanks();
  // console.log("banks list from paystack ====== : ",banks);
  const allBank = banks.map((bank: { name: any; code: any; }) => ({
    name: bank.name,
    code: bank.code
  }));

  // console.log("allBank list ====== : ",allBank);

  return res.status(200).json({
    success: true,
    message: "Banks fetched successfully.",
    data: allBank,
  });

  
};




