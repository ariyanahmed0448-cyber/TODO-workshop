import React, { useState } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { MarketplaceService, ServiceCategory } from '../types';
import { Star, Clock, Check, ArrowRight, ArrowLeft } from 'lucide-react';

export const ServicesGrid: React.FC = () => {
  const {
    language,
    services,
    searchFilter,
    setSelectedServiceForBooking,
    setIsBookingModalOpen,
  } = useMarketplace();

  const [activeCategory, setActiveCategory] = useState<string>('all');

  const isAr = language === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  const categories = [
    { id: 'all', nameAr: 'جميع الخدمات', nameEn: 'All Services' },
    { id: 'ac', nameAr: 'تكييف وتبريد', nameEn: 'Air Conditioning' },
    { id: 'cleaning', nameAr: 'نظافة وتطهير', nameEn: 'Deep Cleaning' },
    { id: 'plumbing', nameAr: 'سباكة وكشف تسربات', nameEn: 'Plumbing & Leaks' },
    { id: 'electrical', nameAr: 'كهرباء وقواطع SASO', nameEn: 'Electrical & Panels' },
  ];

  const filteredServices = services.filter((srv) => {
    const matchesCategory = activeCategory === 'all' || srv.category === activeCategory;
    const matchesSearch =
      !searchFilter ||
      srv.titleEn.toLowerCase().includes(searchFilter.toLowerCase()) ||
      srv.titleAr.includes(searchFilter) ||
      srv.descriptionEn.toLowerCase().includes(searchFilter.toLowerCase()) ||
      srv.descriptionAr.includes(searchFilter);
    return matchesCategory && matchesSearch;
  });

  const handleBookClick = (service: MarketplaceService) => {
    setSelectedServiceForBooking(service);
    setIsBookingModalOpen(true);
  };

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Header & Interactive Filter Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-semibold text-emerald-800 tracking-wider uppercase mb-1">
              {isAr ? 'قائمة الخدمات المعتمدة' : 'VERIFIED SERVICE CATALOG'}
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {isAr ? 'اختر الخدمة واحجز موعدك فوراً' : 'Select Service & Book Instantly'}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {isAr
                ? 'أسعار واضحة بالريال السعودي، فنيون معتمدون، ومواد مطابقة للمواصفات الصحية.'
                : 'Transparent SAR pricing, certified technicians, and health-compliant materials.'}
            </p>
          </div>

          {/* Category Filter Tabs (Interactive segmented buttons) */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-xl self-start md:self-auto">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                  activeCategory === cat.id
                    ? 'bg-white text-slate-950 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {isAr ? cat.nameAr : cat.nameEn}
              </button>
            ))}
          </div>
        </div>

        {/* 3-Column Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredServices.map((service) => {
            const title = isAr ? service.titleAr : service.titleEn;
            const desc = isAr ? service.descriptionAr : service.descriptionEn;
            const unit = isAr ? service.pricingUnitAr : service.pricingUnitEn;
            const features = isAr ? service.featuresAr : service.featuresEn;

            return (
              <div
                key={service.id}
                className="group flex flex-col bg-white rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all overflow-hidden"
              >
                {/* Service Image (65% height, aspect 4:3) */}
                <div className="relative aspect-4/3 bg-slate-100 overflow-hidden">
                  <img
                    src={service.image}
                    alt={title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 rtl:left-auto rtl:right-3 bg-white/95 backdrop-blur px-2.5 py-1 rounded-md text-xs font-semibold text-slate-900 shadow-xs flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                    <span className="tabular-nums">{service.rating}</span>
                    <span className="text-slate-400 font-normal">({service.reviewCount})</span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    {/* Unboxed Metadata (Zero-pill discipline) */}
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span>{service.category.toUpperCase()}</span>
                      <span aria-hidden="true">·</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span className="tabular-nums">{service.durationMinutes}</span>
                        <span>{isAr ? 'دقيقة' : 'min'}</span>
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="text-emerald-700 font-medium">{isAr ? 'فني مرخص' : 'Verified'}</span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 leading-snug group-hover:text-emerald-800 transition-colors">
                      {title}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {desc}
                    </p>
                  </div>

                  {/* Feature Checklist */}
                  <ul className="space-y-1 text-xs text-slate-600 border-t border-slate-100 pt-3">
                    {features.slice(0, 3).map((f, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                        <span className="truncate">{f}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Price & Primary CTA Module */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3">
                    <div>
                      <div className="text-xs text-slate-400">{isAr ? 'السعر يبدأ من' : 'Starting from'}</div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-xl font-extrabold text-slate-950 tabular-nums">
                          {service.basePriceSAR}
                        </span>
                        <span className="text-xs font-semibold text-emerald-800">
                          {isAr ? 'ر.س' : 'SAR'}
                        </span>
                        <span className="text-xs text-slate-500 font-normal">/ {unit}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleBookClick(service)}
                      className="px-4 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
                    >
                      <span>{isAr ? 'احجز الآن' : 'Book Now'}</span>
                      <ArrowIcon className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
