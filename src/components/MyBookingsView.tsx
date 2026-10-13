import React, { useState } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { Booking, ZatcaInvoice } from '../types';
import { STANDARD_TIME_SLOTS } from '../data/mockData';
import {
  Calendar,
  Clock,
  MapPin,
  FileText,
  RotateCcw,
  X,
  CheckCircle2,
  AlertCircle,
  Award,
  Sparkles,
} from 'lucide-react';

export const MyBookingsView: React.FC = () => {
  const {
    language,
    bookings,
    setActiveInvoice,
    setActiveTab,
    rescheduleBooking,
    checkSlotAvailability,
    blockedDayOffDates,
    loyaltyProfile,
    setIsLoyaltyModalOpen,
    showToast,
  } = useMarketplace();

  const isAr = language === 'ar';

  const [reschedulingBooking, setReschedulingBooking] = useState<Booking | null>(null);
  const [rescheduleError, setRescheduleError] = useState<string | null>(null);
  const [newDate, setNewDate] = useState('2026-10-18');
  const [newSlotId, setNewSlotId] = useState(STANDARD_TIME_SLOTS[2].id);

  const handleViewInvoice = (booking: Booking) => {
    const vatRate = 0.15;
    const subtotal = Math.round((booking.totalSAR / (1 + vatRate)) * 100) / 100;
    const vatAmount = Math.round((booking.totalSAR - subtotal) * 100) / 100;

    const invoice: ZatcaInvoice = {
      invoiceNumber: booking.zatcaInvoiceNo || `MUTQ-${booking.id}`,
      issueDate: booking.createdAt,
      sellerName: 'مؤسسة إتقان للخدمات المنزلية المحدودة (Mutqin LLC)',
      vatRegistrationNumber: '310984920100003',
      crNumber: '1010892341',
      customerName: booking.customerName,
      serviceTitle: isAr ? booking.serviceTitleAr : booking.serviceTitleEn,
      subtotalSAR: subtotal,
      vatRate: 0.15,
      vatAmountSAR: vatAmount,
      totalSAR: booking.totalSAR,
      paymentMethod: booking.paymentMethod,
      qrPayload: 'ZATCA-QR-SIMULATED-PAYLOAD',
    };

    setActiveInvoice(invoice);
  };

  const handleConfirmReschedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reschedulingBooking) return;

    const slotObj = STANDARD_TIME_SLOTS.find((s) => s.id === newSlotId) || STANDARD_TIME_SLOTS[0];
    const slotLabel = isAr ? slotObj.labelAr : slotObj.labelEn;

    const avail = checkSlotAvailability(newDate, newSlotId);
    if (!avail.isAvailable) {
      const msg = isAr ? `الفترة غير متاحة: ${avail.reasonAr}` : `Slot unavailable: ${avail.reasonEn}`;
      setRescheduleError(msg);
      showToast(msg);
      return;
    }

    setRescheduleError(null);
    rescheduleBooking(reschedulingBooking.id, newDate, slotLabel);
    setReschedulingBooking(null);
  };

  return (
    <div className="py-10 bg-slate-50 min-h-[70vh]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              {isAr ? 'سجل الحجوزات والفواتير' : 'My Service Bookings'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {isAr
                ? 'تابع مواعيد الزيارات الفنية المجدولة واستعرض فواتير الزكاة والضريبة أو أعد جدولة موعدك.'
                : 'Track upcoming technician appointments, download ZATCA tax invoices, or reschedule slots.'}
            </p>
          </div>

          <button
            onClick={() => setActiveTab('services')}
            className="px-4 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl transition-colors"
          >
            {isAr ? '+ حجز خدمة جديدة' : '+ Book New Service'}
          </button>
        </div>

        {/* Mutqin Points Rewards Summary Banner */}
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-emerald-500/10 border border-amber-300/60 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold shrink-0">
              <Award className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900">
                  {isAr ? 'محفظة نقاط مُتقَن الخاصة بك' : 'Your Mutqin Points Balance'}
                </span>
                <span className="text-[10px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full">
                  {isAr ? loyaltyProfile.tierNameAr : loyaltyProfile.tierNameEn}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                {isAr
                  ? `لديك ${loyaltyProfile.pointsBalance} نقطة متاحة (تعادل ${Math.round((loyaltyProfile.pointsBalance / 10) * 100) / 100} ر.س رصيد خصم) · تكسب نقاطاً مع كل حجز`
                  : `You have ${loyaltyProfile.pointsBalance} pts (${Math.round((loyaltyProfile.pointsBalance / 10) * 100) / 100} SAR discount value) · Earn points on every booking`}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsLoyaltyModalOpen(true)}
            className="px-4 py-2 text-xs font-bold text-amber-950 bg-amber-200 hover:bg-amber-300 rounded-xl transition-colors whitespace-nowrap self-start sm:self-center flex items-center gap-1.5 shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>{isAr ? 'استبدال النقاط والكتالوج' : 'Redeem Vouchers'}</span>
          </button>
        </div>

        {bookings.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
            <p className="text-slate-500 text-sm">
              {isAr ? 'لا توجد حجوزات نشطة حالياً.' : 'No active bookings yet.'}
            </p>
            <button
              onClick={() => setActiveTab('services')}
              className="px-4 py-2 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors border border-emerald-200"
            >
              {isAr ? 'استعرض الخدمات المتاحة' : 'Browse Services'}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => {
              const title = isAr ? booking.serviceTitleAr : booking.serviceTitleEn;
              const canReschedule = booking.status === 'confirmed' || booking.status === 'pending';
              const earnedPts = Math.round(booking.totalSAR * loyaltyProfile.earningMultiplier);

              return (
                <div
                  key={booking.id}
                  className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-400">
                        #{booking.id}
                      </span>
                      <span
                        className={`text-xs font-bold px-2.5 py-0.5 rounded-md ${
                          booking.status === 'completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : booking.status === 'in_progress'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {booking.status === 'completed'
                          ? isAr
                            ? 'مكتمل'
                            : 'Completed'
                          : booking.status === 'in_progress'
                          ? isAr
                            ? 'الفني في الموقع'
                            : 'In Progress'
                          : isAr
                          ? 'مؤكد ومجدول'
                          : 'Confirmed'}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        {booking.paymentMethod.toUpperCase()} (مدفوع)
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900">{title}</h3>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
                      <span className="flex items-center gap-1 font-semibold text-slate-800">
                        <Calendar className="w-3.5 h-3.5 text-emerald-800" />
                        <span>{booking.date}</span>
                      </span>
                      <span className="flex items-center gap-1 font-semibold text-slate-800">
                        <Clock className="w-3.5 h-3.5 text-emerald-800" />
                        <span>{booking.timeSlot}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{booking.addressCity} - {booking.addressDistrict}</span>
                      </span>
                    </div>

                    {booking.technicianName && (
                      <p className="text-xs text-emerald-800 font-medium">
                        {isAr ? 'الفني المعين:' : 'Assigned Technician:'} {booking.technicianName}
                      </p>
                    )}
                  </div>

                  {/* Actions & Price */}
                  <div className="flex items-center gap-3 self-end md:self-center shrink-0">
                    <div className="text-right rtl:text-left mr-2 rtl:mr-0 rtl:ml-2">
                      <div className="text-xs text-slate-400">{isAr ? 'المبلغ المسدد' : 'Paid Amount'}</div>
                      <div className="text-lg font-black text-slate-900 tabular-nums">
                        {booking.totalSAR}{' '}
                        <span className="text-xs font-bold text-emerald-800">
                          {isAr ? 'ر.س' : 'SAR'}
                        </span>
                      </div>
                      <div className="text-[10px] text-amber-700 font-bold flex items-center justify-end rtl:justify-start gap-1">
                        <span>⭐</span>
                        <span>+{earnedPts} {isAr ? 'نقطة' : 'pts'}</span>
                      </div>
                    </div>

                    {canReschedule && (
                      <button
                        onClick={() => {
                          setReschedulingBooking(booking);
                          setRescheduleError(null);
                        }}
                        className="px-3.5 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl transition-colors flex items-center gap-1.5"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                        <span>{isAr ? 'إعادة جدولة' : 'Reschedule'}</span>
                      </button>
                    )}

                    <button
                      onClick={() => handleViewInvoice(booking)}
                      className="px-3.5 py-2 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl transition-colors flex items-center gap-1.5"
                    >
                      <FileText className="w-3.5 h-3.5 text-emerald-800" />
                      <span>{isAr ? 'فاتورة ZATCA' : 'Tax Invoice'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Reschedule Modal */}
      {reschedulingBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {isAr ? 'إعادة جدولة موعد الخدمة' : 'Reschedule Appointment Slot'}
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  #{reschedulingBooking.id}
                </p>
              </div>
              <button
                onClick={() => setReschedulingBooking(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmReschedule} className="space-y-4 text-xs">
              {rescheduleError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{rescheduleError}</span>
                </div>
              )}
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  {isAr ? 'التاريخ الجديد' : 'New Date'}
                </label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  min="2026-10-14"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-800"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  {isAr ? 'الفترة الزمنية المتاحة للفني' : 'Available Shift Slot'}
                </label>
                <select
                  value={newSlotId}
                  onChange={(e) => setNewSlotId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-800"
                >
                  {STANDARD_TIME_SLOTS.map((s) => {
                    const avail = checkSlotAvailability(newDate, s.id);
                    return (
                      <option key={s.id} value={s.id} disabled={!avail.isAvailable}>
                        {isAr ? s.labelAr : s.labelEn} {!avail.isAvailable ? `(${avail.reasonAr})` : ''}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setReschedulingBooking(null)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-xs"
                >
                  {isAr ? 'تأكيد الموعد الجديد' : 'Confirm New Slot'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
