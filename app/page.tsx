"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";
import { useSpring as useReactSpring, animated } from "@react-spring/web";
import { useInView } from "react-intersection-observer";
import Tilt from "react-parallax-tilt";
import * as Dialog from "@radix-ui/react-dialog";
import * as Tabs from "@radix-ui/react-tabs";
import { 
  Flame, MapPin, Clock, Phone, ChevronDown, Menu, X, 
  Star, TrendingUp, Award, Zap, ShoppingBag, ArrowRight,
  Instagram
} from "lucide-react";
import { cn } from "@/lib/utils";
import Loading from "@/components/Loading";
import { currentImages } from "@/lib/images";

function MobileCarousel({ menuItems }: { menuItems: any[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  
  // Show only burger, chicken, and shake on mobile
  const mobileItems = [
    menuItems[1], // Cheese Burger
    menuItems[0], // Buffalo Ranch
    menuItems[2], // Nutella Shake
  ];
  
  // Preload all images
  useEffect(() => {
    const imagePromises = mobileItems.map((item) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = item.image;
        img.onload = resolve;
        img.onerror = reject;
      });
    });
    
    Promise.all(imagePromises).then(() => {
      setImagesLoaded(true);
    });
  }, []);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % mobileItems.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [mobileItems.length]);
  
  return (
    <div className="relative w-full h-[50vh] overflow-hidden flex items-center justify-center">
      {!imagesLoaded ? (
        <div className="flex items-center justify-center w-full">
          <div className="w-16 h-16 border-4 border-brand-green border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.8, x: 100 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: -100 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <img 
              src={mobileItems[currentIndex].image}
              alt={mobileItems[currentIndex].name}
              className="w-[90vw] h-[90vw] max-w-[500px] max-h-[500px] object-contain"
              style={{ 
                filter: 'drop-shadow(0 20px 40px rgba(0, 0, 0, 0.3))'
              }}
            />
          </motion.div>
        </AnimatePresence>
      )}
      
      {/* Dots indicator */}
      {imagesLoaded && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          {mobileItems.map((_, index) => (
            <div
              key={index}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                index === currentIndex ? "bg-brand-green w-6" : "bg-gray-300"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function SwipeToOrder() {
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  
  const handleDrag = (event: any, info: any) => {
    setDragX(info.offset.x);
    if (info.offset.x > 200) {
      setIsCompleted(true);
      // Navigate to google.com
      window.location.href = 'https://www.clover.com/online-ordering/steiny-bs-brooklyn';
    }
  };
  
  const handleDragEnd = () => {
    if (!isCompleted) {
      setDragX(0);
    }
    setIsDragging(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
      className="relative w-full h-14 bg-brand-green/10 rounded-full overflow-hidden border-2 border-brand-green/20"
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.span 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="text-brand-green text-sm font-bold uppercase tracking-wider"
        >
          SWIPE TO ORDER
        </motion.span>
      </div>
      
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 240 }}
        dragElastic={0.2}
        onDrag={handleDrag}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleDragEnd}
        animate={{ x: isCompleted ? 240 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="absolute left-0 top-0 h-full w-14 bg-brand-green rounded-full cursor-grab active:cursor-grabbing flex items-center justify-center shadow-lg"
        style={{
          background: isCompleted ? '#008947' : '#006738',
        }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <ChevronDown className="w-5 h-5 text-white rotate-[-90deg]" />
      </motion.div>
      
      {/* Progress bar removed */}
    </motion.div>
  );
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll();
  const scaleProgress = useTransform(scrollYProgress, [0, 1], [1, 0.8]);
  const opacityProgress = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "about", "menu", "location", "contact"];
      const scrollPosition = window.scrollY + 100;
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-white overflow-x-hidden">
      <Navbar activeSection={activeSection} isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      <MobileMenu isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} />
      
      <main>
        {/* Hidden SEO Content for Better Ranking */}
        <h1 className="sr-only">Steiny B&apos;s - Best Halal Burgers and Nashville Hot Chicken in Brooklyn NYC</h1>
        <HeroSection />
        <AboutSection />
        <MenuSection />
        <LocationSection />
        <ContactSection />
      </main>
      
      <Footer />
    </div>
  );
}

function Navbar({ activeSection, isMenuOpen, setIsMenuOpen }: any) {
  const [isScrolled, setIsScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Desktop Navigation - Always visible */}
      <nav className={cn(
        "hidden md:block fixed top-0 w-full z-40 transition-all duration-300",
        isScrolled ? "bg-white shadow-lg py-3" : "bg-transparent py-6"
      )}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Logo on left */}
            <a href="#home" className="flex-shrink-0">
              <img 
                src="https://general-public-image-buckets.s3.amazonaws.com/steiny/images/branding/logo-primary.jpeg"
                alt="Steiny B's Logo"
                className="h-12 lg:h-14 w-auto"
              />
            </a>
            
            {/* Menu in center */}
            <div className="flex items-center gap-6 lg:gap-8">
              {["home", "about", "menu", "location", "contact"].map((item) => (
                <motion.a
                  key={item}
                  href={`#${item}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    "font-bold transition-colors uppercase tracking-wider",
                    activeSection === item 
                      ? "text-brand-green" 
                      : "text-gray-700 hover:text-brand-green"
                  )}
                >
                  {item}
                </motion.a>
              ))}
            </div>
            
            {/* Order button on right */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-white px-6 py-3 rounded-full font-bold shadow-lg transition-all"
              style={{ backgroundColor: '#006738' }}
            >
              ORDER ONLINE
            </motion.button>
          </div>
        </div>
      </nav>
      
      {/* Mobile Header */}
      <div className={cn(
        "md:hidden fixed top-0 left-0 right-0 z-40 transition-all duration-300",
        isScrolled ? "bg-white shadow-lg" : "bg-gradient-to-b from-white/90 to-transparent"
      )}>
        <div className="flex items-center justify-between p-4">
          {/* Logo on left */}
          <a href="#home" className="flex-shrink-0">
            <img 
              src="https://general-public-image-buckets.s3.amazonaws.com/steiny/images/branding/logo-primary.jpeg"
              alt="Steiny B's Logo"
              className="h-10 w-auto"
            />
          </a>
          
          {/* Order button when scrolled */}
          {isScrolled && (
            <motion.a
              href="https://www.clover.com/online-ordering/steiny-bs-brooklyn"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="px-6 py-2 rounded-full text-sm font-bold text-white shadow-lg"
              style={{ backgroundColor: '#006738' }}
            >
              ORDER NOW
            </motion.a>
          )}
          
          {/* Menu button on right */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-full transition-colors"
            style={{ 
              backgroundColor: isMenuOpen ? '#006738' : 'transparent',
              border: `2px solid ${isMenuOpen ? '#006738' : '#006738'}`
            }}
          >
            {isMenuOpen ? <X size={24} className="text-white" /> : <Menu size={24} className="text-brand-green" />}
          </motion.button>
        </div>
      </div>
    </>
  );
}

function MobileMenu({ isOpen, setIsOpen }: any) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 20 }}
          className="fixed inset-y-0 right-0 w-full max-w-sm bg-white z-50 shadow-2xl md:hidden"
        >
          <div className="p-6 pt-20">
            {/* Close button */}
            <motion.button
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsOpen(false)}
              className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-6 h-6 text-gray-800" />
            </motion.button>
            
            <div className="flex flex-col gap-6">
              {["home", "about", "menu", "location", "contact"].map((item, index) => (
                <motion.a
                  key={item}
                  href={`#${item}`}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setIsOpen(false)}
                  className="text-2xl font-bold text-gray-800 hover:text-brand-green transition-colors uppercase tracking-wider"
                >
                  {item}
                </motion.a>
              ))}
              <motion.a
                href="https://www.clover.com/online-ordering/steiny-bs-brooklyn"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="inline-block bg-brand-green text-white px-8 py-4 rounded-full font-bold text-lg shadow-xl hover:bg-brand-dark transition-colors mt-4 uppercase tracking-wider"
              >
                ORDER NOW
              </motion.a>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function HeroSection() {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });
  

  return (
    <section id="home" ref={ref} className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-gray-50 to-white">
      {/* Mobile Layout - Full Screen Height with safe areas */}
      <div className="sm:hidden w-full min-h-screen relative" style={{ minHeight: '100vh', paddingBottom: 'env(safe-area-inset-bottom)' }}>
        {/* Brand color accent shapes */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-brand-green/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-green/5 rounded-full blur-3xl"></div>
        
        {/* Content container with flexible spacing */}
        <div className="min-h-screen flex flex-col px-4 pb-8">
          {/* Header spacer */}
          <div className="h-20"></div>
          
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-2"
          >
            <h1 className="text-[10vw] font-black text-gray-900 leading-[0.85]">
              <span className="text-brand-green">SMASHED</span> TO<br />
              PERFECTION
            </h1>
          </motion.div>
          
          {/* Large food images */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="-mx-4 relative flex items-center flex-shrink-0 -mt-12"
            style={{ height: 'clamp(200px, 28vh, 300px)' }}
          >
            {/* Brand color accent behind images */}
            <div className="absolute inset-0 bg-gradient-to-r from-brand-green/5 via-transparent to-brand-green/5"></div>
            <div className="flex items-center justify-center h-full">
              {/* Chicken - Left */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
                className="relative w-[30%] h-full pt-20 ml-4"
              >
                <img 
                  src={currentImages.chicken.buffaloRanch}
                  alt="Buffalo Ranch Chicken"
                  className="w-full h-full object-contain"
                  style={{ 
                    filter: 'drop-shadow(0 20px 30px rgba(0, 0, 0, 0.2))',
                    transform: 'scale(2.16)'
                  }}
                />
              </motion.div>
              
              {/* Burger - Center (largest) */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.6, type: "spring", stiffness: 100 }}
                className="relative w-[40%] h-full -mx-2 z-10 -ml-3"
              >
                <img 
                  src={currentImages.burgers.jalapenoCheeseBurger}
                  alt="Jalapeño Cheese Burger"
                  className="w-full h-full object-contain"
                  style={{ 
                    filter: 'drop-shadow(0 25px 40px rgba(0, 0, 0, 0.25))',
                    transform: 'scale(2.4)'
                  }}
                />
              </motion.div>
              
              {/* Shake - Right */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.7, type: "spring", stiffness: 100 }}
                className="relative w-[30%] h-full pt-8 z-0 -ml-4"
              >
                <img 
                  src={currentImages.drinks.vanillaShake}
                  alt="Vanilla Shake"
                  className="w-full h-full object-contain"
                  style={{ 
                    filter: 'drop-shadow(0 20px 30px rgba(0, 0, 0, 0.15))',
                    transform: 'scale(1.98)'
                  }}
                />
              </motion.div>
            </div>
          </motion.div>
          
          {/* 3 Square Images Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex justify-center gap-3 pt-10 pb-4 flex-shrink-0"
          >
            {/* Square Image 1 - You can replace with actual images */}
            <div className="w-[28vw] h-[28vw] max-w-[120px] max-h-[120px] bg-gray-200 rounded-lg overflow-hidden shadow-md">
              <img 
                src="https://general-public-image-buckets.s3.amazonaws.com/steiny/images/natural-shots-1x1/natural-shot-1.png"
                alt="Natural Shot 1"
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Square Image 2 */}
            <div className="w-[28vw] h-[28vw] max-w-[120px] max-h-[120px] bg-gray-200 rounded-lg overflow-hidden shadow-md">
              <img 
                src="https://general-public-image-buckets.s3.amazonaws.com/steiny/images/natural-shots-1x1/natural-shot-3.png"
                alt="Natural Shot 3"
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Square Image 3 */}
            <div className="w-[28vw] h-[28vw] max-w-[120px] max-h-[120px] bg-gray-200 rounded-lg overflow-hidden shadow-md">
              <img 
                src="https://general-public-image-buckets.s3.amazonaws.com/steiny/images/natural-shots-1x1/natural-shot-5.png"
                alt="Natural Shot 5"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
          
          {/* Bottom content - moved up */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.8 }}
            className="text-center space-y-3 mt-6"
          >
            {/* Text content */}
            <div className="space-y-1">
              <p className="text-[5vw] font-bold text-gray-800">
                SMASH BURGERS
              </p>
              <p className="text-[4vw] text-gray-600">
                FRIES • HOT CHICKEN • SHAKES
              </p>
              <p className="text-[3.5vw] text-gray-600">
                100% HALAL • FRESH INGREDIENTS • MADE TO ORDER
              </p>
            </div>
            
            {/* Swipe to Order only */}
            <div className="pt-2">
              <SwipeToOrder />
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Desktop Layout */}
      <div className="hidden sm:block w-full pl-4 md:pl-8 pr-4 pt-4 md:pt-8">
        <div className="grid md:grid-cols-2 gap-8 items-center max-w-[1600px]">
          {/* Left side - Text content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-left space-y-6"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 }}
              className="text-5xl lg:text-7xl font-black text-gray-900 leading-tight"
            >
              <span className="text-brand-green">SMASHED</span> TO<br />
              PERFECTION
            </motion.h1>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 }}
              className="space-y-2"
            >
              <p className="text-2xl lg:text-3xl font-bold text-gray-800">
                SMASH BURGERS
              </p>
              <p className="text-xl lg:text-2xl text-gray-600">
                FRIES • HOT CHICKEN • SHAKES
              </p>
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 }}
              className="text-lg text-gray-600 max-w-md"
            >
              100% HALAL • FRESH INGREDIENTS • MADE TO ORDER
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-start"
            >
              <motion.a
                href="https://www.clover.com/online-ordering/steiny-bs-brooklyn"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="hidden sm:inline-block px-8 py-4 rounded-full text-lg font-bold shadow-xl text-white uppercase tracking-wider"
                style={{ backgroundColor: '#006738' }}
              >
                ORDER NOW
              </motion.a>
              <motion.a
                href="#menu"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-full text-lg font-bold border-2 border-brand-green text-brand-green bg-white shadow-xl"
              >
                VIEW MENU
              </motion.a>
            </motion.div>
          </motion.div>
          
          {/* Right side - Static images in a row */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative h-[400px] md:h-[500px] lg:h-[600px] hidden sm:flex items-center justify-center pr-4 md:pr-6"
          >
            <div className="flex items-center justify-center gap-4 lg:gap-8 w-full">
              {/* Chicken - Left */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
                className="relative w-[200px] h-[200px] sm:w-[240px] sm:h-[240px] md:w-[280px] md:h-[280px] lg:w-[350px] lg:h-[350px] z-20"
              >
                <img 
                  src={currentImages.chicken.buffaloRanch}
                  alt="Buffalo Ranch Chicken"
                  className="w-full h-full object-contain scale-[2] sm:scale-[2.5] md:scale-[3]"
                  style={{ 
                    filter: 'drop-shadow(0 30px 50px rgba(0, 0, 0, 0.25))'
                  }}
                />
              </motion.div>
              
              {/* Burger - Center (largest) */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.6, type: "spring", stiffness: 100 }}
                className="relative w-[250px] h-[250px] sm:w-[300px] sm:h-[300px] md:w-[350px] md:h-[350px] lg:w-[450px] lg:h-[450px] z-30"
              >
                <img 
                  src={currentImages.burgers.jalapenoCheeseBurger}
                  alt="Jalapeño Cheese Burger"
                  className="w-full h-full object-contain scale-[2] sm:scale-[2.5] md:scale-[3]"
                  style={{ 
                    filter: 'drop-shadow(0 40px 60px rgba(0, 0, 0, 0.3))'
                  }}
                />
              </motion.div>
              
              {/* Shake - Right */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.7, type: "spring", stiffness: 100 }}
                className="relative w-[180px] h-[180px] sm:w-[210px] sm:h-[210px] md:w-[250px] md:h-[250px] lg:w-[320px] lg:h-[320px] z-10"
              >
                <img 
                  src={currentImages.drinks.vanillaShake}
                  alt="Vanilla Shake"
                  className="w-full h-full object-contain scale-[2] sm:scale-[2.5] md:scale-[3]"
                  style={{ 
                    filter: 'drop-shadow(0 25px 40px rgba(0, 0, 0, 0.2))'
                  }}
                />
              </motion.div>
            </div>
            
            {/* Background accent */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute w-[800px] h-[400px] bg-brand-green/5 rounded-full blur-3xl"
                style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
              />
            </div>
          </motion.div>
        </div>
        
      </div>
    </section>
  );
}

