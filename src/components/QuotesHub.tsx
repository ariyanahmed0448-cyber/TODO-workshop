import React, { useState } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { ServiceCategory } from '../types';
import { SAUDI_CITIES } from '../data/mockData';
import { PlusCircle, FileText, CheckCircle2, Star, Clock, Send, ShieldAlert, Award, MapPin } from 'lucide-react';

export const QuotesHub: React.FC = () => {
  const {
    language,
    quotes,
    createQuote,
    submitBid,
    awardBid,
    role,
    selectedCity,
  } = useMarketplace();

  const isAr = language === 'ar';

  const [isPostingNew, setIsPostingNew] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState<ServiceCategory>('ac');
  const [newBudget, setNewBudget] = useState('500 - 900 SAR');
  const [quoteCity, setQuoteCity] = useState(selectedCity);
  const [newDistrict, setNewDistrict] = useState(isAr ? 'حي الياسمين' : 'Al Yasmin');

  // Technician Bidding Drawer State
  const [biddingQuoteId, setBiddingQuoteId] = useState<string | null>(null);
  const [bidPrice, setBidPrice] = useState<number>(650);
  const [bidDays, setBidDays] = useState<number>(1);
  const [bidProposal, setBidProposal] = useState('');

  const handlePostQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim()) return;

    createQuote({
      customerId: 'cust-demo',
      customerName: isAr ? 'سعد الدوسري' : 'Saad Al-Dossari',
      title: newTitle,
      description: newDesc,
      category: newCategory,
      city: quoteCity,
      district: newDistrict,
      budgetRangeSAR: newBudget,
      status: 'open',
    });

    setNewTitle('');
    setNewDesc('');
    setIsPostingNew(false);
  };

  const handleBidSubmit = (quoteId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!bidProposal.trim()) return;

    submitBid(quoteId, {
      quoteId,
      technicianId: 'tech-faisal',
      technicianName: isAr ? 'م. فيصل العتيبي' : 'Eng. Faisal Al-Otaibi',
      technicianRating: 4.95,
      priceSAR: Number(bidPrice),
      estimatedDays: Number(bidDays),
      proposal: bidProposal,
    });

    setBiddingQuoteId(null);
    setBidProposal('');
  };

  return (
    <div className="py-8 sm:py-10 bg-slate-50 min-h-[70vh]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        {/* Header & Post CTA */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold text-emerald-800 tracking-wider uppercase mb-1">
              {isAr ? 'سوق المناقصات والتسعير التنافسي في المملكة' : 'SAUDI QUOTE BIDDING MARKETPLACE'}
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {isAr ? 'عروض أسعار المشاريع المنزلية' : 'Competitive Contractor Bidding'}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {isAr
                ? 'اطرح مشروعك أو صيانة منزلك في أي مدينة بالمملكة واستقبل عروضاً مفصلة من مقاولين وفنيين مرخصين.'
                : 'Post custom project specs across all Saudi cities and receive competitive bids from verified contractors.'}
            </p>
          </div>

          <button
            onClick={() => setIsPostingNew(!isPostingNew)}
            className="px-4 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl transition-colors flex items-center gap-2 self-start sm:self-auto shadow-xs active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{isPostingNew ? (isAr ? 'إلغاء النموذج' : 'Cancel') : (isAr ? 'طلب تسعير جديد' : 'Request a Quote')}</span>
          </button>
        </div>

        {/* New Quote Form Accordion */}
        {isPostingNew && (
          <form
            onSubmit={handlePostQuote}
            className="p-4 sm:p-6 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-4"
          >
            <h3 className="text-base font-bold text-slate-900">
              {isAr ? 'تفاصيل طلب التسعير الجديد' : 'New Project Specifications'}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  {isAr ? 'عنوان الطلب أو المشكلة' : 'Project Title'}
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder={isAr ? 'مثال: تمديد شبكة تصريف مكيفات لفيلا دورين' : 'e.g., HVAC duct replacement'}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-800"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  {isAr ? 'التصنيف' : 'Category'}
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as ServiceCategory)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-800"
                >
                  <option value="ac">{isAr ? 'تكييف وتبريد' : 'Air Conditioning'}</option>
                  <option value="cleaning">{isAr ? 'نظافة وتطهير' : 'Cleaning'}</option>
                  <option value="plumbing">{isAr ? 'سباكة وشبكات مياه' : 'Plumbing'}</option>
                  <option value="electrical">{isAr ? 'كهرباء وقواطع SASO' : 'Electrical'}</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  {isAr ? 'المدينة (كافة مناطق المملكة)' : 'City (All Regions)'}
                </label>
                <select
                  value={quoteCity}
                  onChange={(e) => setQuoteCity(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-800"
                >
                  {SAUDI_CITIES.map((c) => (
                    <option key={c.id} value={isAr ? c.nameAr : c.nameEn}>
                      {isAr ? `${c.nameAr} (${c.regionNameAr})` : `${c.nameEn} (${c.regionNameEn})`}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  {isAr ? 'الحي' : 'District'}
                </label>
                <input
                  type="text"
                  value={newDistrict}
                  onChange={(e) => setNewDistrict(e.target.value)}
                  placeholder={isAr ? 'حي الياسمين' : 'Al Yasmin'}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-800"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  {isAr ? 'الميزانية المتوقعة (ر.س)' : 'Expected Budget Range'}
                </label>
                <input
                  type="text"
                  value={newBudget}
                  onChange={(e) => setNewBudget(e.target.value)}
                  placeholder="500 - 1,000 SAR"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                {isAr ? 'شرح مواصفات العمل بالتفصيل' : 'Detailed Work Description'}
              </label>
              <textarea
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder={isAr ? 'اذكر المشكلة، عدد الغرف، نوع الأنابيب أو الأجهزة...' : 'Describe technical details, room count...'}
                rows={3}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-800"
                required
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsPostingNew(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg transition-colors"
              >
                {isAr ? 'نشر الطلب لتلقي العروض' : 'Post for Bids'}
              </button>
            </div>
          </form>
        )}

        {/* Quotes Feed */}
        <div className="space-y-6">
          {quotes.map((quote) => {
            const isAwarded = quote.status === 'awarded';

            return (
              <div
                key={quote.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4"
              >
                {/* Quote Header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                      <span className="font-semibold text-emerald-800">{quote.category.toUpperCase()}</span>
                      <span aria-hidden="true">·</span>
                      <span>{quote.city} - {quote.district}</span>
                      <span aria-hidden="true">·</span>
                      <span>{quote.createdAt}</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">{quote.title}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {isAr ? 'صاحب الطلب:' : 'Requested by:'} {quote.customerName}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right rtl:text-left">
                      <div className="text-[11px] text-slate-400">{isAr ? 'الميزانية المقدرة' : 'Budget'}</div>
                      <div className="text-sm font-extrabold text-slate-800 font-mono">
                        {quote.budgetRangeSAR}
                      </div>
                    </div>
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-md ${
                        isAwarded
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {isAwarded
                        ? isAr
                          ? 'تم التعميد (في الضمان)'
                          : 'Awarded & Escrowed'
                        : isAr
                        ? 'مفتوح للعروض'
                        : 'Open for Bids'}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-slate-700 leading-relaxed">{quote.description}</p>

                {/* Contractor Bids Section */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-emerald-800" />
                      <span>{isAr ? `العروض المقدمة (${quote.bids.length})` : `Submitted Contractor Bids (${quote.bids.length})`}</span>
                    </span>

                    {!isAwarded && (
                      <button
                        onClick={() => setBiddingQuoteId(quote.id)}
                        className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 underline"
                      >
                        {isAr ? '+ تقديم عرض سعر فني' : '+ Submit Contractor Bid'}
                      </button>
                    )}
                  </div>

                  {quote.bids.length === 0 ? (
                    <div className="text-xs text-slate-400 py-3 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                      {isAr ? 'لم يتم تقديم عروض بعد. كن أول مقاول يضع عرضاً.' : 'No bids submitted yet. Be the first contractor.'}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {quote.bids.map((bid) => {
                        const isThisBidAwarded = quote.awardedBidId === bid.id;

                        return (
                          <div
                            key={bid.id}
                            className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                              isThisBidAwarded
                                ? 'bg-emerald-50/70 border-emerald-300 ring-1 ring-emerald-400'
                                : 'bg-slate-50 border-slate-200'
                            }`}
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-sm text-slate-900">
                                  {bid.technicianName}
                                </span>
                                <div className="flex items-center gap-1 text-xs text-amber-600 font-semibold">
                                  <Star className="w-3 h-3 fill-amber-400" />
                                  <span className="tabular-nums">{bid.technicianRating}</span>
                                </div>
                                <span className="text-xs text-slate-400 font-normal">
                                  · {bid.submittedAt}
                                </span>
                              </div>
                              <p className="text-xs text-slate-600 max-w-xl">{bid.proposal}</p>
                              <div className="text-[11px] text-slate-500 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <span>
                                  {isAr
                                    ? `مدة التنفيذ: ${bid.estimatedDays} يوم`
                                    : `Execution: ${bid.estimatedDays} days`}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 shrink-0">
                              <div className="text-right rtl:text-left">
                                <div className="text-lg font-black text-slate-950 tabular-nums">
                                  {bid.priceSAR}{' '}
                                  <span className="text-xs font-bold text-emerald-800">
                                    {isAr ? 'ر.س' : 'SAR'}
                                  </span>
                                </div>
                              </div>

                              {!isAwarded ? (
                                <button
                                  onClick={() => awardBid(quote.id, bid.id)}
                                  className="px-3.5 py-1.5 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg transition-colors whitespace-nowrap"
                                >
                                  {isAr ? 'قبول وتعزيز الضمان' : 'Accept & Escrow'}
                                </button>
                              ) : isThisBidAwarded ? (
                                <span className="flex items-center gap-1 text-xs font-bold text-emerald-800 bg-white px-2.5 py-1 rounded-md border border-emerald-300">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>{isAr ? 'العرض المعتمد' : 'Awarded'}</span>
                                </span>
                              ) : null}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Submit Bid Inline Form */}
                  {biddingQuoteId === quote.id && (
                    <form
                      onSubmit={(e) => handleBidSubmit(quote.id, e)}
                      className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-xl space-y-3"
                    >
                      <h4 className="text-xs font-bold text-emerald-950 uppercase">
                        {isAr ? 'نموذج تقديم عرض سعر فني' : 'Submit Technical Bid'}
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1">
                            {isAr ? 'قيمة العرض (ر.س شامل الضريبة)' : 'Bid Amount (SAR)'}
                          </label>
                          <input
                            type="number"
                            value={bidPrice}
                            onChange={(e) => setBidPrice(Number(e.target.value))}
                            className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-800 font-mono"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1">
                            {isAr ? 'مدة التنفيذ المتوقعة (أيام)' : 'Estimated Duration (days)'}
                          </label>
                          <input
                            type="number"
                            value={bidDays}
                            onChange={(e) => setBidDays(Number(e.target.value))}
                            min={1}
                            className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-800 font-mono"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                          {isAr ? 'العرض الفني والضمان المقدم' : 'Technical Proposal & Warranty'}
                        </label>
                        <textarea
                          value={bidProposal}
                          onChange={(e) => setBidProposal(e.target.value)}
                          placeholder={isAr ? 'وضح المواد المستخدمة، فترات الضمان، وطريقة العمل...' : 'Detail parts brand, SASO compliance, warranty...'}
                          rows={2}
                          className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-800"
                          required
                        />
                      </div>

                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setBiddingQuoteId(null)}
                          className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-lg"
                        >
                          {isAr ? 'إلغاء' : 'Cancel'}
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-xs"
                        >
                          {isAr ? 'إرسال العرض للعميل' : 'Send Bid'}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
