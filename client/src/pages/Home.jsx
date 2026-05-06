import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const features = [
    { icon: "⚡", title: "Skill Exchange", desc: "Find the perfect partner to trade and learn new tech skills." },
    { icon: "📚", title: "Share Notes", desc: "Upload, organize, and exchange premium study materials." },
    { icon: "💬", title: "Live Chat", desc: "Connect instantly with peers using real-time messaging." },
    { icon: "🖌️", title: "Whiteboard", desc: "Brainstorm and collaborate visually on a shared live canvas." },
    { icon: "🗺️", title: "Career Roadmaps", desc: "Follow expert guides to crack TCS, Accenture, and product companies." },
    { icon: "🚀", title: "100% Free", desc: "No subscriptions. No paywalls. Just pure knowledge exchange." }
  ];

  return (
    <div className="min-h-screen bg-[#0a0f1c] text-slate-200 selection:bg-indigo-500/30 overflow-hidden relative">

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-fuchsia-600/10 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 pt-24 pb-16 relative z-10 flex flex-col items-center">

        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-20 mt-10">
          <div className="inline-block mb-4 px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-sm font-semibold tracking-wide">
            Welcome to the ultimate student network
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight text-white">
            Master new skills by <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-fuchsia-400">sharing yours.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 mb-10 leading-relaxed">
            Stop learning alone. Connect with developers, share resources, map out your career, and build projects together in real-time.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {user ? (
              <>
                <button
                  onClick={() => navigate("/dashboard")}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-base transition-all active:scale-95 shadow-[0_0_20px_rgba(79,70,229,0.3)]"
                >
                  Go to Dashboard
                </button>
                <button
                  onClick={() => navigate("/matches")}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700 text-white font-bold text-base backdrop-blur-md transition-all active:scale-95"
                >
                  Explore Matches
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate("/signup")}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-base transition-all active:scale-95 shadow-[0_0_20px_rgba(79,70,229,0.3)]"
                >
                  Create Free Account
                </button>
                <button
                  onClick={() => navigate("/login")}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700 text-white font-bold text-base backdrop-blur-md transition-all active:scale-95"
                >
                  Log In
                </button>
              </>
            )}
          </div>
        </div>

        {/* Features*/}
        <div className="w-full">
          <h2 className="text-2xl font-bold text-center text-white mb-10">Everything you need to level up</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="group p-6 rounded-2xl bg-slate-800/40 border border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/80 hover:border-indigo-500/50 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="text-4xl mb-4 grayscale-[0.5] group-hover:grayscale-0 transition-all duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-100 mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Home;