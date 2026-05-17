import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { ErrorHandler } from "../middlewares/errorMiddleware.js";
import { Appointment } from "../models/appointmentSchema.js";
import { User } from "../models/userSchema.js";

export const postAppointment = catchAsyncErrors(async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    appointment_date,
    department,
    doctor_firstName,
    doctor_lastName,
    address,
    doctorId,
  } = req.body;

  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !nic ||
    !dob ||
    !gender ||
    !appointment_date ||
    !department ||
    !doctor_firstName ||
    !doctor_lastName ||
    !address ||
    !doctorId
  ) {
    return next(new ErrorHandler("Please fill full appointment form.", 400));
  }

  const doctor = await User.findOne({ _id: doctorId, role: "Doctor" });
  if (!doctor) return next(new ErrorHandler("Doctor not found.", 404));

  const appointment = await Appointment.create({
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    appointment_date,
    department,
    doctor: { firstName: doctor_firstName, lastName: doctor_lastName },
    address,
    doctorId,
    patientId: req.user._id,
  });

  res.status(201).json({
    success: true,
    message: "Appointment sent successfully.",
    appointment,
  });
});

export const getAllAppointments = catchAsyncErrors(async (req, res) => {
  const appointments = await Appointment.find()
    .populate("patientId", "firstName lastName email phone")
    .populate("doctorId", "firstName lastName doctorDepartment docAvatar.url");
  res.status(200).json({ success: true, appointments });
});

export const updateAppointmentStatus = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const {
    status,
    doctorSuggestedDate,
    doctorSuggestedTime,
    doctorMessage,
    doctor_response_date,
    doctor_response_time,
    doctor_message,
  } = req.body;
  const scheduledDate = doctorSuggestedDate || doctor_response_date;
  const scheduledTime = doctorSuggestedTime || doctor_response_time;
  const message = doctorMessage || doctor_message;

  if (!status) return next(new ErrorHandler("Status is required.", 400));
  if (!["Pending", "Accepted", "Rejected"].includes(status)) {
    return next(new ErrorHandler("Invalid status value.", 400));
  }

  const appointment = await Appointment.findById(id);
  if (!appointment) return next(new ErrorHandler("Appointment not found.", 404));

  if (req.user.role === "Doctor" && appointment.doctorId.toString() !== req.user._id.toString()) {
    return next(new ErrorHandler("You can only update your own appointments.", 403));
  }

  appointment.status = status;
  appointment.doctorMessage = message || appointment.doctorMessage || "";

  if (status === "Accepted") {
    if (req.user.role === "Doctor") {
      if (!scheduledDate || !scheduledTime) {
        return next(new ErrorHandler("Please provide your suggested date and time for accepted appointments.", 400));
      }
      appointment.doctorSuggestedDate = scheduledDate;
      appointment.doctorSuggestedTime = scheduledTime;
    }
    if (req.user.role === "Admin") {
      if (scheduledDate) appointment.doctorSuggestedDate = scheduledDate;
      if (scheduledTime) appointment.doctorSuggestedTime = scheduledTime;
    }
  } else {
    appointment.doctorSuggestedDate = "";
    appointment.doctorSuggestedTime = "";
  }

  await appointment.save();

  res.status(200).json({ success: true, message: "Appointment updated.", appointment });
});

export const deleteAppointment = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const appointment = await Appointment.findById(id);
  if (!appointment) return next(new ErrorHandler("Appointment not found.", 404));
  await appointment.deleteOne();
  res.status(200).json({ success: true, message: "Appointment deleted." });
});

export const getMyAppointmentsPatient = catchAsyncErrors(async (req, res) => {
  const appointments = await Appointment.find({ patientId: req.user._id }).sort({
    createdAt: -1,
  });
  res.status(200).json({ success: true, appointments });
});

export const getMyAppointmentsDoctor = catchAsyncErrors(async (req, res) => {
  const appointments = await Appointment.find({ doctorId: req.user._id }).sort({
    createdAt: -1,
  });
  res.status(200).json({ success: true, appointments });
});
