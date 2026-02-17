import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { categoryService } from '../../services/categoryService';

// "All" option to show all properties
const ALL_OPTION = {
  id: null,
  label: 'All',
  icon: LucideIcons.Grid3x3,
  isDynamic: false
};

const PropertyTypeFilter = ({ selectedType, onSelectType }) => {
  const STATIC_TYPES = [];

  const [allTypes, setAllTypes] = useState([ALL_OPTION, ...STATIC_TYPES]);

  useEffect(() => {
    const fetchDynamicCategories = async () => {
      try {
        const categories = await categoryService.getActiveCategories();

        // We want ONLY these specific tabs in this specific order
        // 1. All (Already added as ALL_OPTION)
        // 2. PG/Co-Living
        // 3. Rent
        // 4. Buy
        // 5. Plot

        const findCategoryIds = (names) => {
          const searchNames = Array.isArray(names) ? names : [names];
          const found = categories.filter(c =>
            searchNames.some(n =>
              (c.displayName || '').toLowerCase() === n.toLowerCase() ||
              (c.name || '').toLowerCase() === n.toLowerCase()
            )
          );
          return found.map(c => c._id);
        };

        // PG/Co-Living often groups multiple categories
        const pgIds = findCategoryIds(['hostel', 'pg', 'pg/co-living', 'co-living', 'pg/co-livinig']);
        const rentIds = findCategoryIds('Rent');
        const buyIds = findCategoryIds('Buy');
        const plotIds = findCategoryIds(['Plot', 'Plots']);

        const staticList = [

          {
            id: pgIds.length > 0 ? pgIds.join(',') : null,
            label: 'PG/Co-Living',
            icon: LucideIcons.BedDouble, // Importing lucide-react as LucideIcons
            isDynamic: true
          },
          {
            id: rentIds.length > 0 ? rentIds.join(',') : null,
            label: 'Rent',
            icon: LucideIcons.Home,
            isDynamic: true
          },
          {
            id: buyIds.length > 0 ? buyIds.join(',') : null,
            label: 'Buy',
            icon: LucideIcons.Landmark,
            isDynamic: true
          },
          {
            id: plotIds.length > 0 ? plotIds.join(',') : null,
            label: 'Plot',
            icon: LucideIcons.TreePine,
            isDynamic: true
          }
        ];

        // Filter out any that didn't resolve an ID if strictly necessary, 
        // OR keep them disabled/generic. Requirements say "static category", 
        // so we show them even if ID is missing (though functionality might be limited).
        // However, for search filter, having an ID is crucial. 
        // Let's filter out ones where ID is null to avoid broken filters, 
        // but arguably if they are "static" they should appear. 
        // For now, checks if ID exists to avoid broken behaviour.

        const validStaticList = staticList.filter(item => item.id !== null);

        // If you want them to ALWAYS appear even if backend is missing them (and thus broken), 
        // remove the filter. But better to show only working ones or all.
        // User said "static category... admin ke hatane per na hate".
        // This implies even if Admin deletes 'Rent', the tab should stay (but maybe be empty).
        // So we will display them all, but ID will be null (handling in parent/search needed? 
        // If ID is null, filtering won't work).

        // Let's stick to showing them.
        setAllTypes([ALL_OPTION, ...staticList]);

      } catch (error) {
        console.error("Error loading categories:", error);
        // Fallback to static list without IDs if fetch fails
        setAllTypes([ALL_OPTION,
          { label: 'PG/Co-Living', icon: LucideIcons.BedDouble, id: null },
          { label: 'Rent', icon: LucideIcons.Home, id: null },
          { label: 'Buy', icon: LucideIcons.Landmark, id: null },
          { label: 'Plot', icon: LucideIcons.TreePine, id: null }
        ]);
      }
    };

    fetchDynamicCategories();
  }, []);

  return (
    <motion.div
      className="relative w-full border-b border-white/10 bg-transparent"
    >
      {/* Web: centered & larger; Mobile: scrollable as before */}
      <div className="flex gap-3 overflow-x-auto px-5 py-4 no-scrollbar relative max-w-7xl mx-auto items-center justify-center md:justify-center md:flex-wrap md:gap-4 md:overflow-visible">
        {allTypes.map((type) => {
          const Icon = type.icon;
          // Handle selection: null for "All", exact match, or if IDs overlap (for grouped categories)
          let isSelected = false;
          if (selectedType === null && type.id === null) {
            isSelected = true;
          } else if (selectedType && type.id) {
            if (selectedType === type.id) {
              isSelected = true;
            } else if (type.id.includes(',') || selectedType.includes(',')) {
              // For grouped categories, check if any ID matches
              const typeIds = type.id.split(',').map(id => id.trim());
              const selectedIds = selectedType.split(',').map(id => id.trim());
              isSelected = typeIds.some(id => selectedIds.includes(id)) || selectedIds.some(id => typeIds.includes(id));
            }
          }

          return (
            <button
              key={type.id || 'all'}
              onClick={() => onSelectType(type.id, type.label)}
              className="relative flex flex-col items-center gap-1.5 min-w-[68px] md:min-w-[88px] group outline-none z-10 shrink-0"
            >
              {/* Highlight Pill Animation */}
              {isSelected && (
                <motion.div
                  layoutId="activeTabPill"
                  className="absolute -inset-x-2 -inset-y-2 md:-inset-x-3 md:-inset-y-3 bg-gradient-to-br from-white to-amber-50 backdrop-blur-sm rounded-2xl shadow-lg shadow-amber-500/15 border border-amber-200/40 z-[-1]"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}

              <div className={`
                w-11 h-11 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center
                transition-all duration-300 group-active:scale-90
                ${isSelected
                  ? 'text-amber-600'
                  : 'text-white/70 group-hover:text-white'
                }
              `}>
                <Icon className="w-[22px] h-[22px] md:w-8 md:h-8" strokeWidth={isSelected ? 2.5 : 1.8} />
              </div>

              <span className={`
                text-[10px] md:text-sm font-bold tracking-tight transition-colors whitespace-nowrap
                ${isSelected ? 'text-amber-700' : 'text-white/80 group-hover:text-white'}
              `}>
                {type.label}
              </span>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
};

export default PropertyTypeFilter;
