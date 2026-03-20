// import { useState } from "react";
// import axios from "axios";
// import {
//   FiUser,
//   FiMail,
//   FiBriefcase,
//   FiPhone,
//   FiImage,
//   FiFileText,
//   FiUpload,
//   FiCheckCircle,
//   FiAlertCircle,
// } from "react-icons/fi";

// const API = "http://127.0.0.1:8000";
// // const API = "https://endorsingly-subuncinal-toya.ngrok-free.dev ";

// export default function CreateUser() {
//   const [form, setForm] = useState({
//     username: "",
//     email: "",
//     role: "",
//     phone: "",
//   });
//   const [image, setImage] = useState(null);
//   const [resume, setResume] = useState(null);
//   const [status, setStatus] = useState(null);
//   const [result, setResult] = useState(null);
//   const [errMsg, setErrMsg] = useState("");

//   const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

//   const submit = async () => {
//     if (!form.username || !form.email || !form.role) {
//       setErrMsg("Username, email and role are required.");
//       return;
//     }
//     setStatus("loading");
//     setErrMsg("");
//     const fd = new FormData();
//     Object.entries(form).forEach(([k, v]) => v && fd.append(k, v));
//     if (image) fd.append("image", image);
//     if (resume) fd.append("resume", resume);
//     try {
//       const res = await axios.post(`${API}/users`, fd);
//       setResult(res.data);
//       setStatus("success");
//       setForm({ username: "", email: "", role: "", phone: "" });
//       setImage(null);
//       setResume(null);
//     } catch (e) {
//       setErrMsg(e.response?.data?.detail || e.message);
//       setStatus("error");
//     }
//   };

//   const fields = [
//     {
//       name: "username",
//       placeholder: "Full Name",
//       type: "text",
//       icon: <FiUser />,
//     },
//     {
//       name: "email",
//       placeholder: "Email Address",
//       type: "email",
//       icon: <FiMail />,
//     },
//     {
//       name: "role",
//       placeholder: "Job Role",
//       type: "text",
//       icon: <FiBriefcase />,
//     },
//     {
//       name: "phone",
//       placeholder: "Phone Number",
//       type: "tel",
//       icon: <FiPhone />,
//     },
//   ];

//   const fileFields = [
//     {
//       label: "Profile Photo",
//       accept: "image/*",
//       state: image,
//       set: setImage,
//       icon: <FiImage />,
//       hint: "JPG, PNG, WEBP",
//     },
//     {
//       label: "Resume",
//       accept: ".pdf,.doc,.docx",
//       state: resume,
//       set: setResume,
//       icon: <FiFileText />,
//       hint: "PDF or DOCX",
//     },
//   ];

//   return (
//     <div className="max-w-2xl mx-auto">
//       <div className="mb-8">
//         <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
//           Register Candidate
//         </h2>
//         <p className="text-sm text-slate-500 mt-1">
//           Add a new candidate with their resume to the system.
//         </p>
//       </div>

//       <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//           {fields.map(({ name, placeholder, type, icon }) => (
//             <div key={name}>
//               <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
//                 {placeholder}
//               </label>
//               <div className="relative">
//                 <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-base">
//                   {icon}
//                 </span>
//                 <input
//                   name={name}
//                   type={type}
//                   placeholder={placeholder}
//                   value={form[name]}
//                   onChange={handle}
//                   className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm
//                              focus:outline-none focus:ring-2 focus:ring-indigo-400
//                              bg-slate-50 text-slate-800 placeholder-slate-300 transition"
//                 />
//               </div>
//             </div>
//           ))}
//         </div>

//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//           {fileFields.map(({ label, accept, state, set, icon, hint }) => (
//             <div key={label}>
//               <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
//                 {label}
//               </label>
//               <label
//                 className="flex items-center gap-3 border-2 border-dashed border-slate-200
//                                 hover:border-indigo-400 rounded-xl px-4 py-3 cursor-pointer
//                                 transition-colors group bg-slate-50 hover:bg-indigo-50"
//               >
//                 <span className="text-slate-400 group-hover:text-indigo-500 text-lg">
//                   {icon}
//                 </span>
//                 <div className="min-w-0">
//                   <p className="text-sm text-slate-500 group-hover:text-indigo-600 truncate font-medium">
//                     {state ? state.name : `Upload ${label}`}
//                   </p>
//                   <p className="text-xs text-slate-400">{hint}</p>
//                 </div>
//                 <FiUpload className="ml-auto text-slate-300 group-hover:text-indigo-400 shrink-0" />
//                 <input
//                   type="file"
//                   accept={accept}
//                   className="hidden"
//                   onChange={(e) => set(e.target.files[0])}
//                 />
//               </label>
//             </div>
//           ))}
//         </div>

