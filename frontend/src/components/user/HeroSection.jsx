import React, { useState, useEffect } from 'react';
import { Search, Menu, Bell, Wallet } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../../assets/rokologin-removebg-preview.png';
import MobileMenu from '../../components/ui/MobileMenu';
import { useNavigate } from 'react-router-dom';
import walletService from '../../services/walletService';

const HeroSection = ({ theme }) => {
    const accentColor = theme?.accent || '#10B981';
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [placeholderIndex, setPlaceholderIndex] = useState(0);
    const [isSticky, setIsSticky] = useState(false);
    const [walletBalance, setWalletBalance] = useState(0);

    const placeholders = [
        "Search in Bucharest...",
        "Find luxury hotels...",
        "Book villas in Bali...",
        "Couple friendly stays...",
        "Search near Red Square..."
    ];

    useEffect(() => {
        const fetchWallet = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                if (user) {
                    const walletData = await walletService.getWallet();
                    if (walletData.success && walletData.wallet) {
                        setWalletBalance(walletData.wallet.balance);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch wallet', error);
            }
        };
        fetchWallet();
    }, []);

    // Placeholder Rotation
    useEffect(() => {
        const interval = setInterval(() => {
            setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [placeholders.length]);

    // Scroll Listener for Sticky & Header Logic
    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            setIsSticky(scrollY > 120);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSearchClick = () => {
        navigate('/search');
    };

    return (
        <motion.section
            className={`relative w-full px-5 pt-6 pb-8 flex flex-col gap-5 md:gap-3 md:pt-8 md:pb-4 bg-transparent transition-all duration-300`}
        >
            {/* 1. Header Row (Hides on Scroll) */}
            <div className={`flex md:hidden items-center justify-between relative h-24 transition-all duration-300 ${isSticky ? 'opacity-0 h-0 overflow-hidden mb-0' : 'opacity-100 mb-0'}`}>
                {/* Menu Button */}
                <button
                    onClick={() => setIsMenuOpen(true)}
                    className="p-2.5 rounded-xl bg-emerald-100/20 hover:bg-emerald-100/35 backdrop-blur-md transition-all duration-300 border border-emerald-100/30 shadow-lg shadow-emerald-900/10 active:scale-90"
                >
                    <Menu size={18} className="text-emerald-50" />
                </button>

                {/* Logo */}
                <div className="flex flex-col items-start leading-none ml-3">
                    <span className="text-2xl font-black tracking-tight text-white flex items-center gap-0 drop-shadow-md">
                        HOOM<span style={{ color: accentColor }} className="drop-shadow-[0_0_12px_rgba(255,255,255,0.3)]">ZO</span>
                    </span>
                    <motion.div
                        className="h-[3px] w-8 rounded-full"
                        style={{ backgroundColor: accentColor }}
                        animate={{ width: [32, 24, 32] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    />
                </div>

                <div className="flex-1" />

                {/* Wallet Balance Display */}
                <button
                    onClick={() => navigate('/wallet')}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-emerald-400/20 to-emerald-500/10 backdrop-blur-md border border-emerald-300/25 shadow-lg shadow-emerald-900/10 active:scale-95 transition-all duration-300 hover:from-emerald-400/30 hover:to-emerald-500/20"
                >
                    <div className="w-6 h-6 bg-gradient-to-br from-emerald-300 to-emerald-500 rounded-lg flex items-center justify-center shadow-md shadow-emerald-500/30">
                        <Wallet size={12} className="text-white" />
                    </div>
                    <div className="flex flex-col items-start leading-none">
                        <span className="text-[8px] font-bold text-amber-200/80 uppercase tracking-wider">Wallet</span>
                        <span className="text-[11px] font-extrabold text-white">
                            {new Intl.NumberFormat('en-IN', {
                                style: 'currency',
                                currency: 'INR',
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0
                            }).format(walletBalance)}
                        </span>
                    </div>
                </button>
            </div>

            {/* Tagline - project related (hidden on mobile) */}
            <p className="hidden md:block text-center text-white/95 text-sm md:text-lg font-medium drop-shadow-md px-2 max-w-xl mx-auto">
                Find your space — PG/Co-Living, Rent, Buy & Plots. Your home, your way.
            </p>

            {/* 2. Search Bar - Sticky Logic with smooth animation */}
            <motion.div
                layout
                className={`
                    w-full z-50
                    ${isSticky
                        ? 'fixed top-0 md:top-24 left-0 right-0 p-3 bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-100/50'
                        : 'relative mt-2 md:mt-4'}
                `}
            >
                <motion.div
                    layout
                    onClick={handleSearchClick}
                    className={`
                        w-full mx-auto max-w-7xl
                        ${isSticky
                            ? 'h-10 rounded-full shadow-inner'
                            : 'h-12 md:h-14 rounded-2xl shadow-xl shadow-emerald-900/5 border border-white/40 bg-white/95 backdrop-blur-md'}
                        flex items-center 
                        px-3 md:px-4
                        gap-2 md:gap-3
                        relative
                        overflow-hidden
                        cursor-pointer
                        transition-all duration-300
                    `}
                >
                    <Search size={18} style={{ color: accentColor }} className="z-10 md:w-6 md:h-6" />

                    <div className="flex-1 h-full flex items-center bg-transparent outline-none font-medium z-20 relative text-xs md:text-sm" style={{ color: accentColor }}>
                        {/* Input simulated via div/text */}
                    </div>

                    <div className="absolute left-9 right-10 md:left-12 md:right-12 h-full flex items-center pointer-events-none z-0">
                        <AnimatePresence mode="wait">
                            <motion.span
                                key={placeholderIndex}
                                initial={{ y: 15, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -15, opacity: 0 }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                                className="text-gray-400 font-normal text-xs md:text-sm absolute w-full truncate"
                            >
                                {placeholders[placeholderIndex]}
                            </motion.span>
                        </AnimatePresence>
                    </div>

                    {/* Filter Icon */}
                    <button className="p-1.5 rounded-lg bg-gray-50/50 hover:bg-white transition-colors z-10">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="4" y1="6" x2="20" y2="6"></line>
                            <line x1="4" y1="12" x2="20" y2="12"></line>
                            <line x1="4" y1="18" x2="12" y2="18"></line>
                        </svg>
                    </button>
                </motion.div>
            </motion.div>

            {/* Placeholder Spacer only when sticky to prevent content jump */}
            {isSticky && (
                <div className="h-16 w-full md:h-20"></div>
            )}

            <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

        </motion.section>
    );
};

export default HeroSection;
