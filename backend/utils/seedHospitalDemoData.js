import { Appointment } from "../models/appointmentSchema.js";
import { User } from "../models/userSchema.js";

const DEMO_DOMAIN = "hms-demo.local";
const DEMO_PASSWORD = "password123";

const doctors = [
  ["Aarav", "Mehta", "Cardiology"],
  ["Nisha", "Kapoor", "Neurology"],
  ["Rohan", "Iyer", "Orthopedics"],
  ["Sana", "Khan", "Pediatrics"],
  ["Meera", "Rao", "Gynecology"],
  ["Kabir", "Sharma", "ENT"],
  ["Priya", "Nair", "Dermatology"],
  ["Vikram", "Sethi", "Radiology"],
  ["Ananya", "Bose", "Oncology"],
].map(([firstName, lastName, doctorDepartment], index) => ({
  firstName,
  lastName,
  email: `doctor.${doctorDepartment.toLowerCase()}@${DEMO_DOMAIN}`,
  phone: `9800001${String(index).padStart(4, "0")}`,
  nic: `9100000000${String(index).padStart(3, "0")}`,
  dob: `${1978 + index}-0${(index % 8) + 1}-15`,
  gender: index % 3 === 0 ? "Female" : "Male",
  password: DEMO_PASSWORD,
  role: "Doctor",
  doctorDepartment,
  docAvatar: null,
}));

const patients = [
  ["Rajesh", "Verma", "Male", "1982-04-12"],
  ["Kavita", "Joshi", "Female", "1991-09-02"],
  ["Imran", "Sheikh", "Male", "1974-12-20"],
  ["Pooja", "Patel", "Female", "1998-02-11"],
  ["Suresh", "Yadav", "Male", "1965-07-18"],
  ["Amina", "Ansari", "Female", "2019-10-05"],
  ["Neha", "Gupta", "Female", "1988-01-25"],
  ["Arjun", "Singh", "Male", "2004-06-14"],
  ["Farah", "Qureshi", "Female", "1995-03-30"],
  ["Dev", "Malhotra", "Male", "1979-11-08"],
  ["Ritika", "Saxena", "Female", "2016-05-21"],
  ["Manoj", "Kumar", "Male", "1959-08-09"],
  ["Tanya", "Roy", "Female", "1993-12-01"],
  ["Harsh", "Chauhan", "Male", "1986-09-17"],
].map(([firstName, lastName, gender, dob], index) => ({
  firstName,
  lastName,
  email: `patient.${String(index + 1).padStart(2, "0")}@${DEMO_DOMAIN}`,
  phone: `9700002${String(index).padStart(4, "0")}`,
  nic: `9200000000${String(index).padStart(3, "0")}`,
  dob,
  gender,
  password: DEMO_PASSWORD,
  role: "Patient",
}));

