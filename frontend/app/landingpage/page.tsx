"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, Trophy, Brain, Users, Star, Zap, Target, Award } from 'lucide-react';
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
      </div>

      {/* Hero Section */}
      <div className={`relative z-10 max-w-7xl mx-auto px-6 py-20 transition-all duration-1000 delay-300 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        <div className="text-center">
          <h1 className="text-6xl md:text-7xl font-bold text-[#651321] mb-6 leading-tight">
            Challenge Your
            <span className="bg-gradient-to-r from-[#df7500] via-[#651321] to-[#df7500] bg-clip-text text-transparent block">
              Mind
            </span>
          </h1>

          <p className="text-xl text-[#651321] mb-12 max-w-2xl mx-auto leading-relaxed">
            Dive into an immersive quiz experience where knowledge meets competition.
            Climb the leaderboard, and become the ultimate quiz champion.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <button
              className="group bg-gradient-to-r from-[#df7500] to-[#651321] text-white px-8 py-4 rounded-full font-semibold text-lg flex items-center gap-3 hover:from-[#df7500]/80 hover:to-[#651321]/80 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
              onClick={() => {
                router.push('/login');
              }}
            >
              <Zap className="w-5 h-5 group-hover:animate-pulse" />
              Start Quiz
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
