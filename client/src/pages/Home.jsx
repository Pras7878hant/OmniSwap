import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 overflow-hidden bg-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/60 via-slate-950 to-black"></div>

      <div className="absolute w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px] -top-40 -left-20 animate-pulse"></div>
      <div className="absolute w-[600px] h-[600px] bg-cyan-600/20 rounded-full blur-[120px] -bottom-40 -right-20 animate-pulse"></div>

      <div className="relative z-10 text-center max-w-2xl mx-auto">
        <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-indigo-100 to-purple-300 drop-shadow-lg">
          SkillSwap Hub 🚀
        </h1>

        <p className="text-xl md:text-2xl text-slate-300 mb-12 font-light leading-relaxed">
          Learn new skills by exchanging what you already know.
          <br />
          <span className="block mt-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-indigo-300 font-bold tracking-widest uppercase text-sm">
            No money. Just skills.
          </span>
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <button
            onClick={() => {
              if (user) {
                navigate("/dashboard");
              } else {
                navigate("/signup");
              }
            }}
            className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-indigo-600 text-white font-bold text-lg shadow-[0_0_40px_-10px_rgba(79,70,229,0.6)] hover:bg-indigo-500 hover:shadow-[0_0_60px_-15px_rgba(79,70,229,0.8)] hover:-translate-y-1 transition-all duration-300 active:scale-95"
          >
            Get Started
          </button>

          <button
            onClick={() => {
              if (user) {
                navigate("/matches");
              } else {
                navigate("/login");
              }
            }}
            className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-lg backdrop-blur-xl hover:bg-white/10 hover:border-white/30 hover:-translate-y-1 transition-all duration-300 active:scale-95"
          >
            Explore
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;