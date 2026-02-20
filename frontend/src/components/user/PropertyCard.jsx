import React, { useState, useEffect } from 'react';
import { MapPin, Star, IndianRupee, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../../services/apiService';
import toast from 'react-hot-toast';

const PropertyCard = ({ property, data, className = "", isSaved: initialIsSaved }) => {
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(initialIsSaved || false);
  const [saveLoading, setSaveLoading] = useState(false);

  // Sync with initialIsSaved if it changes
  useEffect(() => {
    if (initialIsSaved !== undefined) {
      setIsSaved(initialIsSaved);
    }
  }, [initialIsSaved]);

  const item = property || data;

  if (!item) return null;

  const {
    _id,
    name,
    address,
    images,
    propertyType,
    rating,
    startingPrice,
    details
  } = item;

  const handleToggleSave = async (e) => {
    e.stopPropagation(); // Don't navigate to details
    if (!localStorage.getItem('token')) {
      toast.error("Please login to save properties");
      return;
    }

    if (saveLoading) return;

    setSaveLoading(true);
    const newState = !isSaved;
    setIsSaved(newState); // Optimistic update

    try {
      await userService.toggleSavedHotel(_id || item.id);
      toast.success(newState ? "Added to wishlist" : "Removed from wishlist");
    } catch (error) {
      setIsSaved(!newState); // Revert
      toast.error("Failed to update wishlist");
    } finally {
      setSaveLoading(false);
    }
  };

  // Function to clean dirty URLs (handles backticks, spaces, quotes)
  const cleanImageUrl = (url) => {
    if (!url || typeof url !== 'string') return '';
    // Remove backticks, single quotes, double quotes, and surrounding whitespace
    return url.replace(/[`'"]/g, '').trim();
  };
  const displayName = name || item.propertyName || 'Untitled';
  const dynamicCatName = item.dynamicCategory?.displayName || item.dynamicCategory?.name;

  const typeRaw = (propertyType || item.propertyType || '').toString();
  const normalizedType = typeRaw
    ? typeRaw.toLowerCase() === 'pg'
      ? 'PG'
      : typeRaw.charAt(0).toUpperCase() + typeRaw.slice(1).toLowerCase()
    : '';

  const typeLabel = dynamicCatName ? dynamicCatName.toUpperCase() : (normalizedType || typeRaw).toString().toUpperCase();


  // Improved Rating Logic
  const rawRating =
    item.avgRating !== undefined ? item.avgRating :
      item.rating !== undefined ? item.rating :
        rating;

  const reviewCount = item.totalReviews || item.reviews || 0;

  // Show rating if it exists and is > 0, otherwise show 'New'
  const displayRating = (Number(rawRating) > 0) ? Number(rawRating).toFixed(1) : 'New';

  // Improved Price Logic - Check more fields
  const rawPrice =
    startingPrice ??
    item.startingPrice ??
    item.minPrice ??
    item.min_price ??
    item.price ??
    item.costPerNight ??
    item.amount ??
    null;

  const displayPrice =
    typeof rawPrice === 'number' && rawPrice > 0 ? rawPrice : null;

  const imageSrc =
    images?.cover ||
    cleanImageUrl(item.coverImage) ||
    cleanImageUrl(
      Array.isArray(item.propertyImages) ? item.propertyImages[0] : ''
    ) ||
    'https://via.placeholder.com/400x300?text=No+Image';

  const badgeTypeKey = normalizedType || typeRaw;

  // Housing.com style colors often use distinct semantic colors for types
  const getTypeColor = (type) => {
    switch (type) {
      case 'Hotel': return 'bg-blue-600 text-white border-blue-600';
      case 'Villa': return 'bg-purple-600 text-white border-purple-600';
      case 'Resort': return 'bg-orange-500 text-white border-orange-500';
      case 'Homestay': return 'bg-indigo-500 text-white border-indigo-500';
      case 'Hostel': return 'bg-pink-500 text-white border-pink-500';
      case 'PG': return 'bg-rose-500 text-white border-rose-500';
      default: return 'bg-emerald-600 text-white border-emerald-600';
    }
  };

  const formattedPrice = displayPrice
    ? displayPrice.toLocaleString('en-IN', { maximumFractionDigits: 0 })
    : 'Price on Request';

  const priceSuffix = ['PG', 'Hostel', 'Rent'].includes(badgeTypeKey)
    ? '/month'
    : ['Buy', 'Plot'].includes(badgeTypeKey)
      ? ''
      : '/night';

  return (
    <div
      onClick={() => navigate(`/hotel/${_id}`)}
      className={`group bg-white rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 hover:-translate-y-1 ${className}`}
    >
      {/* Image Container - Reduced height for compact look */}
      <div className="relative h-40 w-full bg-gray-100 overflow-hidden">
        <img
          src={imageSrc}
          alt={displayName}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
          }}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />

        {/* Floating Badges */}
        <div className="absolute top-2.5 left-2.5 flex gap-2">
          {typeLabel && (
            <span className={`px-2 py-0.5 rounded-[4px] text-[9px] font-bold uppercase tracking-wide shadow-sm ${getTypeColor(badgeTypeKey)}`}>
              {typeLabel}
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleToggleSave}
          className="absolute top-2.5 right-2.5 p-1.5 bg-white rounded-full shadow-md z-20 hover:bg-gray-50 active:scale-95 transition-all group-hover:block"
        >
          <Heart
            size={16}
            className={`${isSaved ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
          />
        </button>

        {/* Rating Badge */}
        <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 bg-white/95 backdrop-blur-md px-1.5 py-0.5 rounded-[4px] shadow-sm text-[10px] font-bold text-gray-800">
          <span className="text-green-600 font-extrabold">{displayRating}</span>
          <Star size={9} className="fill-green-600 text-green-600" />
        </div>
      </div>

      {/* Content Section - Compact */}
      <div className="p-3 flex flex-col gap-1.5">
        {/* Title */}
        <div className="mb-0">
          <h3 className="font-bold text-sm text-gray-900 line-clamp-1 group-hover:text-emerald-700 transition-colors">
            {displayName}
          </h3>
          <div className="flex items-center gap-1 text-gray-500 text-[10px] mt-0.5">
            <MapPin size={10} className="shrink-0 text-gray-400" />
            <span className="line-clamp-1 truncate">
              {address?.city || item.city}, {address?.state || item.state || 'India'}
            </span>
          </div>
        </div>

        {/* Price Section */}
        <div className="mt-1 flex items-baseline gap-0.5">
          <IndianRupee size={15} className="text-gray-900 -mr-0.5 self-center" strokeWidth={2.5} />
          <span className="text-lg font-bold text-gray-900 tracking-tight">
            {formattedPrice}
          </span>
          {displayPrice && (
            <span className="text-[10px] text-gray-500 font-medium ml-1">
              {priceSuffix}
            </span>
          )}
        </div>

        {/* Bottom Action / Footer */}
        <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between">
          <div className="flex gap-2 text-[10px] text-gray-500 font-medium">
            <span className="bg-gray-50 px-1.5 py-0.5 rounded text-gray-600">
              See Details
            </span>
          </div>

          <button className="text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors flex items-center gap-0.5 group/btn">
            View
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transform group-hover/btn:translate-x-1 transition-transform"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
