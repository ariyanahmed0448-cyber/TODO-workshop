import React, { useState } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import {
  X,
  Award,
  Sparkles,
  TrendingUp,
  Gift,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Clock,
  ChevronRight,
  Info,
  Tag,
  ShieldCheck,
} from 'lucide-react';

export const LoyaltyModal: React.FC = () => {
  const {
    language,
    isLoyaltyModalOpen,
    setIsLoyaltyModalOpen,
    loyaltyProfile,
    loyaltyHistory,
    redeemPoints,
    showToast,
    setActiveTab,
  } = useMarketplace();

  const isAr = language === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  const [activeTab, setActiveInternalTab] = useState<'overview' | 'vouchers' | 'history'>('overview');
  const [customPointsToRedeem, setCustomPointsToRedeem] = useState<number>(100);
  const [redeemedVouchers, setRedeemedVouchers] = useState<
    Array<{ id: string; code: string; titleAr: string; titleEn: string; discountSAR: number; pointsUsed: number; expiresAt: string }>
  >([]);

  if (!isLoyaltyModalOpen) return null;

  const pointsValueSAR = Math.round((loyaltyProfile.pointsBalance / 10) * 100) / 100;
  const progressPercent =
    loyaltyProfile.tier === 'platinum'
      ? 100
      : loyaltyProfile.tier === 'gold'
      ? Math.min(100, Math.round(((loyaltyProfile.lifetimeEarned - 500) / (1500 - 500)) * 100))
      : Math.min(100, Math.round((loyaltyProfile.lifetimeEarned / 500) * 100));

  // Available maintenance reward vouchers for redemption
  const rewardCatalog = [
    {
      id: 'rwd-ac-flush',
      titleAr: 'قسيمة خصم 25 ر.س على غسيل وصيانة المكيفات',
      titleEn: '25 SAR Off Split AC Maintenance & Chemical Rinse',
      pointsRequired: 250,
      discountSAR: 25,
      category: 'ac',
      categoryLabelAr: 'تكييف وتبريد',
      categoryLabelEn: 'HVAC & AC',
    },
    {
      id: 'rwd-villa-clean',
      titleAr: 'قسيمة خصم 50 ر.س على تنظيف الفلل والشقق',
      titleEn: '50 SAR Off Villa & Residential Deep Cleaning',
      pointsRequired: 500,
      discountSAR: 50,
      category: 'cleaning',
      categoryLabelAr: 'نظافة وتطهير',
      categoryLabelEn: 'Deep Cleaning',
    },
    {
      id: 'rwd-plumbing-inspect',
      titleAr: 'قسيمة كشف تسربات مجاني بقيمة 30 ر.س',
      titleEn: '30 SAR Credit on Acoustic Leak Detection',
      pointsRequired: 300,
      discountSAR: 30,
      category: 'plumbing',
      categoryLabelAr: 'سباكة وتسربات',
      categoryLabelEn: 'Plumbing & Leaks',
    },
    {
      id: 'rwd-eco-sanitizer',
      titleAr: 'خصم فوري 15 ر.س لأي خدمة صيانة منزلية',
      titleEn: '15 SAR Instant Credit for Any Home Service',
      pointsRequired: 150,
      discountSAR: 15,
      category: 'general',
      categoryLabelAr: 'صيانة عامة',
      categoryLabelEn: 'General Maintenance',
    },
  ];

  const handleRedeemVoucher = (reward: (typeof rewardCatalog)[0]) => {
    if (loyaltyProfile.pointsBalance < reward.pointsRequired) {
      showToast(
        isAr
          ? `عفواً، رصيدك الحالي (${loyaltyProfile.pointsBalance} نقطة) لا يكفي لهذه القسيمة`
          : `Insufficient balance (${loyaltyProfile.pointsBalance} pts) for this voucher`
      );
      return;
    }

    const discount = redeemPoints(reward.pointsRequired);
    const voucherCode = `MUTQ-${reward.category.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newVoucher = {
      id: `vchr-${Date.now()}`,
      code: voucherCode,
      titleAr: reward.titleAr,
      titleEn: reward.titleEn,
      discountSAR: discount,
      pointsUsed: reward.pointsRequired,
      expiresAt: '2026-12-31',
    };

    setRedeemedVouchers((prev) => [newVoucher, ...prev]);
    showToast(
      isAr
        ? `تم استبدال ${reward.pointsRequired} نقطة بنجاح! كود القسيمة: ${voucherCode}`
        : `Successfully redeemed ${reward.pointsRequired} points! Voucher: ${voucherCode}`
    );
  };

  const handleDirectPointConvert = () => {
    if (customPointsToRedeem <= 0 || customPointsToRedeem > loyaltyProfile.pointsBalance) {
      showToast(isAr ? 'الرجاء إدخال عدد نقاط صالح ضمن رصيدك' : 'Please enter a valid points amount');
      return;
    }

    const discountSAR = redeemPoints(customPointsToRedeem);
    const voucherCode = `MUTQ-CASH-${Math.floor(10000 + Math.random() * 90000)}`;
    const newVoucher = {
      id: `vchr-${Date.now()}`,
      code: voucherCode,
      titleAr: `رصيد خصم نقدي بقيمة ${discountSAR} ر.س`,
      titleEn: `${discountSAR} SAR Cash Discount Credit`,
      discountSAR,
      pointsUsed: customPointsToRedeem,
      expiresAt: '2026-12-31',
    };

    setRedeemedVouchers((prev) => [newVoucher, ...prev]);
    showToast(
      isAr
        ? `تم تحويل النقاط إلى رصيد خصم ${discountSAR} ر.س بنجاح! الكود: ${voucherCode}`
        : `Converted to ${discountSAR} SAR discount! Code: ${voucherCode}`
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <Award className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900">
                  {isAr ? 'برنامج مكافآت نقاط مُتقَن' : 'Mutqin Points Loyalty Rewards'}
                </h3>
                <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  {isAr ? loyaltyProfile.tierNameAr : loyaltyProfile.tierNameEn}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {isAr
                  ? 'اكسب نقاطاً مع كل حجز صيانة واستبدلها بخصومات مباشرة'
                  : 'Earn points with every booking & redeem for maintenance discounts'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsLoyaltyModalOpen(false)}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 px-6 bg-slate-50 text-xs font-semibold">
          <button
            onClick={() => setActiveInternalTab('overview')}
            className={`py-3 px-4 border-b-2 transition-colors ${
              activeTab === 'overview'
                ? 'border-emerald-800 text-emerald-800 font-bold bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            {isAr ? 'محفظة النقاط والفئات' : 'Wallet & Tiers'}
          </button>
          <button
            onClick={() => setActiveInternalTab('vouchers')}
            className={`py-3 px-4 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'vouchers'
                ? 'border-emerald-800 text-emerald-800 font-bold bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            <span>{isAr ? 'كتالوج قسائم الصيانة' : 'Service Vouchers'}</span>
            {redeemedVouchers.length > 0 && (
              <span className="bg-emerald-800 text-white rounded-full text-[10px] px-1.5 py-0.2">
                {redeemedVouchers.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveInternalTab('history')}
            className={`py-3 px-4 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'history'
                ? 'border-emerald-800 text-emerald-800 font-bold bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{isAr ? 'سجل العمليات' : 'Points Ledger'}</span>
          </button>
        </div>

        {/* Tab 1: Overview & Points Balance */}
        {activeTab === 'overview' && (
          <div className="p-6 space-y-6">
            {/* Balance Card */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-900 via-emerald-800 to-slate-900 text-white p-6 shadow-md">
              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-emerald-200 text-xs font-medium">
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>{isAr ? 'الرصيد المتاح للاستبدال' : 'Available Redeemable Balance'}</span>
                  </div>
                  <div className="mt-2 flex items-baseline gap-3">
                    <span className="text-4xl font-extrabold tracking-tight tabular-nums text-white">
                      {loyaltyProfile.pointsBalance}
                    </span>
                    <span className="text-sm font-semibold text-emerald-200">
                      {isAr ? 'نقطة مُتقَن' : 'Mutqin Points'}
                    </span>
                  </div>
                  <div className="mt-2 text-xs text-emerald-100 flex items-center gap-1">
                    <span>{isAr ? 'القيمة التقديرية بالريال:' : 'Estimated Cash Value:'}</span>
                    <span className="font-bold text-amber-300 tabular-nums text-sm">
                      {pointsValueSAR} {isAr ? 'ر.س' : 'SAR'}
                    </span>
                    <span className="text-[10px] text-emerald-200/80">
                      ({isAr ? 'كل 10 نقاط = 1 ر.س خصم' : '10 pts = 1 SAR discount'})
                    </span>
                  </div>
                </div>

                {/* Multiplier Badge */}
                <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-3 text-center sm:text-right rtl:sm:text-left">
                  <div className="text-[10px] text-emerald-200">{isAr ? 'معامل المضاعفة الحالي' : 'Earning Multiplier'}</div>
                  <div className="text-xl font-bold text-white tabular-nums">
                    {loyaltyProfile.earningMultiplier}x
                  </div>
                  <div className="text-[10px] text-emerald-300">
                    {loyaltyProfile.tier === 'platinum'
                      ? isAr
                        ? '+50% نقاط إضافية'
                        : '+50% Bonus Points'
                      : loyaltyProfile.tier === 'gold'
                      ? isAr
                        ? '+25% نقاط إضافية'
                        : '+25% Bonus Points'
                      : isAr
                      ? 'النسبة الأساسية'
                      : 'Base Rate'}
                  </div>
                </div>
              </div>

              {/* Progress to next tier */}
              <div className="mt-6 pt-4 border-t border-white/15">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-emerald-200">
                    {loyaltyProfile.tier === 'platinum'
                      ? isAr
                        ? 'وصلت إلى أعلى فئة بالمملكة (بلاتينيوم 🏆)'
                        : 'Highest Tier Achieved (Platinum 🏆)'
                      : isAr
                      ? `التقدم نحو الفئة التالية (${loyaltyProfile.nextTierPointsNeeded} نقطة متبقية)`
                      : `Next Tier Progress (${loyaltyProfile.nextTierPointsNeeded} pts left)`}
                  </span>
                  <span className="font-bold text-white tabular-nums">{progressPercent}%</span>
                </div>
                <div className="w-full h-2 bg-emerald-950/60 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-amber-300 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Quick Converter Widget */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <h4 className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-emerald-700" />
                <span>{isAr ? 'تحويل نقاطك إلى رصيد خصم فوري' : 'Convert Points to Discount Credit'}</span>
              </h4>
              <p className="text-xs text-slate-500 mb-3">
                {isAr
                  ? 'اختر عدد النقاط التي ترغب باستبدالها للحصول على كود خصم مباشر يُطبق في صفحة الدفع:'
                  : 'Choose the amount of points to redeem into an instant discount voucher:'}
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="flex-1 flex items-center gap-2">
                  <input
                    type="range"
                    min="50"
                    max={Math.max(50, loyaltyProfile.pointsBalance)}
                    step="10"
                    value={Math.min(customPointsToRedeem, Math.max(50, loyaltyProfile.pointsBalance))}
                    onChange={(e) => setCustomPointsToRedeem(Number(e.target.value))}
                    disabled={loyaltyProfile.pointsBalance < 50}
                    className="w-full accent-emerald-800"
                  />
                  <span className="text-xs font-bold text-slate-800 tabular-nums whitespace-nowrap min-w-[70px] text-center">
                    {Math.min(customPointsToRedeem, loyaltyProfile.pointsBalance)} {isAr ? 'نقطة' : 'pts'}
                  </span>
                </div>

                <button
                  onClick={handleDirectPointConvert}
                  disabled={loyaltyProfile.pointsBalance < 50}
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 disabled:bg-slate-300 text-white rounded-lg text-xs font-bold transition-colors whitespace-nowrap"
                >
                  {isAr
                    ? `استبدل بخصم ${Math.round((Math.min(customPointsToRedeem, loyaltyProfile.pointsBalance) / 10) * 100) / 100} ر.س`
                    : `Redeem for ${Math.round((Math.min(customPointsToRedeem, loyaltyProfile.pointsBalance) / 10) * 100) / 100} SAR`}
                </button>
              </div>
            </div>

            {/* Loyalty Tiers Grid */}
            <div>
              <h4 className="text-xs font-bold text-slate-800 mb-3 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-700" />
                <span>{isAr ? 'مستويات وفئات عضوية مُتقَن' : 'Mutqin Membership Tiers'}</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Silver */}
                <div
                  className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${
                    loyaltyProfile.tier === 'silver'
                      ? 'border-emerald-800 bg-emerald-50/50 shadow-xs ring-1 ring-emerald-800'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">{isAr ? 'الفئة الفضية' : 'Silver Tier'}</span>
                    <span className="text-[10px] text-slate-500 font-mono">0 - 499 pt</span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    {isAr ? '1 نقطة لكل ريال منفق' : '1 point per SAR spent (1.0x)'}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    {isAr ? 'خصومات عند الحجز وضمان صيانة 30 يوماً' : 'Booking discounts & 30-day warranty'}
                  </p>
                </div>

                {/* Gold */}
                <div
                  className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${
                    loyaltyProfile.tier === 'gold'
                      ? 'border-emerald-800 bg-emerald-50/50 shadow-xs ring-1 ring-emerald-800'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-700">{isAr ? 'الفئة الذهبية' : 'Gold Tier'}</span>
                    <span className="text-[10px] text-slate-500 font-mono">500 - 1499 pt</span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    {isAr ? '1.25 نقطة لكل ريال (مضاعفة +25%)' : '1.25 points per SAR (+25% bonus)'}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    {isAr ? 'أولوية جدولة المواعيد في أوقات الذروة' : 'Priority dispatch in peak seasons'}
                  </p>
                </div>

                {/* Platinum */}
                <div
                  className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${
                    loyaltyProfile.tier === 'platinum'
                      ? 'border-emerald-800 bg-emerald-50/50 shadow-xs ring-1 ring-emerald-800'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-indigo-700">{isAr ? 'الفئة البلاتينية' : 'Platinum Tier'}</span>
                    <span className="text-[10px] text-slate-500 font-mono">1500+ pt</span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    {isAr ? '1.5 نقطة لكل ريال (مضاعفة +50%)' : '1.5 points per SAR (+50% bonus)'}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    {isAr ? 'مدير حساب مخصص وفحص مجاني سنوي' : 'Dedicated manager & annual free check'}
                  </p>
                </div>
              </div>
            </div>

            {/* How to Earn Banner */}
            <div className="flex items-start gap-3 p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900">
              <Info className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">
                  {isAr ? 'كيف تكسب نقاط مُتقَن؟' : 'How do you earn Mutqin Points?'}
                </span>
                <p className="text-blue-800 text-[11px] mt-0.5">
                  {isAr
                    ? 'يتم احتساب النقاط تلقائياً على كل حجز صيانة أو تنظيف مسدد عبر مدى، Apple Pay، أو STC Pay. كما يمكنك تطبيق النقاط مباشرة في صفحة الدفع لتخفيض حتى 50% من قيمة الفاتورة.'
                    : 'Points are automatically credited on every booking paid via Mada, Apple Pay, or STC Pay. You can also apply points directly in checkout to reduce up to 50% of your bill.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Vouchers Catalog */}
        {activeTab === 'vouchers' && (
          <div className="p-6 space-y-6">
            {/* Active / Generated Vouchers */}
            {redeemedVouchers.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>{isAr ? 'قسائم الخصم الجاهزة للاستخدام' : 'Your Active Discount Codes'}</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {redeemedVouchers.map((v) => (
                    <div
                      key={v.id}
                      className="border-2 border-dashed border-emerald-600 bg-emerald-50/40 rounded-xl p-3.5 space-y-2"
                    >
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-bold text-emerald-950">
                          {isAr ? v.titleAr : v.titleEn}
                        </span>
                        <span className="text-xs font-black text-emerald-800 tabular-nums">
                          -{v.discountSAR} {isAr ? 'ر.س' : 'SAR'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between bg-white border border-emerald-200 rounded-lg px-2.5 py-1 text-xs">
                        <span className="font-mono font-bold text-slate-800">{v.code}</span>
                        <span className="text-[10px] text-emerald-700 font-medium">
                          {isAr ? 'صالح حتى نهاية 2026' : 'Valid until end of 2026'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Catalog Grid */}
            <div>
              <h4 className="text-xs font-bold text-slate-800 mb-3">
                {isAr ? 'استبدال نقاطك بقسائم خدمات الصيانة' : 'Redeem Points for Service Discounts'}
              </h4>
              <div className="space-y-3">
                {rewardCatalog.map((rwd) => {
                  const canRedeem = loyaltyProfile.pointsBalance >= rwd.pointsRequired;
                  return (
                    <div
                      key={rwd.id}
                      className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-300 transition-colors shadow-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                            {isAr ? rwd.categoryLabelAr : rwd.categoryLabelEn}
                          </span>
                          <span className="text-xs font-bold text-slate-900">
                            {isAr ? rwd.titleAr : rwd.titleEn}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500">
                          {isAr
                            ? `خصم فوري ${rwd.discountSAR} ر.س عند حجز أي خدمة من هذه الفئة`
                            : `Instant ${rwd.discountSAR} SAR off when booking from this category`}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right rtl:text-left text-xs">
                          <div className="font-bold text-slate-900 tabular-nums">
                            {rwd.pointsRequired} {isAr ? 'نقطة' : 'pts'}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            (={rwd.discountSAR} {isAr ? 'ر.س' : 'SAR'})
                          </div>
                        </div>

                        <button
                          onClick={() => handleRedeemVoucher(rwd)}
                          disabled={!canRedeem}
                          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
                            canRedeem
                              ? 'bg-emerald-800 hover:bg-emerald-900 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                          }`}
                        >
                          {canRedeem
                            ? isAr
                              ? 'استبدال الآن'
                              : 'Redeem Now'
                            : isAr
                            ? 'نقاط غير كافية'
                            : 'Need More Pts'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Points History Ledger */}
        {activeTab === 'history' && (
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-center text-xs text-slate-500">
              <span>{isAr ? 'سجل المعاملات والنقاط المكتسبة والمستبدلة' : 'Complete Transaction History'}</span>
              <span className="font-mono tabular-nums">{loyaltyHistory.length} {isAr ? 'حركات' : 'entries'}</span>
            </div>

            <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 overflow-hidden bg-white">
              {loyaltyHistory.map((tx) => (
                <div key={tx.id} className="p-3.5 flex items-center justify-between text-xs hover:bg-slate-50">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                        tx.points > 0
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {tx.points > 0 ? '+' : ''}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-800">
                        {isAr ? tx.descriptionAr : tx.descriptionEn}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        {tx.date} {tx.bookingId ? `· #${tx.bookingId}` : ''}
                      </div>
                    </div>
                  </div>

                  <div className="text-right rtl:text-left">
                    <div
                      className={`font-bold tabular-nums ${
                        tx.points > 0 ? 'text-emerald-700' : 'text-slate-700'
                      }`}
                    >
                      {tx.points > 0 ? `+${tx.points}` : tx.points} {isAr ? 'نقطة' : 'pts'}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono tabular-nums">
                      {tx.sarEquivalent > 0 ? `~${tx.sarEquivalent} SAR` : ''}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="p-5 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            {isAr
              ? 'تخضع النقاط لسياسة الاستخدام العادل وتدوم صلاحيتها 12 شهراً'
              : 'Points valid for 12 months under Mutqin Fair Use terms'}
          </div>
          <button
            onClick={() => {
              setIsLoyaltyModalOpen(false);
              setActiveTab('services');
            }}
            className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <span>{isAr ? 'احجز خدمة واكسب نقاط' : 'Book & Earn More Points'}</span>
            <ArrowIcon className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
