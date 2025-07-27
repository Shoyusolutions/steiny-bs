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
  Instagram, Facebook, Twitter
} from "lucide-react";
import { cn } from "@/lib/utils";
import Loading from "@/components/Loading";
import { currentImages } from "@/lib/images";

function MobileCarousel({ menuItems }: { menuItems: any[] }) {
  const [imagesLoaded, setImagesLoaded] = useState(false);
  
  // Duplicate items for infinite scroll effect - need 4 sets for seamless loop
  const duplicatedItems = [...menuItems, ...menuItems, ...menuItems, ...menuItems];
  
  // Preload all images
  useEffect(() => {
    const imagePromises = menuItems.map((item) => {
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
  }, [menuItems]);
  
  return (
    <div className="relative w-full h-[45vh] overflow-visible flex items-center">
      {!imagesLoaded ? (
        <div className="flex items-center justify-center w-full">
          <div className="w-16 h-16 border-4 border-brand-green border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <motion.div
          className="flex gap-[-8rem]"
          animate={{
            x: ["0%", "-75%"],
          }}
          transition={{
            x: {
              duration: menuItems.length * 45.5, // 45.5 seconds per item (30% slower)
              repeat: Infinity,
              ease: "linear",
              repeatType: "loop",
              repeatDelay: 0,
            },
          }}
        >
          {duplicatedItems.map((item, index) => (
            <motion.div
              key={`${item.name}-${index}`}
              className="flex-shrink-0 w-[85vw] flex items-center justify-center"
              animate={{
                y: [0, -20, 0],
              }}
              transition={{
                y: {
                  duration: 3 + (index % menuItems.length) * 0.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }
              }}
            >
              <img 
                src={item.image}
                alt={item.name}
                className="w-[125vw] h-[125vw] max-w-[800px] max-h-[800px] object-contain"
                style={{ 
                  filter: 'drop-shadow(0 10px 20px rgba(0, 0, 0, 0.2))',
                  transform: item.name === 'Hot Tenders' ? 'translateY(-40px)' : 'translateY(0)'
                }}
              />
            </motion.div>
          ))}
        </motion.div>
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
      window.location.href = 'https://google.com';
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
      className="relative w-full h-16 bg-gray-200 rounded-full overflow-hidden"
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.span 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="text-gray-600 font-semibold"
        >
          Swipe to Order
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
        className="absolute left-0 top-0 h-full w-16 bg-brand-green rounded-full cursor-grab active:cursor-grabbing flex items-center justify-center shadow-lg"
        style={{
          background: isCompleted ? '#008947' : '#006738',
        }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <ChevronDown className="w-6 h-6 text-white rotate-[-90deg]" />
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
        <HeroSection scaleProgress={scaleProgress} opacityProgress={opacityProgress} activeSection={activeSection} />
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
    const handleScroll = () => setIsScrolled(window.scrollY > window.innerHeight - 100);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Mobile menu button - always visible */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="md:hidden fixed top-4 left-4 z-50 text-brand-green p-2 bg-white rounded-full shadow-lg"
      >
        {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
      </motion.button>
      
      {/* Desktop nav - only visible when scrolled */}
      {isScrolled && (
        <motion.nav
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="hidden md:block fixed top-0 w-full z-40 navbar-blur shadow-lg py-2 sm:py-3"
        >
      <div className="container mx-auto px-4">
        <div className="flex justify-center items-center">
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {["home", "about", "menu", "location", "contact"].map((item) => (
              <motion.a
                key={item}
                href={`#${item}`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "font-medium transition-colors capitalize",
                  activeSection === item 
                    ? "text-brand-green" 
                    : "text-gray-700 hover:text-brand-green"
                )}
              >
                {item}
              </motion.a>
            ))}
            {isScrolled && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-white px-6 py-3 rounded-full font-bold shadow-lg transition-all"
                style={{ backgroundColor: '#006738' }}
              >
                Order Now
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
      )}
    </>
  );
}

function MobileMenu({ isOpen, setIsOpen }: any) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{ type: "spring", damping: 20 }}
          className="fixed inset-y-0 left-0 w-full max-w-sm bg-white z-50 shadow-2xl md:hidden"
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
                  className="text-2xl font-bold text-gray-800 hover:text-brand-green transition-colors capitalize"
                >
                  {item}
                </motion.a>
              ))}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-brand-green text-white px-8 py-4 rounded-full font-bold text-lg shadow-xl hover:bg-brand-dark transition-colors mt-4"
              >
                Order Now
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function HeroSection({ scaleProgress, opacityProgress, activeSection }: any) {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });
  
  const [hideSwipeButton, setHideSwipeButton] = useState(false);
  
  useEffect(() => {
    const checkSectionVisibility = () => {
      const contactSection = document.getElementById('contact');
      const menuSection = document.getElementById('menu');
      
      if (contactSection && menuSection) {
        const contactRect = contactSection.getBoundingClientRect();
        const menuRect = menuSection.getBoundingClientRect();
        
        // Hide button if contact section OR menu section is visible in viewport
        const hideForContact = contactRect.top < window.innerHeight && contactRect.bottom > 0;
        const hideForMenu = menuRect.top < window.innerHeight && menuRect.bottom > 0;
        
        setHideSwipeButton(hideForContact || hideForMenu);
      }
    };
    
    window.addEventListener('scroll', checkSectionVisibility);
    checkSectionVisibility(); // Check on mount
    
    return () => window.removeEventListener('scroll', checkSectionVisibility);
  }, []);
  
  // Calibrated center offsets for each menu item
  const centerOffsets = {
    "Buffalo Ranch": { x: -0.75, y: 7.5 },
    "Cheese Burger": { x: -1.5, y: 21 },
    "Nutella Shake": { x: 0, y: 18.75 },
    "Double Cheese": { x: -25, y: 9.75 },
    "Hot Tenders": { x: 0, y: 26.25 },
    "Oreo Shake": { x: -0.75, y: 22.5 }
  };

  const floatingAnimation = useReactSpring({
    from: { transform: "translateY(0px)" },
    to: async (next) => {
      while (true) {
        await next({ transform: "translateY(-20px)" });
        await next({ transform: "translateY(0px)" });
      }
    },
    config: { duration: 3000 },
  });

  // Menu items that will fly in from bottom
  // Reordered to show chicken burger, smash burger, shake on mobile
  const menuItems = [
    { image: currentImages.chicken.buffaloRanch, name: "Buffalo Ranch", delay: 0 },
    { image: currentImages.burgers.cheeseBurger, name: "Cheese Burger", delay: 0.1 },
    { image: currentImages.drinks.nutellaShake, name: "Nutella Shake", delay: 0.2 },
    { image: currentImages.burgers.doubleCheeseBurger, name: "Double Cheese", delay: 0.3 },
    { image: currentImages.sides.tenders, name: "Hot Tenders", delay: 0.4 },
    { image: currentImages.drinks.oreoShake, name: "Oreo Shake", delay: 0.5 },
  ];

  return (
    <section id="home" ref={ref} className="relative min-h-screen flex items-start sm:items-center justify-center overflow-x-hidden overflow-y-auto pt-16 sm:py-4" style={{ backgroundColor: '#ffffff' }}>
      {/* Animated Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-10" style={{
          background: 'linear-gradient(to bottom right, #f0f0f0, #fafafa, #ffffff)'
        }} />
        {/* Subtle Pattern */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23006838' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="relative z-10 w-full flex flex-col items-center justify-center min-h-full">
        <div className="flex flex-col items-center justify-center w-full">
          {/* Center Text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, type: "spring" }}
            className="text-center relative z-20 mb-0 mt-0 sm:mt-[10vh] md:mt-[8vh] lg:mt-6 xl:mt-8 mx-0 sm:mx-4 px-0 sm:px-4 py-0 sm:py-2 flex flex-col items-center justify-center w-full"
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 }}
              className="mb-2 sm:mb-8 lg:mb-10"
            >
              <img 
                src="https://general-public-image-buckets.s3.amazonaws.com/steiny/images/branding/logo-primary.jpeg"
                alt="Steiny's Logo - Smashed to Perfection"
                className="w-[calc(100vw-32px)] sm:w-72 md:w-80 lg:w-96 xl:w-[28rem] 2xl:w-[36rem] h-auto mx-auto drop-shadow-2xl"
              />
            </motion.div>

            {/* Navigation Menu Below Logo */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 }}
              className="hidden sm:flex items-center gap-6 md:gap-8 lg:gap-12 xl:gap-16 mb-2 sm:mb-3"
            >
              {["home", "about", "menu", "location", "contact"].map((item) => (
                <motion.a
                  key={item}
                  href={`#${item}`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    "text-sm md:text-base lg:text-lg font-bold transition-colors capitalize",
                    activeSection === item 
                      ? "text-brand-green" 
                      : "text-gray-700 hover:text-brand-green"
                  )}
                >
                  {item}
                </motion.a>
              ))}
            </motion.div>

            {/* Mobile: Single item carousel */}
            <div className="sm:hidden w-full flex justify-center items-center -mt-12 mb-0">
              <MobileCarousel menuItems={menuItems} />
            </div>

            {/* Desktop: Menu items in a horizontal line */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.5 }}
              className="hidden sm:flex gap-0 justify-center items-center my-0 w-full mx-auto px-0 sm:px-[2vw] overflow-visible"
            >
              {menuItems.map((item, index) => {
                // Get the offset for this item
                const rawOffset = centerOffsets[item.name] || { x: 0, y: 0 };
                
                // Scale the offsets based on fixed size
                // Using xl size (224px) as reference
                const scaleFactor = 224 / 192; // Scale from original 192px calibration
                const offset = {
                  x: rawOffset.x * scaleFactor,
                  y: rawOffset.y * scaleFactor
                };
                
                // Hide items based on screen size to ensure no cutoff
                // Mobile: show first 3 (chicken, burger, shake), Small: show first 4, Medium: show first 5, Large+: show all 6
                // Show all 6 items on all screen sizes
                let hiddenClass = '';
                
                return (
                  <div
                    key={item.name}
                    className={`relative ${hiddenClass}`}
                    style={{
                      // Move the entire container up by the Y offset amount
                      // This makes all red dots align on the same horizontal line
                      marginTop: `${-offset.y}px`,
                      marginLeft: `${offset.x}px`
                    }}
                  >
                    <motion.div
                      animate={{
                        y: [0, -10, 0],
                      }}
                      transition={{
                        duration: 3 + index * 0.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="w-[20vw] sm:w-[25vw] h-[20vw] sm:h-[25vw] max-w-[35rem] max-h-[35rem] min-w-24 sm:min-w-32 min-h-24 sm:min-h-32 flex items-center justify-center relative flex-shrink-0 -mx-[3vw] sm:-mx-[5vw]"
                    >
                  <img 
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-contain"
                    style={{ 
                      filter: 'drop-shadow(0 20px 40px rgba(0, 0, 0, 0.4))'
                    }}
                  />
                  
                    </motion.div>
                  </div>
                );
              })}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.6 }}
              className="mb-1 sm:mb-2 mt-4 sm:mt-0"
            >
              <div className="flex flex-col items-center space-y-1">
                <div className="text-brand-green font-black text-xl sm:text-lg md:text-xl lg:text-2xl xl:text-3xl tracking-[0.3em] sm:tracking-[0.6em] md:tracking-[0.8em] lg:tracking-[1em] uppercase whitespace-nowrap" style={{ fontWeight: 900 }}>
                  SMASH BURGERS
                </div>
                <div className="flex items-center justify-center space-x-3 text-base sm:text-base md:text-lg lg:text-xl xl:text-2xl">
                  <span className="text-gray-800 font-bold">FRIES</span>
                  <span className="text-brand-green text-xl sm:text-xl md:text-2xl lg:text-3xl">•</span>
                  <span className="text-gray-800 font-bold">HOT CHICKEN</span>
                  <span className="text-brand-green text-xl sm:text-xl md:text-2xl lg:text-3xl">•</span>
                  <span className="text-gray-800 font-bold">SHAKES</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5 }}
              className="flex justify-center fixed bottom-8 left-0 right-0 sm:relative sm:bottom-auto sm:mb-8 w-full px-4 z-50"
            >
              {/* Mobile: Swipe to Order - Hide when contact section is visible */}
              {!hideSwipeButton && (
                <div className="sm:hidden w-full max-w-xs">
                  <SwipeToOrder />
                </div>
              )}
              
              {/* Desktop: Regular Button */}
              <motion.a
                href="#order"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="hidden sm:flex text-white px-8 py-4 lg:px-10 lg:py-5 xl:px-12 xl:py-6 rounded-full text-lg lg:text-xl xl:text-2xl font-bold shadow-xl hover:shadow-2xl transition-all items-center justify-center"
                style={{ backgroundColor: '#006738' }}
              >
                Order Online
              </motion.a>
            </motion.div>
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
      icon: "🏆",
      title: "NYC's Top Smashburgers",
      subtitle: "VOTED #1",
      description: "Voted NYC's Top Smashburgers 2025",
      gradient: "from-yellow-500 to-amber-500",
    },
    {
      icon: "🌿",
      title: "Premium Ingredients",
      subtitle: "ALWAYS FRESH",
      description: "Hand-smashed beef & crispy chicken",
      gradient: "from-red-500 to-orange-500",
    },
    {
      icon: "☪️",
      title: "100% Halal",
      subtitle: "CERTIFIED",
      description: "Premium ingredients you can trust",
      gradient: "from-brand-green to-emerald-500",
    },
    {
      icon: "🔥",
      title: "Always Fresh",
      subtitle: "MADE TO ORDER",
      description: "Hot off the grill, every time",
      gradient: "from-orange-500 to-red-500",
    },
  ];

  return (
    <section id="about" ref={ref} className="py-6 lg:py-12 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-4xl lg:text-6xl font-black mb-6 text-center">
            OUR <span className="gradient-text">STORY</span>
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 items-center max-w-4xl mx-auto mb-8">
            <div className="order-2 md:order-1">
              <p className="text-xl text-gray-600 leading-relaxed">
                The meaning behind our name, Steiny B's, is a tribute to <span className="font-bold text-brand-green">Lionel Sternberger</span>, 
                who is reputed to have introduced the cheeseburger in 1924 at the age of 16. 
                Steiny is contributed to his name 'Sternberger' and B's is contributed to our signature smash burgers.
              </p>
            </div>
            <motion.div 
              className="order-1 md:order-2 flex justify-center"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <img 
                src="https://general-public-image-buckets.s3.amazonaws.com/steiny/images/history/lionel-sternberger.png"
                alt="Lionel Sternberger - Inventor of the Cheeseburger"
                className="w-48 h-48 sm:w-64 sm:h-64 lg:w-72 lg:h-72 object-contain rounded-2xl shadow-xl"
              />
            </motion.div>
          </div>
          
          <div className="text-center max-w-3xl mx-auto">
            <h3 className="text-2xl lg:text-3xl font-bold mb-3 text-gray-800">WHAT WE STAND FOR</h3>
            <p className="text-xl text-gray-600 leading-relaxed">
              At Steiny B's, we prepare our signature smash burgers, made to order, with 100% fresh beef, 
              hand-smashed on a hot grill to sear in the juices and deliver a crispy caramelized crust. 
              Our menu also features fries • hot chicken • shakes.
            </p>
          </div>
        </motion.div>

        <div className="relative">
          {/* Background decoration */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[600px] h-[300px] bg-brand-green/5 rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
                className="group relative"
              >
                {/* Card */}
                <div className="relative h-full">
                  {/* Gradient background on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                  
                  <div className="relative bg-white p-4 md:p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 h-full border border-gray-100 group-hover:border-transparent">
                    {/* Static icon */}
                    <div className="text-4xl md:text-6xl mb-3 md:mb-6 flex justify-center">
                      {feature.icon}
                    </div>
                    
                    {/* Content */}
                    <div className="text-center space-y-2">
                      <p className={`text-xs font-black tracking-widest ${
                        feature.subtitle === "CERTIFIED" 
                          ? "text-brand-green" 
                          : `bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent`
                      }`}>
                        {feature.subtitle}
                      </p>
                      <h3 className="text-lg md:text-2xl font-black text-gray-900">
                        {feature.title}
                      </h3>
                      <p className="text-xs md:text-sm text-gray-600 leading-relaxed pt-1 md:pt-2">
                        {feature.description}
                      </p>
                    </div>
                    
                    {/* Bottom accent line */}
                    <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r ${feature.gradient} rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
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
    "Nutella Milkshake": { x: 0, y: 25 },
    "Oreo Milkshake": { x: -1, y: 30 },
    "Vanilla Milkshake": { x: 0, y: 28 },  // Added vanilla
    "Strawberry Milkshake": { x: 0, y: 26 },  // Added strawberry
    "3 Hot Tenders": { x: 0, y: 10 },
    "Fries": { x: 0, y: 20 },  // Added fries
    "Loaded Beef Fries": { x: 0, y: 15 },  // Added loaded beef
    "Loaded Hot Chicken Fries": { x: 0, y: 15 },  // Added loaded chicken
  };

  const menuData = {
    burgers: {
      icon: "🍔",
      items: [
        {
          name: "Cheese Burger",
          price: "$6.97",
          description: "100% fresh beef burger served with American cheese, grilled onions, pickles and house sauce on a potato bun",
          image: currentImages.burgers.cheeseBurger,
          imageType: "photo",
          popular: false,
        },
        {
          name: "Double Cheese Burger",
          price: "$9.97",
          description: "100% fresh beef burger served with American cheese, grilled onions, pickles and house sauce on a potato bun",
          image: currentImages.burgers.doubleCheeseBurger,
          imageType: "photo",
          popular: true,
        },
        {
          name: "Jalapeño Cheese Burger",
          price: "$8.47",
          description: "100% fresh beef burger served with pepper jack cheese, grilled onions, pickles and jalapeño cream sauce on a potato bun",
          addon: "Make it a double - $11.47",
          image: currentImages.burgers.jalapenoCheeseBurger,
          imageType: "photo",
          spicy: true,
        },
      ],
    },
    chicken: {
      icon: "🍗",
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
        },
        {
          name: "Buffalo Ranch Chicken Sandwich",
          price: "$9.97",
          description: "Hand breaded chicken breast, pickles, American cheese, house sauce, served on a brioche bun",
          image: currentImages.chicken.buffaloRanch,
          imageType: "photo",
        },
        {
          name: "Sweet Chili Chicken Sandwich",
          price: "$9.97",
          description: "Hand breaded chicken breast, pickles, American cheese, sriracha mayo sauce, sesame seeds, scallion served on a brioche bun",
          image: currentImages.chicken.sweetChili,
          imageType: "photo",
        },
      ],
    },
    sides: {
      icon: "🍟",
      items: [
        {
          name: "Fries",
          price: "$4.47",
          description: "Crispy golden perfection",
          addon: "Add Spice 49¢",
          image: currentImages.sides.fries,
          imageType: "photo",
          popular: true,
        },
        {
          name: "Loaded Beef Fries",
          price: "$11.47",
          description: "Two beef patties chopped up with shredded American cheese, crispy onions, jalapeños served on fries",
          image: currentImages.sides.loadedBeefFries,
          imageType: "photo",
        },
        {
          name: "Loaded Hot Chicken Fries",
          price: "$11.47",
          description: "Two hand breaded chicken tenders chopped up with shredded white American cheese, crispy onions, jalapeños, and coleslaw served on fries",
          image: currentImages.sides.loadedChickenFries,
          imageType: "photo",
          spicy: true,
        },
        {
          name: "3 Hot Tenders",
          price: "$7.49",
          description: "With Texas Toast",
          addon: "Mild, Medium, Hot, Extra Hot",
          image: currentImages.sides.tenders,
          imageType: "photo",
        },
        {
          name: "Butter Milk Biscuit",
          price: "$2.47",
          description: "Fluffy and buttery",
          image: currentImages.sides.biscuit,
          imageType: "photo",
        },
        {
          name: "Sauce",
          price: "49¢",
          description: "Extra sauce for your meal",
          image: currentImages.sides.fries,
          imageType: "photo",
        },
      ],
    },
    drinks: {
      icon: "🥤",
      items: [
        {
          name: "Drinks",
          price: "$1.75",
          description: "Coca Cola, Coke, Dr Pepper, Sprite, 7Up, Fanta",
          image: currentImages.drinks.softDrinks,
          imageType: "photo",
        },
        {
          name: "Vanilla Milkshake",
          price: "$9.49",
          description: "Creamy vanilla goodness",
          image: currentImages.drinks.vanillaShake,
          imageType: "photo",
          popular: true,
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
          <p className="text-xl text-gray-600">Every bite tells a story of flavor</p>
        </motion.div>

        <Tabs.Root defaultValue="burgers" className="w-full">
          <Tabs.List className="flex flex-wrap justify-center gap-4 mb-12">
            {Object.entries(menuData).map(([key, category]) => (
              <Tabs.Trigger
                key={key}
                value={key}
                className="group px-6 py-3 rounded-full font-bold text-lg transition-all data-[state=active]:bg-gray-100 data-[state=active]:text-brand-green data-[state=active]:shadow-xl hover:scale-105 bg-white shadow-md text-gray-800 border-2 border-transparent data-[state=active]:border-brand-green/20"
              >
                <span className="text-2xl mr-2">{category.icon}</span>
                <span className="capitalize">{key}</span>
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
                      <div className="menu-card p-6 rounded-3xl h-full relative overflow-hidden group cursor-pointer flex flex-col">
                        {item.popular && (
                          <div className="absolute top-4 left-4 bg-blue-400 text-white px-3 py-1 rounded-full text-sm font-bold z-10 flex items-center gap-1 shadow-lg">
                            <span>🔥</span>
                            <span>Popular</span>
                          </div>
                        )}
                        
                        {/* Large centered image */}
                        {item.imageType === "photo" && (
                          <div className="relative w-full flex justify-center items-center mb-4 -mt-32 flex-shrink-0">
                            <div className="relative w-80 h-80 md:w-96 md:h-96 lg:w-[28rem] lg:h-[28rem]">
                              <img 
                                src={item.image} 
                                alt={item.name}
                                className="w-full h-full object-contain drop-shadow-2xl group-hover:scale-110 transition-transform duration-500"
                                style={{
                                  transform: `translate(${(menuCenterOffsets[item.name]?.x || 0) * 2}px, ${(menuCenterOffsets[item.name]?.y || 0) * 2}px)`
                                }}
                              />
                            </div>
                          </div>
                        )}
                        
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
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="px-6 py-3 rounded-full font-bold shadow-lg hover:shadow-xl transition-shadow"
                              style={{ 
                                background: 'linear-gradient(to right, #006838, #008947)',
                                color: 'white'
                              }}
                            >
                              Order Now
                            </motion.button>
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

        {/* Combo Deal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.3, type: "spring" }}
          className="mt-16 relative"
        >
          <div className="relative">
            {/* Background decoration */}
            <div className="absolute -inset-4 bg-gradient-to-r from-brand-green to-brand-light rounded-3xl blur-2xl opacity-20"></div>
            
            <div className="relative bg-gradient-to-br from-brand-green/10 via-white to-brand-light/10 p-8 lg:p-12 rounded-3xl border-2 border-brand-green/30 overflow-hidden">
              {/* Pattern overlay */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                  backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(0,104,56,0.1) 35px, rgba(0,104,56,0.1) 70px)`
                }}></div>
              </div>
              
              <div className="relative z-10 text-center">
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="inline-block mb-4"
                >
                  <span className="text-5xl">🍟</span>
                  <span className="text-5xl mx-2">+</span>
                  <span className="text-5xl">🥤</span>
                </motion.div>
                
                <h3 className="text-3xl lg:text-4xl font-black mb-3 text-gray-800">
                  MAKE IT A <span className="text-brand-green">COMBO</span>
                </h3>
                <p className="text-xl mb-6 text-gray-700 font-medium">
                  Make any item a combo with fries and a drink
                </p>
                
                <div className="inline-flex items-baseline gap-1 text-gray-800">
                  <span className="text-2xl font-medium">Just</span>
                  <span className="text-6xl font-black text-brand-green">$4</span>
                  <span className="text-3xl font-bold">.00</span>
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
            <h3 className="text-xl font-bold mb-3">Location</h3>
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
              Get Directions
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
            <h3 className="text-xl font-bold mb-3">Hours</h3>
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
            <h3 className="text-xl font-bold mb-3">Contact</h3>
            <p className="text-gray-600 mb-4">
              Ready to order?<br />
              <span className="text-2xl font-bold text-gray-900">(212) 555-0123</span>
            </p>
            <a
              href="tel:2125550123"
              className="inline-flex items-center text-brand-green hover:text-brand-dark font-medium transition-colors"
            >
              Call Now
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
          <h2 className="text-4xl lg:text-6xl font-black mb-6 text-gray-900">
            HUNGRY YET?
          </h2>
          <p className="text-xl lg:text-2xl mb-12 text-gray-700">
            Order now for pickup or delivery and taste the difference
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group px-8 py-4 rounded-full text-lg font-bold shadow-2xl hover:shadow-3xl transition-all flex items-center justify-center gap-2"
              style={{ backgroundColor: '#006838', color: 'white' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#004526'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#006838'}
            >
              <ShoppingBag className="w-5 h-5" />
              Order for Pickup
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group px-8 py-4 rounded-full text-lg font-bold shadow-2xl hover:shadow-3xl transition-all flex items-center justify-center gap-2"
              style={{ backgroundColor: '#006838', color: 'white' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#004526'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#006838'}
            >
              <Zap className="w-5 h-5" />
              Order for Delivery
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </div>

          {/* Social Links */}
          <div className="flex justify-center gap-6">
            {[Instagram, Facebook, Twitter].map((Icon, index) => (
              <motion.a
                key={index}
                href="#"
                whileHover={{ scale: 1.2, rotate: 360 }}
                whileTap={{ scale: 0.9 }}
                className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <Icon className="w-6 h-6 text-gray-700" />
              </motion.a>
            ))}
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
          <p className="text-gray-500 mb-2">© 2025 Steiny&apos;s. All rights reserved.</p>
          <p className="text-gray-500">
            Website Designed and Developed by{' '}
            <a 
              href="https://franklinreitzas.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-brand-green hover:text-brand-light transition-colors font-semibold underline"
            >
              Franklin Reitzas
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}