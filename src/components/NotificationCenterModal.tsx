import React, { useState } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import {
  X,
  Bell,
  CheckCircle,
  Calendar,
  DollarSign,
  MessageSquare,
  Smartphone,
  ExternalLink,
  Trash2,
} from 'lucide-react';

export const NotificationCenterModal: React.FC = () => {
  const {
    language,
    role,
    notifications,
    isNotificationCenterOpen,
    setIsNotificationCenterOpen,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    setActiveTab,
  } = useMarketplace();

  const isAr = language === 'ar';
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread'>('all');
  const [smsPreviewMsg, setSmsPreviewMsg] = useState<string | null>(null);

  if (!isNotificationCenterOpen) return null;

  const roleFilteredNotifs = notifications.filter(
    (n) => n.recipientRole === role || n.recipientRole === 'all'
  );

  const displayedNotifs =
    activeFilter === 'unread'
      ? roleFilteredNotifs.filter((n) => !n.isRead)
      : roleFilteredNotifs;

  const handleNotificationClick = (n: typeof notifications[0]) => {
    markNotificationAsRead(n.id);
    if (n.bookingId) {
      if (role === 'technician') {
        setActiveTab('technician_portal');
      } else {
        setActiveTab('my_bookings');
      }
      setIsNotificationCenterOpen(false);
    } else if (n.quoteId) {
      setActiveTab('quotes');
      setIsNotificationCenterOpen(false);
    }
  };

  const handleSimulateSms = (n: typeof notifications[0], e: React.MouseEvent) => {
    e.stopPropagation();
    const sms = isAr
      ? `[رسالة نصية SMS مرسلة عبر بوابة مُتقَن]: ${n.messageAr}`
      : `[Saudi SMS Gateway Dispatch]: ${n.messageEn}`;
    setSmsPreviewMsg(sms);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-800 text-white flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {isAr
                  ? role === 'technician'
                    ? 'مركز إشعارات الفني ومواعيد العمل'
                    : 'مركز إشعارات العميل'
                  : role === 'technician'
                  ? 'Provider Dispatch Notifications'
                  : 'Booking & Order Notifications'}
              </h3>
              <p className="text-xs text-slate-500 font-mono">
                {roleFilteredNotifs.length} {isAr ? 'إشعار في السجل' : 'records in ledger'}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setIsNotificationCenterOpen(false);
              setSmsPreviewMsg(null);
            }}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter & Actions Strip */}
        <div className="px-5 py-2.5 bg-slate-100 border-b border-slate-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1 rounded-md font-semibold transition-colors ${
                activeFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {isAr ? 'الكل' : 'All'}
            </button>
            <button
              onClick={() => setActiveFilter('unread')}
              className={`px-3 py-1 rounded-md font-semibold transition-colors ${
                activeFilter === 'unread'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {isAr ? 'غير المقروءة' : 'Unread'}
            </button>
          </div>

          <button
            onClick={markAllNotificationsAsRead}
            className="text-xs font-bold text-emerald-800 hover:text-emerald-950 underline"
          >
            {isAr ? 'تحديد الكل كمقروء' : 'Mark all as read'}
          </button>
        </div>

        {/* SMS Preview Banner if triggered */}
        {smsPreviewMsg && (
          <div className="p-3.5 bg-emerald-50 border-b border-emerald-200 flex items-start justify-between gap-3 text-xs">
            <div className="space-y-1">
              <span className="font-bold text-emerald-900 flex items-center gap-1">
                <Smartphone className="w-3.5 h-3.5" />
                <span>{isAr ? 'معاينة إشعار الرسالة القصيرة (SMS):' : 'Saudi SMS Gateway Preview:'}</span>
              </span>
              <p className="text-emerald-800 font-mono text-[11px] leading-relaxed">
                {smsPreviewMsg}
              </p>
            </div>
            <button
              onClick={() => setSmsPreviewMsg(null)}
              className="text-emerald-700 hover:text-emerald-950 font-bold text-xs"
            >
              ✕
            </button>
          </div>
        )}

        {/* Notification List Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {displayedNotifs.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              {isAr ? 'لا توجد إشعارات حالياً.' : 'No notifications in this filter.'}
            </div>
          ) : (
            displayedNotifs.map((n) => {
              const title = isAr ? n.titleAr : n.titleEn;
              const msg = isAr ? n.messageAr : n.messageEn;

              return (
                <div
                  key={n.id}
                  onClick={() => handleNotificationClick(n)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                    !n.isRead
                      ? 'bg-emerald-50/60 border-emerald-200 ring-1 ring-emerald-300'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                    {n.type === 'new_booking' ? (
                      <Calendar className="w-4 h-4" />
                    ) : n.type === 'bid_received' ? (
                      <DollarSign className="w-4 h-4" />
                    ) : (
                      <CheckCircle className="w-4 h-4" />
                    )}
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900">{title}</h4>
                      <span className="text-[10px] text-slate-400 font-mono">{n.timestamp}</span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">{msg}</p>

                    <div className="flex items-center gap-3 pt-1">
                      {n.bookingId && (
                        <span className="text-[11px] font-bold text-emerald-800 hover:underline flex items-center gap-1">
                          <span>{isAr ? `عرض الحجز #${n.bookingId}` : `View #${n.bookingId}`}</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={(e) => handleSimulateSms(n, e)}
                        className="text-[11px] font-medium text-slate-500 hover:text-slate-800 flex items-center gap-1"
                      >
                        <Smartphone className="w-3 h-3" />
                        <span>{isAr ? 'معاينة SMS' : 'SMS preview'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>{isAr ? 'تنبيهات فورية متزامنة عبر نفاذ و SMS' : 'Instant synced alerts via SMS & App'}</span>
          <button
            onClick={() => setIsNotificationCenterOpen(false)}
            className="px-3 py-1.5 font-bold text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
          >
            {isAr ? 'إغلاق' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
