import mongoose from "mongoose";
import validator from "validator";

const appointmentSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Please enter your first name."],
      minlength: [3, "First name must be at least 3 characters."],
    },
    lastName: {
      type: String,
      required: [true, "Please enter your last name."],
      minlength: [3, "Last name must be at least 3 characters."],
    },
    email: {
      type: String,
      required: [true, "Please enter your email."],
      validate: [validator.isEmail, "Please provide a valid email."],
    },
    phone: {
      type: String,
      required: [true, "Please enter your phone number."],
      validate: {
        validator: (v) => /^\d{11}$/.test(v),
        message: "Phone must be exactly 11 digits.",
      },
    },
    nic: {
      type: String,
      required: [true, "Please enter your NIC."],
      validate: {
        validator: (v) => /^\d{13}$/.test(v),
        message: "NIC must be exactly 13 digits.",
      },
    },
    dob: {
      type: Date,
      required: [true, "Please enter your date of birth."],
    },
    gender: {
      type: String,
      required: [true, "Please select your gender."],
      enum: ["Male", "Female", "Others"],
    },
    appointment_date: {
      type: String,
      required: [true, "Please select appointment date."],
    },
    department: {
      type: String,
      required: [true, "Please select department."],
    },
    doctor: {
      firstName: {
        type: String,
        required: [true, "Doctor first name is required."],
      },
      lastName: {
        type: String,
        required: [true, "Doctor last name is required."],
      },
    },
    hasVisited: {
      type: Boolean,
      default: false,
    },
    address: {
      type: String,
      required: [true, "Please enter your address."],
    },
    doctorId: {
      type: mongoose.Schema.ObjectId,
      required: [true, "Doctor id is required."],
      ref: "User",
    },
    patientId: {
      type: mongoose.Schema.ObjectId,
      required: [true, "Patient id is required."],
      ref: "User",
    },
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Rejected"],
      default: "Pending",
    },
    doctorSuggestedDate: {
      type: String,
      default: "",
    },
    doctorSuggestedTime: {
      type: String,
      default: "",
    },
    doctorMessage: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export const Appointment = mongoose.model("Appointment", appointmentSchema);
