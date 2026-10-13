import React from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { Sparkles, Globe, UserCheck, ShieldCheck, Bell, Award } from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    language,
    setLanguage,
    role,
    setRole,
    activeTab,
    setActiveTab,
    setIsAiModalOpen,
    bookings,
    unreadCount,
    setIsNotificationCenterOpen,
    loyaltyProfile,
    setIsLoyaltyModalOpen,
  } = useMarketplace();

  const isAr = language === 'ar';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-18">
          {/* Zone 1: Brand Wordmark (Single text element wordmark in display face) */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('home')}
              className="text-2xl font-bold tracking-tight text-slate-900 whitespace-nowrap hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              <span className="text-emerald-800 font-extrabold">مُتقَن</span>
              <span className="text-slate-400 font-normal text-lg">|</span>
              <span className="text-slate-800 font-semibold text-lg tracking-normal">Mutqin</span>
            </button>
            <span className="hidden sm:inline-block text-xs text-slate-500 font-medium border-l border-slate-200 pl-3 ml-1 rtl:border-l-0 rtl:border-r rtl:pr-3 rtl:mr-1">
              {isAr ? 'منصة الصيانة المعتمدة' : 'Verified Saudi Services'}
            </span>
          </div>

          {/* Zone 2: 4-5 Concise Single-line Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button
              onClick={() => setActiveTab('services')}
              className={`whitespace-nowrap transition-colors py-1 ${
                activeTab === 'services'
                  ? 'text-emerald-800 font-semibold border-b-2 border-emerald-800'
                  : 'hover:text-slate-900'
              }`}
            >
              {isAr ? 'خدمات الصيانة' : 'Services'}
            </button>
            <button
              onClick={() => setActiveTab('quotes')}
              className={`whitespace-nowrap transition-colors py-1 ${
                activeTab === 'quotes'
                  ? 'text-emerald-800 font-semibold border-b-2 border-emerald-800'
                  : 'hover:text-slate-900'
              }`}
            >
              {isAr ? 'عروض الأسعار والتنافس' : 'Quotes & Bids'}
            </button>
            <button
              onClick={() => setActiveTab('safety_lab')}
              className={`whitespace-nowrap transition-colors py-1 flex items-center gap-1.5 ${
                activeTab === 'safety_lab'
                  ? 'text-emerald-800 font-semibold border-b-2 border-emerald-800'
                  : 'hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>{isAr ? 'مختبر أمان المواد (Science)' : 'Chemical Safety Lab'}</span>
            </button>
            <button
              onClick={() => setActiveTab('technician_portal')}
              className={`whitespace-nowrap transition-colors py-1 ${
                activeTab === 'technician_portal'
                  ? 'text-emerald-800 font-semibold border-b-2 border-emerald-800'
                  : 'hover:text-slate-900'
              }`}
            >
              {isAr ? 'بوابة الفنيين والمقاولين' : 'Provider Hub'}
            </button>
            <button
              onClick={() => setActiveTab('my_bookings')}
              className={`whitespace-nowrap transition-colors py-1 ${
                activeTab === 'my_bookings'
                  ? 'text-emerald-800 font-semibold border-b-2 border-emerald-800'
                  : 'hover:text-slate-900'
              }`}
            >
              <span>{isAr ? 'حجوزاتي' : 'My Bookings'}</span>
              {bookings.length > 0 && (
                <span className="ml-1 rtl:mr-1 text-xs text-emerald-700 font-bold tabular-nums">
                  ({bookings.length})
                </span>
              )}
            </button>
          </nav>

          {/* Zone 3: 1 Primary Action + Utility Controls */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Persona Switcher */}
            <div className="hidden lg:flex items-center bg-slate-100 rounded-lg p-0.5 text-xs">
              <button
                onClick={() => {
                  setRole('customer');
                  if (activeTab === 'technician_portal') setActiveTab('home');
                }}
                className={`px-2.5 py-1 font-medium rounded-md transition-colors ${
                  role === 'customer'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {isAr ? 'عميل' : 'Customer'}
              </button>
              <button
                onClick={() => {
                  setRole('technician');
                  setActiveTab('technician_portal');
                }}
                className={`px-2.5 py-1 font-medium rounded-md transition-colors ${
                  role === 'technician'
                    ? 'bg-white text-emerald-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {isAr ? 'فني مرخص' : 'Technician'}
              </button>
            </div>

            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(isAr ? 'en' : 'ar')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              title={isAr ? 'Switch to English' : 'التحويل إلى العربية'}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{isAr ? 'English' : 'العربية'}</span>
            </button>

            {/* Mutqin Points Loyalty Button */}
            <button
              onClick={() => setIsLoyaltyModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 rounded-lg transition-colors shrink-0 shadow-2xs"
              title={isAr ? 'محفظة نقاط مُتقَن واستبدال الخصومات' : 'Mutqin Points & Rewards Wallet'}
            >
              <Award className="w-3.5 h-3.5 text-amber-600" />
              <span className="tabular-nums">{loyaltyProfile.pointsBalance}</span>
              <span className="text-[10px] text-amber-700/80 font-normal">
                {isAr ? 'نقطة' : 'pts'}
              </span>
            </button>

            {/* Notification Center Bell */}
            <button
              onClick={() => setIsNotificationCenterOpen(true)}
              className="relative p-2 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors shrink-0"
              title={isAr ? 'مركز الإشعارات وتنبيهات الحجوزات' : 'Notification Center'}
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 rtl:-right-auto rtl:-left-1 bg-emerald-800 text-white font-bold text-[10px] w-4.5 h-4.5 rounded-full flex items-center justify-center tabular-nums shadow-xs">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* AI Assistant CTA */}
            <button
              onClick={() => setIsAiModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-emerald-950 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 rounded-lg transition-colors whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
              <span>{isAr ? 'المستشار الذكي' : 'AI Diagnostic'}</span>
            </button>

            {/* Primary Action Button */}
            <button
              onClick={() => setActiveTab('services')}
              className="px-4 py-2 text-xs font-medium text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg transition-colors whitespace-nowrap shadow-xs"
            >
              {isAr ? 'احجز خدمة فورية' : 'Book a Service'}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
