import { useState } from "react";
import axios from "axios";
import {
  FiSearch,
  FiFileText,
  FiUser,
  FiCheckCircle,
  FiXCircle,
  FiTrendingUp,
  FiMessageSquare,
  FiZap,
  FiDownload,
} from "react-icons/fi";

// const API = "http://127.0.0.1:8000";
const API = "https://endorsingly-subuncinal-toya.ngrok-free.dev";

function ScoreBadge({ score }) {
  const n = parseFloat(score);
  const cls =
    n >= 75
      ? "text-emerald-700 bg-emerald-50 border-emerald-200"
      : n >= 50
        ? "text-amber-700 bg-amber-50 border-amber-200"
        : "text-red-600 bg-red-50 border-red-200";
  return (
    <span
      className={`text-xs font-bold px-2.5 py-1 rounded-full border ${cls}`}
    >
      {score}
    </span>
  );
}

function AnalysisCard({ icon, label, value, color }) {
  return (
    <div className={`rounded-xl border p-3 ${color}`}>
      <div className="flex items-center gap-1.5 mb-1">
        <span className="text-sm">{icon}</span>
        <p className="text-xs font-semibold text-slate-600">{label}</p>
      </div>
      <p className="text-xs text-slate-600 leading-relaxed">{value || "—"}</p>
    </div>
  );
}

function buildReportText(jd, results) {
  const line = "═".repeat(60);
  const thin = "─".repeat(60);

  let report = "";
  report += `${line}\n`;
  report += `   AI RESUME MATCH REPORT\n`;
  report += `   Generated: ${new Date().toLocaleString("en-IN")}\n`;
  report += `${line}\n\n`;

  report += `JOB DESCRIPTION\n${thin}\n${jd}\n\n`;

  report += `${line}\n`;
  report += `MATCHED CANDIDATES  (${results.total_matches} found)\n`;
  report += `${line}\n\n`;

  results.results.forEach((c, idx) => {
    report += `[${idx + 1}]  ${c.candidate_name || c.username}\n`;
    report += `    Email            : ${c.email}\n`;
    report += `    Role             : ${c.role}\n`;
    report += `    FAISS Score      : ${c.similarity_score}\n`;

    if (c.ai_analysis) {
      const ai = c.ai_analysis;
      report += `\n    ── AI Analysis ──────────────────────────────\n`;
      report += `    Matching Score   : ${ai.matching_score}\n`;
      report += `    Matched Skills   : ${ai.matched_skills}\n`;
      report += `    Missing Skills   : ${ai.missing_skills}\n`;
      report += `    Skills to Improve: ${ai.skills_to_improve}\n`;
      report += `    Overall Summary  : ${ai.overall_summary}\n`;
    }

    if (c.resume_file_url) {
      report += `    Resume URL       : ${c.resume_file_url}\n`;
    }

    report += `\n${thin}\n\n`;
  });

  return report;
}

