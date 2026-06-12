import React, { useState } from 'react';
import { Maximize2, X } from 'lucide-react';

const GALLERY_IMAGES = [
  {
    id: 1,
    category: 'ambiance',
    title: 'Grand Zen interior',
    description: 'The monumental 50-foot ceiling featuring intricate bamboo block details.',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 2,
    category: 'dishes',
    title: 'Signature Maki Platter',
    description: 'Chef\'s selection of premium maki rolls presented with fresh wasabi.',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 3,
    category: 'cocktails',
    title: 'Craft Gin Infusions',
    description: 'Smoky, berry-based craft cocktails flavored with Asian botanicals.',
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 4,
    category: 'ambiance',
    title: 'Sculpture & Water Channel',
    description: 'The 25-foot Balinese consort head sculpture cascading water past floating lotuses.',
    image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 5,
    category: 'dishes',
    title: 'Steamed Crystal Dumplings',
    description: 'Wild mushroom and truffle crystal dumplings glistening in steamer baskets.',
    image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 6,
    category: 'cocktails',
    title: 'Zen Garden Collins',
    description: 'Refreshing sake, cucumber juice, and elderflower collins.',
    image: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 7,
    category: 'ambiance',
    title: 'Outdoor Teppanyaki Courtyard',
    description: 'Sleek dark wood seating surrounding the live fire teppanyaki deck under a frangipani tree.',
    image: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 8,
    category: 'dishes',
    title: 'Crispy Peking Duck',
    description: 'Traditional slow-roasted crispy Peking duck carved by our chef.',
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=1000&q=80'
  }
];

const Gallery = () => {
  const [filter, setFilter] = useState('all');
  const [lightboxImage, setLightboxImage] = useState(null);

  const filteredImages = filter === 'all'
    ? GALLERY_IMAGES
    : GALLERY_IMAGES.filter(img => img.category === filter);

  return (
    <div className="bg-ebony min-h-screen pt-28 pb-20 text-stone">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        
        {/* Header Title */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[10px] tracking-[0.3em] text-gold uppercase font-semibold">Visual Atmosphere</span>
          <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-wider mt-2 mb-4">
            Gallery
          </h1>
          <div className="w-20 h-0.5 bg-gold mx-auto mb-4" />
          <p className="text-xs font-light text-stone-light">
            An inside look at our soaring architectural volumes, dramatic carvings, and detailed culinary creations.
          </p>
        </div>

        {/* Filter Navigation */}
        <div className="flex justify-center space-x-4 mb-12 border-b border-stone-border/30 pb-6">
          {['all', 'ambiance', 'dishes', 'cocktails'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-5 py-2 font-sans text-xs tracking-widest uppercase transition-all duration-300 ${
                filter === cat
                  ? 'bg-gold text-ebony font-semibold'
                  : 'bg-transparent text-stone hover:text-gold-hover'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Images Grid (Masonry Columns Layout) */}
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 [column-fill:_balance] space-y-6">
          {filteredImages.map((img) => (
            <div 
              key={img.id}
              onClick={() => setLightboxImage(img)}
              className="break-inside-avoid bg-ebony-card border border-stone-border/40 p-4 group cursor-pointer hover:border-gold/40 transition-all duration-500 flex flex-col rounded-2xl hover:shadow-[0_8px_25px_rgba(212,175,55,0.08)] mb-6"
            >
              <div className="relative overflow-hidden rounded-xl border border-stone-border">
                <img 
                  src={img.image} 
                  alt={img.title}
                  className="w-full h-auto object-cover filter brightness-90 group-hover:brightness-100 group-hover:scale-110 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="p-3 bg-ebony-card/90 border border-gold/30 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <Maximize2 className="w-5 h-5 text-gold animate-pulse" />
                  </div>
                </div>
              </div>
              
              <div className="pt-4 pb-1 px-1 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-sm font-semibold text-ivory tracking-wide mb-1 group-hover:text-gold transition-colors duration-300">
                    {img.title}
                  </h3>
                  <p className="text-[11px] font-light text-stone leading-relaxed">
                    {img.description}
                  </p>
                </div>
                <span className="text-[9px] tracking-[0.2em] uppercase text-gold/60 mt-3 block font-medium">
                  {img.category}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {lightboxImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm">
            <button 
              onClick={() => setLightboxImage(null)}
              className="absolute top-6 right-6 text-stone hover:text-gold transition-colors duration-300"
              aria-label="Close fullscreen view"
            >
              <X className="w-8 h-8" />
            </button>

            <div className="max-w-4xl w-full max-h-[85vh] flex flex-col items-center">
              <div className="border border-stone-border p-2 bg-ebony-card max-h-[70vh] overflow-hidden flex items-center justify-center">
                <img 
                  src={lightboxImage.image} 
                  alt={lightboxImage.title}
                  className="max-w-full max-h-[68vh] object-contain border border-stone-border"
                />
              </div>

              <div className="text-center mt-6 max-w-xl">
                <h3 className="font-serif text-xl font-bold tracking-wider text-gold uppercase mb-2">
                  {lightboxImage.title}
                </h3>
                <p className="text-sm font-light text-stone-light leading-relaxed">
                  {lightboxImage.description}
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Gallery;
