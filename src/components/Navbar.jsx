import { NavbarData } from "../data/Navbar";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 bg-[#020617]/90 backdrop-blur-xl border-b border-slate-800">
      <div className="max-w-7xl mx-auto flex justify-center items-center gap-12 py-4">
        {NavbarData.map((link, idx) => (
          <NavLink
            key={idx}
            to={link.path}
            className={({ isActive }) =>
              isActive
                ? "px-5 py-2 rounded-xl bg-slate-800 text-white border border-slate-700 shadow-lg"
                : "px-5 py-2 rounded-xl text-slate-400 hover:text-white transition-all duration-300"
            }
          >
            {link.title}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;