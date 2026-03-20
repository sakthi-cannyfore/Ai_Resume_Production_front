// import { useState, useEffect } from "react";
// import axios from "axios";
// import {
//   FiSearch,
//   FiFileText,
//   FiRefreshCw,
//   FiUser,
//   FiChevronRight,
// } from "react-icons/fi";
// import UserDetail from "./Userdetail";

// const API = "http://127.0.0.1:8000";
// // const API = "https://endorsingly-subuncinal-toya.ngrok-free.dev ";

// export default function AllUsers() {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [search, setSearch] = useState("");
//   const [error, setError] = useState("");
//   const [selected, setSelected] = useState(null);

//   const fetchUsers = () => {
//     setLoading(true);
//     axios
//       .get(`${API}/users`)
//       .then((r) => {
//         setUsers(r.data.users || []);
//         setLoading(false);
//       })
//       .catch((e) => {
//         setError(e.message);
//         setLoading(false);
//       });
//   };

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const filtered = users.filter((u) =>
//     [u.username, u.email, u.role].some((v) =>
//       v?.toLowerCase().includes(search.toLowerCase()),
//     ),
//   );

//   if (selected) {
//     return <UserDetail user={selected} onBack={() => setSelected(null)} />;
//   }

//   return (
//     <div>
//       <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
//         <div>
//           <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
//             All Candidates
//           </h2>
//           <p className="text-sm text-slate-500 mt-1">
//             {users.length} registered candidates
//           </p>
//         </div>
//         <div className="flex items-center gap-2">
//           <div className="relative">
//             <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
//             <input
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               placeholder="Search candidates..."
//               className="pl-8 pr-4 py-2 border border-slate-200 rounded-xl text-sm
//                          focus:outline-none focus:ring-2 focus:ring-indigo-400
//                          bg-white w-full sm:w-56"
//             />
//           </div>
//           <button
//             onClick={fetchUsers}
//             className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50
//                        text-slate-500 hover:text-indigo-600 transition-colors"
//           >
//             <FiRefreshCw className={loading ? "animate-spin" : ""} />
//           </button>
//         </div>
//       </div>

//       {loading && (
//         <div className="text-center py-20 text-slate-400 text-sm flex flex-col items-center gap-3">
//           <span className="w-8 h-8 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
//           Fetching Developer Profiles...
//         </div>
//       )}

//       {error && (
//         <div className="text-center py-20 text-red-400 text-sm">❌ {error}</div>
//       )}

//       {!loading && !error && (
//         <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="w-full text-sm">
//               <thead>
//                 <tr className="bg-slate-50 border-b border-slate-200">
//                   {[
//                     "#",
//                     "Candidate",
//                     "Role",
//                     "Phone",
//                     "Resume",
//                     "Joined",
//                     "",
//                   ].map((h) => (
//                     <th
//                       key={h}
//                       className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide"
//                     >
//                       {h}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {filtered.length === 0 && (
//                   <tr>
//                     <td
//                       colSpan={7}
//                       className="text-center py-16 text-slate-400"
//                     >
//                       <FiUser className="mx-auto text-3xl mb-2 text-slate-300" />
//                       No candidates found.
//                     </td>
//                   </tr>
//                 )}
//                 {filtered.map((u, i) => (
//                   <tr
//                     key={u.user_id}
//                     onClick={() => setSelected(u)}
//                     className="border-b border-slate-100 hover:bg-indigo-50 transition-colors cursor-pointer group"
//                   >
//                     <td className="px-4 py-3 text-slate-400 text-xs font-mono">
//                       {i + 1}
//                     </td>
//                     <td className="px-4 py-3">
//                       <div className="flex items-center gap-3">
//                         {u.image_url ? (
//                           <img
//                             src={u.image_url}
//                             alt={u.username}
//                             className="w-12 h-13 rounded-md object-cover border-2 border-slate-100 shrink-0"
//                           />
//                         ) : (
//                           <div
//                             className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700
//                                           flex items-center justify-center font-bold text-sm shrink-0"
//                           >
//                             {u.username?.[0]?.toUpperCase()}
//                           </div>
//                         )}
//                         <div className="min-w-0">
//                           <p className="font-semibold text-slate-800 truncate group-hover:text-indigo-700 transition-colors">
//                             {u.username}
//                           </p>
//                           <p className="text-xs text-slate-400 truncate">
//                             {u.email}
//                           </p>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-4 py-3">
//                       <span
//                         className={`text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap
//       ${
//         u.role === "Lead consultant"
//           ? "bg-purple-100 text-purple-600"
//           : u.role === "Senior Software Engineer"
//             ? "bg-orange-50 text-orange-700"
//             : u.role === "Software Engineer"
//               ? "bg-blue-50 text-blue-700"
//               : u.role === "Trainee – Software Engineer"
//                 ? "bg-green-50 text-green-700"
//                 : "bg-gray-50 text-gray-700"
//       }
//     `}
//                       >
//                         {u.role}
//                       </span>
//                     </td>
//                     <td className="px-4 py-3 text-slate-500 text-xs">
//                       {u.phone || <span className="text-slate-300">—</span>}
//                     </td>
//                     <td className="px-4 py-3">
//                       {u.raw_resumes?.length > 0 ? (
//                         <span className="inline-flex items-center gap-1.5 text-xs text-indigo-600 font-medium max-w-[160px] truncate">
//                           <FiFileText className="shrink-0" />
//                           <span className="truncate">
//                             {u.raw_resumes[0].file_name}
//                           </span>
//                         </span>
//                       ) : (
//                         <span className="text-slate-300 text-xs">
//                           No resume
//                         </span>
//                       )}
//                     </td>
//                     <td className="px-4 py-3 text-slate-400 text-xs whitespace-nowrap">
//                       {new Date(u.created_at).toLocaleDateString("en-IN", {
//                         day: "2-digit",
//                         month: "short",
//                         year: "numeric",
//                       })}
//                     </td>
//                     <td className="px-4 py-3 text-slate-300 group-hover:text-indigo-500 transition-colors">
//                       <FiChevronRight />
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import axios from "axios";
import {
  FiSearch,
  FiFileText,
  FiRefreshCw,
  FiUser,
  FiChevronRight,
  FiFilter,
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

export default function AllUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  // Filter state
  const [fName, setFName] = useState("");
  const [fEmail, setFEmail] = useState("");
  const [fRole, setFRole] = useState("");
  const [fSkills, setFSkills] = useState("");
  const [fStatus, setFStatus] = useState("All");

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
      {/* ── Header ──────────────────────────────────────────────────────── */}
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

      {/* ── Filter panel ────────────────────────────────────────────────── */}
      {showFilters && (
        <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-5 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
              <input
                value={fName}
                onChange={(e) => setFName(e.target.value)}
                placeholder="Name..."
                className="pl-8 pr-3 py-2 border border-slate-200 rounded-xl text-sm w-full focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-slate-50"
              />
            </div>
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
              <input
                value={fEmail}
                onChange={(e) => setFEmail(e.target.value)}
                placeholder="Email..."
                className="pl-8 pr-3 py-2 border border-slate-200 rounded-xl text-sm w-full focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-slate-50"
              />
            </div>
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
              <input
                value={fRole}
                onChange={(e) => setFRole(e.target.value)}
                placeholder="Role..."
                className="pl-8 pr-3 py-2 border border-slate-200 rounded-xl text-sm w-full focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-slate-50"
              />
            </div>
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
              <input
                value={fSkills}
                onChange={(e) => setFSkills(e.target.value)}
                placeholder="Skills (e.g. React)..."
                className="pl-8 pr-3 py-2 border border-slate-200 rounded-xl text-sm w-full focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-slate-50"
              />
            </div>
            <select
              value={fStatus}
              onChange={(e) => setFStatus(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-400"
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

      {/* ── Status quick-filter pills ─────────────────────────────────── */}
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

      {/* ── Table ───────────────────────────────────────────────────────── */}
      {!loading && !error && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
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
                      colSpan={9}
                      className="text-center py-16 text-slate-400"
                    >
                      <FiUser className="mx-auto text-3xl mb-2 text-slate-300" />
                      No candidates found.
                    </td>
                  </tr>
                )}
                {users.map((u, i) => (
                  <tr
                    key={u.user_id}
                    onClick={() => setSelected(u)}
                    className="border-b border-slate-100 hover:bg-indigo-50 transition-colors cursor-pointer group"
                  >
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
                          <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm shrink-0">
                            {u.username?.[0]?.toUpperCase()}
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-800 truncate group-hover:text-indigo-700 transition-colors max-w-[130px]">
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
                      {u.total_exp || <span className="text-slate-300">—</span>}
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
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
