const Contact = () => {
  return (
    <section className="py-16 bg-bg-main transition-colors">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-12">Get In Touch</h2>
        
        <div className="grid md:grid-cols-2 gap-16">
          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold mb-2">Visit Our Campus</h3>
              <p className="text-text-muted">We are located in the heart of the tech district. Come visit us for a tour!</p>
            </div>

            <div className="space-y-6">
              <ContactInfo title="Address" detail="5 Kilo, Addis Ababa, Ethiopia" />
              <ContactInfo title="Email" detail="admissions@ignite.edu" />
              <ContactInfo title="Phone" detail="+251 911-555-0199" />
            </div>
          </div>

          {/* Contact Form */}
          <form className="bg-bg-card p-8 rounded-2xl shadow-sm border border-border-dim">
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <label className="font-semibold">Full Name</label>
                <input 
                  type="text" 
                  placeholder="Abebe Kebede"
                  className="p-3 rounded-lg bg-bg-main border border-border-dim focus:ring-2 focus:ring-brand outline-none"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-semibold">Email Address</label>
                <input 
                  type="email" 
                  placeholder="abebe@example.com"
                  className="p-3 rounded-lg bg-bg-main border border-border-dim focus:ring-2 focus:ring-brand outline-none"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-semibold">Message</label>
                <textarea 
                  rows="4"
                  placeholder="How can we help you?"
                  className="p-3 rounded-lg bg-bg-main border border-border-dim focus:ring-2 focus:ring-brand outline-none"
                ></textarea>
              </div>
              <button 
                type="submit" 
                className="w-full py-4 bg-brand hover:bg-brand-hover text-white font-bold rounded-lg transition-transform active:scale-95"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

// Simple helper component for contact details
const ContactInfo = ({ title, detail }) => (
  <div>
    <h4 className="font-bold text-brand">{title}</h4>
    <p className="text-text-base">{detail}</p>
  </div>
);

export default Contact;