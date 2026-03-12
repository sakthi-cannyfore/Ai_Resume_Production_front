import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://127.0.0.1:8000/users";

function RoleBadge({ role }) {
  const colors = {
    "React developer": "bg-cyan-100 text-cyan-800",
    "Python developer": "bg-yellow-100 text-yellow-800",
    "Full Stack": "bg-purple-100 text-purple-800",
  };
  const cls = colors[role] || "bg-slate-100 text-slate-700";
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${cls}`}>
      {role}
    </span>
  );
}

function ResumeLink({ url, name }) {
  if (!url) return <span className="text-slate-400 text-xs">—</span>;
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 hover:underline font-medium truncate max-w-[180px]"
      title={name}
    >
      {name || "View Resume"}
    </a>
  );
}

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios
      .get(API_URL)
      .then((res) => {
        setUsers(res.data.users || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const filtered = users.filter(
    (u) =>
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading)
    return (
      <div className="flex items-center justify-center h-64 text-slate-500 text-sm">
        Loading users...
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center h-64 text-red-500 text-sm">
        {error}
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Candidates</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {users.length} total users registered
          </p>
        </div>
        <input
          type="text"
          placeholder="Search by name, email, role..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-slate-200 rounded-lg px-4 py-2 text-sm w-full sm:w-72 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-left">
                <th className="px-4 py-3 font-semibold text-slate-600">#</th>
                <th className="px-4 py-3 font-semibold text-slate-600">User</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Role</th>
                <th className="px-4 py-3 font-semibold text-slate-600">
                  Phone
                </th>
                <th className="px-4 py-3 font-semibold text-slate-600">
                  Resume (Supabase)
                </th>
                <th className="px-4 py-3 font-semibold text-slate-600">
                  Joined
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400">
                    No users found.
                  </td>
                </tr>
              )}
              {filtered.map((user, idx) => (
                <tr
                  key={user.user_id}
                  className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                >
                  <td className="px-4 py-3 text-slate-400">{idx + 1}</td>

                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {user.image_url ? (
                        <img
                          src={user.image_url}
                          alt={user.username}
                          className="w-9 h-9  object-cover border border-slate-200"
                        />
                      ) : (
                        <div className="w-9 h-9  bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                          {user.username[0].toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-slate-800">
                          {user.username}
                        </p>
                        <p className="text-xs text-slate-400">{user.email}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    <RoleBadge role={user.role} />
                  </td>

                  <td className="px-4 py-3 text-slate-600">
                    {user.phone || <span className="text-slate-300">—</span>}
                  </td>

                  <td className="px-4 py-3">
                    {user.raw_resumes?.length > 0 ? (
                      <div className="flex flex-col gap-1">
                        {user.raw_resumes.map((r) => (
                          <ResumeLink
                            key={r.raw_resume_id}
                            url={r.resume_file_url}
                            name={r.file_name}
                          />
                        ))}
                      </div>
                    ) : (
                      <span className="text-slate-300 text-xs">No resume</span>
                    )}
                  </td>

                  <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">
                    {new Date(user.created_at).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
