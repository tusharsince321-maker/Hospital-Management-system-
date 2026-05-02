// ─── Doctor Database ────────────────────────────────────────────
export const DOCTORS = [
  { name: "Dr. Arvind Singh",    deptEn: "Surgeon",         deptHi: "Operation/Surgery doctor", cabin: 1, timing: "9am – 1pm"  },
  { name: "Dr. Priya Sharma",    deptEn: "Heart Specialist", deptHi: "Dil ke doctor",            cabin: 2, timing: "10am – 2pm" },
  { name: "Dr. Rajesh Verma",    deptEn: "General Physician",deptHi: "Pet dard / Bukhar doctor", cabin: 4, timing: "5pm – 8pm"  },
  { name: "Dr. Meera Iyer",      deptEn: "Neurologist",      deptHi: "Dimag / Sir dard doctor",  cabin: 3, timing: "11am – 3pm" },
  { name: "Dr. Suresh Gupta",    deptEn: "Bone Specialist",  deptHi: "Haddi ke doctor",          cabin: 5, timing: "8am – 12pm" },
  { name: "Dr. Kavita Malhotra", deptEn: "Child Specialist", deptHi: "Bachon ke doctor",         cabin: 6, timing: "9am – 1pm"  },
  { name: "Dr. Ashok Tiwari",    deptEn: "ENT Specialist",   deptHi: "Kaan, Naak, Gala doctor",  cabin: 7, timing: "2pm – 6pm"  },
];

// ─── Pharmacy Mock Stock ────────────────────────────────────────
export const PHARMACY = [
  { name: "Paracetamol", inStock: true,  price: "₹15"  },
  { name: "Crocin",      inStock: true,  price: "₹30"  },
  { name: "Amoxicillin", inStock: true,  price: "₹85"  },
  { name: "Azithromycin",inStock: false, price: "₹120" },
  { name: "Cough Syrup", inStock: true,  price: "₹60"  },
  { name: "Cold Syrup",  inStock: true,  price: "₹55"  },
  { name: "Antacid",     inStock: true,  price: "₹25"  },
  { name: "ORS",         inStock: true,  price: "₹10"  },
];

// ─── Language Detection ─────────────────────────────────────────
export function detectLang(text) {
  const hindiMarkers =
    /\b(mujhe|mera|meri|aapka|aapki|hai|hain|ho|kya|nahi|nhi|aur|pe|par|se|ke|ki|ka|main|hoon|karo|tha|thi|bhi|ab|jab|kab|yahan|wahan|bahut|thoda|bilkul|accha|theek|aaj|kal|raat|subah|shaam|dard|bukhar|haddi|khoon|saans|ghabrao|bataiye|boliye|dijiye|suniye|haan|naa|namaskar|namaste|shukriya|dawai|dawa|doctor|cabin|appointment|takleef|pareshani|chahiye|karna|karo|karein|karun)\b/i;
  return hindiMarkers.test(text) ? "hi" : "en";
}

