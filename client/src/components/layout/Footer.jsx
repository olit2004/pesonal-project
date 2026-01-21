import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12 transition-colors">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-10">
          <div>
            <h3 className="text-white text-xl font-bold mb-4">Ignite Academy</h3>
            <p className="text-sm">Empowering the next generation of developers through immersive education.</p>
          </div>
          
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-brand transition">Home</Link></li>
              <li><Link to="/courses" className="hover:text-brand transition">Courses</Link></li>
              <li><Link to="/about" className="hover:text-brand transition">About Us</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Contact</h3>
            <ul className="text-sm space-y-2">
              <li>hello@ignite.edu</li>
              <li>+2519 555-0199</li>
              <li>5 Kilo, Addis Ababa</li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-slate-800 text-center text-xs">
          &copy; {new Date().getFullYear()} Ignite Academy. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;