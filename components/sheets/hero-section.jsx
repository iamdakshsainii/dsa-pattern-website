export default function HeroSection({ onQuizClick, onCompareClick, onFilterClick }) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 text-white py-16 px-4 rounded-2xl mb-8">
      <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,black)]"></div>

      <div className="relative max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          🎯 Choose Your DSA Weapon
        </h1>
        <p className="text-xl md:text-2xl mb-2 text-purple-100">
          Pick one. Master it. Land the job.
        </p>
        <p className="text-sm md:text-base text-purple-200 mb-8">
          ⚠️ Don't switch sheets mid-way. Commitment beats confusion.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onQuizClick}
            className="px-6 py-3 bg-white text-purple-600 rounded-full font-semibold hover:bg-purple-50 transition-all hover:scale-105 shadow-lg"
          >
            ⚡ Quick Match Quiz
          </button>
          <button
            onClick={onCompareClick}
            className="px-6 py-3 bg-purple-500/30 backdrop-blur-sm border-2 border-white/50 rounded-full font-semibold hover:bg-purple-500/50 transition-all hover:scale-105"
          >
            📊 Compare All
          </button>
          <button
            onClick={onFilterClick}
            className="px-6 py-3 bg-purple-500/30 backdrop-blur-sm border-2 border-white/50 rounded-full font-semibold hover:bg-purple-500/50 transition-all hover:scale-105"
          >
            🔍 Filter Sheets
          </button>
        </div>
      </div>
    </div>
  )
}
