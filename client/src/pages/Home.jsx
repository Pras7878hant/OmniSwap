const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-700 text-white flex flex-col justify-center items-center">

      <h1 className="text-5xl font-bold mb-4">
        SkillSwap Hub 🚀
      </h1>

      <p className="text-lg mb-6 text-center max-w-xl">
        Learn new skills by exchanging what you already know.
      </p>

      <div className="flex gap-4">
        <button className="bg-white text-indigo-600 px-6 py-2 rounded-lg font-semibold hover:scale-105 transition">
          Get Started
        </button>

        <button className="border border-white px-6 py-2 rounded-lg hover:bg-white hover:text-indigo-600 transition">
          Explore
        </button>
      </div>

    </div>
  );
};

export default Home;