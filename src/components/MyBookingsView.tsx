import React, { useState } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { Booking, ZatcaInvoice } from '../types';
import { STANDARD_TIME_SLOTS } from '../data/mockData';
import { SubscriptionDashboard } from './SubscriptionDashboard';
import { LiveTrackingMap } from './LiveTrackingMap';
import { BookingReviewModal } from './BookingReviewModal';
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
  ExternalLink,
  Crosshair,
  Building2,
  Repeat,
  Crown,
  Navigation,
  Star,
  Car,
  ChevronDown,
  ChevronUp,
  Maximize2,
  ThumbsUp,
} from 'lucide-react';

export const MyBookingsView: React.FC = () => {
  const {
    language,
    bookings,
    userSubscriptions,
    setActiveInvoice,
    setActiveTab,
    rescheduleBooking,
    checkSlotAvailability,
    blockedDayOffDates,
    loyaltyProfile,
    setIsLoyaltyModalOpen,
    showToast,
    updateBookingStatus,
  } = useMarketplace();

  const isAr = language === 'ar';

  const [viewMode, setViewMode] = useState<'bookings' | 'subscriptions'>('bookings');
  const [statusFilter, setStatusFilter] = useState<'all' | 'in_progress' | 'pending' | 'confirmed' | 'completed'>('all');
  const [reschedulingBooking, setReschedulingBooking] = useState<Booking | null>(null);
  const [rescheduleError, setRescheduleError] = useState<string | null>(null);
  const [newDate, setNewDate] = useState('2026-10-18');
  const [newSlotId, setNewSlotId] = useState(STANDARD_TIME_SLOTS[2].id);

  // Live Tracking & Review states
  const inProgressBooking = bookings.find((b: Booking) => b.status === 'in_progress');
  const [expandedTrackingBookingId, setExpandedTrackingBookingId] = useState<string | null>(
    inProgressBooking ? inProgressBooking.id : null
  );
  const [liveTrackModalBooking, setLiveTrackModalBooking] = useState<Booking | null>(null);
  const [reviewModalBooking, setReviewModalBooking] = useState<Booking | null>(null);

  const filteredBookings = bookings.filter((b: Booking) => {
    if (statusFilter === 'all') return true;
    return b.status === statusFilter;
  });

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
              {isAr ? 'مركز الحجوزات والاشتراكات الدورية' : 'Bookings & Recurring Subscriptions'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {isAr
                ? 'تابع مواعيد الزيارات الفنية المجدولة واستعرض فواتير الزكاة والضريبة أو أعد جدولة موعدك.'
                : 'Track upcoming technician appointments, download ZATCA tax invoices, or reschedule slots.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('subscriptions_catalog')}
              className="px-3.5 py-2 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <Repeat className="w-3.5 h-3.5" />
              <span>{isAr ? 'باقات الاشتراكات' : 'Subscription Plans'}</span>
            </button>
            <button
              onClick={() => setActiveTab('services')}
              className="px-4 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl transition-colors"
            >
              {isAr ? '+ حجز خدمة' : '+ Book Service'}
            </button>
          </div>
        </div>

        {/* View Mode Switcher: Subscriptions vs Bookings */}
        <div className="flex items-center gap-2 p-1 bg-slate-200/80 rounded-xl text-xs font-bold self-start">
          <button
            onClick={() => setViewMode('subscriptions')}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
              viewMode === 'subscriptions'
                ? 'bg-white text-emerald-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Crown className="w-4 h-4 text-emerald-700" />
            <span>{isAr ? 'اشتراكات الصيانة الدورية (Mutqin Care Pass)' : 'Recurring Subscriptions'}</span>
            {userSubscriptions.length > 0 && (
              <span className="bg-emerald-100 text-emerald-900 text-[10px] px-1.5 py-0.2 rounded-full font-mono">
                {userSubscriptions.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setViewMode('bookings')}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
              viewMode === 'bookings'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-4 h-4 text-slate-600" />
            <span>{isAr ? 'الحجوزات الفردية' : 'One-Time Bookings'}</span>
            {bookings.length > 0 && (
              <span className="bg-slate-100 text-slate-700 text-[10px] px-1.5 py-0.2 rounded-full font-mono">
                {bookings.length}
              </span>
            )}
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
                  ? `لديك ${loyaltyProfile.pointsBalance} نقطة متاحة (تعادل ${Math.round((loyaltyProfile.pointsBalance / 10) * 100) / 100} ر.س رصيد خصم) · تكسب نقاطاً مع كل حجز وتجديد`
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

        {/* View Mode 1: Subscriptions View */}
        {viewMode === 'subscriptions' && <SubscriptionDashboard />}

        {/* View Mode 2: Individual Bookings View */}
        {viewMode === 'bookings' && (
          <div className="space-y-6">

        {/* Active En Route Notification Banner */}
        {inProgressBooking && (
          <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white rounded-2xl p-4 sm:p-5 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4 border border-emerald-700">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center font-bold shrink-0">
                <Car className="w-6 h-6 text-emerald-300 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/30 text-emerald-200 px-2.5 py-0.5 rounded-full border border-emerald-400/30 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                    <span>{isAr ? 'الفني في الطريق إليك الآن' : 'Technician En Route'}</span>
                  </span>
                  <span className="text-xs font-mono text-emerald-200">#{inProgressBooking.id}</span>
                </div>
                <p className="text-sm font-bold text-white mt-1">
                  {isAr ? inProgressBooking.serviceTitleAr : inProgressBooking.serviceTitleEn} — {inProgressBooking.technicianName}
                </p>
                <p className="text-xs text-emerald-200/90 mt-0.5">
                  {isAr
                    ? 'يمكنك متابعة تحركات الفني ولحظة وصوله مباشرة على الخريطة التفاعلية.'
                    : 'Track live technician telemetry and arrival estimate directly on the map.'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                onClick={() => {
                  setStatusFilter('all');
                  setExpandedTrackingBookingId(
                    expandedTrackingBookingId === inProgressBooking.id ? null : inProgressBooking.id
                  );
                }}
                className="px-4 py-2 text-xs font-bold bg-white text-emerald-950 hover:bg-emerald-50 rounded-xl transition-all shadow-xs flex items-center gap-1.5"
              >
                <Navigation className="w-3.5 h-3.5 text-emerald-800" />
                <span>
                  {expandedTrackingBookingId === inProgressBooking.id
                    ? isAr
                      ? 'إخفاء الخريطة'
                      : 'Hide Map'
                    : isAr
                    ? 'عرض خريطة التتبع'
                    : 'Show Live Map'}
                </span>
              </button>
              <button
                onClick={() => setLiveTrackModalBooking(inProgressBooking)}
                className="p-2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
                title={isAr ? 'تكبير الخريطة' : 'Fullscreen Map'}
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Status Filter Tabs */}
        {bookings.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 bg-white border border-slate-200 rounded-xl p-1.5 self-start">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                statusFilter === 'all'
                  ? 'bg-emerald-800 text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {isAr ? 'جميع الحجوزات' : 'All Bookings'} ({bookings.length})
            </button>
            <button
              onClick={() => setStatusFilter('in_progress')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                statusFilter === 'in_progress'
                  ? 'bg-emerald-700 text-white'
                  : 'text-emerald-800 hover:text-emerald-950 bg-emerald-50'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span>{isAr ? 'الفني في الطريق' : 'En Route'}</span>
              {bookings.filter((b) => b.status === 'in_progress').length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white text-emerald-900 font-bold">
                  {bookings.filter((b) => b.status === 'in_progress').length}
                </span>
              )}
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                statusFilter === 'pending'
                  ? 'bg-amber-600 text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>{isAr ? 'قيد الانتظار' : 'Pending'}</span>
              {bookings.filter((b) => b.status === 'pending').length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-200 text-amber-900 font-bold">
                  {bookings.filter((b) => b.status === 'pending').length}
                </span>
              )}
            </button>
            <button
              onClick={() => setStatusFilter('confirmed')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                statusFilter === 'confirmed'
                  ? 'bg-blue-700 text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {isAr ? 'مؤكدة' : 'Confirmed'}
            </button>
            <button
              onClick={() => setStatusFilter('completed')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                statusFilter === 'completed'
                  ? 'bg-emerald-700 text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {isAr ? 'مكتملة ومقيّمة' : 'Completed'}
            </button>
          </div>
        )}

        {filteredBookings.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
            <p className="text-slate-500 text-sm">
              {isAr ? 'لا توجد حجوزات في هذه الفئة حالياً.' : 'No bookings in this category.'}
            </p>
            <button
              onClick={() => {
                setStatusFilter('all');
                setActiveTab('services');
              }}
              className="px-4 py-2 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors border border-emerald-200"
            >
              {isAr ? 'استعرض الخدمات المتاحة' : 'Browse Services'}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => {
              const title = isAr ? booking.serviceTitleAr : booking.serviceTitleEn;
              const canReschedule = booking.status === 'confirmed' || booking.status === 'pending';
              const earnedPts = Math.round(booking.totalSAR * loyaltyProfile.earningMultiplier);

              return (
                <div
                  key={booking.id}
                  className={`rounded-2xl border transition-all overflow-hidden ${
                    booking.status === 'in_progress'
                      ? 'bg-white border-emerald-400 ring-2 ring-emerald-500/20 shadow-sm'
                      : 'bg-white border-slate-200 shadow-xs hover:border-slate-300'
                  }`}
                >
                  <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-400">
                          #{booking.id}
                        </span>
                        <span
                          className={`text-xs font-bold px-2.5 py-0.5 rounded-md flex items-center gap-1.5 ${
                            booking.status === 'completed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : booking.status === 'in_progress'
                              ? 'bg-emerald-700 text-white shadow-xs'
                              : booking.status === 'confirmed'
                              ? 'bg-blue-100 text-blue-800'
                              : booking.status === 'cancelled'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-900 border border-amber-300'
                          }`}
                        >
                          {booking.status === 'in_progress' && (
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-ping"></span>
                          )}
                          <span>
                            {booking.status === 'completed'
                              ? isAr
                                ? 'مكتمل ومسدد'
                                : 'Completed'
                              : booking.status === 'in_progress'
                              ? isAr
                                ? 'الفني في الطريق إليك (مباشر)'
                                : 'En Route (Live)'
                              : booking.status === 'confirmed'
                              ? isAr
                                ? 'مؤكد ومجدول'
                                : 'Confirmed'
                              : booking.status === 'cancelled'
                              ? isAr
                                ? 'ملغي'
                                : 'Cancelled'
                              : isAr
                              ? 'قيد الانتظار والقبول ⏳'
                              : 'Pending Acceptance ⏳'}
                          </span>
                        </span>
                        <span className="text-xs text-slate-400 font-mono">
                          {booking.paymentMethod.toUpperCase()} (مدفوع)
                        </span>

                        {/* Customer Star Rating Badge if already reviewed */}
                        {booking.status === 'completed' && booking.review && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-md border border-amber-200">
                            <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                            <span>
                              {booking.review.rating}/5 {isAr ? 'تقييمك' : 'Your Rating'}
                            </span>
                          </span>
                        )}
                      </div>

                      <h3 className="text-lg font-bold text-slate-900">{title}</h3>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
                        <span className="flex items-center gap-1 font-semibold text-slate-800">
                          <Calendar className="w-3.5 h-3.5 text-emerald-800" />
                          <span>{booking.date}</span>
                        </span>
                        <span className="flex items-center gap-1 font-semibold text-slate-800">
                          <Clock className="w-3.5 h-3.5 text-emerald-800" />
                          <span>{booking.timeSlot}</span>
                        </span>
                        <span className="flex items-center gap-1 font-medium text-slate-700">
                          <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                          <span>{booking.addressCity} - {booking.addressDistrict}</span>
                        </span>
                        {booking.streetAddress && (
                          <span className="text-[11px] text-slate-500 font-normal">
                            ({booking.streetAddress})
                          </span>
                        )}
                      </div>

                      {/* Geolocation Dispatch & National Address Info */}
                      {(booking.latitude || booking.nationalAddressCode) && (
                        <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
                          {booking.latitude && booking.longitude && (
                            <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-900 border border-emerald-200 font-mono">
                              <Crosshair className="w-3 h-3 text-emerald-700" />
                              <span>
                                {booking.latitude.toFixed(4)}°N, {booking.longitude.toFixed(4)}°E
                              </span>
                              {booking.locationDetectedViaGps && (
                                <span className="text-[10px] text-emerald-800 font-sans font-bold">
                                  (GPS)
                                </span>
                              )}
                            </div>
                          )}
                          {booking.nationalAddressCode && (
                            <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200 font-mono font-semibold">
                              <Building2 className="w-3 h-3 text-amber-700" />
                              <span>{booking.nationalAddressCode}</span>
                            </div>
                          )}
                          {booking.latitude && booking.longitude && (
                            <a
                              href={`https://www.google.com/maps/search/?api=1&query=${booking.latitude},${booking.longitude}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 hover:text-emerald-950 underline underline-offset-2"
                            >
                              <span>{isAr ? 'خرائط Google' : 'Google Maps'}</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          )}
                        </div>
                      )}

                      {/* Live En Route ETA Quick Telemetry Strip */}
                      {booking.status === 'in_progress' && (
                        <div className="mt-2 p-2.5 bg-emerald-50/80 rounded-xl border border-emerald-200 flex flex-wrap items-center gap-3 text-xs text-emerald-950 font-medium">
                          <div className="flex items-center gap-1.5 font-bold">
                            <Car className="w-4 h-4 text-emerald-700" />
                            <span>
                              {isAr ? 'الوقت المتوقع للوصول:' : 'Estimated Arrival:'}{' '}
                              <span className="text-emerald-900 font-black">
                                {booking.liveTracking?.etaMinutes || 11} {isAr ? 'دقيقة' : 'mins'}
                              </span>
                            </span>
                          </div>
                          <span>•</span>
                          <div className="text-slate-600">
                            {booking.liveTracking?.distanceKm || 3.4} {isAr ? 'كم متبقية' : 'km remaining'}
                          </div>
                          <span>•</span>
                          <div className="text-slate-600 truncate max-w-xs">
                            {isAr
                              ? booking.liveTracking?.currentRoadAr || 'طريق الملك فهد'
                              : booking.liveTracking?.currentRoadEn || 'King Fahd Rd'}
                          </div>
                        </div>
                      )}

                      {booking.status === 'pending' && (
                        <p className="text-xs text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-200">
                          {isAr
                            ? 'حجزك قيد المراجعة لدى الفني المختص، وسيتم إشعارك فور تأكيد الموعد.'
                            : 'Your appointment is pending technician review. You will be notified once confirmed.'}
                        </p>
                      )}

                      {booking.status === 'cancelled' && (
                        <p className="text-xs text-rose-700 bg-rose-50 p-2 rounded-lg border border-rose-200">
                          {isAr ? 'تم إلغاء هذا الحجز.' : 'This booking has been cancelled.'}
                        </p>
                      )}

                      {booking.technicianName && booking.status !== 'cancelled' && (
                        <p className="text-xs text-emerald-800 font-medium">
                          {isAr ? 'الفني المعين:' : 'Assigned Technician:'} {booking.technicianName}
                        </p>
                      )}
                    </div>

                    {/* Actions & Price */}
                    <div className="flex flex-col sm:flex-row md:flex-col items-end gap-3 shrink-0">
                      <div className="text-right rtl:text-left w-full sm:w-auto">
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

                      {/* Dynamic Action Buttons according to Booking Status */}
                      <div className="flex flex-wrap items-center justify-end gap-2 w-full sm:w-auto">
                        {/* 1. Live Tracking Buttons when En Route */}
                        {booking.status === 'in_progress' && (
                          <>
                            <button
                              onClick={() => {
                                setExpandedTrackingBookingId(
                                  expandedTrackingBookingId === booking.id ? null : booking.id
                                );
                              }}
                              className="px-3.5 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl transition-all flex items-center gap-1.5 shadow-xs"
                            >
                              <Navigation className="w-3.5 h-3.5" />
                              <span>
                                {expandedTrackingBookingId === booking.id
                                  ? isAr
                                    ? 'إغلاق الخريطة'
                                    : 'Hide Map'
                                  : isAr
                                  ? 'تتبع الفني المباشر'
                                  : 'Live Track'}
                              </span>
                              {expandedTrackingBookingId === booking.id ? (
                                <ChevronUp className="w-3 h-3" />
                              ) : (
                                <ChevronDown className="w-3 h-3" />
                              )}
                            </button>

                            <button
                              onClick={() => setLiveTrackModalBooking(booking)}
                              className="p-2 text-slate-700 hover:text-emerald-900 bg-slate-100 hover:bg-emerald-50 rounded-xl transition-colors border border-slate-200"
                              title={isAr ? 'تكبير الخريطة في نافذة مستقلة' : 'Fullscreen Map'}
                            >
                              <Maximize2 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => {
                                updateBookingStatus(booking.id, 'completed');
                                setReviewModalBooking({ ...booking, status: 'completed' });
                              }}
                              className="px-3 py-2 text-xs font-semibold text-emerald-900 bg-emerald-100 hover:bg-emerald-200 rounded-xl transition-colors border border-emerald-300 flex items-center gap-1"
                              title={isAr ? 'محاكاة وصول الفني وإتمام الصيانة' : 'Simulate Arrival'}
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                              <span>{isAr ? 'وصل الفني' : 'Arrived'}</span>
                            </button>
                          </>
                        )}

                        {/* 2. Dispatch Simulation for Confirmed Bookings */}
                        {booking.status === 'confirmed' && (
                          <button
                            onClick={() => {
                              updateBookingStatus(booking.id, 'in_progress');
                              setExpandedTrackingBookingId(booking.id);
                            }}
                            className="px-3.5 py-2 text-xs font-bold text-blue-900 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs"
                          >
                            <Car className="w-3.5 h-3.5 text-blue-700" />
                            <span>{isAr ? 'محاكاة خروج الفني (تتبع مباشر)' : 'Simulate En Route'}</span>
                          </button>
                        )}

                        {/* 3. Star Rating & Customer Review System for Completed Bookings */}
                        {booking.status === 'completed' && (
                          <button
                            onClick={() => setReviewModalBooking(booking)}
                            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-2xs ${
                              booking.review
                                ? 'text-amber-950 bg-amber-50 hover:bg-amber-100 border border-amber-300'
                                : 'text-white bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 ring-2 ring-amber-400/40'
                            }`}
                          >
                            <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-200" />
                            <span>
                              {booking.review
                                ? isAr
                                  ? 'عرض تقييمك'
                                  : 'View Your Review'
                                : isAr
                                ? 'قيّم الفني والخدمة (+25 نقطة)'
                                : 'Rate & Review (+25 pts)'}
                            </span>
                          </button>
                        )}

                        {/* Standard Reschedule & Invoice Actions */}
                        {canReschedule && (
                          <button
                            onClick={() => {
                              setReschedulingBooking(booking);
                              setRescheduleError(null);
                            }}
                            className="px-3 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl transition-colors flex items-center gap-1.5"
                          >
                            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                            <span>{isAr ? 'إعادة جدولة' : 'Reschedule'}</span>
                          </button>
                        )}

                        {booking.status === 'pending' && (
                          <button
                            onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                            className="px-3 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors"
                          >
                            {isAr ? 'إلغاء الحجز' : 'Cancel'}
                          </button>
                        )}

                        <button
                          onClick={() => handleViewInvoice(booking)}
                          className="px-3 py-2 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl transition-colors flex items-center gap-1.5"
                        >
                          <FileText className="w-3.5 h-3.5 text-emerald-800" />
                          <span>{isAr ? 'فاتورة ZATCA' : 'Tax Invoice'}</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Inline Live Tracking Map Component Drawer */}
                  {booking.status === 'in_progress' && expandedTrackingBookingId === booking.id && (
                    <div className="border-t border-slate-200 bg-slate-50 p-4 sm:p-6 animate-fadeIn">
                      <div className="flex items-center justify-between pb-3">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                          <Navigation className="w-4 h-4 text-emerald-800" />
                          <span>{isAr ? 'خريطة التتبع المباشر للفني' : 'Live Real-time Technician Tracking'}</span>
                        </div>
                        <button
                          onClick={() => setLiveTrackModalBooking(booking)}
                          className="text-xs text-emerald-800 hover:text-emerald-950 font-semibold flex items-center gap-1"
                        >
                          <Maximize2 className="w-3.5 h-3.5" />
                          <span>{isAr ? 'تكبير الخريطة' : 'Expand Fullscreen'}</span>
                        </button>
                      </div>
                      <LiveTrackingMap
                        booking={booking}
                        onOpenReviewModal={(b) => setReviewModalBooking(b)}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
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

      {/* Fullscreen Live Tracking Map Modal */}
      {liveTrackModalBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
          <LiveTrackingMap
            booking={liveTrackModalBooking}
            isModal={true}
            onClose={() => setLiveTrackModalBooking(null)}
            onOpenReviewModal={(b) => {
              setLiveTrackModalBooking(null);
              setReviewModalBooking(b);
            }}
          />
        </div>
      )}

      {/* Customer Star Rating & Review Modal */}
      {reviewModalBooking && (
        <BookingReviewModal
          booking={reviewModalBooking}
          isOpen={!!reviewModalBooking}
          onClose={() => setReviewModalBooking(null)}
        />
      )}
    </div>
  );
};
