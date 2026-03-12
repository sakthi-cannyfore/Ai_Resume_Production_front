import {
  FiArrowLeft,
  FiUser,
  FiMail,
  FiPhone,
  FiBriefcase,
  FiCalendar,
  FiFileText,
  FiDownload,
  FiExternalLink,
  FiImage,
  FiHash,
  FiClock,
  FiFolder,
} from "react-icons/fi";

export default function UserDetail({ user, onBack }) {
  if (!user) return null;

  const latest = user.raw_resumes?.[1] ?? null;

  const joinedDate = new Date(user.created_at).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const InfoRow = ({ icon, label, value }) => (
    <div className="flex items-start gap-3 py-3 border-b border-slate-100 last:border-0">
      <span className="text-indigo-400 text-base mt-0.5 shrink-0">{icon}</span>
      <div className="min-w-0">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-0.5">
          {label}
        </p>
        <p className="text-sm font-medium text-slate-700 break-all">
          {value || <span className="text-slate-300 font-normal">—</span>}
        </p>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600
                   font-medium mb-6 group transition-colors"
      >
        <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
        Back to Candidates
      </button>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-5">
        <div className="h-28 relative">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "radial-gradient(circle, white 1.5px, transparent 1.5px)",
              backgroundSize: "24px 24px",
            }}
          />
        </div>

        <div className="px-6 pb-4">
          <div className="flex sm:flex-row sm:items-end gap-3 -mt-18 mb-5">
            {user.image_url ? (
              <img
                src={user.image_url}
                alt={user.username}
                className="w-50 h-60 rounded-2xl object-cover border-4 border-white shadow-md shrink-0"
              />
            ) : (
              <div
                className="w-24 h-24 rounded-2xl bg-indigo-100 text-indigo-600
                              flex items-center justify-center text-4xl font-black
                              border-4 border-white shadow-xl shrink-0"
              >
                {user.username?.[0]?.toUpperCase()}
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between w-full gap-3 sm:pb-1">
              <div className="text-start">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight tracking-tight">
                  {user.username}
                </h1>
                <p className="text-sm text-slate-500 ">{user.email}</p>
              </div>
              <span
                className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700
                               text-sm font-semibold px-4 py-2 rounded-xl border border-indigo-100 self-start sm:self-auto shrink-0"
              >
                {user.role}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              { icon: <FiHash />, label: `ID: ${user.user_id}` },
              { icon: <FiCalendar />, label: `Joined ${joinedDate}` },
              { icon: <FiPhone />, label: user.phone || "No phone" },
              {
                icon: <FiFolder />,
                label: `${user.raw_resumes?.length ?? 0} resume${user.raw_resumes?.length !== 1 ? "s" : ""}`,
              },
            ].map(({ icon, label }) => (
              <span
                key={label}
                className="inline-flex items-center gap-1.5 text-xs text-slate-500
                               bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-full font-medium"
              >
                <span className="text-slate-400">{icon}</span>
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">
            Contact Info
          </h3>
          <InfoRow icon={<FiUser />} label="Full Name" value={user.username} />
          <InfoRow icon={<FiMail />} label="Email" value={user.email} />
          <InfoRow icon={<FiPhone />} label="Phone" value={user.phone} />
          <InfoRow icon={<FiBriefcase />} label="Role" value={user.role} />
          <InfoRow icon={<FiCalendar />} label="Joined" value={joinedDate} />
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">
            Media & Files
          </h3>

          <div className="py-3 border-b border-slate-100">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2 flex items-center gap-1.5">
              <FiImage className="text-indigo-400" /> Profile Photo
            </p>
            {user.image_url ? (
              <a
                href={user.image_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-indigo-600 hover:underline font-medium"
              >
                <FiExternalLink /> View on Cloudinary
              </a>
            ) : (
              <span className="text-xs text-slate-300">No photo uploaded</span>
            )}
          </div>

          <div className="py-3">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2 flex items-center gap-1.5">
              <FiDownload className="text-indigo-400" /> Resume (Supabase)
            </p>
            {latest ? (
              <a
                href={latest.resume_file_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-indigo-600 hover:underline font-medium truncate max-w-full"
              >
                <FiExternalLink className="shrink-0" />
                <span className="truncate">{latest.file_name}</span>
              </a>
            ) : (
              <span className="text-xs text-slate-300">No resume uploaded</span>
            )}
          </div>
        </div>
      </div>

      {user.raw_resumes?.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">
              All Uploaded Resumes ({user.raw_resumes.length})
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {["#", "File Name", "Type", "Uploaded", "Action"].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {user.raw_resumes.map((r, i) => (
                  <tr
                    key={r.raw_resume_id}
                    className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-5 py-3 text-xs text-slate-400 font-mono">
                      {i + 1}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <FiFileText className="text-indigo-400 shrink-0" />
                        <span className="text-sm font-medium text-slate-700 truncate max-w-[180px] sm:max-w-[280px]">
                          {r.file_name}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-semibold
                        ${
                          r.file_type?.includes("pdf")
                            ? "bg-red-50 text-red-500 border border-red-100"
                            : "bg-blue-50 text-blue-500 border border-blue-100"
                        }`}
                      >
                        {r.file_type?.includes("pdf") ? "PDF" : "DOCX"}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-xs text-slate-400 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <FiClock className="text-slate-300" />
                        {new Date(r.uploaded_at).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <a
                        href={r.resume_file_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs bg-indigo-600
                                    hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg
                                    font-medium transition-colors whitespace-nowrap"
                      >
                        <FiExternalLink /> Open
                      </a>
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
