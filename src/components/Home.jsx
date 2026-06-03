import { Copy, PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { addToPastes, updatePastes } from "../redux/pasteSlice";
import { useSearchParams } from "react-router-dom";

const Home = () => {
  const [value, setValue] = useState("");
  const [title, setTitle] = useState("");
  const [searchParams, setSearchParams] = useSearchParams(); // Destructure useSearchParams
  const pasteId = searchParams.get("pasteId"); // Get pasteId from the search params
  const pastes = useSelector((state) => state.paste.pastes);
  const dispatch = useDispatch();

  const createPaste = () => {
    const paste = {
      title: title,
      content: value,
      _id:
        pasteId ||
        Date.now().toString(36) + Math.random().toString(36).substring(2),
      createdAt: new Date().toISOString(),
    };

    if (pasteId) {
      // If pasteId is present, update the paste
      dispatch(updatePastes(paste));
    } else {
      dispatch(addToPastes(paste));
    }

    setTitle("");
    setValue("");

    // Remove the pasteId from the URL after creating/updating a paste
    setSearchParams({});
  };

  const resetPaste = () => {
    setTitle("");
    setValue("");
    setSearchParams({});
    // navigate("/");
  };

  useEffect(() => {
    if (pasteId) {
      const paste = pastes.find((p) => p._id === pasteId);
      if (paste) {
        setTitle(paste.title);
        setValue(paste.content);
      }
    }
  }, [pasteId, pastes]);


  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-8">
      <div className="grid lg:grid-cols-[3fr_1fr] gap-8 items-start">

        {/* LEFT SECTION */}
        <div className="lg:col-span-3 flex flex-col gap-6">

          {/* TOP BAR */}
          <div className="flex gap-4 items-center bg-[#0f172a] border border-slate-700 rounded-3xl p-4">

            <input
              type="text"
              placeholder="Enter Paste Title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="flex-1 bg-slate-900/70 border border-slate-700 rounded-2xl px-6 py-4 text-white text-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all"
            />

            <button
              onClick={createPaste}
              className="bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 px-8 py-4 rounded-2xl text-white font-semibold shadow-lg hover:shadow-blue-500/25 hover:scale-105 transition-all duration-300"
            >
              {pasteId ? "Update Paste" : "Create Paste"}
            </button>

            {pasteId && (
              <button
                onClick={resetPaste}
                className="p-4 rounded-2xl bg-slate-800 border border-slate-700 hover:border-blue-500 transition-all"
              >
                <PlusCircle size={20} />
              </button>
            )}

          </div>

          {/* EDITOR */}
          <div className="bg-[#0f172a] border border-slate-700 rounded-3xl overflow-hidden shadow-2xl">

            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700">

              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>

              <button
                className="p-2 rounded-xl bg-slate-800 border border-slate-700 hover:border-blue-500 transition-all duration-300"
                onClick={() => {
                  navigator.clipboard.writeText(value);
                  toast.success("Copied to Clipboard", {
                    position: "top-right",
                  });
                }}
              >
                <Copy size={20} />
              </button>

            </div>

            <textarea
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Write your content here..."
              rows={20}
              className="w-full bg-transparent text-slate-200 p-8 text-lg leading-8 outline-none resize-none min-h-[500px]"
              style={{
                caretColor: "#60A5FA",
              }}
            />
          </div>

        </div>

        {/* RIGHT SIDEBAR */}
        <div className="bg-[#0f172a] border border-slate-700 rounded-3xl p-6 shadow-2xl min-h-[730px] sticky top-28">

          <h2 className="text-2xl font-bold text-white mb-8 border-b border-slate-700 pb-4">
            Your Pastes
          </h2>

          <div className="h-[620px] flex flex-col justify-center items-center text-center">

            <div className="text-7xl mb-5">
              📋
            </div>

            <h3 className="text-2xl font-semibold text-white">
              No Pastes Yet
            </h3>

            <p className="text-slate-400 mt-3">
              Create your first paste and it will appear here.
            </p>

          </div>

        </div>

      </div>
    </div>
  );
};

export default Home;