// ─── Emergency Detection ────────────────────────────────────────
const EMERGENCY_RE =
  /\b(accident|khoon|blood|saans\s*nahi|can'?t\s*breathe|breathe|breathing\s*problem|toot\s*gaya|pair\s*toot|broken\s*bone|fracture|chest\s*pain|unconscious|behosh|heart\s*attack|dil\s*ka\s*dora|seizure|stroke|heavily\s*bleed|bleed)\b/i;
export const isEmergencyText = (t) => EMERGENCY_RE.test(t);

// ─── Frustration Detection ──────────────────────────────────────
const FRUSTRATION_RE =
  /\b(samajh\s*nahi|samajh\s*nhi|not\s*understand|don'?t\s*understand|confused|manager|senior\s*staff|human|escalate|baat\s*karwa|transfer\s*me)\b/i;
export const isFrustrated = (t) => FRUSTRATION_RE.test(t);

// ─── Doctor Lookup by Symptom ───────────────────────────────────
export function findDoctor(text) {
  const t = text.toLowerCase();
  if (/haddi|toot|bone|fractur|ortho/.test(t))              return DOCTORS[4];
  if (/dil|heart|seene|cardio|bp|blood\s*pressure/.test(t)) return DOCTORS[1];
  if (/pet|stomach|bukhar|fever|ulti|vomit|general/.test(t))return DOCTORS[2];
  if (/dimag|sir\b|sar\b|sardard|head|neuro/.test(t))       return DOCTORS[3];
  if (/bacha|bachcha|child|baby|kids|pediat/.test(t))       return DOCTORS[5];
  if (/kaan|naak|gala|ear|nose|throat|\bent\b/.test(t))     return DOCTORS[6];
  if (/operation|surg/.test(t))                             return DOCTORS[0];
  return null;
}

// ─── Pharmacy Lookup ────────────────────────────────────────────
export function findMedicine(text) {
  const t = text.toLowerCase();
  return PHARMACY.filter((m) => t.includes(m.name.toLowerCase()));
}

// ═══════════════════════════════════════════════════════════════
// Core Reply Engine
// NOTE: Step-based checks MUST come before keyword checks so that
//       multi-turn flows (name → symptom → confirm) work correctly.
// ═══════════════════════════════════════════════════════════════
export function sahayakReply(userText, state, setState) {
  const lang = detectLang(userText);
  const isHi = lang === "hi";
  const t    = userText.toLowerCase().trim();

  // ── PRIORITY 0: Emergency — always wins ──────────────────────
  if (isEmergencyText(userText)) {
    setState((s) => ({ ...s, status: "CRITICAL_EMERGENCY" }));
    return {
      type: "emergency", lang,
      text: isHi
        ? "🚨 Ghabrayein mat! Zakham par saaf kapda dabake rakhein, hilayein mat. Main ambulance alert kar raha hoon. Abhi 102 par call karein!"
        : "🚨 Stay calm. Apply firm pressure with a clean cloth. Do NOT move the patient. Alerting emergency now — call 102 immediately!",
    };
  }

  // ── PRIORITY 1: Frustration / Human Handover ─────────────────
  if (isFrustrated(userText)) {
    return {
      type: "handover", lang,
      text: isHi
        ? "Main aapki baat senior staff se karwa deta hoon. Kripya is number par call karein: 076624 06000."
        : "I'm transferring you to our human support staff. Please call: 076624 06000 or hold the line.",
    };
  }

  // ── PRIORITY 2: Active Step-based conversation flow ───────────
  // These MUST be checked before any keyword matching.

  // Step: waiting for patient name
  if (state.step === "collect_name") {
    const name = userText.trim();
    setState((s) => ({ ...s, patientName: name, step: "collect_symptom" }));
    return {
      type: "booking", lang,
      text: isHi
        ? `Shukriya, ${name} ji! Ab batayein — aapko kya takleef hai?`
        : `Thank you, ${name}! Please describe your symptoms so I can find the right doctor.`,
    };
  }

  // Step: waiting for symptom
  if (state.step === "collect_symptom") {
    const doc = findDoctor(userText) || DOCTORS[2];
    setState((s) => ({ ...s, symptom: userText.trim(), step: "confirm_booking", doctor: doc }));
    return {
      type: "confirm", lang, doc,
      text: isHi
        ? `${state.patientName} ji ke liye ${doc.name} (${doc.deptHi}), Cabin ${doc.cabin}, ${doc.timing}. Confirm karein? (Haan / Yes)`
        : `Booking ${doc.name} (${doc.deptEn}), Cabin ${doc.cabin}, ${doc.timing} for ${state.patientName}. Confirm? (Yes / No)`,
    };
  }

  // Step: waiting for booking confirmation
  if (state.step === "confirm_booking") {
    if (/\b(yes|haan|ha|confirm|bilkul|sahi|theek|ok|ji)\b/i.test(userText)) {
      const doc = state.doctor || DOCTORS[2];
      setState((s) => ({ ...s, step: "done" }));
      return {
        type: "success", lang,
        text: isHi
          ? `✅ Appointment confirm! ${state.patientName} ji — ${doc.name}, Cabin ${doc.cabin}, ${doc.timing}. Kripya 15 minute pehle aayein.`
          : `✅ Confirmed! ${state.patientName} — ${doc.name}, Cabin ${doc.cabin}, ${doc.timing}. Please arrive 15 min early.`,
      };
    }
    // User said no
    setState((s) => ({ ...s, step: null, patientName: null, symptom: null, doctor: null }));
    return {
      type: "normal", lang,
      text: isHi
        ? "Theek hai, booking cancel kar di. Koi aur madad chahiye?"
        : "Understood, booking cancelled. How else may I help you?",
    };
  }

  // Step: waiting for delivery address (pharmacy)
  if (state.step === "pharmacy_address") {
    const meds = state.pendingMeds || [];
    setState((s) => ({ ...s, step: null, pendingMeds: [] }));
    return {
      type: "success", lang,
      text: isHi
        ? `✅ Order confirm! ${meds.join(", ")} aapke address par deliver hogi. Estimated: 30–45 minutes.`
        : `✅ Order placed! ${meds.join(", ")} will be delivered to your address in 30–45 minutes.`,
    };
  }

  // ── PRIORITY 3: Keyword-based capabilities ────────────────────

  // Pharmacy / medicine
  if (/\b(dawai|dawa|medicine|pharmacy|store|tablet|syrup|capsule|paracetamol|crocin|antibiotic|antacid|ors|med)\b/i.test(userText)) {
    const found     = findMedicine(userText);
    const available = found.filter((m) => m.inStock);
    const outStock  = found.filter((m) => !m.inStock);

    if (available.length > 0) {
      const medList = available.map((m) => `${m.name} (${m.price})`).join(", ");
      const oosNote = outStock.length
        ? (isHi ? ` ${outStock.map((m) => m.name).join(", ")} stock mein nahi.` : ` ${outStock.map((m) => m.name).join(", ")} is out of stock.`)
        : "";
      setState((s) => ({ ...s, step: "pharmacy_address", pendingMeds: available.map((m) => m.name) }));
      return {
        type: "pharmacy", lang,
        text: isHi
          ? `People store mein ${medList} available hai.${oosNote} Home delivery ke liye apna address batayein.`
          : `${medList} is available at People Medical Store.${oosNote} Share your address for home delivery.`,
      };
    }

    // Medicine not found in list — ask for prescription details
    return {
      type: "pharmacy", lang,
      text: isHi
        ? "Kaun si dawai chahiye? Exact naam ya prescription describe karein — main stock check karta hoon."
        : "Which medicine do you need? Please mention the exact name or describe your prescription.",
    };
  }

  // Greeting
  if (/^(hello|hi|hey|namaste|namaskar|good\s*(morning|evening|afternoon))\b/i.test(t)) {
    return {
      type: "normal", lang,
      text: isHi
        ? "Namaskar! 🙏 Main Sahayak hoon, People ka AI assistant. Doctor, dawai, ya emergency — sab mein madad karunga!"
        : "Hello! 👋 I'm Sahayak, People's AI assistant. I help with appointments, medicines & emergencies. How can I help?",
    };
  }

  // Doctor / timing query
  if (/\b(doctor|timing|kab|milenge|available|cabin|specialist|department|kaun\s*sa|which\s*doctor)\b/i.test(userText)) {
    const doc = findDoctor(userText);
    if (doc) {
      return {
        type: "info", lang, doc,
        text: isHi
          ? `${doc.deptHi} — ${doc.name} — aaj Cabin ${doc.cabin} mein ${doc.timing} tak available hain. Appointment book karun?`
          : `${doc.deptEn} — ${doc.name} — available today in Cabin ${doc.cabin}, ${doc.timing}. Shall I book an appointment?`,
      };
    }
    return {
      type: "question", lang,
      text: isHi
        ? "Aapko kaunsi takleef hai? Pet dard, haddi, dil, sar dard, bachcha, ya kaan-naak-gala?"
        : "What are your symptoms? E.g. stomach pain, bone, heart, headache, child, or ENT?",
    };
  }

  // Appointment booking — kick off the name→symptom→confirm flow
  if (/\b(appointment|book|register|slot|naam\s*darj)\b/i.test(userText)) {
    setState((s) => ({ ...s, step: "collect_name", patientName: null, symptom: null }));
    return {
      type: "booking", lang,
      text: isHi
        ? "Bilkul! Appointment ke liye pehle aapka poora naam batayein."
        : "Sure! Please tell me your full name to proceed with the appointment.",
    };
  }

  // Emergency number / ambulance direct ask
  if (/\b(102|ambulance|emergency\s*number|helpline)\b/i.test(userText)) {
    return {
      type: "emergency", lang,
      text: isHi
        ? "People Emergency 24 ghante open hai. Turant 102 par call karein ya seedhe reception par aayein."
        : "People Emergency is open 24/7. Call 102 immediately or walk into our reception.",
    };
  }

  // Thank you
  if (/\b(thank|shukriya|dhanyawad|bahut\s*accha|great|wonderful)\b/i.test(userText)) {
    return {
      type: "normal", lang,
      text: isHi
        ? "Aapka swaagat hai! 😊 People mein aapka khayaal rakhna hamari zimmedari hai."
        : "You're most welcome! 😊 Your health and comfort are our top priority at People.",
    };
  }

  // ── Fallback ──────────────────────────────────────────────────
  return {
    type: "question", lang,
    text: isHi
      ? "Thoda aur bataiye — doctor ka time, appointment, dawai, ya koi emergency? Main madad ke liye hoon."
      : "Could you elaborate? I can help with doctor appointments, medicines, or emergencies.",
  };
}
