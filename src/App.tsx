import React from 'react';
import { MarketplaceProvider, useMarketplace } from './context/MarketplaceContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ServicesGrid } from './components/ServicesGrid';
import { QuotesHub } from './components/QuotesHub';
import { TechnicianPortal } from './components/TechnicianPortal';
import { ScienceSafetyLab } from './components/ScienceSafetyLab';
import { MyBookingsView } from './components/MyBookingsView';
import { BookingModal } from './components/BookingModal';
import { PaymentModal } from './components/PaymentModal';
import { ZatcaInvoiceModal } from './components/ZatcaInvoiceModal';
import { GeminiAssistantModal } from './components/GeminiAssistantModal';
import { NotificationCenterModal } from './components/NotificationCenterModal';
import { LoyaltyModal } from './components/LoyaltyModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { MobileDrawer } from './components/MobileDrawer';
import { SaudiCoverageModal } from './components/SaudiCoverageModal';
import { SubscriptionPlansCatalog } from './components/SubscriptionPlansCatalog';
import { SubscriptionCheckoutModal } from './components/SubscriptionCheckoutModal';
import { Footer } from './components/Footer';
import { Sparkles } from 'lucide-react';

const AppContent: React.FC = () => {
  const { activeTab, setIsAiModalOpen, toastMessage, language } = useMarketplace();
  const isAr = language === 'ar';

  return (
    <div className="min-h-screen flex flex-col bg-[#FBFBFC] text-slate-900 font-sans antialiased overflow-x-hidden selection:bg-emerald-800 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-18 sm:top-20 right-3 sm:right-4 rtl:right-auto rtl:left-3 rtl:sm:left-4 z-50 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-xl shadow-lg border border-slate-700 animate-fade-in flex items-center gap-2 max-w-sm">
          <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Global Navigation */}
      <Navbar />

      {/* Dynamic View Routing with mobile bottom nav padding buffer */}
      <main className="flex-1 pb-24 md:pb-0">
        {activeTab === 'home' && (
          <>
            <Hero />
            <ServicesGrid />
          </>
        )}
        {activeTab === 'services' && <ServicesGrid />}
        {activeTab === 'subscriptions_catalog' && <SubscriptionPlansCatalog />}
        {activeTab === 'subscriptions' && <SubscriptionPlansCatalog />}
        {activeTab === 'quotes' && <QuotesHub />}
        {activeTab === 'technician_portal' && <TechnicianPortal />}
        {activeTab === 'safety_lab' && <ScienceSafetyLab />}
        {activeTab === 'my_bookings' && <MyBookingsView />}
      </main>

      {/* Floating AI Diagnostic Bubble (Positioned higher on mobile to avoid bottom nav) */}
      <button
        onClick={() => setIsAiModalOpen(true)}
        className="hidden sm:flex fixed bottom-6 left-6 rtl:left-auto rtl:right-6 z-30 bg-emerald-800 hover:bg-emerald-900 text-white px-4 py-3 rounded-full shadow-lg border border-emerald-700 items-center gap-2 text-xs font-bold transition-all hover:scale-105 active:scale-95"
        title={isAr ? 'المستشار الهندسي الذكي' : 'AI Diagnostic Assistant'}
      >
        <Sparkles className="w-4 h-4 text-emerald-300" />
        <span>{isAr ? 'مستشار مُتقَن الذكي' : 'Ask Mutqin AI'}</span>
      </button>

      {/* Mobile Sticky Bottom Navigation Bar */}
      <MobileBottomNav />

      {/* Mobile Slide-Over Drawer Navigation */}
      <MobileDrawer />

      {/* Nationwide Saudi Coverage Explorer Modal */}
      <SaudiCoverageModal />

      {/* Modals & Dialogs */}
      <BookingModal />
      <PaymentModal />
      <ZatcaInvoiceModal />
      <GeminiAssistantModal />
      <NotificationCenterModal />
      <LoyaltyModal />
      <SubscriptionCheckoutModal />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <MarketplaceProvider>
      <AppContent />
    </MarketplaceProvider>
  );
}
