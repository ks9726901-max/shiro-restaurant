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
    }, 8000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const nextTestimonial = () => {
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="bg-ebony text-stone min-h-screen">
      
      {/* 1. Immersive Hero Section */}
      <header className="relative min-h-screen flex flex-col items-center justify-center pt-32 pb-24 overflow-hidden">
        {/* Background Image with Auto-Zoom Breathing */}
        <div 
          className="absolute inset-0 bg-cover bg-center animate-zoom-slow z-0"
          style={{ 
            backgroundImage: 'url("https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1600&q=80")',
          }}
        />
        {/* Luxury dark slate gradient overlay mask */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-ebony/90 to-ebony z-10" />

        {/* Hero Content Wrapper */}
        <div className="relative max-w-5xl mx-auto px-6 text-center flex flex-col items-center justify-center z-20 animate-fade-in-up">
          <div className="inline-flex items-center space-x-3 mb-8">
            <span className="h-[1px] w-8 bg-gold/40"></span>
            <span className="text-[9px] tracking-[0.4em] text-gold uppercase font-medium">UB City, Bengaluru</span>
            <span className="h-[1px] w-8 bg-gold/40"></span>
          </div>

          <h1 className="font-serif text-5xl md:text-8xl font-light tracking-wide leading-[1.1] text-ivory mb-8">
            An Asian Castle <br />
            <span className="text-serif-italic text-gold font-normal">Of Culinary Art</span>
          </h1>

          <p className="text-stone/70 font-light text-sm md:text-base max-w-xl leading-relaxed mb-12">
            Dine beneath soaring bamboo ceilings flanked by towering Balinese stone sculptures, cascading waterfalls, and tranquil lotus ponds.
          </p>

          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
            <Link
              to="/reservation"
              className="px-8 py-4 bg-gold text-ebony font-sans text-[10px] tracking-widest uppercase hover:bg-gold-hover hover:-translate-y-0.5 transition-all duration-300 shadow-md font-medium"
            >
              Reserve A Table
            </Link>
            <Link
              to="/menu"
              className="px-8 py-4 bg-transparent border border-stone-border text-stone hover:text-gold hover:border-gold font-sans text-[10px] tracking-widest uppercase transition-all duration-300"
            >
              Explore Menu
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div 
          onClick={() => {
            const nextSec = document.getElementById('experience');
            if (nextSec) {
              nextSec.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          className="absolute bottom-10 z-20 flex flex-col items-center cursor-pointer group"
        >
          <span className="text-[8px] tracking-[0.4em] text-stone/50 group-hover:text-gold transition-colors duration-300 uppercase mb-2">Scroll to explore</span>
          <ChevronDown className="w-4 h-4 text-gold/60 group-hover:text-gold group-hover:translate-y-0.5 transition-all duration-300" />
        </div>
      </header>

      {/* 2. Highlights Section (Editorial Staggered Layout) */}
      <section id="experience" className="py-24 max-w-7xl mx-auto px-6 lg:px-12 border-b border-stone-border/30">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-20 items-end">
          <div className="lg:col-span-6">
            <span className="text-[9px] tracking-[0.3em] text-gold uppercase font-medium block mb-3">The Architecture of Dining</span>
            <h2 className="text-3xl md:text-5xl font-serif font-light text-white tracking-wide leading-tight">
              A Temple of Sensory Splendour
            </h2>
          </div>
          <div className="lg:col-span-6 lg:border-l lg:border-stone-border/40 lg:pl-10 pb-1">
            <p className="text-xs md:text-sm font-light leading-relaxed text-stone/60">
              Shiro is more than a restaurant; it is a meticulously sculpted sanctuary. Every space is arranged to evoke mystery, scale, and organic harmony, creating an atmosphere that is both theatrical and deeply serene.
            </p>
          </div>
        </div>

        {/* Staggered features grid with thin lines resembling joinery */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
          {highlights.map((item, idx) => (
            <div 
              key={idx} 
              className={`flex flex-col space-y-6 group ${
                idx % 2 === 1 ? 'md:translate-y-12' : ''
              }`}
            >
              {/* Image with Asymmetric border offset frame */}
              <div className="relative overflow-hidden aspect-[4/3] bg-ebony-card border border-stone-border/30 p-2">
                <div className="overflow-hidden w-full h-full">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover filter brightness-[0.7] group-hover:brightness-95 group-hover:scale-105 transition-all duration-700"
                  />
                </div>
                {/* Thin gold joinery corner bracket */}
                <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-gold/40 group-hover:border-gold transition-colors duration-300 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-gold/40 group-hover:border-gold transition-colors duration-300 pointer-events-none" />
              </div>

              {/* Text metadata */}
              <div className="flex flex-col space-y-3 pt-2">
                <div className="flex items-center space-x-3 text-gold">
                  <item.icon className="w-4 h-4 stroke-[1.5]" />
                  <h3 className="font-serif text-lg font-normal tracking-wide text-stone/90 group-hover:text-gold transition-colors duration-300">
                    {item.title}
                  </h3>
                </div>
                <p className="text-xs font-light leading-relaxed text-stone/60 pr-4">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Ambiance Feature (Bespoke Offset Frame & Collage) */}
      <section className="py-24 bg-ebony-card border-b border-stone-border/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Asymmetric offset image column */}
          <div className="lg:col-span-6 relative">
            <div className="relative border border-stone-border/40 p-4 bg-ebony/40">
              <img 
                src="https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=800&q=80" 
                alt="Shiro Balinese Sculpture & Lotus Ponds" 
                className="w-full h-[450px] object-cover filter brightness-[0.75] transition-all duration-700 hover:brightness-[0.95]"
              />
            </div>
            
            {/* Elegant overlapping accent line */}
            <div className="absolute -top-4 -left-4 w-24 h-24 border-t border-l border-gold/40 pointer-events-none" />
            <div className="absolute -bottom-4 -right-4 w-24 h-24 border-b border-r border-gold/40 pointer-events-none" />
          </div>

          {/* Text column with thin grid statistics */}
          <div className="lg:col-span-6 flex flex-col space-y-8 lg:pl-6">
            <div>
              <span className="text-[9px] tracking-[0.3em] text-gold uppercase font-medium block mb-3">Immersive Aesthetics</span>
              <h2 className="text-3xl md:text-5xl font-serif font-light text-white tracking-wide leading-tight">
                An Immersive Zen Sanctuary
              </h2>
            </div>
            
            <p className="text-xs md:text-sm font-light leading-relaxed text-stone/60">
              Designed by award-winning visionaries, Shiro Bangalore marries towering Balinese temple craftsmanship with refined Japanese minimalism. The dining hall is anchored by a magnificent 25-foot stone consort sculpture, cascading crystal water into lotuses winding past custom seating booths.
            </p>
            
            <p className="text-xs md:text-sm font-light leading-relaxed text-stone/60">
              By day, soft natural light filters through majestic teardrop lanterns, casting delicate shadows on hand-hewn ochre columns. By night, Shiro transforms into a moody, high-energy lounge featuring detailed amber lighting, establishing Bengaluru’s premier destination for celebrations.
            </p>

            {/* Antique gold stats display */}
            <div className="grid grid-cols-3 border-t border-b border-stone-border/40 py-6 my-2 text-center">
              <div className="border-r border-stone-border/40">
                <span className="block font-serif text-2xl md:text-3xl text-gold font-normal">50 FT</span>
                <span className="text-[8px] tracking-[0.25em] text-stone/40 uppercase mt-1 block">Ceilings</span>
              </div>
              <div className="border-r border-stone-border/40">
                <span className="block font-serif text-2xl md:text-3xl text-gold font-normal">25 FT</span>
                <span className="text-[8px] tracking-[0.25em] text-stone/40 uppercase mt-1 block">Waterfall</span>
              </div>
              <div>
                <span className="block font-serif text-2xl md:text-3xl text-gold font-normal">4</span>
                <span className="text-[8px] tracking-[0.25em] text-stone/40 uppercase mt-1 block">Lotus Ponds</span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                to="/gallery"
                className="inline-block px-7 py-3 border border-gold/40 text-gold hover:text-ebony hover:bg-gold transition-all duration-500 text-[10px] tracking-widest uppercase"
              >
                Explore Gallery
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Chef's Signature Dishes (Editorial Showcase) */}
      <section className="py-24 max-w-7xl mx-auto px-6 lg:px-12 border-b border-stone-border/30">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <span className="text-[9px] tracking-[0.3em] text-gold uppercase font-medium block mb-3">Culinary Masterpieces</span>
          <h2 className="text-3xl md:text-4xl font-serif font-light text-white tracking-wide">
            Chef's Signature Creations
          </h2>
          <div className="w-12 h-[1px] bg-gold/40 mx-auto mt-4" />
        </div>

        {/* Asymmetrical presentation: Left featured list, right main image portrait */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Left menu list with dotted layout */}
          <div className="lg:col-span-7 space-y-12">
            {signatureDishes.map((dish, idx) => (
              <div key={idx} className="group flex flex-col space-y-2">
                <div className="flex justify-between items-baseline gap-4">
                  <span className="text-gold font-serif text-lg font-normal group-hover:text-gold-hover transition-colors duration-300">
                    {dish.name}
                  </span>
                  {/* Fine connecting line */}
                  <span className="flex-grow border-b border-dashed border-stone-border/60 mx-2" />
                  <span className="text-gold font-mono text-sm whitespace-nowrap">
                    {dish.price}
                  </span>
                </div>
                
                <div className="flex justify-between items-start">
                  <p className="text-xs font-light text-stone/60 leading-relaxed pr-6 max-w-xl">
                    {dish.description}
                  </p>
                  <span className="text-[8px] tracking-widest uppercase text-gold/60 border border-gold/20 px-2 py-0.5 whitespace-nowrap shrink-0 mt-1">
                    {dish.badge}
                  </span>
                </div>
              </div>
            ))}
            
            <div className="pt-4">
              <Link 
                to="/menu" 
                className="inline-block px-7 py-3 bg-gold text-ebony hover:bg-gold-hover transition-all duration-300 text-[10px] tracking-widest uppercase font-medium"
              >
                View Full Menu
              </Link>
            </div>
          </div>

          {/* Right large offset decorative frame with first dish portrait */}
          <div className="lg:col-span-5 relative lg:pl-10">
            <div className="border border-stone-border/40 p-3 bg-ebony-card">
              <img 
                src="https://images.unsplash.com/photo-1611143669185-af224c5e3252?auto=format&fit=crop&w=600&q=80" 
                alt="Signature Dish Crafting" 
                className="w-full h-[380px] object-cover filter brightness-[0.8] hover:brightness-[0.95] transition-all duration-500"
              />
            </div>
            <div className="absolute top-0 right-0 w-6 h-6 border-t border-r border-gold/40 pointer-events-none" />
            <div className="absolute bottom-0 left-10 w-6 h-6 border-b border-l border-gold/40 pointer-events-none" />
          </div>

        </div>
      </section>

      {/* 5. Menu Categories grid (Basalt minimal banner) */}
      <section className="py-24 bg-ebony-card border-b border-stone-border/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <span className="text-[9px] tracking-[0.3em] text-gold uppercase font-medium block mb-3">Gastronomy Categories</span>
            <h2 className="text-3xl md:text-4xl font-serif font-light text-white tracking-wide">
              Explore Our Menu
            </h2>
            <div className="w-12 h-[1px] bg-gold/40 mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((cat, idx) => (
              <div 
                key={idx} 
                className="bg-ebony border border-stone-border/30 hover:border-gold/30 transition-all duration-500 flex flex-col group overflow-hidden"
              >
                <div className="overflow-hidden aspect-[4/3] border-b border-stone-border/30">
                  <img 
                    src={cat.image} 
                    alt={cat.name} 
                    className="w-full h-full object-cover filter brightness-[0.7] group-hover:brightness-95 group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="p-8 text-center flex-1 flex flex-col justify-between items-center">
                  <div>
                    <h3 className="font-serif text-base font-normal tracking-wider text-stone/90 mb-3 group-hover:text-gold transition-colors duration-300">
                      {cat.name}
                    </h3>
                    <p className="text-xs font-light text-stone/60 leading-relaxed mb-6">
                      {cat.description}
                    </p>
                  </div>
                  <Link 
                    to="/menu" 
                    className="text-[9px] tracking-widest uppercase text-gold hover:text-gold-hover border-b border-gold/20 hover:border-gold transition-all pb-1 font-medium"
                  >
                    Discover Dishes
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Luxury Testimonials (Clean layout) */}
      <section className="py-24 max-w-5xl mx-auto px-6 text-center">
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-stone-border/50 text-gold/60 mb-6">
          <Quote className="w-4 h-4" />
        </div>
        
        <h2 className="text-xl md:text-2xl font-serif italic text-white/90 tracking-wide mb-12">
          Acclaim & Accolades
        </h2>

        {/* Testimonial slider view */}
        <div className="relative min-h-[140px] flex flex-col justify-center max-w-3xl mx-auto px-6">
          <p className="font-serif text-base md:text-lg italic text-stone/70 leading-relaxed mb-6 transition-all duration-500">
            "{testimonials[activeTestimonial].quote}"
          </p>
          <div className="text-[10px] font-medium tracking-[0.2em] uppercase text-gold">
            {testimonials[activeTestimonial].source}
          </div>
          <div className="text-[8px] tracking-[0.2em] text-stone/40 uppercase mt-1">
            {testimonials[activeTestimonial].rating}
          </div>
        </div>

        {/* Testimonial Controls */}
        <div className="flex justify-center items-center space-x-6 mt-10">
          <button 
            onClick={prevTestimonial}
            className="w-8 h-8 rounded-none border border-stone-border/60 hover:border-gold text-stone/60 hover:text-gold flex items-center justify-center transition-all duration-300 cursor-pointer"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <span className="text-[10px] font-mono tracking-widest text-stone/40">
            0{activeTestimonial + 1} / 0{testimonials.length}
          </span>
          <button 
            onClick={nextTestimonial}
            className="w-8 h-8 rounded-none border border-stone-border/60 hover:border-gold text-stone/60 hover:text-gold flex items-center justify-center transition-all duration-300 cursor-pointer"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* 7. Reservation CTA Banner */}
      <section className="relative py-28 px-6 text-center">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: 'url("https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1600&q=80")',
          }}
        />
        <div className="absolute inset-0 bg-ebony/95" />

        {/* Minimal border frame container */}
        <div className="relative max-w-3xl mx-auto z-10 border border-stone-border/30 p-1 bg-ebony-card/60 backdrop-blur-md">
          <div className="border border-stone-border/20 p-10 md:p-14 flex flex-col items-center">
            <Award className="w-6 h-6 text-gold/60 mb-6" />
            
            <h2 className="text-2xl md:text-3xl font-serif font-light text-white uppercase tracking-wider mb-4">
              Secure Your Reservation
            </h2>
            <div className="w-10 h-[1px] bg-gold/40 mx-auto mb-6" />
            
            <p className="text-stone/60 text-xs font-light leading-relaxed max-w-md mb-10">
              Ensure you secure a premium spot near our cascading water sculpture or book at the live teppanyaki deck. Request your table online today.
            </p>
            <Link
              to="/reservation"
              className="px-8 py-4 bg-gold text-ebony font-sans text-[10px] tracking-widest uppercase hover:bg-gold-hover transition-all duration-300 font-medium"
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

