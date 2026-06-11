import { NavbarData } from "../data/Navbar";
import { NavLink, Link } from "react-router-dom";
import { Terminal } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 bg-[#020617]/80 backdrop-blur-xl border-b border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* LOGO */}
        <Link 
          to="/" 
          className="flex items-center gap-2.5 group hover:opacity-90 transition-opacity"
        >
          <div className="p-2 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300">
            <Terminal size={18} />
          </div>
          <span className="font-extrabold text-xl bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent tracking-tight">
            PasteFlow
          </span>
        </Link>

        {/* NAVIGATION LINKS */}
        <div className="flex items-center gap-3">
          {NavbarData.map((link, idx) => (
            <NavLink
              key={idx}
              to={link.path}
              className={({ isActive }) =>
                `px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-300 ${
                  isActive
                    ? "bg-slate-800/80 text-white border-slate-700 shadow-md shadow-black/20"
                    : "text-slate-400 hover:text-white border-transparent hover:bg-slate-900"
                }`
              }
            >
              {link.title}
            </NavLink>
          ))}

          {/* EXTERNAL GITHUB LINK */}
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="p-2 ml-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-all duration-300"
            title="GitHub Repository"
          >
            <svg 
              viewBox="0 0 24 24" 
              width="18" 
              height="18" 
              stroke="currentColor" 
              strokeWidth="2" 
              fill="none" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
            </svg>
          </a>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;