function AboutSection() {
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  const features = [
    {
      icon: "01",
      title: "NYC'S TOP SMASHBURGERS",
      subtitle: "VOTED #1",
      description: "VOTED NYC'S TOP SMASHBURGERS 2025",
      accent: "text-yellow-600",
    },
    {
      icon: "02",
      title: "PREMIUM INGREDIENTS",
      subtitle: "ALWAYS FRESH",
      description: "HAND-SMASHED BEEF & CRISPY CHICKEN",
      accent: "text-red-600",
    },
    {
      icon: "03",
      title: "100% HALAL",
      subtitle: "CERTIFIED",
      description: "PREMIUM INGREDIENTS YOU CAN TRUST",
      accent: "text-brand-green",
    },
    {
      icon: "04",
      title: "ALWAYS FRESH",
      subtitle: "MADE TO ORDER",
      description: "HOT OFF THE GRILL, EVERY TIME",
      accent: "text-orange-600",
    },
  ];

  return (
    <section id="about" ref={ref} className="py-16 lg:py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          {/* Classic vintage header */}
          <div className="text-center mb-16">
            <motion.div 
              initial={{ width: 0 }}
              animate={inView ? { width: "100%" } : {}}
              transition={{ duration: 0.8 }}
              className="h-px bg-gray-300 max-w-lg mx-auto mb-8"
            />
            <h2 className="text-5xl lg:text-7xl font-serif text-gray-900 mb-2">
              Our Story
            </h2>
            <p className="text-sm tracking-[0.3em] text-gray-500 font-medium">EST. 2025 • BROOKLYN, NY</p>
            <motion.div 
              initial={{ width: 0 }}
              animate={inView ? { width: "100%" } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="h-px bg-gray-300 max-w-lg mx-auto mt-8"
            />
          </div>
          
          {/* Story content with vintage newspaper style */}
          <div className="max-w-5xl mx-auto">
            {/* Heritage section with classic layout */}
            <div className="grid md:grid-cols-2 gap-12 mb-20">
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="space-y-6"
              >
                <div className="border-l-4 border-brand-green pl-6">
                  <h3 className="text-sm font-bold tracking-[0.2em] text-gray-500 mb-2">HERITAGE</h3>
                  <h4 className="text-2xl lg:text-3xl font-serif text-gray-900 mb-4">A Tribute to Tradition</h4>
                </div>
                <p className="text-gray-700 leading-relaxed text-lg">
                  The meaning behind our name, <span className="font-bold text-brand-green">Steiny B's</span>, is a tribute to 
                  <span className="font-bold"> Lionel Sternberger</span>, who is reputed to have introduced the cheeseburger in 
                  <span className="font-bold">1924</span> at the age of 16.
                </p>
                <p className="text-gray-700 leading-relaxed text-lg">
                  <span className="font-bold">Steiny</span> is contributed to his name 'Sternberger' and 
                  <span className="font-bold">B's</span> is contributed to our signature smash burgers.
                </p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: 30 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="space-y-6"
              >
                <div className="border-l-4 border-brand-green pl-6">
                  <h3 className="text-sm font-bold tracking-[0.2em] text-gray-500 mb-2">PHILOSOPHY</h3>
                  <h4 className="text-2xl lg:text-3xl font-serif text-gray-900 mb-4">What We Stand For</h4>
                </div>
                <p className="text-gray-700 leading-relaxed text-lg">
                  At Steiny B's, we prepare our signature smash burgers, made to order, with 
                  <span className="font-bold text-brand-green"> 100% fresh beef</span>, hand-smashed on a hot grill to sear in the juices and deliver a 
                  <span className="font-bold"> crispy caramelized crust</span>.
                </p>
                <div className="bg-gray-50 border border-gray-200 p-4 mt-6">
                  <p className="text-center text-gray-800 font-serif text-lg">
                    <span className="font-bold">FRIES</span> • 
                    <span className="font-bold"> HOT CHICKEN</span> • 
                    <span className="font-bold"> SHAKES</span>
                  </p>
                </div>
              </motion.div>
            </div>
            
            {/* Decorative divider */}
            <div className="flex items-center justify-center mb-20">
              <div className="h-px bg-gray-300 w-24"></div>
              <div className="mx-4">
                <svg className="w-8 h-8 text-brand-green" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <div className="h-px bg-gray-300 w-24"></div>
            </div>
          </div>
        </motion.div>

        {/* Feature Cards with Vintage Style */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-20"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="group"
              >
                <div className="relative h-full bg-white border border-gray-300 p-8 transition-all duration-300 hover:shadow-xl">
                  {/* Content */}
                  <div className="text-center space-y-4">
                    <div>
                      <p className={`text-xs font-bold tracking-[0.3em] ${feature.accent} mb-2`}>
                        {feature.subtitle}
                      </p>
                      <h3 className="text-lg font-black text-gray-900">
                        {feature.title}
                      </h3>
                    </div>
                    <div className="h-px bg-gray-300 w-12 mx-auto"></div>
                    <p className="text-sm text-gray-600 leading-relaxed uppercase">
                      {feature.description}
                    </p>
                  </div>
                  
                  {/* Decorative corner elements */}
                  <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-gray-400"></div>
                  <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-gray-400"></div>
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-gray-400"></div>
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-gray-400"></div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function MenuSection() {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  // Center offsets for menu images - adjusted for better alignment
  const menuCenterOffsets: { [key: string]: { x: number; y: number } } = {
    "Cheese Burger": { x: -2, y: 15 },  // Reduced y offset for better spacing
    "Double Cheese Burger": { x: 1, y: 13 },
    "Jalapeño Cheese Burger": { x: 0, y: 15 },  // Added jalapeño
    "Buffalo Ranch Chicken Sandwich": { x: -1, y: 10 },
    "Nashville Hot Chicken Sandwich": { x: 0, y: 12 },  // Added nashville
    "Sweet Chili Chicken Sandwich": { x: 0, y: 10 },  // Added sweet chili
    "Nutella Milkshake": { x: 0, y: 10 },
    "Cookies N' Cream Milkshake": { x: 0, y: 10 },
    "Vanilla Milkshake": { x: 0, y: 23 },  // Added vanilla
    "Strawberry Milkshake": { x: 0, y: 25 },  // Added strawberry
    "3 Hot Tenders": { x: 0, y: 10 },
    "Fries": { x: 0, y: 20 },  // Added fries
    "Loaded Beef Fries": { x: 0, y: 15 },  // Added loaded beef
    "Loaded Hot Chicken Fries": { x: 0, y: 15 },  // Added loaded chicken
  };

  const menuData = {
    burgers: {
      items: [
        {
          name: "Cheese Burger",
          price: "$6.97",
          description: "100% fresh beef burger served with American cheese, grilled onions, pickles and house sauce on a potato bun",
          image: currentImages.burgers.cheeseBurger,
          imageType: "photo",
          popular: false,
          orderLink: "https://www.clover.com/online-ordering/steiny-bs-brooklyn/C3CVKS2TPGWWW",
        },
        {
          name: "Double Cheese Burger",
          price: "$9.97",
          description: "100% fresh beef burger served with American cheese, grilled onions, pickles and house sauce on a potato bun",
          image: currentImages.burgers.doubleCheeseBurger,
          imageType: "photo",
          orderLink: "https://www.clover.com/online-ordering/steiny-bs-brooklyn/CVGWXFW2Z7TP6",
        },
        {
          name: "Jalapeño Cheese Burger",
          price: "$8.47",
          description: "100% fresh beef burger served with pepper jack cheese, grilled onions, pickles and jalapeño cream sauce on a potato bun",
          addon: "Make it a double - $11.47",
          image: currentImages.burgers.jalapenoCheeseBurger,
          imageType: "photo",
          spicy: true,
          orderLink: "https://www.clover.com/online-ordering/steiny-bs-brooklyn/X1WTD4T07PBWP",
        },
      ],
    },
    chicken: {
      items: [
        {
          name: "Nashville Hot Chicken Sandwich",
          price: "$9.97",
          description: "Hand breaded chicken breast, pickles, white American cheese, coleslaw, house sauce, served on a brioche bun",
          addon: "Mild, Medium, Hot, Extra Hot",
          image: currentImages.chicken.nashvilleHot,
          imageType: "photo",
          popular: false,
          spicy: true,
          orderLink: "https://www.clover.com/online-ordering/steiny-bs-brooklyn/TYH6MAVPY5GAR",
        },
        {
          name: "Buffalo Ranch Chicken Sandwich",
          price: "$9.97",
          description: "Hand breaded chicken breast, pickles, American cheese, house sauce, served on a brioche bun",
          image: currentImages.chicken.buffaloRanch,
          imageType: "photo",
          orderLink: "https://www.clover.com/online-ordering/steiny-bs-brooklyn/EDB849T7PNB9P",
        },
        {
          name: "Sweet Chili Chicken Sandwich",
          price: "$9.97",
          description: "Hand breaded chicken breast, pickles, American cheese, sriracha mayo sauce, sesame seeds, scallion served on a brioche bun",
          image: currentImages.chicken.sweetChili,
          imageType: "photo",
          orderLink: "https://www.clover.com/online-ordering/steiny-bs-brooklyn/F7Y4HXY465Z2M",
        },
      ],
    },
    sides: {
      items: [
        {
          name: "Fries",
          price: "$4.47",
          description: "Crispy golden perfection",
          addon: "Add Spice 49¢",
          orderLink: "https://www.clover.com/online-ordering/steiny-bs-brooklyn/X6P772FGK9YC0",
        },
        {
          name: "Loaded Beef Fries",
          price: "$11.47",
          description: "Two beef patties chopped up with shredded American cheese, crispy onions, jalapeños served on fries",
          image: currentImages.sides.loadedBeefFries,
          imageType: "photo",
          orderLink: "https://www.clover.com/online-ordering/steiny-bs-brooklyn/W56Q7KXCT872M",
        },
        {
          name: "Loaded Hot Chicken Fries",
          price: "$11.47",
          description: "Two hand breaded chicken tenders chopped up with shredded white American cheese, crispy onions, jalapeños, and coleslaw served on fries",
          image: currentImages.sides.loadedChickenFries,
          imageType: "photo",
          spicy: true,
          orderLink: "https://www.clover.com/online-ordering/steiny-bs-brooklyn/8H30TPDGX0CQJ",
        },
        {
          name: "3 Hot Tenders",
          price: "$7.49",
          description: "With Texas Toast",
          addon: "Mild, Medium, Hot, Extra Hot",
          image: currentImages.sides.tenders,
          imageType: "photo",
          orderLink: "https://www.clover.com/online-ordering/steiny-bs-brooklyn/0X6TSR781NHNY",
        },
        {
          name: "Butter Milk Biscuit",
          price: "$2.47",
          description: "Fluffy and buttery",
        },
        {
          name: "Sauce",
          price: "49¢",
          description: "Extra sauce for your meal",
        },
      ],
    },
    shakes: {
      items: [
        {
          name: "Vanilla Milkshake",
          price: "$9.49",
          description: "Creamy vanilla goodness",
          image: currentImages.drinks.vanillaShake,
          imageType: "photo",
        },
        {
          name: "Nutella Milkshake",
          price: "$9.49",
          description: "Rich chocolate hazelnut dream",
          image: currentImages.drinks.nutellaShake,
          imageType: "photo",
        },
        {
          name: "Cookies N' Cream Milkshake",
          price: "$9.49",
          description: "Oreo cookies blended to perfection",
          image: currentImages.drinks.oreoShake,
          imageType: "photo",
        },
      ],
    },
    drinks: {
      items: [
        {
          name: "Dr. Pepper",
          price: "$1.75",
          description: "",
          image: currentImages.drinks.softDrinks,
          imageType: "photo",
        },
        {
          name: "Diet Coke",
          price: "$1.75",
          description: "",
          image: currentImages.drinks.softDrinks,
          imageType: "photo",
        },
        {
          name: "Coca Cola",
          price: "$1.75",
          description: "",
          image: currentImages.drinks.softDrinks,
          imageType: "photo",
        },
        {
          name: "Sprite",
          price: "$1.75",
          description: "",
          image: currentImages.drinks.softDrinks,
          imageType: "photo",
        },
        {
          name: "Fanta",
          price: "$1.75",
          description: "",
          image: currentImages.drinks.softDrinks,
          imageType: "photo",
        },
      ],
    },
  };

  return (
    <section id="menu" ref={ref} className="py-8 lg:py-12 bg-gray-50 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-6xl font-black mb-6">
            OUR <span className="gradient-text">MENU</span>
          </h2>
          <p className="text-xl text-gray-600 uppercase tracking-wider font-bold">EVERY BITE TELLS A STORY OF FLAVOR</p>
        </motion.div>

        <Tabs.Root defaultValue="burgers" className="w-full">
          <Tabs.List className="flex flex-wrap justify-center gap-4 mb-12">
            {Object.entries(menuData).map(([key, category]) => (
              <Tabs.Trigger
                key={key}
                value={key}
                className="group relative px-10 py-4 font-bold text-lg transition-all duration-300 bg-white text-gray-700 hover:text-gray-900 hover:bg-gray-100 data-[state=active]:text-brand-green data-[state=active]:bg-gray-100 border-2 border-gray-300 hover:border-gray-400 data-[state=active]:border-brand-green rounded-lg shadow-md hover:shadow-lg data-[state=active]:shadow-lg"
                style={{
                  fontFamily: '"Playfair Display", serif',
                  letterSpacing: '0.2em'
                }}
              >
                <span className="uppercase">{key}</span>
              </Tabs.Trigger>
            ))}
          </Tabs.List>

          {Object.entries(menuData).map(([key, category]) => (
            <Tabs.Content key={key} value={key}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {category.items.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -10, scale: 1.02 }}
                  >
                    <Tilt
                      tiltMaxAngleX={10}
                      tiltMaxAngleY={10}
                      className="h-full"
                    >
                      <div className="menu-card p-6 pt-0 rounded-3xl h-full relative overflow-hidden group cursor-pointer flex flex-col">
                        {item.popular && (
                          <div className="absolute top-4 left-4 bg-blue-400 text-white px-3 py-1 rounded-full text-sm font-bold z-10 flex items-center gap-1 shadow-lg">
                            <span>🔥</span>
                            <span>Popular</span>
                          </div>
                        )}
                        
                        {/* Large centered image or blank space */}
                        <div className="relative w-full flex justify-center items-center mb-4 -mt-20 flex-shrink-0">
                          <div className="relative w-80 h-56 md:w-96 md:h-72 lg:w-[28rem] lg:h-[18rem]">
                            {item.image ? (
                              <img 
                                src={item.image} 
                                alt={item.name}
                                className="w-full h-full object-contain drop-shadow-2xl group-hover:scale-110 transition-transform duration-500"
                                style={{
                                  transform: `translate(${(menuCenterOffsets[item.name]?.x || 0) * 2}px, ${(menuCenterOffsets[item.name]?.y || 0) * 2}px) ${
                                    (item.name === "Nutella Milkshake" || item.name === "Cookies N' Cream Milkshake") ? "scale(1.3)" : 
                                    (item.name === "Buffalo Ranch Chicken Sandwich" || item.name === "Sweet Chili Chicken Sandwich") ? "scale(1.3)" : ""
                                  }`
                                }}
                              />
                            ) : (
                              <div className="w-full h-full" />
                            )}
                          </div>
                        </div>
                        
                        <div className="flex flex-col flex-grow justify-between">
                          <div className="space-y-3">
                            <div>
                              <h3 className="text-xl font-bold text-gray-800 mb-1">
                                {item.name}
                                {item.spicy && <span className="ml-2">🌶️</span>}
                              </h3>
                              <p className="text-gray-600">{item.description}</p>
                              {item.addon && (
                                <p className="text-sm text-brand-green font-medium mt-1">{item.addon}</p>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between mt-auto pt-4">
                            <p className="text-3xl font-black text-brand-green">{item.price}</p>
                            <motion.a
                              href={item.orderLink || "https://www.clover.com/online-ordering/steiny-bs-brooklyn"}
                              target="_blank"
                              rel="noopener noreferrer"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="inline-block px-6 py-3 rounded-full font-bold shadow-lg hover:shadow-xl transition-shadow"
                              style={{ 
                                background: 'linear-gradient(to right, #006838, #008947)',
                                color: 'white'
                              }}
                            >
                              ORDER NOW
                            </motion.a>
                          </div>
                        </div>
                      </div>
                    </Tilt>
                  </motion.div>
                ))}
              </motion.div>
            </Tabs.Content>
          ))}
        </Tabs.Root>

        {/* Combo Deal - Classic Vintage Style */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3 }}
          className="mt-20 relative"
        >
          <div className="max-w-4xl mx-auto">
            {/* Classic bordered box design */}
            <div className="relative bg-white border-4 border-double border-gray-800 p-12 lg:p-16">
              {/* Corner ornaments */}
              <div className="absolute -top-3 -left-3 w-6 h-6 bg-white border-2 border-gray-800"></div>
              <div className="absolute -top-3 -right-3 w-6 h-6 bg-white border-2 border-gray-800"></div>
              <div className="absolute -bottom-3 -left-3 w-6 h-6 bg-white border-2 border-gray-800"></div>
              <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-white border-2 border-gray-800"></div>
              
              <div className="text-center space-y-6">
                {/* Vintage style header */}
                <div>
                  <p className="text-sm font-bold tracking-[0.3em] text-gray-600 mb-3">SPECIAL OFFER</p>
                  <h3 className="text-4xl lg:text-5xl font-serif text-gray-900 mb-2">
                    Make It A Combo
                  </h3>
                  <div className="flex items-center justify-center gap-4 mt-4">
                    <div className="h-px bg-gray-400 w-20"></div>
                    <svg className="w-6 h-6 text-brand-green" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    <div className="h-px bg-gray-400 w-20"></div>
                  </div>
                </div>
                
                {/* Menu items */}
                <div className="space-y-3">
                  <p className="text-xl text-gray-700 font-serif">
                    Add to any sandwich, burger, or chicken item
                  </p>
                  <div className="flex items-center justify-center gap-3 text-lg font-bold text-gray-800">
                    <span>FRIES</span>
                    <span className="text-brand-green">+</span>
                    <span>DRINK</span>
                  </div>
                </div>
                
                {/* Price */}
                <div className="pt-4">
                  <div className="inline-block border-t-4 border-b-4 border-gray-800 py-4 px-8">
                    <div className="flex items-baseline justify-center gap-2">
                      <span className="text-2xl font-serif text-gray-700">Only</span>
                      <span className="text-6xl font-black text-brand-green">$4</span>
                      <span className="text-3xl font-bold text-gray-800">.00</span>
                    </div>
                    <p className="text-sm font-bold tracking-wider text-gray-600 mt-2">ADDITIONAL</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function LocationSection() {
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  return (
    <section id="location" ref={ref} className="py-12 lg:py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 lg:mb-16"
        >
          <h2 className="text-3xl lg:text-5xl font-black mb-2">
            FIND <span className="text-brand-green">US</span>
          </h2>
        </motion.div>

        {/* Mobile Layout */}
        <div className="md:hidden space-y-3 max-w-lg mx-auto">
          {/* Location Card */}
          <motion.a
            href="https://maps.google.com/?q=942+Flatbush+Ave+Brooklyn+NY+11226"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="block bg-gray-50 rounded-xl p-5 border border-gray-100"
          >
            <div className="flex items-center">
              <MapPin className="w-5 h-5 text-brand-green mr-3" />
              <div className="flex-1">
                <p className="font-semibold text-gray-900">942 Flatbush Ave</p>
                <p className="text-sm text-gray-600">Brooklyn, NY 11226</p>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400" />
            </div>
          </motion.a>

          {/* Hours Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-gray-50 rounded-xl p-5 border border-gray-100"
          >
            <div className="flex items-start">
              <Clock className="w-5 h-5 text-brand-green mr-3 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-gray-900 mb-2">Hours</p>
                <div className="text-sm text-gray-600 space-y-1">
                  <div className="flex justify-between">
                    <span>Mon-Thu</span>
                    <span className="font-medium">11am - 10pm</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fri-Sat</span>
                    <span className="font-medium">11am - 11pm</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span className="font-medium">12pm - 9pm</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Card */}
          <motion.a
            href="tel:2125550123"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="block bg-gray-50 rounded-xl p-5 border border-gray-100 group"
          >
            <div className="flex items-center">
              <Phone className="w-5 h-5 text-brand-green mr-3" />
              <div className="flex-1">
                <p className="font-semibold text-gray-900">Call to Order</p>
                <p className="text-sm text-gray-600 group-hover:text-brand-green transition-colors">(212) 555-0123</p>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.a>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {/* Location */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-center"
          >
            <div className="mb-4">
              <MapPin className="w-8 h-8 text-brand-green mx-auto" />
            </div>
            <h3 className="text-xl font-bold mb-3 uppercase tracking-wider">LOCATION</h3>
            <p className="text-gray-600 mb-4">
              942 Flatbush Ave<br />
              Brooklyn, NY 11226
            </p>
            <a
              href="https://maps.google.com/?q=942+Flatbush+Ave+Brooklyn+NY+11226"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-brand-green hover:text-brand-dark font-medium transition-colors"
            >
              GET DIRECTIONS
              <ArrowRight className="w-4 h-4 ml-1" />
            </a>
          </motion.div>

          {/* Hours */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center"
          >
            <div className="mb-4">
              <Clock className="w-8 h-8 text-brand-green mx-auto" />
            </div>
            <h3 className="text-xl font-bold mb-3 uppercase tracking-wider">HOURS</h3>
            <div className="text-gray-600 space-y-2">
              <div>
                <p className="font-medium text-gray-800">Mon - Thu</p>
                <p>11:00 AM - 10:00 PM</p>
              </div>
              <div>
                <p className="font-medium text-gray-800">Fri - Sat</p>
                <p>11:00 AM - 11:00 PM</p>
              </div>
              <div>
                <p className="font-medium text-gray-800">Sunday</p>
                <p>12:00 PM - 9:00 PM</p>
              </div>
            </div>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center"
          >
            <div className="mb-4">
              <Phone className="w-8 h-8 text-brand-green mx-auto" />
            </div>
            <h3 className="text-xl font-bold mb-3 uppercase tracking-wider">CONTACT</h3>
            <p className="text-gray-600 mb-4">
              READY TO ORDER?<br />
              <span className="text-2xl font-bold text-gray-900">(212) 555-0123</span>
            </p>
            <a
              href="tel:2125550123"
              className="inline-flex items-center text-brand-green hover:text-brand-dark font-medium transition-colors"
            >
              CALL NOW
              <ArrowRight className="w-4 h-4 ml-1" />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  return (
    <section id="contact" ref={ref} className="py-8 lg:py-12 bg-white relative overflow-hidden">
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute -top-20 -left-20 w-96 h-96 bg-brand-green/5 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 12, repeat: Infinity }}
        className="absolute -bottom-20 -right-20 w-96 h-96 bg-brand-green/5 rounded-full blur-3xl"
      />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="text-4xl lg:text-6xl font-black mb-6 text-gray-900 uppercase tracking-wider">
            HUNGRY YET?
          </h2>
          <p className="text-xl lg:text-2xl mb-12 text-gray-700 uppercase font-bold tracking-wider">
            ORDER NOW FOR PICKUP OR DELIVERY AND TASTE THE DIFFERENCE
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <motion.a
              href="https://www.clover.com/online-ordering/steiny-bs-brooklyn"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group inline-flex px-8 py-4 rounded-full text-lg font-bold shadow-2xl hover:shadow-3xl transition-all items-center justify-center gap-2"
              style={{ backgroundColor: '#006838', color: 'white' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#004526'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#006838'}
            >
              <ShoppingBag className="w-5 h-5" />
              ORDER FOR PICKUP
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.a>
            <motion.a
              href="https://www.clover.com/online-ordering/steiny-bs-brooklyn"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group inline-flex px-8 py-4 rounded-full text-lg font-bold shadow-2xl hover:shadow-3xl transition-all items-center justify-center gap-2"
              style={{ backgroundColor: '#006838', color: 'white' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#004526'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#006838'}
            >
              <Zap className="w-5 h-5" />
              ORDER FOR DELIVERY
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.a>
          </div>

          {/* Social Links */}
          <div className="flex justify-center gap-6">
            <motion.a
              href="https://www.instagram.com/steiny.bs/"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.2, rotate: 360 }}
              whileTap={{ scale: 0.9 }}
              className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <Instagram className="w-6 h-6 text-gray-700" />
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center">
          <p className="text-gray-500 mb-2 uppercase tracking-wider font-bold">© 2025 STEINY&apos;S. ALL RIGHTS RESERVED.</p>
          <p className="text-gray-500 uppercase tracking-wider font-bold">
            WEBSITE DESIGNED AND DEVELOPED BY{' '}
            <a 
              href="https://franklinreitzas.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-brand-green hover:text-brand-light transition-colors font-semibold underline"
            >
              FRANKLIN REITZAS
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}