//         {errMsg && (
//           <div
//             className="flex items-center gap-2 bg-red-50 border border-red-200
//                           text-red-600 text-sm rounded-xl px-4 py-3"
//           >
//             <FiAlertCircle className="shrink-0" />
//             {errMsg}
//           </div>
//         )}

//         {status === "success" && result && (
//           <div
//             className="flex items-start gap-3 bg-emerald-50 border border-emerald-200
//                           rounded-xl px-4 py-3"
//           >
//             <FiCheckCircle className="text-emerald-500 shrink-0 mt-0.5 text-lg" />
//             <div>
//               <p className="text-emerald-700 font-semibold text-sm">
//                 Candidate registered successfully!
//               </p>
//               <p className="text-emerald-600 text-xs mt-0.5">
//                 ID: {result.id} · {result.username} · {result.email}
//               </p>
//             </div>
//           </div>
//         )}

//         <button
//           onClick={submit}
//           disabled={status === "loading"}
//           className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50
//                      text-white font-semibold py-3 rounded-xl text-sm
//                      transition-colors flex items-center justify-center gap-2 shadow-sm"
//         >
//           {status === "loading" ? (
//             <>
//               <span
//                 className="w-4 h-4 border-2 border-white border-t-transparent
//                                rounded-full animate-spin"
//               />
//               Registering...
//             </>
//           ) : (
//             <>
//               <FiUser className="text-base" /> Register Candidate
//             </>
//           )}
//         </button>
//       </div>
//     </div>
//   );
// }

// import { useState } from "react";
// import axios from "axios";
// import {
//   FiUser, FiMail, FiBriefcase, FiPhone, FiImage,
//   FiFileText, FiUpload, FiCheckCircle, FiAlertCircle,
//   FiZap, FiEdit3,
// } from "react-icons/fi";

// const API = "http://127.0.0.1:8000";

// const STATUSES = [
//   "Screening", "L1 Interview", "L2 Interview", "HR Interview",
//   "Offer Released", "Pre-Onboarding", "Onboarded",
//   "Rejected", "Awaiting Feedback", "On Hold", "Offer Rejected",
// ];

// const emptyForm = {
//   username: "", email: "", role: "", phone: "",
//   skills: "", total_exp: "", preferred_location: "",
//   rel_exp: "", ctc: "", ectc: "", notice_period: "",
//   company: "", current_location: "", date_profile_taken: "",
//   status: "Screening",
// };

// export default function CreateUser() {
//   const [mode, setMode]       = useState("manual"); // "manual" | "ai"
//   const [form, setForm]       = useState(emptyForm);
//   const [image, setImage]     = useState(null);
//   const [resume, setResume]   = useState(null);
//   const [status, setStatus]   = useState(null);
//   const [result, setResult]   = useState(null);
//   const [errMsg, setErrMsg]   = useState("");
//   const [aiLoading, setAiLoading] = useState(false);

//   const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

//   // ── AI mode: upload resume → call /parse-resume → fill form ──────────────
//   const handleAiExtract = async (file) => {
//     if (!file) return;
//     setResume(file);
//     if (mode !== "ai") return;

