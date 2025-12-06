"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, Trophy, Brain, Users, Star, Zap, Target, Award, Book, Pen, BarChart3, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRedirectToQuizIfAuthenticated } from '@/lib/authToken';


export default function LandingPage() {


  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [published, setPublished] = useState(false);
  const [animationTime, setAnimationTime] = useState(0);
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState<boolean>(true);

  // On mount, check for existing auth token and redirect to quiz if present
  // Use shared hook to redirect and expose checking state
  const { checking } = useRedirectToQuizIfAuthenticated();

  useEffect(() => {
    setCheckingAuth(checking);
  }, [checking]);
useEffect(() => {
	const checkPublishedStatus = async () => {
		
		try {
			const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/quizzes/check-quiz-published-status`);
			const data = await response.json();
			setPublished(data?.isPublished ?? false);
		} catch (error) {
			console.error('Error fetching published status:', error);
		}
	};
	checkPublishedStatus();
}, []);

  useEffect(() => {
    setIsLoaded(true);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationTime(prev => prev + 1);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Do not early-return here (hooks must run in same order). The spinner is
  // rendered in the final JSX below when `checkingAuth` is true.

  return checkingAuth ? (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-[#df7500]"></div>
    </div>
  ) : (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Animated background elements - Studying & Progress themed */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Book-like shape */}
        <motion.div
          className="absolute top-20 left-20 w-32 h-40 bg-[#df7500]/8 rounded-lg blur-sm"
          animate={{
            x: mousePosition.x * 0.02 + scrollPosition * 0.1,
            y: mousePosition.y * 0.02 + scrollPosition * 0.05,
            rotate: Math.sin(animationTime * 0.01) * 5,
            scale: 1 + Math.cos(animationTime * 0.02) * 0.1,
          }}
          transition={{ type: "spring", stiffness: 80, damping: 25 }}
        />

        {/* Progress bar */}
        <motion.div
          className="absolute top-1/4 right-1/4 w-48 h-3 bg-[#651321]/10 rounded-full"
          animate={{
            x: mousePosition.x * -0.03,
            y: mousePosition.y * -0.03 + scrollPosition * 0.08,
            scaleX: 0.8 + Math.sin(animationTime * 0.015) * 0.2,
          }}
          transition={{ type: "spring", stiffness: 60, damping: 20 }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-[#df7500] to-[#651321] rounded-full"
            animate={{
              scaleX: 0.6 + Math.sin(animationTime * 0.02) * 0.4,
            }}
            transition={{ type: "spring", stiffness: 100, damping: 30 }}
          />
        </motion.div>

        {/* Gear/cog */}
        <motion.div
          className="absolute bottom-1/4 left-1/4 w-24 h-24 border-4 border-[#df7500]/20 rounded-full"
          animate={{
            x: mousePosition.x * 0.04 + scrollPosition * -0.05,
            y: mousePosition.y * 0.04 + scrollPosition * 0.03,
            rotate: animationTime * 2,
            scale: 1 + Math.sin(animationTime * 0.03) * 0.15,
          }}
          transition={{ type: "spring", stiffness: 70, damping: 25 }}
        />

        {/* Lightbulb/idea */}
        <motion.div
          className="absolute top-1/3 left-1/2 w-16 h-20 bg-[#651321]/8 rounded-t-full blur-sm"
          animate={{
            x: mousePosition.x * -0.02 + scrollPosition * 0.07,
            y: mousePosition.y * -0.02 + scrollPosition * -0.04,
            scale: 1 + Math.cos(animationTime * 0.025) * 0.2,
            opacity: 0.7 + Math.sin(animationTime * 0.02) * 0.3,
          }}
          transition={{ type: "spring", stiffness: 90, damping: 35 }}
        />

        {/* Graduation cap */}
        <motion.div
          className="absolute bottom-1/3 right-1/3 w-28 h-16 bg-[#df7500]/10 rounded-t-lg blur-sm"
          animate={{
            x: mousePosition.x * 0.03 + scrollPosition * -0.06,
            y: mousePosition.y * 0.03 + scrollPosition * 0.09,
            rotate: Math.sin(animationTime * 0.01) * 3,
            scale: 1 + Math.sin(animationTime * 0.035) * 0.1,
          }}
          transition={{ type: "spring", stiffness: 85, damping: 30 }}
        />

        {/* Target/goal */}
        <motion.div
          className="absolute top-2/3 left-1/4 w-20 h-20 border-2 border-[#651321]/15 rounded-full"
          animate={{
            x: mousePosition.x * -0.01 + scrollPosition * 0.04,
            y: mousePosition.y * -0.01 + scrollPosition * 0.06,
            scale: 1 + Math.cos(animationTime * 0.04) * 0.05,
          }}
          transition={{ type: "spring", stiffness: 110, damping: 40 }}
        >
          <motion.div
            className="absolute inset-2 border border-[#df7500]/20 rounded-full"
            animate={{
              scale: 0.8 + Math.sin(animationTime * 0.03) * 0.2,
            }}
            transition={{ type: "spring", stiffness: 120, damping: 45 }}
          />
          <motion.div
            className="absolute inset-4 border border-[#651321]/10 rounded-full"
            animate={{
              scale: 0.6 + Math.cos(animationTime * 0.025) * 0.3,
            }}
            transition={{ type: "spring", stiffness: 130, damping: 50 }}
          />
        </motion.div>

        {/* Pencil */}
        <motion.div
          className="absolute top-1/2 right-1/4 w-2 h-16 bg-[#df7500]/12 rounded-full blur-sm"
          animate={{
            x: mousePosition.x * 0.025 + scrollPosition * -0.08,
            y: mousePosition.y * 0.025 + scrollPosition * 0.02,
            rotate: Math.sin(animationTime * 0.02) * 10,
            scale: 1 + Math.sin(animationTime * 0.04) * 0.1,
          }}
          transition={{ type: "spring", stiffness: 95, damping: 35 }}
        />

        {/* Clock/time */}
        <motion.div
          className="absolute bottom-1/2 left-1/2 w-18 h-18 border-2 border-[#651321]/12 rounded-full"
          animate={{
            x: mousePosition.x * -0.035 + scrollPosition * 0.03,
            y: mousePosition.y * -0.035 + scrollPosition * -0.07,
            rotate: animationTime * 0.5,
            scale: 1 + Math.cos(animationTime * 0.03) * 0.15,
          }}
          transition={{ type: "spring", stiffness: 75, damping: 28 }}
        />

        {/* Additional Book */}
        <motion.div
          className="absolute top-3/4 right-20 w-24 h-32 bg-[#651321]/6 rounded-md blur-sm"
          animate={{
            x: mousePosition.x * -0.025 + scrollPosition * 0.12,
            y: mousePosition.y * -0.025 + scrollPosition * 0.04,
            rotate: Math.sin(animationTime * 0.015) * -4,
            scale: 1 + Math.cos(animationTime * 0.025) * 0.08,
          }}
          transition={{ type: "spring", stiffness: 85, damping: 30 }}
        />

        {/* Additional Gear */}
        <motion.div
          className="absolute top-1/2 left-1/4 w-16 h-16 border-3 border-[#df7500]/15 rounded-full"
          animate={{
            x: mousePosition.x * 0.02 + scrollPosition * -0.03,
            y: mousePosition.y * 0.02 + scrollPosition * 0.05,
            rotate: -animationTime * 1.5,
            scale: 1 + Math.sin(animationTime * 0.04) * 0.12,
          }}
          transition={{ type: "spring", stiffness: 90, damping: 32 }}
        />

        {/* Large Gear */}
        <motion.div
          className="absolute bottom-20 right-1/4 w-32 h-32 border-4 border-[#651321]/18 rounded-full"
          animate={{
            x: mousePosition.x * -0.04 + scrollPosition * 0.08,
            y: mousePosition.y * -0.04 + scrollPosition * -0.06,
            rotate: animationTime * 1.2,
            scale: 1 + Math.cos(animationTime * 0.02) * 0.1,
          }}
          transition={{ type: "spring", stiffness: 65, damping: 22 }}
        />

        {/* Small Book Stack */}
        <motion.div
          className="absolute top-1/4 left-1/3 w-20 h-28 bg-[#df7500]/7 rounded-sm blur-sm"
          animate={{
            x: mousePosition.x * 0.03 + scrollPosition * 0.06,
            y: mousePosition.y * 0.03 + scrollPosition * 0.02,
            rotate: Math.sin(animationTime * 0.02) * 6,
            scale: 1 + Math.sin(animationTime * 0.035) * 0.12,
          }}
          transition={{ type: "spring", stiffness: 95, damping: 35 }}
        />

        {/* Icon Patterns - Randomly placed artistic elements */}
        {/* Book Icon 1 */}
        <motion.div
          className="absolute top-16 right-32 text-[#df7500]/50"
          animate={{
            x: mousePosition.x * -0.08 + scrollPosition * 0.08,
            y: mousePosition.y * -0.08 + scrollPosition * 0.03,
            rotate: Math.sin(animationTime * 0.008) * 8,
            scale: 1 + Math.cos(animationTime * 0.012) * 0.15,
          }}
          transition={{ type: "spring", stiffness: 85, damping: 30 }}
        >
          <Book className="w-12 h-12" />
        </motion.div>

        {/* Pen Icon 1 */}
        <motion.div
          className="absolute top-1/3 right-16 text-[#651321]/55"
          animate={{
            x: mousePosition.x * 0.09 + scrollPosition * -0.04,
            y: mousePosition.y * 0.09 + scrollPosition * 0.06,
            rotate: Math.sin(animationTime * 0.015) * -12,
            scale: 1 + Math.sin(animationTime * 0.02) * 0.1,
          }}
          transition={{ type: "spring", stiffness: 90, damping: 35 }}
        >
          <Pen className="w-10 h-10" />
        </motion.div>

        {/* Gear Icon 1 */}
        <motion.div
          className="absolute bottom-1/3 left-32 text-[#df7500]/45"
          animate={{
            x: mousePosition.x * -0.11 + scrollPosition * 0.05,
            y: mousePosition.y * -0.11 + scrollPosition * -0.02,
            rotate: animationTime * 1.8,
            scale: 1 + Math.cos(animationTime * 0.025) * 0.12,
          }}
          transition={{ type: "spring", stiffness: 75, damping: 28 }}
        >
          <Settings className="w-14 h-14" />
        </motion.div>

        {/* Graph Icon 1 */}
        <motion.div
          className="absolute bottom-1/4 right-1/3 text-[#651321]/52"
          animate={{
            x: mousePosition.x * 0.085 + scrollPosition * -0.07,
            y: mousePosition.y * 0.085 + scrollPosition * 0.04,
            rotate: Math.sin(animationTime * 0.01) * 4,
            scale: 1 + Math.sin(animationTime * 0.03) * 0.08,
          }}
          transition={{ type: "spring", stiffness: 95, damping: 40 }}
        >
          <BarChart3 className="w-11 h-11" />
        </motion.div>

        {/* Book Icon 2 */}
        <motion.div
          className="absolute top-2/3 left-20 text-[#651321]/40"
          animate={{
            x: mousePosition.x * 0.06 + scrollPosition * 0.09,
            y: mousePosition.y * 0.06 + scrollPosition * -0.03,
            rotate: Math.sin(animationTime * 0.012) * -6,
            scale: 1 + Math.cos(animationTime * 0.018) * 0.18,
          }}
          transition={{ type: "spring", stiffness: 80, damping: 32 }}
        >
          <Book className="w-8 h-8" />
        </motion.div>

        {/* Pen Icon 2 */}
        <motion.div
          className="absolute top-1/2 right-2/3 text-[#df7500]/60"
          animate={{
            x: mousePosition.x * -0.095 + scrollPosition * 0.06,
            y: mousePosition.y * -0.095 + scrollPosition * 0.02,
            rotate: Math.sin(animationTime * 0.02) * 15,
            scale: 1 + Math.sin(animationTime * 0.025) * 0.14,
          }}
          transition={{ type: "spring", stiffness: 88, damping: 38 }}
        >
          <Pen className="w-9 h-9" />
        </motion.div>

        {/* Gear Icon 2 */}
        <motion.div
          className="absolute top-3/4 right-1/4 text-[#651321]/48"
          animate={{
            x: mousePosition.x * 0.12 + scrollPosition * -0.08,
            y: mousePosition.y * 0.12 + scrollPosition * 0.05,
            rotate: -animationTime * 1.3,
            scale: 1 + Math.cos(animationTime * 0.02) * 0.16,
          }}
          transition={{ type: "spring", stiffness: 82, damping: 30 }}
        >
          <Settings className="w-10 h-10" />
        </motion.div>

        {/* Graph Icon 2 */}
        <motion.div
          className="absolute bottom-16 left-1/3 text-[#df7500]/55"
          animate={{
            x: mousePosition.x * -0.07 + scrollPosition * 0.07,
            y: mousePosition.y * -0.07 + scrollPosition * -0.04,
            rotate: Math.sin(animationTime * 0.014) * -8,
            scale: 1 + Math.sin(animationTime * 0.028) * 0.11,
          }}
          transition={{ type: "spring", stiffness: 92, damping: 36 }}
        >
          <BarChart3 className="w-12 h-12" />
        </motion.div>

        {/* Book Icon 3 */}
        <motion.div
          className="absolute top-1/6 right-3/4 text-[#651321]/45"
          animate={{
            x: mousePosition.x * 0.105 + scrollPosition * 0.03,
            y: mousePosition.y * 0.105 + scrollPosition * 0.08,
            rotate: Math.sin(animationTime * 0.016) * 10,
            scale: 1 + Math.cos(animationTime * 0.022) * 0.13,
          }}
          transition={{ type: "spring", stiffness: 87, damping: 34 }}
        >
          <Book className="w-7 h-7" />
        </motion.div>

        {/* Pen Icon 3 */}
        <motion.div
          className="absolute bottom-2/3 right-12 text-[#df7500]/50"
          animate={{
            x: mousePosition.x * -0.085 + scrollPosition * -0.05,
            y: mousePosition.y * -0.085 + scrollPosition * 0.07,
            rotate: Math.sin(animationTime * 0.018) * -14,
            scale: 1 + Math.sin(animationTime * 0.024) * 0.09,
          }}
          transition={{ type: "spring", stiffness: 89, damping: 37 }}
        >
          <Pen className="w-8 h-8" />
        </motion.div>

        {/* Additional Icon Patterns for more density */}
        {/* Gear Icon 3 */}
        <motion.div
          className="absolute top-1/4 left-1/6 text-[#651321]/30"
          animate={{
            x: mousePosition.x * 0.021 + scrollPosition * 0.04,
            y: mousePosition.y * 0.021 + scrollPosition * -0.06,
            rotate: animationTime * 2.2,
            scale: 1 + Math.cos(animationTime * 0.028) * 0.14,
          }}
          transition={{ type: "spring", stiffness: 78, damping: 31 }}
        >
          <Settings className="w-13 h-13" />
        </motion.div>

        {/* Graph Icon 3 */}
        <motion.div
          className="absolute top-5/6 right-1/6 text-[#df7500]/26"
          animate={{
            x: mousePosition.x * -0.023 + scrollPosition * 0.08,
            y: mousePosition.y * -0.023 + scrollPosition * 0.02,
            rotate: Math.sin(animationTime * 0.016) * 6,
            scale: 1 + Math.sin(animationTime * 0.032) * 0.12,
          }}
          transition={{ type: "spring", stiffness: 91, damping: 39 }}
        >
          <BarChart3 className="w-10 h-10" />
        </motion.div>

        {/* Book Icon 4 */}
        <motion.div
          className="absolute bottom-1/6 left-2/3 text-[#651321]/28"
          animate={{
            x: mousePosition.x * 0.017 + scrollPosition * -0.03,
            y: mousePosition.y * 0.017 + scrollPosition * 0.09,
            rotate: Math.sin(animationTime * 0.014) * -9,
            scale: 1 + Math.cos(animationTime * 0.026) * 0.16,
          }}
          transition={{ type: "spring", stiffness: 83, damping: 33 }}
        >
          <Book className="w-9 h-9" />
        </motion.div>

        {/* Pen Icon 4 */}
        <motion.div
          className="absolute top-2/3 right-1/2 text-[#df7500]/32"
          animate={{
            x: mousePosition.x * -0.026 + scrollPosition * 0.05,
            y: mousePosition.y * -0.026 + scrollPosition * -0.04,
            rotate: Math.sin(animationTime * 0.022) * 18,
            scale: 1 + Math.sin(animationTime * 0.027) * 0.11,
          }}
          transition={{ type: "spring", stiffness: 86, damping: 35 }}
        >
          <Pen className="w-7 h-7" />
        </motion.div>

        {/* Gear Icon 4 */}
        <motion.div
          className="absolute top-1/6 left-3/4 text-[#651321]/24"
          animate={{
            x: mousePosition.x * 0.029 + scrollPosition * -0.07,
            y: mousePosition.y * 0.029 + scrollPosition * 0.06,
            rotate: -animationTime * 1.6,
            scale: 1 + Math.cos(animationTime * 0.024) * 0.13,
          }}
          transition={{ type: "spring", stiffness: 79, damping: 29 }}
        >
          <Settings className="w-11 h-11" />
        </motion.div>

        {/* Graph Icon 4 */}
        <motion.div
          className="absolute bottom-1/2 right-2/3 text-[#df7500]/29"
          animate={{
            x: mousePosition.x * -0.020 + scrollPosition * 0.06,
            y: mousePosition.y * -0.020 + scrollPosition * -0.08,
            rotate: Math.sin(animationTime * 0.019) * -11,
            scale: 1 + Math.sin(animationTime * 0.031) * 0.15,
          }}
          transition={{ type: "spring", stiffness: 93, damping: 41 }}
        >
          <BarChart3 className="w-9 h-9" />
        </motion.div>

        {/* Book Icon 5 */}
        <motion.div
          className="absolute top-3/4 left-1/2 text-[#651321]/26"
          animate={{
            x: mousePosition.x * 0.025 + scrollPosition * 0.07,
            y: mousePosition.y * 0.025 + scrollPosition * -0.05,
            rotate: Math.sin(animationTime * 0.017) * 13,
            scale: 1 + Math.cos(animationTime * 0.029) * 0.17,
          }}
          transition={{ type: "spring", stiffness: 81, damping: 32 }}
        >
          <Book className="w-6 h-6" />
        </motion.div>

        {/* Pen Icon 5 */}
        <motion.div
          className="absolute bottom-1/4 left-1/6 text-[#df7500]/27"
          animate={{
            x: mousePosition.x * -0.024 + scrollPosition * -0.06,
            y: mousePosition.y * -0.024 + scrollPosition * 0.08,
            rotate: Math.sin(animationTime * 0.021) * -16,
            scale: 1 + Math.sin(animationTime * 0.026) * 0.10,
          }}
          transition={{ type: "spring", stiffness: 87, damping: 36 }}
        >
          <Pen className="w-6 h-6" />
        </motion.div>
      </div>

      {/* Hero Section */}
      <div className={`relative z-10 max-w-7xl mx-auto px-6 py-20 transition-all duration-1000 delay-300 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        <motion.div
          className="bg-gradient-to-br from-white via-gray-50 to-blue-50/30 border border-gray-200/50 rounded-3xl p-12 shadow-2xl mx-auto max-w-4xl relative overflow-hidden"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{
            scale: 1,
            opacity: 1,
            y: Math.sin(animationTime * 0.005) * 5,
          }}
          transition={{
            duration: 0.8,
            delay: 0.5,
            type: "spring",
            stiffness: 100,
            damping: 15
          }}
          whileHover={{
            scale: 1.02,
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          }}
        >
          <div className="text-center">
            <motion.h1
              className="text-6xl md:text-7xl font-bold text-[#651321] mb-6 leading-tight"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              Challenge Your
              <motion.span
                className="bg-gradient-to-r from-[#df7500] via-[#651321] to-[#df7500] bg-clip-text text-transparent block"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear"
                }}
                style={{
                  backgroundSize: "200% 200%"
                }}
              >
                Mind
              </motion.span>
            </motion.h1>

            <motion.p
              className="text-xl text-[#651321] mb-12 max-w-2xl mx-auto leading-relaxed"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.9 }}
            >
              Dive into an immersive quiz experience where knowledge meets competition.
              Climb the leaderboard, and become the ultimate quiz champion.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.1 }}
            >
              <motion.button
                className="group bg-gradient-to-r from-[#df7500] to-[#651321] text-white px-8 py-4 rounded-full font-semibold text-lg flex items-center gap-3 hover:from-[#df7500]/80 hover:to-[#651321]/80 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
                onClick={() => {
                  router.push('/login');
                }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 10px 25px rgba(223, 117, 0, 0.3)"
                }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Zap className="w-5 h-5 group-hover:animate-pulse" />
                </motion.div>
                Start Quiz
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.div>
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
