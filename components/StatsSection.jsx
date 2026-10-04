export default function StatsSection({ stats = [], show = true }) {
  if (show === false || !stats || stats.length === 0) return null;

  const getGridCols = () => {
    if (stats.length === 1) return 'grid-cols-1 max-w-sm mx-auto';
    if (stats.length === 2) return 'grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto';
    if (stats.length === 3) return 'grid-cols-1 sm:grid-cols-3 max-w-4xl mx-auto';
    return 'grid-cols-2 md:grid-cols-4';
  };

  return (
    <section className="relative -mt-8 z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 p-6 sm:p-8">
        <div className={`grid ${getGridCols()} gap-6 md:gap-8 divide-y md:divide-y-0 md:divide-x divide-slate-100`}>
          {stats.map((item, idx) => (
            <div key={item.id || idx} className={`text-center ${idx > 0 ? 'pt-4 md:pt-0' : ''}`}>
              <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
                <span className="bg-gradient-to-r from-blue-900 via-indigo-900 to-red-600 bg-clip-text text-transparent">
                  {item.value}
                </span>
              </div>
              <div className="text-sm font-bold text-slate-800 mt-1">
                {item.label}
              </div>
              {item.subtext && (
                <p className="text-xs text-slate-500 font-medium mt-0.5">
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
