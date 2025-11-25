import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img src={logo} alt="SkillMatch Logo" className="w-8 h-8 rounded-lg" />
              <span className="text-xl font-bold text-primary-600">SkillMatch</span>
            </Link>
            <p className="text-gray-500 text-sm">
              Connecting creative professionals with freelance jobs, courses, and tools to elevate their careers.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">Company</h3>
            <ul className="space-y-3">
              <li><Link to="#" className="text-gray-500 hover:text-gray-900 text-sm">About Us</Link></li>
              <li><Link to="#" className="text-gray-500 hover:text-gray-900 text-sm">Careers</Link></li>
              <li><Link to="#" className="text-gray-500 hover:text-gray-900 text-sm">Press</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">Support</h3>
            <ul className="space-y-3">
              <li><Link to="#" className="text-gray-500 hover:text-gray-900 text-sm">Help Center</Link></li>
              <li><Link to="#" className="text-gray-500 hover:text-gray-900 text-sm">Terms of Service</Link></li>
              <li><Link to="#" className="text-gray-500 hover:text-gray-900 text-sm">Privacy Policy</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">Resources</h3>
            <ul className="space-y-3">
              <li><Link to="#" className="text-gray-500 hover:text-gray-900 text-sm">Blog</Link></li>
              <li><Link to="#" className="text-gray-500 hover:text-gray-900 text-sm">Newsletter</Link></li>
              <li><Link to="#" className="text-gray-500 hover:text-gray-900 text-sm">Events</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            &copy; 2025 SkillMatch. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            {/* Social icons could go here */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
