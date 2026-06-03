import { Copy } from "lucide-react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const ViewPaste = () => {
  const { id } = useParams();

  const pastes = useSelector((state) => state.paste.pastes);

  const paste = pastes.find((paste) => paste._id === id);

  if (!paste) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-3xl font-bold text-white">
          Paste Not Found
        </h1>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1600px] mx-auto px-8 py-8">

      <div className="flex flex-col gap-6">

        {/* Title */}
        <input
          type="text"
          value={paste.title}
          disabled
          className="w-full bg-slate-900/70 border border-slate-700 rounded-2xl px-6 py-4 text-white text-lg outline-none"
        />

        {/* Editor */}
        <div className="bg-[#0f172a] border border-slate-700 rounded-3xl overflow-hidden shadow-2xl">

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700">

            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>

            <button
              className="p-2 rounded-xl bg-slate-800 border border-slate-700 hover:border-blue-500 transition-all duration-300"
              onClick={() => {
                navigator.clipboard.writeText(paste.content);
                toast.success("Copied to Clipboard");
              }}
            >
              <Copy size={20} className="text-slate-300" />
            </button>

          </div>

          {/* Content */}
          <textarea
            value={paste.content}
            disabled
            rows={20}
            className="w-full bg-transparent text-slate-200 p-8 text-lg leading-8 outline-none resize-none min-h-[650px]"
          />

        </div>

      </div>

    </div>
  );
};

export default ViewPaste;
