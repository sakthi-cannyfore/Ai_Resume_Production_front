import { useState, useEffect } from "react";
import axios from "axios";
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
  FiMapPin,
  FiDollarSign,
  FiAward,
  FiLayers,
  FiAlertCircle,
  FiCheckCircle,
  FiXCircle,
  FiRefreshCw,
} from "react-icons/fi";

const API = "http://127.0.0.1:8000";

const STATUS_COLORS = {
  Screening: "bg-blue-50 text-blue-700 border-blue-200",
  "L1 Interview": "bg-indigo-50 text-indigo-700 border-indigo-200",
  "L2 Interview": "bg-violet-50 text-violet-700 border-violet-200",
  "HR Interview": "bg-purple-50 text-purple-700 border-purple-200",
  "Offer Released": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Pre-Onboarding": "bg-teal-50 text-teal-700 border-teal-200",
  Onboarded: "bg-green-50 text-green-700 border-green-200",
  Rejected: "bg-red-50 text-red-700 border-red-200",
  "Awaiting Feedback": "bg-amber-50 text-amber-700 border-amber-200",
  "On Hold": "bg-orange-50 text-orange-700 border-orange-200",
  "Offer Rejected": "bg-rose-50 text-rose-700 border-rose-200",
};

const INTERVIEW_STATUS_COLORS = {
  Scheduled: "bg-blue-50 text-blue-700",
  Completed: "bg-green-50 text-green-700",
  Cancelled: "bg-red-50 text-red-700",
  Rescheduled: "bg-orange-50 text-orange-700",
  "No Show": "bg-gray-100 text-gray-500",
};

function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-slate-100 last:border-0">
      <span className="text-indigo-400 text-base mt-0.5 shrink-0">{icon}</span>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-0.5">
          {label}
        </p>
        <p className="text-sm font-medium text-slate-700 break-words">
          {value || <span className="text-slate-300 font-normal">—</span>}
        </p>
      </div>
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">
      {children}
    </h3>
  );
}