function downloadTxt(jd, results) {
  const text = buildReportText(jd, results);
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `jd_match_report_${Date.now()}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

function downloadJson(jd, results) {
  const payload = {
    job_description: jd,
    generated_at: new Date().toISOString(),
    ...results,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `jd_match_report_${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function downloadCsv(jd, results) {
  const headers = [
    "Rank",
    "Name",
    "Email",
    "Role",
    "FAISS Score",
    "Matching Score",
    "Matched Skills",
    "Missing Skills",
    "Skills to Improve",
    "Overall Summary",
    "Resume URL",
  ];

  const escape = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;

  const rows = results.results.map((c, i) =>
    [
      i + 1,
      c.candidate_name || c.username,
      c.email,
      c.role,
      c.similarity_score,
      c.ai_analysis?.matching_score ?? "",
      c.ai_analysis?.matched_skills ?? "",
      c.ai_analysis?.missing_skills ?? "",
      c.ai_analysis?.skills_to_improve ?? "",
      c.ai_analysis?.overall_summary ?? "",
      c.resume_file_url ?? "",
    ]
      .map(escape)
      .join(","),
  );

  const jdRow = `\n\n"Job Description:","${jd.replace(/"/g, '""')}"`;
  const csv = [headers.join(","), ...rows].join("\n") + jdRow;

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `jd_match_report_${Date.now()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function DownloadBar({ jd, results }) {
  const [open, setOpen] = useState(false);

  const formats = [
    { label: "Download TXT", ext: "TXT", fn: () => downloadTxt(jd, results) },
    { label: "Download CSV", ext: "CSV", fn: () => downloadCsv(jd, results) },
    {
      label: "Download JSON",
      ext: "JSON",
      fn: () => downloadJson(jd, results),
    },
  ];

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-2 bg-green-600 hover:bg-indigo-700
                   text-white text-sm font-semibold px-4 py-2.5 rounded-xl
                   shadow-sm transition-colors"
      >
        <FiDownload /> Download Report
        <span className="ml-1 text-indigo-300 text-xs">▾</span>
      </button>

      {open && (
        <>
          {/* click-away overlay */}
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div
            className="absolute right-0 mt-2 z-20 bg-white rounded-xl border border-slate-200
                          shadow-xl overflow-hidden min-w-[160px]"
          >
            {formats.map(({ label, ext, fn }) => (
              <button
                key={ext}
                onClick={() => {
                  fn();
                  setOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-700
                           hover:bg-indigo-50 hover:text-indigo-700 transition-colors text-left"
              >
                <FiDownload className="text-indigo-400 shrink-0" />
                {label}
                <span className="ml-auto text-xs font-bold text-slate-400">
                  {ext}
                </span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function JDMatch() {
  const [jd, setJd] = useState("");
  const [topK, setTopK] = useState(3);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");

  const match = async () => {
    if (!jd.trim()) {
      setError("Please enter a job description.");
      return;
    }
    setLoading(true);
    setError("");
    setResults(null);
    const fd = new FormData();
    fd.append("job_description", jd);
    fd.append("top_k", topK);
    try {
      const res = await axios.post(`${API}/match-jd`, fd, {
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      });
      setResults(res.data);
    } catch (e) {
      setError(e.response?.data?.detail || e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
          AI JD Matcher
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Paste a job description to find best-matched candidates using Groq AI.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mb-6 space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
            Job Description
          </label>
          <textarea
            rows={10}
            value={jd}
            onChange={(e) => setJd(e.target.value)}
            placeholder="Paste the full job description here..."
            className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm
                       focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none
                       bg-slate-50 text-slate-800 placeholder-slate-300"
          />
        </div>

        <div className="flex items-end gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
              Top Matches
            </label>
            <select
              value={topK}
              onChange={(e) => setTopK(e.target.value)}
              className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm
                         focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-slate-50"
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n} candidate{n > 1 ? "s" : ""}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={match}
            disabled={loading}
            className="flex-1 text-white font-semibold py-2.5 rounded-xl text-sm
             flex items-center justify-center gap-2 shadow-lg
             disabled:opacity-50 cursor-pointer border-0"
            style={{
              background: "linear-gradient(270deg,#ef4444, #3b82f6, #ec4899)",
              backgroundSize: "400% 400%",
              animation: "liveGrad 3s ease infinite",
            }}
          >
            <style>{`
    @keyframes liveGrad {
      0%   { background-position: 0% 50%; }
      50%  { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
  `}</style>
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Analysing with AI...
              </>
            ) : (
              <>
                <FiZap className="text-base" /> Find Best Matches
              </>
            )}
          </button>
        </div>

        {error && (
          <div
            className="flex items-center gap-2 bg-red-50 border border-red-200
                          text-red-600 text-sm rounded-xl px-4 py-3"
          >
            <FiXCircle className="shrink-0" /> {error}
          </div>
        )}
      </div>

      {/* Results */}
      {results && (
        <div>
          {/* Results header with download */}
          <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              {results.total_matches} candidate
              {results.total_matches !== 1 ? "s" : ""} matched
            </p>
            <DownloadBar jd={jd} results={results} />
          </div>

          {/* Candidate cards */}
          <div className="space-y-4">
            {results.results.map((c, idx) => (
              <div
                key={c.user_id}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Top row */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    {c.image_url ? (
                      <img
                        src={c.image_url}
                        alt={c.username}
                        className="w-11 h-11 rounded-full object-cover border-2 border-slate-100"
                      />
                    ) : (
                      <div
                        className="w-11 h-11 rounded-full bg-indigo-100 text-indigo-700
                                      flex items-center justify-center font-bold text-base"
                      >
                        {c.username?.[0]?.toUpperCase()}
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-slate-800">
                          {c.candidate_name || c.username}
                        </p>
                        <span className="text-xs text-slate-400 font-mono bg-slate-100 px-1.5 py-0.5 rounded">
                          #{idx + 1}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">{c.email}</p>
                      <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-medium">
                        {c.role}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <ScoreBadge score={c.ai_analysis?.matching_score || "—"} />
                    <span className="text-xs text-slate-400">
                      FAISS: {c.similarity_score}
                    </span>
                  </div>
                </div>

                {/* AI Analysis */}
                {c.ai_analysis && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                    <AnalysisCard
                      icon={<FiCheckCircle className="text-emerald-500" />}
                      label="Matched Skills"
                      value={c.ai_analysis.matched_skills}
                      color="border-emerald-100 bg-emerald-50"
                    />
                    <AnalysisCard
                      icon={<FiXCircle className="text-red-400" />}
                      label="Missing Skills"
                      value={c.ai_analysis.missing_skills}
                      color="border-red-100 bg-red-50"
                    />
                    <AnalysisCard
                      icon={<FiTrendingUp className="text-amber-500" />}
                      label="Skills to Improve"
                      value={
                        <ul className="list-disc pl-5 space-y-1">
                          {c.ai_analysis.skills_to_improve
                            .split(/\d+\)/)
                            .filter(Boolean)
                            .map((item, index) => (
                              <li key={index}>{item.trim()}</li>
                            ))}
                        </ul>
                      }
                      color="border-amber-100 bg-amber-50"
                    />
                    <AnalysisCard
                      icon={<FiMessageSquare className="text-slate-500" />}
                      label="Overall Summary"
                      value={c.ai_analysis.overall_summary}
                      color="border-slate-100 bg-slate-50"
                    />
                  </div>
                )}

                {/* Resume link */}
                {c.resume_file_url && (
                  <a
                    href={c.resume_file_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-indigo-600
                                hover:text-indigo-800 hover:underline font-medium"
                  >
                    <FiFileText /> View Resume
                  </a>
                )}
              </div>
            ))}
          </div>

          <div
            className="mt-6 bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4
                          flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
          >
            <div>
              <p className="text-sm font-semibold text-slate-700">
                Download Full Report
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                Includes job description, all {results.total_matches} candidates
                and AI analysis
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => downloadTxt(jd, results)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold
                           border border-slate-300 hover:border-indigo-400 hover:text-indigo-600
                           text-slate-600 px-3 py-2 rounded-lg transition-colors bg-white"
              >
                <FiDownload /> TXT
              </button>
              <button
                onClick={() => downloadCsv(jd, results)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold
                           border border-slate-300 hover:border-emerald-400 hover:text-emerald-600
                           text-slate-600 px-3 py-2 rounded-lg transition-colors bg-white"
              >
                <FiDownload /> CSV
              </button>
              <button
                onClick={() => downloadJson(jd, results)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold
                           border border-slate-300 hover:border-blue-400 hover:text-blue-600
                           text-slate-600 px-3 py-2 rounded-lg transition-colors bg-white"
              >
                <FiDownload /> JSON
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
