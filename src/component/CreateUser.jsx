import { useState } from "react";
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
} from "react-icons/fi";

// const API = "http://127.0.0.1:8000";
const API = "https://endorsingly-subuncinal-toya.ngrok-free.dev";

export default function CreateUser() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    role: "",
    phone: "",
  });
  const [image, setImage] = useState(null);
  const [resume, setResume] = useState(null);
  const [status, setStatus] = useState(null);
  const [result, setResult] = useState(null);
  const [errMsg, setErrMsg] = useState("");

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // const submit = async () => {
  //   if (!form.username || !form.email || !form.role) {
  //     setErrMsg("Username, email and role are required.");
  //     return;
  //   }
  //   setStatus("loading");
  //   setErrMsg("");
  //   const fd = new FormData();
  //   Object.entries(form).forEach(([k, v]) => v && fd.append(k, v));
  //   if (image) fd.append("image", image);
  //   if (resume) fd.append("resume", resume);
  //   try {
  //     const res = await axios.post(`${API}/users`, fd);
  //     setResult(res.data);
  //     setStatus("success");
  //     setForm({ username: "", email: "", role: "", phone: "" });
  //     setImage(null);
  //     setResume(null);
  //   } catch (e) {
  //     setErrMsg(e.response?.data?.detail || e.message);
  //     setStatus("error");
  //   }
  // };

  const submit = async () => {
    if (!form.username || !form.email || !form.role) {
      setErrMsg("Username, email and role are required.");
      return;
    }
    setStatus("loading");
    setErrMsg("");

    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => v && fd.append(k, v));
    if (image) fd.append("image", image);
    if (resume) fd.append("resume", resume);

    try {
      const res = await axios.post(`${API}/users`, fd, {
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      });
      setResult(res.data);
      setStatus("success");
      setForm({ username: "", email: "", role: "", phone: "" });
      setImage(null);
      setResume(null);
    } catch (e) {
      setErrMsg(e.response?.data?.detail || e.message);
      setStatus("error");
    }
  };
  const fields = [
    {
      name: "username",
      placeholder: "Full Name",
      type: "text",
      icon: <FiUser />,
    },
    {
      name: "email",
      placeholder: "Email Address",
      type: "email",
      icon: <FiMail />,
    },
    {
      name: "role",
      placeholder: "Job Role",
      type: "text",
      icon: <FiBriefcase />,
    },
    {
      name: "phone",
      placeholder: "Phone Number",
      type: "tel",
      icon: <FiPhone />,
    },
  ];

  const fileFields = [
    {
      label: "Profile Photo",
      accept: "image/*",
      state: image,
      set: setImage,
      icon: <FiImage />,
      hint: "JPG, PNG, WEBP",
    },
    {
      label: "Resume",
      accept: ".pdf,.doc,.docx",
      state: resume,
      set: setResume,
      icon: <FiFileText />,
      hint: "PDF or DOCX",
    },
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
          Register Candidate
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Add a new candidate with their resume to the system.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {fields.map(({ name, placeholder, type, icon }) => (
            <div key={name}>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                {placeholder}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-base">
                  {icon}
                </span>
                <input
                  name={name}
                  type={type}
                  placeholder={placeholder}
                  value={form[name]}
                  onChange={handle}
                  className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm
                             focus:outline-none focus:ring-2 focus:ring-indigo-400
                             bg-slate-50 text-slate-800 placeholder-slate-300 transition"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {fileFields.map(({ label, accept, state, set, icon, hint }) => (
            <div key={label}>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                {label}
              </label>
              <label
                className="flex items-center gap-3 border-2 border-dashed border-slate-200
                                hover:border-indigo-400 rounded-xl px-4 py-3 cursor-pointer
                                transition-colors group bg-slate-50 hover:bg-indigo-50"
              >
                <span className="text-slate-400 group-hover:text-indigo-500 text-lg">
                  {icon}
                </span>
                <div className="min-w-0">
                  <p className="text-sm text-slate-500 group-hover:text-indigo-600 truncate font-medium">
                    {state ? state.name : `Upload ${label}`}
                  </p>
                  <p className="text-xs text-slate-400">{hint}</p>
                </div>
                <FiUpload className="ml-auto text-slate-300 group-hover:text-indigo-400 shrink-0" />
                <input
                  type="file"
                  accept={accept}
                  className="hidden"
                  onChange={(e) => set(e.target.files[0])}
                />
              </label>
            </div>
          ))}
        </div>

        {errMsg && (
          <div
            className="flex items-center gap-2 bg-red-50 border border-red-200
                          text-red-600 text-sm rounded-xl px-4 py-3"
          >
            <FiAlertCircle className="shrink-0" />
            {errMsg}
          </div>
        )}

        {status === "success" && result && (
          <div
            className="flex items-start gap-3 bg-emerald-50 border border-emerald-200
                          rounded-xl px-4 py-3"
          >
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
          disabled={status === "loading"}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50
                     text-white font-semibold py-3 rounded-xl text-sm
                     transition-colors flex items-center justify-center gap-2 shadow-sm"
        >
          {status === "loading" ? (
            <>
              <span
                className="w-4 h-4 border-2 border-white border-t-transparent
                               rounded-full animate-spin"
              />
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
