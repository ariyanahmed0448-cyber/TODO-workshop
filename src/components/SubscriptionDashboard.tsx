import React, { useState } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import {
  RecurringVisit,
  UserSubscription,
  ZatcaInvoice,
} from '../types';
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
  ExternalLink,
  ShieldCheck,
  UserCheck,
  Lock,
  Unlock,
  Play,
  Pause,
  ArrowRight,
  Download,
  CalendarCheck2,
  Zap,
  Repeat,
  Layers,
  ChevronRight,
  HelpCircle,
  Building,
  CreditCard,
  Crown,
} from 'lucide-react';

export const SubscriptionDashboard: React.FC = () => {
  const {
    language,
    userSubscriptions,
    activeSubscription,
    rescheduleRecurringVisit,
    skipRecurringVisit,
    toggleTechnicianLock,
    pauseSubscription,
    resumeSubscription,
    cancelSubscription,
    triggerSubscriptionBillingCycle,
    downloadCalendarEvent,
    setActiveInvoice,
    setActiveTab,
    showToast,
  } = useMarketplace();

  const isAr = language === 'ar';

  const [reschedulingVisit, setReschedulingVisit] = useState<{
    subId: string;
    visit: RecurringVisit;
  } | null>(null);
  const [newDate, setNewDate] = useState('2026-10-22');
  const [newSlot, setNewSlot] = useState(STANDARD_TIME_SLOTS[0].labelAr);

  if (!userSubscriptions || userSubscriptions.length === 0) {
    return (
      <div className="text-center py-12 px-4 space-y-4 bg-white rounded-2xl border border-slate-200">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center mx-auto">
          <Repeat className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">
          {isAr ? 'لا توجد اشتراكات صيانة دورية نشطة حالياً' : 'No active recurring subscriptions found'}
        </h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          {isAr
            ? 'اشترك في باقات الرعاية الأسبوعية أو الشهرية واحصل على زيارات مجدولة دورية مع فني معتمد مخصص وتوفير حتى 25%.'
            : 'Subscribe to weekly or monthly maintenance care passes to unlock automated visits, dedicated technicians, and up to 25% savings.'}
        </p>
        <button
          onClick={() => setActiveTab('subscriptions_catalog')}
          className="inline-flex items-center gap-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-md transition-all active:scale-95"
        >
          <span>{isAr ? 'استعراض باقات الصيانة الدورية' : 'Explore Subscription Passes'}</span>
          <ArrowRight className="w-4 h-4 rtl:rotate-180" />
        </button>
      </div>
    );
  }

  const sub = activeSubscription || userSubscriptions[0];

  const handleOpenReschedule = (visit: RecurringVisit) => {
    setReschedulingVisit({ subId: sub.id, visit });
    setNewDate(visit.scheduledDate);
    setNewSlot(visit.timeSlot);
  };

  const handleConfirmReschedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reschedulingVisit) return;
    rescheduleRecurringVisit(reschedulingVisit.subId, reschedulingVisit.visit.id, newDate, newSlot);
    setReschedulingVisit(null);
  };

  const handleViewInvoice = (invoiceItem: (typeof sub.billingHistory)[0]) => {
    const inv: ZatcaInvoice = {
      invoiceNumber: invoiceItem.invoiceNo,
      issueDate: invoiceItem.date,
      sellerName: 'مؤسسة إتقان للخدمات المنزلية المحدودة (Mutqin Care LLC)',
      vatRegistrationNumber: '310984920100003',
      crNumber: '1010892341',
      customerName: 'سعود البلوشي (مشترك مميز)',
      serviceTitle: isAr ? sub.planNameAr : sub.planNameEn,
      subtotalSAR: invoiceItem.subtotalSAR,
      vatRate: 0.15,
      vatAmountSAR: invoiceItem.vatSAR,
      totalSAR: invoiceItem.amountSAR,
      paymentMethod:
        invoiceItem.method === 'mada' ||
        invoiceItem.method === 'credit_card' ||
        invoiceItem.method === 'apple_pay' ||
        invoiceItem.method === 'stc_pay'
          ? invoiceItem.method
          : 'mada',
      qrPayload: invoiceItem.zatcaQrPayload,
    };
    setActiveInvoice(inv);
  };

  // Find next upcoming scheduled visit
  const upcomingVisits = sub.visits.filter(
    (v) => v.status === 'scheduled' || v.status === 'rescheduled'
  );
  const nextVisit = upcomingVisits[0];

  return (
    <div className="space-y-8">
      {/* Top Banner: Active Subscription Details */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 sm:p-6 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-emerald-800 text-white flex items-center justify-center shrink-0 shadow-md">
              <Crown className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-slate-400">
                  #{sub.id}
                </span>
                <span
                  className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                    sub.status === 'active'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : sub.status === 'paused'
                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {sub.status === 'active'
                    ? isAr
                      ? 'نشط ومفعل 🟢'
                      : 'Active 🟢'
                    : sub.status === 'paused'
                    ? isAr
                      ? 'موقوف مؤقتاً ⏸️'
                      : 'Paused ⏸️'
                    : isAr
                    ? 'ملغي'
                    : 'Cancelled'}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-1">
                {isAr ? sub.planNameAr : sub.planNameEn}
              </h2>
            </div>
          </div>

          {/* Action buttons (Pause / Resume / Cancel) */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {sub.status === 'active' ? (
              <button
                onClick={() => pauseSubscription(sub.id)}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded-xl transition-colors"
                title={isAr ? 'إيقاف مؤقت للاشتراك' : 'Pause Subscription'}
              >
                <Pause className="w-3.5 h-3.5" />
                <span>{isAr ? 'إيقاف مؤقت' : 'Pause'}</span>
              </button>
            ) : sub.status === 'paused' ? (
              <button
                onClick={() => resumeSubscription(sub.id)}
                className="flex items-center gap-1.5 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 px-3.5 py-2 rounded-xl transition-colors shadow-xs"
              >
                <Play className="w-3.5 h-3.5" />
                <span>{isAr ? 'استئناف الاشتراك' : 'Resume'}</span>
              </button>
            ) : null}

            {sub.status !== 'cancelled' && (
              <button
                onClick={() => cancelSubscription(sub.id)}
                className="text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-2 rounded-xl transition-colors"
              >
                {isAr ? 'إلغاء التجديد' : 'Cancel'}
              </button>
            )}
          </div>
        </div>

        {/* Subscription Key Metadata Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
            <span className="text-[11px] text-slate-500 block mb-0.5">
              {isAr ? 'التردد الدوري:' : 'Cadence:'}
            </span>
            <span className="font-bold text-slate-900">
              {sub.cadence === 'weekly'
                ? isAr
                  ? 'أسبوعي (4 زيارات/شهر)'
                  : 'Weekly (4 visits/mo)'
                : sub.cadence === 'biweekly'
                ? isAr
                  ? 'نصف شهري (زيارتان/شهر)'
                  : 'Bi-Weekly (2 visits/mo)'
                : isAr
                ? 'شهري (زيارة/شهر)'
                : 'Monthly (1 visit/mo)'}
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
            <span className="text-[11px] text-slate-500 block mb-0.5">
              {isAr ? 'قيمة الدورة الحالية:' : 'Billing Cycle Cost:'}
            </span>
            <span className="font-bold text-slate-900 font-mono">
              {sub.totalPerCycleSAR} {isAr ? 'ر.س' : 'SAR'}
            </span>
            <span className="text-[10px] text-slate-400 block">
              {isAr ? 'شامل ضريبة 15%' : 'Incl. 15% VAT'}
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
            <span className="text-[11px] text-slate-500 block mb-0.5">
              {isAr ? 'طريقة السداد المعتمدة:' : 'Payment Method:'}
            </span>
            <span className="font-bold text-emerald-800 uppercase flex items-center gap-1">
              <CreditCard className="w-3.5 h-3.5 text-emerald-700" />
              <span>{sub.billingMethod === 'mada' ? 'مدى Mada (خصم آلي)' : sub.billingMethod}</span>
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
            <span className="text-[11px] text-slate-500 block mb-0.5">
              {isAr ? 'تاريخ التجديد القادم:' : 'Next Renewal Date:'}
            </span>
            <span className="font-bold text-slate-900 font-mono">
              {sub.nextRenewalDate}
            </span>
            <span className="text-[10px] text-emerald-700 font-semibold block">
              {isAr ? 'تجديد آلي مؤتمت' : 'Auto-Renew'}
            </span>
          </div>
        </div>
      </div>

      {/* Next Upcoming Visit Card */}
      {nextVisit && (
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 text-white rounded-2xl p-5 sm:p-6 shadow-lg border border-emerald-800/40 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="bg-emerald-500 text-slate-950 font-extrabold text-[11px] px-2.5 py-0.5 rounded-full">
                {isAr ? 'الزيارة القادمة المؤكدة 🚀' : 'Next Upcoming Visit 🚀'}
              </span>
              <span className="text-xs text-slate-400">
                {isAr ? `زيارة رقم #${nextVisit.visitNumber}` : `Visit #${nextVisit.visitNumber}`}
              </span>
            </div>

            <div className="text-xs text-slate-300 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>{sub.city} • {sub.district} ({sub.nationalAddressCode || 'KSA'})</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center pt-1">
            <div className="space-y-1.5">
              <h3 className="text-lg font-extrabold text-white">
                {isAr ? nextVisit.serviceTitleAr : nextVisit.serviceTitleEn}
              </h3>
              <div className="flex items-center gap-3 text-xs text-emerald-200 font-mono">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-emerald-400" />
                  <strong className="text-white text-sm">{nextVisit.scheduledDate}</strong>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{nextVisit.timeSlot}</span>
                </span>
              </div>
            </div>

            {/* Assigned Pro Card */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/15 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500 text-slate-950 font-bold flex items-center justify-center text-sm">
                  م
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">
                    {nextVisit.technicianName || 'م. فيصل العتيبي'}
                  </span>
                  <span className="text-[11px] text-emerald-300">
                    {isAr ? 'كبير مهندسي الصيانة • مرخص معتمد' : 'Senior Maintenance Pro • Licensed'}
                  </span>
                </div>
              </div>

              {sub.lockPreferredTechnician && (
                <div className="flex items-center gap-1 text-[11px] text-amber-300 font-bold bg-amber-400/20 px-2 py-0.5 rounded-md border border-amber-400/30">
                  <Lock className="w-3 h-3" />
                  <span>{isAr ? 'مثبت' : 'Locked'}</span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions Strip */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/10">
            <button
              onClick={() => handleOpenReschedule(nextVisit)}
              className="bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs px-3.5 py-2 rounded-xl transition-all shadow-xs flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5 text-emerald-700" />
              <span>{isAr ? 'تعديل موعد الزيارة' : 'Reschedule Visit'}</span>
            </button>

            <button
              onClick={() => skipRecurringVisit(sub.id, nextVisit.id)}
              className="bg-white/10 hover:bg-white/20 text-white font-semibold text-xs px-3.5 py-2 rounded-xl transition-all border border-white/20 flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-300" />
              <span>{isAr ? 'تخطي وترحيل الزيارة للشهر القادم (0 ريال)' : 'Skip & Rollover Visit (0 SAR)'}</span>
            </button>

            <button
              onClick={() => downloadCalendarEvent(nextVisit, sub)}
              className="bg-white/10 hover:bg-white/20 text-white font-semibold text-xs px-3.5 py-2 rounded-xl transition-all border border-white/20 flex items-center gap-1.5"
              title={isAr ? 'إضافة إلى تقويم آبل وجوجل (.ics)' : 'Add to Apple & Google Calendar'}
            >
              <Download className="w-3.5 h-3.5 text-emerald-300" />
              <span>{isAr ? 'مزامنة التقويم (.ics)' : 'Add to Calendar (.ics)'}</span>
            </button>

            <button
              onClick={() => toggleTechnicianLock(sub.id, !sub.lockPreferredTechnician)}
              className="text-xs text-slate-300 hover:text-white px-2.5 py-2 flex items-center gap-1.5 ml-auto rtl:ml-0 rtl:mr-auto"
            >
              {sub.lockPreferredTechnician ? (
                <>
                  <Unlock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{isAr ? 'إلغاء تثبيت الفني (تعيين تلقائي)' : 'Unlock Tech (Auto-Assign)'}</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5 text-amber-300" />
                  <span>{isAr ? 'تثبيت المهندس فيصل لكافة الزيارات' : 'Lock Eng. Faisal'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Generated Visits Roadmap */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <CalendarCheck2 className="w-5 h-5 text-emerald-700" />
              <span>{isAr ? 'جدول الزيارات المؤتمت للدورة الحالية' : 'Automated Visits Roadmap for Current Cycle'}</span>
            </h3>
            <p className="text-xs text-slate-500">
              {isAr ? 'توليد وإسناد تلقائي لمواعيد الصيانة الدورية مع كشف بنود الفحص الفني' : 'All recurring appointments generated with checklist scope'}
            </p>
          </div>

          <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg">
            {sub.visits.length} {isAr ? 'زيارات مجدولة' : 'visits'}
          </span>
        </div>

        <div className="space-y-3">
          {sub.visits.map((visit) => {
            const isCompleted = visit.status === 'completed';
            const isSkipped = visit.status === 'skipped';
            const isRescheduled = visit.status === 'rescheduled';

            return (
              <div
                key={visit.id}
                className={`p-4 rounded-xl border transition-all ${
                  isCompleted
                    ? 'bg-slate-50 border-slate-200'
                    : isSkipped
                    ? 'bg-slate-50/60 border-slate-200/60 opacity-60'
                    : 'bg-white border-slate-200 hover:border-emerald-300 shadow-xs'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono font-bold text-slate-500">
                        #{visit.visitNumber}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900">
                        {isAr ? visit.serviceTitleAr : visit.serviceTitleEn}
                      </h4>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isCompleted
                            ? 'bg-emerald-100 text-emerald-800'
                            : isSkipped
                            ? 'bg-slate-200 text-slate-600'
                            : isRescheduled
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {isCompleted
                          ? isAr
                            ? 'مكتملة بنجاح ✓'
                            : 'Completed ✓'
                          : isSkipped
                          ? isAr
                            ? 'تم التخطي والترحيل ⏭️'
                            : 'Skipped ⏭️'
                          : isRescheduled
                          ? isAr
                            ? 'ميعاد معدل 🗓️'
                            : 'Rescheduled 🗓️'
                          : isAr
                          ? 'مجدولة قادمة ⏳'
                          : 'Scheduled ⏳'}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-mono">
                      <span className="flex items-center gap-1 text-slate-700 font-bold">
                        <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                        <span>{visit.scheduledDate}</span>
                      </span>
                      <span>•</span>
                      <span>{visit.timeSlot}</span>
                      <span>•</span>
                      <span className="text-slate-600">
                        {visit.technicianName || 'م. فيصل العتيبي'}
                      </span>
                    </div>
                  </div>

                  {/* Actions per visit */}
                  <div className="flex items-center gap-2 shrink-0">
                    {!isCompleted && !isSkipped && (
                      <>
                        <button
                          onClick={() => handleOpenReschedule(visit)}
                          className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          {isAr ? 'تغيير الموعد' : 'Reschedule'}
                        </button>
                        <button
                          onClick={() => skipRecurringVisit(sub.id, visit.id)}
                          className="text-xs font-semibold text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          {isAr ? 'تخطي' : 'Skip'}
                        </button>
                      </>
                    )}

                    <button
                      onClick={() => downloadCalendarEvent(visit, sub)}
                      className="p-1.5 text-slate-400 hover:text-emerald-800 rounded-lg hover:bg-slate-100"
                      title={isAr ? 'تنزيل ملف التقويم (.ics)' : 'Download .ics'}
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Visit Checklist */}
                {visit.checklist && visit.checklist.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap gap-2">
                    {visit.checklist.map((item, cIdx) => (
                      <span
                        key={cIdx}
                        className={`text-[11px] px-2 py-0.5 rounded-md flex items-center gap-1 ${
                          item.completed || isCompleted
                            ? 'bg-emerald-50 text-emerald-800 font-medium'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        <CheckCircle2
                          className={`w-3 h-3 ${
                            item.completed || isCompleted ? 'text-emerald-600' : 'text-slate-400'
                          }`}
                        />
                        <span>{isAr ? item.titleAr : item.titleEn}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Section: Recurring Billing & ZATCA Tax Invoices History */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 sm:p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-700" />
              <span>{isAr ? 'فواتير التجديد التلقائي (ZATCA Phase 2)' : 'Recurring Billing & ZATCA Tax Invoices'}</span>
            </h3>
            <p className="text-xs text-slate-500">
              {isAr ? 'فواتير رسمية تصدر تلقائياً مع كل دورة تجديد معتمدة برمز الاستجابة السريع' : 'Official VAT tax invoices automatically generated per renewal cycle'}
            </p>
          </div>

          {/* Test / Simulator Button for Automated Renewal */}
          <button
            onClick={() => triggerSubscriptionBillingCycle(sub.id)}
            className="inline-flex items-center gap-1.5 bg-gradient-to-r from-emerald-800 to-teal-800 hover:from-emerald-900 hover:to-teal-900 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all shadow-xs active:scale-95"
            title={isAr ? 'محاكاة دورة التجديد الشهري وإصدار الفاتورة الضريبية وجدولة الزيارات' : 'Simulate Recurring Billing Cycle'}
          >
            <Zap className="w-3.5 h-3.5 text-amber-300" />
            <span>{isAr ? 'محاكاة دورة التجديد القادمة (توليد فاتورة وجدول جديد)' : 'Simulate Next Billing Cycle'}</span>
          </button>
        </div>

        {/* Invoices List Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left rtl:text-right">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-bold border-y border-slate-200">
                <th className="py-2.5 px-3">{isAr ? 'رقم الفاتورة الضريبية' : 'Invoice Number'}</th>
                <th className="py-2.5 px-3">{isAr ? 'تاريخ الدورة' : 'Cycle Date'}</th>
                <th className="py-2.5 px-3">{isAr ? 'المبلغ غير شامل' : 'Subtotal'}</th>
                <th className="py-2.5 px-3">{isAr ? 'ضريبة 15%' : 'VAT 15%'}</th>
                <th className="py-2.5 px-3">{isAr ? 'الإجمالي (ر.س)' : 'Total (SAR)'}</th>
                <th className="py-2.5 px-3">{isAr ? 'طريقة السداد' : 'Payment Method'}</th>
                <th className="py-2.5 px-3">{isAr ? 'الحالة' : 'Status'}</th>
                <th className="py-2.5 px-3 text-center">{isAr ? 'الفاتورة الضريبية' : 'ZATCA Invoice'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sub.billingHistory.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-emerald-800">{inv.invoiceNo}</td>
                  <td className="py-3 px-3 font-mono text-slate-600">{inv.date}</td>
                  <td className="py-3 px-3 font-mono text-slate-700">{inv.subtotalSAR}</td>
                  <td className="py-3 px-3 font-mono text-slate-700">{inv.vatSAR}</td>
                  <td className="py-3 px-3 font-mono font-bold text-slate-900">{inv.amountSAR}</td>
                  <td className="py-3 px-3 uppercase text-slate-600 font-semibold">{inv.method}</td>
                  <td className="py-3 px-3">
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                      {isAr ? 'مسددة بنجاح ✓' : 'Paid ✓'}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <button
                      onClick={() => handleViewInvoice(inv)}
                      className="inline-flex items-center gap-1 font-bold text-emerald-800 hover:text-emerald-950 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-md transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>{isAr ? 'عرض الفاتورة' : 'View PDF'}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reschedule Visit Modal */}
      {reschedulingVisit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setReschedulingVisit(null)}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
          />

          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 z-10 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-emerald-700" />
                <span>{isAr ? 'إعادة جدولة الزيارة الدورية' : 'Reschedule Recurring Visit'}</span>
              </h3>
              <button
                onClick={() => setReschedulingVisit(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmReschedule} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  {isAr ? 'اختر التاريخ الجديد للزيارة:' : 'New Visit Date:'}
                </label>
                <input
                  type="date"
                  value={newDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold focus:border-emerald-700 focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  {isAr ? 'الفترة الزمنية:' : 'Time Slot:'}
                </label>
                <select
                  value={newSlot}
                  onChange={(e) => setNewSlot(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:border-emerald-700 focus:outline-hidden"
                >
                  {STANDARD_TIME_SLOTS.map((s) => (
                    <option key={s.id} value={isAr ? s.labelAr : s.labelEn}>
                      {isAr ? s.labelAr : s.labelEn}
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-900">
                {isAr
                  ? 'لا توجد أي رسوم إضافية على إعادة الجدولة. يتم تحديث جدول الفني وإرسال تذكير عبر رسائل الجوال تلقائياً.'
                  : 'Zero fees for rescheduling. Technician calendar updates instantly with SMS notice.'}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReschedulingVisit(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  {isAr ? 'تأكيد الموعد الجديد' : 'Confirm New Date'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
