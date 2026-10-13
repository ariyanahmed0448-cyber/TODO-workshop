import React, { useState } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { SAUDI_REGIONS, SAUDI_CITIES, INITIAL_TECHNICIANS } from '../data/mockData';
import {
  X,
  MapPin,
  CheckCircle,
  ShieldCheck,
  Search,
  Building2,
  Users,
  Compass,
  Sparkles,
} from 'lucide-react';

export const SaudiCoverageModal: React.FC = () => {
  const {
    isCoverageModalOpen,
    setIsCoverageModalOpen,
    selectedRegion,
    setSelectedRegion,
    selectedCity,
    setSelectedCity,
    language,
    showToast,
  } = useMarketplace();

  const isAr = language === 'ar';
  const [citySearch, setCitySearch] = useState('');

  if (!isCoverageModalOpen) return null;

  // Filter cities by active region tab and search query
  const filteredCities = SAUDI_CITIES.filter((c) => {
    const matchesRegion = selectedRegion === 'all' || c.regionId === selectedRegion;
    const matchesSearch =
      !citySearch ||
      c.nameAr.toLowerCase().includes(citySearch.toLowerCase()) ||
      c.nameEn.toLowerCase().includes(citySearch.toLowerCase()) ||
      c.regionNameAr.includes(citySearch) ||
      c.regionNameEn.toLowerCase().includes(citySearch.toLowerCase()) ||
      c.districtsAr.some((d) => d.includes(citySearch)) ||
      c.districtsEn.some((d) => d.toLowerCase().includes(citySearch.toLowerCase()));

    return matchesRegion && matchesSearch;
  });

  const handleSelectCity = (c: typeof SAUDI_CITIES[0]) => {
    setSelectedRegion(c.regionId);
    const cityName = isAr ? c.nameAr : c.nameEn;
    setSelectedCity(cityName);
    setIsCoverageModalOpen(false);
    showToast(
      isAr
        ? `تم تحديد موقعك في: ${cityName} (${c.regionNameAr}) بنجاح`
        : `Location set to: ${cityName} (${c.regionNameEn}) successfully`
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/65 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-200 bg-white flex items-center justify-between shrink-0">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
              <span className="text-xs font-bold text-emerald-800 tracking-wider uppercase">
                {isAr
                  ? 'المملكة العربية السعودية · 13 منطقة إدارية'
                  : 'KINGDOM OF SAUDI ARABIA · 13 PROVINCES'}
              </span>
            </div>
            <h2 className="text-lg sm:text-2xl font-extrabold text-slate-950">
              {isAr
                ? 'تغطية شاملة لجميع مناطق ومدن المملكة'
                : 'Nationwide Service Coverage Across All Saudi Arabia'}
            </h2>
            <p className="text-xs text-slate-500">
              {isAr
                ? 'فنيون معتمدون، عقود صيانة موثقة، وفواتير زكاة وضريبة في كافة المحافظات والمراكز'
                : 'Verified technicians, licensed service providers, and ZATCA invoices across all regions'}
            </p>
          </div>

          <button
            onClick={() => setIsCoverageModalOpen(false)}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Controls & Search */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 space-y-3 shrink-0">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute top-3 left-3 rtl:left-auto rtl:right-3 pointer-events-none" />
            <input
              type="text"
              value={citySearch}
              onChange={(e) => setCitySearch(e.target.value)}
              placeholder={
                isAr
                  ? 'ابحث باسم المدينة، المحافظة أو الحي (الرياض، جدة، نيوم، أبها، حائل، الدمام...)'
                  : 'Search by city, province, or district (Riyadh, Jeddah, NEOM, Abha, Dammam...)'
              }
              className="w-full bg-white border border-slate-300 rounded-xl pl-9 rtl:pl-3 rtl:pr-9 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-800"
            />
          </div>

          {/* Region Tabs (Horizontal Scroll on Mobile) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {SAUDI_REGIONS.map((r) => {
              const isSelected = selectedRegion === r.id;
              return (
                <button
                  key={r.id}
                  onClick={() => setSelectedRegion(r.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-all font-semibold shrink-0 flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <span>{isAr ? r.nameAr : r.nameEn}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isSelected ? 'bg-emerald-700 text-emerald-100' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {r.citiesCount}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* Summary Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-white border border-slate-200 rounded-xl">
              <span className="text-[11px] text-slate-500 block">{isAr ? 'المناطق الإدارية' : 'Provinces'}</span>
              <span className="text-lg font-black text-emerald-800">13 / 13</span>
              <span className="text-[10px] text-slate-400 block">{isAr ? 'تغطية كاملة 100%' : '100% Coverage'}</span>
            </div>
            <div className="p-3 bg-white border border-slate-200 rounded-xl">
              <span className="text-[11px] text-slate-500 block">{isAr ? 'المدن والمحافظات' : 'Cities & Hubs'}</span>
              <span className="text-lg font-black text-slate-900">{SAUDI_CITIES.length}+</span>
              <span className="text-[10px] text-slate-400 block">{isAr ? 'من الشمال للجنوب' : 'Coast to Coast'}</span>
            </div>
            <div className="p-3 bg-white border border-slate-200 rounded-xl">
              <span className="text-[11px] text-slate-500 block">{isAr ? 'الفنيون المرخصون' : 'Verified Pros'}</span>
              <span className="text-lg font-black text-slate-900">1,240+</span>
              <span className="text-[10px] text-slate-400 block">{isAr ? 'بسجل تجاري معتمد' : 'CR Verified'}</span>
            </div>
            <div className="p-3 bg-white border border-slate-200 rounded-xl">
              <span className="text-[11px] text-slate-500 block">{isAr ? 'سرعة الوصول' : 'Average Arrival'}</span>
              <span className="text-lg font-black text-emerald-800">45-90</span>
              <span className="text-[10px] text-slate-400 block">{isAr ? 'دقيقة في كافة المدن' : 'minutes SLA'}</span>
            </div>
          </div>

          {/* Cities Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-emerald-800" />
                <span>
                  {isAr
                    ? `المدن والمحافظات المتاحة (${filteredCities.length})`
                    : `Available Cities & Centers (${filteredCities.length})`}
                </span>
              </h3>
              <span className="text-xs text-slate-500">
                {isAr ? 'انقر على مدينتك لتفعيل الخدمة' : 'Tap any city to set as active'}
              </span>
            </div>

            {filteredCities.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-200 rounded-xl">
                <Compass className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-700">
                  {isAr ? 'لم يتم العثور على مدينة مطابقة للبحث' : 'No matching city found'}
                </p>
                <button
                  onClick={() => {
                    setCitySearch('');
                    setSelectedRegion('all');
                  }}
                  className="mt-2 text-xs text-emerald-800 font-bold underline"
                >
                  {isAr ? 'عرض جميع المدن' : 'Show all cities'}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredCities.map((city) => {
                  const isCurrent = selectedCity === (isAr ? city.nameAr : city.nameEn);

                  return (
                    <button
                      key={city.id}
                      onClick={() => handleSelectCity(city)}
                      className={`p-3.5 rounded-xl border text-left rtl:text-right transition-all flex flex-col justify-between group ${
                        isCurrent
                          ? 'border-emerald-800 bg-emerald-50/70 shadow-xs ring-2 ring-emerald-800'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-2xs'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-semibold text-emerald-800 uppercase block">
                            {isAr ? city.regionNameAr : city.regionNameEn}
                          </span>
                          <span className="text-sm font-bold text-slate-900 block mt-0.5 group-hover:text-emerald-800 transition-colors">
                            {isAr ? city.nameAr : city.nameEn}
                          </span>
                        </div>
                        {isCurrent && (
                          <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0 mt-1" />
                        )}
                      </div>

                      {/* Districts tags */}
                      <div className="mt-2 pt-2 border-t border-slate-100 flex flex-wrap gap-1">
                        {(isAr ? city.districtsAr : city.districtsEn).slice(0, 3).map((dist, i) => (
                          <span
                            key={i}
                            className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded"
                          >
                            {dist}
                          </span>
                        ))}
                        {(isAr ? city.districtsAr : city.districtsEn).length > 3 && (
                          <span className="text-[10px] text-slate-400 px-1">
                            +{((isAr ? city.districtsAr : city.districtsEn).length - 3)}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Regional Verified Technicians preview */}
          <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-2xl space-y-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-800" />
              <h4 className="text-sm font-bold text-slate-900">
                {isAr
                  ? 'فنيون ومقاولون معتمدون وموزعون جغرافياً في كافة المناطق'
                  : 'Stationed Technicians Across Regions with Instant Dispatch'}
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {INITIAL_TECHNICIANS.map((tech) => (
                <div
                  key={tech.id}
                  className="p-3 bg-white border border-slate-200 rounded-xl space-y-1 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{tech.name}</span>
                    <span className="font-bold text-amber-600">★ {tech.rating}</span>
                  </div>
                  <div className="text-slate-500 text-[11px] flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-emerald-700 shrink-0" />
                    <span className="truncate">{tech.city} ({tech.regionNameAr})</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    {tech.licenseNumber} · {tech.completedJobs} {isAr ? 'مهمة منجزة' : 'jobs'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-600 text-center sm:text-left rtl:sm:text-right">
            <span>{isAr ? 'المدينة النشطة الحالية: ' : 'Active Selected City: '}</span>
            <span className="font-bold text-emerald-800">{selectedCity}</span>
          </div>

          <button
            onClick={() => setIsCoverageModalOpen(false)}
            className="w-full sm:w-auto px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
          >
            {isAr ? 'تأكيد الموقع والمتابعة' : 'Confirm Location & Continue'}
          </button>
        </div>
      </div>
    </div>
  );
};
