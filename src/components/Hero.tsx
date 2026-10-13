import React from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { HERO_VILLA_IMAGE, SAUDI_CITIES } from '../data/mockData';
import { Search, Shield, Zap, CreditCard, Award, ArrowRight, ArrowLeft } from 'lucide-react';

export const Hero: React.FC = () => {
  const {
    language,
    setActiveTab,
    selectedCity,
    setSelectedCity,
    searchFilter,
    setSearchFilter,
    setIsAiModalOpen,
  } = useMarketplace();

  const isAr = language === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  return (
    <section className="relative overflow-hidden bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Value Proposition & Action Form */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 tracking-wider">
              <span>{isAr ? 'منصة الخدمات المنزلية في المملكة العربية السعودية' : 'SAUDI RESIDENTIAL SERVICE MARKETPLACE'}</span>
              <span aria-hidden="true">·</span>
              <span>{isAr ? 'معايير كود البناء السعودي' : 'SASO STANDARDS'}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-950 tracking-tight leading-tight" style={{ textWrap: 'balance' }}>
              {isAr ? (
                <>
                  خدمات صيانة ونظافة منزلية باحترافية موثوقة ودفع إلكتروني آمن
                </>
              ) : (
                <>
                  Verified Home Maintenance & Eco Cleaning with Secure Saudi Payments
                </>
              )}
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
              {isAr
                ? 'اربط منزلك أو منشأتك بنخبة الفنيين والشركات المرخصة في الرياض وجدة والشرقية. غسيل مكيفات متقدم، تنظيف عميق بمواد صديقة للبيئة، كشف تسربات، وفواتير إلكترونية معتمدة من هيئة الزكاة والضريبة.'
                : 'Connect with certified technicians and licensed cleaning providers across Riyadh, Jeddah, and the Eastern Province. High-efficiency AC servicing, green chemistry cleaning, leak detection, and ZATCA-compliant digital invoicing.'}
            </p>

            {/* Quick Search & Filter Bar */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl shadow-xs space-y-3 sm:space-y-0 sm:flex sm:items-center sm:gap-2">
              {/* City selector */}
              <div className="sm:w-1/3">
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-800"
                >
                  {SAUDI_CITIES.map((c) => (
                    <option key={c.id} value={isAr ? c.nameAr : c.nameEn}>
                      {isAr ? c.nameAr : c.nameEn}
                    </option>
                  ))}
                </select>
              </div>

              {/* Keyword Search */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute top-3 left-3 rtl:left-auto rtl:right-3 pointer-events-none" />
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder={isAr ? 'ابحث عن خدمة (مكيفات، نظافة، سباكة...)' : 'Search services (AC, cleaning, leak...)'}
                  className="w-full bg-white border border-slate-300 rounded-lg pl-9 rtl:pl-3 rtl:pr-9 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-800"
                />
              </div>

              {/* Action Button */}
              <button
                onClick={() => setActiveTab('services')}
                className="w-full sm:w-auto px-5 py-2 text-sm font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg transition-colors whitespace-nowrap flex items-center justify-center gap-1.5 shrink-0"
              >
                <span>{isAr ? 'عرض الخدمات' : 'Find Pros'}</span>
                <ArrowIcon className="w-4 h-4" />
              </button>
            </div>

            {/* Secondary CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
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
                onClick={() => setActiveTab('quotes')}
                className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-md text-emerald-800 font-semibold transition-colors"
              >
                {isAr ? 'طلب تسعير خاص' : 'Request Custom Quote'}
              </button>
            </div>
          </div>

          {/* Right Column: Hero Showcase Image with Scrim & Key Proof Metric */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-md aspect-16/10 lg:aspect-4/3 bg-slate-100">
              <img
                src={HERO_VILLA_IMAGE}
                alt="Modern Riyadh residential interior serviced by Mutqin"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent flex flex-col justify-end p-6 text-white">
                <div className="flex items-center gap-2 text-xs font-medium text-emerald-300 mb-1">
                  <Shield className="w-4 h-4" />
                  <span>{isAr ? 'ضمان إتقان لمدة 30 يوماً' : '30-Day Mutqin Quality Guarantee'}</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-1">
                  {isAr ? 'فنيون سعوديون ومقيمون مرخصون بسجل تجاري' : 'Licensed Contractors with Verified CR'}
                </h3>
                <p className="text-xs text-slate-300">
                  {isAr
                    ? 'فحص أمني دقيق وهويات مهنية معتمدة لحماية خصوصية المنازل.'
                    : 'Background-checked trade technicians for home security and peace of mind.'}
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
