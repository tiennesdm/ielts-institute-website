export default function StatsSection({ stats = [], show = true }) {
  if (show === false || !stats || stats.length === 0) return null;

  const getGridCols = () => {
    if (stats.length === 1) return 'grid-cols-1 max-w-sm mx-auto';
    if (stats.length === 2) return 'grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto';
    if (stats.length === 3) return 'grid-cols-1 sm:grid-cols-3 max-w-4xl mx-auto';
    return 'grid-cols-2 lg:grid-cols-4';
  };

  return (
    <section className="relative -mt-6 sm:-mt-8 z-30 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 p-4 sm:p-6 md:p-8">
        <div className={`grid ${getGridCols()} gap-4 sm:gap-6 md:gap-8`}>
          {stats.map((item, idx) => (
            <div
              key={item.id || idx}
              className={`text-center p-3 sm:p-4 rounded-xl transition-all ${
                stats.length > 2 ? 'bg-slate-50/70 sm:bg-transparent' : ''
              }`}
            >
              <div className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
                <span className="bg-gradient-to-r from-blue-900 via-indigo-900 to-red-600 bg-clip-text text-transparent">
                  {item.value}
                </span>
              </div>
              <div className="text-xs sm:text-sm font-bold text-slate-800 mt-1">
                {item.label}
              </div>
              {item.subtext && (
                <p className="text-[11px] sm:text-xs text-slate-500 font-medium mt-0.5">
                  {item.subtext}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
