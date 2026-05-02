import mongoose from "mongoose";
import validator from "validator";

const messageSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Please enter your first name."],
      minlength: [2, "First name must be at least 2 characters."],
    },
    lastName: {
      type: String,
      required: [true, "Please enter your last name."],
      minlength: [2, "Last name must be at least 2 characters."],
    },
    email: {
      type: String,
      required: [true, "Please enter your email."],
      validate: [validator.isEmail, "Please provide a valid email."],
    },
    phone: {
      type: String,
      required: [true, "Please enter your phone number."],
      minlength: [10, "Phone must be at least 10 digits."],
    },
    message: {
      type: String,
      required: [true, "Please enter your message."],
    },
  },
  { timestamps: true }
);

export const Message = mongoose.model("Message", messageSchema);

