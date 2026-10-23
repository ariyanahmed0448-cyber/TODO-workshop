import React, { useState } from 'react';
import { Booking, ServiceReview } from '../types';
import { useMarketplace } from '../context/MarketplaceContext';
import {
  Star,
  X,
  Award,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  ThumbsUp,
  MessageSquare,
  Clock,
  Wrench,
  Leaf,
  Calendar,
  Building2,
} from 'lucide-react';

interface BookingReviewModalProps {
  booking: Booking;
  isOpen: boolean;
  onClose: () => void;
}

export const BookingReviewModal: React.FC<BookingReviewModalProps> = ({
  booking,
  isOpen,
  onClose,
}) => {
  const { language, submitBookingReview } = useMarketplace();
  const isAr = language === 'ar';

  const existingReview = booking.review;

  const [rating, setRating] = useState<number>(existingReview?.rating || 5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [punctualityRating, setPunctualityRating] = useState<number>(existingReview?.punctualityRating || 5);
  const [qualityRating, setQualityRating] = useState<number>(existingReview?.qualityRating || 5);
  const [cleanlinessRating, setCleanlinessRating] = useState<number>(existingReview?.cleanlinessRating || 5);
  const [selectedBadges, setSelectedBadges] = useState<string[]>(
    existingReview?.badges || ['on_time', 'clean_work', 'safe_materials']
  );
  const [comment, setComment] = useState<string>(
    existingReview?.comment ||
      (isAr
        ? 'تجربة ممتازة جداً، الفني فيصل حضر في الموعد تماماً وكان دقيقاً ومحترفاً وأنجز الصيانة بنظافة تامة.'
        : 'Outstanding experience! Eng. Faisal arrived on time, was very professional and thorough.')
  );
  const [isEditing, setIsEditing] = useState<boolean>(!existingReview);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  if (!isOpen) return null;

  const RATING_LABELS_AR: Record<number, string> = {
    5: 'ممتاز جداً - فاق التوقعات ⭐⭐⭐⭐⭐',
    4: 'جيد جداً - خدمة متقنة ⭐⭐⭐⭐',
    3: 'جيد - ملبي للغرض ⭐⭐⭐',
    2: 'مقبول - توجد بعض الملاحظات ⭐⭐',
    1: 'غير راضٍ - يحتاج تحسين شامل ⭐',
  };

  const RATING_LABELS_EN: Record<number, string> = {
    5: 'Exceptional - Exceeded Expectations ⭐⭐⭐⭐⭐',
    4: 'Very Good - High Quality Craftsmanship ⭐⭐⭐⭐',
    3: 'Good - Met Expectations ⭐⭐⭐',
    2: 'Fair - Room for Improvement ⭐⭐',
    1: 'Poor - Unsatisfactory Service ⭐',
  };

  const COMPLIMENT_OPTIONS = [
    { id: 'on_time', labelAr: '⏱️ التزام تام بالموعد المحدد', labelEn: '⏱️ Prompt & On-Time' },
    { id: 'clean_work', labelAr: '🧼 نظافة الموقع بعد العمل', labelEn: '🧼 Pristine Site Cleanup' },
    { id: 'safe_materials', labelAr: '🧪 مواد آمنة ومعتمدة بيئياً', labelEn: '🧪 SASO Safe Materials' },
    { id: 'polite', labelAr: '🤝 لباقة واحترافية عالية', labelEn: '🤝 Courteous & Polite' },
    { id: 'expert_diag', labelAr: '🔧 تشخيص دقيق ومتقن', labelEn: '🔧 Accurate Diagnosis' },
    { id: 'clear_invoice', labelAr: '🧾 وضوح الفاتورة والضمان', labelEn: '🧾 Clear Invoice & Warranty' },
  ];

  const toggleBadge = (badgeId: string) => {
    setSelectedBadges((prev) =>
      prev.includes(badgeId) ? prev.filter((b) => b !== badgeId) : [...prev, badgeId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitBookingReview(booking.id, {
      bookingId: booking.id,
      technicianName: booking.technicianName || 'م. فيصل العتيبي',
      rating,
      punctualityRating,
      qualityRating,
      cleanlinessRating,
      badges: selectedBadges,
      comment: comment.trim(),
    });
    setIsSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 1800);
  };

  const techName = booking.technicianName || (isAr ? 'م. فيصل العتيبي' : 'Eng. Faisal Al-Otaibi');
  const serviceTitle = isAr ? booking.serviceTitleAr : booking.serviceTitleEn;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full p-6 sm:p-7 space-y-5 my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <Star className="w-5 h-5 text-amber-600 fill-amber-500" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {isAr ? 'تقييم تجربة الخدمة والفني' : 'Rate Service & Provider'}
              </h3>
              <p className="text-xs text-slate-500 font-mono">
                {isAr ? 'حجز مكتمل' : 'Completed Booking'} #{booking.id}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Confirmation State */}
        {isSubmitted ? (
          <div className="py-10 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10 text-emerald-700" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xl font-bold text-slate-900">
                {isAr ? 'شكراً لمشاركتك تقييمك القيّم!' : 'Thank You for Your Feedback!'}
              </h4>
              <p className="text-sm text-slate-600 max-w-sm mx-auto">
                {isAr
                  ? 'تم تسجيل تقييمك وإضافته لسجل الفني، كما تمت إضافة +25 نقطة في محفظة مكافآت مُتقَن.'
                  : 'Your review was submitted and +25 Mutqin loyalty points were added to your wallet.'}
              </p>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>{isAr ? '+25 نقطة ولاء مُكتسبة' : '+25 Mutqin Loyalty Points'}</span>
            </div>
          </div>
        ) : !isEditing && existingReview ? (
          /* View Mode for Existing Review */
          <div className="space-y-5">
            <div className="p-4 bg-emerald-50/60 border border-emerald-200/80 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-bold text-base">
                  {techName.split(' ')[0]?.[0]}
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">{techName}</div>
                  <div className="text-xs text-slate-500">{serviceTitle}</div>
                </div>
              </div>
              <div className="flex items-center gap-1 text-amber-500 font-bold text-lg">
                <span>{existingReview.rating}</span>
                <Star className="w-5 h-5 fill-amber-400" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-600 uppercase">
                {isAr ? 'تفاصيل تقييمك' : 'Your Review'}
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-800 space-y-2">
                <p className="leading-relaxed">"{existingReview.comment}"</p>
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {existingReview.badges.map((bId) => {
                    const opt = COMPLIMENT_OPTIONS.find((c) => c.id === bId);
                    return opt ? (
                      <span
                        key={bId}
                        className="px-2.5 py-1 bg-white border border-slate-200 text-slate-700 text-[11px] rounded-lg font-medium"
                      >
                        {isAr ? opt.labelAr : opt.labelEn}
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
            </div>

            {existingReview.technicianReply && (
              <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-2xl text-xs space-y-1">
                <div className="font-bold text-blue-900 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-blue-700" />
                  <span>{isAr ? 'رد المهندس المعتمد:' : 'Technician Response:'}</span>
                </div>
                <p className="text-blue-800">{existingReview.technicianReply}</p>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors border border-emerald-200"
              >
                {isAr ? 'تعديل التقييم' : 'Edit Review'}
              </button>
              <button
                onClick={onClose}
                className="px-5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                {isAr ? 'إغلاق' : 'Close'}
              </button>
            </div>
          </div>
        ) : (
          /* Submission Form */
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Service & Provider Header Banner */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-xs text-slate-500">{isAr ? 'الخدمة المنجزة:' : 'Service:'}</div>
                <div className="text-sm font-bold text-slate-900">{serviceTitle}</div>
                <div className="text-xs text-emerald-800 font-medium">
                  {isAr ? 'الفني:' : 'Technician:'} {techName}
                </div>
              </div>
              <div className="text-right rtl:text-left font-mono text-xs font-bold text-slate-700">
                {booking.totalSAR} {isAr ? 'ر.س' : 'SAR'}
              </div>
            </div>

            {/* Loyalty Points Incentive Banner */}
            <div className="p-3 bg-gradient-to-r from-amber-50 to-emerald-50 border border-amber-200/80 rounded-2xl flex items-center gap-2.5 text-xs text-amber-950 font-medium">
              <Sparkles className="w-5 h-5 text-amber-600 shrink-0" />
              <span>
                {isAr
                  ? 'مكافأة فورية: ستحصل على +25 نقطة في محفظة ولاء مُتقَن بمجرد إرسال تقييمك!'
                  : 'Instant reward: Earn +25 Mutqin points upon submitting your verified review!'}
              </span>
            </div>

            {/* Overall Star Rating */}
            <div className="space-y-2 text-center py-2 bg-slate-50/70 border border-slate-100 rounded-2xl">
              <label className="block text-xs font-bold text-slate-700 uppercase">
                {isAr ? 'التقييم العام لتجربتك' : 'Overall Experience Rating'}
              </label>

              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => {
                  const isFilled = (hoverRating || rating) >= star;
                  return (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 hover:scale-115 transition-transform"
                    >
                      <Star
                        className={`w-9 h-9 ${
                          isFilled
                            ? 'text-amber-500 fill-amber-400 drop-shadow-xs'
                            : 'text-slate-300'
                        } transition-colors`}
                      />
                    </button>
                  );
                })}
              </div>

              <div className="text-xs font-bold text-emerald-900">
                {isAr
                  ? RATING_LABELS_AR[hoverRating || rating]
                  : RATING_LABELS_EN[hoverRating || rating]}
              </div>
            </div>

            {/* Granular Dimension Ratings */}
            <div className="space-y-3 pt-1">
              <label className="block text-xs font-bold text-slate-700 uppercase">
                {isAr ? 'تقييم معايير الجودة الدقيقة' : 'Detailed Performance Metrics'}
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                {/* 1. Punctuality */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800">
                    <Clock className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{isAr ? 'الالتزام بالموعد' : 'Punctuality'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setPunctualityRating(s)}
                        className={`text-sm ${
                          punctualityRating >= s ? 'text-amber-500' : 'text-slate-300'
                        }`}
                      >
                        ★
                      </button>
                    ))}
                    <span className="font-mono font-bold text-slate-700">{punctualityRating}/5</span>
                  </div>
                </div>

                {/* 2. Quality */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800">
                    <Wrench className="w-3.5 h-3.5 text-blue-700" />
                    <span>{isAr ? 'إتقان الصيانة' : 'Craftsmanship'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setQualityRating(s)}
                        className={`text-sm ${
                          qualityRating >= s ? 'text-amber-500' : 'text-slate-300'
                        }`}
                      >
                        ★
                      </button>
                    ))}
                    <span className="font-mono font-bold text-slate-700">{qualityRating}/5</span>
                  </div>
                </div>

                {/* 3. Safety & Cleanliness */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800">
                    <Leaf className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{isAr ? 'النظافة والسلامة' : 'Cleanliness'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setCleanlinessRating(s)}
                        className={`text-sm ${
                          cleanlinessRating >= s ? 'text-amber-500' : 'text-slate-300'
                        }`}
                      >
                        ★
                      </button>
                    ))}
                    <span className="font-mono font-bold text-slate-700">{cleanlinessRating}/5</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Compliment Badges Selection */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase">
                {isAr ? 'ما الذي نال إعجابك في الخدمة؟' : 'What did you appreciate most?'}
              </label>
              <div className="flex flex-wrap gap-2">
                {COMPLIMENT_OPTIONS.map((item) => {
                  const isSelected = selectedBadges.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleBadge(item.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                        isSelected
                          ? 'bg-emerald-800 text-white border-emerald-900 shadow-2xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {isAr ? item.labelAr : item.labelEn}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Written Comment Textarea */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase">
                {isAr ? 'ملاحظاتك ومراجعتك المكتوبة' : 'Your Detailed Feedback'}
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                required
                placeholder={
                  isAr
                    ? 'شاركنا تفاصيل تجربتك مع الفني وجودة المواد المستخدمة لمساعدة باقي العملاء...'
                    : 'Share details of your experience with the technician and workmanship...'
                }
                className="w-full bg-slate-50 border border-slate-300 rounded-2xl p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-800"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl transition-colors shadow-xs flex items-center gap-1.5"
              >
                <Award className="w-4 h-4" />
                <span>{isAr ? 'إرسال التقييم وكسب النقاط' : 'Submit Review & Earn 25 Pts'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
