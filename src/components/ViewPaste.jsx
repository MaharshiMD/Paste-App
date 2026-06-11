import { Copy, Calendar, Clock, Download, PencilLine, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { FormatDate } from "../utils/formatDate";

const ViewPaste = () => {
  const { id } = useParams();
  const pastes = useSelector((state) => state.paste.pastes);
  const paste = pastes.find((p) => p._id === id);

  if (!paste) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
        <span className="text-6xl mb-4">🔍</span>
        <h1 className="text-3xl font-extrabold text-white">Paste Not Found</h1>
        <p className="text-slate-400 mt-2 max-w-sm">
          The paste snippet you are looking for does not exist or may have been deleted.
        </p>
        <Link
          to="/pastes"
          className="mt-6 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold border border-slate-700 shadow-lg transition-all"
        >
          Back to Snippets
        </Link>
      </div>
    );
  }

  // Statistics
  const content = paste.content || "";
  const charCount = content.length;
  const wordCount = content.trim() === "" ? 0 : content.trim().split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200);

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([content], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${paste.title || "paste"}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success("Download started!");
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-10 flex flex-col gap-6">
      
      {/* Navigation & Actions Topbar */}
      <div className="flex items-center justify-between gap-4">
        <Link
          to="/pastes"
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-semibold">Back to All Pastes</span>
        </Link>

        <Link
          to={`/?pasteId=${paste._id}`}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-blue-600 text-slate-200 hover:text-white font-medium border border-slate-700 hover:border-blue-500 shadow-md transition-all text-sm"
        >
          <PencilLine size={16} />
          Edit Snippet
        </Link>
      </div>

      {/* Title & Metadata Card */}
      <div className="bg-[#0f172a]/70 border border-slate-800/80 rounded-2xl p-6 shadow-xl backdrop-blur-md flex flex-col gap-4">
        
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="bg-slate-800/90 text-slate-300 border border-slate-700 px-3 py-1 rounded-md text-xs font-mono uppercase tracking-wider">
            {paste.language || "text"}
          </span>

          <div className="flex items-center gap-1.5 text-slate-400 text-xs">
            <Calendar size={14} />
            <span>Created: {FormatDate(paste.createdAt)}</span>
          </div>
        </div>

        <h1 className="text-3xl font-extrabold text-white tracking-tight break-words">
          {paste.title}
        </h1>

        {/* Tags list */}
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

      {/* Editor Mockup for code display */}
      <div className="bg-[#0f172a]/70 border border-slate-800/80 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md flex flex-col">
        
        {/* Editor Mockup Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80 bg-slate-900/40">
          
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ef4444] opacity-80"></div>
            <div className="w-3 h-3 rounded-full bg-[#f59e0b] opacity-80"></div>
            <div className="w-3 h-3 rounded-full bg-[#10b981] opacity-80"></div>
          </div>

          <div className="flex items-center gap-2">
            
            {/* Download */}
            <button
              onClick={handleDownload}
              className="p-2 rounded-lg bg-slate-800/60 border border-slate-700/80 hover:bg-slate-800 hover:border-slate-600 text-slate-300 hover:text-white transition-all"
              title="Download Paste"
            >
              <Download size={16} />
            </button>

            {/* Copy */}
            <button
              onClick={() => {
                navigator.clipboard.writeText(content);
                toast.success("Copied to Clipboard");
              }}
              className="p-2 rounded-lg bg-slate-800/60 border border-slate-700/80 hover:bg-slate-800 hover:border-slate-600 text-slate-300 hover:text-white transition-all"
              title="Copy to Clipboard"
            >
              <Copy size={16} />
            </button>

          </div>

        </div>

        {/* Code View with dynamic line numbers */}
        <div className="flex bg-slate-950/20 min-h-[450px]">
          
          {/* Line Numbers */}
          <div className="w-12 text-right select-none py-6 pr-3.5 text-slate-700 font-mono text-sm border-r border-slate-800/50 bg-slate-950/40">
            {Array.from({ length: Math.max(1, content.split("\n").length) }).map((_, i) => (
              <div key={i} className="h-6 leading-6">{i + 1}</div>
            ))}
          </div>

          {/* Textarea (Read-only) */}
          <textarea
            value={content}
            disabled
            rows={20}
            className="flex-1 bg-transparent text-slate-100 p-6 text-sm font-mono leading-6 outline-none resize-none min-h-[450px] overflow-y-auto cursor-text select-text"
          />

        </div>

        {/* Stats footer bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-3 bg-slate-900/50 border-t border-slate-800/60 text-xs text-slate-400">
          <div className="flex items-center gap-6">
            <span>Characters: <strong className="text-slate-200">{charCount}</strong></span>
            <span>Words: <strong className="text-slate-200">{wordCount}</strong></span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={12} className="text-slate-500" />
            <span>Reading Time: ~{readingTime} min</span>
          </div>
        </div>

      </div>

    </div>
  );
};

export default ViewPaste;
