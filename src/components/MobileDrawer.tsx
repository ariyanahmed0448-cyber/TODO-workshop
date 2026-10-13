import React from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { SAUDI_REGIONS, SAUDI_CITIES } from '../data/mockData';
import {
  X,
  MapPin,
  ShieldCheck,
  Award,
  Wrench,
  FileText,
  CalendarCheck2,
  HardHat,
  Globe,
  PhoneCall,
  CheckCircle2,
  Sparkles,
  Crown,
  Repeat,
} from 'lucide-react';

export const MobileDrawer: React.FC = () => {
  const {
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    language,
    setLanguage,
    role,
    setRole,
    activeTab,
    setActiveTab,
    selectedRegion,
    setSelectedRegion,
    selectedCity,
    setSelectedCity,
    loyaltyProfile,
    setIsLoyaltyModalOpen,
    setIsAiModalOpen,
    setIsCoverageModalOpen,
    bookings,
  } = useMarketplace();

  if (!isMobileMenuOpen) return null;

  const isAr = language === 'ar';

  const navigateTo = (tab: string) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  const handleSelectCity = (cityObj: typeof SAUDI_CITIES[0]) => {
    setSelectedRegion(cityObj.regionId);
    setSelectedCity(isAr ? cityObj.nameAr : cityObj.nameEn);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="md:hidden fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        onClick={() => setIsMobileMenuOpen(false)}
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
      />

      {/* Drawer Body */}
      <div className="relative w-4/5 max-w-sm bg-white h-full shadow-2xl flex flex-col z-10 overflow-y-auto">
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <span className="text-xl font-extrabold text-emerald-800">مُتقَن</span>
            <span className="text-slate-400">|</span>
            <span className="text-sm font-semibold text-slate-800">Mutqin</span>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg bg-white border border-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Persona & Language Switcher in Drawer */}
        <div className="p-4 border-b border-slate-100 space-y-3 bg-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">
              {isAr ? 'نوع الحساب' : 'Account Persona'}
            </span>
            <button
              onClick={() => setLanguage(isAr ? 'en' : 'ar')}
              className="flex items-center gap-1 text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{isAr ? 'English' : 'العربية'}</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-lg text-xs">
            <button
              onClick={() => {
                setRole('customer');
                if (activeTab === 'technician_portal') setActiveTab('home');
              }}
              className={`py-1.5 font-medium rounded-md transition-colors ${
                role === 'customer'
                  ? 'bg-white text-slate-900 font-bold shadow-xs'
                  : 'text-slate-600'
              }`}
            >
              {isAr ? 'عميل (طالب خدمة)' : 'Customer'}
            </button>
            <button
              onClick={() => {
                setRole('technician');
                setActiveTab('technician_portal');
                setIsMobileMenuOpen(false);
              }}
              className={`py-1.5 font-medium rounded-md transition-colors ${
                role === 'technician'
                  ? 'bg-white text-emerald-800 font-bold shadow-xs'
                  : 'text-slate-600'
              }`}
            >
              {isAr ? 'فني مرخص' : 'Technician'}
            </button>
          </div>
        </div>

        {/* Loyalty Balance Card */}
        <div className="p-4 border-b border-slate-100">
          <div
            onClick={() => {
              setIsMobileMenuOpen(false);
              setIsLoyaltyModalOpen(true);
            }}
            className="p-3 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl cursor-pointer flex items-center justify-between"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-amber-950 block">
                  {isAr ? 'نقاط مُتقَن (Mutqin Points)' : 'Mutqin Points Wallet'}
                </span>
                <span className="text-xs font-mono font-bold text-amber-800">
                  {loyaltyProfile.pointsBalance} {isAr ? 'نقطة' : 'pts'}
                </span>
              </div>
            </div>
            <span className="text-[11px] text-amber-800 underline font-semibold">
              {isAr ? 'استبدال' : 'Redeem'}
            </span>
          </div>
        </div>

        {/* Current Active City & Coverage Indicator */}
        <div className="p-4 border-b border-slate-100 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-700" />
              <span>{isAr ? 'المدينة النشطة الحالية' : 'Active Location'}</span>
            </span>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsCoverageModalOpen(true);
              }}
              className="text-xs text-emerald-800 font-bold underline"
            >
              {isAr ? 'تغيير المنطقة' : 'Change Region'}
            </button>
          </div>

          <div className="p-2.5 bg-emerald-50/80 border border-emerald-200/80 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-900 block">{selectedCity}</span>
              <span className="text-[11px] text-emerald-800 font-medium">
                {isAr ? 'مشمول بكامل الضمان والفنيين' : '100% Service Coverage'}
              </span>
            </div>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
        </div>

        {/* Navigation Links */}
        <div className="p-4 space-y-1 flex-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
            {isAr ? 'أقسام المنصة' : 'Marketplace Sections'}
          </span>

          <button
            onClick={() => navigateTo('home')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-left rtl:text-right transition-colors ${
              activeTab === 'home'
                ? 'bg-emerald-50 text-emerald-900 font-bold'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-700" />
            <span>{isAr ? 'الرئيسية' : 'Home Page'}</span>
          </button>

          <button
            onClick={() => navigateTo('services')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-left rtl:text-right transition-colors ${
              activeTab === 'services'
                ? 'bg-emerald-50 text-emerald-900 font-bold'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Wrench className="w-4 h-4 text-emerald-700" />
            <span>{isAr ? 'خدمات الصيانة والنظافة' : 'Services Catalog'}</span>
          </button>

          <button
            onClick={() => navigateTo('subscriptions_catalog')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm text-left rtl:text-right transition-colors ${
              activeTab === 'subscriptions_catalog' || activeTab === 'subscriptions'
                ? 'bg-emerald-50 text-emerald-900 font-bold'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-3">
              <Crown className="w-4 h-4 text-amber-600" />
              <span>{isAr ? 'اشتراكات الصيانة (Mutqin Care Pass)' : 'Recurring Care Passes'}</span>
            </div>
            <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-md">
              {isAr ? 'وفر 25%' : 'Save 25%'}
            </span>
          </button>

          <button
            onClick={() => navigateTo('quotes')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-left rtl:text-right transition-colors ${
              activeTab === 'quotes'
                ? 'bg-emerald-50 text-emerald-900 font-bold'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-4 h-4 text-emerald-700" />
            <span>{isAr ? 'عروض الأسعار والتنافس' : 'Quotes & Bids'}</span>
          </button>

          <button
            onClick={() => navigateTo('my_bookings')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm text-left rtl:text-right transition-colors ${
              activeTab === 'my_bookings'
                ? 'bg-emerald-50 text-emerald-900 font-bold'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-3">
              <CalendarCheck2 className="w-4 h-4 text-emerald-700" />
              <span>{isAr ? 'سجل حجوزاتي ومواعيدي' : 'My Bookings'}</span>
            </div>
            {bookings.length > 0 && (
              <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                {bookings.length}
              </span>
            )}
          </button>

          <button
            onClick={() => navigateTo('safety_lab')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-left rtl:text-right transition-colors ${
              activeTab === 'safety_lab'
                ? 'bg-emerald-50 text-emerald-900 font-bold'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>{isAr ? 'مختبر أمان المواد الكيميائية' : 'Science Safety Lab'}</span>
          </button>

          <button
            onClick={() => {
              setRole('technician');
              navigateTo('technician_portal');
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-left rtl:text-right transition-colors ${
              activeTab === 'technician_portal'
                ? 'bg-emerald-50 text-emerald-900 font-bold'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <HardHat className="w-4 h-4 text-emerald-700" />
            <span>{isAr ? 'لوحة تحكم الفنيين والمقاولين' : 'Provider Hub'}</span>
          </button>
        </div>

        {/* Saudi Coverage Quick Buttons in Drawer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>{isAr ? 'مدن سريعة في المملكة' : 'Quick Cities'}</span>
            <span className="text-[10px] text-emerald-700 font-bold">{isAr ? '13 منطقة مغطاة' : '13 Provinces'}</span>
          </div>

          <div className="grid grid-cols-2 gap-1.5 text-xs">
            {SAUDI_CITIES.slice(0, 8).map((city) => (
              <button
                key={city.id}
                onClick={() => handleSelectCity(city)}
                className={`px-2 py-1.5 rounded-md border text-center truncate transition-colors ${
                  selectedCity === (isAr ? city.nameAr : city.nameEn)
                    ? 'border-emerald-700 bg-emerald-800 text-white font-bold'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                {isAr ? city.nameAr.split(' ')[0] : city.nameEn.split(' ')[0]}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              setIsCoverageModalOpen(true);
            }}
            className="w-full mt-2 py-2 text-xs font-bold text-center text-emerald-800 bg-emerald-100 hover:bg-emerald-200 rounded-lg transition-colors"
          >
            {isAr ? 'استعراض كافة مناطق المملكة الـ 13' : 'View All 13 Regions of Saudi Arabia'}
          </button>
        </div>

        {/* Drawer Footer with Support */}
        <div className="p-4 border-t border-slate-200 bg-white space-y-2">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <PhoneCall className="w-3.5 h-3.5 text-emerald-700" />
            <span>{isAr ? 'الرقم الموحد للدعم: 800-124-MUTQ' : 'Support Hotline: 800-124-MUTQ'}</span>
          </div>
          <div className="text-[11px] text-slate-400">
            {isAr
              ? 'فواتير إلكترونية معتمدة من هيئة الزكاة والضريبة والجمارك (ZATCA)'
              : 'ZATCA-compliant digital invoicing in all Saudi cities'}
          </div>
        </div>
      </div>
    </div>
  );
};
