"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    {
      title: "Global Trading & Investment Platform",
      description: "TradeInvestCenter connects investors with promising export projects and facilitates global trade across multiple commodities.",
      image: "global-trade.svg",
      color: "from-purple-600 to-indigo-700"
    },
    {
      title: "Investment Crowdfunding",
      description: "Fund promising export projects and earn returns on successful global trade ventures.",
      image: "investment.svg",
      color: "from-purple-700 to-yellow-600"
    },
    {
      title: "Global Trading Marketplace",
      description: "Connect with buyers and sellers from around the world in our secure trading environment.",
      image: "marketplace.svg",
      color: "from-yellow-600 to-purple-800"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const handleDotClick = (index: number) => {
    setCurrentSlide(index);
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <section className="relative overflow-hidden text-white pt-24 pb-16 md:pt-32 md:pb-24 min-h-[90vh] flex items-center">
      {/* Background gradient that changes with slides */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={currentSlide}
          className={`absolute inset-0 bg-gradient-to-r ${slides[currentSlide].color} z-0`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
        />
      </AnimatePresence>

      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-300 opacity-10 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 relative z-10 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Text content with animation */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                {slides[currentSlide].title}
              </h1>
              <p className="text-lg md:text-xl text-blue-100 mb-8">
                {slides[currentSlide].description}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/register" className="px-6 py-3 bg-white text-purple-800 font-medium rounded-md hover:bg-gray-100 transition-colors text-center">
                  Get Started
                </Link>
                <Link href="#features" className="px-6 py-3 bg-transparent border border-yellow-500 text-yellow-500 font-medium rounded-md hover:bg-yellow-500/10 transition-colors text-center">
                  Learn More
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
          
          {/* Visual content with animation */}
          <div className="relative h-[400px] md:h-[450px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                exit={{ opacity: 0, scale: 0.9, rotateY: 10 }}
                transition={{ duration: 0.7 }}
                className="w-full h-full relative"
              >
                {/* SVG Illustrations for each slide */}
                {currentSlide === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="w-full h-full max-w-md" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                      {/* Background with gradient */}
                      <defs>
                        <radialGradient id="globeGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                          <stop offset="0%" stopColor="rgba(147,51,234,0.2)" />
                          <stop offset="100%" stopColor="rgba(76,29,149,0.05)" />
                        </radialGradient>
                        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="rgba(234,179,8,0.7)" />
                          <stop offset="100%" stopColor="rgba(202,138,4,0.3)" />
                        </linearGradient>
                        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                          <feGaussianBlur stdDeviation="2" result="blur" />
                          <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                      </defs>
                      
                      {/* Animated Globe */}
                      <circle cx="100" cy="100" r="60" fill="url(#globeGradient)">
                        <animate attributeName="opacity" values="0.7;0.9;0.7" dur="5s" repeatCount="indefinite" />
                      </circle>
                      
                      {/* Rotating Grid Lines */}
                      <g>
                        <animateTransform attributeName="transform" type="rotate" from="0 100 100" to="360 100 100" dur="60s" repeatCount="indefinite" />
                        <circle cx="100" cy="100" r="60" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" fill="none" />
                        <circle cx="100" cy="100" r="45" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" fill="none" />
                        <circle cx="100" cy="100" r="30" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" fill="none" />
                        <path d="M40,100 L160,100" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
                        <path d="M100,40 L100,160" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
                        <path d="M58,58 L142,142" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
                        <path d="M58,142 L142,58" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
                      </g>
                      
                      {/* Continents */}
                      <g>
                        <path d="M70,80 C75,75 85,85 90,80 C95,75 85,65 90,60 C95,55 105,65 110,60" stroke="white" strokeWidth="1" fill="rgba(234,179,8,0.3)" filter="url(#glow)" />
                        <path d="M120,70 C125,65 130,70 135,65 C140,60 130,80 125,85" stroke="white" strokeWidth="1" fill="rgba(147,51,234,0.3)" filter="url(#glow)" />
                        <path d="M80,110 C85,105 90,110 95,105 C100,100 105,105 110,100 C115,95 120,100 125,95" stroke="white" strokeWidth="1" fill="rgba(234,179,8,0.3)" filter="url(#glow)" />
                      </g>
                      
                      {/* Data Points */}
                      <g>
                        {/* Animated Data Points */}
                        <circle cx="75" cy="75" r="3" fill="#eab308">
                          <animate attributeName="r" values="2;4;2" dur="3s" repeatCount="indefinite" />
                          <animate attributeName="opacity" values="0.5;1;0.5" dur="3s" repeatCount="indefinite" />
                        </circle>
                        <circle cx="125" cy="65" r="3" fill="#9333ea">
                          <animate attributeName="r" values="2;4;2" dur="2.5s" repeatCount="indefinite" />
                          <animate attributeName="opacity" values="0.5;1;0.5" dur="2.5s" repeatCount="indefinite" />
                        </circle>
                        <circle cx="85" cy="125" r="3" fill="#eab308">
                          <animate attributeName="r" values="2;4;2" dur="4s" repeatCount="indefinite" />
                          <animate attributeName="opacity" values="0.5;1;0.5" dur="4s" repeatCount="indefinite" />
                        </circle>
                        <circle cx="135" cy="115" r="3" fill="#9333ea">
                          <animate attributeName="r" values="2;4;2" dur="3.5s" repeatCount="indefinite" />
                          <animate attributeName="opacity" values="0.5;1;0.5" dur="3.5s" repeatCount="indefinite" />
                        </circle>
                      </g>
                      
                      {/* Connection Lines with Animation */}
                      <g>
                        <path d="M75,75 Q100,50 125,65" stroke="url(#lineGradient)" strokeWidth="1.5" fill="none" strokeDasharray="5,3">
                          <animate attributeName="stroke-dashoffset" from="0" to="16" dur="2s" repeatCount="indefinite" />
                        </path>
                        <path d="M125,65 Q130,100 135,115" stroke="url(#lineGradient)" strokeWidth="1.5" fill="none" strokeDasharray="5,3">
                          <animate attributeName="stroke-dashoffset" from="0" to="16" dur="3s" repeatCount="indefinite" />
                        </path>
                        <path d="M135,115 Q100,130 85,125" stroke="url(#lineGradient)" strokeWidth="1.5" fill="none" strokeDasharray="5,3">
                          <animate attributeName="stroke-dashoffset" from="0" to="16" dur="2.5s" repeatCount="indefinite" />
                        </path>
                        <path d="M85,125 Q70,100 75,75" stroke="url(#lineGradient)" strokeWidth="1.5" fill="none" strokeDasharray="5,3">
                          <animate attributeName="stroke-dashoffset" from="0" to="16" dur="3.5s" repeatCount="indefinite" />
                        </path>
                      </g>
                      
                      {/* Animated Particles */}
                      <g>
                        <circle cx="0" cy="0" r="2" fill="white">
                          <animateMotion path="M75,75 Q100,50 125,65" dur="4s" repeatCount="indefinite" />
                          <animate attributeName="opacity" values="0;1;0" dur="4s" repeatCount="indefinite" />
                        </circle>
                        <circle cx="0" cy="0" r="2" fill="white">
                          <animateMotion path="M125,65 Q130,100 135,115" dur="5s" repeatCount="indefinite" />
                          <animate attributeName="opacity" values="0;1;0" dur="5s" repeatCount="indefinite" />
                        </circle>
                        <circle cx="0" cy="0" r="2" fill="white">
                          <animateMotion path="M135,115 Q100,130 85,125" dur="4.5s" repeatCount="indefinite" />
                          <animate attributeName="opacity" values="0;1;0" dur="4.5s" repeatCount="indefinite" />
                        </circle>
                        <circle cx="0" cy="0" r="2" fill="white">
                          <animateMotion path="M85,125 Q70,100 75,75" dur="5.5s" repeatCount="indefinite" />
                          <animate attributeName="opacity" values="0;1;0" dur="5.5s" repeatCount="indefinite" />
                        </circle>
                      </g>
                      
                      {/* Pulsing Center */}
                      <circle cx="100" cy="100" r="8" fill="white" opacity="0.8">
                        <animate attributeName="r" values="5;10;5" dur="3s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.6;0.9;0.6" dur="3s" repeatCount="indefinite" />
                      </circle>
                      
                      {/* Outer Glow Ring */}
                      <circle cx="100" cy="100" r="70" stroke="white" strokeWidth="0.5" fill="none" opacity="0.3">
                        <animate attributeName="r" values="65;75;65" dur="10s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.2;0.4;0.2" dur="10s" repeatCount="indefinite" />
                      </circle>
                    </svg>
                  </div>
                )}
                
                {currentSlide === 1 && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="w-full h-full max-w-md" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                      {/* Definitions */}
                      <defs>
                        <linearGradient id="barGradient" x1="0%" y1="100%" x2="0%" y2="0%">
                          <stop offset="0%" stopColor="rgba(147,51,234,0.3)" />
                          <stop offset="100%" stopColor="rgba(234,179,8,0.8)" />
                        </linearGradient>
                        <filter id="glow2" x="-20%" y="-20%" width="140%" height="140%">
                          <feGaussianBlur stdDeviation="1.5" result="blur" />
                          <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                        <linearGradient id="lineGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="rgba(234,179,8,0.8)" />
                          <stop offset="100%" stopColor="rgba(147,51,234,0.2)" />
                        </linearGradient>
                      </defs>
                      
                      {/* Background Panel */}
                      <rect x="30" y="30" width="140" height="140" rx="10" fill="rgba(255,255,255,0.05)" />
                      <rect x="40" y="40" width="120" height="120" rx="5" fill="rgba(255,255,255,0.07)" />
                      
                      {/* Chart Title */}
                      <text x="100" y="55" fontFamily="Arial" fontSize="10" fill="white" textAnchor="middle">INVESTMENT GROWTH</text>
                      
                      {/* Chart Axes */}
                      <path d="M50,140 L150,140" stroke="white" strokeWidth="1.5" />
                      <path d="M50,140 L50,60" stroke="white" strokeWidth="1.5" />
                      
                      {/* Y-Axis Labels */}
                      <text x="45" y="140" fontFamily="Arial" fontSize="6" fill="white" textAnchor="end">0</text>
                      <text x="45" y="120" fontFamily="Arial" fontSize="6" fill="white" textAnchor="end">25</text>
                      <text x="45" y="100" fontFamily="Arial" fontSize="6" fill="white" textAnchor="end">50</text>
                      <text x="45" y="80" fontFamily="Arial" fontSize="6" fill="white" textAnchor="end">75</text>
                      <text x="45" y="60" fontFamily="Arial" fontSize="6" fill="white" textAnchor="end">100</text>
                      
                      {/* Grid Lines */}
                      <path d="M50,120 L150,120" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" strokeDasharray="2,2" />
                      <path d="M50,100 L150,100" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" strokeDasharray="2,2" />
                      <path d="M50,80 L150,80" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" strokeDasharray="2,2" />
                      <path d="M50,60 L150,60" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" strokeDasharray="2,2" />
                      
                      {/* Animated Line Chart */}
                      <path d="M50,130 L70,120 L90,100 L110,85 L130,70 L150,60" stroke="none" fill="none" id="chartPath" />
                      <path d="M50,130 L70,120 L90,100 L110,85 L130,70 L150,60" stroke="white" strokeWidth="2" fill="none" strokeDasharray="200" strokeDashoffset="200" filter="url(#glow2)">
                        <animate attributeName="stroke-dashoffset" from="200" to="0" dur="2s" fill="freeze" />
                      </path>
                      
                      {/* Animated Area Under Chart */}
                      <path d="M50,140 L50,130 L70,120 L90,100 L110,85 L130,70 L150,60 L150,140 Z" fill="url(#barGradient)" opacity="0">
                        <animate attributeName="opacity" from="0" to="0.4" dur="1s" begin="1s" fill="freeze" />
                      </path>
                      
                      {/* Data Points with Pulse Animation */}
                      <circle cx="50" cy="130" r="3" fill="#eab308" filter="url(#glow2)">
                        <animate attributeName="r" values="2;4;2" dur="3s" repeatCount="indefinite" begin="1.5s" />
                      </circle>
                      <circle cx="70" cy="120" r="3" fill="#9333ea" filter="url(#glow2)">
                        <animate attributeName="r" values="2;4;2" dur="3s" repeatCount="indefinite" begin="1.6s" />
                      </circle>
                      <circle cx="90" cy="100" r="3" fill="#eab308" filter="url(#glow2)">
                        <animate attributeName="r" values="2;4;2" dur="3s" repeatCount="indefinite" begin="1.7s" />
                      </circle>
                      <circle cx="110" cy="85" r="3" fill="#9333ea" filter="url(#glow2)">
                        <animate attributeName="r" values="2;4;2" dur="3s" repeatCount="indefinite" begin="1.8s" />
                      </circle>
                      <circle cx="130" cy="70" r="3" fill="#eab308" filter="url(#glow2)">
                        <animate attributeName="r" values="2;4;2" dur="3s" repeatCount="indefinite" begin="1.9s" />
                      </circle>
                      <circle cx="150" cy="60" r="3" fill="#9333ea" filter="url(#glow2)">
                        <animate attributeName="r" values="2;4;2" dur="3s" repeatCount="indefinite" begin="2s" />
                      </circle>
                      
                      {/* X-Axis Labels */}
                      <text x="50" y="148" fontFamily="Arial" fontSize="6" fill="white" textAnchor="middle">2020</text>
                      <text x="70" y="148" fontFamily="Arial" fontSize="6" fill="white" textAnchor="middle">2021</text>
                      <text x="90" y="148" fontFamily="Arial" fontSize="6" fill="white" textAnchor="middle">2022</text>
                      <text x="110" y="148" fontFamily="Arial" fontSize="6" fill="white" textAnchor="middle">2023</text>
                      <text x="130" y="148" fontFamily="Arial" fontSize="6" fill="white" textAnchor="middle">2024</text>
                      <text x="150" y="148" fontFamily="Arial" fontSize="6" fill="white" textAnchor="middle">2025</text>
                      
                      {/* Animated Percentage Indicator */}
                      <g transform="translate(150, 60)">
                        <circle r="12" fill="rgba(255,255,255,0.1)" />
                        <text fontFamily="Arial" fontSize="8" fill="white" textAnchor="middle" dominantBaseline="middle">
                          <animate attributeName="textContent" from="0%" to="120%" dur="2s" fill="freeze" />
                        </text>
                        <animateTransform attributeName="transform" type="scale" from="0" to="1" dur="0.5s" begin="1.8s" fill="freeze" additive="sum" />
                      </g>
                      
                      {/* Animated Coin Icons */}
                      <g transform="translate(170, 80)">
                        <circle r="8" fill="rgba(255,255,255,0.2)" stroke="white" strokeWidth="1">
                          <animate attributeName="opacity" from="0" to="1" dur="0.3s" begin="2.2s" fill="freeze" />
                        </circle>
                        <path d="M0,-3 L0,3 M-3,0 L3,0" stroke="white" strokeWidth="1">
                          <animate attributeName="opacity" from="0" to="1" dur="0.3s" begin="2.2s" fill="freeze" />
                        </path>
                      </g>
                      <g transform="translate(170, 100)">
                        <circle r="8" fill="rgba(255,255,255,0.2)" stroke="white" strokeWidth="1">
                          <animate attributeName="opacity" from="0" to="1" dur="0.3s" begin="2.4s" fill="freeze" />
                        </circle>
                        <path d="M0,-3 L0,3 M-3,0 L3,0" stroke="white" strokeWidth="1">
                          <animate attributeName="opacity" from="0" to="1" dur="0.3s" begin="2.4s" fill="freeze" />
                        </path>
                      </g>
                      <g transform="translate(170, 120)">
                        <circle r="8" fill="rgba(255,255,255,0.2)" stroke="white" strokeWidth="1">
                          <animate attributeName="opacity" from="0" to="1" dur="0.3s" begin="2.6s" fill="freeze" />
                        </circle>
                        <path d="M0,-3 L0,3 M-3,0 L3,0" stroke="white" strokeWidth="1">
                          <animate attributeName="opacity" from="0" to="1" dur="0.3s" begin="2.6s" fill="freeze" />
                        </path>
                      </g>
                    </svg>
                  </div>
                )}
                
                {currentSlide === 2 && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="w-full h-full max-w-md" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                      {/* Definitions */}
                      <defs>
                        <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                          <stop offset="0%" stopColor="rgba(234,179,8,0.4)" />
                          <stop offset="100%" stopColor="rgba(147,51,234,0)" />
                        </radialGradient>
                        <filter id="glow3" x="-20%" y="-20%" width="140%" height="140%">
                          <feGaussianBlur stdDeviation="2" result="blur" />
                          <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                      </defs>
                      
                      {/* Background with Glow */}
                      <circle cx="100" cy="100" r="70" fill="url(#centerGlow)" opacity="0.5">
                        <animate attributeName="opacity" values="0.3;0.6;0.3" dur="5s" repeatCount="indefinite" />
                      </circle>
                      
                      {/* Central Hub */}
                      <circle cx="100" cy="100" r="20" fill="rgba(255,255,255,0.2)" stroke="white" strokeWidth="1" filter="url(#glow3)">
                        <animate attributeName="r" values="18;22;18" dur="5s" repeatCount="indefinite" />
                      </circle>
                      
                      {/* Hub Text */}
                      <text x="100" y="100" fontFamily="Arial" fontSize="6" fill="white" textAnchor="middle" dominantBaseline="middle">MARKETPLACE</text>
                      <text x="100" y="108" fontFamily="Arial" fontSize="4" fill="white" textAnchor="middle" dominantBaseline="middle">GLOBAL TRADING</text>
                      
                      {/* Orbital Rings */}
                      <circle cx="100" cy="100" r="40" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" fill="none" strokeDasharray="3,3">
                        <animateTransform attributeName="transform" type="rotate" from="0 100 100" to="360 100 100" dur="60s" repeatCount="indefinite" />
                      </circle>
                      <circle cx="100" cy="100" r="60" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" fill="none" strokeDasharray="3,3">
                        <animateTransform attributeName="transform" type="rotate" from="360 100 100" to="0 100 100" dur="90s" repeatCount="indefinite" />
                      </circle>
                      
                      {/* Node 1 - Buyer */}
                      <g>
                        <animateTransform attributeName="transform" type="rotate" from="0 100 100" to="360 100 100" dur="20s" repeatCount="indefinite" />
                        <circle cx="140" cy="100" r="10" fill="rgba(255,255,255,0.2)" stroke="white" strokeWidth="1" />
                        <text x="140" y="100" fontFamily="Arial" fontSize="5" fill="white" textAnchor="middle" dominantBaseline="middle">BUYER</text>
                      </g>
                      
                      {/* Node 2 - Seller */}
                      <g>
                        <animateTransform attributeName="transform" type="rotate" from="120 100 100" to="480 100 100" dur="20s" repeatCount="indefinite" />
                        <circle cx="140" cy="100" r="10" fill="rgba(255,255,255,0.2)" stroke="white" strokeWidth="1" />
                        <text x="140" y="100" fontFamily="Arial" fontSize="5" fill="white" textAnchor="middle" dominantBaseline="middle">SELLER</text>
                      </g>
                      
                      {/* Node 3 - Investor */}
                      <g>
                        <animateTransform attributeName="transform" type="rotate" from="240 100 100" to="600 100 100" dur="20s" repeatCount="indefinite" />
                        <circle cx="140" cy="100" r="10" fill="rgba(255,255,255,0.2)" stroke="white" strokeWidth="1" />
                        <text x="140" y="100" fontFamily="Arial" fontSize="5" fill="white" textAnchor="middle" dominantBaseline="middle">INVESTOR</text>
                      </g>
                      
                      {/* Outer Nodes */}
                      <g>
                        <animateTransform attributeName="transform" type="rotate" from="0 100 100" to="360 100 100" dur="40s" repeatCount="indefinite" />
                        <circle cx="160" cy="100" r="5" fill="rgba(255,255,255,0.2)" stroke="white" strokeWidth="0.5" />
                      </g>
                      <g>
                        <animateTransform attributeName="transform" type="rotate" from="72 100 100" to="432 100 100" dur="40s" repeatCount="indefinite" />
                        <circle cx="160" cy="100" r="5" fill="rgba(255,255,255,0.2)" stroke="white" strokeWidth="0.5" />
                      </g>
                      <g>
                        <animateTransform attributeName="transform" type="rotate" from="144 100 100" to="504 100 100" dur="40s" repeatCount="indefinite" />
                        <circle cx="160" cy="100" r="5" fill="rgba(255,255,255,0.2)" stroke="white" strokeWidth="0.5" />
                      </g>
                      <g>
                        <animateTransform attributeName="transform" type="rotate" from="216 100 100" to="576 100 100" dur="40s" repeatCount="indefinite" />
                        <circle cx="160" cy="100" r="5" fill="rgba(255,255,255,0.2)" stroke="white" strokeWidth="0.5" />
                      </g>
                      <g>
                        <animateTransform attributeName="transform" type="rotate" from="288 100 100" to="648 100 100" dur="40s" repeatCount="indefinite" />
                        <circle cx="160" cy="100" r="5" fill="rgba(255,255,255,0.2)" stroke="white" strokeWidth="0.5" />
                      </g>
                      
                      {/* Animated Connection Lines */}
                      <g>
                        {/* Pulsing Connections */}
                        <path d="M100,100 L140,100" stroke="white" strokeWidth="0.5" strokeDasharray="2,2">
                          <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" />
                          <animateTransform attributeName="transform" type="rotate" from="0 100 100" to="360 100 100" dur="20s" repeatCount="indefinite" />
                        </path>
                        <path d="M100,100 L140,100" stroke="white" strokeWidth="0.5" strokeDasharray="2,2">
                          <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" />
                          <animateTransform attributeName="transform" type="rotate" from="120 100 100" to="480 100 100" dur="20s" repeatCount="indefinite" />
                        </path>
                        <path d="M100,100 L140,100" stroke="white" strokeWidth="0.5" strokeDasharray="2,2">
                          <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" />
                          <animateTransform attributeName="transform" type="rotate" from="240 100 100" to="600 100 100" dur="20s" repeatCount="indefinite" />
                        </path>
                      </g>
                      
                      {/* Data Particles */}
                      <g>
                        <circle cx="0" cy="0" r="1.5" fill="white">
                          <animateMotion path="M100,100 L140,100" dur="2s" repeatCount="indefinite" />
                          <animateTransform attributeName="transform" type="rotate" from="0 100 100" to="360 100 100" dur="20s" repeatCount="indefinite" additive="sum" />
                        </circle>
                        <circle cx="0" cy="0" r="1.5" fill="white">
                          <animateMotion path="M140,100 L100,100" dur="2s" repeatCount="indefinite" />
                          <animateTransform attributeName="transform" type="rotate" from="0 100 100" to="360 100 100" dur="20s" repeatCount="indefinite" additive="sum" />
                        </circle>
                      </g>
                      <g>
                        <circle cx="0" cy="0" r="1.5" fill="white">
                          <animateMotion path="M100,100 L140,100" dur="2s" repeatCount="indefinite" />
                          <animateTransform attributeName="transform" type="rotate" from="120 100 100" to="480 100 100" dur="20s" repeatCount="indefinite" additive="sum" />
                        </circle>
                        <circle cx="0" cy="0" r="1.5" fill="white">
                          <animateMotion path="M140,100 L100,100" dur="2s" repeatCount="indefinite" />
                          <animateTransform attributeName="transform" type="rotate" from="120 100 100" to="480 100 100" dur="20s" repeatCount="indefinite" additive="sum" />
                        </circle>
                      </g>
                      <g>
                        <circle cx="0" cy="0" r="1.5" fill="white">
                          <animateMotion path="M100,100 L140,100" dur="2s" repeatCount="indefinite" />
                          <animateTransform attributeName="transform" type="rotate" from="240 100 100" to="600 100 100" dur="20s" repeatCount="indefinite" additive="sum" />
                        </circle>
                        <circle cx="0" cy="0" r="1.5" fill="white">
                          <animateMotion path="M140,100 L100,100" dur="2s" repeatCount="indefinite" />
                          <animateTransform attributeName="transform" type="rotate" from="240 100 100" to="600 100 100" dur="20s" repeatCount="indefinite" additive="sum" />
                        </circle>
                      </g>
                    </svg>
                  </div>
                )}
                
                {/* Card with features */}
                <div className="absolute bottom-0 right-0 w-full md:w-3/4 bg-white/10 backdrop-blur-sm p-6 rounded-lg shadow-xl">
                  <div className="relative z-10">
                    <h3 className="text-xl font-semibold mb-4">Platform Highlights</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <svg className="h-6 w-6 text-blue-300 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Investment Crowdfunding</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="h-6 w-6 text-blue-300 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Global Trading Marketplace</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="h-6 w-6 text-blue-300 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Collaborative Export-Import</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
        
        {/* Carousel controls */}
        <div className="flex justify-center mt-8 space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                currentSlide === index ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
        
        {/* Navigation arrows */}
        <div className="absolute top-1/2 left-4 transform -translate-y-1/2 z-20">
          <button 
            onClick={handlePrevSlide}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-colors"
            aria-label="Previous slide"
          >
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>
        <div className="absolute top-1/2 right-4 transform -translate-y-1/2 z-20">
          <button 
            onClick={handleNextSlide}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-colors"
            aria-label="Next slide"
          >
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-white" style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 0)' }}></div>
    </section>
  );
};

export default Hero;