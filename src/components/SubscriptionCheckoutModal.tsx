import React, { useState } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import {
  SubscriptionBillingCycle,
  SubscriptionBillingMethod,
  SaudiPaymentMethod,
} from '../types';
import { SAUDI_CITIES } from '../data/mockData';
import {
  X,
  Calendar,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Lock,
  CreditCard,
  Building,
  UserCheck,
  MapPin,
  Sparkles,
  ArrowRight,
  Repeat,
  Wallet,
  Smartphone,
  ChevronDown,
} from 'lucide-react';

export const SubscriptionCheckoutModal: React.FC = () => {
  const {
    language,
    isSubscriptionCheckoutOpen,
    setIsSubscriptionCheckoutOpen,
    selectedPlanForCheckout,
    subscribeToPlan,
    technicians,
    selectedCity,
    setActiveTab,
  } = useMarketplace();

  const isAr = language === 'ar';

  // Step 1: Scheduling Preferences
  const [preferredDayOfWeek, setPreferredDayOfWeek] = useState<number>(1); // 1 = Monday
  const [preferredTimeSlot, setPreferredTimeSlot] = useState<string>(
    '09:00 - 11:30 (الفترة الصباحية)'
  );
  const [lockTechnician, setLockTechnician] = useState<boolean>(true);
  const [selectedTechId, setSelectedTechId] = useState<string>('tech-faisal');

  // Step 2: Address
  const [city, setCity] = useState<string>(selectedCity || 'الرياض (العاصمة)');
  const [district, setDistrict] = useState<string>('حطين');
  const [streetAddress, setStreetAddress] = useState<string>('شارع الأمير تركي بن عبدالعزيز الأول');
  const [nationalAddressCode, setNationalAddressCode] = useState<string>('RDHA-4819-RIYADH');

  // Step 3: Billing Options
  const [billingCadence, setBillingCadence] = useState<SubscriptionBillingCycle>('monthly');
  const [billingMethod, setBillingMethod] = useState<SubscriptionBillingMethod>('mada');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  if (!isSubscriptionCheckoutOpen || !selectedPlanForCheckout) return null;

  const plan = selectedPlanForCheckout;

  // Days list in Saudi Arabia (Sunday to Saturday, Friday is rest day)
  const SAUDI_WEEK_DAYS = [
    { value: 0, labelAr: 'الأحد', labelEn: 'Sunday' },
    { value: 1, labelAr: 'الاثنين', labelEn: 'Monday' },
    { value: 2, labelAr: 'الثلاثاء', labelEn: 'Tuesday' },
    { value: 3, labelAr: 'الأربعاء', labelEn: 'Wednesday' },
    { value: 4, labelAr: 'الخميس', labelEn: 'Thursday' },
    { value: 6, labelAr: 'السبت', labelEn: 'Saturday' },
  ];

  const TIME_SLOTS = [
    { id: 'slot-morning', labelAr: '09:00 - 11:30 (الفترة الصباحية)', labelEn: '09:00 - 11:30 (Morning)' },
    { id: 'slot-noon', labelAr: '12:30 - 15:00 (فترة الظهيرة)', labelEn: '12:30 - 15:00 (Afternoon)' },
    { id: 'slot-asr', labelAr: '15:30 - 18:00 (فترة العصر)', labelEn: '15:30 - 18:00 (Late Afternoon)' },
    { id: 'slot-evening', labelAr: '18:30 - 21:00 (الفترة المسائية)', labelEn: '18:30 - 21:00 (Evening)' },
  ];

  // Pricing calculations
  let cycleSubtotal = plan.basePriceSAR;
  if (billingCadence === 'quarterly') {
    cycleSubtotal = Math.round(plan.basePriceSAR * 3 * 0.9);
  } else if (billingCadence === 'annual') {
    cycleSubtotal = Math.round(plan.basePriceSAR * 12 * 0.8);
  }
  const vatRate = 0.15;
  const cycleVat = Math.round(cycleSubtotal * vatRate * 100) / 100;
  const cycleTotal = Math.round((cycleSubtotal + cycleVat) * 100) / 100;

  // Generate 4 upcoming preview dates based on today and cadence
  const previewDates: string[] = [];
  const today = new Date();
  const interval = plan.cadence === 'weekly' ? 7 : plan.cadence === 'biweekly' ? 14 : 30;
  const previewCount = plan.visitsPerMonth > 0 ? plan.visitsPerMonth : 1;

  for (let i = 0; i < previewCount; i++) {
    const d = new Date(today.getTime() + (i * interval + 3) * 24 * 60 * 60 * 1000);
    previewDates.push(d.toISOString().split('T')[0]);
  }

  const assignedTech = technicians.find((t) => t.id === selectedTechId) || technicians[0];

  const handleConfirmSubscription = () => {
    setIsProcessing(true);

    setTimeout(() => {
      subscribeToPlan(plan, {
        billingCadence,
        preferredDayOfWeek,
        preferredTimeSlot,
        city,
        district,
        streetAddress,
        nationalAddressCode,
        billingMethod,
        lockTechnician,
        preferredTechId: assignedTech?.id || 'tech-faisal',
        preferredTechName: assignedTech?.name || 'م. فيصل العتيبي',
      });

      setIsProcessing(false);
      setIsSubscriptionCheckoutOpen(false);
      setActiveTab('my_bookings');
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={() => !isProcessing && setIsSubscriptionCheckoutOpen(false)}
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-800 text-white flex items-center justify-center shrink-0">
              <Repeat className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
                {isAr ? 'تأكيد اشتراك الصيانة الدورية' : 'Configure Recurring Maintenance'}
              </h2>
              <p className="text-xs text-slate-500">
                {isAr ? plan.nameAr : plan.nameEn} • {isAr ? plan.homeSizeLabelAr : plan.homeSizeLabelEn}
              </p>
            </div>
          </div>

          <button
            onClick={() => !isProcessing && setIsSubscriptionCheckoutOpen(false)}
            disabled={isProcessing}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-slate-800 text-xs sm:text-sm">
          {/* Section 1: Automated Scheduling Preferences */}
          <div className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-slate-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-700" />
                <span>{isAr ? '1. تفضيلات الجدولة التلقائية' : '1. Automated Schedule Cadence'}</span>
              </span>
              <span className="text-[11px] text-emerald-800 font-bold bg-emerald-100/70 px-2 py-0.5 rounded-full">
                {isAr ? 'تكرار ثابت' : 'Fixed Recurring Slot'}
              </span>
            </div>

            {/* Day of Week Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                {isAr ? 'اليوم المفضل للزيارة الأسبوعية/الدورية:' : 'Preferred Day of Week:'}
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                {SAUDI_WEEK_DAYS.map((day) => (
                  <button
                    key={day.value}
                    type="button"
                    onClick={() => setPreferredDayOfWeek(day.value)}
                    className={`py-2 px-1 text-center rounded-lg font-bold text-xs transition-all ${
                      preferredDayOfWeek === day.value
                        ? 'bg-emerald-800 text-white shadow-xs'
                        : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {isAr ? day.labelAr : day.labelEn}
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-slate-400">
                {isAr ? 'ملاحظة: يوم الجمعة مخصص للراحة ولا تتم فيه الجدولة الدورية.' : 'Note: Friday is reserved rest day in Saudi Arabia.'}
              </p>
            </div>

            {/* Time Slot Selector */}
            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-bold text-slate-700 block">
                {isAr ? 'الفترة الزمنية المفضلة للزيارة:' : 'Preferred Time Slot:'}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {TIME_SLOTS.map((slot) => (
                  <button
                    key={slot.id}
                    type="button"
                    onClick={() => setPreferredTimeSlot(isAr ? slot.labelAr : slot.labelEn)}
                    className={`p-2.5 rounded-lg text-left rtl:text-right font-medium text-xs border transition-all ${
                      preferredTimeSlot === (isAr ? slot.labelAr : slot.labelEn)
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-950 font-bold'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5 inline mr-1.5 rtl:mr-0 rtl:ml-1.5 text-emerald-700" />
                    <span>{isAr ? slot.labelAr : slot.labelEn}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Technician Locking Preference */}
            <div className="pt-2 border-t border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-emerald-700" />
                  <span>{isAr ? 'تثبيت الفني المفضل لكافة الزيارات' : 'Lock Preferred Technician'}</span>
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={lockTechnician}
                    onChange={(e) => setLockTechnician(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] rtl:after:left-auto rtl:after:right-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-800"></div>
                </label>
              </div>

              {lockTechnician ? (
                <div className="p-2.5 bg-emerald-50/80 rounded-lg border border-emerald-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-emerald-800 text-white font-bold flex items-center justify-center text-xs">
                      ف
                    </div>
                    <div>
                      <span className="text-xs font-bold text-emerald-950 block">
                        {assignedTech.name}
                      </span>
                      <span className="text-[10px] text-emerald-800">
                        {isAr ? 'مهندس صيانة معتمد • تقييم 4.95' : 'Certified Senior Pro • 4.95 Rating'}
                      </span>
                    </div>
                  </div>
                  <Lock className="w-3.5 h-3.5 text-emerald-700" />
                </div>
              ) : (
                <p className="text-[11px] text-slate-500">
                  {isAr
                    ? 'سيتم توجيه أقرب فني معتمد متاح جغرافياً لعنوانك في كل موعد لضمان سرعة الوصول.'
                    : 'System will dynamically assign the closest certified pro to ensure prompt arrival.'}
                </p>
              )}
            </div>

            {/* Generated Visit Schedule Preview */}
            <div className="pt-2 border-t border-slate-200/80">
              <span className="text-[11px] font-bold text-slate-600 block mb-1.5">
                {isAr ? 'معاينة المواعيد التلقائية للشهر الأول:' : 'First Month Auto-Generated Visits:'}
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {previewDates.map((dateStr, idx) => (
                  <div
                    key={idx}
                    className="bg-white p-2 rounded-lg border border-slate-200 text-center"
                  >
                    <span className="text-[10px] text-slate-400 block">
                      {isAr ? `الزيارة #${idx + 1}` : `Visit #${idx + 1}`}
                    </span>
                    <span className="text-xs font-bold text-slate-900 font-mono">
                      {dateStr}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section 2: Property Location & Address */}
          <div className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <span className="font-extrabold text-slate-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-700" />
              <span>{isAr ? '2. عنوان العقار المستفيد بالمملكة' : '2. Property Location & Address'}</span>
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {isAr ? 'المدينة:' : 'City:'}
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full p-2 bg-white rounded-lg border border-slate-300 text-xs font-semibold focus:border-emerald-600 focus:outline-hidden"
                >
                  {SAUDI_CITIES.map((c) => (
                    <option key={c.id} value={isAr ? c.nameAr : c.nameEn}>
                      {isAr ? c.nameAr : c.nameEn}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {isAr ? 'الحي السكني:' : 'District:'}
                </label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="مثال: حطين، النرجس، الروضة"
                  className="w-full p-2 bg-white rounded-lg border border-slate-300 text-xs focus:border-emerald-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {isAr ? 'العنوان الوطني المختصر (National Address):' : 'National Address Short Code:'}
                </label>
                <input
                  type="text"
                  value={nationalAddressCode}
                  onChange={(e) => setNationalAddressCode(e.target.value)}
                  placeholder="RDHA-4819-RIYADH"
                  className="w-full p-2 bg-white rounded-lg border border-slate-300 text-xs font-mono focus:border-emerald-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {isAr ? 'الشارع ورقم الفيلا / الشقة:' : 'Street & Villa/Apt #:'}
                </label>
                <input
                  type="text"
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                  placeholder="طريق الأمير تركي، فيلا 42"
                  className="w-full p-2 bg-white rounded-lg border border-slate-300 text-xs focus:border-emerald-600 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Billing Cycle & Payment Methods */}
          <div className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <span className="font-extrabold text-slate-900 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-700" />
              <span>{isAr ? '3. دورة الفوترة وطريقة السداد المتكرر' : '3. Billing Cycle & Payment Method'}</span>
            </span>

            {/* Billing Cadence Selector */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setBillingCadence('monthly')}
                className={`p-2.5 rounded-lg border text-center transition-all ${
                  billingCadence === 'monthly'
                    ? 'bg-emerald-50 border-emerald-600 font-bold text-emerald-950'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span className="block text-xs font-bold">{isAr ? 'شهري' : 'Monthly'}</span>
                <span className="text-[10px] text-slate-500">{plan.basePriceSAR} {isAr ? 'ر.س' : 'SAR'}</span>
              </button>

              <button
                type="button"
                onClick={() => setBillingCadence('quarterly')}
                className={`p-2.5 rounded-lg border text-center transition-all ${
                  billingCadence === 'quarterly'
                    ? 'bg-emerald-50 border-emerald-600 font-bold text-emerald-950'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span className="block text-xs font-bold">{isAr ? 'ربع سنوي' : 'Quarterly'}</span>
                <span className="text-[10px] text-emerald-700 font-bold">{isAr ? 'خصم 10%' : 'Save 10%'}</span>
              </button>

              <button
                type="button"
                onClick={() => setBillingCadence('annual')}
                className={`p-2.5 rounded-lg border text-center transition-all ${
                  billingCadence === 'annual'
                    ? 'bg-emerald-50 border-emerald-600 font-bold text-emerald-950'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span className="block text-xs font-bold">{isAr ? 'سنوي' : 'Annual'}</span>
                <span className="text-[10px] text-emerald-700 font-bold">{isAr ? 'خصم 20%' : 'Save 20%'}</span>
              </button>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-bold text-slate-700 block">
                {isAr ? 'طريقة التجديد التلقائي المعتمدة:' : 'Recurring Payment Gateway:'}
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => setBillingMethod('mada')}
                  className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                    billingMethod === 'mada'
                      ? 'bg-emerald-50 border-emerald-600 text-emerald-950 font-bold shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="font-extrabold text-xs text-emerald-800">مدى mada</span>
                  <span className="text-[10px] text-slate-500">{isAr ? 'خصم تلقائي' : 'Auto-Debit'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setBillingMethod('credit_card')}
                  className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                    billingMethod === 'credit_card'
                      ? 'bg-emerald-50 border-emerald-600 text-emerald-950 font-bold shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-slate-700" />
                  <span className="text-[10px] font-bold text-slate-800">{isAr ? 'بطاقة ائتمان' : 'Card'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setBillingMethod('stc_pay')}
                  className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                    billingMethod === 'stc_pay'
                      ? 'bg-emerald-50 border-emerald-600 text-emerald-950 font-bold shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Wallet className="w-4 h-4 text-purple-700" />
                  <span className="text-[10px] font-bold text-slate-800">STC Pay</span>
                </button>

                <button
                  type="button"
                  onClick={() => setBillingMethod('pay_per_visit')}
                  className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                    billingMethod === 'pay_per_visit'
                      ? 'bg-emerald-50 border-emerald-600 text-emerald-950 font-bold shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Smartphone className="w-4 h-4 text-blue-700" />
                  <span className="text-[10px] font-bold text-slate-800">{isAr ? 'دفع عند الزيارة' : 'Pay Per Visit'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* ZATCA Tax Summary */}
          <div className="p-4 bg-slate-900 text-white rounded-xl space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span>{isAr ? 'قيمة الاشتراك (غير شاملة الضريبة):' : 'Subscription Subtotal:'}</span>
              <span className="font-mono">{cycleSubtotal} {isAr ? 'ر.س' : 'SAR'}</span>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-300">
              <span>{isAr ? 'ضريبة القيمة المضافة ZATCA (15%):' : 'VAT 15% (ZATCA):'}</span>
              <span className="font-mono">{cycleVat} {isAr ? 'ر.س' : 'SAR'}</span>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-baseline justify-between text-sm sm:text-base font-extrabold text-emerald-400">
              <span>{isAr ? 'الإجمالي المطلوب لكل دورة:' : 'Total per billing cycle:'}</span>
              <span className="font-mono text-lg">{cycleTotal} {isAr ? 'ر.س' : 'SAR'}</span>
            </div>

            <p className="text-[10px] text-slate-400 pt-1">
              {isAr
                ? 'سيتم إصدار فاتورة ضريبية إلكترونية معتمدة من هيئة الزكاة والضريبة والجمارك (ZATCA Phase 2) وإرسالها فوراً إلى بريدك وملفك.'
                : 'ZATCA Phase 2 compliant e-invoice will be generated and issued instantly upon confirmation.'}
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
          <button
            onClick={() => !isProcessing && setIsSubscriptionCheckoutOpen(false)}
            disabled={isProcessing}
            className="px-4 py-2.5 rounded-xl font-bold text-slate-600 hover:text-slate-900 text-xs"
          >
            {isAr ? 'إلغاء' : 'Cancel'}
          </button>

          <button
            onClick={handleConfirmSubscription}
            disabled={isProcessing}
            className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 disabled:opacity-50"
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>{isAr ? 'جاري تفعيل الاشتراك وجدولة الزيارات...' : 'Activating Subscription...'}</span>
              </span>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4 text-emerald-300" />
                <span>{isAr ? 'تأكيد الاشتراك وتفعيل الجدولة' : 'Confirm & Activate Schedule'}</span>
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