//     setAiLoading(true);
//     setErrMsg("");
//     try {
//       const fd = new FormData();
//       fd.append("resume", file);
//       const res = await axios.post(`${API}/parse-resume`, fd);
//       const d   = res.data;
//       setForm((prev) => ({
//         ...prev,
//         username:           d.candidate_name || prev.username,
//         email:              d.email           || prev.email,
//         role:               d.role            || prev.role,
//         phone:              d.phone           || prev.phone,
//         skills:             d.skills          || prev.skills,
//         total_exp:          d.total_exp       || prev.total_exp,
//         current_location:   d.current_location|| prev.current_location,
//         company:            d.company         || prev.company,
//         notice_period:      d.notice_period   || prev.notice_period,
//         ctc:                d.ctc             || prev.ctc,
//         ectc:               d.ectc            || prev.ectc,
//         preferred_location: d.preferred_location || prev.preferred_location,
//         rel_exp:            d.rel_exp         || prev.rel_exp,
//       }));
//     } catch (e) {
//       setErrMsg("AI extraction failed: " + (e.response?.data?.detail || e.message));
//     } finally {
//       setAiLoading(false);
//     }
//   };

//   // ── Submit final form ──────────────────────────────────────────────────────
//   const submit = async () => {
//     if (!form.username || !form.email || !form.role) {
//       setErrMsg("Username, email and role are required.");
//       return;
//     }
//     setStatus("loading");
//     setErrMsg("");
//     const fd = new FormData();
//     Object.entries(form).forEach(([k, v]) => v && fd.append(k, v));
//     if (image)  fd.append("image",  image);
//     if (resume) fd.append("resume", resume);
//     try {
//       const res = await axios.post(`${API}/users`, fd);
//       setResult(res.data);
//       setStatus("success");
//       setForm(emptyForm);
//       setImage(null);
//       setResume(null);
//     } catch (e) {
//       setErrMsg(e.response?.data?.detail || e.message);
//       setStatus("error");
//     }
//   };

//   const Field = ({ name, placeholder, type = "text", icon, optional = false }) => (
//     <div>
//       <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
//         {placeholder}{optional && <span className="text-slate-300 font-normal ml-1">(optional)</span>}
//       </label>
//       <div className="relative">
//         <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-base">{icon}</span>
//         <input
//           name={name} type={type} placeholder={placeholder}
//           value={form[name]} onChange={handle}
//           className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm
//                      focus:outline-none focus:ring-2 focus:ring-indigo-400
//                      bg-slate-50 text-slate-800 placeholder-slate-300 transition"
//         />
//       </div>
//     </div>
//   );

//   return (
//     <div className="max-w-3xl mx-auto">
//       <div className="mb-6">
//         <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Register Candidate</h2>
//         <p className="text-sm text-slate-500 mt-1">Add a new candidate to the system.</p>
//       </div>

//       {/* ── Mode toggle ──────────────────────────────────────────────────── */}
//       <div className="flex gap-3 mb-6">
//         <button
//           onClick={() => setMode("manual")}
//           className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition
//             ${mode === "manual"
//               ? "bg-indigo-600 text-white border-indigo-600"
//               : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300"}`}
//         >
//           <FiEdit3 /> Manual Entry
//         </button>
//         <button
//           onClick={() => setMode("ai")}
//           className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition
//             ${mode === "ai"
//               ? "bg-purple-600 text-white border-purple-600"
//               : "bg-white text-slate-600 border-slate-200 hover:border-purple-300"}`}
//         >
//           <FiZap /> AI Auto-Fill
//         </button>
//       </div>

//       {mode === "ai" && (
//         <div className="mb-5 p-4 bg-purple-50 border border-purple-200 rounded-xl text-sm text-purple-700">
//           Upload a resume below — AI will automatically extract and fill all fields.
//           You can then review and edit before submitting.
//         </div>
//       )}

//       <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">

//         {/* ── File uploads ─────────────────────────────────────────────── */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//           {/* Profile photo */}
//           <div>
//             <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
//               Profile Photo
//             </label>
//             <label className="flex items-center gap-3 border-2 border-dashed border-slate-200
//                               hover:border-indigo-400 rounded-xl px-4 py-3 cursor-pointer transition group bg-slate-50">
//               <FiImage className="text-slate-400 group-hover:text-indigo-500 text-lg" />
//               <div className="min-w-0">
//                 <p className="text-sm text-slate-500 truncate">{image ? image.name : "Upload photo"}</p>
//                 <p className="text-xs text-slate-400">JPG, PNG, WEBP</p>
//               </div>
//               <FiUpload className="ml-auto text-slate-300 group-hover:text-indigo-400 shrink-0" />
//               <input type="file" accept="image/*" className="hidden" onChange={(e) => setImage(e.target.files[0])} />
//             </label>
//           </div>

