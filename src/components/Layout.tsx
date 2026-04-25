import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronRight, Phone, Instagram, MapPin, ArrowUp, Smartphone } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'Booking', path: '/booking' },
    { name: 'Blog', path: 'https://blog.naver.com/mid_designstudio', isExternal: true },
  ];

  const isHome = location.pathname === '/';
  const isNavDark = scrolled || !isHome;

  return (
    <nav className={cn(
      "fixed w-full z-50 transition-all duration-300 px-6 md:px-12 py-4",
      scrolled ? "bg-white/90 backdrop-blur-md py-3 shadow-sm" : "bg-transparent py-6"
    )}>
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-baseline gap-3">
          <span className={cn(
            "text-4xl font-serif font-bold tracking-tighter transition-colors",
            isNavDark ? "text-slate-900" : "text-white"
          )}>MID</span>
          <span className={cn(
            "text-[10px] md:text-xs uppercase tracking-[0.4em] font-semibold transition-colors",
            isNavDark ? "text-slate-500" : "text-white/70"
          )}>Interior Design</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-12">
          {navItems.map((item) => (
            item.isExternal ? (
              <a
                key={item.path}
                href={item.path}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "text-xs uppercase tracking-widest font-semibold transition-all hover:text-brand-gold",
                  isNavDark ? "text-slate-600" : "text-white/90"
                )}
              >
                {item.name}
              </a>
            ) : (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => cn(
                  "text-xs uppercase tracking-widest font-semibold transition-all hover:text-brand-gold",
                  isNavDark ? "text-slate-600" : "text-white/90",
                  isActive && "text-brand-gold"
                )}
              >
                {item.name}
              </NavLink>
            )
          ))}
          <Link 
            to="/booking" 
            className={cn(
              "px-6 py-2.5 text-xs uppercase tracking-widest font-bold transition-all border",
              isNavDark 
                ? "border-slate-900 bg-slate-900 text-white hover:bg-white hover:text-slate-900" 
                : "border-white bg-white text-slate-900 hover:bg-transparent hover:text-white"
            )}
          >
            Consultation
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? (
            <X className={isNavDark ? "text-slate-900" : "text-white"} />
          ) : (
            <Menu className={isNavDark ? "text-slate-900" : "text-white"} />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-0 left-0 w-full h-screen bg-slate-900 flex flex-col justify-center items-center space-y-8 z-40"
          >
            {navItems.map((item) => (
              item.isExternal ? (
                <a
                  key={item.path}
                  href={item.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsOpen(false)}
                  className="text-2xl font-serif text-white hover:text-brand-gold"
                >
                  {item.name}
                </a>
              ) : (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className="text-2xl font-serif text-white hover:text-brand-gold"
                >
                  {item.name}
                </Link>
              )
            ))}
            <Link 
              to="/booking"
              onClick={() => setIsOpen(false)}
              className="px-8 py-3 bg-brand-gold text-white text-sm uppercase tracking-widest font-bold"
            >
              Consultation
            </Link>
            <button onClick={() => setIsOpen(false)} className="text-white/50 p-2">
              <X size={32} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Footer = () => (
  <footer className="bg-slate-950 text-white/90 py-20 px-6 md:px-12 border-t border-white/5">
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
      <div className="col-span-1 md:col-span-1">
        <Link to="/" className="flex items-baseline gap-3 mb-6">
          <span className="text-4xl font-serif font-bold tracking-tighter text-white">MID</span>
          <span className="text-[10px] md:text-xs uppercase tracking-[0.4em] font-semibold text-white/50">Interior Design</span>
        </Link>
        <p className="text-sm text-white/50 leading-relaxed font-light mb-6">
          "경험이 만드는 차이, 공간의 가치를 더하는 27년의 기술력"
        </p>
        <div className="flex space-x-4">
          <a href="#" className="p-2 border border-white/10 rounded-full hover:bg-white/10 transition-colors">
            <Instagram size={18} />
          </a>
          <a href="#" className="p-2 border border-white/10 rounded-full hover:bg-white/10 transition-colors">
             <Phone size={18} />
          </a>
        </div>
      </div>

      <div>
        <h4 className="text-xs uppercase tracking-widest font-bold text-white mb-6">Quick Links</h4>
        <ul className="space-y-4 text-sm font-light text-white/50">
          <li><Link to="/about" className="hover:text-brand-gold transition-colors">About MID</Link></li>
          <li><Link to="/portfolio" className="hover:text-brand-gold transition-colors">Portfolio</Link></li>
          <li><a href="https://blog.naver.com/mid_designstudio" target="_blank" rel="noopener noreferrer" className="hover:text-brand-gold transition-colors">Blog (Naver)</a></li>
          <li><Link to="/booking" className="hover:text-brand-gold transition-colors">Consultation</Link></li>
          <li><Link to="/admin" className="hover:text-brand-gold transition-colors">Dashboard</Link></li>
        </ul>
      </div>

      <div>
        <h4 className="text-xs uppercase tracking-widest font-bold text-white mb-6">Contact</h4>
        <ul className="space-y-4 text-sm font-light text-white/50">
          <li className="flex items-start space-x-3">
            <MapPin size={16} className="mt-1 flex-shrink-0" />
            <span>경기도 성남시 분당구 수내동 <br/> 내정로 173번길 11</span>
          </li>
          <li className="flex items-center space-x-3">
            <Phone size={16} className="flex-shrink-0" />
            <a href="tel:031-717-2801" className="hover:text-brand-gold transition-colors">031-717-2801</a>
          </li>
          <li className="flex items-center space-x-3">
            <Smartphone size={16} className="flex-shrink-0" />
            <a href="tel:010-8925-3990" className="hover:text-brand-gold transition-colors">010-8925-3990</a>
          </li>
        </ul>
      </div>
    </div>
    
    <div className="max-w-7xl mx-auto pt-20 mt-20 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-[10px] uppercase tracking-widest text-white/30">
      <p>© 2024 MID Interior Design. All rights reserved.</p>
      <div className="flex space-x-8 mt-4 md:mt-0">
        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
      </div>
    </div>
  </footer>
);

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const [showTopBtn, setShowTopBtn] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowTopBtn(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />

      {/* Floating Top Button */}
      <AnimatePresence>
        {showTopBtn && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            onClick={scrollToTop}
            className="fixed bottom-10 right-10 z-[60] p-4 bg-slate-900 text-white rounded-full shadow-2xl border border-white/10 hover:bg-brand-gold transition-colors group"
            aria-label="Back to Top"
          >
            <ArrowUp size={24} className="group-hover:-translate-y-1 transition-transform" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};
