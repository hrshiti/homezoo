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

        const displayLabel = (name) => {
          const n = (name || '').toLowerCase();
          if (n === 'hostel' || n === 'pg' || n === 'pg/co-living' || n === 'co-living') return 'PG/Co-Living';
          return name;
        };
        
        // Group categories by normalized label to combine PG, Hostel, PG/Co-living into one option
        const groupedMap = new Map();
        
        categories.forEach(cat => {
          const normalizedLabel = displayLabel(cat.displayName) || cat.displayName;
          if (!groupedMap.has(normalizedLabel)) {
            groupedMap.set(normalizedLabel, {
              ids: [],
              label: normalizedLabel,
              icon: LucideIcons[cat.icon] || LucideIcons.HelpCircle,
              isDynamic: true
            });
          }
          groupedMap.get(normalizedLabel).ids.push(cat._id);
        });
        
        // Convert grouped map to array, using comma-separated IDs for grouped categories
        const dynamicTypes = Array.from(groupedMap.values()).map(group => ({
          id: group.ids.length === 1 ? group.ids[0] : group.ids.join(','), // Send all IDs if grouped
          label: group.label,
          icon: group.icon,
          isDynamic: true
        }));

        setAllTypes([ALL_OPTION, ...STATIC_TYPES, ...dynamicTypes]);
      } catch (error) {
        console.error("Error loading categories:", error);
        setAllTypes([ALL_OPTION, ...STATIC_TYPES]);
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