//           {/* Resume */}
//           <div>
//             <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
//               Resume {mode === "ai" && <span className="text-purple-500 text-xs">(triggers AI fill)</span>}
//             </label>
//             <label className={`flex items-center gap-3 border-2 border-dashed rounded-xl px-4 py-3 cursor-pointer transition group bg-slate-50
//               ${mode === "ai" ? "border-purple-200 hover:border-purple-500" : "border-slate-200 hover:border-indigo-400"}`}>
//               <FiFileText className={`text-lg ${mode === "ai" ? "text-purple-400" : "text-slate-400"}`} />
//               <div className="min-w-0">
//                 <p className="text-sm text-slate-500 truncate">
//                   {aiLoading ? "Extracting with AI..." : resume ? resume.name : "Upload resume"}
//                 </p>
//                 <p className="text-xs text-slate-400">PDF or DOCX</p>
//               </div>
//               {aiLoading
//                 ? <span className="ml-auto w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin shrink-0" />
//                 : <FiUpload className="ml-auto text-slate-300 shrink-0" />}
//               <input
//                 type="file" accept=".pdf,.doc,.docx" className="hidden"
//                 onChange={(e) => handleAiExtract(e.target.files[0])}
//               />
//             </label>
//           </div>
//         </div>

//         {/* ── Required fields ───────────────────────────────────────────── */}
//         <div>
//           <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Required</p>
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             <Field name="username"  placeholder="Full Name"      icon={<FiUser />} />
//             <Field name="email"     placeholder="Email Address"  icon={<FiMail />} type="email" />
//             <Field name="role"      placeholder="Job Role"       icon={<FiBriefcase />} />
//             <Field name="phone"     placeholder="Phone Number"   icon={<FiPhone />} type="tel" optional />
//           </div>
//         </div>

//         {/* ── Skills & Exp ─────────────────────────────────────────────── */}
//         <div>
//           <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Skills & Experience</p>
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             <div className="sm:col-span-2">
//               <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
//                 Skills <span className="text-slate-300 font-normal">(comma separated)</span>
//               </label>
//               <textarea
//                 name="skills" value={form.skills} onChange={handle} rows={2}
//                 placeholder="React, Node.js, Python, SQL..."
//                 className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm
//                            focus:outline-none focus:ring-2 focus:ring-indigo-400
//                            bg-slate-50 text-slate-800 placeholder-slate-300 transition resize-none"
//               />
//             </div>
//             <Field name="total_exp"    placeholder="Total Experience"  icon={<FiBriefcase />} optional />
//             <Field name="rel_exp"      placeholder="Relevant Exp"      icon={<FiBriefcase />} optional />
//             <Field name="company"      placeholder="Current Company"   icon={<FiBriefcase />} optional />
//             <Field name="current_location"   placeholder="Current Location"  icon={<FiUser />} optional />
//           </div>
//         </div>

//         {/* ── CTC & Notice ─────────────────────────────────────────────── */}
//         <div>
//           <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Compensation & Availability</p>
//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//             <Field name="ctc"            placeholder="Current CTC"        icon={<FiUser />} optional />
//             <Field name="ectc"           placeholder="Expected CTC"       icon={<FiUser />} optional />
//             <Field name="notice_period"  placeholder="Notice Period"      icon={<FiUser />} optional />
//           </div>
//         </div>

//         {/* ── Preferred location & Date ─────────────────────────────────── */}
//         <div>
//           <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Preferences</p>
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             <Field name="preferred_location" placeholder="Preferred Location" icon={<FiUser />} optional />
//             <div>
//               <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
//                 Date Profile Taken
//               </label>
//               <input
//                 type="date" name="date_profile_taken"
//                 value={form.date_profile_taken} onChange={handle}
//                 className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm
//                            focus:outline-none focus:ring-2 focus:ring-indigo-400
//                            bg-slate-50 text-slate-800 transition"
//               />
//             </div>
//           </div>
//         </div>

