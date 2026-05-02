import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { ErrorHandler } from "../middlewares/errorMiddleware.js";
import { Message } from "../models/messageSchema.js";

export const sendMessage = catchAsyncErrors(async (req, res, next) => {
  const { firstName, lastName, email, phone, message } = req.body;

  if (!firstName || !lastName || !email || !phone || !message) {
    return next(new ErrorHandler("Please fill full message form.", 400));
  }

  const newMessage = await Message.create({ firstName, lastName, email, phone, message });
  res.status(201).json({
    success: true,
    message: "Message sent successfully.",
    data: newMessage,
  });
});

export const getAllMessages = catchAsyncErrors(async (req, res) => {
  const messages = await Message.find().sort({ createdAt: -1 });
  res.status(200).json({ success: true, messages });
});

