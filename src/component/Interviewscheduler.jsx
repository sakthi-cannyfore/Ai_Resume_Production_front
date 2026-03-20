import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  FiCalendar, FiClock, FiUser, FiLink, FiFileText,
  FiPlus, FiEdit2, FiTrash2, FiExternalLink, FiRefreshCw,
  FiChevronDown, FiCheck, FiX,
} from "react-icons/fi";

const API = "http://127.0.0.1:8000";

const ROUNDS = ["Screening", "L1 Interview", "L2 Interview", "HR Interview", "Final Round"];
const DURATIONS = [15, 30, 45, 60, 90, 120];
const STATUSES = ["Scheduled", "Completed", "Cancelled", "Rescheduled", "No Show"];

const ROUND_COLORS = {
  "Screening":     "bg-blue-50 text-blue-700 border-blue-200",
  "L1 Interview":  "bg-indigo-50 text-indigo-700 border-indigo-200",
  "L2 Interview":  "bg-violet-50 text-violet-700 border-violet-200",
  "HR Interview":  "bg-purple-50 text-purple-700 border-purple-200",
  "Final Round":   "bg-amber-50 text-amber-700 border-amber-200",
};

const STATUS_COLORS = {
  "Scheduled":    "bg-emerald-50 text-emerald-700",
  "Completed":    "bg-green-50 text-green-700",
  "Cancelled":    "bg-red-50 text-red-700",
  "Rescheduled":  "bg-orange-50 text-orange-700",
  "No Show":      "bg-gray-100 text-gray-500",
};

const emptyForm = {
  user_id: "", round: "L1 Interview", interviewer_name: "",
  scheduled_at: "", duration_minutes: 60, notes: "",
};

// ── Label component ───────────────────────────────────────────────────────────
function Label({ children, required }) {
  return (
    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
      {children}
      {required && <span className="text-red-400 ml-0.5">*</span>}
    </label>
  );
}

