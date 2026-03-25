import { useState, useEffect } from "react";
import axios from "axios";
import {
  FiSearch,
  FiFileText,
  FiRefreshCw,
  FiUser,
  FiChevronRight,
  FiFilter,
  FiTrash2,
  FiAlertTriangle,
  FiX,
  FiCheckSquare,
} from "react-icons/fi";
import UserDetail from "./Userdetail";

const API = "http://127.0.0.1:8000";

const STATUS_COLORS = {
  Screening: "bg-blue-50 text-blue-700",
  "L1 Interview": "bg-indigo-50 text-indigo-700",
  "L2 Interview": "bg-violet-50 text-violet-700",
  "HR Interview": "bg-purple-50 text-purple-700",
  "Offer Released": "bg-emerald-50 text-emerald-700",
  "Pre-Onboarding": "bg-teal-50 text-teal-700",
  Onboarded: "bg-green-50 text-green-700",
  Rejected: "bg-red-50 text-red-700",
  "Awaiting Feedback": "bg-amber-50 text-amber-700",
  "On Hold": "bg-orange-50 text-orange-700",
  "Offer Rejected": "bg-rose-50 text-rose-700",
};

const ROLE_COLORS = {
  "Lead consultant": "bg-purple-100 text-purple-700",
  "Senior Software Engineer": "bg-orange-50 text-orange-700",
  "Software Engineer": "bg-blue-50 text-blue-700",
  "Trainee – Software Engineer": "bg-green-50 text-green-700",
};

