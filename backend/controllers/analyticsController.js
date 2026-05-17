import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { Appointment } from "../models/appointmentSchema.js";
import { User } from "../models/userSchema.js";

const CONSULTATION_FEE = 500;

const DEPARTMENT_DISEASE_MAP = {
  Cardiology: ["Hypertension", "Chest pain", "Arrhythmia"],
  Dermatology: ["Skin allergy", "Acne", "Rash"],
  ENT: ["Sinusitis", "Ear infection", "Throat infection"],
  Gynecology: ["Pregnancy care", "PCOS", "Menstrual disorder"],
  Neurology: ["Migraine", "Seizure", "Nerve pain"],
  Oncology: ["Cancer screening", "Chemotherapy follow-up", "Tumor review"],
  Orthopedics: ["Back pain", "Fracture", "Joint pain"],
  Pediatrics: ["Fever", "Cough", "Vaccination"],
  Radiology: ["Imaging review", "X-ray follow-up", "Ultrasound review"],
};

const MEDICINE_FORECAST_MAP = {
  Cardiology: ["Amlodipine", "Aspirin", "Atorvastatin"],
  Dermatology: ["Cetirizine", "Clotrimazole cream", "Calamine lotion"],
  ENT: ["Azithromycin", "Paracetamol", "Saline spray"],
  Gynecology: ["Folic acid", "Iron tablets", "Calcium tablets"],
  Neurology: ["Sumatriptan", "Gabapentin", "Vitamin B12"],
  Oncology: ["Ondansetron", "Pain management kit", "Sterile dressing"],
  Orthopedics: ["Ibuprofen", "Calcium tablets", "Vitamin D3"],
  Pediatrics: ["Paracetamol syrup", "ORS", "Cough syrup"],
  Radiology: ["Contrast kit", "Sterile gel", "Film pack"],
};

const SEASONAL_DISEASES = {
  0: ["Cold", "Flu", "Asthma flare-up"],
  1: ["Flu", "Bronchitis", "Skin dryness"],
  2: ["Allergy", "Migraine", "Viral fever"],
  3: ["Allergy", "Heat rash", "Dehydration"],
  4: ["Heat stroke", "Food poisoning", "Dehydration"],
  5: ["Typhoid", "Gastroenteritis", "Dengue watch"],
  6: ["Dengue", "Malaria", "Viral fever"],
  7: ["Dengue", "Malaria", "Skin infection"],
  8: ["Viral fever", "Dengue", "Respiratory infection"],
  9: ["Asthma flare-up", "Cold", "Allergy"],
  10: ["Flu", "Cough", "Throat infection"],
  11: ["Cold", "Flu", "Pneumonia watch"],
};

const EMERGENCY_KEYWORDS = ["chest pain", "unconscious", "stroke", "bleeding", "breathing", "seizure"];

const SYMPTOM_RULES = [
  {
    department: "Cardiology",
    keywords: ["chest", "heart", "bp", "pressure", "palpitation"],
    conditions: ["Hypertension", "Chest pain", "Arrhythmia"],
  },
  {
    department: "Neurology",
    keywords: ["headache", "migraine", "seizure", "weakness", "stroke", "dizzy"],
    conditions: ["Migraine", "Seizure", "Stroke risk"],
  },
  {
    department: "ENT",
    keywords: ["ear", "throat", "sinus", "cough", "cold", "nose"],
    conditions: ["Sinusitis", "Throat infection", "Ear infection"],
  },
  {
    department: "Orthopedics",
    keywords: ["bone", "joint", "fracture", "back", "knee", "pain"],
    conditions: ["Joint pain", "Back pain", "Fracture review"],
  },
  {
    department: "Dermatology",
    keywords: ["skin", "rash", "itching", "acne", "allergy"],
    conditions: ["Skin allergy", "Rash", "Acne"],
  },
  {
    department: "Pediatrics",
    keywords: ["child", "baby", "fever", "vaccination", "pediatric"],
    conditions: ["Fever", "Cough", "Vaccination"],
  },
  {
    department: "Gynecology",
    keywords: ["pregnancy", "period", "pcos", "women", "gyne"],
    conditions: ["Pregnancy care", "PCOS", "Menstrual disorder"],
  },
];