// ── Modal ─────────────────────────────────────────────────────────────────────
function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.4)" }}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="text-base font-semibold text-slate-800">{title}</h3>
          <button onClick={onClose}
            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition">
            <FiX />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function InterviewScheduler() {
  const [interviews, setInterviews]   = useState([]);
  const [candidates, setCandidates]   = useState([]);
  const [loading, setLoading]         = useState(true);
  const [showModal, setShowModal]     = useState(false);
  const [editModal, setEditModal]     = useState(null);   // interview object
  const [form, setForm]               = useState(emptyForm);
  const [submitting, setSubmitting]   = useState(false);
  const [errMsg, setErrMsg]           = useState("");
  const [filterRound, setFilterRound] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [candidateSearch, setCandidateSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  // Fetch all interviews
  const fetchInterviews = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterRound  !== "All") params.round  = filterRound;
      if (filterStatus !== "All") params.status = filterStatus;
      const res = await axios.get(`${API}/interviews`, { params });
      setInterviews(res.data.interviews || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [filterRound, filterStatus]);

  // Fetch candidate list for dropdown
  const fetchCandidates = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/users`);
      setCandidates(res.data.users || []);
    } catch (e) { console.error(e); }
  }, []);

  useEffect(() => { fetchInterviews(); }, [fetchInterviews]);
  useEffect(() => { fetchCandidates(); }, [fetchCandidates]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  }, []);

  // Select candidate from dropdown
  const selectCandidate = (c) => {
    setForm((p) => ({ ...p, user_id: c.user_id }));
    setCandidateSearch(`${c.username} — ${c.email}`);
    setShowDropdown(false);
  };

  const filteredCandidates = candidates.filter((c) =>
    candidateSearch.length < 2 ||
    c.username.toLowerCase().includes(candidateSearch.toLowerCase()) ||
    c.email.toLowerCase().includes(candidateSearch.toLowerCase())
  );

  // Submit new interview
  const submitSchedule = async () => {
    if (!form.user_id || !form.scheduled_at || !form.round) {
      setErrMsg("Candidate, round and date/time are required.");
      return;
    }
    setSubmitting(true);
    setErrMsg("");
    try {
      await axios.post(`${API}/interviews`, {
        ...form,
        user_id:          Number(form.user_id),
        duration_minutes: Number(form.duration_minutes),
      });
      setShowModal(false);
      setForm(emptyForm);
      setCandidateSearch("");
      fetchInterviews();
    } catch (e) {
      setErrMsg(e.response?.data?.detail || e.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Update meeting link / status
  const submitEdit = async () => {
    if (!editModal) return;
    setSubmitting(true);
    setErrMsg("");
    try {
      await axios.patch(`${API}/interviews/${editModal.id}`, {
        meeting_link:     editModal.meeting_link,
        notes:            editModal.notes,
        status:           editModal.status,
        interviewer_name: editModal.interviewer_name,
      });
      setEditModal(null);
      fetchInterviews();
    } catch (e) {
      setErrMsg(e.response?.data?.detail || e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const deleteInterview = async (id) => {
    if (!window.confirm("Cancel this interview?")) return;
    try {
      await axios.delete(`${API}/interviews/${id}`);
      fetchInterviews();
    } catch (e) { alert(e.response?.data?.detail || e.message); }
  };

  const formatDt = (s) => {
    const d = new Date(s);
    return d.toLocaleString("en-IN", {
      day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-2 sm:px-4">

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Interview Scheduler</h2>
          <p className="text-sm text-slate-500 mt-0.5">{interviews.length} interviews scheduled</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchInterviews}
            className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-500 transition">
            <FiRefreshCw className={loading ? "animate-spin" : ""} />
          </button>
          <button onClick={() => { setShowModal(true); setErrMsg(""); }}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700
                       text-white rounded-xl text-sm font-medium transition shadow-sm">
            <FiPlus /> Schedule Interview
          </button>
        </div>
      </div>

      {/* ── Filters ─────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-2 mb-5">
        <select value={filterRound} onChange={(e) => setFilterRound(e.target.value)}
          className="px-3 py-2 border border-slate-200 rounded-xl text-sm bg-white text-slate-700
                     focus:outline-none focus:ring-2 focus:ring-indigo-400">
          <option value="All">All Rounds</option>
          {ROUNDS.map((r) => <option key={r}>{r}</option>)}
        </select>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 border border-slate-200 rounded-xl text-sm bg-white text-slate-700
                     focus:outline-none focus:ring-2 focus:ring-indigo-400">
          <option value="All">All Statuses</option>
          {STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>
        <button onClick={fetchInterviews}
          className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition">
          Apply
        </button>
      </div>

      {/* ── Table ───────────────────────────────────────────────────────── */}
      {loading ? (
        <div className="flex items-center justify-center py-20 text-slate-400 gap-3">
          <span className="w-6 h-6 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
          Loading interviews...
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  {["#", "Candidate", "Round", "Date & Time", "Duration", "Interviewer", "Link", "Status", "Actions"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {interviews.length === 0 && (
                  <tr>
                    <td colSpan={9} className="text-center py-16 text-slate-400">
                      <FiCalendar className="mx-auto text-3xl mb-2 text-slate-300" />
                      No interviews scheduled yet.
                    </td>
                  </tr>
                )}
                {interviews.map((iv, i) => (
                  <tr key={iv.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-slate-400 text-xs font-mono">{i + 1}</td>

                    <td className="px-4 py-3">
                      <p className="font-semibold text-slate-800 text-sm truncate max-w-[130px]">
                        {iv.candidate_name}
                      </p>
                      <p className="text-xs text-slate-400 truncate max-w-[130px]">{iv.candidate_email}</p>
                    </td>

                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium border whitespace-nowrap
                        ${ROUND_COLORS[iv.round] || "bg-gray-50 text-gray-600 border-gray-200"}`}>
                        {iv.round}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-slate-600 text-xs whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <FiCalendar className="text-slate-400 shrink-0" style={{ fontSize: 12 }} />
                        {formatDt(iv.scheduled_at)}
                      </div>
                    </td>

                    <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <FiClock style={{ fontSize: 12 }} />
                        {iv.duration_minutes} min
                      </div>
                    </td>

                    <td className="px-4 py-3 text-slate-500 text-xs max-w-[120px] truncate">
                      {iv.interviewer_name || <span className="text-slate-300">—</span>}
                    </td>

                    <td className="px-4 py-3">
                      {iv.meeting_link ? (
                        <a href={iv.meeting_link} target="_blank" rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800
                                     font-medium transition whitespace-nowrap">
                          <FiExternalLink style={{ fontSize: 12 }} /> Open
                        </a>
                      ) : (
                        <span className="text-slate-300 text-xs">No link</span>
                      )}
                    </td>

                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap
                        ${STATUS_COLORS[iv.status] || "bg-gray-50 text-gray-500"}`}>
                        {iv.status}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => { setEditModal({ ...iv }); setErrMsg(""); }}
                          className="p-1.5 hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 rounded-lg transition"
                          title="Edit">
                          <FiEdit2 style={{ fontSize: 13 }} />
                        </button>
                        <button onClick={() => deleteInterview(iv.id)}
                          className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg transition"
                          title="Cancel">
                          <FiTrash2 style={{ fontSize: 13 }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Schedule Modal ───────────────────────────────────────────────── */}
      {showModal && (
        <Modal title="Schedule Interview" onClose={() => { setShowModal(false); setForm(emptyForm); setCandidateSearch(""); }}>
          <div className="space-y-4">

            {/* Candidate search */}
            <div className="relative">
              <Label required>Candidate</Label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" style={{ fontSize: 14 }} />
                <input
                  value={candidateSearch}
                  onChange={(e) => { setCandidateSearch(e.target.value); setShowDropdown(true); setForm((p) => ({ ...p, user_id: "" })); }}
                  onFocus={() => setShowDropdown(true)}
                  placeholder="Search by name or email..."
                  className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm
                             focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-slate-50"
                />
              </div>
              {showDropdown && candidateSearch.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                  {filteredCandidates.length === 0 ? (
                    <p className="text-xs text-slate-400 px-4 py-3">No candidates found</p>
                  ) : filteredCandidates.slice(0, 8).map((c) => (
                    <button key={c.user_id} onClick={() => selectCandidate(c)}
                      className="w-full text-left px-4 py-2.5 hover:bg-indigo-50 transition-colors">
                      <p className="text-sm font-medium text-slate-800">{c.username}</p>
                      <p className="text-xs text-slate-400">{c.email} · {c.role}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Round */}
            <div>
              <Label required>Interview Round</Label>
              <select name="round" value={form.round} onChange={handleChange}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm
                           focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-slate-50">
                {ROUNDS.map((r) => <option key={r}>{r}</option>)}
              </select>
            </div>

            {/* Date + Duration side by side */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label required>Date & Time</Label>
                <input type="datetime-local" name="scheduled_at"
                  value={form.scheduled_at} onChange={handleChange}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm
                             focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-slate-50" />
              </div>
              <div>
                <Label>Duration</Label>
                <select name="duration_minutes" value={form.duration_minutes} onChange={handleChange}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm
                             focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-slate-50">
                  {DURATIONS.map((d) => <option key={d} value={d}>{d} min</option>)}
                </select>
              </div>
            </div>

            {/* Interviewer */}
            <div>
              <Label>Interviewer Name</Label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" style={{ fontSize: 14 }} />
                <input name="interviewer_name" value={form.interviewer_name} onChange={handleChange}
                  placeholder="e.g. Rajesh Kumar"
                  className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm
                             focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-slate-50" />
              </div>
            </div>

            {/* Notes */}
            <div>
              <Label>Notes</Label>
              <textarea name="notes" value={form.notes} onChange={handleChange} rows={2}
                placeholder="Any notes for the interviewer..."
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm resize-none
                           focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-slate-50" />
            </div>

            <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-700">
              A Google Calendar pre-filled link will be auto-generated. Click it to create the Google Meet event and get the Meet link.
            </div>

            {errMsg && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
                <FiX className="shrink-0" /> {errMsg}
              </div>
            )}

            <div className="flex gap-3 pt-1">
              <button onClick={() => { setShowModal(false); setForm(emptyForm); setCandidateSearch(""); }}
                className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm hover:bg-slate-50 transition">
                Cancel
              </button>
              <button onClick={submitSchedule} disabled={submitting}
                className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50
                           text-white rounded-xl text-sm font-medium transition flex items-center justify-center gap-2">
                {submitting
                  ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  : <><FiCalendar /> Schedule</>}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ── Edit Modal ───────────────────────────────────────────────────── */}
      {editModal && (
        <Modal title="Edit Interview" onClose={() => setEditModal(null)}>
          <div className="space-y-4">
            <div>
              <Label>Meeting Link</Label>
              <div className="relative">
                <FiLink className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" style={{ fontSize: 14 }} />
                <input value={editModal.meeting_link || ""}
                  onChange={(e) => setEditModal((p) => ({ ...p, meeting_link: e.target.value }))}
                  placeholder="Paste Google Meet / Teams / Zoom link..."
                  className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm
                             focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-slate-50" />
              </div>
              {editModal.meeting_link && (
                <a href={editModal.meeting_link} target="_blank" rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-indigo-600 mt-1.5 hover:underline">
                  <FiExternalLink style={{ fontSize: 11 }} /> Test link
                </a>
              )}
            </div>

            <div>
              <Label>Interviewer</Label>
              <input value={editModal.interviewer_name || ""}
                onChange={(e) => setEditModal((p) => ({ ...p, interviewer_name: e.target.value }))}
                placeholder="Interviewer name"
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm
                           focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-slate-50" />
            </div>

            <div>
              <Label>Status</Label>
              <select value={editModal.status}
                onChange={(e) => setEditModal((p) => ({ ...p, status: e.target.value }))}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm
                           focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-slate-50">
                {STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>

            <div>
              <Label>Notes</Label>
              <textarea value={editModal.notes || ""}
                onChange={(e) => setEditModal((p) => ({ ...p, notes: e.target.value }))} rows={2}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm resize-none
                           focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-slate-50" />
            </div>

            {errMsg && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
                <FiX className="shrink-0" /> {errMsg}
              </div>
            )}

            <div className="flex gap-3 pt-1">
              <button onClick={() => setEditModal(null)}
                className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm hover:bg-slate-50 transition">
                Cancel
              </button>
              <button onClick={submitEdit} disabled={submitting}
                className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50
                           text-white rounded-xl text-sm font-medium transition flex items-center justify-center gap-2">
                {submitting
                  ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  : <><FiCheck /> Save Changes</>}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}