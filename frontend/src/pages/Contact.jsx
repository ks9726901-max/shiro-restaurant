import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send, CheckCircle } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate inquiry submission
    setSuccess(true);
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  return (
    <div className="bg-ebony min-h-screen pt-28 pb-20 text-stone">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        
        {/* Header Title */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[10px] tracking-[0.3em] text-gold uppercase font-semibold">Location & Inquiries</span>
          <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-wider mt-2 mb-4">
            Contact Us
          </h1>
          <div className="w-20 h-0.5 bg-gold mx-auto mb-4" />
          <p className="text-xs font-light text-stone-light">
            Have questions about group reservations, private events, or feedback? Get in touch with our team.
          </p>
        </div>

        {/* Info Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          
          {/* Card 1: Location */}
          <div className="bg-ebony-card border border-stone-border/40 p-8 text-center flex flex-col items-center hover:border-gold/30 transition-all duration-300">
            <div className="w-12 h-12 rounded-full border border-gold/30 flex items-center justify-center mb-6 text-gold bg-gold/5">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-base font-semibold text-white tracking-wider mb-3">Address</h3>
            <p className="text-xs font-light leading-relaxed">
              2nd Floor, UB City Mall, <br />
              Vittal Mallya Road, <br />
              Bengaluru, Karnataka 560001
            </p>
          </div>

          {/* Card 2: Contact */}
          <div className="bg-ebony-card border border-stone-border/40 p-8 text-center flex flex-col items-center hover:border-gold/30 transition-all duration-300">
            <div className="w-12 h-12 rounded-full border border-gold/30 flex items-center justify-center mb-6 text-gold bg-gold/5">
              <Phone className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-base font-semibold text-white tracking-wider mb-3">Phone & Reservations</h3>
            <p className="text-xs font-light leading-relaxed">
              General: +91 80 4173 8888 <br />
              Hotline: +91 80 4173 9999 <br />
              Corporate: events@experienceshiro.com
            </p>
          </div>

          {/* Card 3: Email */}
          <div className="bg-ebony-card border border-stone-border/40 p-8 text-center flex flex-col items-center hover:border-gold/30 transition-all duration-300">
            <div className="w-12 h-12 rounded-full border border-gold/30 flex items-center justify-center mb-6 text-gold bg-gold/5">
              <Mail className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-base font-semibold text-white tracking-wider mb-3">Email Enquiries</h3>
            <p className="text-xs font-light leading-relaxed">
              General: info@experienceshiro.com <br />
              Feedback: feedback@experienceshiro.com <br />
              Careers: jobs@experienceshiro.com
            </p>
          </div>

        </div>

        {/* Split Section: Form & Map */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
          
          {/* Inquiry Form */}
          <div className="bg-ebony-card border border-stone-border/40 p-8">
            <h2 className="font-serif text-xl font-bold tracking-wider text-gold uppercase mb-6">
              Send Message
            </h2>
            
            {success ? (
              <div className="flex flex-col items-center text-center py-12 space-y-4">
                <CheckCircle className="w-14 h-14 text-gold" />
                <h4 className="font-serif text-lg font-bold text-white uppercase tracking-wider">Inquiry Received</h4>
                <p className="text-xs font-light leading-relaxed max-w-sm">
                  Thank you for reaching out. A guest relations officer from Shiro Bengaluru will contact you shortly.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="px-6 py-2 border border-gold text-gold font-sans text-xs uppercase tracking-widest hover:bg-gold hover:text-ebony transition-all duration-300"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-[10px] tracking-widest text-stone uppercase mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. Rahul Sen"
                      className="w-full bg-ebony-light border border-stone-border py-2.5 px-4 text-xs font-light text-white placeholder-stone/60 focus:outline-none focus:border-gold transition-colors duration-300"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-[10px] tracking-widest text-stone uppercase mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="e.g. rahul@example.com"
                      className="w-full bg-ebony-light border border-stone-border py-2.5 px-4 text-xs font-light text-white placeholder-stone/60 focus:outline-none focus:border-gold transition-colors duration-300"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-[10px] tracking-widest text-stone uppercase mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="e.g. Corporate Booking, Private Dinner..."
                    className="w-full bg-ebony-light border border-stone-border py-2.5 px-4 text-xs font-light text-white placeholder-stone/60 focus:outline-none focus:border-gold transition-colors duration-300"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-[10px] tracking-widest text-stone uppercase mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows="4"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Describe your inquiry in detail..."
                    className="w-full bg-ebony-light border border-stone-border py-2.5 px-4 text-xs font-light text-white placeholder-stone/60 focus:outline-none focus:border-gold transition-colors duration-300 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center space-x-2 py-3 bg-gold text-ebony font-sans text-xs font-bold tracking-widest uppercase hover:bg-gold-hover transition-all duration-300 shadow-lg"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>

          {/* Map Placeholder */}
          <div className="bg-ebony-card border border-stone-border/40 p-4 flex flex-col h-full">
            <div className="relative flex-1 bg-ebony-light border border-stone-border flex flex-col items-center justify-center text-center p-8 min-h-[300px]">
              
              {/* Abstract Map Background Graphics */}
              <div className="absolute inset-0 bg-[radial-gradient(#2A2827_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />

              <div className="relative z-10 space-y-4 max-w-sm">
                <MapPin className="w-12 h-12 text-gold mx-auto animate-bounce" />
                <h3 className="font-serif text-lg font-bold text-white uppercase tracking-wider">
                  UB City Mall Location
                </h3>
                <p className="text-xs font-light leading-relaxed">
                  Located in the heart of Bengaluru's central business district. Take the elevator/escalator to the 2nd Floor Piazza at UB City Mall.
                </p>
                <div className="pt-4">
                  <a
                    href="https://maps.google.com/?q=Shiro+UB+City+Bengaluru"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-6 py-2.5 bg-transparent border border-gold text-gold font-sans text-[10px] uppercase tracking-widest hover:bg-gold hover:text-ebony transition-all duration-300 font-bold"
                  >
                    Open In Google Maps
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Contact;