//         {/* ── Status ───────────────────────────────────────────────────── */}
//         <div>
//           <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
//             Hiring Status
//           </label>
//           <select
//             name="status" value={form.status} onChange={handle}
//             className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm
//                        focus:outline-none focus:ring-2 focus:ring-indigo-400
//                        bg-slate-50 text-slate-800 transition"
//           >
//             {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
//           </select>
//         </div>

//         {/* ── Messages ─────────────────────────────────────────────────── */}
//         {errMsg && (
//           <div className="flex items-center gap-2 bg-red-50 border border-red-200
//                           text-red-600 text-sm rounded-xl px-4 py-3">
//             <FiAlertCircle className="shrink-0" /> {errMsg}
//           </div>
//         )}

//         {status === "success" && result && (
//           <div className="flex items-start gap-3 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
//             <FiCheckCircle className="text-emerald-500 shrink-0 mt-0.5 text-lg" />
//             <div>
//               <p className="text-emerald-700 font-semibold text-sm">Candidate registered successfully!</p>
//               <p className="text-emerald-600 text-xs mt-0.5">
//                 ID: {result.id} · {result.username} · {result.email}
//               </p>
//             </div>
//           </div>
//         )}

//         <button
//           onClick={submit} disabled={status === "loading" || aiLoading}
//           className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50
//                      text-white font-semibold py-3 rounded-xl text-sm
//                      transition-colors flex items-center justify-center gap-2 shadow-sm"
//         >
//           {status === "loading" ? (
//             <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Registering...</>
//           ) : (
//             <><FiUser className="text-base" /> Register Candidate</>
//           )}
//         </button>
//       </div>
//     </div>
//   );
// }

import { useState, useCallback } from "react";
import axios from "axios";
import {
  FiUser,
  FiMail,
  FiBriefcase,
  FiPhone,
  FiImage,
  FiFileText,
  FiUpload,
  FiCheckCircle,
  FiAlertCircle,
  FiZap,
  FiEdit3,
} from "react-icons/fi";

const API = "http://127.0.0.1:8000";

const STATUSES = [
  "Screening",
  "L1 Interview",
  "L2 Interview",
  "HR Interview",
  "Offer Released",
  "Pre-Onboarding",
  "Onboarded",
  "Rejected",
  "Awaiting Feedback",
  "On Hold",
  "Offer Rejected",
];

const emptyForm = {
  username: "",
  email: "",
  role: "",
  phone: "",
  skills: "",
  total_exp: "",
  preferred_location: "",
  rel_exp: "",
  ctc: "",
  ectc: "",
  notice_period: "",
  company: "",
  current_location: "",
  date_profile_taken: "",
  status: "Screening",
};

function InputField({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  optional,
  icon,
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
        {label}
        {optional && (
          <span className="text-slate-300 font-normal ml-1">(optional)</span>
        )}
      </label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-base pointer-events-none">
          {icon}
        </span>
        <input
          name={name}
          type={type}
          placeholder={placeholder || label}
          value={value}
          onChange={onChange}
          autoComplete="off"
          className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm
                     focus:outline-none focus:ring-2 focus:ring-indigo-400
                     bg-slate-50 text-slate-800 placeholder-slate-300 transition"
        />
      </div>
    </div>
  );
}

