import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import validator from "validator";

const docAvatarSchema = new mongoose.Schema(
  {
    public_id: String,
    url: String,
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
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
      unique: true,
      lowercase: true,
      trim: true,
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
    password: {
      type: String,
      required: [true, "Please enter your password."],
      minlength: [4, "Password must be at least 4 characters."],
      select: false,
    },
    role: {
      type: String,
      enum: ["Admin", "Patient", "Doctor"],
      required: [true, "Role is required."],
    },
    doctorDepartment: {
      type: String,
      default: null,
    },
    docAvatar: {
      type: docAvatarSchema,
      default: null,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function preSave(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function comparePassword(enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

export const User = mongoose.model("User", userSchema);
