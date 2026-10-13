import React, { useState } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { Booking } from '../types';
import { ProviderScheduleManager } from './ProviderScheduleManager';
import {
  Wrench,
  CheckCircle,
  Truck,
  Clock,
  Phone,
  MapPin,
  TrendingUp,
  ShieldCheck,
  Calendar,
  FileText,
  ListOrdered,
  Bell,
} from 'lucide-react';

export const TechnicianPortal: React.FC = () => {
  const {
    language,
    bookings,
    updateBookingStatus,
    setActiveTab,
    quotes,
    unreadCount,
    setIsNotificationCenterOpen,
  } = useMarketplace();

  const isAr = language === 'ar';

  const [portalTab, setPortalTab] = useState<'orders' | 'schedule' | 'quotes'>('orders');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const contractorName = isAr ? 'م. فيصل العتيبي' : 'Eng. Faisal Al-Otaibi';
  const crLicense = 'CR-1010-82736';

  const completedJobs = bookings.filter((b) => b.status === 'completed');
  const totalEarningsSAR = bookings.reduce(
    (acc, b) => (b.status === 'completed' || b.status === 'confirmed' ? acc + b.totalSAR : acc),
    1840
  );

  const filteredBookings = bookings.filter((b) => {
    if (filterStatus === 'all') return true;
    return b.status === filterStatus;
  });

  const getStatusBadge = (status: Booking['status']) => {
    switch (status) {
      case 'confirmed':
        return {
          label: isAr ? 'مؤكد للزيارة' : 'Confirmed',
          className: 'bg-blue-100 text-blue-800',
        };
      case 'in_progress':
        return {
          label: isAr ? 'قيد التنفيذ' : 'In Progress',
          className: 'bg-amber-100 text-amber-800',
        };
      case 'completed':
        return {
          label: isAr ? 'مكتمل ومسدد' : 'Completed',
          className: 'bg-emerald-100 text-emerald-800',
        };
      default:
        return {
          label: isAr ? 'قيد المعالجة' : 'Pending',
          className: 'bg-slate-100 text-slate-800',
        };
    }
  };

  return (
    <div className="py-10 bg-slate-50 min-h-[75vh]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Contractor Profile Banner */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-800 text-white flex items-center justify-center font-bold text-xl shadow-xs">
              <Wrench className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900">{contractorName}</h2>
                <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{isAr ? 'فني سعودي موثق' : 'Verified Pro'}</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                {isAr ? 'السجل التجاري:' : 'CR License:'} {crLicense} · {isAr ? 'الرياض' : 'Riyadh'}
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-4 border-t md:border-t-0 md:border-l md:rtl:border-r md:rtl:border-l-0 border-slate-200 pt-4 md:pt-0 md:pl-6 md:rtl:pr-6 md:rtl:pl-0">
            <div>
              <div className="text-[11px] text-slate-400">{isAr ? 'إجمالي الأرباح' : 'Earnings'}</div>
              <div className="text-lg font-black text-slate-900 tabular-nums">
                {totalEarningsSAR}{' '}
                <span className="text-xs font-semibold text-emerald-800">{isAr ? 'ر.س' : 'SAR'}</span>
              </div>
            </div>
            <div>
              <div className="text-[11px] text-slate-400">{isAr ? 'الطلبات المنجزة' : 'Jobs Done'}</div>
              <div className="text-lg font-black text-slate-900 tabular-nums">
                {completedJobs.length + 12}
              </div>
            </div>
            <div>
              <div className="text-[11px] text-slate-400">{isAr ? 'تقييم العملاء' : 'Rating'}</div>
              <div className="text-lg font-black text-amber-600 tabular-nums">
                4.95 ★
              </div>
            </div>

            <div className="col-span-3 sm:col-span-1 border-t sm:border-t-0 pt-2 sm:pt-0 flex items-center">
              <button
                onClick={() => setIsNotificationCenterOpen(true)}
                className="w-full py-1.5 px-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                title={isAr ? 'تنبيهات المواعيد والطلبات الجديدة' : 'View Dispatch Notifications'}
              >
                <Bell className="w-3.5 h-3.5 text-emerald-700" />
                <span>{isAr ? 'إشعارات المواعيد' : 'Alerts'}</span>
                {unreadCount > 0 && (
                  <span className="bg-emerald-800 text-white rounded-full text-[10px] px-1.5 py-0.2">
                    {unreadCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Portal Feature Sub-Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <button
            onClick={() => setPortalTab('orders')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors flex items-center gap-2 ${
              portalTab === 'orders'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
            }`}
          >
            <ListOrdered className="w-3.5 h-3.5" />
            <span>{isAr ? 'المهام والزيارات الميدانية' : 'Dispatched Work Orders'}</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20 font-mono">
              {bookings.length}
            </span>
          </button>

          <button
            onClick={() => setPortalTab('schedule')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors flex items-center gap-2 ${
              portalTab === 'schedule'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>{isAr ? 'إدارة الجدول والمناوبات' : 'Weekly Schedule & Shifts'}</span>
          </button>

          <button
            onClick={() => setPortalTab('quotes')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors flex items-center gap-2 ${
              portalTab === 'quotes'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{isAr ? 'سوق المناقصات (العروض)' : 'RFQ Marketplace Bids'}</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20 font-mono">
              {quotes.length}
            </span>
          </button>
        </div>

        {/* Tab 1: Orders Queue */}
        {portalTab === 'orders' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {isAr ? 'قائمة المواعيد المجدولة والتنفيذ المباشر' : 'Active Appointments Queue'}
                </h3>
                <p className="text-xs text-slate-500">
                  {isAr
                    ? 'حدث حالة العمل لحظياً، وتواصل مع العميل لتأكيد الوصول في الوقت المحدد.'
                    : 'Update order stages in real time and communicate arrival with client.'}
                </p>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 self-start sm:self-auto">
                <button
                  onClick={() => setFilterStatus('all')}
                  className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                    filterStatus === 'all'
                      ? 'bg-emerald-800 text-white font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {isAr ? 'الكل' : 'All'}
                </button>
                <button
                  onClick={() => setFilterStatus('confirmed')}
                  className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                    filterStatus === 'confirmed'
                      ? 'bg-emerald-800 text-white font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {isAr ? 'مؤكدة' : 'Confirmed'}
                </button>
                <button
                  onClick={() => setFilterStatus('completed')}
                  className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                    filterStatus === 'completed'
                      ? 'bg-emerald-800 text-white font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {isAr ? 'منجزة' : 'Done'}
                </button>
              </div>
            </div>

            {/* Bookings Card List */}
            <div className="space-y-3">
              {filteredBookings.length === 0 ? (
                <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 text-sm">
                  {isAr ? 'لا توجد مهام في هذه الفئة حالياً.' : 'No dispatched orders in this filter.'}
                </div>
              ) : (
                filteredBookings.map((b) => {
                  const badge = getStatusBadge(b.status);

                  return (
                    <div
                      key={b.id}
                      className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5 hover:border-slate-300 transition-all"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-slate-400">
                            #{b.id}
                          </span>
                          <span className={`text-xs font-bold px-2.5 py-0.5 rounded-md ${badge.className}`}>
                            {badge.label}
                          </span>
                          <span className="text-xs text-slate-500 font-mono">
                            {b.date} · {b.timeSlot}
                          </span>
                        </div>

                        <h4 className="text-base font-bold text-slate-900">
                          {isAr ? b.serviceTitleAr : b.serviceTitleEn}
                        </h4>

                        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            <span>{b.addressCity} - {b.addressDistrict}</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            <span className="font-mono">055-123-4567 ({b.customerName})</span>
                          </span>
                          <span className="text-emerald-800 font-semibold font-mono">
                            {b.paymentMethod.toUpperCase()} (مسدد PAID)
                          </span>
                        </div>

                        {b.notes && (
                          <p className="text-xs text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100 max-w-xl">
                            <span className="font-semibold text-slate-700">{isAr ? 'ملاحظة العميل:' : 'Customer note:'}</span> {b.notes}
                          </p>
                        )}
                      </div>

                      {/* Operational Action Stepper */}
                      <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                        <div className="text-right rtl:text-left mr-3 rtl:mr-0 rtl:ml-3">
                          <div className="text-xs text-slate-400">{isAr ? 'مستحقات الطلب' : 'Job Payout'}</div>
                          <div className="text-base font-black text-slate-900 tabular-nums">
                            {b.totalSAR} <span className="text-xs text-emerald-800">SAR</span>
                          </div>
                        </div>

                        {b.status === 'confirmed' && (
                          <button
                            onClick={() => updateBookingStatus(b.id, 'in_progress')}
                            className="px-3.5 py-2 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-xl transition-colors flex items-center gap-1.5"
                          >
                            <Truck className="w-3.5 h-3.5" />
                            <span>{isAr ? 'في الطريق / بدء الفحص' : 'En Route / Start'}</span>
                          </button>
                        )}

                        {b.status === 'in_progress' && (
                          <button
                            onClick={() => updateBookingStatus(b.id, 'completed')}
                            className="px-3.5 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl transition-colors flex items-center gap-1.5"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>{isAr ? 'إتمام وتسليم العميل' : 'Mark Completed'}</span>
                          </button>
                        )}

                        {b.status === 'completed' && (
                          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
                            {isAr ? 'تم إيداع المبلغ' : 'Funds Settled'}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Provider Schedule Manager Component */}
        {portalTab === 'schedule' && <ProviderScheduleManager />}

        {/* Tab 3: Quotes Quick Link */}
        {portalTab === 'quotes' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-base font-bold text-slate-900">
                  {isAr ? 'مشاريع وطلبات التسعير المتاحة للتنافس' : 'Open RFQ Projects Available for Bids'}
                </h4>
                <p className="text-xs text-slate-500">
                  {isAr ? 'قدم عروض أسعار منافسة للفوز بعقود صيانة الفلل والشقق.' : 'Submit competitive bids to win project contracts.'}
                </p>
              </div>
              <button
                onClick={() => setActiveTab('quotes')}
                className="px-4 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl transition-colors"
              >
                {isAr ? 'الانتقال إلى سوق المناقصات' : 'Go to Bidding Hub'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
