import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaGithub } from 'react-icons/fa';
import { Send, Sparkles, ArrowUp, ChevronDown, ChevronUp } from 'lucide-react';
import GrowXLogo from './GrowXLogo';

const C = {
  obsidian: "#0A0A0F",
  charcoal: "#121218",
  surface: "#1A1A24",
  surfaceLight: "#252532",
  gold: "#D4A853",
  goldLight: "#E8C17A",
  goldDark: "#B8923F",
  ivory: "#F5F0E6",
  ivoryMuted: "#A8A099",
  accent: "#C8884A",
  goldBorder: "rgba(212,168,83,0.15)",
  goldDim: "rgba(212,168,83,0.08)",
  white: "#FAFAF8",
};

const footerLinks = {
  platform: [
    { name: 'Learning', path: '/learning' },
    { name: 'Quiz', path: '/quiz' },
    { name: 'Resume Builder', path: '/resume' },
    { name: 'Kanban Board', path: '/KanbanBoard' },
  ],
  services: [
    { name: 'Internship', path: '/internship' },
    { name: 'ATS Checker', path: '/atschecker' },
    { name: 'Job Portal', path: '/job' },
    { name: 'Browse Jobs', path: '/browse' },
  ],
  company: [
    { name: 'About Us', path: '/about' },
    { name: 'Careers', path: '/careers' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' },
  ],
  legal: [
    { name: 'Privacy Policy', path: '/privacy' },
    { name: 'Terms of Service', path: '/terms' },
    { name: 'Cookie Policy', path: '/cookies' },
  ],
};

const socialLinks = [
  { icon: FaFacebook, href: '#', label: 'Facebook', gradient: 'from-blue-600 to-blue-800' },
  { icon: FaTwitter, href: '#', label: 'Twitter', gradient: 'from-sky-400 to-cyan-500' },
  { icon: FaLinkedin, href: '#', label: 'LinkedIn', gradient: 'from-blue-500 to-indigo-600' },
  { icon: FaInstagram, href: '#', label: 'Instagram', gradient: 'from-pink-500 to-purple-600' },
  { icon: FaGithub, href: '#', label: 'GitHub', gradient: 'from-gray-600 to-gray-800' },
];

const FooterColumn = ({ title, links, isOpen, onToggle, isMobile }) => {
  const content = (
    <ul className={`space-y-2.5 ${isMobile && !isOpen ? 'hidden' : ''}`}>
      {links.map((link) => (
        <li key={link.path}>
          <Link 
            to={link.path}
            className="text-sm transition-all duration-200 hover:translate-x-1 inline-block"
            style={{ color: C.ivoryMuted }}
            onMouseEnter={(e) => e.target.style.color = C.goldLight}
            onMouseLeave={(e) => e.target.style.color = C.ivoryMuted}
          >
            {link.name}
          </Link>
        </li>
      ))}
    </ul>
  );

  if (isMobile) {
    return (
      <div className="border-b border-opacity-10" style={{ borderColor: C.goldBorder }}>
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-between py-4 text-left"
        >
          <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: C.gold }}>
            {title}
          </h3>
          {isOpen ? (
            <ChevronUp className="w-4 h-4" style={{ color: C.gold }} />
          ) : (
            <ChevronDown className="w-4 h-4" style={{ color: C.ivoryMuted }} />
          )}
        </button>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden pb-4"
            >
              {content}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-xs font-bold uppercase tracking-wider mb-5" style={{ color: C.gold }}>
        {title}
      </h3>
      {content}
    </div>
  );
};

