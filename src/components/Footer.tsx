import React from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  const { language, setActiveTab } = useMarketplace();
  const isAr = language === 'ar';

  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
          <div className="space-y-3 max-w-sm">
            <div className="flex items-center gap-2 text-white font-extrabold text-lg">
              <span className="text-emerald-400">مُتقَن</span>
              <span className="text-slate-600">|</span>
              <span className="font-semibold text-slate-300">Mutqin</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              {isAr
                ? 'المنصة السعودية الرائدة لربط الملاك والمستأجرين بنخبة الفنيين والشركات المعتمدة في صيانة التكييف، السباكة، الكهرباء، والنظافة البيئية.'
                : 'The premier Saudi marketplace connecting homeowners with verified technicians and licensed contractors for HVAC, plumbing, electrical, and eco-friendly cleaning.'}
            </p>
            <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-mono">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{isAr ? 'مرخص بسجل تجاري رقم 1010892341' : 'Licensed under CR #1010892341'}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div className="space-y-2">
              <div className="font-bold text-white uppercase text-[11px] tracking-wider">
                {isAr ? 'الخدمات' : 'Services'}
              </div>
              <ul className="space-y-1.5 text-xs">
                <li>
                  <button onClick={() => setActiveTab('services')} className="hover:text-white transition-colors">
                    {isAr ? 'غسيل مكيفات سبليت' : 'Split AC Flush'}
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('services')} className="hover:text-white transition-colors">
                    {isAr ? 'نظافة فلل شاملة' : 'Villa Deep Cleaning'}
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('services')} className="hover:text-white transition-colors">
                    {isAr ? 'كشف تسربات المياه' : 'Leak Detection'}
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('services')} className="hover:text-white transition-colors">
                    {isAr ? 'صيانة لوحات الكهرباء' : 'Electrical SASO'}
                  </button>
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <div className="font-bold text-white uppercase text-[11px] tracking-wider">
                {isAr ? 'المنصة' : 'Platform'}
              </div>
              <ul className="space-y-1.5 text-xs">
                <li>
                  <button onClick={() => setActiveTab('quotes')} className="hover:text-white transition-colors">
                    {isAr ? 'سوق المناقصات' : 'Quotes & Bids'}
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('safety_lab')} className="hover:text-white transition-colors">
                    {isAr ? 'مختبر أمان المواد' : 'Chemical Safety Lab'}
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('technician_portal')} className="hover:text-white transition-colors">
                    {isAr ? 'بوابة الفنيين' : 'Provider Hub'}
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('my_bookings')} className="hover:text-white transition-colors">
                    {isAr ? 'فواتير ZATCA' : 'ZATCA Invoices'}
                  </button>
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <div className="font-bold text-white uppercase text-[11px] tracking-wider">
                {isAr ? 'المدن المشمولة' : 'Coverage'}
              </div>
              <ul className="space-y-1.5 text-xs text-slate-400">
                <li>{isAr ? 'الرياض (كافة الأحياء)' : 'Riyadh'}</li>
                <li>{isAr ? 'جدة ومكة المكرمة' : 'Jeddah & Makkah'}</li>
                <li>{isAr ? 'الدمام والخبر' : 'Dammam & Khobar'}</li>
                <li>{isAr ? 'المدينة المنورة' : 'Medina'}</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © 2026 {isAr ? 'منصة مُتقَن لخدمات الصيانة والتشغيل. جميع الحقوق محفوظة.' : 'Mutqin Residential Services Marketplace. All rights reserved.'}
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>{isAr ? 'متوافق مع هيئة الزكاة والضريبة والجمارك (ZATCA)' : 'ZATCA Tax Compliant'}</span>
            <span>·</span>
            <span>{isAr ? 'مدعوم بأنظمة الدفع مدى و Apple Pay و STC Pay' : 'Mada · Apple Pay · STC Pay'}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