function SkillsTextarea({ value, onChange }) {
  return (
    <div className="sm:col-span-2">
      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
        Skills{" "}
        <span className="text-slate-300 font-normal">(comma separated)</span>
      </label>
      <textarea
        name="skills"
        value={value}
        onChange={onChange}
        rows={2}
        placeholder="React, Node.js, Python, SQL..."
        className="w-full px-3 py-7  h-30 border border-slate-200 rounded-xl text-sm
                   focus:outline-none focus:ring-2 focus:ring-indigo-400
                   bg-slate-50 text-slate-800 placeholder-slate-300 transition resize-none"
      />
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function CreateUser() {
  const [mode, setMode] = useState("manual");
  const [form, setForm] = useState(emptyForm);
  const [image, setImage] = useState(null);
  const [resume, setResume] = useState(null);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [result, setResult] = useState(null);
  const [errMsg, setErrMsg] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  // Stable onChange — does NOT recreate on every render
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  // AI extract on resume upload
  const handleResumeUpload = async (file) => {
    if (!file) return;
    setResume(file);
    if (mode !== "ai") return;

    setAiLoading(true);
    setErrMsg("");
    try {
      const fd = new FormData();
      fd.append("resume", file);
      const res = await axios.post(`${API}/parse-resume`, fd);
      const d = res.data;
      setForm((prev) => ({
        ...prev,
        username: d.candidate_name || prev.username,
        email: d.email || prev.email,
        role: d.role || prev.role,
        phone: d.phone || prev.phone,
        skills: d.skills || prev.skills,
        total_exp: d.total_exp || prev.total_exp,
        current_location: d.current_location || prev.current_location,
        company: d.company || prev.company,
        notice_period: d.notice_period || prev.notice_period,
        ctc: d.ctc || prev.ctc,
        ectc: d.ectc || prev.ectc,
        preferred_location: d.preferred_location || prev.preferred_location,
        rel_exp: d.rel_exp || prev.rel_exp,
      }));
    } catch (e) {
      setErrMsg(
        "AI extraction failed: " + (e.response?.data?.detail || e.message),
      );
    } finally {
      setAiLoading(false);
    }
  };

  const submit = async () => {
    if (!form.username || !form.email || !form.role) {
      setErrMsg("Full name, email and role are required.");
      return;
    }
    setSubmitStatus("loading");
    setErrMsg("");
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (v) fd.append(k, v);
    });
    if (image) fd.append("image", image);
    if (resume) fd.append("resume", resume);
    try {
      const res = await axios.post(`${API}/users`, fd);
      setResult(res.data);
      setSubmitStatus("success");
      setForm(emptyForm);
      setImage(null);
      setResume(null);
    } catch (e) {
      setErrMsg(e.response?.data?.detail || e.message);
      setSubmitStatus("error");
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
          Register Candidate
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Add a new candidate to the system.
        </p>
      </div>

      {/* Mode toggle */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setMode("manual")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition
            ${
              mode === "manual"
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300"
            }`}
        >
          <FiEdit3 /> Manual Entry
        </button>
        <button
          onClick={() => setMode("ai")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition
            ${
              mode === "ai"
                ? "bg-purple-600 text-white border-purple-600"
                : "bg-white text-slate-600 border-slate-200 hover:border-purple-300"
            }`}
        >
          <FiZap /> AI Auto-Fill
        </button>
      </div>

      {mode === "ai" && (
        <div className="mb-5 p-4 bg-purple-50 border border-purple-200 rounded-xl text-sm text-purple-700">
          Upload a resume — AI will auto-fill all fields. You can edit any field
          before submitting.
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
        {/* File uploads */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
              Profile Photo
            </label>
            <label
              className="flex items-center gap-3 border-2 border-dashed border-slate-200
                              hover:border-indigo-400 rounded-xl px-4 py-3 cursor-pointer transition group bg-slate-50"
            >
              <FiImage className="text-slate-400 group-hover:text-indigo-500 text-lg shrink-0" />
              <div className="min-w-0">
                <p className="text-sm text-slate-500 truncate">
                  {image ? image.name : "Upload photo"}
                </p>
                <p className="text-xs text-slate-400">JPG, PNG, WEBP</p>
              </div>
              <FiUpload className="ml-auto text-slate-300 group-hover:text-indigo-400 shrink-0" />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </label>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
              Resume{" "}
              {mode === "ai" && (
                <span className="text-purple-500 text-xs ml-1">
                  (triggers AI fill)
                </span>
              )}
            </label>
            <label
              className={`flex items-center gap-3 border-2 border-dashed rounded-xl px-4 py-3 cursor-pointer transition group bg-slate-50
              ${mode === "ai" ? "border-purple-200 hover:border-purple-500" : "border-slate-200 hover:border-indigo-400"}`}
            >
              <FiFileText
                className={`text-lg shrink-0 ${mode === "ai" ? "text-purple-400" : "text-slate-400"}`}
              />
              <div className="min-w-0">
                <p className="text-sm text-slate-500 truncate">
                  {aiLoading
                    ? "Extracting with AI..."
                    : resume
                      ? resume.name
                      : "Upload resume"}
                </p>
                <p className="text-xs text-slate-400">PDF or DOCX</p>
              </div>
              {aiLoading ? (
                <span className="ml-auto w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin shrink-0" />
              ) : (
                <FiUpload className="ml-auto text-slate-300 shrink-0" />
              )}
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={(e) => handleResumeUpload(e.target.files[0])}
              />
            </label>
          </div>
        </div>

        {/* Required fields */}
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
            Required
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField
              label="Full Name"
              name="username"
              value={form.username}
              onChange={handleChange}
              icon={<FiUser />}
            />
            <InputField
              label="Email Address"
              name="email"
              value={form.email}
              onChange={handleChange}
              icon={<FiMail />}
              type="email"
            />
            <InputField
              label="Job Role"
              name="role"
              value={form.role}
              onChange={handleChange}
              icon={<FiBriefcase />}
            />
            <InputField
              label="Phone Number"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              icon={<FiPhone />}
              type="tel"
              optional
            />
          </div>
        </div>

        {/* Skills & Experience */}
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
            Skills & Experience
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SkillsTextarea value={form.skills} onChange={handleChange} />
            <InputField
              label="Total Experience"
              name="total_exp"
              value={form.total_exp}
              onChange={handleChange}
              icon={<FiBriefcase />}
              optional
            />
            <InputField
              label="Relevant Exp"
              name="rel_exp"
              value={form.rel_exp}
              onChange={handleChange}
              icon={<FiBriefcase />}
              optional
            />
            <InputField
              label="Current Company"
              name="company"
              value={form.company}
              onChange={handleChange}
              icon={<FiBriefcase />}
              optional
            />
            <InputField
              label="Current Location"
              name="current_location"
              value={form.current_location}
              onChange={handleChange}
              icon={<FiUser />}
              optional
            />
          </div>
        </div>

        {/* CTC & Notice */}
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
            Compensation & Availability
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <InputField
              label="Current CTC"
              name="ctc"
              value={form.ctc}
              onChange={handleChange}
              icon={<FiUser />}
              optional
            />
            <InputField
              label="Expected CTC"
              name="ectc"
              value={form.ectc}
              onChange={handleChange}
              icon={<FiUser />}
              optional
            />
            <InputField
              label="Notice Period"
              name="notice_period"
              value={form.notice_period}
              onChange={handleChange}
              icon={<FiUser />}
              optional
            />
          </div>
        </div>

        {/* Preferences */}
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
            Preferences
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField
              label="Preferred Location"
              name="preferred_location"
              value={form.preferred_location}
              onChange={handleChange}
              icon={<FiUser />}
              optional
            />
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                Date Profile Taken
              </label>
              <input
                type="date"
                name="date_profile_taken"
                value={form.date_profile_taken}
                onChange={handleChange}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm
                           focus:outline-none focus:ring-2 focus:ring-indigo-400
                           bg-slate-50 text-slate-800 transition"
              />
            </div>
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
            Hiring Status
          </label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm
                       focus:outline-none focus:ring-2 focus:ring-indigo-400
                       bg-slate-50 text-slate-800 transition"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Error / success */}
        {errMsg && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
            <FiAlertCircle className="shrink-0" /> {errMsg}
          </div>
        )}
        {submitStatus === "success" && result && (
          <div className="flex items-start gap-3 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
            <FiCheckCircle className="text-emerald-500 shrink-0 mt-0.5 text-lg" />
            <div>
              <p className="text-emerald-700 font-semibold text-sm">
                Candidate registered successfully!
              </p>
              <p className="text-emerald-600 text-xs mt-0.5">
                ID: {result.id} · {result.username} · {result.email}
              </p>
            </div>
          </div>
        )}

        <button
          onClick={submit}
          disabled={submitStatus === "loading" || aiLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50
                     text-white font-semibold py-3 rounded-xl text-sm
                     transition-colors flex items-center justify-center gap-2 shadow-sm"
        >
          {submitStatus === "loading" ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />{" "}
              Registering...
            </>
          ) : (
            <>
              <FiUser className="text-base" /> Register Candidate
            </>
          )}
        </button>
      </div>
    </div>
  );
}
