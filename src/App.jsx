import { useState } from "react";
import { FiUserPlus, FiZap, FiUsers, FiMenu, FiX, FiCpu,FiCalendar  } from "react-icons/fi";
import CreateUser from "./component/CreateUser";
import JDMatch from "./component/Jdmatch";
import AllUsers from "./component/Allusers";

import cannyfore from "./assets/canny.png";
// import InterviewScheduler from "./component/Interviewscheduler";

const NAV = [
  {
    id: "create",
    label: "Create User",
    desc: "Register a new candidate",
    icon: <FiUserPlus />,
    component: <CreateUser />,
  },
  {
    id: "match",
    label: "JD Match AI",
    desc: "Find best-fit candidates",
    icon: <FiZap />,
    component: <JDMatch />,
  },
  {
    id: "users",
    label: "All Candidates",
    desc: "View all registered users",
    icon: <FiUsers />,
    component: <AllUsers />,
  },
//   {
//   id: "interviews",
//   label: "Interview Scheduler",
//   desc: "Schedule and manage interviews",
//   icon: <FiCalendar />,
//   component: <InterviewScheduler />,
// },
];

export default function App() {
  const [active, setActive] = useState("create");
  const [open, setOpen] = useState(false);

  const current = NAV.find((n) => n.id === active);

  const handleNav = (id) => {
    setActive(id);
    setOpen(false);
  };

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`
        fixed top-0 left-0 h-full z-30 w-64 bg-white border-r border-slate-200
        flex flex-col transition-transform duration-300 ease-in-out
        lg:static lg:translate-x-0
        ${open ? "translate-x-0 shadow-2xl" : "-translate-x-full"}
      `}
      >
        <div className="px-5 py-5 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-center gap-2.5">
              <img src={cannyfore} className="text-slate-400" />

              <div className="flex items-center">
                <p className="font-black text-slate-800 text-sm mr-2 leading-tight">
                  ResumeAI
                </p>
                <p className="text-xs text-slate-400 leading-tight">
                  Analyser v2.0
                </p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="lg:hidden text-slate-400 hover:text-slate-600 p-1"
            >
              <FiX className="text-xl" />
            </button>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest px-3 mb-3">
            Navigation
          </p>
          {NAV.map(({ id, label, desc, icon }) => {
            const isActive = active === id;
            return (
              <button
                key={id}
                onClick={() => handleNav(id)}
                className={`
                  w-full flex items-center gap-3 px-3 py-3 rounded-xl
                  text-left transition-all duration-150 group
                  ${
                    isActive
                      ? "bg-blue-500 text-white shadow-md shadow-blue-200"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }
                `}
              >
                <span
                  className={`text-xl shrink-0 transition-colors
                  ${isActive ? "text-white" : "text-slate-400 group-hover:text-blue-500"}`}
                >
                  {icon}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold leading-tight truncate">
                    {label}
                  </p>
                  <p
                    className={`text-xs leading-tight truncate
                    ${isActive ? "text-blue-200" : "text-slate-400"}`}
                  >
                    {desc}
                  </p>
                </div>
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white shrink-0" />
                )}
              </button>
            );
          })}
        </nav>

        <div className="px-5 py-4 border-t border-slate-100">
          <p className="text-xs text-slate-400 leading-relaxed">
            Developed by{" "}
            <span className="font-semibold text-slate-500">SAKTHI</span>{" "}
            <span className="font-semibold text-slate-500">MURUGESAN</span>
          </p>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header
          className="bg-white border-b border-slate-200 px-4 sm:px-6 py-4
                           flex items-center gap-3 shrink-0 shadow-sm"
        >
          <button
            onClick={() => setOpen(true)}
            className="lg:hidden text-slate-500 hover:text-slate-800 p-1"
          >
            <FiMenu className="text-2xl" />
          </button>

          <div className="flex items-center gap-2.5">
            <span className="text-blue-500 text-xl">{current?.icon}</span>
            <div>
              <h1 className="font-bold text-slate-800 leading-tight">
                {current?.label}
              </h1>
              <p className="text-xs text-slate-400 leading-tight hidden sm:block">
                {current?.desc}
              </p>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-1.5">
            {NAV.map((n) => (
              <button
                key={n.id}
                onClick={() => handleNav(n.id)}
                title={n.label}
                className={`rounded-full transition-all duration-200
                  ${
                    active === n.id
                      ? "w-5 h-2.5 bg-blue-300"
                      : "w-2.5 h-2.5 bg-slate-300 hover:bg-slate-400"
                  }`}
              />
            ))}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {current?.component}
        </main>
      </div>
    </div>
  );
}
