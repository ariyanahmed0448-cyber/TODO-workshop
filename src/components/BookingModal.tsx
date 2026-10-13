import React, { useState } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { STANDARD_TIME_SLOTS, SAUDI_REGIONS, SAUDI_CITIES } from '../data/mockData';
import { SaudiLocationPicker } from './SaudiLocationPicker';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Ban,
  ArrowRight,
  ArrowLeft,
  UserCheck,
  ShieldCheck,
  Building2,
} from 'lucide-react';

export const BookingModal: React.FC = () => {
  const {
    language,
    selectedServiceForBooking,
    isBookingModalOpen,
    setIsBookingModalOpen,
    setIsPaymentModalOpen,
    setPendingBookingData,
    selectedCity,
    setSelectedCity,
    checkSlotAvailability,
    blockedDayOffDates,
    showToast,
    loyaltyProfile,
  } = useMarketplace();

  const isAr = language === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  const [quantity, setQuantity] = useState(1);
  const [slotValidationError, setSlotValidationError] = useState<string | null>(null);

  // Generate next 14 calendar dates starting tomorrow
  const calendarDates = Array.from({ length: 14 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    const dateStr = d.toISOString().split('T')[0];
    const dayOfWeek = d.getDay();
    const dayNamesAr = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    const dayNamesEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const isFriday = dayOfWeek === 5;
    const isBlocked = blockedDayOffDates.includes(dateStr);

    return {
      date: dateStr,
      dayName: isAr ? dayNamesAr[dayOfWeek] : dayNamesEn[dayOfWeek],
      dayNum: d.getDate(),
      monthName: isAr
        ? d.toLocaleDateString('ar-SA', { month: 'short' })
        : d.toLocaleDateString('en-US', { month: 'short' }),
      isFriday,
      isBlocked,
    };
  });

  const [selectedDate, setSelectedDate] = useState<string>(calendarDates[0].date);
  const [selectedSlotId, setSelectedSlotId] = useState<string>(STANDARD_TIME_SLOTS[0].id);

  const [district, setDistrict] = useState(isAr ? 'حي النخيل' : 'Al Nakheel');
  const [streetAddress, setStreetAddress] = useState('شارع التخصصي، مبنى 14');
  const [customerName, setCustomerName] = useState('عبدالله السالم');
  const [customerPhone, setCustomerPhone] = useState('0551234567');
  const [notes, setNotes] = useState('');

  const [locationMeta, setLocationMeta] = useState<{
    lat: number;
    lng: number;
    accuracy?: number;
    shortCode?: string;
    isGpsDetected?: boolean;
  }>({
    lat: 24.7136,
    lng: 46.6753,
    shortCode: 'RYDH4281',
    isGpsDetected: false,
  });

  if (!isBookingModalOpen || !selectedServiceForBooking) return null;

  const title = isAr ? selectedServiceForBooking.titleAr : selectedServiceForBooking.titleEn;
  const basePrice = selectedServiceForBooking.basePriceSAR;
  const totalPriceSAR = basePrice * quantity;

  const activeSlotObj = STANDARD_TIME_SLOTS.find((s) => s.id === selectedSlotId) || STANDARD_TIME_SLOTS[0];
  const activeSlotLabel = isAr ? activeSlotObj.labelAr : activeSlotObj.labelEn;

  // Group slots by period
  const periods = [
    { key: 'morning', labelAr: 'الفترة الصباحية (قبل الظهر)', labelEn: 'Morning Shift (Pre-Dhuhr)' },
    { key: 'noon', labelAr: 'فترة الظهيرة (بعد الظهر)', labelEn: 'Noon Shift (Post-Dhuhr)' },
    { key: 'afternoon', labelAr: 'فترة العصر (بين العصر والمغرب)', labelEn: 'Asr Shift (Post-Asr)' },
    { key: 'evening', labelAr: 'الفترة المسائية (بعد العشاء)', labelEn: 'Evening Shift (Post-Isha)' },
  ];

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();

    const availability = checkSlotAvailability(selectedDate, selectedSlotId);
    if (!availability.isAvailable) {
      const errMsg = isAr
        ? `عذراً، هذه الفترة غير متاحة: ${availability.reasonAr}`
        : `Sorry, this slot is not available: ${availability.reasonEn}`;
      setSlotValidationError(errMsg);
      showToast(errMsg);
      return;
    }

    setSlotValidationError(null);
    setPendingBookingData({
      id: `MUTQ-${Date.now().toString().slice(-6)}`,
      customerId: 'cust-current',
      customerName: customerName || 'العميل',
      serviceId: selectedServiceForBooking.id,
      serviceTitleEn: selectedServiceForBooking.titleEn,
      serviceTitleAr: selectedServiceForBooking.titleAr,
      status: 'pending',
      paymentStatus: 'pending',
      totalSAR: totalPriceSAR,
      date: selectedDate,
      timeSlot: activeSlotLabel,
      addressCity: selectedCity,
      addressDistrict: district,
      streetAddress: streetAddress,
      latitude: locationMeta.lat,
      longitude: locationMeta.lng,
      locationAccuracyMeters: locationMeta.accuracy,
      nationalAddressCode: locationMeta.shortCode,
      locationDetectedViaGps: locationMeta.isGpsDetected,
      notes,
    });
    setIsBookingModalOpen(false);
    setIsPaymentModalOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white z-10">
          <div>
            <span className="text-xs font-semibold text-emerald-800 tracking-wider uppercase">
              {isAr ? 'نظام الحجز والجدولة الذكية' : 'ROBUST APPOINTMENT SCHEDULING'}
            </span>
            <h3 className="text-xl font-bold text-slate-900 mt-0.5">{title}</h3>
          </div>
          <button
            onClick={() => setIsBookingModalOpen(false)}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Booking Form */}
        <form onSubmit={handleProceedToPayment} className="p-6 space-y-6">
          {/* Step 1: Units / Quantity Stepper */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 uppercase">
                {isAr ? '1. حجم ونطاق الخدمة المطلوبة' : '1. Service Scope & Quantity'}
              </label>
              <span className="text-xs text-slate-500">
                {isAr ? 'سعر الوحدة الأساسي:' : 'Base rate:'} {basePrice} SAR
              </span>
            </div>

            <div className="flex items-center gap-4 p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-sm font-medium text-slate-700 flex-1">
                {isAr ? 'عدد الوحدات / المكيفات / الغرف:' : 'Units / Rooms count:'}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-8 h-8 rounded-lg bg-white border border-slate-300 font-bold text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors"
                >
                  -
                </button>
                <span className="w-8 text-center font-bold text-base tabular-nums text-slate-900">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-8 h-8 rounded-lg bg-white border border-slate-300 font-bold text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Step 2: 14-Day Calendar Date Selector Carousel */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 uppercase flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-800" />
                <span>{isAr ? '2. اختر تاريخ الزيارة المفضل' : '2. Select Service Date'}</span>
              </label>
              <span className="text-xs text-emerald-800 font-medium">
                {isAr ? 'مواعيد مؤكدة مع الفني' : 'Guaranteed Pro Slots'}
              </span>
            </div>

            {/* Horizontal Date Picker Cards */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {calendarDates.map((item) => {
                const isSelected = selectedDate === item.date;

                return (
                  <button
                    key={item.date}
                    type="button"
                    onClick={() => setSelectedDate(item.date)}
                    className={`min-w-[76px] p-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center shrink-0 ${
                      isSelected
                        ? 'border-emerald-800 bg-emerald-800 text-white shadow-sm ring-2 ring-emerald-800'
                        : item.isBlocked
                        ? 'border-slate-200 bg-slate-100 text-slate-400 opacity-60'
                        : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <span className={`text-[11px] font-medium ${isSelected ? 'text-emerald-100' : 'text-slate-500'}`}>
                      {item.dayName}
                    </span>
                    <span className="text-lg font-black tabular-nums my-0.5">
                      {item.dayNum}
                    </span>
                    <span className={`text-[10px] ${isSelected ? 'text-emerald-200' : 'text-slate-400'}`}>
                      {item.monthName}
                    </span>
                    {item.isFriday && (
                      <span className={`text-[9px] mt-0.5 ${isSelected ? 'text-emerald-200' : 'text-amber-600'}`}>
                        {isAr ? 'جمعة' : 'Fri'}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3: Prayer-Timed Available Time Slots */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 uppercase flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-800" />
                <span>{isAr ? '3. اختر الفترة الزمنية المناسبة' : '3. Select Available Prayer-Timed Slot'}</span>
              </label>
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                  <span>{isAr ? 'متاح' : 'Available'}</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-slate-300 inline-block" />
                  <span>{isAr ? 'محجوز / مغلق' : 'Booked'}</span>
                </span>
              </div>
            </div>

            {/* Periods slot grid */}
            <div className="space-y-3">
              {periods.map((period) => {
                const slotsInPeriod = STANDARD_TIME_SLOTS.filter((s) => s.period === period.key);

                return (
                  <div key={period.key} className="space-y-1.5">
                    <span className="text-xs font-semibold text-slate-500 block">
                      {isAr ? period.labelAr : period.labelEn}
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {slotsInPeriod.map((slot) => {
                        const availability = checkSlotAvailability(selectedDate, slot.id);
                        const isAvailable = availability.isAvailable;
                        const isSelected = selectedSlotId === slot.id && isAvailable;

                        return (
                          <button
                            key={slot.id}
                            type="button"
                            disabled={!isAvailable}
                            onClick={() => setSelectedSlotId(slot.id)}
                            className={`p-3 rounded-xl border text-left rtl:text-right transition-all flex items-center justify-between gap-2 ${
                              isSelected
                                ? 'border-emerald-800 bg-emerald-50 ring-2 ring-emerald-800 text-emerald-950 font-bold'
                                : isAvailable
                                ? 'border-slate-200 bg-white hover:bg-slate-50 text-slate-800'
                                : 'border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed opacity-65'
                            }`}
                          >
                            <div>
                              <div className="text-xs font-semibold">
                                {isAr ? slot.labelAr : slot.labelEn}
                              </div>
                              <div className="text-[10px] text-slate-500 mt-0.5">
                                {isAvailable
                                  ? isAr
                                    ? 'فترة متاحة للحجز الفوري'
                                    : 'Available for immediate dispatch'
                                  : isAr
                                  ? availability.reasonAr
                                  : availability.reasonEn}
                              </div>
                            </div>

                            {isSelected ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-800 shrink-0" />
                            ) : !isAvailable ? (
                              <Ban className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            ) : null}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Assigned Technician Card Preview */}
          <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-800 text-white flex items-center justify-center font-bold text-xs">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block">
                  {isAr ? 'الفني المعتمد المخصص: م. فيصل العتيبي' : 'Assigned Provider: Eng. Faisal Al-Otaibi'}
                </span>
                <span className="text-[11px] text-slate-600">
                  {isAr ? 'سجل تجاري موثق · تقييم 4.95 ★ · وصول في الوقت المحدد' : 'CR Verified · 4.95 ★ Rating · On-time guarantee'}
                </span>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-1 text-xs text-emerald-800 font-bold font-mono">
              <ShieldCheck className="w-4 h-4" />
              <span>SASO Certified</span>
            </div>
          </div>

          {/* Step 4: Saudi National Address & GPS Location Dispatch */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 uppercase flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-800" />
                <span>{isAr ? '4. تحديد الموقع والعنوان الوطني في المملكة' : '4. Location Picker & Saudi National Address'}</span>
              </label>
              <span className="text-[11px] text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                {isAr ? 'تغطية معتمدة لـ 13 منطقة' : 'All 13 Saudi Regions'}
              </span>
            </div>

            {/* Browser Geolocation & Address Search Picker */}
            <SaudiLocationPicker
              selectedCity={selectedCity}
              onCityChange={(newCity) => {
                setSelectedCity(newCity);
                const foundCity = SAUDI_CITIES.find(
                  (c) => (isAr ? c.nameAr : c.nameEn) === newCity
                );
                if (foundCity && foundCity.districtsAr.length > 0) {
                  setDistrict(isAr ? foundCity.districtsAr[0] : foundCity.districtsEn[0]);
                }
              }}
              district={district}
              onDistrictChange={setDistrict}
              streetAddress={streetAddress}
              onStreetAddressChange={setStreetAddress}
              onLocationDetected={(loc) => {
                setLocationMeta({
                  lat: loc.lat,
                  lng: loc.lng,
                  accuracy: loc.accuracy,
                  shortCode: loc.shortCode,
                  isGpsDetected: true,
                });
              }}
            />

            {/* City & Manual Province Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                  {isAr ? 'المدينة / المحافظة:' : 'City / Province:'}
                </label>
                <select
                  value={selectedCity}
                  onChange={(e) => {
                    const newCity = e.target.value;
                    setSelectedCity(newCity);
                    const foundCity = SAUDI_CITIES.find(
                      (c) => (isAr ? c.nameAr : c.nameEn) === newCity
                    );
                    if (foundCity && foundCity.districtsAr.length > 0) {
                      setDistrict(isAr ? foundCity.districtsAr[0] : foundCity.districtsEn[0]);
                    }
                  }}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-800"
                >
                  {SAUDI_CITIES.map((c) => (
                    <option key={c.id} value={isAr ? c.nameAr : c.nameEn}>
                      {isAr ? `${c.nameAr} - ${c.regionNameAr}` : `${c.nameEn} - ${c.regionNameEn}`}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                  {isAr ? 'الحي:' : 'District:'}
                </label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder={isAr ? 'الحي (مثال: حي النخيل)' : 'District Name'}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-800"
                  required
                />
              </div>
            </div>

            {/* Quick District suggestions based on active city */}
            {(() => {
              const activeCityObj = SAUDI_CITIES.find(
                (c) => (isAr ? c.nameAr : c.nameEn) === selectedCity
              ) || SAUDI_CITIES[0];
              const distList = isAr ? activeCityObj.districtsAr : activeCityObj.districtsEn;

              return (
                <div className="space-y-1">
                  <span className="text-[11px] text-slate-500 font-medium block">
                    {isAr ? 'أحياء شائعة في هذه المدينة (اختر بنقرة واحدة):' : 'Suggested districts (tap to select):'}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {distList.map((dName, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setDistrict(dName)}
                        className={`text-xs px-2.5 py-1 rounded-lg border transition-colors ${
                          district === dName
                            ? 'bg-emerald-800 text-white border-emerald-800 font-bold'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {dName}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* Customer Contact */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                  {isAr ? 'اسم المستلم:' : 'Recipient Name:'}
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder={isAr ? 'اسم المستلم الثلاثي' : 'Full Name'}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-800"
                  required
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                  {isAr ? 'رقم الجوال السعودي:' : 'Saudi Mobile Number:'}
                </label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="0551234567"
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-800"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                {isAr ? 'العنوان الوطني / الشارع ورقم الفيلا أو الشقة:' : 'National Address / Street & Villa No.:'}
              </label>
              <input
                type="text"
                value={streetAddress}
                onChange={(e) => setStreetAddress(e.target.value)}
                placeholder={isAr ? 'الشارع ورقم الفيلا / الشقة (مثال: شارع التخصصي، مبنى 14)' : 'Street & Building No.'}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-800"
                required
              />
            </div>

            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={isAr ? 'ملاحظات إضافية للفني (نوع الأجهزة، كود بوابة المجمع، أوقات محددة)...' : 'Instructions for provider...'}
              rows={2}
              className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-800"
            />
          </div>

          {/* Slot Validation Warning if any */}
          {slotValidationError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
              <span>{slotValidationError}</span>
            </div>
          )}

          {/* Pricing & Proceed CTA - Sticky Bottom on Mobile */}
          <div className="p-4 -mx-6 -mb-6 mt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sticky bottom-0 bg-white shadow-[0_-4px_16px_rgba(0,0,0,0.04)] rounded-b-2xl">
            <div className="flex items-center justify-between sm:block">
              <div>
                <div className="text-[11px] text-slate-400">
                  {isAr ? 'المجموع شامل الضريبة (15% VAT)' : 'Total incl. 15% VAT'}
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl sm:text-2xl font-black text-slate-950 tabular-nums">
                    {totalPriceSAR}
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-emerald-800">
                    {isAr ? 'ر.س' : 'SAR'}
                  </span>
                  <span className="text-xs text-slate-400">({quantity} {isAr ? 'وحدة' : 'units'})</span>
                </div>
              </div>

              <div className="text-[11px] text-amber-700 font-semibold flex items-center gap-1 sm:mt-0.5">
                <span>⭐</span>
                <span>
                  {isAr
                    ? `+${Math.round(totalPriceSAR * loyaltyProfile.earningMultiplier)} نقطة`
                    : `+${Math.round(totalPriceSAR * loyaltyProfile.earningMultiplier)} pts`}
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 text-xs sm:text-sm font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2 active:scale-98"
            >
              <span>{isAr ? 'المتابعة للدفع وتأكيد الحجز' : 'Proceed to Payment'}</span>
              <ArrowIcon className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
