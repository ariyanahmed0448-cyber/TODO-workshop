import React from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import {
  Home,
  Wrench,
  FileText,
  CalendarCheck2,
  HardHat,
  MapPin,
  Sparkles,
  Crown,
  Repeat,
} from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    language,
    bookings,
    userSubscriptions,
    role,
    setRole,
    setIsCoverageModalOpen,
    setIsAiModalOpen,
  } = useMarketplace();

  const isAr = language === 'ar';

  const pendingOrConfirmedCount = bookings.filter(
    (b) => b.status === 'pending' || b.status === 'confirmed'
  ).length;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] pb-[env(safe-area-inset-bottom,0px)]">
      {/* Quick floating action strip for Saudi Coverage, Subscriptions & AI on mobile */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-slate-50 border-b border-slate-200/60 text-[11px] gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('subscriptions_catalog')}
          className="flex items-center gap-1 font-bold text-emerald-950 bg-emerald-100/90 hover:bg-emerald-200 px-2.5 py-0.5 rounded-full whitespace-nowrap shrink-0 active:scale-95 transition-transform"
        >
          <Crown className="w-3 h-3 text-amber-600" />
          <span>{isAr ? 'باقات الصيانة 👑' : 'Care Passes 👑'}</span>
        </button>

        <button
          onClick={() => setIsCoverageModalOpen(true)}
          className="flex items-center gap-1 font-semibold text-emerald-800 whitespace-nowrap shrink-0 active:scale-95 transition-transform"
        >
          <MapPin className="w-3 h-3 text-emerald-700" />
          <span>{isAr ? '13 منطقة 🇸🇦' : '13 Regions 🇸🇦'}</span>
        </button>

        <button
          onClick={() => setIsAiModalOpen(true)}
          className="flex items-center gap-1 font-bold text-slate-900 bg-slate-200/80 hover:bg-slate-300 px-2 py-0.5 rounded-full whitespace-nowrap shrink-0 active:scale-95 transition-transform"
        >
          <Sparkles className="w-3 h-3 text-emerald-700" />
          <span>{isAr ? 'مستشار الذكاء' : 'AI Assistant'}</span>
        </button>
      </div>

      {/* Main Bottom Tabs */}
      <nav className="grid grid-cols-5 h-14">
        {/* Tab 1: Home */}
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center justify-center gap-0.5 transition-colors relative ${
            activeTab === 'home'
              ? 'text-emerald-800 font-bold'
              : 'text-slate-500 hover:text-slate-800 font-medium'
          }`}
        >
          <Home className={`w-5 h-5 ${activeTab === 'home' ? 'text-emerald-800 stroke-[2.4]' : ''}`} />
          <span className="text-[10px] leading-tight">{isAr ? 'الرئيسية' : 'Home'}</span>
          {activeTab === 'home' && (
            <span className="absolute top-1 w-1 h-1 rounded-full bg-emerald-800" />
          )}
        </button>

        {/* Tab 2: Services */}
        <button
          onClick={() => setActiveTab('services')}
          className={`flex flex-col items-center justify-center gap-0.5 transition-colors relative ${
            activeTab === 'services'
              ? 'text-emerald-800 font-bold'
              : 'text-slate-500 hover:text-slate-800 font-medium'
          }`}
        >
          <Wrench className={`w-5 h-5 ${activeTab === 'services' ? 'text-emerald-800 stroke-[2.4]' : ''}`} />
          <span className="text-[10px] leading-tight">{isAr ? 'الخدمات' : 'Services'}</span>
          {activeTab === 'services' && (
            <span className="absolute top-1 w-1 h-1 rounded-full bg-emerald-800" />
          )}
        </button>

        {/* Tab 3: Quotes / Bidding */}
        <button
          onClick={() => setActiveTab('quotes')}
          className={`flex flex-col items-center justify-center gap-0.5 transition-colors relative ${
            activeTab === 'quotes'
              ? 'text-emerald-800 font-bold'
              : 'text-slate-500 hover:text-slate-800 font-medium'
          }`}
        >
          <FileText className={`w-5 h-5 ${activeTab === 'quotes' ? 'text-emerald-800 stroke-[2.4]' : ''}`} />
          <span className="text-[10px] leading-tight">{isAr ? 'التنافس' : 'Quotes'}</span>
          {activeTab === 'quotes' && (
            <span className="absolute top-1 w-1 h-1 rounded-full bg-emerald-800" />
          )}
        </button>

        {/* Tab 4: My Bookings */}
        <button
          onClick={() => setActiveTab('my_bookings')}
          className={`flex flex-col items-center justify-center gap-0.5 transition-colors relative ${
            activeTab === 'my_bookings'
              ? 'text-emerald-800 font-bold'
              : 'text-slate-500 hover:text-slate-800 font-medium'
          }`}
        >
          <div className="relative">
            <CalendarCheck2 className={`w-5 h-5 ${activeTab === 'my_bookings' ? 'text-emerald-800 stroke-[2.4]' : ''}`} />
            {pendingOrConfirmedCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-emerald-800 text-white font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center tabular-nums">
                {pendingOrConfirmedCount}
              </span>
            )}
          </div>
          <span className="text-[10px] leading-tight">{isAr ? 'حجوزاتي' : 'Bookings'}</span>
          {activeTab === 'my_bookings' && (
            <span className="absolute top-1 w-1 h-1 rounded-full bg-emerald-800" />
          )}
        </button>

        {/* Tab 5: Provider Hub */}
        <button
          onClick={() => {
            if (role !== 'technician') {
              setRole('technician');
            }
            setActiveTab('technician_portal');
          }}
          className={`flex flex-col items-center justify-center gap-0.5 transition-colors relative ${
            activeTab === 'technician_portal'
              ? 'text-emerald-800 font-bold'
              : 'text-slate-500 hover:text-slate-800 font-medium'
          }`}
        >
          <HardHat className={`w-5 h-5 ${activeTab === 'technician_portal' ? 'text-emerald-800 stroke-[2.4]' : ''}`} />
          <span className="text-[10px] leading-tight">{isAr ? 'بوابة الفني' : 'Pro Hub'}</span>
          {activeTab === 'technician_portal' && (
            <span className="absolute top-1 w-1 h-1 rounded-full bg-emerald-800" />
          )}
        </button>
      </nav>
    </div>
  );
};
