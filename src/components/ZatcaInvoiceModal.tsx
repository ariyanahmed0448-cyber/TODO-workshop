import React from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { X, CheckCircle, Printer, Download, QrCode } from 'lucide-react';

export const ZatcaInvoiceModal: React.FC = () => {
  const { language, activeInvoice, setActiveInvoice } = useMarketplace();

  if (!activeInvoice) return null;
  const isAr = language === 'ar';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-300 shadow-2xl max-w-xl w-full max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-emerald-50/50">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-800" />
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {isAr ? 'فاتورة ضريبية مبسطة (معتمدة من ZATCA)' : 'Simplified Tax Invoice (ZATCA Compliant)'}
              </h3>
              <p className="text-xs text-slate-500 font-mono">
                {activeInvoice.invoiceNumber}
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveInvoice(null)}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Invoice Printable Sheet */}
        <div className="p-6 space-y-6 text-sm text-slate-800">
          {/* Header Organization Details */}
          <div className="flex items-start justify-between border-b border-slate-200 pb-4">
            <div>
              <h4 className="font-extrabold text-base text-slate-900">
                {activeInvoice.sellerName}
              </h4>
              <div className="text-xs text-slate-600 space-y-0.5 mt-1 font-mono">
                <div>الرقم الضريبي / VAT: {activeInvoice.vatRegistrationNumber}</div>
                <div>السجل التجاري / CR: {activeInvoice.crNumber}</div>
                <div>الرياض، المملكة العربية السعودية</div>
              </div>
            </div>

            {/* QR Code Container (Simulated ZATCA Phase 2 QR) */}
            <div className="p-2 border border-slate-300 rounded-xl bg-white shadow-xs flex flex-col items-center">
              <QrCode className="w-16 h-16 text-slate-900" />
              <span className="text-[9px] text-slate-500 font-mono mt-1">ZATCA QR</span>
            </div>
          </div>

          {/* Customer & Order Metadata */}
          <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div>
              <span className="text-slate-400 block">{isAr ? 'اسم العميل:' : 'Customer:'}</span>
              <span className="font-bold text-slate-800">{activeInvoice.customerName}</span>
            </div>
            <div>
              <span className="text-slate-400 block">{isAr ? 'تاريخ الإصدار:' : 'Date Issued:'}</span>
              <span className="font-mono text-slate-800">
                {new Date(activeInvoice.issueDate).toLocaleString(isAr ? 'ar-SA' : 'en-US')}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block">{isAr ? 'طريقة السداد:' : 'Payment Rail:'}</span>
              <span className="font-bold text-emerald-800 uppercase">
                {activeInvoice.paymentMethod} (مؤكد APPROVED)
              </span>
            </div>
            <div>
              <span className="text-slate-400 block">{isAr ? 'الخدمة:' : 'Item:'}</span>
              <span className="font-semibold text-slate-800">{activeInvoice.serviceTitle}</span>
            </div>
          </div>

          {/* Table Breakdown */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-xs text-left rtl:text-right">
              <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3">{isAr ? 'الوصف' : 'Description'}</th>
                  <th className="p-3 text-center">{isAr ? 'الكمية' : 'Qty'}</th>
                  <th className="p-3 text-right rtl:text-left">{isAr ? 'المبلغ الصافي' : 'Subtotal'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="p-3 font-medium">{activeInvoice.serviceTitle}</td>
                  <td className="p-3 text-center tabular-nums">1</td>
                  <td className="p-3 text-right rtl:text-left tabular-nums font-mono">
                    {activeInvoice.subtotalSAR.toFixed(2)} SAR
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Calculation Ledger */}
          <div className="space-y-1.5 text-xs border-t border-slate-200 pt-3">
            <div className="flex justify-between text-slate-600">
              <span>{isAr ? 'المجموع الخاضع للضريبة (غير شامل):' : 'Taxable Amount (Excl. VAT):'}</span>
              <span className="font-mono tabular-nums">{activeInvoice.subtotalSAR.toFixed(2)} SAR</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>{isAr ? 'ضريبة القيمة المضافة (15%):' : 'VAT Rate (15%):'}</span>
              <span className="font-mono tabular-nums">{activeInvoice.vatAmountSAR.toFixed(2)} SAR</span>
            </div>
            <div className="flex justify-between text-base font-black text-slate-950 border-t border-slate-200 pt-2">
              <span>{isAr ? 'الإجمالي النهائي المستحق:' : 'Total Payable Amount:'}</span>
              <span className="font-mono tabular-nums text-emerald-800">
                {activeInvoice.totalSAR.toFixed(2)} {isAr ? 'ر.س' : 'SAR'}
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-3">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{isAr ? 'طباعة الفاتورة' : 'Print Invoice'}</span>
          </button>
          <button
            onClick={() => setActiveInvoice(null)}
            className="px-4 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg transition-colors"
          >
            {isAr ? 'إغلاق ومتابعة الحجز' : 'Close & View Booking'}
          </button>
        </div>
      </div>
    </div>
  );
};
