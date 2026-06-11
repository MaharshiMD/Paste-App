import { Calendar, Copy, Eye, PencilLine, Trash2, Share2, Download, Search } from "lucide-react";
import toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { Link } from "react-router-dom";
import { removeFromPastes } from "../redux/pasteSlice";
import { FormatDate } from "../utils/formatDate";

const Paste = () => {
  const pastes = useSelector((state) => state.paste.pastes);
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");

  const handleDelete = (id) => {
    dispatch(removeFromPastes(id));
  };

  const handleShare = (id) => {
    const shareUrl = `${window.location.origin}/pastes/${id}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success("Link copied to clipboard!");
  };

  const handleDownload = (pasteTitle, content) => {
    const element = document.createElement("a");
    const file = new Blob([content], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${pasteTitle || "paste"}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success("Download started!");
  };

  // Robust search covering title, content, language, and tags
  const filteredPastes = pastes.filter((paste) => {
    const term = searchTerm.toLowerCase();
    const matchesTitle = (paste.title || "").toLowerCase().includes(term);
    const matchesContent = (paste.content || "").toLowerCase().includes(term);
    const matchesLang = (paste.language || "").toLowerCase().includes(term);
    const matchesTags = paste.tags
      ? paste.tags.some((tag) => tag.toLowerCase().includes(term))
      : false;
    return matchesTitle || matchesContent || matchesLang || matchesTags;
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-10 flex flex-col gap-6">
      
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Saved Snippets</h1>
          <p className="text-slate-400 mt-1 text-sm">
            Manage, search, share, and inspect your saved content and code pastes.
          </p>
        </div>
        
        {/* Count Badge */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs font-semibold text-slate-300">
          Showing <span className="text-blue-400 font-bold">{filteredPastes.length}</span> of {pastes.length} pastes
        </div>
      </div>

      {/* Advanced Search Input */}
      <div className="relative bg-[#0f172a]/70 border border-slate-800 rounded-2xl p-1 shadow-lg backdrop-blur-md">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
        <input
          type="search"
          placeholder="Search by title, content, language, or tag..."
          className="w-full bg-transparent text-white text-base py-3.5 pl-12 pr-6 outline-none focus:ring-0 placeholder:text-slate-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Grid of Paste Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
        {filteredPastes.length > 0 ? (
          filteredPastes.map((paste) => (
            <div
              key={paste._id}
              className="group bg-[#0f172a]/55 border border-slate-800/80 hover:border-blue-500/60 hover:shadow-2xl hover:shadow-blue-500/[0.03] transition-all duration-300 rounded-2xl p-6 flex flex-col justify-between gap-6 backdrop-blur-sm"
            >
              
              {/* Card Header & Content */}
              <div className="flex flex-col gap-4">
                
                {/* Meta details */}
                <div className="flex items-center justify-between gap-4">
                  <span className="bg-slate-800/80 text-slate-300 border border-slate-700/80 px-2.5 py-0.5 rounded-md text-xs font-mono uppercase tracking-wider">
                    {paste.language || "text"}
                  </span>
                  
                  <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                    <Calendar size={14} />
                    <span>{FormatDate(paste.createdAt)}</span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1">
                  {paste.title}
                </h3>

                {/* Content Snippet (Truncated to maintain layout harmony) */}
                <p className="text-slate-400 text-sm leading-relaxed font-mono bg-slate-950/35 p-4 rounded-xl border border-slate-800/50 min-h-[100px] max-h-[140px] overflow-hidden line-clamp-4">
                  {paste.content}
                </p>

                {/* Tags Badges */}
                {paste.tags && paste.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {paste.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2.5 py-0.5 rounded-full text-xs font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

              </div>

              {/* Action Toolbar */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800/70">
                
                {/* Primary SPA routes */}
                <div className="flex items-center gap-2">
                  <Link
                    to={`/?pasteId=${paste._id}`}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-slate-800/80 hover:bg-blue-600 border border-slate-700 hover:border-blue-500 text-slate-300 hover:text-white transition-all duration-200"
                    title="Edit Paste"
                  >
                    <PencilLine size={14} />
                    <span>Edit</span>
                  </Link>

                  <Link
                    to={`/pastes/${paste._id}`}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-slate-800/80 hover:bg-indigo-600 border border-slate-700 hover:border-indigo-500 text-slate-300 hover:text-white transition-all duration-200"
                    title="View Full Paste"
                  >
                    <Eye size={14} />
                    <span>View</span>
                  </Link>
                </div>

                {/* Utility actions */}
                <div className="flex items-center gap-2">
                  
                  {/* Share */}
                  <button
                    onClick={() => handleShare(paste._id)}
                    className="p-2 rounded-lg bg-slate-800/40 hover:bg-slate-800 border border-slate-800/80 hover:border-slate-600 text-slate-400 hover:text-white transition-all"
                    title="Copy Share Link"
                  >
                    <Share2 size={14} />
                  </button>

                  {/* Download */}
                  <button
                    onClick={() => handleDownload(paste.title, paste.content)}
                    className="p-2 rounded-lg bg-slate-800/40 hover:bg-slate-800 border border-slate-800/80 hover:border-slate-600 text-slate-400 hover:text-white transition-all"
                    title="Download Paste"
                  >
                    <Download size={14} />
                  </button>

                  {/* Copy content */}
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(paste.content);
                      toast.success("Copied to Clipboard");
                    }}
                    className="p-2 rounded-lg bg-slate-800/40 hover:bg-slate-800 border border-slate-800/80 hover:border-slate-600 text-slate-400 hover:text-white transition-all"
                    title="Copy Content"
                  >
                    <Copy size={14} />
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(paste._id)}
                    className="p-2 rounded-lg bg-slate-800/40 hover:bg-red-950 border border-slate-800/80 hover:border-red-900 text-slate-400 hover:text-red-400 transition-all"
                    title="Delete Paste"
                  >
                    <Trash2 size={14} />
                  </button>

                </div>

              </div>

            </div>
          ))
        ) : (
          <div className="col-span-full py-24 flex flex-col justify-center items-center text-center bg-[#0f172a]/40 border border-slate-800 rounded-3xl p-8 shadow-inner">
            <span className="text-6xl mb-4">📂</span>
            <h3 className="text-xl font-bold text-white">No Snippets Found</h3>
            <p className="text-slate-400 mt-2 text-sm max-w-xs">
              {pastes.length === 0
                ? "Start creating your pastes on the home page."
                : "Try adjusting your search criteria."}
            </p>
            {pastes.length === 0 && (
              <Link
                to="/"
                className="mt-6 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-500/10 transition-all"
              >
                Create First Paste
              </Link>
            )}
          </div>
        )}
      </div>

    </div>
  );
};

export default Paste;

