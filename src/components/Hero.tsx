import React from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { HERO_VILLA_IMAGE, SAUDI_CITIES, SAUDI_REGIONS } from '../data/mockData';
import { findNearestSaudiCity, requestBrowserGeolocation } from '../utils/saudiGeo';
import {
  Search,
  Shield,
  Zap,
  CreditCard,
  Award,
  ArrowRight,
  ArrowLeft,
  MapPin,
  CheckCircle,
  Crosshair,
  Crown,
  Repeat,
} from 'lucide-react';

export const Hero: React.FC = () => {
  const {
    language,
    setActiveTab,
    selectedCity,
    setSelectedCity,
    searchFilter,
    setSearchFilter,
    setIsCoverageModalOpen,
    showToast,
  } = useMarketplace();

  const isAr = language === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  const [isDetectingGps, setIsDetectingGps] = React.useState(false);

  const handleHeroGpsDetect = async () => {
    setIsDetectingGps(true);
    try {
      const { coords } = await requestBrowserGeolocation();
      const nearest = findNearestSaudiCity(coords.latitude, coords.longitude, SAUDI_CITIES);
      const matchedCity = isAr ? nearest.city.nameAr : nearest.city.nameEn;
      setSelectedCity(matchedCity);
      showToast(
        isAr
          ? `تم تحديد موقعك بدقة (GPS): ${nearest.city.nameAr} - ${nearest.city.regionNameAr}`
          : `Location detected (GPS): ${nearest.city.nameEn} - ${nearest.city.regionNameEn}`
      );
    } catch {
      showToast(
        isAr
          ? 'تعذر الوصول إلى الـ GPS. اختر مدينتك من القائمة'
          : 'Could not access GPS. Please choose your city from list'
      );
    } finally {
      setIsDetectingGps(false);
    }
  };

  return (
    <section className="relative overflow-hidden bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Value Proposition & Action Form */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6">
            {/* Nationwide Saudi Coverage Pill */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <button
                onClick={() => setActiveTab('subscriptions_catalog')}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/15 to-emerald-500/15 hover:from-amber-500/25 hover:to-emerald-500/25 border border-emerald-400 text-emerald-950 font-bold transition-all active:scale-95 shadow-2xs"
              >
                <Crown className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>
                  {isAr
                    ? 'باقات الصيانة الدورية المؤتمتة (Care Pass) 👑'
                    : 'Recurring Maintenance Passes (Care Pass) 👑'}
                </span>
                <span className="text-[10px] bg-emerald-800 text-white px-1.5 py-0.5 rounded-full font-semibold">
                  {isAr ? 'وفر 25%' : '-25%'}
                </span>
              </button>

              <button
                onClick={() => setIsCoverageModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-900 font-bold transition-all active:scale-95"
              >
                <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span>
                  {isAr
                    ? '🇸🇦 تغطية شاملة لكافة مناطق المملكة الـ 13'
                    : '🇸🇦 All 13 Saudi Regions Nationwide Coverage'}
                </span>
                <span className="text-[10px] bg-emerald-700 text-white px-1.5 py-0.5 rounded-full font-semibold">
                  {isAr ? 'تغيير المدينة' : 'Switch'}
                </span>
              </button>

              <span className="text-slate-400 hidden sm:inline" aria-hidden="true">·</span>
              <span className="text-slate-600 font-medium text-[11px] sm:text-xs">
                {isAr ? 'كود البناء السعودي SASO' : 'SASO Building Code'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-slate-950 tracking-tight leading-tight" style={{ textWrap: 'balance' }}>
              {isAr ? (
                <>
                  خدمات صيانة ونظافة منزلية معتمدة تغطي كافة مدن ومحافظات المملكة
                </>
              ) : (
                <>
                  Verified Home Maintenance & Eco Cleaning Across Every City in Saudi Arabia
                </>
              )}
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-slate-600 leading-relaxed max-w-2xl">
              {isAr
                ? 'اربط منزلك أو منشأتك بنخبة الفنيين والشركات المرخصة في كافة مناطق المملكة الـ 13: الرياض، مكة، الشرقية، عسير، تبوك ونيوم، القصيم، حائل، جازان وجميع المحافظات. غسيل مكيفات متقدم، تنظيف عميق، كشف تسربات، وفواتير إلكترونية معتمدة من هيئة الزكاة والضريبة (ZATCA).'
                : 'Connect with certified technicians and licensed cleaning providers in all 13 Saudi provinces: Riyadh, Makkah, Eastern Province, Asir, Tabuk & NEOM, Qassim, Hail, Jazan, and beyond. High-efficiency AC servicing, leak detection, and ZATCA-compliant digital invoicing.'}
            </p>

            {/* Quick Search & Filter Bar */}
            <div className="p-2.5 sm:p-3 bg-slate-50 border border-slate-200 rounded-2xl shadow-xs space-y-2.5 sm:space-y-0 sm:flex sm:items-center sm:gap-2">
              {/* City selector dropdown with GPS button */}
              <div className="sm:w-2/5 flex items-center gap-1.5">
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-800"
                >
                  {SAUDI_CITIES.map((c) => (
                    <option key={c.id} value={isAr ? c.nameAr : c.nameEn}>
                      {isAr ? `${c.nameAr} (${c.regionNameAr})` : `${c.nameEn} (${c.regionNameEn})`}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={handleHeroGpsDetect}
                  disabled={isDetectingGps}
                  title={isAr ? 'تحديد مدينتي تلقائياً عبر الـ GPS' : 'Auto-detect city via GPS'}
                  className="p-2.5 rounded-xl bg-white hover:bg-emerald-50 border border-slate-300 hover:border-emerald-600 text-emerald-800 transition-colors shrink-0 shadow-2xs flex items-center justify-center active:scale-95"
                >
                  <Crosshair
                    className={`w-4 h-4 ${
                      isDetectingGps ? 'animate-spin text-emerald-600' : 'text-emerald-800'
                    }`}
                  />
                </button>
              </div>

              {/* Keyword Search */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute top-3 left-3 rtl:left-auto rtl:right-3 pointer-events-none" />
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder={isAr ? 'ابحث عن خدمة (مكيفات، نظافة، سباكة...)' : 'Search services (AC, cleaning, leak...)'}
                  className="w-full bg-white border border-slate-300 rounded-xl pl-9 rtl:pl-3 rtl:pr-9 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-800"
                />
              </div>

              {/* Action Button */}
              <button
                onClick={() => setActiveTab('services')}
                className="w-full sm:w-auto px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl transition-colors whitespace-nowrap flex items-center justify-center gap-1.5 shrink-0 shadow-xs"
              >
                <span>{isAr ? 'عرض الخدمات' : 'Find Pros'}</span>
                <ArrowIcon className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Explore All Regions Trigger */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="text-slate-500 font-medium">{isAr ? 'الخدمات الأكثر طلباً:' : 'Popular now:'}</span>
              <button
                onClick={() => {
                  setSearchFilter('مكيف');
                  setActiveTab('services');
                }}
                className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-md text-slate-700 transition-colors"
              >
                {isAr ? 'غسيل مكيف سبليت (140 ر.س)' : 'Split AC Flush (140 SAR)'}
              </button>
              <button
                onClick={() => {
                  setSearchFilter('نظافة');
                  setActiveTab('services');
                }}
                className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-md text-slate-700 transition-colors"
              >
                {isAr ? 'تنظيف فلل عميق' : 'Villa Deep Cleaning'}
              </button>
              <button
                onClick={() => setIsCoverageModalOpen(true)}
                className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-md text-emerald-800 font-bold transition-colors flex items-center gap-1"
              >
                <MapPin className="w-3 h-3 text-emerald-700" />
                <span>{isAr ? 'خريطة مناطق المملكة الـ 13' : 'View 13 Regions Map'}</span>
              </button>
            </div>
          </div>

          {/* Right Column: Hero Showcase Image with Scrim & Key Proof Metric */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-md aspect-16/10 sm:aspect-16/9 lg:aspect-4/3 bg-slate-100">
              <img
                src={HERO_VILLA_IMAGE}
                alt="Modern Saudi residential interior serviced by Mutqin"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-transparent flex flex-col justify-end p-5 sm:p-6 text-white">
                <div className="flex items-center gap-2 text-xs font-medium text-emerald-300 mb-1">
                  <Shield className="w-4 h-4" />
                  <span>{isAr ? 'ضمان إتقان لمدة 30 يوماً في كافة المناطق' : '30-Day Mutqin Quality Guarantee'}</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white mb-1">
                  {isAr ? 'فنيون سعوديون ومقيمون مرخصون بسجل تجاري' : 'Licensed Contractors with Verified CR'}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {isAr
                    ? 'فحص أمني دقيق وهويات مهنية معتمدة لحماية خصوصية المنازل والمقيمين في كافة أنحاء المملكة.'
                    : 'Background-checked trade technicians for home security and peace of mind across all Saudi Arabia.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Column Full-width Trust Strip */}
        <div className="mt-12 pt-8 border-t border-slate-200 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-emerald-800 font-semibold text-sm">
              <CreditCard className="w-4 h-4" />
              <span>{isAr ? 'بوابات دفع سعودية معتمدة' : 'Verified Saudi Rails'}</span>
            </div>
            <p className="text-xs text-slate-500">
              {isAr ? 'مدى، أبل باي، STC Pay، وبطاقات الائتمان بحماية 3D-Secure.' : 'Mada, Apple Pay, STC Pay with 3D-Secure.'}
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-emerald-800 font-semibold text-sm">
              <Shield className="w-4 h-4" />
              <span>{isAr ? 'فاتورة زكاة وضريبة (ZATCA)' : 'ZATCA Tax Invoices'}</span>
            </div>
            <p className="text-xs text-slate-500">
              {isAr ? 'فواتير ضريبية فورية برمز QR متوافق مع المرحلة الثانية.' : 'Phase 2 compliant e-invoices with QR code.'}
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-emerald-800 font-semibold text-sm">
              <Zap className="w-4 h-4" />
              <span>{isAr ? 'مختبر أمان المواد والكيمياء' : 'Material Safety Lab'}</span>
            </div>
            <p className="text-xs text-slate-500">
              {isAr ? 'فحص علمي PubChem للمنظفات وغازات التبريد الآمنة.' : 'PubChem scientific screening for safe chemicals.'}
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-emerald-800 font-semibold text-sm">
              <Award className="w-4 h-4" />
              <span>{isAr ? 'ذكاء اصطناعي تشخيصي' : 'AI Diagnostic Engine'}</span>
            </div>
            <p className="text-xs text-slate-500">
              {isAr ? 'تشخيص فوري للأعطال بالصور والمحادثة مع بحث جوجل.' : 'Instant problem triage with Google Search data.'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
