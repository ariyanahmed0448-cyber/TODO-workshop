import React, { useState } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { SubscriptionPlan, SubscriptionPlanType } from '../types';
import {
  Calendar,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Zap,
  Tag,
  Building,
  Home,
  Crown,
  ChevronRight,
  Layers,
  Repeat,
  BadgeCheck,
} from 'lucide-react';

export const SubscriptionPlansCatalog: React.FC = () => {
  const {
    language,
    subscriptionPlans,
    activeSubscription,
    setSelectedPlanForCheckout,
    setIsSubscriptionCheckoutOpen,
    setActiveTab,
  } = useMarketplace();

  const isAr = language === 'ar';
  const [activeFilter, setActiveFilter] = useState<'all' | SubscriptionPlanType>('all');
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');

  const filteredPlans = subscriptionPlans.filter((plan) => {
    if (activeFilter === 'all') return true;
    return plan.planType === activeFilter;
  });

  const handleSelectPlan = (plan: SubscriptionPlan) => {
    setSelectedPlanForCheckout(plan);
    setIsSubscriptionCheckoutOpen(true);
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold tracking-wide">
          <Repeat className="w-3.5 h-3.5 text-emerald-700 animate-spin-slow" />
          <span>{isAr ? 'اشتراكات صيانة مُتقَن الدورية 🇸🇦' : 'Mutqin Recurring Maintenance Care Pass 🇸🇦'}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          {isAr ? 'بيتك بأمان مع جداول الصيانة الدورية المؤتمتة' : 'Effortless Home Health with Automated Recurring Care'}
        </h1>

        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          {isAr
            ? 'اختر باقة الصيانة المناسبة لمنزلك: أسبوعية، نصف شهرية، أو باقات مخصصة للفلل والشقق مع تجديد فوترة تلقائي متوافق مع هيئة الزكاة، وإعادة جدولة مرنة دون أي رسوم إضافية.'
            : 'Select the optimal maintenance subscription: weekly, bi-weekly, or property-sized bundles with automated recurring billing, ZATCA e-invoicing, and fee-free reschedule flexibility.'}
        </p>
      </div>

      {/* Active Subscription Alert Banner (if user already has one) */}
      {activeSubscription && activeSubscription.status === 'active' && (
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-xl border border-emerald-700/50 flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/20">
              <Crown className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-emerald-500/30 text-emerald-200 font-bold px-2.5 py-0.5 rounded-full border border-emerald-400/40">
                  {isAr ? 'اشتراكك الحالي نشط' : 'Active Subscription'}
                </span>
                <span className="text-xs text-slate-300 font-mono">
                  #{activeSubscription.id}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mt-1">
                {isAr ? activeSubscription.planNameAr : activeSubscription.planNameEn}
              </h3>
              <p className="text-xs text-slate-300 mt-0.5 flex items-center gap-2">
                <span>{isAr ? 'الزيارة القادمة:' : 'Next visit:'}</span>
                <strong className="text-emerald-300 font-mono">{activeSubscription.nextVisitDate}</strong>
                <span>•</span>
                <span>{activeSubscription.preferredTimeSlot}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => setActiveTab('my_bookings')}
              className="w-full md:w-auto bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
            >
              <span>{isAr ? 'إدارة المواعيد والفواتير' : 'Manage Visits & Invoices'}</span>
              <ChevronRight className="w-4 h-4 rtl:rotate-180" />
            </button>
          </div>
        </div>
      )}

      {/* Filter Tabs & Billing Period Toggle */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200 pb-4">
        {/* Category Filters */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${
              activeFilter === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {isAr ? 'جميع الباقات' : 'All Plans'}
          </button>
          <button
            onClick={() => setActiveFilter('cadence')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeFilter === 'cadence'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Repeat className="w-3.5 h-3.5 text-emerald-700" />
            <span>{isAr ? 'التردد الدوري (أسبوعي/شهري)' : 'Cadence (Weekly/Monthly)'}</span>
          </button>
          <button
            onClick={() => setActiveFilter('tiered_bundle')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeFilter === 'tiered_bundle'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building className="w-3.5 h-3.5 text-emerald-700" />
            <span>{isAr ? 'باقات حسب العقار (شقق/فلل)' : 'Property Size Bundles'}</span>
          </button>
          <button
            onClick={() => setActiveFilter('flat_membership')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeFilter === 'flat_membership'
                ? 'bg-white text-purple-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Crown className="w-3.5 h-3.5 text-purple-700" />
            <span>{isAr ? 'عضوية VIP ميسرة (99 ر.س)' : 'Care Pass VIP (99 SAR)'}</span>
          </button>
        </div>

        {/* Monthly vs Annual Toggle */}
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl text-xs">
          <button
            onClick={() => setBillingPeriod('monthly')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              billingPeriod === 'monthly'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {isAr ? 'تجديد شهري' : 'Monthly'}
          </button>
          <button
            onClick={() => setBillingPeriod('annual')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1 ${
              billingPeriod === 'annual'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>{isAr ? 'اشتراك سنوي' : 'Annual'}</span>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] px-1.5 py-0.5 rounded-md font-extrabold">
              {isAr ? 'وفر 20%' : '-20%'}
            </span>
          </button>
        </div>
      </div>

      {/* Plan Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlans.map((plan) => {
          const isVip = plan.planType === 'flat_membership';
          const isAnnual = billingPeriod === 'annual';
          const displayedPrice = isAnnual
            ? Math.round(plan.basePriceSAR * 0.8)
            : plan.basePriceSAR;

          return (
            <div
              key={plan.id}
              className={`relative flex flex-col justify-between rounded-2xl bg-white border transition-all duration-300 hover:shadow-xl ${
                plan.popularBadge
                  ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-md'
                  : 'border-slate-200/90 hover:border-slate-300'
              }`}
            >
              {/* Popular Badge */}
              {plan.popularBadge && (
                <div className="absolute -top-3.5 right-6 rtl:right-auto rtl:left-6 z-10 bg-emerald-700 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-emerald-200" />
                  <span>{isAr ? 'الأكثر طلباً بالمملكة ⭐' : 'Most Popular in KSA ⭐'}</span>
                </div>
              )}

              {/* Card Top / Header */}
              <div className="p-6 pb-4 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md inline-block">
                      {isAr ? plan.homeSizeLabelAr : plan.homeSizeLabelEn}
                    </span>
                    <h3 className="text-xl font-extrabold text-slate-900 leading-snug">
                      {isAr ? plan.nameAr : plan.nameEn}
                    </h3>
                  </div>

                  <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
                    {plan.planType === 'cadence' ? (
                      <Repeat className="w-5 h-5 text-emerald-700" />
                    ) : plan.planType === 'flat_membership' ? (
                      <Crown className="w-5 h-5 text-purple-700" />
                    ) : (
                      <Building className="w-5 h-5 text-blue-700" />
                    )}
                  </div>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {isAr ? plan.taglineAr : plan.taglineEn}
                </p>

                {/* Price Display */}
                <div className="pt-2 border-t border-slate-100 flex items-baseline justify-between">
                  <div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                        {displayedPrice}
                      </span>
                      <span className="text-xs font-bold text-slate-600">
                        {isAr ? 'ر.س / شهرياً' : 'SAR / mo'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-slate-400 line-through">
                        {isAnnual ? Math.round(plan.originalPriceSAR * 0.8) : plan.originalPriceSAR} {isAr ? 'ر.س' : 'SAR'}
                      </span>
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                        {isAr ? `وفر ${plan.discountPercentage}%` : `Save ${plan.discountPercentage}%`}
                      </span>
                    </div>
                  </div>

                  <div className="text-right rtl:text-left text-[11px] text-slate-500 space-y-0.5">
                    <span className="block font-bold text-slate-700">
                      {plan.visitsPerMonth > 0
                        ? isAr
                          ? `${plan.visitsPerMonth} زيارات مجدولة/شهر`
                          : `${plan.visitsPerMonth} visits/month`
                        : isAr
                        ? 'كشف مجاني + خصم 35%'
                        : 'Free audits + 35% off'}
                    </span>
                    <span className="block text-[10px] text-slate-400">
                      {isAr ? 'شامل ضريبة القيمة المضافة 15%' : 'Incl. 15% VAT'}
                    </span>
                  </div>
                </div>

                {/* Response SLA Pill */}
                <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg text-xs text-slate-700 border border-slate-200/60">
                  <Clock className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span>
                    {isAr
                      ? `استجابة طارئة خلال ${plan.emergencyResponseHours} ساعات مع فني مرخص`
                      : `Emergency response SLA: ${plan.emergencyResponseHours}h with licensed pro`}
                  </span>
                </div>

                {/* Included Services List */}
                <div className="space-y-2 pt-2">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    {isAr ? 'ما تتضمنه كل دورة صيانة:' : 'Included Maintenance Scope:'}
                  </span>
                  <ul className="space-y-1.5">
                    {(isAr ? plan.includedServicesAr : plan.includedServicesEn).map((srv, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{srv}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Exclusive Subscriber Perks */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    {isAr ? 'مزايا المشتركين الحصرية:' : 'Subscriber VIP Perks:'}
                  </span>
                  <ul className="space-y-1">
                    {(isAr ? plan.perksAr : plan.perksEn).map((perk, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-[11px] text-slate-600">
                        <BadgeCheck className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                        <span>{perk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-6 pt-2">
                <button
                  onClick={() => handleSelectPlan(plan)}
                  className={`w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-98 shadow-sm ${
                    plan.popularBadge
                      ? 'bg-emerald-800 hover:bg-emerald-900 text-white shadow-emerald-800/20'
                      : isVip
                      ? 'bg-purple-900 hover:bg-purple-950 text-white'
                      : 'bg-slate-900 hover:bg-slate-800 text-white'
                  }`}
                >
                  <span>{isAr ? 'تفعيل الاشتراك وجدولة الزيارات' : 'Subscribe & Schedule Visits'}</span>
                  <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Trust & Guarantee Badges */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-50 border border-slate-200/80 rounded-2xl p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0">
            <Repeat className="w-5 h-5 text-emerald-700" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">
              {isAr ? 'مرونة التخطي وإعادة الجدولة' : 'Flexible Rescheduling'}
            </h4>
            <p className="text-[11px] text-slate-500">
              {isAr ? 'تأجيل أو ترحيل الزيارة بنقرة واحدة' : 'Skip & rollover visits with 0 fees'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5 text-emerald-700" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">
              {isAr ? 'فواتير ZATCA الضريبية' : 'ZATCA Phase 2 E-Invoicing'}
            </h4>
            <p className="text-[11px] text-slate-500">
              {isAr ? 'فواتير رسمية مع رمز الاستجابة السريع' : 'Official VAT receipts with QR code'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0">
            <Calendar className="w-5 h-5 text-emerald-700" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">
              {isAr ? 'مزامنة تقويم آبل وجوجل' : 'Apple & Google Calendar'}
            </h4>
            <p className="text-[11px] text-slate-500">
              {isAr ? 'تنزيل مواعيدك بصيغة .ics فوراً' : 'Download schedule directly (.ics)'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0">
            <Zap className="w-5 h-5 text-emerald-700" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">
              {isAr ? 'سداد مؤتمت بمدى وبطاقات KSA' : 'Mada & STC Pay Auto-Debit'}
            </h4>
            <p className="text-[11px] text-slate-500">
              {isAr ? 'خصم آمن مع إشعار مسبق قبل التجديد' : 'Secure renewals with 3-day notice'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
