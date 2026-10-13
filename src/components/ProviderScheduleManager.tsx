import React, { useState } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { STANDARD_TIME_SLOTS } from '../data/mockData';
import {
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  ToggleLeft,
  ToggleRight,
  Shield,
  Smartphone,
  Save,
  Plus,
  Trash2,
  AlertTriangle,
} from 'lucide-react';

export const ProviderScheduleManager: React.FC = () => {
  const {
    language,
    providerSettings,
    updateProviderSettings,
    blockedDayOffDates,
    toggleDayOffDate,
    customBlockedSlots,
    toggleBlockSlot,
    bookings,
  } = useMarketplace();

  const isAr = language === 'ar';

  const daysOfWeek = [
    { num: 0, nameAr: 'الأحد', nameEn: 'Sunday' },
    { num: 1, nameAr: 'الإثنين', nameEn: 'Monday' },
    { num: 2, nameAr: 'الثلاثاء', nameEn: 'Tuesday' },
    { num: 3, nameAr: 'الأربعاء', nameEn: 'Wednesday' },
    { num: 4, nameAr: 'الخميس', nameEn: 'Thursday' },
    { num: 5, nameAr: 'الجمعة (إجازة أسبوعية)', nameEn: 'Friday (Rest Day)' },
    { num: 6, nameAr: 'السبت', nameEn: 'Saturday' },
  ];

  // Selected date for slot management (next 7 days)
  const upcomingDates = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    return {
      date: dateStr,
      display: isAr
        ? d.toLocaleDateString('ar-SA', { weekday: 'short', month: 'short', day: 'numeric' })
        : d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      isOff: blockedDayOffDates.includes(dateStr),
    };
  });

  const [inspectDate, setInspectDate] = useState<string>(upcomingDates[0].date);

  const toggleWorkingDay = (dayNum: number) => {
    const current = providerSettings.workingDays;
    const updated = current.includes(dayNum)
      ? current.filter((d) => d !== dayNum)
      : [...current, dayNum];
    updateProviderSettings({ workingDays: updated });
  };

  const toggleDefaultSlot = (slotId: string) => {
    const current = providerSettings.defaultSlots;
    const updated = current.includes(slotId)
      ? current.filter((id) => id !== slotId)
      : [...current, slotId];
    updateProviderSettings({ defaultSlots: updated });
  };

  const bookingsOnInspectDate = bookings.filter((b) => b.date === inspectDate && b.status !== 'cancelled');
  const blockedSlotsOnInspectDate = customBlockedSlots[inspectDate] || [];

  return (
    <div className="space-y-6">
      {/* Settings Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-emerald-800 tracking-wider uppercase">
            {isAr ? 'إدارة مناوبات وساعات عمل الفني' : 'PROVIDER SHIFT & AVAILABILITY MANAGER'}
          </span>
          <h3 className="text-xl font-bold text-slate-900 mt-0.5">
            {isAr ? 'الجدول الأسبوعي والتحكم بالفترات المتاحة' : 'Weekly Availability & Blackout Periods'}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            {isAr
              ? 'حدد أيام وساعات استقبال طلبات الصيانة، إغلاق الفترات المزدحمة، وحفظ أوقات الصلاة والراحة.'
              : 'Configure regular shifts, prayer-time breaks, and blackout dates to prevent overbooking.'}
          </p>
        </div>

        {/* Global Dispatch Preferences */}
        <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                updateProviderSettings({ autoAcceptBookings: !providerSettings.autoAcceptBookings })
              }
              className="text-emerald-800"
            >
              {providerSettings.autoAcceptBookings ? (
                <ToggleRight className="w-6 h-6 text-emerald-800" />
              ) : (
                <ToggleLeft className="w-6 h-6 text-slate-400" />
              )}
            </button>
            <span className="font-semibold text-slate-800">
              {isAr ? 'القبول التلقائي للمواعيد' : 'Auto-Accept Bookings'}
            </span>
          </div>

          <div className="flex items-center gap-2 border-l border-slate-200 pl-4 rtl:border-l-0 rtl:border-r rtl:pr-4">
            <Smartphone className="w-4 h-4 text-emerald-800" />
            <span className="font-semibold text-slate-800">
              {isAr ? 'إشعارات الرسائل (SMS) مفعلة' : 'SMS Alerts On'}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Weekly Recurring Days Configuration */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-800" />
            <span>{isAr ? 'أيام العمل الرسمية خلال الأسبوع' : 'Standard Working Days'}</span>
          </h4>

          <div className="space-y-2">
            {daysOfWeek.map((day) => {
              const isWorking = providerSettings.workingDays.includes(day.num);

              return (
                <div
                  key={day.num}
                  className={`p-3 rounded-xl border flex items-center justify-between transition-colors ${
                    isWorking ? 'bg-emerald-50/50 border-emerald-200' : 'bg-slate-50 border-slate-200 text-slate-400'
                  }`}
                >
                  <span className="text-xs font-semibold">
                    {isAr ? day.nameAr : day.nameEn}
                  </span>

                  <button
                    type="button"
                    onClick={() => toggleWorkingDay(day.num)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                      isWorking
                        ? 'bg-emerald-800 text-white'
                        : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                    }`}
                  >
                    {isWorking ? (isAr ? 'مفعل' : 'Active') : (isAr ? 'إجازة' : 'Day Off')}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Shift Preferences */}
          <div className="border-t border-slate-200 pt-4 space-y-2">
            <h5 className="text-xs font-bold text-slate-800 uppercase">
              {isAr ? 'المناوبات المعتمدة للفني' : 'Default Active Shifts'}
            </h5>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {STANDARD_TIME_SLOTS.map((slot) => {
                const isActive = providerSettings.defaultSlots.includes(slot.id);

                return (
                  <button
                    key={slot.id}
                    type="button"
                    onClick={() => toggleDefaultSlot(slot.id)}
                    className={`p-2 rounded-lg border text-center transition-all ${
                      isActive
                        ? 'bg-white border-emerald-800 text-emerald-950 font-bold shadow-xs'
                        : 'bg-slate-100 border-slate-200 text-slate-400'
                    }`}
                  >
                    <span className="block truncate">{isAr ? slot.labelAr : slot.labelEn}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Date-Specific Inspector & Blackout Slot Locker */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-800" />
                <span>{isAr ? 'إدارة اليوم المحدد وحجب الساعات' : 'Day-Specific Slot Controller'}</span>
              </h4>
              <p className="text-xs text-slate-500">
                {isAr ? 'اختر يوماً لاستعراض مواعيده أو إغلاق فترات محددة للراحة.' : 'Inspect orders and toggle specific hours off.'}
              </p>
            </div>

            {/* Day off button */}
            <button
              onClick={() => toggleDayOffDate(inspectDate)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors border ${
                blockedDayOffDates.includes(inspectDate)
                  ? 'bg-red-50 text-red-700 border-red-300'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              {blockedDayOffDates.includes(inspectDate)
                ? isAr
                  ? 'اليوم محدد كإجازة (إلغاء)'
                  : 'Marked Day Off (Undo)'
                : isAr
                ? 'تعيين هذا اليوم كإجازة'
                : 'Mark Date as Day Off'}
            </button>
          </div>

          {/* Date Selector Ribbon */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {upcomingDates.map((d) => (
              <button
                key={d.date}
                type="button"
                onClick={() => setInspectDate(d.date)}
                className={`px-3 py-2 rounded-xl text-xs font-bold border transition-colors shrink-0 ${
                  inspectDate === d.date
                    ? 'bg-emerald-800 text-white border-emerald-800 shadow-xs'
                    : d.isOff
                    ? 'bg-red-50 text-red-700 border-red-200'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span>{d.display}</span>
                {d.isOff && <span className="block text-[9px] opacity-80">{isAr ? 'إجازة' : 'Off'}</span>}
              </button>
            ))}
          </div>

          {/* Bookings on Selected Date */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <span className="text-xs font-bold text-slate-700 block">
              {isAr ? `الحجوزات المجدولة في هذا اليوم (${bookingsOnInspectDate.length})` : `Booked Appointments on this Date (${bookingsOnInspectDate.length})`}
            </span>
            {bookingsOnInspectDate.length === 0 ? (
              <p className="text-xs text-slate-400">
                {isAr ? 'لا توجد حجوزات مجدولة في هذا التاريخ حتى الآن.' : 'No bookings booked for this date yet.'}
              </p>
            ) : (
              bookingsOnInspectDate.map((b) => (
                <div
                  key={b.id}
                  className="p-2.5 bg-white border border-slate-200 rounded-lg flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-slate-900 block">
                      {isAr ? b.serviceTitleAr : b.serviceTitleEn}
                    </span>
                    <span className="text-slate-500">
                      {b.timeSlot} · {b.customerName} ({b.addressDistrict})
                    </span>
                  </div>
                  <span className="font-bold text-emerald-800 tabular-nums">
                    {b.totalSAR} SAR
                  </span>
                </div>
              ))
            )}
          </div>

          {/* Individual Slot Lock / Block Toggles */}
          <div className="space-y-2 pt-2">
            <span className="text-xs font-bold text-slate-700 block">
              {isAr ? 'التحكم في إتاحة الفترات لهذا التاريخ بالتحديد:' : 'Toggle Slot Availability for this Date:'}
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {STANDARD_TIME_SLOTS.map((slot) => {
                const isBlocked = blockedSlotsOnInspectDate.includes(slot.id);
                const hasBooking = bookingsOnInspectDate.some(
                  (b) => b.timeSlot.includes(slot.id) || b.timeSlot.includes(slot.startTime)
                );

                return (
                  <div
                    key={slot.id}
                    className={`p-2.5 rounded-xl border flex items-center justify-between ${
                      hasBooking
                        ? 'bg-blue-50 border-blue-200 text-blue-900'
                        : isBlocked
                        ? 'bg-amber-50 border-amber-200 text-amber-900'
                        : 'bg-white border-slate-200 text-slate-800'
                    }`}
                  >
                    <div>
                      <div className="font-semibold">{isAr ? slot.labelAr : slot.labelEn}</div>
                      <div className="text-[10px] text-slate-500">
                        {hasBooking
                          ? isAr
                            ? 'محجوز بعقد صيانة'
                            : 'Occupied by booking'
                          : isBlocked
                          ? isAr
                            ? 'مغلق يدوياً من الفني'
                            : 'Blocked manually'
                          : isAr
                          ? 'متاح للعملاء'
                          : 'Open for booking'}
                      </div>
                    </div>

                    {!hasBooking && (
                      <button
                        type="button"
                        onClick={() => toggleBlockSlot(inspectDate, slot.id)}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-colors ${
                          isBlocked
                            ? 'bg-amber-800 text-white hover:bg-amber-900'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {isBlocked ? (isAr ? 'فتح الفترة' : 'Open Slot') : (isAr ? 'إغلاق الفترة' : 'Block Slot')}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
