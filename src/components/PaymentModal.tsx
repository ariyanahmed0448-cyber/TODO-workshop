import React, { useState } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { SaudiPaymentMethod, Booking, ZatcaInvoice } from '../types';
import {
  X,
  ShieldCheck,
  Lock,
  Smartphone,
  CreditCard,
  Check,
  Loader2,
  Award,
  Sparkles,
} from 'lucide-react';

export const PaymentModal: React.FC = () => {
  const {
    language,
    isPaymentModalOpen,
    setIsPaymentModalOpen,
    pendingBookingData,
    createBooking,
    loyaltyProfile,
  } = useMarketplace();

  const isAr = language === 'ar';

  const [selectedMethod, setSelectedMethod] = useState<SaudiPaymentMethod>('mada');
  const [cardNumber, setCardNumber] = useState('5888 4500 1234 5678');
  const [expiry, setExpiry] = useState('08/29');
  const [cvv, setCvv] = useState('321');
  const [cardHolder, setCardHolder] = useState('ABDULLAH ALSALEM');
  const [stcPhone, setStcPhone] = useState('0551234567');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showOtpScreen, setShowOtpScreen] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState('');

  // Loyalty Redemption Controls
  const [useLoyaltyPoints, setUseLoyaltyPoints] = useState(false);
  const maxRedeemablePoints = Math.min(
    loyaltyProfile.pointsBalance,
    // Maximum 50% discount of the order value (10 pts = 1 SAR)
    Math.floor(((pendingBookingData?.totalSAR || 140) * 0.5) * 10)
  );
  const [pointsToRedeem, setPointsToRedeem] = useState<number>(
    Math.min(100, maxRedeemablePoints)
  );

  if (!isPaymentModalOpen || !pendingBookingData) return null;

  const originalTotalSAR = pendingBookingData.totalSAR || 140;
  const pointsDiscountSAR = useLoyaltyPoints ? Math.round((pointsToRedeem / 10) * 100) / 100 : 0;
  const netTotalSAR = Math.max(1, originalTotalSAR - pointsDiscountSAR);
  const willEarnPoints = Math.round(netTotalSAR * loyaltyProfile.earningMultiplier);

  const handlePaySubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if ((selectedMethod === 'mada' || selectedMethod === 'stc_pay') && !showOtpScreen) {
      setShowOtpScreen(true);
      return;
    }

    setIsProcessing(true);

    let resData: any = null;
    try {
      const response = await fetch('/api/payment/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          method: selectedMethod,
          amountSAR: netTotalSAR,
          customerName: pendingBookingData.customerName,
          phone: stcPhone,
          serviceTitle: pendingBookingData.serviceTitleEn,
        }),
      });

      if (response.ok) {
        resData = await response.json();
      }
    } catch (err) {
      console.warn('Payment API unavailable, proceeding with local ZATCA compliance simulation:', err);
    } finally {
      setIsProcessing(false);
    }

    const baseAmount = netTotalSAR;
    const subtotal = Math.round((baseAmount / 1.15) * 100) / 100;
    const vatAmount = Math.round((baseAmount - subtotal) * 100) / 100;
    const invNum = resData?.invoiceNumber || `MUTQ-${Date.now().toString().slice(-8)}`;
    const qrPayload = resData?.zatcaQrPayload || btoa(
      JSON.stringify({
        seller: 'Mutqin Marketplace for Services LLC',
        vatNumber: '310984920100003',
        timestamp: new Date().toISOString(),
        total: baseAmount.toFixed(2),
        vat: vatAmount.toFixed(2),
        invoice: invNum,
      })
    );

    const booking: Booking = {
      id: pendingBookingData.id || `MUTQ-${Date.now().toString().slice(-6)}`,
      customerId: pendingBookingData.customerId || 'cust-demo',
      customerName: pendingBookingData.customerName || 'عبدالله السالم',
      serviceId: pendingBookingData.serviceId || 'srv-ac-deep',
      serviceTitleEn: pendingBookingData.serviceTitleEn || 'Maintenance Service',
      serviceTitleAr: pendingBookingData.serviceTitleAr || 'خدمة صيانة',
      status: 'confirmed',
      date: pendingBookingData.date || '2026-10-15',
      timeSlot: pendingBookingData.timeSlot || '16:00 - 18:00',
      addressCity: pendingBookingData.addressCity || 'الرياض',
      addressDistrict: pendingBookingData.addressDistrict || 'حي النخيل',
      notes: pendingBookingData.notes,
      totalSAR: netTotalSAR,
      paymentMethod: selectedMethod,
      paymentStatus: 'paid',
      zatcaInvoiceNo: invNum,
      technicianName: isAr ? 'م. فيصل العتيبي' : 'Eng. Faisal Al-Otaibi',
      createdAt: new Date().toISOString().split('T')[0],
    };

    const invoice: ZatcaInvoice = {
      invoiceNumber: invNum,
      issueDate: new Date().toISOString(),
      sellerName: 'مؤسسة إتقان للخدمات المنزلية المحدودة (Mutqin LLC)',
      vatRegistrationNumber: '310984920100003',
      crNumber: resData?.merchantCR || '1010892341',
      customerName: pendingBookingData.customerName || 'عبدالله السالم',
      serviceTitle: isAr ? pendingBookingData.serviceTitleAr! : pendingBookingData.serviceTitleEn!,
      subtotalSAR: resData?.subtotalSAR ?? subtotal,
      vatRate: 0.15,
      vatAmountSAR: resData?.vatAmountSAR ?? vatAmount,
      totalSAR: resData?.amountSAR ?? baseAmount,
      paymentMethod: selectedMethod,
      qrPayload: qrPayload,
    };

    setIsPaymentModalOpen(false);
    setShowOtpScreen(false);
    createBooking(booking, invoice, useLoyaltyPoints ? pointsToRedeem : 0);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full max-h-[92vh] overflow-y-auto">
        {/* Payment Modal Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-800" />
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {isAr ? 'بوابة الدفع الإلكتروني المعتمدة' : 'Secure Saudi Payment Gateway'}
              </h3>
              <p className="text-xs text-slate-500">
                {isAr ? 'مشفرة بنظام 256-bit SSL وفق متطلبات البنك المركزي السعودي' : 'SAMA compliant 256-bit encrypted checkout'}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setIsPaymentModalOpen(false);
              setShowOtpScreen(false);
            }}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3D-Secure Verification View */}
        {showOtpScreen ? (
          <form onSubmit={handlePaySubmit} className="p-6 space-y-5">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-800">
                <Smartphone className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900">
                {isAr ? 'التحقق الثنائي عبر مدى / نفاذ (3D Secure)' : 'Saudi 3D-Secure Verification'}
              </h4>
              <p className="text-xs text-slate-600">
                {isAr
                  ? `أدخل رمز التحقق المرسل إلى هاتفك المرتبط بحسابك البنكي لإتمام خصم ${netTotalSAR} ر.س:`
                  : `Enter the SMS OTP code sent to your registered Saudi phone number for ${netTotalSAR} SAR:`}
              </p>
            </div>

            <div className="max-w-xs mx-auto">
              <input
                type="text"
                value={enteredOtp}
                onChange={(e) => setEnteredOtp(e.target.value)}
                placeholder="4829"
                maxLength={6}
                className="w-full text-center tracking-widest text-2xl font-bold font-mono py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-800"
                required
              />
              <p className="text-xs text-center text-slate-400 mt-1">
                {isAr ? 'رمز الاختبار الافتراضي: 4829' : 'Demo OTP code: 4829'}
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowOtpScreen(false)}
                className="flex-1 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                {isAr ? 'تغيير وسيلة الدفع' : 'Change Method'}
              </button>
              <button
                type="submit"
                disabled={isProcessing}
                className="flex-1 py-2.5 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs"
              >
                {isProcessing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <span>{isAr ? 'تأكيد السداد' : 'Confirm Payment'}</span>
                )}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handlePaySubmit} className="p-6 space-y-6">
            {/* Amount Banner with Points Breakdown */}
            <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-emerald-900 font-medium block">
                    {isAr ? 'المبلغ المستحق للدفع:' : 'Total Amount to Pay:'}
                  </span>
                  <div className="text-2xl font-black text-emerald-950 tabular-nums">
                    {netTotalSAR}{' '}
                    <span className="text-xs font-bold text-emerald-800">{isAr ? 'ر.س' : 'SAR'}</span>
                  </div>
                </div>

                <div className="text-right rtl:text-left text-xs text-emerald-900">
                  {pointsDiscountSAR > 0 && (
                    <span className="text-amber-800 font-bold block">
                      {isAr ? `خصم النقاط: -${pointsDiscountSAR} ر.س` : `Points Discount: -${pointsDiscountSAR} SAR`}
                    </span>
                  )}
                  <span className="text-slate-500 font-mono text-[11px]">
                    {isAr ? 'شامل ضريبة 15% ZATCA' : 'Includes 15% VAT'}
                  </span>
                </div>
              </div>

              {/* Earn Points Foresight Tag */}
              <div className="pt-2 border-t border-emerald-200/60 flex items-center justify-between text-xs text-emerald-800 font-semibold">
                <span className="flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{isAr ? 'ستكسب من هذا الطلب:' : 'You will earn on this order:'}</span>
                </span>
                <span className="tabular-nums font-bold">
                  +{willEarnPoints} {isAr ? 'نقطة مُتقَن' : 'Mutqin Points'}
                </span>
              </div>
            </div>

            {/* Mutqin Points Redemption Module */}
            <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={useLoyaltyPoints}
                    onChange={(e) => setUseLoyaltyPoints(e.target.checked)}
                    className="w-4 h-4 text-emerald-800 rounded focus:ring-emerald-800 border-slate-300"
                  />
                  <span className="text-xs font-bold text-slate-900">
                    {isAr ? 'استبدال نقاط مُتقَن للحصول على خصم' : 'Redeem Mutqin Points for Discount'}
                  </span>
                </label>

                <span className="text-xs font-mono font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-md">
                  {loyaltyProfile.pointsBalance} {isAr ? 'نقطة متاحة' : 'pts'}
                </span>
              </div>

              {useLoyaltyPoints && (
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span>
                      {isAr
                        ? `النقاط المراد استبدالها (10 نقاط = 1 ر.س):`
                        : `Points to redeem (10 pts = 1 SAR):`}
                    </span>
                    <span className="font-bold text-slate-900 font-mono">
                      {pointsToRedeem} {isAr ? 'نقطة' : 'pts'} (={pointsDiscountSAR} SAR)
                    </span>
                  </div>

                  {/* Preset Buttons */}
                  <div className="flex items-center gap-1.5 pt-1">
                    <button
                      type="button"
                      onClick={() => setPointsToRedeem(Math.min(100, maxRedeemablePoints))}
                      className="px-2.5 py-1 text-xs bg-white hover:bg-slate-100 border border-slate-200 rounded-md font-semibold text-slate-700"
                    >
                      100 {isAr ? 'نقطة' : 'pts'} (-10 SAR)
                    </button>
                    {maxRedeemablePoints >= 200 && (
                      <button
                        type="button"
                        onClick={() => setPointsToRedeem(Math.min(200, maxRedeemablePoints))}
                        className="px-2.5 py-1 text-xs bg-white hover:bg-slate-100 border border-slate-200 rounded-md font-semibold text-slate-700"
                      >
                        200 {isAr ? 'نقطة' : 'pts'} (-20 SAR)
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setPointsToRedeem(maxRedeemablePoints)}
                      className="px-2.5 py-1 text-xs bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded-md font-bold text-amber-900"
                    >
                      {isAr ? 'أقصى خصم' : 'Max Discount'} ({maxRedeemablePoints} pts)
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Payment Method Selector Tabs */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase">
                {isAr ? 'اختر طريقة الدفع' : 'Select Payment Method'}
              </label>
              <div className="grid grid-cols-4 gap-2">
                {/* Mada */}
                <button
                  type="button"
                  onClick={() => setSelectedMethod('mada')}
                  className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                    selectedMethod === 'mada'
                      ? 'border-emerald-800 bg-emerald-50/50 ring-2 ring-emerald-800 text-emerald-950 font-bold'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="text-xs font-extrabold text-blue-900 tracking-tight">مدى mada</div>
                  <span className="text-[10px] text-slate-500 font-medium">{isAr ? 'بطاقة مدى' : 'Debit'}</span>
                </button>

                {/* Apple Pay */}
                <button
                  type="button"
                  onClick={() => setSelectedMethod('apple_pay')}
                  className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                    selectedMethod === 'apple_pay'
                      ? 'border-emerald-800 bg-emerald-50/50 ring-2 ring-emerald-800 text-emerald-950 font-bold'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="text-xs font-bold text-black flex items-center justify-center">Pay</div>
                  <span className="text-[10px] text-slate-500 font-medium">{isAr ? 'أبل باي' : 'Apple Pay'}</span>
                </button>

                {/* STC Pay */}
                <button
                  type="button"
                  onClick={() => setSelectedMethod('stc_pay')}
                  className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                    selectedMethod === 'stc_pay'
                      ? 'border-purple-800 bg-purple-50 ring-2 ring-purple-800 text-purple-950 font-bold'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="text-xs font-extrabold text-purple-800">stc pay</div>
                  <span className="text-[10px] text-slate-500 font-medium">{isAr ? 'محفظة رقمية' : 'Wallet'}</span>
                </button>

                {/* Credit Card */}
                <button
                  type="button"
                  onClick={() => setSelectedMethod('credit_card')}
                  className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                    selectedMethod === 'credit_card'
                      ? 'border-emerald-800 bg-emerald-50/50 ring-2 ring-emerald-800 text-emerald-950 font-bold'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-slate-700" />
                  <span className="text-[10px] text-slate-500 font-medium">{isAr ? 'فيزا/ماستر' : 'Cards'}</span>
                </button>
              </div>
            </div>

            {/* Sub-form inputs */}
            {selectedMethod === 'apple_pay' ? (
              <div className="p-6 bg-slate-900 text-white rounded-xl text-center space-y-3">
                <div className="text-2xl font-semibold">Pay</div>
                <p className="text-xs text-slate-300">
                  {isAr
                    ? 'اضغط زر السداد لإتمام العملية عبر محفظة Apple Pay بمصادقة Face ID'
                    : 'Tap below to authorize payment instantly with Apple Pay Face ID / Touch ID.'}
                </p>
                <div className="text-sm font-bold text-white tabular-nums">
                  {netTotalSAR} SAR
                </div>
              </div>
            ) : selectedMethod === 'stc_pay' ? (
              <div className="space-y-3">
                <label className="block text-xs font-medium text-slate-700">
                  {isAr ? 'رقم جوال STC Pay المسجل:' : 'STC Pay Registered Mobile:'}
                </label>
                <div className="relative">
                  <span className="absolute top-2 left-3 rtl:left-auto rtl:right-3 text-xs font-bold text-slate-400">
                    +966
                  </span>
                  <input
                    type="tel"
                    value={stcPhone}
                    onChange={(e) => setStcPhone(e.target.value)}
                    placeholder="0551234567"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-14 rtl:pl-3 rtl:pr-14 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-700 font-mono"
                    required
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    {isAr ? 'رقم بطاقة مدى / الائتمان' : 'Card Number'}
                  </label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="5888 4500 1234 5678"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-800"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      {isAr ? 'تاريخ الانتهاء (MM/YY)' : 'Expiry'}
                    </label>
                    <input
                      type="text"
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      placeholder="MM/YY"
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-800"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      {isAr ? 'رمز الأمان (CVV)' : 'CVV'}
                    </label>
                    <input
                      type="password"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      placeholder="•••"
                      maxLength={4}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-800"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    {isAr ? 'اسم حامل البطاقة (بالإنجليزية كما بالبطاقة)' : 'Cardholder Name'}
                  </label>
                  <input
                    type="text"
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                    placeholder="ABDULLAH ALSALEM"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-800 uppercase"
                    required
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isProcessing}
              className={`w-full py-3 rounded-xl font-bold text-sm text-white transition-colors flex items-center justify-center gap-2 shadow-xs ${
                selectedMethod === 'apple_pay'
                  ? 'bg-black hover:bg-zinc-800'
                  : selectedMethod === 'stc_pay'
                  ? 'bg-purple-800 hover:bg-purple-900'
                  : 'bg-emerald-800 hover:bg-emerald-900'
              }`}
            >
              {isProcessing ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>
                    {isAr
                      ? `ادفع الآن (${netTotalSAR} ر.س)`
                      : `Pay Now (${netTotalSAR} SAR)`}
                  </span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
