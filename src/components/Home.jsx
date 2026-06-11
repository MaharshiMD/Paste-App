import { Copy, PlusCircle, Trash2, Eye, Download, Share2, Clock, Search, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { addToPastes, updatePastes, removeFromPastes } from "../redux/pasteSlice";
import { useSearchParams, useNavigate } from "react-router-dom";
import { FormatDate } from "../utils/formatDate";

const LANGUAGES = [
  { value: "text", label: "Plain Text" },
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
  { value: "json", label: "JSON" },
  { value: "markdown", label: "Markdown" },
  { value: "cpp", label: "C++" },
  { value: "java", label: "Java" },
  { value: "rust", label: "Rust" },
  { value: "go", label: "Go" },
];

const Home = () => {
  const [value, setValue] = useState("");
  const [title, setTitle] = useState("");
  const [language, setLanguage] = useState("text");
  const [tags, setTags] = useState("");
  const [sidebarSearch, setSidebarSearch] = useState("");

  const [searchParams, setSearchParams] = useSearchParams();
  const pasteId = searchParams.get("pasteId");
  const pastes = useSelector((state) => state.paste.pastes);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Statistics calculations
  const charCount = value.length;
  const wordCount = value.trim() === "" ? 0 : value.trim().split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200);

  const createPaste = () => {
    if (!title.trim()) {
      toast.error("Please enter a title for your paste.");
      return;
    }
    if (!value.trim()) {
      toast.error("Paste content cannot be empty.");
      return;
    }

    const cleanTags = tags
      ? tags
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t.length > 0)
      : [];

    const existingPaste = pasteId ? pastes.find((p) => p._id === pasteId) : null;

    const paste = {
      title: title.trim(),
      content: value,
      language: language,
      tags: cleanTags,
      _id: pasteId || Date.now().toString(36) + Math.random().toString(36).substring(2),
      createdAt: existingPaste ? existingPaste.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (pasteId) {
      dispatch(updatePastes(paste));
    } else {
      dispatch(addToPastes(paste));
    }

    // Reset inputs
    setTitle("");
    setValue("");
    setLanguage("text");
    setTags("");
    setSearchParams({});
  };

  const resetPaste = () => {
    setTitle("");
    setValue("");
    setLanguage("text");
    setTags("");
    setSearchParams({});
  };

  const handleShare = (id) => {
    if (!id) {
      toast.error("Save your paste first to share!");
      return;
    }
    const shareUrl = `${window.location.origin}/pastes/${id}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success("Link copied to clipboard!");
  };

  const handleDownload = (pasteTitle, content) => {
    if (!content.trim()) {
      toast.error("Nothing to download.");
      return;
    }
    const element = document.createElement("a");
    const file = new Blob([content], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${pasteTitle || "paste"}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success("File download started!");
  };

  const handleDelete = (id) => {
    dispatch(removeFromPastes(id));
    if (pasteId === id) {
      resetPaste();
    }
  };

  useEffect(() => {
    if (pasteId) {
      const paste = pastes.find((p) => p._id === pasteId);
      if (paste) {
        setTitle(paste.title || "");
        setValue(paste.content || "");
        setLanguage(paste.language || "text");
        setTags(paste.tags ? paste.tags.join(", ") : "");
      }
    }
  }, [pasteId, pastes]);

  // Filter pastes for sidebar
  const filteredSidebarPastes = pastes.filter(
    (p) =>
      p.title.toLowerCase().includes(sidebarSearch.toLowerCase()) ||
      p.content.toLowerCase().includes(sidebarSearch.toLowerCase())
  );

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-10 flex flex-col gap-8">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Sparkles className="text-blue-500" size={28} />
            {pasteId ? "Modify Paste" : "Create New Paste"}
          </h1>
          <p className="text-slate-400 mt-1.5 text-sm">
            {pasteId ? "Make changes to your paste and update it." : "Write, tag, code, and share your snippets instantly."}
          </p>
        </div>
        
        {pasteId && (
          <button
            onClick={resetPaste}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium border border-slate-700 hover:border-slate-600 shadow-lg transition-all"
          >
            <PlusCircle size={18} />
            Create Fresh Paste
          </button>
        )}
      </div>

      {/* MAIN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* LEFT COMPONENT: EDITOR & FIELDS */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          
          {/* TITLE & META FIELDS INPUTS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#0f172a]/70 border border-slate-800/80 rounded-2xl p-4 shadow-xl backdrop-blur-md">
            
            {/* Title Input */}
            <div className="md:col-span-2 flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-400 tracking-wide uppercase">Paste Title</label>
              <input
                type="text"
                placeholder="Enter paste title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-slate-900 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 rounded-xl px-4 py-3 text-white text-sm outline-none transition-all placeholder:text-slate-500"
              />
            </div>

            {/* Language Selector */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-400 tracking-wide uppercase">Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-slate-900 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 rounded-xl px-4 py-3 text-slate-300 text-sm outline-none transition-all cursor-pointer"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.value} value={lang.value} className="bg-slate-900 text-slate-300">
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Tags Input */}
            <div className="md:col-span-3 flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-400 tracking-wide uppercase">Tags (comma separated)</label>
              <input
                type="text"
                placeholder="e.g. tutorial, react, production, api"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="bg-slate-900 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 rounded-xl px-4 py-3 text-white text-sm outline-none transition-all placeholder:text-slate-500"
              />
            </div>

          </div>

          {/* EDITOR BODY */}
          <div className="bg-[#0f172a]/70 border border-slate-800/80 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md flex flex-col">
            
            {/* Editor Action Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80 bg-slate-900/40">
              
              {/* Window Controls Mockup */}
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-[#ef4444]"></div>
                <div className="w-3 h-3 rounded-full bg-[#f59e0b]"></div>
                <div className="w-3 h-3 rounded-full bg-[#10b981]"></div>
              </div>

              {/* Language Badge */}
              <div className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-800 text-slate-300 uppercase tracking-widest border border-slate-700">
                {LANGUAGES.find((lang) => lang.value === language)?.label || "Plain Text"}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                
                {/* Download */}
                <button
                  onClick={() => handleDownload(title, value)}
                  className="p-2 rounded-lg bg-slate-800/60 border border-slate-700/80 hover:bg-slate-800 hover:border-slate-600 text-slate-300 hover:text-white transition-all"
                  title="Download File"
                >
                  <Download size={16} />
                </button>

                {/* Share */}
                {pasteId && (
                  <button
                    onClick={() => handleShare(pasteId)}
                    className="p-2 rounded-lg bg-slate-800/60 border border-slate-700/80 hover:bg-slate-800 hover:border-slate-600 text-slate-300 hover:text-white transition-all"
                    title="Share Paste"
                  >
                    <Share2 size={16} />
                  </button>
                )}

                {/* Copy */}
                <button
                  onClick={() => {
                    if (!value.trim()) {
                      toast.error("Nothing to copy.");
                      return;
                    }
                    navigator.clipboard.writeText(value);
                    toast.success("Copied to Clipboard", { position: "top-right" });
                  }}
                  className="p-2 rounded-lg bg-slate-800/60 border border-slate-700/80 hover:bg-slate-800 hover:border-slate-600 text-slate-300 hover:text-white transition-all"
                  title="Copy to Clipboard"
                >
                  <Copy size={16} />
                </button>
              </div>

            </div>

            {/* Code / Text Area with dynamic line numbers */}
            <div className="flex bg-slate-950/20 min-h-[450px]">
              
              {/* Line Numbers column */}
              <div className="w-12 text-right select-none py-6 pr-3.5 text-slate-600 font-mono text-sm border-r border-slate-800/50 bg-slate-950/40">
                {Array.from({ length: Math.max(1, value.split("\n").length) }).map((_, i) => (
                  <div key={i} className="h-6 leading-6">{i + 1}</div>
                ))}
              </div>

              {/* Text Input area */}
              <textarea
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Write or paste your content here..."
                className="flex-1 bg-transparent text-slate-100 p-6 text-sm font-mono leading-6 outline-none resize-none min-h-[450px] overflow-y-auto"
                style={{ caretColor: "#3b82f6" }}
              />

            </div>

            {/* Statistics footer bar */}
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

          {/* Action Trigger Button */}
          <button
            onClick={createPaste}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold shadow-xl shadow-blue-500/10 hover:shadow-blue-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all duration-300"
          >
            {pasteId ? "Save Modifications" : "Publish Paste"}
          </button>

        </div>

        {/* RIGHT COMPONENT: SIDEBAR (LIVE RECENT PASTES BROWSER) */}
        <div className="bg-[#0f172a]/70 border border-slate-800/80 rounded-2xl p-5 shadow-xl backdrop-blur-md flex flex-col gap-5 lg:sticky lg:top-24 max-h-[85vh]">
          
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white tracking-tight">Recent Pastes</h2>
            <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full border border-slate-700">
              {pastes.length}
            </span>
          </div>

          {/* Mini Search */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
            <input
              type="text"
              placeholder="Search title or content..."
              value={sidebarSearch}
              onChange={(e) => setSidebarSearch(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white outline-none focus:border-blue-500 transition-all placeholder:text-slate-500"
            />
          </div>

          {/* Pastes list */}
          <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-3 max-h-[500px]">
            {filteredSidebarPastes.length > 0 ? (
              filteredSidebarPastes.map((p) => {
                const isActive = pasteId === p._id;
                return (
                  <div
                    key={p._id}
                    className={`p-3.5 rounded-xl border transition-all duration-200 flex flex-col gap-2 ${
                      isActive
                        ? "bg-slate-800/80 border-blue-500/60 shadow-lg shadow-blue-500/5"
                        : "bg-slate-900/40 border-slate-800 hover:bg-slate-900/90 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h3
                        onClick={() => setSearchParams({ pasteId: p._id })}
                        className="font-semibold text-sm text-slate-100 hover:text-blue-400 cursor-pointer truncate max-w-[140px]"
                        title={p.title}
                      >
                        {p.title}
                      </h3>
                      
                      {/* Action icons */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => handleShare(p._id)}
                          className="text-slate-500 hover:text-slate-300 p-0.5"
                          title="Share Link"
                        >
                          <Share2 size={12} />
                        </button>
                        <button
                          onClick={() => navigate(`/pastes/${p._id}`)}
                          className="text-slate-500 hover:text-slate-300 p-0.5"
                          title="Open View Mode"
                        >
                          <Eye size={12} />
                        </button>
                        <button
                          onClick={() => handleDelete(p._id)}
                          className="text-slate-500 hover:text-red-400 p-0.5"
                          title="Delete"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {p.content}
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-800/50">
                      <span className="bg-slate-850 px-1.5 py-0.5 rounded text-slate-400 uppercase tracking-wider font-mono">
                        {p.language || "text"}
                      </span>
                      <span>{FormatDate(p.createdAt)}</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-12 flex flex-col items-center text-center">
                <span className="text-3xl mb-2">📋</span>
                <p className="text-xs text-slate-500">No pastes match search</p>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};

export default Home;
