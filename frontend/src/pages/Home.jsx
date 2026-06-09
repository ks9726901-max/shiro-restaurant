import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Sparkles, Flame, Wine } from 'lucide-react';

const Home = () => {
  const highlights = [
    {
      icon: Compass,
      title: 'Zen Castle Grandeur',
      description: 'Step into an Asian fortress detailed with yellow ochre stone, teardrop screens, and waterbodies filled with lotuses.'
    },
    {
      icon: Sparkles,
      title: 'Pan-Asian Masterclass',
      description: 'Savor a meticulous selection of Japanese Sushi, Cantonese Dim Sum, and Korean specialties crafted by master chefs.'
    },
    {
      icon: Flame,
      title: 'Teppanyaki Theatre',
      description: 'Dine in our tropical outdoor terrace and witness the theatrical artistry of live teppanyaki fire grilling.'
    },
    {
      icon: Wine,
      title: 'Signature Mixology',
      description: 'Immerse in bespoke botanical craft cocktails flavored with sake, yuzu, fresh berry shrubs, and lemongrass.'
    }
  ];

  const categories = [
    {
      name: 'Sushi & Sashimi',
      image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=600&q=80',
      description: 'Authentic Maki rolls, Nigiri, and fresh Sashimi.'
    },
    {
      name: 'Steamed Dim Sum',
      image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=80',
      description: 'Classic crystal dumplings and Cantonese buns.'
    },
    {
      name: 'Craft Cocktails',
      image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=600&q=80',
      description: 'Asian botanical spirits and award-winning blends.'
    }
  ];

  return (
    <div className="bg-ebony overflow-hidden pt-20">
      
      {/* 1. Immersive Hero Section */}
      <header className="relative min-h-[90vh] flex items-center justify-center">
        {/* Background Image Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: 'url("https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1600&q=80")',
          }}
        />
        {/* Dark Ebony overlay filter */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-ebony/75 to-ebony" />

        {/* Hero Content */}
        <div className="relative max-w-4xl mx-auto px-6 text-center flex flex-col items-center z-10">
          <div className="inline-flex items-center space-x-2 border border-gold/40 px-4 py-1.5 bg-gold/5 mb-8">
            <span className="text-[10px] tracking-[0.3em] text-gold uppercase font-medium">UB City, Bengaluru</span>
          </div>

          <h1 className="font-serif text-5xl md:text-7xl font-bold tracking-wider leading-tight text-white mb-6">
            An Asian Castle <br />
            <span className="gold-gradient-text">Of Culinary Art</span>
          </h1>

          <p className="text-stone-light font-light text-base md:text-lg max-w-2xl leading-relaxed mb-10">
            Dine beneath 50-foot bamboo block ceilings flanked by towering Balinese sculptures, cascading waterfalls, and tranquil lotus ponds.
          </p>

          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
            <Link
              to="/reservation"
              className="px-8 py-3.5 bg-gold text-ebony font-sans text-xs font-semibold tracking-widest uppercase hover:bg-gold-hover transition-all duration-500 shadow-lg"
            >
              Reserve A Table
            </Link>
            <Link
              to="/menu"
              className="px-8 py-3.5 bg-transparent border border-stone-light/40 text-stone-light font-sans text-xs font-semibold tracking-widest uppercase hover:border-gold hover:text-gold transition-all duration-500"
            >
              Explore Menu
            </Link>
          </div>
        </div>

        {/* Ambient Bottom Gradient */}
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-ebony to-transparent" />
      </header>

      {/* 2. Highlights Grid */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-24 border-b border-stone-border/30">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-wider mb-4">
            The Shiro Experience
          </h2>
          <div className="w-24 h-0.5 bg-gold mx-auto mb-6" />
          <p className="text-sm font-light leading-relaxed">
            Every corner of Shiro Bengaluru is curated to invoke tranquility, drama, and luxury.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {highlights.map((item, idx) => (
            <div 
              key={idx} 
              className="bg-ebony-card border border-stone-border/40 p-8 flex flex-col items-center text-center hover:border-gold/50 transition-all duration-500 hover:-translate-y-1 group"
            >
              <div className="w-12 h-12 rounded-full border border-gold/30 flex items-center justify-center mb-6 group-hover:bg-gold/10 group-hover:border-gold transition-all duration-500 text-gold">
                <item.icon className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-base font-semibold tracking-wider text-gold-hover mb-4 group-hover:text-gold transition-colors duration-300">
                {item.title}
              </h3>
              <p className="text-xs font-light leading-relaxed text-stone">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Ambiance Feature (Split Layout) */}
      <section className="bg-ebony-card py-24 border-b border-stone-border/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <div className="relative">
            {/* Main Picture */}
            <div className="relative border border-stone-border p-4 bg-ebony-light">
              <img 
                src="https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=800&q=80" 
                alt="Shiro Balinese Sculpture & Lotus Ponds" 
                className="w-full h-[450px] object-cover filter brightness-90 border border-stone-border"
              />
            </div>
            
            {/* Absolute Decorative Frame */}
            <div className="hidden sm:block absolute -top-4 -left-4 w-24 h-24 border-t-2 border-l-2 border-gold" />
            <div className="hidden sm:block absolute -bottom-4 -right-4 w-24 h-24 border-b-2 border-r-2 border-gold" />
          </div>

          <div className="flex flex-col space-y-6">
            <span className="text-[10px] tracking-[0.3em] text-gold uppercase font-semibold">The Aesthetics</span>
            <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-wider">
              An Immersive Zen Castle
            </h2>
            <div className="w-20 h-0.5 bg-gold mb-2" />
            
            <p className="text-sm font-light leading-relaxed">
              Designed by award-winning architects, Shiro Bengaluru marries Balinese stone temple art with Japanese minimalism. The focal point is a massive 25-foot stone consort sculpture cascading fresh water into lotus channels, bringing the sound of nature directly to your dining table.
            </p>
            
            <p className="text-sm font-light leading-relaxed">
              By day, soft light filters through translucent teardrop lanterns, casting shadows on yellow ochre stone walls. By night, Shiro transforms into a high-end lounge with ambient, dramatic gold lighting, creating the ultimate backdrop for fine dining and celebrations.
            </p>

            <Link
              to="/gallery"
              className="mt-4 self-start px-6 py-2.5 bg-transparent border border-gold text-gold font-sans text-xs uppercase tracking-widest hover:bg-gold hover:text-ebony transition-all duration-500 font-semibold"
            >
              View Gallery
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Menu Highlight Slider */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-24">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-wider mb-4">
            Gastronomy Highlights
          </h2>
          <div className="w-24 h-0.5 bg-gold mx-auto mb-6" />
          <p className="text-sm font-light leading-relaxed">
            Delicacies from across Japan, China, Thailand, and Malaysia prepared with premium ingredients.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {categories.map((cat, idx) => (
            <div key={idx} className="bg-ebony-card border border-stone-border/40 group overflow-hidden">
              <div className="overflow-hidden h-64 border-b border-stone-border">
                <img 
                  src={cat.image} 
                  alt={cat.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 brightness-90 group-hover:brightness-100"
                />
              </div>
              <div className="p-8 text-center">
                <h3 className="font-serif text-lg font-bold tracking-wider text-gold mb-3">
                  {cat.name}
                </h3>
                <p className="text-xs font-light text-stone mb-6">
                  {cat.description}
                </p>
                <Link 
                  to="/menu" 
                  className="text-xs tracking-widest font-semibold text-gold uppercase hover:text-gold-hover border-b border-gold/40 hover:border-gold transition-all pb-0.5"
                >
                  Explore Dishes
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Reservation CTA Banner */}
      <section className="relative py-24 text-center">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: 'url("https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1600&q=80")',
          }}
        />
        <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" />

        <div className="relative max-w-3xl mx-auto px-6 z-10 flex flex-col items-center">
          <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-wider text-gold mb-4">
            Secure Your Table
          </h2>
          <div className="w-20 h-0.5 bg-gold mx-auto mb-6" />
          <p className="text-stone-light text-sm font-light leading-relaxed max-w-lg mb-10">
            Ensure you secure a spot near our water sculpture or live teppanyaki deck. Book your dining experience today.
          </p>
          <Link
            to="/reservation"
            className="px-8 py-3.5 bg-gold text-ebony font-sans text-xs font-semibold tracking-widest uppercase hover:bg-gold-hover transition-all duration-500 shadow-xl"
          >
            Request Reservation
          </Link>
        </div>
      </section>

    </div>
  );
};

export default Home;
