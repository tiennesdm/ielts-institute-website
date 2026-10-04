'use client';
import { useState } from 'react';
import { Image as ImageIcon, X, ZoomIn, Eye, Sparkles } from 'lucide-react';

export default function GallerySection({ gallery = [], config }) {
  if (config?.show === false || !gallery || gallery.length === 0) return null;
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [selectedImage, setSelectedImage] = useState(null);

  // Extract unique categories
  const categories = ['ALL', ...Array.from(new Set(gallery.map(item => item.category).filter(Boolean)))];

  const filteredItems = gallery.filter(item => {
    if (activeCategory === 'ALL') return true;
    return item.category === activeCategory;
  });

  return (
    <section id="gallery" className="py-14 sm:py-20 bg-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-900 text-xs font-bold uppercase tracking-wider">
            <ImageIcon className="w-3.5 h-3.5 text-blue-700" />
            <span>{config?.badge || "Campus & Life At Academy"}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {config?.title || "Our Photo & Campus Gallery"}
          </h2>
          <p className="text-xs sm:text-base text-slate-600 leading-relaxed">
            {config?.subtitle || "Take a look inside our high-tech computer simulation labs, acoustic 1-on-1 speaking cabins, visa celebrations, and student felicitation ceremonies."}
          </p>
        </div>

        {/* Category Filter Tabs */}
        {categories.length > 1 && (
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mt-6 sm:mt-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  activeCategory === cat
                    ? 'bg-blue-900 text-white shadow-md'
                    : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {cat === 'ALL' ? 'All Photos' : cat}
              </button>
            ))}
          </div>
        )}

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-8 sm:mt-10">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedImage(item)}
              className="group relative h-56 sm:h-64 rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-2xl transition-all duration-300 bg-slate-200 border border-slate-300/60"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity"></div>

              {/* Category pill */}
              {item.category && (
                <div className="absolute top-3 left-3">
                  <span className="bg-white/90 backdrop-blur-md text-slate-900 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                    {item.category}
                  </span>
                </div>
              )}

              {/* Zoom Hover Icon */}
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-sm p-1.5 rounded-full text-white">
                <ZoomIn className="w-4 h-4" />
              </div>

              {/* Caption Bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-3.5 sm:p-4 text-white">
                <h4 className="font-bold text-xs sm:text-sm leading-snug group-hover:text-yellow-300 transition-colors">
                  {item.title}
                </h4>
                {item.description && (
                  <p className="text-[10px] sm:text-[11px] text-slate-300 line-clamp-1 mt-0.5">
                    {item.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="relative max-w-4xl w-full bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-white/10 max-h-[92vh] flex flex-col">
            {/* Close button */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 p-2 bg-black/60 hover:bg-black text-white rounded-full transition-colors"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            <img
              src={selectedImage.image}
              alt={selectedImage.title}
              className="w-full max-h-[55vh] sm:max-h-[70vh] object-contain bg-black shrink-0"
            />

            <div className="p-4 sm:p-6 text-white bg-slate-900 overflow-y-auto">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="bg-red-600 text-white text-[11px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full">
                  {selectedImage.category || 'Campus'}
                </span>
              </div>
              <h3 className="text-base sm:text-xl font-bold">{selectedImage.title}</h3>
              {selectedImage.description && (
                <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">{selectedImage.description}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