const toDate = (value) => {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const appointmentDate = (appointment) => toDate(`${appointment.appointment_date}T00:00:00`);

const startOfDay = (date) => {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
};

const addDays = (date, days) => {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy;
};

const sameDay = (a, b) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

const monthKey = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

const dayKey = (date) => date.toISOString().slice(0, 10);

const percent = (value, total) => (total ? Math.round((value / total) * 100) : 0);

const sortTop = (items, limit = 8) => [...items].sort((a, b) => b.value - a.value).slice(0, limit);

const riskLevel = (score) => (score >= 75 ? "High" : score >= 45 ? "Medium" : "Low");

const ageFromDob = (dob) => {
  const birthDate = toDate(dob);
  if (!birthDate) return null;
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDelta = today.getMonth() - birthDate.getMonth();
  if (monthDelta < 0 || (monthDelta === 0 && today.getDate() < birthDate.getDate())) age -= 1;
  return age >= 0 && age < 130 ? age : null;
};

const countBy = (items, getKey) => {
  const map = new Map();
  items.forEach((item) => {
    const key = getKey(item) || "Unknown";
    map.set(key, (map.get(key) || 0) + 1);
  });
  return [...map.entries()].map(([label, value]) => ({ label, value }));
};

const buildVisits = (appointments) => {
  const today = startOfDay(new Date());
  const dated = appointments.map((appointment) => ({ appointment, date: appointmentDate(appointment) })).filter((item) => item.date);
  const daily = dated.filter((item) => sameDay(item.date, today)).length;
  const weekly = dated.filter((item) => item.date >= addDays(today, -6) && item.date <= addDays(today, 1)).length;
  const monthly = dated.filter(
    (item) => item.date.getMonth() === today.getMonth() && item.date.getFullYear() === today.getFullYear()
  ).length;

  const lastSevenDays = Array.from({ length: 7 }, (_, index) => {
    const date = addDays(today, index - 6);
    return {
      label: dayKey(date),
      value: dated.filter((item) => sameDay(item.date, date)).length,
    };
  });

  return { daily, weekly, monthly, lastSevenDays };
};

const buildDiseaseCounts = (appointments) => {
  const diseaseCounts = new Map();
  appointments.forEach((appointment) => {
    const diseases = DEPARTMENT_DISEASE_MAP[appointment.department] || ["General consultation"];
    diseases.forEach((disease, index) => {
      const weight = Math.max(1, diseases.length - index);
      diseaseCounts.set(disease, (diseaseCounts.get(disease) || 0) + weight);
    });
  });

  return sortTop([...diseaseCounts.entries()].map(([label, value]) => ({ label, value })), 10);
};

const buildRevenue = (appointments) => {
  const accepted = appointments.filter((appointment) => appointment.status === "Accepted" || appointment.hasVisited);
  const monthlyMap = new Map();
  const departmentMap = new Map();

  accepted.forEach((appointment) => {
    const date = appointmentDate(appointment) || toDate(appointment.createdAt) || new Date();
    const key = monthKey(date);
    monthlyMap.set(key, (monthlyMap.get(key) || 0) + CONSULTATION_FEE);
    departmentMap.set(appointment.department, (departmentMap.get(appointment.department) || 0) + CONSULTATION_FEE);
  });

  return {
    monthly: [...monthlyMap.entries()].map(([label, value]) => ({ label, value })).sort((a, b) => a.label.localeCompare(b.label)),
    byDepartment: sortTop([...departmentMap.entries()].map(([label, value]) => ({ label, value })), 8),
    totalEstimated: accepted.length * CONSULTATION_FEE,
    note: "Revenue is estimated from accepted appointments because billing records are not stored yet.",
  };
};

const buildAppointmentPrediction = (appointments) => {
  const timeSlots = [
    { label: "09:00 - 11:00", value: 0 },
    { label: "11:00 - 13:00", value: 0 },
    { label: "14:00 - 16:00", value: 0 },
    { label: "16:00 - 18:00", value: 0 },
  ];

  appointments.forEach((appointment, index) => {
    const created = toDate(appointment.createdAt);
    const hour = created?.getHours();
    const slotIndex =
      hour >= 9 && hour < 11 ? 0 : hour >= 11 && hour < 13 ? 1 : hour >= 14 && hour < 16 ? 2 : (index + appointment.department.length) % 4;
    timeSlots[slotIndex].value += 1;
  });

  const noShowRisk = appointments
    .map((appointment) => {
      const date = appointmentDate(appointment);
      const isPast = date ? date < startOfDay(new Date()) : false;
      let score = 18;
      if (appointment.status === "Pending") score += 32;
      if (appointment.status === "Rejected") score += 20;
      if (isPast && !appointment.hasVisited) score += 28;
      if (!appointment.doctorSuggestedDate && appointment.status === "Accepted") score += 8;
      return {
        patient: `${appointment.firstName} ${appointment.lastName}`,
        department: appointment.department,
        appointmentDate: appointment.appointment_date,
        status: appointment.status,
        score: Math.min(score, 95),
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 8);

  return {
    rushTimeSlots: timeSlots.sort((a, b) => b.value - a.value),
    noShowRisk,
    busiestSlot: [...timeSlots].sort((a, b) => b.value - a.value)[0],
  };
};

const buildDiseaseTrend = (appointments) => {
  const currentMonth = new Date().getMonth();
  const seasonal = SEASONAL_DISEASES[currentMonth].map((label, index) => ({
    label,
    value: Math.max(4, appointments.length + (3 - index) * 2),
  }));

  return {
    commonPatterns: buildDiseaseCounts(appointments),
    seasonal,
    note: "Disease trends are estimated from department demand until symptom and diagnosis fields are added.",
  };
};

const buildInventoryForecast = (appointments) => {
  const demand = new Map();
  appointments.forEach((appointment) => {
    const medicines = MEDICINE_FORECAST_MAP[appointment.department] || ["General medicine kit"];
    medicines.forEach((medicine, index) => {
      demand.set(medicine, (demand.get(medicine) || 0) + Math.max(1, medicines.length - index));
    });
  });

  return sortTop([...demand.entries()].map(([label, demandScore], index) => {
    const currentStock = Math.max(8, 42 - index * 5 - demandScore);
    const reorderPoint = Math.max(12, Math.round(demandScore * 1.5));
    return {
      label,
      value: demandScore,
      currentStock,
      reorderPoint,
      reorderNeeded: currentStock <= reorderPoint,
      forecastUsage: Math.max(5, Math.round(demandScore * 1.2)),
    };
  }), 10);
};

const buildWorkload = (appointments, doctors) => {
  const doctorCounts = countBy(appointments, (appointment) =>
    appointment.doctor?.firstName
      ? `Dr. ${appointment.doctor.firstName} ${appointment.doctor.lastName || ""}`.trim()
      : "Unassigned"
  );
  const max = Math.max(...doctorCounts.map((item) => item.value), 1);

  return {
    doctorWise: sortTop(doctorCounts, 10).map((item) => ({
      ...item,
      utilization: percent(item.value, max),
    })),
    opdIpd: [
      { label: "OPD", value: appointments.length },
      { label: "IPD estimate", value: appointments.filter((appointment) => appointment.status === "Accepted").length },
    ],
    staffUtilization: doctors.map((doctor) => {
      const name = `Dr. ${doctor.firstName} ${doctor.lastName}`.trim();
      const matched = doctorCounts.find((item) => item.label === name);
      return {
        label: name,
        department: doctor.doctorDepartment || "General",
        value: matched?.value || 0,
        utilization: percent(matched?.value || 0, max),
      };
    }),
  };
};

const buildDemandForecast = (appointments, doctors) => {
  const today = startOfDay(new Date());
  const departments = [
    ...new Set([
      ...appointments.map((appointment) => appointment.department).filter(Boolean),
      ...doctors.map((doctor) => doctor.doctorDepartment).filter(Boolean),
    ]),
  ];

  const dated = appointments.map((appointment) => ({ appointment, date: appointmentDate(appointment) })).filter((item) => item.date);
  const doctorCapacity = countBy(doctors, (doctor) => doctor.doctorDepartment || "General").reduce((acc, item) => {
    acc[item.label] = item.value;
    return acc;
  }, {});

  const departmentForecast = departments.map((department) => {
    const departmentAppointments = appointments.filter((appointment) => appointment.department === department);
    const recent7 = dated.filter(
      (item) => item.appointment.department === department && item.date >= addDays(today, -6) && item.date <= today
    ).length;
    const next14 = dated.filter(
      (item) => item.appointment.department === department && item.date >= today && item.date <= addDays(today, 13)
    ).length;
    const pending = departmentAppointments.filter((appointment) => appointment.status === "Pending").length;
    const accepted = departmentAppointments.filter((appointment) => appointment.status === "Accepted").length;
    const doctorCount = doctorCapacity[department] || 0;
    const dailyCapacity = Math.max(doctorCount * 8, 4);
    const projectedDaily = Math.max(1, Math.round((recent7 / 7) * 0.45 + (next14 / 14) * 0.4 + (departmentAppointments.length / 30) * 0.15));
    const loadScore = Math.min(100, Math.round((projectedDaily / dailyCapacity) * 100 + pending * 5));

    return {
      label: department,
      value: projectedDaily,
      doctorCount,
      dailyCapacity,
      accepted,
      pending,
      projectedDaily,
      loadScore,
      risk: riskLevel(loadScore),
      action:
        loadScore >= 75
          ? "Add slots or shift doctor capacity."
          : loadScore >= 45
            ? "Monitor appointments and pending requests."
            : "Capacity is stable.",
    };
  });

  const next14Days = Array.from({ length: 14 }, (_, index) => {
    const date = addDays(today, index);
    const booked = dated.filter((item) => sameDay(item.date, date)).length;
    const weekdayFactor = [0, 6].includes(date.getDay()) ? 0.75 : 1.15;
    const projected = Math.max(booked, Math.round((appointments.length / 14) * weekdayFactor));
    return {
      label: dayKey(date).slice(5),
      value: projected,
      booked,
      risk: riskLevel(Math.min(100, projected * 12)),
    };
  });

  return {
    next14Days,
    departmentForecast: departmentForecast.sort((a, b) => b.loadScore - a.loadScore),
    highDemandDepartments: departmentForecast.filter((item) => item.risk !== "Low").sort((a, b) => b.loadScore - a.loadScore),
  };
};

const buildQueueForecast = (appointments) => {
  const slots = [
    { label: "09:00 - 11:00", start: 9, end: 11, value: 0, pending: 0 },
    { label: "11:00 - 13:00", start: 11, end: 13, value: 0, pending: 0 },
    { label: "14:00 - 16:00", start: 14, end: 16, value: 0, pending: 0 },
    { label: "16:00 - 18:00", start: 16, end: 18, value: 0, pending: 0 },
  ];

  appointments.forEach((appointment, index) => {
    const created = toDate(appointment.createdAt);
    const hour = created?.getHours();
    const slotIndex =
      hour >= 9 && hour < 11 ? 0 : hour >= 11 && hour < 13 ? 1 : hour >= 14 && hour < 16 ? 2 : index % slots.length;
    slots[slotIndex].value += 1;
    if (appointment.status === "Pending") slots[slotIndex].pending += 1;
  });

  return slots
    .map((slot) => {
      const waitMinutes = Math.min(120, 10 + slot.value * 12 + slot.pending * 8);
      return {
        label: slot.label,
        value: waitMinutes,
        appointments: slot.value,
        pending: slot.pending,
        risk: riskLevel(Math.min(100, waitMinutes)),
        action: waitMinutes >= 75 ? "Open overflow queue." : waitMinutes >= 45 ? "Keep one backup slot ready." : "Normal queue.",
      };
    })
    .sort((a, b) => b.value - a.value);
};

const buildPatientRiskSegmentation = (appointments) => {
  const patients = appointments
    .map((appointment) => {
      const age = ageFromDob(appointment.dob);
      const date = appointmentDate(appointment);
      const isPast = date ? date < startOfDay(new Date()) : false;
      let score = 18;
      if (appointment.status === "Pending") score += 20;
      if (appointment.status === "Rejected") score += 16;
      if (isPast && !appointment.hasVisited) score += 24;
      if (["Cardiology", "Neurology", "Oncology"].includes(appointment.department)) score += 18;
      if (age !== null && age >= 60) score += 14;
      if (age !== null && age <= 5) score += 10;
      if (!appointment.doctorSuggestedDate && appointment.status === "Accepted") score += 8;

      return {
        patient: `${appointment.firstName} ${appointment.lastName}`,
        department: appointment.department,
        age,
        status: appointment.status,
        appointmentDate: appointment.appointment_date,
        value: Math.min(score, 100),
        risk: riskLevel(Math.min(score, 100)),
      };
    })
    .sort((a, b) => b.value - a.value);

  return {
    highRisk: patients.filter((item) => item.risk === "High").length,
    mediumRisk: patients.filter((item) => item.risk === "Medium").length,
    lowRisk: patients.filter((item) => item.risk === "Low").length,
    topPatients: patients.slice(0, 8),
  };
};

const buildResourceOptimizer = (appointments, doctors, demandForecast) => {
  const doctorLoads = countBy(appointments, (appointment) =>
    appointment.doctor?.firstName ? `Dr. ${appointment.doctor.firstName} ${appointment.doctor.lastName || ""}`.trim() : "Unassigned"
  );
  const maxLoad = Math.max(...doctorLoads.map((item) => item.value), 1);
  const averageLoad = doctors.length ? Math.round(appointments.length / doctors.length) : 0;

  const doctorUtilization = doctors.map((doctor) => {
    const label = `Dr. ${doctor.firstName} ${doctor.lastName}`.trim();
    const matched = doctorLoads.find((item) => item.label === label);
    const value = matched?.value || 0;
    const utilization = percent(value, maxLoad);
    return {
      label,
      department: doctor.doctorDepartment || "General",
      value,
      utilization,
      risk: utilization >= 85 ? "High" : utilization >= 50 ? "Medium" : "Low",
      action:
        utilization >= 85
          ? "Reduce load or assign backup doctor."
          : utilization <= 25
            ? "Can receive extra appointments."
            : "Balanced.",
    };
  });

  const departmentGaps = (demandForecast.departmentForecast || []).map((item) => {
    const requiredDoctors = Math.max(1, Math.ceil(item.projectedDaily / 8));
    const gap = Math.max(0, requiredDoctors - item.doctorCount);
    return {
      label: item.label,
      value: gap,
      requiredDoctors,
      availableDoctors: item.doctorCount,
      risk: gap > 0 ? "High" : item.risk,
      action: gap > 0 ? `Need ${gap} more doctor slot(s).` : "Doctor capacity matches forecast.",
    };
  });

  return {
    averageLoad,
    doctorUtilization: doctorUtilization.sort((a, b) => b.utilization - a.utilization),
    departmentGaps: departmentGaps.sort((a, b) => b.value - a.value || b.requiredDoctors - a.requiredDoctors),
  };
};

const buildAnomalyDetection = (appointments) => {
  const today = startOfDay(new Date());
  const dated = appointments.map((appointment) => ({ appointment, date: appointmentDate(appointment) })).filter((item) => item.date);
  const signals = [];

  countBy(appointments, (appointment) => `${appointment.email}-${appointment.department}-${appointment.appointment_date}`)
    .filter((item) => item.value > 1)
    .forEach((item) => {
      signals.push({
        label: "Duplicate booking pattern",
        value: item.value,
        risk: "Medium",
        detail: `${item.value} similar appointments found.`,
      });
    });

  const overduePending = dated.filter((item) => item.appointment.status === "Pending" && item.date < today).length;
  if (overduePending) {
    signals.push({
      label: "Overdue pending requests",
      value: overduePending,
      risk: overduePending >= 5 ? "High" : "Medium",
      detail: "Pending appointments are past requested date.",
    });
  }

  countBy(appointments, (appointment) => appointment.department).forEach((department) => {
    const recent = dated.filter((item) => item.appointment.department === department.label && item.date >= addDays(today, -6)).length;
    const previous = dated.filter(
      (item) => item.appointment.department === department.label && item.date >= addDays(today, -13) && item.date < addDays(today, -6)
    ).length;
    if (recent >= Math.max(3, previous * 2)) {
      signals.push({
        label: `${department.label} demand spike`,
        value: recent,
        risk: recent >= 8 ? "High" : "Medium",
        detail: `Recent demand is above previous week baseline (${previous}).`,
      });
    }
  });

  if (!signals.length) {
    signals.push({
      label: "No unusual operational anomaly",
      value: 0,
      risk: "Low",
      detail: "Current appointments are within expected patterns.",
    });
  }

  return signals.slice(0, 8);
};

const recommendFromSymptoms = ({ symptoms = "", vitals = {} }) => {
  const normalized = symptoms.toLowerCase();
  const scored = SYMPTOM_RULES.map((rule) => ({
    ...rule,
    score: rule.keywords.reduce((sum, keyword) => sum + (normalized.includes(keyword) ? 1 : 0), 0),
  })).sort((a, b) => b.score - a.score);

  const best = scored[0]?.score ? scored[0] : SYMPTOM_RULES[2];
  let emergencyScore = best.score * 18;

  if (EMERGENCY_KEYWORDS.some((keyword) => normalized.includes(keyword))) emergencyScore += 35;
  if (Number(vitals.temperature) >= 103) emergencyScore += 18;
  if (Number(vitals.heartRate) >= 120) emergencyScore += 18;
  if (Number(vitals.spo2) > 0 && Number(vitals.spo2) < 92) emergencyScore += 30;

  const priorityScore = Math.min(100, Math.max(12, emergencyScore));
  const riskCategory = priorityScore >= 75 ? "High" : priorityScore >= 45 ? "Medium" : "Low";

  return {
    suggestedDepartment: best.department,
    likelyConditions: best.conditions,
    priorityScore,
    riskCategory,
    action:
      riskCategory === "High"
        ? "Send to emergency desk immediately."
        : riskCategory === "Medium"
          ? "Schedule same-day doctor review."
          : "Normal OPD appointment is suitable.",
  };
};

export const getHospitalAnalytics = catchAsyncErrors(async (req, res) => {
  const query = req.user.role === "Doctor" ? { doctorId: req.user._id } : {};
  const [appointments, doctors] = await Promise.all([
    Appointment.find(query).sort({ createdAt: -1 }).lean(),
    User.find({ role: "Doctor" }).select("firstName lastName doctorDepartment").lean(),
  ]);

  const departmentLoad = sortTop(countBy(appointments, (appointment) => appointment.department), 10);
  const visits = buildVisits(appointments);
  const demandForecast = buildDemandForecast(appointments, doctors);
  const recommendation = recommendFromSymptoms({
    symptoms: "fever cough chest pain weakness",
    vitals: { temperature: 101, heartRate: 96, spo2: 97 },
  });

  res.status(200).json({
    success: true,
    analytics: {
      generatedAt: new Date().toISOString(),
      scope: req.user.role === "Doctor" ? "Doctor appointments" : "Hospital-wide",
      patientAnalytics: {
        visits,
        mostCommonDiseases: buildDiseaseCounts(appointments),
        departmentLoad,
        revenue: buildRevenue(appointments),
      },
      appointmentPrediction: buildAppointmentPrediction(appointments),
      diseaseTrend: buildDiseaseTrend(appointments),
      inventoryForecast: buildInventoryForecast(appointments),
      workload: buildWorkload(appointments, doctors),
      advancedModels: {
        demandForecast,
        queueForecast: buildQueueForecast(appointments),
        patientRiskSegmentation: buildPatientRiskSegmentation(appointments),
        resourceOptimizer: buildResourceOptimizer(appointments, doctors, demandForecast),
        anomalyDetection: buildAnomalyDetection(appointments),
      },
      recommendation,
    },
  });
});

export const getRecommendation = catchAsyncErrors(async (req, res) => {
  const recommendation = recommendFromSymptoms(req.body || {});
  res.status(200).json({ success: true, recommendation });
});
