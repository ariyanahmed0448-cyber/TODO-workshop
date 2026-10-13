import React, { useState, useEffect, useRef } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { SAUDI_CITIES, SAUDI_REGIONS } from '../data/mockData';
import {
  findNearestSaudiCity,
  generateSaudiShortCode,
  estimateDispatchEta,
  SAUDI_CITY_COORDINATES,
} from '../utils/saudiGeo';
import {
  MapPin,
  Navigation,
  Search,
  Crosshair,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Building2,
  Clock,
  Compass,
  X,
} from 'lucide-react';

interface SaudiLocationPickerProps {
  selectedCity: string;
  onCityChange: (cityName: string) => void;
  district: string;
  onDistrictChange: (districtName: string) => void;
  streetAddress: string;
  onStreetAddressChange: (street: string) => void;
  onLocationDetected?: (coords: {
    lat: number;
    lng: number;
    accuracy?: number;
    shortCode?: string;
  }) => void;
}

export const SaudiLocationPicker: React.FC<SaudiLocationPickerProps> = ({
  selectedCity,
  onCityChange,
  district,
  onDistrictChange,
  streetAddress,
  onStreetAddressChange,
  onLocationDetected,
}) => {
  const { language, showToast } = useMarketplace();
  const isAr = language === 'ar';

  // Geolocation state
  const [isLocating, setIsLocating] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [isGpsLocked, setIsGpsLocked] = useState(false);
  const [accuracyMeters, setAccuracyMeters] = useState<number | null>(null);
  const [currentCoords, setCurrentCoords] = useState<{ lat: number; lng: number }>({
    lat: 24.7136,
    lng: 46.6753,
  });
  const [nationalAddressCode, setNationalAddressCode] = useState<string>('RYDH4281');
  const [distanceToHubKm, setDistanceToHubKm] = useState<number>(3.2);

  // Address search query state
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Filter cities & districts for autocomplete search
  const searchResults = React.useMemo(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) return [];

    const query = searchQuery.trim().toLowerCase();
    const results: Array<{
      type: 'district' | 'city';
      cityNameAr: string;
      cityNameEn: string;
      districtNameAr?: string;
      districtNameEn?: string;
      regionNameAr: string;
      regionNameEn: string;
      cityId: string;
      lat: number;
      lng: number;
    }> = [];

    for (const city of SAUDI_CITIES) {
      const cityCoords = SAUDI_CITY_COORDINATES[city.id] || { lat: 24.7136, lng: 46.6753 };
      
      // Match city name
      if (
        city.nameAr.toLowerCase().includes(query) ||
        city.nameEn.toLowerCase().includes(query)
      ) {
        results.push({
          type: 'city',
          cityNameAr: city.nameAr,
          cityNameEn: city.nameEn,
          regionNameAr: city.regionNameAr,
          regionNameEn: city.regionNameEn,
          cityId: city.id,
          lat: cityCoords.lat,
          lng: cityCoords.lng,
        });
      }

      // Match districts
      city.districtsAr.forEach((distAr, idx) => {
        const distEn = city.districtsEn[idx] || distAr;
        if (
          distAr.toLowerCase().includes(query) ||
          distEn.toLowerCase().includes(query)
        ) {
          results.push({
            type: 'district',
            cityNameAr: city.nameAr,
            cityNameEn: city.nameEn,
            districtNameAr: distAr,
            districtNameEn: distEn,
            regionNameAr: city.regionNameAr,
            regionNameEn: city.regionNameEn,
            cityId: city.id,
            lat: cityCoords.lat,
            lng: cityCoords.lng,
          });
        }
      });
    }

    return results.slice(0, 6);
  }, [searchQuery]);

  // Click outside to close search dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Sync coords when user manually changes city
  useEffect(() => {
    const activeCityObj = SAUDI_CITIES.find(
      (c) => (isAr ? c.nameAr : c.nameEn) === selectedCity
    );
    if (activeCityObj && !isGpsLocked) {
      const coords = SAUDI_CITY_COORDINATES[activeCityObj.id] || {
        lat: 24.7136,
        lng: 46.6753,
      };
      setCurrentCoords(coords);
      setNationalAddressCode(generateSaudiShortCode(activeCityObj.id));
    }
  }, [selectedCity, isAr, isGpsLocked]);

  // Handle Browser Geolocation Trigger
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      const errMsg = isAr
        ? 'متصفحك لا يدعم خدمة تحديد المواقع (Geolocation)'
        : 'Your browser does not support Geolocation services';
      setGeoError(errMsg);
      showToast(errMsg);
      return;
    }

    setIsLocating(true);
    setGeoError(null);

    // Subtle haptic vibration for mobile users
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([30, 40, 30]);
      } catch {
        // ignore
      }
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        const accuracyNum = Math.round(accuracy || 12);
        
        setCurrentCoords({ lat: latitude, lng: longitude });
        setAccuracyMeters(accuracyNum);
        setIsGpsLocked(true);
        setIsLocating(false);

        // Find closest Saudi city
        const nearest = findNearestSaudiCity(latitude, longitude, SAUDI_CITIES);
        const cityObj = nearest.city;
        const cityName = isAr ? cityObj.nameAr : cityObj.nameEn;
        
        onCityChange(cityName);

        // Pick closest suggested district
        const primaryDistrict = isAr
          ? cityObj.districtsAr[0] || 'وسط المدينة'
          : cityObj.districtsEn[0] || 'Downtown';
        onDistrictChange(primaryDistrict);

        // Generate National Address code
        const code = generateSaudiShortCode(cityObj.id);
        setNationalAddressCode(code);
        setDistanceToHubKm(Math.max(1.2, Math.round(nearest.distanceKm * 10) / 10));

        // Update default street address if empty
        if (!streetAddress || streetAddress.includes('شارع التخصصي')) {
          onStreetAddressChange(
            isAr
              ? `طريق الملك فهد، مبنى رقم ${Math.floor(1000 + Math.random() * 8000)}`
              : `King Fahd Rd, Building ${Math.floor(1000 + Math.random() * 8000)}`
          );
        }

        if (onLocationDetected) {
          onLocationDetected({
            lat: latitude,
            lng: longitude,
            accuracy: accuracyNum,
            shortCode: code,
          });
        }

        const successMsg = isAr
          ? `تم تحديد موقعك بدقة (GPS): ${cityObj.nameAr} - ${primaryDistrict} (دقة ±${accuracyNum}م)`
          : `GPS Location locked: ${cityObj.nameEn} - ${primaryDistrict} (Accuracy ±${accuracyNum}m)`;
        showToast(successMsg);
      },
      (error) => {
        setIsLocating(false);
        console.warn('Geolocation error:', error);

        let msg = isAr
          ? 'تعذر الوصول إلى نظام تحديد المواقع. يمكنك تحديد المدينة والحي من القائمة أدناه.'
          : 'Could not access GPS. Please pick your city and district from the list below.';

        if (error.code === error.PERMISSION_DENIED) {
          msg = isAr
            ? 'تم رفض إذن تحديد الموقع من المتصفح. يمكنك تفعيله من إعدادات المتصفح أو اختيار المدينة يدوياً.'
            : 'Location permission was denied. You can select your city and district manually.';
        } else if (error.code === error.TIMEOUT) {
          msg = isAr
            ? 'انتهت مهلة استجابة الـ GPS. اختر موقعك يدوياً.'
            : 'GPS location request timed out. Please select manually.';
        }

        setGeoError(msg);
        showToast(msg);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 45000,
      }
    );
  };

  // Select Search Item
  const handleSelectSearchResult = (item: (typeof searchResults)[0]) => {
    onCityChange(isAr ? item.cityNameAr : item.cityNameEn);
    if (item.districtNameAr) {
      onDistrictChange(isAr ? item.districtNameAr : item.districtNameEn!);
    }
    setCurrentCoords({ lat: item.lat, lng: item.lng });
    setNationalAddressCode(generateSaudiShortCode(item.cityId));
    setIsGpsLocked(false);
    setSearchQuery('');
    setIsSearchOpen(false);

    showToast(
      isAr
        ? `تم تعيين الموقع: ${item.cityNameAr} ${item.districtNameAr ? `- ${item.districtNameAr}` : ''}`
        : `Location set: ${item.cityNameEn} ${item.districtNameEn ? `- ${item.districtNameEn}` : ''}`
    );
  };

  const dispatchEta = estimateDispatchEta(distanceToHubKm);

  return (
    <div className="space-y-3.5 bg-slate-50/80 border border-slate-200/90 rounded-2xl p-3.5 sm:p-4.5">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-800 text-white flex items-center justify-center shadow-2xs">
            <Navigation className="w-4 h-4 text-emerald-200" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <span>{isAr ? 'تحديد موقع التوجيه وميدان الخدمة' : 'Service Dispatch Location'}</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-mono font-semibold">
                KSA Dispatch
              </span>
            </h4>
            <p className="text-[11px] text-slate-500">
              {isAr
                ? 'استخدم الـ GPS أو البحث بالحي للوصول الدقيق للفني الميداني'
                : 'Use device GPS or search by district for accurate technician dispatch'}
            </p>
          </div>
        </div>

        {/* GPS Quick Action Button */}
        <button
          type="button"
          onClick={handleDetectLocation}
          disabled={isLocating}
          className={`w-full sm:w-auto px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-2xs active:scale-97 ${
            isGpsLocked
              ? 'bg-emerald-700 hover:bg-emerald-800 text-white border border-emerald-600'
              : 'bg-emerald-800 hover:bg-emerald-900 text-white'
          } ${isLocating ? 'opacity-80 cursor-wait' : ''}`}
        >
          {isLocating ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              <span>{isAr ? 'جاري تحديد موقعك (GPS)...' : 'Acquiring GPS fix...'}</span>
            </>
          ) : isGpsLocked ? (
            <>
              <Crosshair className="w-4 h-4 text-emerald-300 animate-pulse" />
              <span>{isAr ? 'تحديث الإحداثيات (GPS)' : 'Refresh GPS Location'}</span>
            </>
          ) : (
            <>
              <Crosshair className="w-4 h-4 text-emerald-300" />
              <span>{isAr ? 'تحديد موقعي الحالي تلقائياً (GPS)' : 'Detect Current Location (GPS)'}</span>
            </>
          )}
        </button>
      </div>

      {/* GPS Status feedback or error banner */}
      {geoError && (
        <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span>{geoError}</span>
          </div>
          <button
            type="button"
            onClick={() => setGeoError(null)}
            className="text-rose-500 hover:text-rose-800"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {isGpsLocked && (
        <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span className="font-semibold">
              {isAr ? 'تم قفل الموقع الجغرافي بنجاح' : 'GPS Location Locked'}:
            </span>
            <span className="font-mono text-[11px] bg-white px-2 py-0.5 rounded border border-emerald-200 text-emerald-900">
              {currentCoords.lat.toFixed(4)}° N, {currentCoords.lng.toFixed(4)}° E
            </span>
          </div>
          {accuracyMeters && (
            <span className="text-[11px] text-emerald-800 font-medium">
              {isAr ? `دقة القياس: ±${accuracyMeters}م` : `Accuracy: ±${accuracyMeters}m`}
            </span>
          )}
        </div>
      )}

      {/* Address Search Bar with Instant Autocomplete */}
      <div className="relative" ref={searchContainerRef}>
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 rtl:right-3 rtl:left-auto left-auto rtl:right-3 sm:right-3.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearchOpen(true);
            }}
            onFocus={() => setIsSearchOpen(true)}
            placeholder={
              isAr
                ? 'ابحث بالحي أو المدينة (مثال: حي النخيل، الملقا، الروضة، العليا)...'
                : 'Search by district or city (e.g. Al Nakheel, Al Malqa, Al Rawdah)...'
            }
            className="w-full bg-white border border-slate-300 rounded-xl px-9 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-800 transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute left-3 rtl:left-3 rtl:right-auto text-slate-400 hover:text-slate-700"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Search Results Dropdown */}
        {isSearchOpen && searchResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-30 max-h-56 overflow-y-auto divide-y divide-slate-100">
            {searchResults.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectSearchResult(item)}
                className="w-full text-right rtl:text-right ltr:text-left p-2.5 hover:bg-slate-50 transition-colors flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-emerald-800 shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-slate-900">
                      {item.districtNameAr
                        ? isAr
                          ? `${item.districtNameAr}، ${item.cityNameAr}`
                          : `${item.districtNameEn}, ${item.cityNameEn}`
                        : isAr
                        ? item.cityNameAr
                        : item.cityNameEn}
                    </span>
                    <span className="text-[10px] text-slate-500 block">
                      {isAr ? item.regionNameAr : item.regionNameEn}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                  {item.type === 'district' ? (isAr ? 'حي معتمد' : 'District') : isAr ? 'مدينة' : 'City'}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Visual Interactive Map Preview Card & Dispatch Details */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        {/* Interactive Tactical Map Pin Widget */}
        <div className="relative h-28 sm:h-32 bg-slate-900 overflow-hidden flex items-center justify-center">
          {/* Subtle Map Grid Pattern */}
          <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#38bdf815_1px,transparent_1px),linear-gradient(to_bottom,#38bdf815_1px,transparent_1px)] bg-[size:16px_16px]" />

          {/* Contour Radial Gradient for Saudi Topography feel */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#065f4640_0%,transparent_70%)]" />

          {/* Pulsing Dispatch Radar */}
          <div className="absolute w-24 h-24 rounded-full border border-emerald-500/30 animate-ping pointer-events-none" />
          <div className="absolute w-16 h-16 rounded-full border border-emerald-400/50 pointer-events-none" />

          {/* Map Pin Marker */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg border-2 border-white animate-bounce">
              <MapPin className="w-4.5 h-4.5 text-white" />
            </div>
            <div className="mt-1 px-2.5 py-0.5 rounded-full bg-slate-900/90 text-white text-[10px] font-bold font-mono border border-slate-700 shadow-md backdrop-blur-xs flex items-center gap-1">
              <span>{isAr ? 'نقطة الخدمة' : 'Service Pin'}:</span>
              <span className="text-emerald-400">{district || selectedCity}</span>
            </div>
          </div>

          {/* Top Info Overlays on Map */}
          <div className="absolute top-2 right-2 rtl:right-2 rtl:left-auto bg-slate-900/80 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded-md font-mono border border-slate-700 flex items-center gap-1">
            <Compass className="w-3 h-3 text-emerald-400" />
            <span>
              {currentCoords.lat.toFixed(3)}°N, {currentCoords.lng.toFixed(3)}°E
            </span>
          </div>

          {/* Google Maps External Link */}
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${currentCoords.lat},${currentCoords.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-2 left-2 rtl:left-2 rtl:right-auto bg-white/95 hover:bg-white text-slate-900 text-[10px] font-bold px-2 py-1 rounded-md shadow flex items-center gap-1 transition-all"
          >
            <span>{isAr ? 'خرائط جوجل' : 'Google Maps'}</span>
            <ExternalLink className="w-2.5 h-2.5 text-slate-500" />
          </a>
        </div>

        {/* Dispatch Metrics & Saudi National Address Card */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {/* Dispatch ETA */}
          <div className="flex items-center gap-2 p-2 bg-white rounded-lg border border-slate-200">
            <Clock className="w-4 h-4 text-emerald-800 shrink-0" />
            <div>
              <div className="font-bold text-slate-900 flex items-center gap-1">
                <span>{isAr ? 'زمن الوصول المقدر للفني:' : 'Estimated Arrival:'}</span>
                <span className="text-emerald-800 font-mono">
                  {dispatchEta.etaMinutes} {isAr ? 'دقيقة' : 'min'}
                </span>
              </div>
              <div className="text-[10px] text-slate-500">
                {isAr ? dispatchEta.statusLabelAr : dispatchEta.statusLabelEn}
              </div>
            </div>
          </div>

          {/* Saudi National Address Code */}
          <div className="flex items-center gap-2 p-2 bg-white rounded-lg border border-slate-200">
            <Building2 className="w-4 h-4 text-amber-700 shrink-0" />
            <div>
              <div className="font-bold text-slate-900 flex items-center gap-1">
                <span>{isAr ? 'الرمز المختصر للعنوان الوطني:' : 'National Short Address:'}</span>
                <span className="font-mono font-bold text-amber-800 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                  {nationalAddressCode}
                </span>
              </div>
              <div className="text-[10px] text-slate-500">
                {isAr ? 'معتمد ومطابق لبيانات البريد السعودي سبل' : 'Saudi Post (SPL) Certified Code'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