const appointmentPlan = [
  ["Cardiology", 0, 0, "Accepted", true, "shortness of breath and high BP"],
  ["Neurology", 1, -8, "Accepted", false, "migraine and dizziness"],
  ["Orthopedics", 2, 2, "Pending", false, "knee pain after fall"],
  ["Pediatrics", 3, 1, "Pending", false, "fever and cough"],
  ["Gynecology", 4, 4, "Accepted", false, "pregnancy follow-up"],
  ["ENT", 5, -3, "Rejected", false, "throat infection"],
  ["Dermatology", 6, 5, "Pending", false, "skin allergy"],
  ["Radiology", 7, 3, "Accepted", false, "ultrasound review"],
  ["Oncology", 8, 6, "Pending", false, "screening follow-up"],
  ["Cardiology", 9, -1, "Accepted", true, "chest pain follow-up"],
  ["Neurology", 10, 7, "Pending", false, "seizure review"],
  ["Orthopedics", 11, -10, "Accepted", false, "back pain"],
  ["Pediatrics", 12, 8, "Accepted", false, "vaccination"],
  ["ENT", 13, 9, "Pending", false, "ear infection"],
  ["Dermatology", 1, 10, "Accepted", false, "acne treatment"],
  ["Cardiology", 2, 11, "Pending", false, "palpitation"],
  ["Neurology", 3, 12, "Accepted", false, "nerve pain"],
  ["Radiology", 4, -5, "Accepted", true, "x-ray follow-up"],
  ["Gynecology", 5, 13, "Pending", false, "PCOS consultation"],
  ["Oncology", 6, 14, "Accepted", false, "chemotherapy follow-up"],
  ["Orthopedics", 7, 15, "Rejected", false, "joint pain"],
  ["Pediatrics", 8, 16, "Pending", false, "viral fever"],
  ["ENT", 9, 17, "Accepted", false, "sinusitis"],
  ["Dermatology", 10, -2, "Accepted", true, "rash treatment"],
  ["Cardiology", 11, 18, "Pending", false, "hypertension"],
  ["Neurology", 12, 19, "Accepted", false, "stroke risk review"],
  ["Radiology", 13, 20, "Pending", false, "MRI report"],
  ["Gynecology", 0, 21, "Accepted", false, "menstrual disorder"],
  ["Oncology", 1, 22, "Pending", false, "tumor review"],
  ["Orthopedics", 2, 23, "Accepted", false, "fracture review"],
  ["Pediatrics", 3, -6, "Accepted", true, "cough syrup review"],
  ["ENT", 4, 24, "Pending", false, "hearing issue"],
  ["Dermatology", 5, 25, "Accepted", false, "itching and allergy"],
  ["Cardiology", 6, 26, "Accepted", false, "ECG follow-up"],
  ["Neurology", 7, 27, "Pending", false, "weakness and dizziness"],
  ["Radiology", 8, 28, "Accepted", false, "CT scan follow-up"],
];

const addDays = (date, days) => {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy;
};

const dateKey = (date) => date.toISOString().slice(0, 10);

const upsertUser = async (userData) => {
  const existing = await User.findOne({ email: userData.email });
  if (!existing) return User.create(userData);

  const allowedFields = [
    "firstName",
    "lastName",
    "phone",
    "nic",
    "dob",
    "gender",
    "role",
    "doctorDepartment",
    "docAvatar",
  ];

  allowedFields.forEach((field) => {
    if (typeof userData[field] !== "undefined") existing[field] = userData[field];
  });

  await existing.save();
  return existing;
};

export const seedHospitalDemoData = async () => {
  const createdDoctors = await Promise.all(doctors.map(upsertUser));
  const createdPatients = await Promise.all(patients.map(upsertUser));
  const doctorByDepartment = createdDoctors.reduce((acc, doctor) => {
    acc[doctor.doctorDepartment] = doctor;
    return acc;
  }, {});

  await Appointment.deleteMany({ email: new RegExp(`@${DEMO_DOMAIN}$`) });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const appointments = appointmentPlan.map(([department, patientIndex, dayOffset, status, hasVisited, note], index) => {
    const patient = createdPatients[patientIndex % createdPatients.length];
    const doctor = doctorByDepartment[department];
    const appointmentDate = dateKey(addDays(today, dayOffset));
    const isAccepted = status === "Accepted";
    const scheduledDate = isAccepted ? dateKey(addDays(today, Math.max(dayOffset, 0) + 1)) : "";

    return {
      firstName: patient.firstName,
      lastName: patient.lastName,
      email: patient.email,
      phone: patient.phone,
      nic: patient.nic,
      dob: patient.dob,
      gender: patient.gender,
      appointment_date: appointmentDate,
      department,
      doctor: {
        firstName: doctor.firstName,
        lastName: doctor.lastName,
      },
      hasVisited,
      address: `${42 + index}, Hospital Road, Raipur`,
      doctorId: doctor._id,
      patientId: patient._id,
      status,
      doctorSuggestedDate: scheduledDate,
      doctorSuggestedTime: isAccepted ? `${9 + (index % 7)}:${index % 2 ? "30" : "00"}` : "",
      doctorMessage: isAccepted ? `Bring previous reports for ${note}.` : "",
    };
  });

  await Appointment.insertMany(appointments);

  return {
    doctors: createdDoctors.length,
    patients: createdPatients.length,
    appointments: appointments.length,
  };
};
