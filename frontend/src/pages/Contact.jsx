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
    <div className="bg-ebony min-h-screen pt-32 pb-24 text-stone">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        
        {/* Header Title */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <span className="text-[9px] tracking-[0.4em] text-gold uppercase font-medium block mb-3">Location & Inquiries</span>
          <h1 className="text-4xl md:text-5xl font-serif font-light text-white tracking-wide mt-2 mb-4">
            Contact Us
          </h1>
          <div className="w-12 h-[1px] bg-gold/40 mx-auto mb-4" />
          <p className="text-xs font-light text-stone/60 leading-relaxed">
            Have queries regarding corporate bookings, private banquet events, or general feedback? Get in touch with our team.
          </p>
        </div>

        {/* Info Cards Grid (Restyled as clean text blocks with lines) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20 border-b border-stone-border/30 pb-16">
          
          {/* Card 1: Location */}
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-3 text-gold">
              <MapPin className="w-4 h-4 stroke-[1.5]" />
              <h3 className="font-serif text-sm font-normal uppercase tracking-wider text-stone/90">Address</h3>
            </div>
            <p className="text-xs font-light leading-relaxed text-stone/60 pl-7">
              2nd Floor, UB City Mall, <br />
              Vittal Mallya Road, <br />
              Bengaluru, Karnataka 560001
            </p>
          </div>

          {/* Card 2: Contact */}
          <div className="flex flex-col space-y-4 md:border-l md:border-r md:border-stone-border/30 md:px-10">
            <div className="flex items-center space-x-3 text-gold">
              <Phone className="w-4 h-4 stroke-[1.5]" />
              <h3 className="font-serif text-sm font-normal uppercase tracking-wider text-stone/90">General & Bookings</h3>
            </div>
            <p className="text-xs font-light leading-relaxed text-stone/60 pl-7">
              Host Desk: +91 80 4173 8888 <br />
              Hotline: +91 80 4173 9999 <br />
              Events: events@experienceshiro.com
            </p>
          </div>

          {/* Card 3: Email */}
          <div className="flex flex-col space-y-4 md:pl-10">
            <div className="flex items-center space-x-3 text-gold">
              <Mail className="w-4 h-4 stroke-[1.5]" />
              <h3 className="font-serif text-sm font-normal uppercase tracking-wider text-stone/90">Email Inquiries</h3>
            </div>
            <p className="text-xs font-light leading-relaxed text-stone/60 pl-7">
              Enquiries: info@experienceshiro.com <br />
              Feedback: feedback@experienceshiro.com <br />
              Careers: jobs@experienceshiro.com
            </p>
          </div>

        </div>

        {/* Split Section: Form & Map */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-stretch">
          
          {/* Inquiry Form */}
          <div className="lg:col-span-7 bg-ebony-card border border-stone-border/30 p-8 md:p-10">
            <h2 className="font-serif text-lg font-normal tracking-wider text-white uppercase mb-8">
              Send Message
            </h2>
            
            {success ? (
              <div className="flex flex-col items-center text-center py-12 space-y-4">
                <CheckCircle className="w-12 h-12 text-gold/80" />
                <h4 className="font-serif text-base font-normal text-white uppercase tracking-wider">Inquiry Received</h4>
                <p className="text-xs font-light leading-relaxed text-stone/60 max-w-xs">
                  Thank you for reaching out. A guest relations manager from Shiro Bengaluru will contact you shortly.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="px-6 py-2.5 border border-gold/40 text-gold hover:text-ebony hover:bg-gold font-sans text-xs uppercase tracking-widest transition-all duration-300"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div>
                    <label htmlFor="name" className="block text-[9px] tracking-widest text-stone/50 uppercase mb-1">
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
                      className="w-full bg-transparent border-b border-stone-border/60 py-2 text-xs font-light text-white placeholder-stone/30 focus:outline-none focus:border-gold transition-colors duration-300 rounded-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-[9px] tracking-widest text-stone/50 uppercase mb-1">
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
                      className="w-full bg-transparent border-b border-stone-border/60 py-2 text-xs font-light text-white placeholder-stone/30 focus:outline-none focus:border-gold transition-colors duration-300 rounded-none"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-[9px] tracking-widest text-stone/50 uppercase mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="e.g. Corporate Event Booking, Private Dining..."
                    className="w-full bg-transparent border-b border-stone-border/60 py-2 text-xs font-light text-white placeholder-stone/30 focus:outline-none focus:border-gold transition-colors duration-300 rounded-none"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-[9px] tracking-widest text-stone/50 uppercase mb-1">
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
                    className="w-full bg-transparent border-b border-stone-border/60 py-2 text-xs font-light text-white placeholder-stone/30 focus:outline-none focus:border-gold transition-colors duration-300 resize-none rounded-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center space-x-2 py-4 bg-gold text-ebony font-sans text-xs font-medium tracking-widest uppercase hover:bg-gold-hover transition-all duration-300 shadow-md cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>

          {/* Map Placeholder */}
          <div className="lg:col-span-5 bg-ebony-card border border-stone-border/30 p-8 flex flex-col justify-center relative overflow-hidden">
            {/* Fine joinery visual detail */}
            <div className="absolute top-0 left-0 w-6 h-6 border-t border-l border-gold/30" />
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-gold/30" />
            
            <div className="relative z-10 space-y-5 text-center px-4 py-8">
              <MapPin className="w-10 h-10 text-gold/60 mx-auto" />
              <h3 className="font-serif text-lg font-normal text-white uppercase tracking-wider">
                UB City Mall Location
              </h3>
              <p className="text-xs font-light leading-relaxed text-stone/60">
                Located in the heart of Bengaluru's central business district. Take the lift or escalator to the 2nd Floor Piazza at UB City Mall.
              </p>
              <div className="pt-4">
                <a
                  href="https://maps.google.com/?q=Shiro+UB+City+Bengaluru"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-6 py-2.5 border border-gold/40 text-gold hover:text-ebony hover:bg-gold transition-all duration-300 text-[9px] tracking-widest uppercase font-medium"
                >
                  Open In Google Maps
                </a>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Contact;
