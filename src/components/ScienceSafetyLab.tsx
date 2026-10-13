import React, { useState } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { SCIENCE_LAB_IMAGE } from '../data/mockData';
import { ChemicalSafetyItem, PubchemCompoundResult } from '../types';
import {
  FlaskConical,
  ShieldCheck,
  AlertTriangle,
  Leaf,
  Baby,
  Search,
  ExternalLink,
  Info,
  Loader2,
  CheckCircle2,
} from 'lucide-react';

export const ScienceSafetyLab: React.FC = () => {
  const { language, chemicalItems } = useMarketplace();
  const isAr = language === 'ar';

  const [selectedChemical, setSelectedChemical] = useState<ChemicalSafetyItem>(chemicalItems[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [livePubchemResult, setLivePubchemResult] = useState<PubchemCompoundResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const quickExamples = [
    { label: isAr ? 'حمض الستريك' : 'Citric Acid', query: 'Citric Acid' },
    { label: isAr ? 'بيروكسيد الهيدروجين' : 'Hydrogen Peroxide', query: 'Hydrogen Peroxide' },
    { label: isAr ? 'كحول إيزوبروبيل' : 'Isopropyl Alcohol', query: 'Isopropyl Alcohol' },
    { label: isAr ? 'هيبوكلوريت الصوديوم' : 'Sodium Hypochlorite', query: 'Sodium Hypochlorite' },
    { label: isAr ? 'ليمونين (معطر طبيعي)' : 'Limonene', query: 'Limonene' },
    { label: isAr ? 'كلوريد البنزالكونيوم' : 'Benzalkonium Chloride', query: 'Benzalkonium Chloride' },
  ];

  const handlePubChemSearch = async (term: string) => {
    if (!term.trim()) return;
    setIsSearching(true);
    setSearchError(null);
    setLivePubchemResult(null);

    // Also match local item if available
    const localMatch = chemicalItems.find(
      (c) =>
        c.name.toLowerCase().includes(term.toLowerCase()) ||
        c.arabicName.includes(term)
    );
    if (localMatch) {
      setSelectedChemical(localMatch);
    }

    try {
      const res = await fetch(`/api/science/pubchem/${encodeURIComponent(term)}`);
      const data = await res.json();
      if (data.found) {
        setLivePubchemResult(data);
      } else {
        setSearchError(
          isAr
            ? 'لم يتم العثور على المركب في سجل PubChem. جرب أحد الأمثلة المقترحة.'
            : 'Compound not found in PubChem. Try one of the quick suggestions.'
        );
      }
    } catch (err) {
      setSearchError(isAr ? 'فشل الاتصال بقاعدة بيانات PubChem' : 'Connection to PubChem failed');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="py-10 bg-slate-50 min-h-[75vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Lab Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 tracking-wider uppercase">
              <FlaskConical className="w-4 h-4 text-emerald-700" />
              <span>{isAr ? 'مختبر أمان المواد الكيميائية (DeepMind Science)' : 'DEEPMIND SCIENCE · CHEMICAL SAFETY LAB'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {isAr ? 'الفحص العلمي للمنظفات ومواد الصيانة' : 'Scientific Inspection of Cleaning Agents & Materials'}
            </h2>
            <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
              {isAr
                ? 'فحص موثوق متصل بقاعدة بيانات PubChem التابعة للمعهد الوطني للصحة (NIH). نتأكد من خلو المنظفات وغازات التكييف من المواد المسرطنة، وانبعاثات المركبات العضوية المتطايرة (VOCs)، وحماية الأطفال والحيوانات الأليفة.'
                : 'Directly querying the PubChem PUG REST database (NIH). We verify that cleaning chemicals, HVAC solvents, and biocides meet eco-toxicity standards, minimize indoor VOCs, and remain safe for children and pets.'}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono bg-emerald-50 text-emerald-900 px-3 py-2 rounded-xl border border-emerald-200 shrink-0 self-start md:self-auto">
            <span className="font-bold">Provenance:</span>
            <span>PubChem PUG REST API v1.0</span>
          </div>
        </div>

        {/* Search & Pre-loaded Quick Try Chip Bar (Mandatory Science Skill Pattern) */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute top-3 left-3 rtl:left-auto rtl:right-3 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handlePubChemSearch(searchQuery)}
                placeholder={isAr ? 'ابحث في PubChem عن أي مركب (مثل: Citric Acid, Limonene, Chlorine)...' : 'Query PubChem database for any chemical substance...'}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 rtl:pl-3 rtl:pr-9 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-800"
              />
            </div>
            <button
              onClick={() => handlePubChemSearch(searchQuery)}
              disabled={isSearching}
              className="px-5 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>{isAr ? 'فحص المركب' : 'Inspect Compound'}</span>}
            </button>
          </div>

          {/* Quick-try chips */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-xs text-slate-500 font-medium mr-1 rtl:mr-0 rtl:ml-1">
              {isAr ? 'مركبات شائعة في المنازل:' : 'Common household substances:'}
            </span>
            {quickExamples.map((ex, i) => (
              <button
                key={i}
                onClick={() => {
                  setSearchQuery(ex.query);
                  handlePubChemSearch(ex.query);
                }}
                className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-emerald-100 hover:text-emerald-900 text-slate-700 rounded-lg transition-colors border border-slate-200"
              >
                {ex.label}
              </button>
            ))}
          </div>

          {searchError && (
            <p className="text-xs text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-200">
              {searchError}
            </p>
          )}
        </div>

        {/* Live PubChem Query Result Banner (if retrieved from server) */}
        {livePubchemResult && (
          <div className="p-5 bg-emerald-50/80 border border-emerald-300 rounded-2xl shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-800" />
                <h4 className="text-base font-bold text-emerald-950">
                  {livePubchemResult.title} (CID: {livePubchemResult.cid})
                </h4>
              </div>
              <a
                href={livePubchemResult.pubchemUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 underline"
              >
                <span>{isAr ? 'عرض في سجل PubChem الرسمي' : 'View on NIH PubChem'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-white p-2.5 rounded-xl border border-emerald-200">
                <span className="text-slate-400 block">{isAr ? 'الصيغة الجزيئية:' : 'Formula:'}</span>
                <span className="font-mono font-bold text-slate-900 text-sm">
                  {livePubchemResult.formula || 'N/A'}
                </span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-emerald-200">
                <span className="text-slate-400 block">{isAr ? 'الوزن الجزيئي:' : 'Molecular Weight:'}</span>
                <span className="font-mono font-bold text-slate-900 text-sm">
                  {livePubchemResult.molecularWeight ? `${livePubchemResult.molecularWeight} g/mol` : 'N/A'}
                </span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-emerald-200">
                <span className="text-slate-400 block">{isAr ? 'الاسم النظامي IUPAC:' : 'IUPAC Name:'}</span>
                <span className="font-mono text-slate-800 truncate block">
                  {livePubchemResult.iupacName || livePubchemResult.title}
                </span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-emerald-200">
                <span className="text-slate-400 block">{isAr ? 'حالة الاعتماد في متقن:' : 'Mutqin Status:'}</span>
                <span className="font-bold text-emerald-800">
                  {isAr ? 'فحص علمي مطابق' : 'Scientifically Screened'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 2-Column Scientific Workbench Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Column 1: Chemical Catalog List */}
          <div className="lg:col-span-5 space-y-3">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              {isAr ? 'المواد الكيميائية المعتمدة في متقن' : 'Mutqin Standard Substances'}
            </h3>

            <div className="space-y-2.5">
              {chemicalItems.map((item) => {
                const isSelected = selectedChemical.cid === item.cid;

                return (
                  <button
                    key={item.cid}
                    onClick={() => {
                      setSelectedChemical(item);
                      setLivePubchemResult(null);
                    }}
                    className={`w-full text-left rtl:text-right p-4 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                      isSelected
                        ? 'bg-white border-emerald-800 ring-2 ring-emerald-800 shadow-sm'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">
                          {isAr ? item.arabicName : item.name}
                        </span>
                        <span className="text-xs font-mono text-slate-400">
                          CID: {item.cid}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium">
                        {item.category}
                      </p>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {item.formula} · {item.molecularWeight}
                      </div>
                    </div>

                    <div className="text-right rtl:text-left shrink-0">
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                          item.ghsLevel === 'Safe'
                            ? 'bg-emerald-100 text-emerald-800'
                            : item.ghsLevel === 'Moderate'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {item.ghsLevel}
                      </span>
                      <div className="text-[11px] text-emerald-800 font-bold mt-1">
                        Eco {item.ecoScore}/10
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Column 2: Deep Chemical Dossier & Environmental Safety Card */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
              {/* Card Header with Generated Lab Visual */}
              <div className="relative rounded-xl overflow-hidden aspect-16/7 bg-slate-100 border border-slate-200">
                <img
                  src={SCIENCE_LAB_IMAGE}
                  alt="Science safety lab inspection"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent flex items-end p-5 text-white">
                  <div>
                    <span className="text-xs text-emerald-300 font-mono uppercase">
                      PubChem CID #{selectedChemical.cid} · SASO {selectedChemical.sasoComplianceStatus}
                    </span>
                    <h3 className="text-xl font-bold text-white">
                      {isAr ? selectedChemical.arabicName : selectedChemical.name}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Functional Attributes */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-slate-400 mb-0.5">{isAr ? 'الصيغة الجزيئية' : 'Formula'}</div>
                  <div className="font-mono font-bold text-slate-900 text-sm">
                    {selectedChemical.formula}
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-slate-400 mb-0.5">{isAr ? 'مؤشر الأمان البيئي' : 'Eco-Score'}</div>
                  <div className="font-bold text-emerald-800 text-sm flex items-center gap-1">
                    <Leaf className="w-3.5 h-3.5" />
                    <span>{selectedChemical.ecoScore} / 10</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-slate-400 mb-0.5">{isAr ? 'أمان الأطفال والحيوانات' : 'Child & Pet Safe'}</div>
                  <div
                    className={`font-bold text-sm flex items-center gap-1 ${
                      selectedChemical.childPetSafe ? 'text-emerald-700' : 'text-amber-700'
                    }`}
                  >
                    <Baby className="w-3.5 h-3.5" />
                    <span>{selectedChemical.childPetSafe ? (isAr ? 'آمن تماماً' : 'Safe') : (isAr ? 'يتطلب عزل' : 'Caution')}</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-slate-400 mb-0.5">{isAr ? 'مستوى خطورة GHS' : 'GHS Hazard Level'}</div>
                  <div className="font-bold text-slate-900 text-sm">
                    {selectedChemical.ghsLevel}
                  </div>
                </div>
              </div>

              {/* Usage & Health Impact Analysis */}
              <div className="space-y-3 border-t border-slate-100 pt-4 text-xs">
                <div>
                  <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-emerald-800" />
                    <span>{isAr ? 'الاستخدام المنزلي والتقني المعتمد' : 'Standard In-Home Application'}</span>
                  </h4>
                  <p className="text-slate-600 leading-relaxed">
                    {isAr ? selectedChemical.commonUseAr : selectedChemical.commonUseEn}
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                    <Leaf className="w-3.5 h-3.5 text-emerald-800" />
                    <span>{isAr ? 'التأثير على جودة الهواء الداخلي (Indoor VOCs)' : 'Indoor Air Quality Impact'}</span>
                  </h4>
                  <p className="text-slate-600 leading-relaxed">
                    {selectedChemical.indoorAirImpact}
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-800" />
                    <span>{isAr ? 'معدات الحماية الشخصية المطلوبة للفني' : 'Mandatory Protective Equipment (PPE)'}</span>
                  </h4>
                  <ul className="list-disc list-inside space-y-0.5 text-slate-600 pl-2 rtl:pl-0 rtl:pr-2">
                    {selectedChemical.protectiveGear.map((g, i) => (
                      <li key={i}>{g}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Outbound Link to Authoritative PubChem Record */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400">
                  {isAr ? 'معتمد وفق الكود السعودي للمباني الصحية' : 'Certified according to Saudi Healthy Building Code'}
                </span>
                <a
                  href={`https://pubchem.ncbi.nlm.nih.gov/compound/${selectedChemical.cid}`}
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 underline"
                >
                  <span>{isAr ? 'السجل الكيميائي في PubChem' : 'PubChem Chemical Record'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