const Footer = () => {
  const [openSection, setOpenSection] = useState(null);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 300);
    };
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <footer 
      className="relative" 
      style={{ background: `linear-gradient(180deg, ${C.charcoal} 0%, ${C.obsidian} 100%)` }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-5 md:px-6 lg:px-8">
        <div className="h-px w-full" style={{ background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)` }} />

        {/* ========== MOBILE FOOTER (< 1024px) ========== */}
        <div className="lg:hidden">
          {/* Mobile Logo & Brand */}
          <div className="pt-8 pb-6">
            <div className="flex items-center gap-3 mb-4">
              <GrowXLogo size={32} />
              <span className="text-lg font-bold" style={{ color: C.gold }}>GrowX</span>
            </div>
            <p className="text-xs leading-relaxed mb-5" style={{ color: C.ivoryMuted }}>
              Empowering careers through innovative learning tools and professional development resources.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-2.5 mb-5">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-9 h-9 rounded-lg flex items-center justify-center bg-gradient-to-br ${social.gradient} 
                             shadow-md hover:shadow-lg transition-shadow duration-300`}
                >
                  <social.icon className="w-4 h-4 text-white" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Mobile Accordion Sections */}
          <div className="border-t" style={{ borderColor: C.goldBorder }}>
            <FooterColumn
              title="Platform"
              links={footerLinks.platform}
              isOpen={openSection === 'platform'}
              onToggle={() => toggleSection('platform')}
              isMobile
            />
            <FooterColumn
              title="Services"
              links={footerLinks.services}
              isOpen={openSection === 'services'}
              onToggle={() => toggleSection('services')}
              isMobile
            />
            <FooterColumn
              title="Company"
              links={footerLinks.company}
              isOpen={openSection === 'company'}
              onToggle={() => toggleSection('company')}
              isMobile
            />
          </div>

          {/* Mobile Newsletter */}
          <div 
            className="mx-0 my-6 rounded-xl p-4"
            style={{ background: C.surface, border: `1px solid ${C.goldBorder}` }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-3.5 h-3.5" style={{ color: C.gold }} />
              <span className="text-xs font-semibold" style={{ color: C.gold }}>Newsletter</span>
            </div>
            <p className="text-xs mb-3" style={{ color: C.ivoryMuted }}>
              Get the latest updates & career tips
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 min-w-0 px-3 py-2 rounded-lg text-xs outline-none transition-all duration-200"
                style={{ 
                  background: C.surfaceLight, 
                  border: `1px solid ${C.goldBorder}`,
                  color: C.ivory,
                }}
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-3 py-2 rounded-lg text-xs font-semibold text-gray-900 flex items-center justify-center transition-all duration-200 whitespace-nowrap"
                style={{ background: `linear-gradient(135deg, ${C.gold} 0%, ${C.goldLight} 100%)` }}
              >
                Subscribe
              </motion.button>
            </form>
            <AnimatePresence>
              {subscribed && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-xs mt-2" style={{ color: C.gold }}
                >
                  Thanks for subscribing!
                </motion.p>
              )}
            </AnimatePresence>
          </div>

        </div>

        {/* ========== TABLET FOOTER (768px - 1023px) ========== */}
        <div className="hidden md:block lg:hidden">
          <div className="py-10 grid grid-cols-2 gap-8">
            {/* Brand & Newsletter */}
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <GrowXLogo size={36} />
                <span className="text-base font-bold" style={{ color: C.gold }}>GrowX</span>
              </div>
              <p className="text-sm leading-relaxed mb-5 max-w-xs" style={{ color: C.ivoryMuted }}>
                Empowering careers through innovative learning tools, job opportunities, and professional development.
              </p>
              
              <div className="flex gap-2.5 mb-5">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-9 h-9 rounded-lg flex items-center justify-center bg-gradient-to-br ${social.gradient}`}
                  >
                    <social.icon className="w-4 h-4 text-white" />
                  </motion.a>
                ))}
              </div>

              {/* Newsletter */}
              <div className="rounded-xl p-4 max-w-xs" style={{ background: C.surface, border: `1px solid ${C.goldBorder}` }}>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-3.5 h-3.5" style={{ color: C.gold }} />
                  <span className="text-xs font-semibold" style={{ color: C.gold }}>Newsletter</span>
                </div>
                <p className="text-xs mb-3" style={{ color: C.ivoryMuted }}>
                  Get the latest updates & career tips
                </p>
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-1 px-3 py-2 rounded-lg text-xs outline-none"
                    style={{ background: C.surfaceLight, border: `1px solid ${C.goldBorder}`, color: C.ivory }}
                  />
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-3 py-2 rounded-lg text-xs font-semibold text-gray-900"
                    style={{ background: `linear-gradient(135deg, ${C.gold} 0%, ${C.goldLight} 100%)` }}
                  >
                    <Send className="w-4 h-4" />
                  </motion.button>
                </form>
              </div>
            </div>

            {/* Links Columns */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: C.gold }}>Platform</h3>
                <ul className="space-y-2.5">
                  {footerLinks.platform.map((link) => (
                    <li key={link.path}>
                      <Link to={link.path} className="text-sm transition-colors" style={{ color: C.ivoryMuted }}
                        onMouseEnter={(e) => e.target.style.color = C.goldLight}
                        onMouseLeave={(e) => e.target.style.color = C.ivoryMuted}>
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: C.gold }}>Services</h3>
                <ul className="space-y-2.5">
                  {footerLinks.services.map((link) => (
                    <li key={link.path}>
                      <Link to={link.path} className="text-sm transition-colors" style={{ color: C.ivoryMuted }}
                        onMouseEnter={(e) => e.target.style.color = C.goldLight}
                        onMouseLeave={(e) => e.target.style.color = C.ivoryMuted}>
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="col-span-2">
                <h3 className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: C.gold }}>Company</h3>
                <ul className="space-y-2.5 flex flex-wrap gap-x-6 gap-y-2">
                  {footerLinks.company.map((link) => (
                    <li key={link.path}>
                      <Link to={link.path} className="text-sm transition-colors" style={{ color: C.ivoryMuted }}
                        onMouseEnter={(e) => e.target.style.color = C.goldLight}
                        onMouseLeave={(e) => e.target.style.color = C.ivoryMuted}>
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

        </div>

        {/* ========== DESKTOP FOOTER (>= 1024px) ========== */}
        <div className="hidden lg:block py-12 xl:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-10 xl:gap-12">
            {/* Brand Column */}
            <div className="xl:col-span-2">
              <div className="mb-5">
                <GrowXLogo size={40} />
              </div>
              <p className="text-sm xl:text-base leading-relaxed mb-6 max-w-sm" style={{ color: C.ivoryMuted }}>
                Empowering careers through innovative learning tools, 
                job opportunities, and professional development resources.
              </p>
              
              {/* Social Links */}
              <div className="flex gap-2.5 mb-6">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br ${social.gradient} 
                               shadow-lg hover:shadow-xl transition-shadow duration-300`}
                  >
                    <social.icon className="w-5 h-5 text-white" />
                  </motion.a>
                ))}
              </div>

              {/* Newsletter */}
              <div style={{ background: C.surface, border: `1px solid ${C.goldBorder}` }} className="rounded-2xl p-5 max-w-sm">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4" style={{ color: C.gold }} />
                  <span className="text-sm font-semibold" style={{ color: C.gold }}>Newsletter</span>
                </div>
                <p className="text-xs mb-4" style={{ color: C.ivoryMuted }}>
                  Get the latest updates & career tips
                </p>
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-2.5 rounded-xl text-sm outline-none transition-all duration-200"
                    style={{ 
                      background: C.surfaceLight, 
                      border: `1px solid ${C.goldBorder}`,
                      color: C.ivory,
                    }}
                  />
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-900 flex items-center gap-2"
                    style={{ background: `linear-gradient(135deg, ${C.gold} 0%, ${C.goldLight} 100%)` }}
                  >
                    <Send className="w-4 h-4" />
                  </motion.button>
                </form>
                <AnimatePresence>
                  {subscribed && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-xs mt-2" style={{ color: C.gold }}
                    >
                      Thanks for subscribing!
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Platform Links */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider mb-5" style={{ color: C.gold }}>
                Platform
              </h3>
              <ul className="space-y-3">
                {footerLinks.platform.map((link) => (
                  <li key={link.path}>
                    <Link 
                      to={link.path}
                      className="text-sm transition-all duration-200 hover:translate-x-1 inline-block"
                      style={{ color: C.ivoryMuted }}
                      onMouseEnter={(e) => e.target.style.color = C.goldLight}
                      onMouseLeave={(e) => e.target.style.color = C.ivoryMuted}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services Links */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider mb-5" style={{ color: C.gold }}>
                Services
              </h3>
              <ul className="space-y-3">
                {footerLinks.services.map((link) => (
                  <li key={link.path}>
                    <Link 
                      to={link.path}
                      className="text-sm transition-all duration-200 hover:translate-x-1 inline-block"
                      style={{ color: C.ivoryMuted }}
                      onMouseEnter={(e) => e.target.style.color = C.goldLight}
                      onMouseLeave={(e) => e.target.style.color = C.ivoryMuted}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider mb-5" style={{ color: C.gold }}>
                Company
              </h3>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.path}>
                    <Link 
                      to={link.path}
                      className="text-sm transition-all duration-200 hover:translate-x-1 inline-block"
                      style={{ color: C.ivoryMuted }}
                      onMouseEnter={(e) => e.target.style.color = C.goldLight}
                      onMouseLeave={(e) => e.target.style.color = C.ivoryMuted}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>

        {/* ========== BOTTOM BAR (ALL SCREENS) ========== */}
        <div 
          className="py-4 md:py-5 border-t flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4" 
          style={{ borderColor: C.goldBorder }}
        >
          <p className="text-xs sm:text-sm order-2 sm:order-1" style={{ color: C.ivoryMuted }}>
            © {new Date().getFullYear()} <span style={{ color: C.gold }}>GrowX</span>. All rights reserved.
          </p>
          
          <div className="flex items-center gap-4 sm:gap-6 order-1 sm:order-2 flex-wrap justify-center">
            {footerLinks.legal.map((link) => (
              <Link 
                key={link.path}
                to={link.path}
                className="text-xs sm:text-sm transition-colors duration-200"
                style={{ color: C.ivoryMuted }}
                onMouseEnter={(e) => e.target.style.color = C.gold}
                onMouseLeave={(e) => e.target.style.color = C.ivoryMuted}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <AnimatePresence>
        {isVisible && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={scrollToTop}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shadow-lg z-50"
            style={{ 
              background: `linear-gradient(135deg, ${C.gold} 0%, ${C.goldDark} 100%)`,
              boxShadow: `0 4px 20px ${C.goldBorder}`,
            }}
            aria-label="Back to top"
          >
            <ArrowUp className="w-5 h-5 sm:w-5 sm:h-5 text-gray-900" />
          </motion.button>
        )}
      </AnimatePresence>
    </footer>
  );
};

export default Footer;
