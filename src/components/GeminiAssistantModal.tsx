import React, { useState, useRef, useEffect } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import {
  X,
  Send,
  Sparkles,
  Search,
  Brain,
  Zap,
  Image as ImageIcon,
  Loader2,
  Bot,
  User,
  ExternalLink,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  mode?: 'chat' | 'search' | 'thinking' | 'fast';
  groundingSources?: any[];
}

export const GeminiAssistantModal: React.FC = () => {
  const { language, isAiModalOpen, setIsAiModalOpen } = useMarketplace();
  const isAr = language === 'ar';

  const [activeEngine, setActiveEngine] = useState<'chat' | 'search' | 'thinking' | 'fast'>('chat');
  const [inputMessage, setInputMessage] = useState('');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      role: 'model',
      text: isAr
        ? 'أهلاً بك! أنا "مُتقَن الذكي"، مستشارك الهندسي والتقني لصيانة المنازل في المملكة العربية السعودية. كيف أساعدك اليوم في تشخيص عطل التكييف أو السباكة أو فحص سلامة المنظفات؟'
        : 'Welcome! I am the Mutqin AI Engineering & Home Maintenance Advisor. How can I assist you with HVAC diagnosis, plumbing leak isolation, or chemical safety screening?',
      mode: 'chat',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isAiModalOpen) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() && !uploadedImage) return;

    const userText = inputMessage.trim();
    const currentImg = uploadedImage;

    const newMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      text: userText || (isAr ? 'تحليل صورة العطل المرفقة' : 'Analyze attached defect photo'),
      mode: activeEngine,
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputMessage('');
    setUploadedImage(null);
    setIsLoading(true);

    try {
      if (activeEngine === 'search') {
        // Search Grounding via gemini-3.5-flash
        const res = await fetch('/api/gemini/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: userText }),
        });
        const data = await res.json();
        setMessages((prev) => [
          ...prev,
          {
            id: `bot-${Date.now()}`,
            role: 'model',
            text: data.text || 'لا توجد نتائج بحث مباشرة.',
            mode: 'search',
            groundingSources: data.groundingChunks || [],
          },
        ]);
      } else if (activeEngine === 'thinking') {
        // High Thinking forensic diagnosis via gemini-3.1-pro-preview
        const res = await fetch('/api/gemini/diagnose', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            issueDescription: userText,
            serviceCategory: 'Home Maintenance Defect',
            imageBase64: currentImg,
          }),
        });
        const data = await res.json();
        setMessages((prev) => [
          ...prev,
          {
            id: `bot-${Date.now()}`,
            role: 'model',
            text: data.analysis || 'تم إتمام التحليل الهندسي.',
            mode: 'thinking',
          },
        ]);
      } else if (activeEngine === 'fast') {
        // Low-latency estimate via gemini-3.1-flash-lite
        const res = await fetch('/api/gemini/fast-estimate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            serviceType: userText,
            quantity: '1',
            city: 'Riyadh',
          }),
        });
        const data = await res.json();
        setMessages((prev) => [
          ...prev,
          {
            id: `bot-${Date.now()}`,
            role: 'model',
            text: data.estimate || 'تقدير السعر غير متاح حالياً.',
            mode: 'fast',
          },
        ]);
      } else {
        // Standard Multi-turn Chat via gemini-3.8-flash
        const historyPayload = messages.map((m) => ({
          role: m.role,
          text: m.text,
        }));
        const res = await fetch('/api/gemini/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: userText,
            history: historyPayload,
          }),
        });
        const data = await res.json();
        setMessages((prev) => [
          ...prev,
          {
            id: `bot-${Date.now()}`,
            role: 'model',
            text: data.reply || 'تمت الإجابة.',
            mode: 'chat',
          },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          role: 'model',
          text: isAr
            ? 'حدث خطأ في الاتصال بنظام الذكاء الاصطناعي، يرجى المحاولة مرة أخرى.'
            : 'Error connecting to Gemini AI assistant. Please retry.',
          mode: 'chat',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full h-[88vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-800 text-white flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                <span>{isAr ? 'مستشار مُتقَن الذكي (Gemini Suite)' : 'Mutqin AI Diagnostic Suite'}</span>
              </h3>
              <p className="text-xs text-slate-500 font-mono">
                gemini-3.8-flash · search · high-thinking · low-latency
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAiModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* AI Capability Switcher Bar */}
        <div className="px-4 py-2 bg-slate-100 border-b border-slate-200 flex flex-wrap items-center gap-1 text-xs">
          <span className="text-slate-500 font-medium mr-2 rtl:mr-0 rtl:ml-2">
            {isAr ? 'وضع الذكاء:' : 'AI Mode:'}
          </span>

          <button
            type="button"
            onClick={() => setActiveEngine('chat')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors flex items-center gap-1 ${
              activeEngine === 'chat'
                ? 'bg-white text-emerald-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>{isAr ? 'محادثة صيانة (3.8 Flash)' : 'Advisor Chat'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveEngine('search')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors flex items-center gap-1 ${
              activeEngine === 'search'
                ? 'bg-white text-blue-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Search className="w-3.5 h-3.5 text-blue-700" />
            <span>{isAr ? 'بحث جوجل المباشر' : 'Google Search'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveEngine('thinking')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors flex items-center gap-1 ${
              activeEngine === 'thinking'
                ? 'bg-white text-purple-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Brain className="w-3.5 h-3.5 text-purple-700" />
            <span>{isAr ? 'تفكير عميق (Pro Think)' : 'High Thinking'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveEngine('fast')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors flex items-center gap-1 ${
              activeEngine === 'fast'
                ? 'bg-white text-amber-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-600" />
            <span>{isAr ? 'تسعير سريع (Lite)' : 'Low Latency'}</span>
          </button>
        </div>

        {/* Chat Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m) => {
            const isUser = m.role === 'user';

            return (
              <div
                key={m.id}
                className={`flex gap-3 text-sm ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-7 h-7 rounded-lg bg-emerald-800 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-4 space-y-2 ${
                    isUser
                      ? 'bg-emerald-800 text-white rounded-br-xs'
                      : 'bg-slate-100 text-slate-900 rounded-bl-xs'
                  }`}
                >
                  <div className="whitespace-pre-wrap leading-relaxed text-xs sm:text-sm">
                    {m.text}
                  </div>

                  {/* Grounding sources display */}
                  {m.groundingSources && m.groundingSources.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-slate-200 text-xs text-slate-500 space-y-1">
                      <div className="font-semibold text-slate-700 flex items-center gap-1">
                        <Search className="w-3 h-3 text-blue-600" />
                        <span>{isAr ? 'مصادر بحث جوجل الموثوقة:' : 'Google Grounding Citations:'}</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {m.groundingSources.slice(0, 3).map((chunk: any, ci: number) => {
                          const title = chunk?.web?.title || 'Google Search Source';
                          const uri = chunk?.web?.uri;
                          if (!uri) return null;
                          return (
                            <a
                              key={ci}
                              href={uri}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-[11px] bg-white text-blue-700 px-2 py-0.5 rounded-md border border-slate-200 hover:underline"
                            >
                              <span className="truncate max-w-[140px]">{title}</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {isUser && (
                  <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-3 text-slate-500 text-xs p-2">
              <Loader2 className="w-4 h-4 animate-spin text-emerald-800" />
              <span>
                {activeEngine === 'thinking'
                  ? isAr
                    ? 'جاري التفكير الهندسي العميق وتحليل الأعطال بمستوى عالي...'
                    : 'Applying High-Level Thinking Forensic Analysis...'
                  : activeEngine === 'search'
                  ? isAr
                    ? 'جاري التحقق من مصادر بحث جوجل وكود البناء السعودي...'
                    : 'Grounding against Google Search & Saudi Standards...'
                  : isAr
                  ? 'جاري صياغة الاستشارة الهندسية...'
                  : 'Generating diagnostic recommendations...'}
              </span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-200 bg-white space-y-2">
          {uploadedImage && (
            <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-lg text-xs w-max">
              <span className="text-slate-600">
                {isAr ? 'تم إرفاق صورة العطل' : 'Photo attached for diagnosis'}
              </span>
              <button
                type="button"
                onClick={() => setUploadedImage(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <div className="flex items-center gap-2">
            <label className="p-2 text-slate-500 hover:text-emerald-800 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors shrink-0">
              <ImageIcon className="w-5 h-5" />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>

            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={
                activeEngine === 'search'
                  ? isAr
                    ? 'ابحث في لوائح كود البناء وأسعار الصيانة...'
                    : 'Search live Saudi regulations & market rates...'
                  : activeEngine === 'thinking'
                  ? isAr
                    ? 'اوصف مشكلة تسريب أو تلف معقد لتحليل أسبابه بعمق...'
                    : 'Describe complex leak or structural issue for deep analysis...'
                  : activeEngine === 'fast'
                  ? isAr
                    ? 'اطلب تقديراً سريعاً (مثال: صيانة 3 مكيفات بالرياض)...'
                    : 'Fast estimate (e.g., flush 3 AC units in Riyadh)...'
                  : isAr
                  ? 'اكتب استشارتك لمستشار مُتقَن...'
                  : 'Ask Mutqin engineering advisor...'
              }
              className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-800"
            />

            <button
              type="submit"
              disabled={isLoading || (!inputMessage.trim() && !uploadedImage)}
              className="p-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white disabled:opacity-50 transition-colors shrink-0"
            >
              <Send className="w-4 h-4 rtl:rotate-180" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
