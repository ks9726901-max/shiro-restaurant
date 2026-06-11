import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Compass, Sparkles, Flame, Wine, ChevronDown, ChevronLeft, ChevronRight, Quote, Award } from 'lucide-react';

const Home = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const highlights = [
    {
      icon: Compass,
      title: 'Zen Castle Grandeur',
      description: 'Step into an Asian fortress detailed with yellow ochre stone, teardrop screens, and waterbodies filled with lotuses.',
      image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80'
    },
    {
      icon: Sparkles,
      title: 'Pan-Asian Masterclass',
      description: 'Savor a meticulous selection of Japanese Sushi, Cantonese Dim Sum, and Korean specialties crafted by master chefs.',
      image: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?auto=format&fit=crop&w=800&q=80'
    },
    {
      icon: Flame,
      title: 'Teppanyaki Theatre',
      description: 'Dine in our tropical outdoor terrace and witness the theatrical artistry of live teppanyaki fire grilling.',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80'
    },
    {
      icon: Wine,
      title: 'Signature Mixology',
      description: 'Immerse in bespoke botanical craft cocktails flavored with sake, yuzu, fresh berry shrubs, and lemongrass.',
      image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80'
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

  const signatureDishes = [
    {
      name: "Truffle Lobster Maki",
      description: "Butter-poached lobster, black truffle caviar, crunchy tempura bits, finished with 24k gold leaf.",
      price: "₹1,850",
      image: "https://images.unsplash.com/photo-1611143669185-af224c5e3252?auto=format&fit=crop&w=600&q=80",
      badge: "Chef's Special"
    },
    {
      name: "Crispy Peking Duck",
      description: "Traditional 24-hour slow roasted duck, hand-rolled steamed pancakes, fresh scallions, signature sweet plum sauce.",
      price: "₹2,200",
      image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80",
      badge: "Signature"
    },
    {
      name: "Sake Flambéed Teppanyaki",
      description: "Jumbo tiger prawns and premium beef medallions sizzled with sake and served with house garlic butter sauce.",
      price: "₹2,450",
      image: "https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=600&q=80",
      badge: "Teppanyaki Live"
    }
  ];

  const testimonials = [
    {
      quote: "Shiro remains the crown jewel of Bengaluru's fine dining. The sheer scale of the Balinese carvings coupled with masterclass sushi is unmatched.",
      source: "Condé Nast Traveler",
      rating: "★★★★★"
    },
    {
      quote: "A theatrical dining experience. The live teppanyaki counter is a choreographic fire show, and the botanical cocktails are true liquid alchemy.",
      source: "Times Food Guide",
      rating: "Best Luxury Pan-Asian Lounge"
    },
    {
      quote: "The clever marriage of soaring 50-foot ceilings with zen ponds creates a rare temple-like sanctuary where every meal feels like a grand event.",
      source: "Architectural Digest",
      rating: "Aesthetic Excellence Award"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextTestimonial = () => {
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="bg-ebony overflow-hidden pt-20">
      
      {/* 1. Immersive Hero Section */}
      <header className="relative min-h-[92vh] flex items-center justify-center">
        {/* Background Image with Auto-Zoom Breathing */}
        <div 
          className="absolute inset-0 bg-cover bg-center animate-zoom-slow"
          style={{ 
            backgroundImage: 'url("https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1600&q=80")',
          }}
        />
        {/* Luxury dark gradient overlay mask */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-ebony/75 to-ebony" />

        {/* Hero Content */}
        <div className="relative max-w-4xl mx-auto px-6 text-center flex flex-col items-center z-10 animate-fade-in-up">
          <div className="inline-flex items-center space-x-2 border border-gold/45 px-4 py-1.5 bg-gold/5 mb-8 rounded-full shadow-[0_0_15px_rgba(197,168,128,0.15)]">
            <span className="text-[10px] tracking-[0.35em] text-gold uppercase font-semibold">UB City, Bengaluru</span>
          </div>

          <h1 className="font-serif text-5xl md:text-7xl font-bold tracking-wider leading-tight text-white mb-6">
            An Asian Castle <br />
            <span className="gold-gradient-text text-glow">Of Culinary Art</span>
          </h1>

          <p className="text-stone-light font-light text-base md:text-lg max-w-2xl leading-relaxed mb-10">
            Dine beneath 50-foot bamboo ceilings flanked by towering Balinese stone sculptures, cascading waterfalls, and tranquil lotus ponds.
          </p>

          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
            <Link
              to="/reservation"
              className="px-8 py-4 bg-gold text-ebony font-sans text-xs font-semibold tracking-widest uppercase hover:bg-gold-hover hover:scale-105 transition-all duration-300 shadow-[0_4px_20px_rgba(197,168,128,0.3)]"
            >
              Reserve A Table
            </Link>
            <Link
              to="/menu"
              className="px-8 py-4 bg-transparent border border-stone-light/45 text-stone-light font-sans text-xs font-semibold tracking-widest uppercase hover:border-gold hover:text-gold hover:bg-gold/5 transition-all duration-300"
            >
              Explore Menu
            </Link>
          </div>
        </div>

        {/* Premium Scroll Indicator */}
        <div 
          onClick={() => window.scrollTo({ top: window.innerHeight * 0.9, behavior: 'smooth' })}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center animate-float-slow cursor-pointer group"
        >
          <span className="text-[9px] tracking-[0.4em] text-stone-light group-hover:text-gold transition-colors duration-300 uppercase mb-2">Scroll To Discover</span>
          <div className="w-8 h-8 rounded-full border border-gold/30 flex items-center justify-center bg-ebony/60 backdrop-blur-sm animate-pulse-gold group-hover:border-gold transition-colors duration-300">
            <ChevronDown className="w-4 h-4 text-gold" />
          </div>
        </div>

        {/* Ambient Bottom Gradient */}
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-ebony to-transparent" />
      </header>

      {/* 2. Highlights Grid */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-28 border-b border-stone-border/30">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <span className="text-[10px] tracking-[0.3em] text-gold uppercase font-bold block mb-3">The Shiro Philosophy</span>
          <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-wider mb-4">
            The Shiro Experience
          </h2>
          <div className="w-24 h-0.5 bg-gold mx-auto mb-6" />
          <p className="text-sm font-light leading-relaxed text-stone-light">
            Every corner of Shiro Bengaluru is meticulously crafted to invoke tranquility, drama, and luxury.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {highlights.map((item, idx) => (
            <div 
              key={idx} 
              className="relative h-96 group overflow-hidden border border-stone-border/40 bg-ebony-card flex flex-col justify-end p-8 transition-all duration-500 hover:border-gold/50 hover:shadow-[0_15px_35px_rgba(197,168,128,0.2)] hover:-translate-y-2"
            >
              {/* Background Image with Zoom */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110 brightness-[0.35] group-hover:brightness-[0.45]"
                style={{ backgroundImage: `url(${item.image})` }}
              />
              
              {/* Gradient Mask Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-ebony via-ebony/60 to-transparent opacity-95 transition-opacity duration-500 group-hover:opacity-100" />

              {/* Content Container */}
              <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                {/* Floating Glass Icon */}
                <div className="w-12 h-12 rounded-full border border-gold/30 flex items-center justify-center bg-ebony/55 backdrop-blur-md group-hover:bg-gold group-hover:border-gold group-hover:text-ebony transition-all duration-500 text-gold shadow-lg">
                  <item.icon className="w-5 h-5 transition-transform duration-500 group-hover:rotate-12" />
                </div>
                
                <h3 className="font-serif text-lg font-bold tracking-wider text-gold-hover group-hover:text-gold transition-colors duration-300">
                  {item.title}
                </h3>
                
                <p className="text-xs font-light leading-relaxed text-stone-light group-hover:text-white transition-colors duration-300">
                  {item.description}
                </p>
              </div>

              {/* Top Accent Gold Border Line */}
              <div className="absolute top-0 left-0 w-0 h-0.5 bg-gold transition-all duration-500 group-hover:w-full" />
            </div>
          ))}
        </div>
      </section>

      {/* 3. Ambiance Feature (Split Layout with Stats) */}
      <section className="bg-ebony-card py-28 border-b border-stone-border/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <div className="relative">
            {/* Main Picture */}
            <div className="relative border border-stone-border p-4 bg-ebony-light">
              <img 
                src="https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=800&q=80" 
                alt="Shiro Balinese Sculpture & Lotus Ponds" 
                className="w-full h-[480px] object-cover filter brightness-90 border border-stone-border transition-all duration-700 hover:brightness-100"
              />
            </div>
            
            {/* Absolute Decorative Frame Corner Accents */}
            <div className="hidden sm:block absolute -top-3 -left-3 w-20 h-20 border-t border-l border-gold/60 transition-all duration-500 hover:-top-5 hover:-left-5" />
            <div className="hidden sm:block absolute -bottom-3 -right-3 w-20 h-20 border-b border-r border-gold/60 transition-all duration-500 hover:-bottom-5 hover:-right-5" />
          </div>

          <div className="flex flex-col space-y-6">
            <span className="text-[10px] tracking-[0.3em] text-gold uppercase font-semibold">The Aesthetics</span>
            <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-wider">
              An Immersive Zen Castle
            </h2>
            <div className="w-20 h-0.5 bg-gold mb-2" />
            
            <p className="text-sm font-light leading-relaxed text-stone-light">
              Designed by award-winning architects, Shiro Bengaluru marries towering Balinese stone temple craftsmanship with clean Japanese minimalism. The focal point of the dining hall is a magnificent 25-foot stone consort sculpture, cascading fresh mountain-like water into running lotus ponds that wind around the tables.
            </p>
            
            <p className="text-sm font-light leading-relaxed text-stone-light">
              By day, soft natural light filters through majestic teardrop lanterns, casting delicate shadows on yellow ochre stone columns. By night, Shiro transforms into a high-energy lounge featuring ambient amber lighting, making it the ultimate destination for celebrations.
            </p>

            {/* Architectural Stats Block */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-stone-border/30">
              <div className="text-center p-3 bg-ebony/40 border border-stone-border/50 rounded hover:border-gold/30 transition-all duration-300">
                <span className="block font-serif text-2xl md:text-3xl text-gold font-bold">50 FT</span>
                <span className="text-[9px] tracking-widest text-stone uppercase mt-1 block">Ceilings</span>
              </div>
              <div className="text-center p-3 bg-ebony/40 border border-stone-border/50 rounded hover:border-gold/30 transition-all duration-300">
                <span className="block font-serif text-2xl md:text-3xl text-gold font-bold">25 FT</span>
                <span className="text-[9px] tracking-widest text-stone uppercase mt-1 block">Waterfall</span>
              </div>
              <div className="text-center p-3 bg-ebony/40 border border-stone-border/50 rounded hover:border-gold/30 transition-all duration-300">
                <span className="block font-serif text-2xl md:text-3xl text-gold font-bold">4</span>
                <span className="text-[9px] tracking-widest text-stone uppercase mt-1 block">Lotus Ponds</span>
              </div>
            </div>

            <div className="pt-4">
              <Link
                to="/gallery"
                className="inline-block px-7 py-3 bg-transparent border border-gold text-gold font-sans text-xs uppercase tracking-widest hover:bg-gold hover:text-ebony transition-all duration-500 font-semibold"
              >
                View Gallery
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Chef's Signature Dishes Showcase */}
      <section className="bg-ebony py-28 border-b border-stone-border/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <span className="text-[10px] tracking-[0.3em] text-gold uppercase font-bold block mb-3">Culinary Masterpieces</span>
            <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-wider mb-4">
              Chef's Signature Creations
            </h2>
            <div className="w-24 h-0.5 bg-gold mx-auto mb-6" />
            <p className="text-sm font-light leading-relaxed text-stone-light">
              Indulge in a curated collection of our most celebrated dishes, crafted with premium ingredients and spectacular visual presentation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {signatureDishes.map((dish, idx) => (
              <div 
                key={idx} 
                className="bg-ebony-card border border-stone-border/40 group overflow-hidden flex flex-col justify-between hover:border-gold/30 transition-all duration-500"
              >
                <div className="relative overflow-hidden h-72 border-b border-stone-border">
                  <img 
                    src={dish.image} 
                    alt={dish.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-95"
                  />
                  {/* Badge */}
                  <span className="absolute top-4 left-4 bg-gold/90 backdrop-blur-sm text-ebony text-[9px] tracking-widest uppercase font-bold px-3 py-1">
                    {dish.badge}
                  </span>
                </div>
                
                <div className="p-8 flex-grow flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-baseline mb-4">
                      <h3 className="font-serif text-lg font-bold tracking-wide text-gold group-hover:text-gold-hover transition-colors duration-300">
                        {dish.name}
                      </h3>
                      <span className="text-gold font-sans font-medium text-sm ml-2">
                        {dish.price}
                      </span>
                    </div>
                    <p className="text-xs font-light text-stone-light leading-relaxed mb-6">
                      {dish.description}
                    </p>
                  </div>
                  
                  <Link 
                    to="/menu" 
                    className="inline-flex items-center text-xs tracking-widest font-semibold text-gold uppercase hover:text-gold-hover border-b border-gold/25 hover:border-gold transition-all pb-0.5 self-start"
                  >
                    View in Menu
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Menu Categories grid */}
      <section className="bg-ebony-card py-28 border-b border-stone-border/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <span className="text-[10px] tracking-[0.3em] text-gold uppercase font-bold block mb-3">Gastronomy Categories</span>
            <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-wider mb-4">
              Explore Our Menu
            </h2>
            <div className="w-24 h-0.5 bg-gold mx-auto mb-6" />
            <p className="text-sm font-light leading-relaxed text-stone-light">
              From fresh coastal raw catches to high-heat teppanyaki theatre, experience the diversity of Pan-Asian dining.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((cat, idx) => (
              <div key={idx} className="bg-ebony border border-stone-border/40 group overflow-hidden hover:border-gold/30 transition-all duration-500">
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
                  <p className="text-xs font-light text-stone-light mb-6">
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
        </div>
      </section>

      {/* 6. Luxury Testimonials Slider */}
      <section className="bg-ebony py-28 border-b border-stone-border/30">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gold/10 text-gold mb-6">
            <Quote className="w-5 h-5" />
          </div>
          
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-white tracking-wider mb-2">
            Acclaim & Accolades
          </h2>
          <div className="w-16 h-0.5 bg-gold mx-auto mb-12" />

          {/* Testimonial Card */}
          <div className="relative min-h-[180px] flex flex-col justify-center px-4 md:px-12">
            <p className="font-serif text-lg md:text-xl italic text-stone-light leading-relaxed mb-6 transition-all duration-500">
              "{testimonials[activeTestimonial].quote}"
            </p>
            <div className="text-sm font-semibold tracking-widest uppercase text-gold">
              {testimonials[activeTestimonial].source}
            </div>
            <div className="text-[10px] tracking-wider text-stone uppercase mt-1">
              {testimonials[activeTestimonial].rating}
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center items-center space-x-6 mt-8">
            <button 
              onClick={prevTestimonial}
              className="w-10 h-10 rounded-full border border-stone-border hover:border-gold text-stone hover:text-gold flex items-center justify-center transition-all duration-300"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-sans tracking-widest text-stone">
              0{activeTestimonial + 1} / 0{testimonials.length}
            </span>
            <button 
              onClick={nextTestimonial}
              className="w-10 h-10 rounded-full border border-stone-border hover:border-gold text-stone hover:text-gold flex items-center justify-center transition-all duration-300"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 7. Reservation CTA Banner */}
      <section className="relative py-32 px-6 text-center">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: 'url("https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1600&q=80")',
          }}
        />
        <div className="absolute inset-0 bg-black/95" />

        {/* Glassmorphic Container Card */}
        <div className="relative max-w-4xl mx-auto z-10 border border-gold/15 p-1 rounded-2xl bg-gradient-to-br from-gold/5 to-transparent">
          <div className="glassmorphism p-12 md:p-16 rounded-2xl flex flex-col items-center">
            <Award className="w-8 h-8 text-gold mb-6 animate-float-slow" />
            <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-wider text-gold mb-4">
              Secure Your Table
            </h2>
            <div className="w-20 h-0.5 bg-gold mx-auto mb-6" />
            <p className="text-stone-light text-sm font-light leading-relaxed max-w-lg mb-10">
              Ensure you secure a premium spot near our water sculpture or booking at the live teppanyaki deck. Reserve your luxury dining experience today.
            </p>
            <Link
              to="/reservation"
              className="px-8 py-4 bg-gold text-ebony font-sans text-xs font-semibold tracking-widest uppercase hover:bg-gold-hover hover:scale-105 transition-all duration-300 shadow-[0_4px_25px_rgba(197,168,128,0.35)]"
            >
              Request Reservation
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;

