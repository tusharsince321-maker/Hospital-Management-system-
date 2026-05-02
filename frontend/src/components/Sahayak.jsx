import React, { useState, useRef, useEffect } from "react";
import {
  FaMicrophone, FaMicrophoneSlash, FaTimes, FaRobot,
  FaPhone, FaExclamationTriangle, FaPaperPlane,
  FaPills, FaCalendarPlus, FaHeartbeat,
} from "react-icons/fa";
import { sahayakReply } from "./sahayakBrain";

// ─── Type → Color map ───────────────────────────────────────────
const BUBBLE_COLORS = {
  emergency: "bg-red-500 text-white",
  handover:  "bg-amber-500 text-white",
  success:   "bg-emerald-500 text-white",
  info:      "bg-sky-500 text-white",
  booking:   "bg-violet-500 text-white",
  confirm:   "bg-indigo-500 text-white",
  pharmacy:  "bg-teal-500 text-white",
  normal:    "bg-brand-600 text-white",
  question:  "bg-brand-600 text-white",
};

// ─── Message Bubble ─────────────────────────────────────────────
const Bubble = ({ msg }) => {
  const isUser = msg.role === "user";
  return (
    <div className={`flex w-full mb-3 ${isUser ? "justify-end" : "justify-start"} animate-fade-in`}>
      {!isUser && (
        <div className="mr-2 flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-brand-600 to-indigo-600 flex items-center justify-center shadow">
          <FaRobot className="text-white text-xs" />
        </div>
      )}
      <div className={`max-w-[82%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
        isUser ? "bg-slate-100 text-slate-800 rounded-br-sm" : `${BUBBLE_COLORS[msg.type] || BUBBLE_COLORS.normal} rounded-bl-sm`
      }`}>
        {/* Badge row for special types */}
        {!isUser && msg.type === "emergency" && (
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest mb-1.5 opacity-80">
            <FaExclamationTriangle /> Emergency Alert
          </div>
        )}
        {!isUser && msg.type === "handover" && (
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest mb-1.5 opacity-80">
            <FaPhone /> Connecting to Staff
          </div>
        )}
        {!isUser && msg.type === "pharmacy" && (
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest mb-1.5 opacity-80">
            <FaPills /> Medical Store
          </div>
        )}
        {!isUser && msg.type === "success" && (
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest mb-1.5 opacity-80">
            <FaCalendarPlus /> Confirmed
          </div>
        )}

        <p>{msg.text}</p>

        {/* Action Buttons */}
        {!isUser && msg.type === "emergency" && (
          <a href="tel:102"
            className="mt-2.5 flex items-center gap-2 bg-white/20 hover:bg-white/30 rounded-xl px-3 py-1.5 text-xs font-bold w-fit transition-all">
            <FaPhone /> Call 102 Now
          </a>
        )}
        {!isUser && msg.type === "handover" && (
          <a href="tel:07662406000"
            className="mt-2.5 flex items-center gap-2 bg-white/20 hover:bg-white/30 rounded-xl px-3 py-1.5 text-xs font-bold w-fit transition-all">
            <FaPhone /> 076624 06000
          </a>
        )}
        {/* Doctor card in info/confirm */}
        {!isUser && msg.doc && (
          <div className="mt-2.5 bg-white/15 rounded-xl px-3 py-2 text-xs space-y-0.5">
            <div className="font-bold">{msg.doc.name}</div>
            <div className="opacity-80">Cabin {msg.doc.cabin} · {msg.doc.timing}</div>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Quick-action chips config ──────────────────────────────────
const CHIPS_HI = [
  { label: "Doctor timing?",      icon: <FaHeartbeat />,    text: "Doctor timing kya hai?" },
  { label: "Appointment book",    icon: <FaCalendarPlus />, text: "Appointment book karna hai" },
  { label: "Dawai chahiye 💊",    icon: <FaPills />,        text: "mujhe dawai chahiye paracetamol" },
  { label: "Emergency 🚨",        icon: <FaExclamationTriangle />, text: "Emergency help chahiye" },
];
const CHIPS_EN = [
  { label: "Doctor Timings",      icon: <FaHeartbeat />,    text: "What are the doctor timings?" },
  { label: "Book Appointment",    icon: <FaCalendarPlus />, text: "I want to book an appointment" },
  { label: "Order Medicine 💊",   icon: <FaPills />,        text: "I need Paracetamol medicine" },
  { label: "Emergency 🚨",        icon: <FaExclamationTriangle />, text: "Emergency help needed" },
];

// ─── Main Sahayak Widget ────────────────────────────────────────
const Sahayak = () => {
  const INIT_MSG = {
    role: "ai", type: "normal", lang: "en",
    text: "Hello! 👋 I'm Sahayak, People Hospital's AI assistant. I speak Hindi & English. How may I help you today? / Namaskar! Boliye, main aapki kya madad kar sakta hoon?",
  };

  const [open,      setOpen]      = useState(false);
  const [messages,  setMessages]  = useState([INIT_MSG]);
  const [input,     setInput]     = useState("");
  const [listening, setListening] = useState(false);
  const [thinking,  setThinking]  = useState(false);
  const [convState, setConvState] = useState({ step: null, patientName: null, symptom: null, doctor: null, status: "normal", pendingMeds: [] });
  const [uiLang,    setUiLang]    = useState("en"); // tracks last detected lang for chip display

  const bottomRef    = useRef(null);
  const inputRef     = useRef(null);
  const recognRef    = useRef(null);
  const synthRef     = useRef(window.speechSynthesis);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, open]);
  useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 300); }, [open]);

  // TTS — language-adaptive voice
  const speak = (text, lang) => {
    if (!synthRef.current) return;
    synthRef.current.cancel();
    const u   = new SpeechSynthesisUtterance(text.replace(/[🚨✅💊👋🙏😊]/gu, ""));
    u.lang    = lang === "hi" ? "hi-IN" : "en-IN";
    u.rate    = 0.92;
    u.pitch   = 1.05;
    synthRef.current.speak(u);
  };

  // STT — bilingual
  const startListening = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert("Voice input not supported. Please type your message."); return; }
    const r = new SR();
    r.lang = "hi-IN";  // Chrome handles bilingual reasonably with hi-IN
    r.interimResults = false;
    r.onstart  = () => setListening(true);
    r.onend    = () => setListening(false);
    r.onresult = (e) => { const t = e.results[0][0].transcript; setInput(t); sendMsg(t); };
    r.onerror  = () => setListening(false);
    recognRef.current = r;
    r.start();
  };
  const stopListening = () => { recognRef.current?.stop(); setListening(false); };

  // Core send
  const sendMsg = (text) => {
    const userText = (text || input).trim();
    if (!userText) return;
    setMessages(p => [...p, { role: "user", text: userText, type: "user" }]);
    setInput("");
    setThinking(true);

    setTimeout(() => {
      const reply = sahayakReply(userText, convState, setConvState);
      setUiLang(reply.lang || "en");
      setMessages(p => [...p, { role: "ai", ...reply }]);
      setThinking(false);
      speak(reply.text, reply.lang);
    }, 600);
  };

  const handleKey = (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMsg(); } };
  const isEmergency = convState.status === "CRITICAL_EMERGENCY";
  const chips = uiLang === "hi" ? CHIPS_HI : CHIPS_EN;

  return (
    <>
      {/* ── Floating Trigger ── */}
      <button
        id="sahayak-trigger"
        onClick={() => setOpen(o => !o)}
        className={`fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 ${
          isEmergency ? "bg-red-500 animate-pulse" : "bg-gradient-to-br from-brand-600 to-indigo-600"
        }`}
      >
        {open
          ? <FaTimes className="text-white text-xl" />
          : <FaRobot className="text-white text-2xl" />
        }
        {!open && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex h-4 w-4 rounded-full bg-green-500" />
          </span>
        )}
      </button>

      {/* ── Chat Window ── */}
      <div className={`fixed bottom-28 right-6 z-50 w-[360px] max-w-[calc(100vw-2rem)] transition-all duration-300 origin-bottom-right ${
        open ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-90 pointer-events-none"
      }`}>
        <div className="flex flex-col rounded-3xl overflow-hidden shadow-2xl bg-white border border-slate-200" style={{ height: "560px" }}>

          {/* Header */}
          <div className={`flex-shrink-0 px-5 py-4 flex items-center gap-3 ${isEmergency ? "bg-red-600" : "bg-gradient-to-r from-brand-600 to-indigo-600"}`}>
            <div className="relative flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                <FaRobot className="text-white text-lg" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white font-bold text-base leading-tight">Sahayak AI</div>
              <div className="text-white/60 text-[11px] truncate">People Hospital · Hindi & English</div>
            </div>
            {isEmergency && (
              <div className="flex items-center gap-1 bg-white/20 rounded-full px-2.5 py-1 text-white text-[10px] font-bold animate-pulse flex-shrink-0">
                <FaExclamationTriangle className="text-[9px]" /> EMERGENCY
              </div>
            )}
            <button onClick={() => setOpen(false)} className="text-white/60 hover:text-white transition-colors ml-1 flex-shrink-0">
              <FaTimes />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 bg-slate-50 space-y-1">
            {messages.map((m, i) => <Bubble key={i} msg={m} />)}
            {thinking && (
              <div className="flex items-center gap-2 justify-start mb-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-600 to-indigo-600 flex items-center justify-center">
                  <FaRobot className="text-white text-xs" />
                </div>
                <div className="bg-brand-600 rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1.5 items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/70 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-white/70 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-white/70 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick Chips */}
          <div className="flex-shrink-0 flex gap-2 px-4 py-2.5 bg-white border-t border-slate-100 overflow-x-auto scrollbar-hide">
            {chips.map((c) => (
              <button key={c.label} onClick={() => sendMsg(c.text)}
                className="flex-shrink-0 flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-[11px] font-medium text-slate-600 hover:bg-brand-50 hover:border-brand-300 hover:text-brand-700 transition-colors">
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                  {c.icon}
                </span>
                {c.label}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="flex-shrink-0 flex items-center gap-2 px-4 py-3 bg-white border-t border-slate-100">
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder={uiLang === "hi" ? "Type karein ya boliye…" : "Type or speak your message…"}
              className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all"
            />
            <button
              onClick={listening ? stopListening : startListening}
              className={`flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full transition-all ${
                listening ? "bg-red-500 text-white animate-pulse scale-110" : "bg-slate-100 text-slate-500 hover:bg-brand-100 hover:text-brand-600"
              }`}
              title="Voice input"
            >
              {listening ? <FaMicrophoneSlash className="text-sm" /> : <FaMicrophone className="text-sm" />}
            </button>
            <button
              onClick={() => sendMsg()}
              disabled={!input.trim() || thinking}
              className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-brand-600 text-white shadow hover:bg-brand-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95"
            >
              <FaPaperPlane className="text-sm" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sahayak;
