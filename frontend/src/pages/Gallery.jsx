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
    <div className="bg-ebony min-h-screen pt-32 pb-24 text-stone">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        
        {/* Header Title */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <span className="text-[9px] tracking-[0.4em] text-gold uppercase font-medium block mb-3">Visual Atmosphere</span>
          <h1 className="text-4xl md:text-5xl font-serif font-light text-white tracking-wide mt-2 mb-4">
            The Gallery
          </h1>
          <div className="w-12 h-[1px] bg-gold/40 mx-auto mb-4" />
          <p className="text-xs font-light text-stone/60 leading-relaxed">
            An inside look at our soaring architectural volumes, Balinese stone carvings, and meticulously detailed culinary creations.
          </p>
        </div>

        {/* Filter Navigation */}
        <div className="flex justify-center space-x-6 mb-16 border-b border-stone-border/20 pb-6 text-[10px] tracking-widest uppercase font-medium">
          {['all', 'ambiance', 'dishes', 'cocktails'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`relative py-2 transition-all duration-300 cursor-pointer ${
                filter === cat
                  ? 'text-gold'
                  : 'text-stone/60 hover:text-gold-hover'
              }`}
            >
              <span>{cat}</span>
              {filter === cat && (
                <span className="absolute bottom-0 left-0 w-full h-[1px] bg-gold" />
              )}
            </button>
          ))}
        </div>

        {/* Images Grid (Bespoke Lookbook Masonry Layout) */}
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-8 [column-fill:_balance] space-y-8">
          {filteredImages.map((img) => (
            <div 
              key={img.id}
              onClick={() => setLightboxImage(img)}
              className="break-inside-avoid group cursor-pointer flex flex-col mb-8 bg-ebony-card border border-stone-border/20 p-3"
            >
              <div className="relative overflow-hidden aspect-auto border border-stone-border/20">
                <img 
                  src={img.image} 
                  alt={img.title}
                  className="w-full h-auto object-cover filter brightness-[0.75] group-hover:brightness-95 group-hover:scale-[1.02] transition-all duration-700"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="p-3 bg-ebony-card border border-gold/30 rounded-none shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <Maximize2 className="w-4 h-4 text-gold" />
                  </div>
                </div>
              </div>
              
              <div className="pt-4 pb-1 px-1 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-sm font-normal text-stone/90 tracking-wide mb-1.5 group-hover:text-gold transition-colors duration-300">
                    {img.title}
                  </h3>
                  <p className="text-[11px] font-light text-stone/50 leading-relaxed">
                    {img.description}
                  </p>
                </div>
                <span className="text-[8px] tracking-[0.25em] uppercase text-gold/50 mt-4 block font-mono">
                  {img.category}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {lightboxImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <button 
              onClick={() => setLightboxImage(null)}
              className="absolute top-6 right-6 text-stone/60 hover:text-gold transition-colors duration-300"
              aria-label="Close fullscreen view"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="max-w-4xl w-full max-h-[85vh] flex flex-col items-center">
              <div className="border border-stone-border/30 p-2 bg-ebony-card max-h-[70vh] overflow-hidden flex items-center justify-center">
                <img 
                  src={lightboxImage.image} 
                  alt={lightboxImage.title}
                  className="max-w-full max-h-[68vh] object-contain border border-stone-border/20"
                />
              </div>

              <div className="text-center mt-6 max-w-xl">
                <h3 className="font-serif text-lg font-normal tracking-wider text-gold uppercase mb-2">
                  {lightboxImage.title}
                </h3>
                <p className="text-xs font-light text-stone/60 leading-relaxed">
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