function Card({ children, className = "" }) {
  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200 shadow-sm p-5 ${className}`}
    >
      {children}
    </div>
  );
}

export default function UserDetail({ user, onBack }) {
  const [interviews, setInterviews] = useState([]);
  const [iLoading, setILoading] = useState(true);

  useEffect(() => {
    if (!user?.user_id) return;
    setILoading(true);
    axios
      .get(`${API}/interviews/user/${user.user_id}`)
      .then((r) => setInterviews(r.data.interviews || []))
      .catch(() => setInterviews([]))
      .finally(() => setILoading(false));
  }, [user?.user_id]);

  if (!user) return null;

  const latest = user.raw_resumes?.[0] ?? null;
  const joinedDate = new Date(user.created_at).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const skillList = user.skills
    ? user.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  return (
    <div className="max-w-5xl mx-auto px-2 sm:px-0">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600
                   font-medium mb-6 group transition-colors"
      >
        <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
        Back to Candidates
      </button>

      <div className="rounded-2xl border bg-white border-slate-200 shadow-sm overflow-hidden mb-5">
        <div className="h-20  relative">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "radial-gradient(circle, white 1.5px, transparent 1.5px)",
              backgroundSize: "24px 24px",
            }}
          />
        </div>

        <div className="px-4 sm:px-6 pb-5">
          <div className="flex flex-col items-center sm:flex-row sm:items-end gap-4 -mt-10 sm:-mt-12 mb-5">
            {user.image_url ? (
              <img
                src={user.image_url}
                alt={user.username}
                // className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-4 border-white shadow-xl shrink-0"
                className="w-55 h-70 rounded-2xl object-cover  shadow-md shrink-0"
              />
            ) : (
              <div
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-indigo-100 text-indigo-600
                              flex items-center justify-center text-3xl sm:text-4xl font-black
                              border-4 border-white shadow-xl shrink-0"
              >
                {user.username?.[0]?.toUpperCase()}
              </div>
            )}

            <div className="flex flex-col items-center sm:flex-row sm:items-end sm:justify-between w-full gap-3 sm:pb-1">
              <div className="text-center sm:text-left">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 leading-tight">
                  {user.username}
                </h1>
                <p className="text-xs sm:text-sm text-slate-500">
                  {user.email}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-end">
                <span
                  className="inline-flex items-center bg-indigo-50 text-indigo-700
                                 text-xs font-semibold px-3 py-1.5 rounded-xl border border-indigo-100"
                >
                  {user.role}
                </span>
                {user.status && (
                  <span
                    className={`inline-flex items-center text-xs font-semibold px-3 py-1.5 rounded-xl border
                    ${STATUS_COLORS[user.status] || "bg-gray-50 text-gray-600 border-gray-200"}`}
                  >
                    {user.status}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-center sm:justify-start gap-2">
            {[
              { icon: <FiHash />, label: `ID: ${user.user_id}` },
              { icon: <FiCalendar />, label: `Joined ${joinedDate}` },
              { icon: <FiPhone />, label: user.phone || "No phone" },
              {
                icon: <FiFolder />,
                label: `${user.raw_resumes?.length ?? 0} resume${user.raw_resumes?.length !== 1 ? "s" : ""}`,
              },
              user.total_exp && {
                icon: <FiClock />,
                label: `Exp: ${user.total_exp}`,
              },
              user.current_location && {
                icon: <FiMapPin />,
                label: user.current_location,
              },
              user.company && { icon: <FiBriefcase />, label: user.company },
            ]
              .filter(Boolean)
              .map(({ icon, label }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-1.5 text-xs text-slate-500
                           bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-full font-medium"
                >
                  <span className="text-slate-400" style={{ fontSize: 12 }}>
                    {icon}
                  </span>
                  {label}
                </span>
              ))}
          </div>
        </div>
      </div>

      {skillList.length > 0 && (
        <Card className="mb-5">
          <SectionTitle>Skills</SectionTitle>
          <div className="flex flex-wrap gap-2">
            {skillList.map((s) => (
              <span
                key={s}
                className="text-xs px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-100
                           rounded-full font-medium"
              >
                {s}
              </span>
            ))}
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
        <Card>
          <SectionTitle>Contact Info</SectionTitle>
          <InfoRow icon={<FiUser />} label="Full Name" value={user.username} />
          <InfoRow icon={<FiMail />} label="Email" value={user.email} />
          <InfoRow icon={<FiPhone />} label="Phone" value={user.phone} />
          <InfoRow icon={<FiBriefcase />} label="Role" value={user.role} />
          <InfoRow
            icon={<FiMapPin />}
            label="Current Location"
            value={user.current_location}
          />
          <InfoRow
            icon={<FiMapPin />}
            label="Preferred Location"
            value={user.preferred_location}
          />
          <InfoRow icon={<FiCalendar />} label="Joined" value={joinedDate} />
          {user.date_profile_taken && (
            <InfoRow
              icon={<FiCalendar />}
              label="Profile Taken"
              value={user.date_profile_taken}
            />
          )}
        </Card>

        <Card>
          <SectionTitle>Experience & Compensation</SectionTitle>
          <InfoRow
            icon={<FiBriefcase />}
            label="Company"
            value={user.company}
          />
          <InfoRow
            icon={<FiClock />}
            label="Total Exp"
            value={user.total_exp}
          />
          <InfoRow
            icon={<FiClock />}
            label="Relevant Exp"
            value={user.rel_exp}
          />
          <InfoRow
            icon={<FiDollarSign />}
            label="Current CTC"
            value={user.ctc}
          />
          <InfoRow
            icon={<FiDollarSign />}
            label="Expected CTC"
            value={user.ectc}
          />
          <InfoRow
            icon={<FiClock />}
            label="Notice Period"
            value={user.notice_period}
          />
          <InfoRow icon={<FiAward />} label="Status" value={user.status} />
        </Card>

        <Card>
          <SectionTitle>Media & Files</SectionTitle>
          <div className="py-2.5 border-b border-slate-100">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2 flex items-center gap-1.5">
              <FiImage className="text-indigo-400" style={{ fontSize: 12 }} />{" "}
              Profile Photo
            </p>
            {user.image_url ? (
              <a
                href={user.image_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-indigo-600 hover:underline font-medium"
              >
                <FiExternalLink style={{ fontSize: 12 }} /> View on Cloudinary
              </a>
            ) : (
              <span className="text-xs text-slate-300">No photo uploaded</span>
            )}
          </div>
          <div className="py-2.5">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2 flex items-center gap-1.5">
              <FiDownload
                className="text-indigo-400"
                style={{ fontSize: 12 }}
              />{" "}
              Resume (Supabase)
            </p>
            {latest ? (
              <a
                href={latest.resume_file_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-indigo-600 hover:underline font-medium truncate max-w-full"
              >
                <FiExternalLink className="shrink-0" style={{ fontSize: 12 }} />
                <span className="truncate">{latest.file_name}</span>
              </a>
            ) : (
              <span className="text-xs text-slate-300">No resume uploaded</span>
            )}
          </div>
        </Card>

        <Card>
          <SectionTitle>Interview Summary</SectionTitle>
          {iLoading ? (
            <div className="flex items-center gap-2 text-slate-400 text-sm py-4">
              <FiRefreshCw className="animate-spin" style={{ fontSize: 14 }} />{" "}
              Loading...
            </div>
          ) : interviews.length === 0 ? (
            <p className="text-sm text-slate-300 py-4">
              No interviews scheduled yet.
            </p>
          ) : (
            <div className="space-y-3">
              {interviews.map((iv) => (
                <div
                  key={iv.id}
                  className="flex items-start justify-between gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-xs font-semibold text-slate-700">
                        {iv.round}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium
                        ${INTERVIEW_STATUS_COLORS[iv.status] || "bg-gray-50 text-gray-500"}`}
                      >
                        {iv.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 flex items-center gap-1">
                      <FiCalendar style={{ fontSize: 11 }} />
                      {new Date(iv.scheduled_at).toLocaleString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      <span className="mx-1">·</span>
                      <FiClock style={{ fontSize: 11 }} /> {iv.duration_minutes}{" "}
                      min
                    </p>
                    {iv.interviewer_name && (
                      <p className="text-xs text-slate-400 mt-0.5">
                        Interviewer: {iv.interviewer_name}
                      </p>
                    )}
                  </div>
                  {iv.meeting_link && (
                    <a
                      href={iv.meeting_link}
                      target="_blank"
                      rel="noreferrer"
                      className="shrink-0 inline-flex items-center gap-1 text-xs bg-indigo-600
                                 hover:bg-indigo-700 text-white px-2.5 py-1.5 rounded-lg font-medium transition"
                    >
                      <FiExternalLink style={{ fontSize: 11 }} /> Join
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {user.raw_resumes?.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-5">
          <div className="px-5 py-4 border-b border-slate-100">
            <SectionTitle>
              All Uploaded Resumes ({user.raw_resumes.length})
            </SectionTitle>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {["#", "File Name", "Type", "Uploaded", "Action"].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide whitespace-nowrap"
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
                        <FiFileText
                          className="text-indigo-400 shrink-0"
                          style={{ fontSize: 14 }}
                        />
                        <span className="text-sm font-medium text-slate-700 truncate max-w-[160px] sm:max-w-[260px]">
                          {r.file_name}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-semibold border
                        ${
                          r.file_type?.includes("pdf")
                            ? "bg-red-50 text-red-500 border-red-100"
                            : "bg-blue-50 text-blue-500 border-blue-100"
                        }`}
                      >
                        {r.file_type?.includes("pdf") ? "PDF" : "DOCX"}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-xs text-slate-400 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <FiClock
                          className="text-slate-300"
                          style={{ fontSize: 12 }}
                        />
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
                                   font-medium transition whitespace-nowrap"
                      >
                        <FiExternalLink style={{ fontSize: 11 }} /> Open
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {interviews.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <SectionTitle>Interview History ({interviews.length})</SectionTitle>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {[
                    "Round",
                    "Date & Time",
                    "Duration",
                    "Interviewer",
                    "Status",
                    "Link",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {interviews.map((iv) => (
                  <tr
                    key={iv.id}
                    className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-5 py-3">
                      <span className="text-xs font-semibold text-slate-700">
                        {iv.round}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-xs text-slate-500 whitespace-nowrap">
                      {new Date(iv.scheduled_at).toLocaleString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-5 py-3 text-xs text-slate-500 whitespace-nowrap">
                      {iv.duration_minutes} min
                    </td>
                    <td className="px-5 py-3 text-xs text-slate-500">
                      {iv.interviewer_name || (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium
                        ${INTERVIEW_STATUS_COLORS[iv.status] || "bg-gray-50 text-gray-500"}`}
                      >
                        {iv.status}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      {iv.meeting_link ? (
                        <a
                          href={iv.meeting_link}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-indigo-600
                                     hover:text-indigo-800 font-medium transition"
                        >
                          <FiExternalLink style={{ fontSize: 11 }} /> Open
                        </a>
                      ) : (
                        <span className="text-slate-300 text-xs">—</span>
                      )}
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
