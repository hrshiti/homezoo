import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import HeroSection from '../../components/user/HeroSection';
import ExclusiveOffers from '../../components/user/ExclusiveOffers';
import PropertyTypeFilter from '../../components/user/PropertyTypeFilter';
import PropertyFeed from '../../components/user/PropertyFeed';
import { categoryService } from '../../services/categoryService';

// Category displayName → dark hero background only (no images) + page background
const THEME_MAP = {
    Hotel: {
        darkBg: 'linear-gradient(160deg, #0f172a 0%, #1e3a5f 50%, #1e40af 100%)',
        pageBg: '#eff6ff'
    },
    Villa: {
        darkBg: 'linear-gradient(160deg, #052e16 0%, #14532d 50%, #166534 100%)',
        pageBg: '#f0fdf4'
    },
    Resort: {
        darkBg: 'linear-gradient(160deg, #3b0764 0%, #581c87 50%, #6b21a8 100%)',
        pageBg: '#faf5ff'
    },
    Homestay: {
        darkBg: 'linear-gradient(160deg, #431407 0%, #78350f 50%, #92400e 100%)',
        pageBg: '#fffbeb'
    },
    Hostel: {
        darkBg: 'linear-gradient(160deg, #0c4a6e 0%, #0e7490 50%, #0891b2 100%)',
        pageBg: '#ecfeff'
    },
    PG: {
        darkBg: 'linear-gradient(160deg, #450a0a 0%, #7f1d1d 50%, #991b1b 100%)',
        pageBg: '#fef2f2'
    },
    'PG/Co-living': {
        darkBg: 'linear-gradient(160deg, #450a0a 0%, #7f1d1d 50%, #991b1b 100%)',
        pageBg: '#fef2f2'
    },
    'PG/Co-Living': {
        darkBg: 'linear-gradient(160deg, #450a0a 0%, #7f1d1d 50%, #991b1b 100%)',
        pageBg: '#fef2f2'
    },
    Tent: {
        darkBg: 'linear-gradient(160deg, #431407 0%, #9a3412 50%, #c2410c 100%)',
        pageBg: '#fff7ed'
    },
    Plot: {
        darkBg: 'linear-gradient(160deg, #431407 0%, #9a3412 50%, #c2410c 100%)',
        pageBg: '#fff7ed'
    },
    Plots: {
        darkBg: 'linear-gradient(160deg, #431407 0%, #9a3412 50%, #c2410c 100%)',
        pageBg: '#fff7ed'
    },
    Buy: {
        darkBg: 'linear-gradient(160deg, #0f172a 0%, #1e3a5f 50%, #1d4ed8 100%)',
        pageBg: '#eff6ff'
    },
    Rent: {
        darkBg: 'linear-gradient(160deg, #052e16 0%, #14532d 50%, #15803d 100%)',
        pageBg: '#f0fdf4'
    },
    default: {
        darkBg: 'linear-gradient(160deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
        pageBg: '#f8fafc'
    }
};

const Home = () => {
    const [selectedType, setSelectedType] = useState({ id: null, label: 'All' });

    const activeTheme = useMemo(() => {
        if (!selectedType.label || selectedType.label === 'All' || !selectedType.id) return THEME_MAP.default;
        return THEME_MAP[selectedType.label] || THEME_MAP.default;
    }, [selectedType]);

    const handleTypeSelect = (id, label) => {
        setSelectedType({ id, label });
    };

    const pageBg = activeTheme.pageBg || '#f8fafc';

    return (
        <main className="min-h-screen pb-24 transition-colors duration-700" style={{ backgroundColor: pageBg }}>
            {/* Hero: dark background only (no images), changes per category */}
            <div className="relative overflow-hidden min-h-[380px] md:min-h-[340px]">
                <motion.div
                    className="absolute inset-0 w-full h-full"
                    animate={{ background: activeTheme.darkBg || THEME_MAP.default.darkBg }}
                    transition={{ duration: 0.6, ease: 'easeInOut' }}
                />

                {/* Bottom fade to theme page background (web + mobile) */}
                <div className="absolute bottom-0 left-0 right-0 h-24 z-[1]" style={{ background: `linear-gradient(to top, ${pageBg}, transparent)` }} />

                {/* Content on top */}
                <div className="relative z-[2] flex flex-col min-h-[380px] md:min-h-[340px]">
                    <HeroSection />

                    {/* Small gap between search bar and category (mobile); minimal on desktop */}
                    <div className="pt-2 flex-shrink-0 md:pt-1 md:min-h-0" />

                    {/* Filter Bar at bottom of hero */}
                    <div className="backdrop-blur-md bg-black/10 pt-2">
                        <PropertyTypeFilter
                            selectedType={selectedType.id}
                            onSelectType={handleTypeSelect}
                        />
                    </div>
                </div>
            </div>

            <ExclusiveOffers />

            <div className="mt-2 max-w-7xl mx-auto">
                <PropertyFeed selectedType={selectedType.id} />
            </div>
        </main>
    );
};

export default Home;
