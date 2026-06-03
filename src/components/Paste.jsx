import { Calendar, Copy, Eye, PencilLine, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { removeFromPastes } from "../redux/pasteSlice";
import { FormatDate } from "../utlis/formatDate";

const Paste = () => {
  const pastes = useSelector((state) => state.paste.pastes);
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");

  const handleDelete = (id) => {
    dispatch(removeFromPastes(id));
    toast.success("Paste Deleted");
  };

  const filteredPastes = pastes.filter((paste) =>
    paste.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full max-w-[1600px] mx-auto px-8 py-10">

      {/* Search */}
      <div className="w-full bg-slate-900/70 border border-slate-700 rounded-2xl px-5 py-4 shadow-xl backdrop-blur-xl mb-6">
        <input
          type="search"
          placeholder="Search your pastes..."
          className="w-full bg-transparent text-white text-lg placeholder:text-slate-500 focus:outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Main Container */}
      <div className="flex flex-col bg-[#0f172a] border border-slate-700 rounded-3xl p-6 shadow-2xl">

        <h2 className="px-4 text-3xl font-bold text-white border-b border-slate-700 pb-4">
          All Pastes
        </h2>

        <div className="w-full px-2 pt-6 flex flex-col gap-5">

          {filteredPastes.length > 0 ? (
            filteredPastes.map((paste) => (
              <div
                key={paste._id}
                className="bg-slate-900 border border-slate-700 hover:border-blue-500 hover:shadow-blue-500/10 hover:shadow-xl transition-all duration-300 p-6 rounded-2xl flex flex-col lg:flex-row justify-between gap-8"
              >

                {/* Left Section */}
                <div className="flex-1 flex flex-col gap-3">

                  <h3 className="text-3xl font-bold text-white">
                    {paste.title}
                  </h3>

                  <p className="text-slate-400 text-base leading-7">
                    {paste.content}
                  </p>

                </div>

                {/* Right Section */}
                <div className="flex flex-col gap-5 lg:items-end">

                  <div className="flex gap-3 flex-wrap">

                    {/* Edit */}
                    <a
                      href={`/?pasteId=${paste._id}`}
                      className="p-3 rounded-xl bg-slate-800 border border-slate-700 hover:border-blue-500 transition-all duration-300"
                    >
                      <PencilLine className="text-slate-300" size={20} />
                    </a>

                    {/* Delete */}
                    <button
                      onClick={() => handleDelete(paste._id)}
                      className="p-3 rounded-xl bg-slate-800 border border-slate-700 hover:border-red-500 transition-all duration-300"
                    >
                      <Trash2 className="text-slate-300" size={20} />
                    </button>

                    {/* View */}
                    <a
                      href={`/pastes/${paste._id}`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-3 rounded-xl bg-slate-800 border border-slate-700 hover:border-orange-500 transition-all duration-300"
                    >
                      <Eye className="text-slate-300" size={20} />
                    </a>

                    {/* Copy */}
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(paste.content);
                        toast.success("Copied to Clipboard");
                      }}
                      className="p-3 rounded-xl bg-slate-800 border border-slate-700 hover:border-green-500 transition-all duration-300"
                    >
                      <Copy className="text-slate-300" size={20} />
                    </button>

                  </div>

                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <Calendar size={18} />
                    <span>{FormatDate(paste.createdAt)}</span>
                  </div>

                </div>

              </div>
            ))
          ) : (
            <div className="h-[400px] flex flex-col justify-center items-center text-center">

              <div className="text-7xl mb-4">📋</div>

              <h3 className="text-2xl font-bold text-white">
                No Pastes Found
              </h3>

              <p className="text-slate-400 mt-2">
                Create your first paste to get started.
              </p>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Paste;