const ALL_STATUSES = [
  "All",
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

// ── Confirmation Modal ─────────────────────────────────────────────────────────
function ConfirmModal({ count, names, onConfirm, onCancel, loading }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCancel}
      />
      {/* panel */}
      <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6 z-10">
        {/* close */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition"
        >
          <FiX />
        </button>

        {/* icon */}
        <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4">
          <FiAlertTriangle className="text-red-500 text-xl" />
        </div>

        <h3 className="text-lg font-bold text-slate-800 mb-1">
          Delete {count} candidate{count !== 1 ? "s" : ""}?
        </h3>
        <p className="text-sm text-slate-500 mb-4">
          This action is{" "}
          <span className="font-semibold text-red-500">permanent</span> and
          cannot be undone. All associated resume data, FAISS vectors, and
          uploaded files will also be removed.
        </p>

        {/* name list */}
        <div className="bg-slate-50 rounded-xl border border-slate-200 p-3 mb-5 max-h-36 overflow-y-auto">
          {names.map((n, i) => (
            <div
              key={i}
              className="flex items-center gap-2 py-1 text-sm text-slate-600"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
              {n}
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 border border-slate-200 text-slate-600 rounded-xl py-2.5 text-sm
                       font-medium hover:bg-slate-50 transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-xl py-2.5 text-sm
                       font-semibold transition disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? (
              <FiRefreshCw className="animate-spin" style={{ fontSize: 14 }} />
            ) : (
              <FiTrash2 style={{ fontSize: 14 }} />
            )}
            {loading ? "Deleting…" : `Delete ${count}`}
          </button>
        </div>
      </div>
    </div>
  );
}

function Toast({ message, type = "success", onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl
                  shadow-lg border text-sm font-medium animate-fade-in
                  ${
                    type === "success"
                      ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                      : "bg-red-50 border-red-200 text-red-700"
                  }`}
    >
      {message}
      <button onClick={onClose} className="ml-1 opacity-60 hover:opacity-100">
        <FiX style={{ fontSize: 13 }} />
      </button>
    </div>
  );
}

export default function AllUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const [fName, setFName] = useState("");
  const [fEmail, setFEmail] = useState("");
  const [fRole, setFRole] = useState("");
  const [fSkills, setFSkills] = useState("");
  const [fStatus, setFStatus] = useState("All");

  const [selected_ids, setSelectedIds] = useState(new Set());

  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const buildQuery = () => {
    const p = new URLSearchParams();
    if (fName) p.append("name", fName);
    if (fEmail) p.append("email", fEmail);
    if (fRole) p.append("role", fRole);
    if (fSkills) p.append("skills", fSkills);
    if (fStatus !== "All") p.append("status", fStatus);
    return p.toString();
  };

  const fetchUsers = () => {
    setLoading(true);
    setError("");
    setSelectedIds(new Set());
    const q = buildQuery();
    axios
      .get(`${API}/users${q ? "?" + q : ""}`)
      .then((r) => {
        setUsers(r.data.users || []);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const clearFilters = () => {
    setFName("");
    setFEmail("");
    setFRole("");
    setFSkills("");
    setFStatus("All");
  };

  const allChecked = users.length > 0 && selected_ids.size === users.length;
  const someChecked = selected_ids.size > 0 && !allChecked;

  const toggleAll = () => {
    if (allChecked) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(users.map((u) => u.user_id)));
    }
  };

  const toggleOne = (uid, e) => {
    e.stopPropagation();
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(uid) ? next.delete(uid) : next.add(uid);
      return next;
    });
  };

  const selectedUsers = users.filter((u) => selected_ids.has(u.user_id));
  const selectedNames = selectedUsers.map((u) => u.username);

  const handleDeleteClick = () => {
    if (selected_ids.size === 0) return;
    setShowConfirm(true);
  };

  const handleConfirmDelete = async () => {
    setDeleteLoading(true);
    try {
      const fd = new FormData();
      fd.append("user_ids", [...selected_ids].join(","));
      const res = await axios.delete(`${API}/users`, { data: fd });
      const count = res.data.count ?? selected_ids.size;
      setToast({
        message: `✓ ${count} candidate${count !== 1 ? "s" : ""} deleted successfully`,
        type: "success",
      });
      setSelectedIds(new Set());
      setShowConfirm(false);
      fetchUsers();
    } catch (e) {
      setToast({
        message: e.response?.data?.detail || "Delete failed",
        type: "error",
      });
      setShowConfirm(false);
    } finally {
      setDeleteLoading(false);
    }
  };

  if (selected) {
    return (
      <UserDetail
        user={selected}
        onBack={() => setSelected(null)}
        onRefresh={fetchUsers}
      />
    );
  }

  const activeFilterCount =
    [fName, fEmail, fRole, fSkills].filter(Boolean).length +
    (fStatus !== "All" ? 1 : 0);

  return (
    <div>
      <div className="mb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
            All Candidates
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            {users.length} candidates
          </p>
        </div>

        <div className="flex items-center gap-2">
          {selected_ids.size > 0 && (
            <button
              onClick={handleDeleteClick}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700
                         text-white rounded-xl text-sm font-semibold transition shadow-sm"
            >
              <FiTrash2 style={{ fontSize: 14 }} />
              Delete {selected_ids.size}
            </button>
          )}

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1.5 px-3 py-2 border rounded-xl text-sm transition
              ${
                showFilters || activeFilterCount > 0
                  ? "bg-indigo-50 border-indigo-300 text-indigo-700"
                  : "border-slate-200 text-slate-500 hover:bg-slate-50"
              }`}
          >
            <FiFilter className="text-sm" />
            Filters
            {activeFilterCount > 0 && (
              <span className="bg-indigo-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>

          <button
            onClick={fetchUsers}
            className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-500 hover:text-indigo-600 transition"
          >
            <FiRefreshCw className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {selected_ids.size > 0 && (
        <div
          className="flex items-center gap-3 bg-indigo-50 border border-indigo-200 rounded-xl
                        px-4 py-2.5 mb-4 text-sm text-indigo-700 font-medium"
        >
          <FiCheckSquare style={{ fontSize: 16 }} />
          <span>
            {selected_ids.size} candidate{selected_ids.size !== 1 ? "s" : ""}{" "}
            selected
          </span>
          <button
            onClick={() => setSelectedIds(new Set())}
            className="ml-auto text-xs text-indigo-500 hover:text-indigo-700 underline transition"
          >
            Clear selection
          </button>
        </div>
      )}

      {showFilters && (
        <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-5 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { val: fName, set: setFName, ph: "Name..." },
              { val: fEmail, set: setFEmail, ph: "Email..." },
              { val: fRole, set: setFRole, ph: "Role..." },
              { val: fSkills, set: setFSkills, ph: "Skills (e.g. React)..." },
            ].map(({ val, set, ph }) => (
              <div key={ph} className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                <input
                  value={val}
                  onChange={(e) => set(e.target.value)}
                  placeholder={ph}
                  className="pl-8 pr-3 py-2 border border-slate-200 rounded-xl text-sm w-full
                             focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-slate-50"
                />
              </div>
            ))}
            <select
              value={fStatus}
              onChange={(e) => setFStatus(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-xl text-sm bg-slate-50
                         focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              {ALL_STATUSES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            <div className="flex gap-2">
              <button
                onClick={fetchUsers}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-2 text-sm font-medium transition"
              >
                Apply
              </button>
              <button
                onClick={() => {
                  clearFilters();
                  setTimeout(fetchUsers, 50);
                }}
                className="flex-1 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl py-2 text-sm transition"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-5">
        {ALL_STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => {
              setFStatus(s);
              setTimeout(fetchUsers, 50);
            }}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition
              ${
                fStatus === s
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300"
              }`}
          >
            {s}
          </button>
        ))}
      </div>

      {loading && (
        <div className="text-center py-20 text-slate-400 text-sm flex flex-col items-center gap-3">
          <span className="w-8 h-8 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
          Fetching candidates...
        </div>
      )}
      {error && (
        <div className="text-center py-20 text-red-400 text-sm">❌ {error}</div>
      )}

      {!loading && !error && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-4 py-3 w-10">
                    <input
                      type="checkbox"
                      checked={allChecked}
                      ref={(el) => {
                        if (el) el.indeterminate = someChecked;
                      }}
                      onChange={toggleAll}
                      className="w-4 h-4 rounded accent-indigo-600 cursor-pointer"
                    />
                  </th>
                  {[
                    "#",
                    "Candidate",
                    "Role",
                    "Skills",
                    "Exp",
                    "Status",
                    "Resume",
                    "Joined",
                    "",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.length === 0 && (
                  <tr>
                    <td
                      colSpan={10}
                      className="text-center py-16 text-slate-400"
                    >
                      <FiUser className="mx-auto text-3xl mb-2 text-slate-300" />
                      No candidates found.
                    </td>
                  </tr>
                )}
                {users.map((u, i) => {
                  const isChecked = selected_ids.has(u.user_id);
                  return (
                    <tr
                      key={u.user_id}
                      onClick={() => setSelected(u)}
                      className={`border-b border-slate-100 transition-colors cursor-pointer group
                        ${
                          isChecked
                            ? "bg-indigo-50/60 hover:bg-indigo-50"
                            : "hover:bg-indigo-50"
                        }`}
                    >
                      <td
                        className="px-4 py-3"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => toggleOne(u.user_id, e)}
                          className="w-4 h-4 rounded accent-indigo-600 cursor-pointer"
                        />
                      </td>

                      <td className="px-4 py-3 text-slate-400 text-xs font-mono">
                        {i + 1}
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {u.image_url ? (
                            <img
                              src={u.image_url}
                              alt={u.username}
                              className="w-9 h-9 rounded-full object-cover border border-slate-100 shrink-0"
                            />
                          ) : (
                            <div
                              className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700
                                            flex items-center justify-center font-bold text-sm shrink-0"
                            >
                              {u.username?.[0]?.toUpperCase()}
                            </div>
                          )}
                          <div className="min-w-0">
                            <p
                              className="font-semibold text-slate-800 truncate max-w-[130px]
                                           group-hover:text-indigo-700 transition-colors"
                            >
                              {u.username}
                            </p>
                            <p className="text-xs text-slate-400 truncate max-w-[130px]">
                              {u.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap
                          ${ROLE_COLORS[u.role] || "bg-gray-50 text-gray-700"}`}
                        >
                          {u.role}
                        </span>
                      </td>

                      <td className="px-4 py-3 max-w-[160px]">
                        {u.skills ? (
                          <p
                            className="text-xs text-slate-500 truncate"
                            title={u.skills}
                          >
                            {u.skills.split(",").slice(0, 3).join(", ")}
                            {u.skills.split(",").length > 3 && " ..."}
                          </p>
                        ) : (
                          <span className="text-slate-300 text-xs">—</span>
                        )}
                      </td>

                      <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">
                        {u.total_exp || (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap
                          ${STATUS_COLORS[u.status] || "bg-gray-50 text-gray-600"}`}
                        >
                          {u.status || "Screening"}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        {u.raw_resumes?.length > 0 ? (
                          <span className="inline-flex items-center gap-1.5 text-xs text-indigo-600 font-medium max-w-[120px] truncate">
                            <FiFileText className="shrink-0" />
                            <span className="truncate">
                              {u.raw_resumes[0].file_name}
                            </span>
                          </span>
                        ) : (
                          <span className="text-slate-300 text-xs">
                            No resume
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3 text-slate-400 text-xs whitespace-nowrap">
                        {new Date(u.created_at).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>

                      <td className="px-4 py-3 text-slate-300 group-hover:text-indigo-500 transition-colors">
                        <FiChevronRight />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showConfirm && (
        <ConfirmModal
          count={selected_ids.size}
          names={selectedNames}
          loading={deleteLoading}
          onConfirm={handleConfirmDelete}
          onCancel={() => !deleteLoading && setShowConfirm(false)}
        />
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
