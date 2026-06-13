import React, { useState } from 'react';
import { Send, CheckCircle } from 'lucide-react';
import GoogleMapSection from '../components/GoogleMapSection';

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
    <div className="bg-ebony min-h-screen pt-32 pb-16 text-stone">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        
        {/* Header Title */}
        <div className="text-center max-w-2xl mx-auto mb-16 animate-fade-in-up">
          <span className="text-[9px] tracking-[0.4em] text-gold uppercase font-medium block mb-3">Location & Inquiries</span>
          <h1 className="text-4xl md:text-5xl font-serif font-light text-white tracking-wide mt-2 mb-4">
            Contact Us
          </h1>
          <div className="w-12 h-[1px] bg-gold/40 mx-auto mb-4" />
          <p className="text-xs font-light text-stone/60 leading-relaxed">
            Have queries regarding corporate bookings, private banquet events, or general feedback? Get in touch with our team.
          </p>
        </div>

        {/* Inquiry Form */}
        <div className="max-w-3xl mx-auto bg-ebony-card border border-stone-border/30 p-8 md:p-12 mb-20 animate-fade-in-up">
          <h2 className="font-serif text-lg font-normal tracking-wider text-white uppercase mb-8 text-center">
            Send Message
          </h2>
          
          {success ? (
            <div className="flex flex-col items-center text-center py-12 space-y-4">
              <CheckCircle className="w-12 h-12 text-gold/80 animate-float-slow" />
              <h4 className="font-serif text-base font-normal text-white uppercase tracking-wider">Inquiry Received</h4>
              <p className="text-xs font-light leading-relaxed text-stone/60 max-w-xs">
                Thank you for reaching out. A guest relations manager from Shiro Bengaluru will contact you shortly.
              </p>
              <button
                onClick={() => setSuccess(false)}
                className="px-6 py-2.5 border border-gold/40 text-gold hover:text-ebony hover:bg-gold font-sans text-xs uppercase tracking-widest transition-all duration-300 cursor-pointer"
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
      </div>

      {/* Interactive Map Section */}
      <GoogleMapSection isLarge={true} />
    </div>
  );
};

export default Contact;
