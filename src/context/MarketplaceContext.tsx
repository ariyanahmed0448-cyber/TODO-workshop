import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Language,
  UserRole,
  MarketplaceService,
  Booking,
  Quote,
  QuoteBid,
  TechnicianProfile,
  ChemicalSafetyItem,
  ZatcaInvoice,
  MarketplaceNotification,
  ProviderWeeklySettings,
  UserLoyaltyProfile,
  LoyaltyTransaction,
  SubscriptionPlan,
  UserSubscription,
  RecurringVisit,
  SubscriptionBillingCycle,
  SubscriptionBillingMethod,
  SubscriptionBillingInvoiceItem,
  ServiceReview,
  LiveTrackingTelemetry,
} from '../types';
import {
  INITIAL_SERVICES,
  INITIAL_TECHNICIANS,
  INITIAL_CHEMICAL_ITEMS,
  INITIAL_QUOTES,
  INITIAL_BOOKINGS,
  INITIAL_NOTIFICATIONS,
  INITIAL_LOYALTY_PROFILE,
  INITIAL_LOYALTY_TRANSACTIONS,
  STANDARD_TIME_SLOTS,
  INITIAL_SUBSCRIPTION_PLANS,
  INITIAL_USER_SUBSCRIPTIONS,
} from '../data/mockData';

interface MarketplaceContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  role: UserRole;
  setRole: (role: UserRole) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  services: MarketplaceService[];
  bookings: Booking[];
  quotes: Quote[];
  technicians: TechnicianProfile[];
  chemicalItems: ChemicalSafetyItem[];
  selectedServiceForBooking: MarketplaceService | null;
  setSelectedServiceForBooking: (service: MarketplaceService | null) => void;
  isBookingModalOpen: boolean;
  setIsBookingModalOpen: (open: boolean) => void;
  isPaymentModalOpen: boolean;
  setIsPaymentModalOpen: (open: boolean) => void;
  pendingBookingData: Partial<Booking> | null;
  setPendingBookingData: (data: Partial<Booking> | null) => void;
  activeInvoice: ZatcaInvoice | null;
  setActiveInvoice: (invoice: ZatcaInvoice | null) => void;
  isAiModalOpen: boolean;
  setIsAiModalOpen: (open: boolean) => void;
  createBooking: (booking: Booking, invoice: ZatcaInvoice, pointsRedeemed?: number) => void;
  updateBookingStatus: (bookingId: string, status: Booking['status']) => void;
  rescheduleBooking: (bookingId: string, newDate: string, newTimeSlot: string) => void;
  submitBookingReview: (bookingId: string, review: Omit<ServiceReview, 'id' | 'createdAt'>) => void;
  updateBookingLiveTracking: (bookingId: string, telemetry: Partial<LiveTrackingTelemetry>) => void;
  selectedBookingForLiveTrack: Booking | null;
  setSelectedBookingForLiveTrack: (booking: Booking | null) => void;
  selectedBookingForReview: Booking | null;
  setSelectedBookingForReview: (booking: Booking | null) => void;
  createQuote: (quote: Omit<Quote, 'id' | 'bids' | 'createdAt'>) => void;
  submitBid: (quoteId: string, bid: Omit<QuoteBid, 'id' | 'submittedAt'>) => void;
  awardBid: (quoteId: string, bidId: string) => void;
  searchFilter: string;
  setSearchFilter: (query: string) => void;
  selectedRegion: string;
  setSelectedRegion: (region: string) => void;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  isCoverageModalOpen: boolean;
  setIsCoverageModalOpen: (open: boolean) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;

  // Robust Notifications & Scheduling Extensions
  notifications: MarketplaceNotification[];
  isNotificationCenterOpen: boolean;
  setIsNotificationCenterOpen: (open: boolean) => void;
  unreadCount: number;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  providerSettings: ProviderWeeklySettings;
  updateProviderSettings: (settings: Partial<ProviderWeeklySettings>) => void;
  blockedDayOffDates: string[];
  toggleDayOffDate: (date: string) => void;
  customBlockedSlots: Record<string, string[]>; // date -> slotIds
  toggleBlockSlot: (date: string, slotId: string) => void;
  checkSlotAvailability: (
    date: string,
    slotId: string
  ) => { isAvailable: boolean; reasonAr: string; reasonEn: string };

  // Mutqin Points & Loyalty Extensions
  loyaltyProfile: UserLoyaltyProfile;
  loyaltyHistory: LoyaltyTransaction[];
  isLoyaltyModalOpen: boolean;
  setIsLoyaltyModalOpen: (open: boolean) => void;
  redeemPoints: (points: number, bookingId?: string) => number;
  earnPoints: (sarSpent: number, bookingId?: string, serviceTitleAr?: string, serviceTitleEn?: string) => void;

  // Recurring Subscriptions & Automated Scheduling Extensions
  subscriptionPlans: SubscriptionPlan[];
  userSubscriptions: UserSubscription[];
  activeSubscription: UserSubscription | null;
  isSubscriptionCheckoutOpen: boolean;
  setIsSubscriptionCheckoutOpen: (open: boolean) => void;
  selectedPlanForCheckout: SubscriptionPlan | null;
  setSelectedPlanForCheckout: (plan: SubscriptionPlan | null) => void;
  subscribeToPlan: (
    plan: SubscriptionPlan,
    options: {
      billingCadence: SubscriptionBillingCycle;
      preferredDayOfWeek: number;
      preferredTimeSlot: string;
      city: string;
      district: string;
      streetAddress?: string;
      nationalAddressCode?: string;
      billingMethod: SubscriptionBillingMethod;
      lockTechnician?: boolean;
      preferredTechId?: string;
      preferredTechName?: string;
    }
  ) => UserSubscription;
  rescheduleRecurringVisit: (
    subscriptionId: string,
    visitId: string,
    newDate: string,
    newSlot: string
  ) => void;
  skipRecurringVisit: (subscriptionId: string, visitId: string) => void;
  toggleTechnicianLock: (
    subscriptionId: string,
    lock: boolean,
    preferredTechId?: string,
    preferredTechName?: string
  ) => void;
  pauseSubscription: (subscriptionId: string) => void;
  resumeSubscription: (subscriptionId: string) => void;
  cancelSubscription: (subscriptionId: string) => void;
  triggerSubscriptionBillingCycle: (subscriptionId: string) => void;
  downloadCalendarEvent: (visit: RecurringVisit, subscription: UserSubscription) => void;
}

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

export const MarketplaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('ar');
  const [role, setRole] = useState<UserRole>('customer');
  const [activeTab, setActiveTab] = useState<string>('home');
  const [services] = useState<MarketplaceService[]>(INITIAL_SERVICES);
  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('mutqin_bookings');
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });
  const [quotes, setQuotes] = useState<Quote[]>(() => {
    const saved = localStorage.getItem('mutqin_quotes');
    return saved ? JSON.parse(saved) : INITIAL_QUOTES;
  });
  const [technicians] = useState<TechnicianProfile[]>(INITIAL_TECHNICIANS);
  const [chemicalItems] = useState<ChemicalSafetyItem[]>(INITIAL_CHEMICAL_ITEMS);

  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState<MarketplaceService | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [pendingBookingData, setPendingBookingData] = useState<Partial<Booking> | null>(null);
  const [activeInvoice, setActiveInvoice] = useState<ZatcaInvoice | null>(null);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  const [searchFilter, setSearchFilter] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedCity, setSelectedCity] = useState('الرياض (العاصمة)');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCoverageModalOpen, setIsCoverageModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Live Tracking and Review modal state
  const [selectedBookingForLiveTrack, setSelectedBookingForLiveTrack] = useState<Booking | null>(null);
  const [selectedBookingForReview, setSelectedBookingForReview] = useState<Booking | null>(null);

  // Notifications State
  const [notifications, setNotifications] = useState<MarketplaceNotification[]>(() => {
    const saved = localStorage.getItem('mutqin_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);

  // Provider Schedule Settings (Default working Sun-Thu, Friday rest day in Saudi Arabia)
  const [providerSettings, setProviderSettings] = useState<ProviderWeeklySettings>(() => {
    const saved = localStorage.getItem('mutqin_provider_settings');
    return saved
      ? JSON.parse(saved)
      : {
          technicianId: 'tech-faisal',
          defaultSlots: STANDARD_TIME_SLOTS.map((s) => s.id),
          workingDays: [0, 1, 2, 3, 4, 6], // Sunday to Thursday + Saturday (Friday=5 is off)
          autoAcceptBookings: true,
          smsNotificationsEnabled: true,
        };
  });

  // Blackout dates / Day-off list
  const [blockedDayOffDates, setBlockedDayOffDates] = useState<string[]>(() => {
    const saved = localStorage.getItem('mutqin_day_offs');
    return saved ? JSON.parse(saved) : ['2026-10-16'];
  });

  // Date-specific custom blocked slots (date -> [slotIds])
  const [customBlockedSlots, setCustomBlockedSlots] = useState<Record<string, string[]>>(() => {
    const saved = localStorage.getItem('mutqin_blocked_slots');
    return saved ? JSON.parse(saved) : { '2026-10-15': ['slot-noon-2'] };
  });

  // Loyalty Program State (Mutqin Points)
  const [loyaltyProfile, setLoyaltyProfile] = useState<UserLoyaltyProfile>(() => {
    const saved = localStorage.getItem('mutqin_loyalty_profile');
    return saved ? JSON.parse(saved) : INITIAL_LOYALTY_PROFILE;
  });

  const [loyaltyHistory, setLoyaltyHistory] = useState<LoyaltyTransaction[]>(() => {
    const saved = localStorage.getItem('mutqin_loyalty_history');
    return saved ? JSON.parse(saved) : INITIAL_LOYALTY_TRANSACTIONS;
  });

  const [isLoyaltyModalOpen, setIsLoyaltyModalOpen] = useState(false);

  // Recurring Subscriptions State
  const [subscriptionPlans] = useState<SubscriptionPlan[]>(INITIAL_SUBSCRIPTION_PLANS);
  const [userSubscriptions, setUserSubscriptions] = useState<UserSubscription[]>(() => {
    const saved = localStorage.getItem('mutqin_user_subscriptions');
    return saved ? JSON.parse(saved) : INITIAL_USER_SUBSCRIPTIONS;
  });
  const [isSubscriptionCheckoutOpen, setIsSubscriptionCheckoutOpen] = useState(false);
  const [selectedPlanForCheckout, setSelectedPlanForCheckout] = useState<SubscriptionPlan | null>(null);

  // Sync HTML dir and lang attributes
  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  // Persist state changes
  useEffect(() => {
    localStorage.setItem('mutqin_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('mutqin_quotes', JSON.stringify(quotes));
  }, [quotes]);

  useEffect(() => {
    localStorage.setItem('mutqin_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('mutqin_provider_settings', JSON.stringify(providerSettings));
  }, [providerSettings]);

  useEffect(() => {
    localStorage.setItem('mutqin_day_offs', JSON.stringify(blockedDayOffDates));
  }, [blockedDayOffDates]);

  useEffect(() => {
    localStorage.setItem('mutqin_blocked_slots', JSON.stringify(customBlockedSlots));
  }, [customBlockedSlots]);

  useEffect(() => {
    localStorage.setItem('mutqin_loyalty_profile', JSON.stringify(loyaltyProfile));
  }, [loyaltyProfile]);

  useEffect(() => {
    localStorage.setItem('mutqin_loyalty_history', JSON.stringify(loyaltyHistory));
  }, [loyaltyHistory]);

  useEffect(() => {
    localStorage.setItem('mutqin_user_subscriptions', JSON.stringify(userSubscriptions));
  }, [userSubscriptions]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 4500);
  };

  const unreadCount = notifications.filter(
    (n) => !n.isRead && (n.recipientRole === role || n.recipientRole === 'all')
  ).length;

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.recipientRole === role || n.recipientRole === 'all'
          ? { ...n, isRead: true }
          : n
      )
    );
  };

  const updateProviderSettings = (settings: Partial<ProviderWeeklySettings>) => {
    setProviderSettings((prev) => ({ ...prev, ...settings }));
    showToast(
      language === 'ar'
        ? 'تم حفظ إعدادات دوام ومناوبات الفني بنجاح!'
        : 'Provider shift and schedule settings updated successfully!'
    );
  };

  const toggleDayOffDate = (date: string) => {
    setBlockedDayOffDates((prev) => {
      const exists = prev.includes(date);
      const updated = exists ? prev.filter((d) => d !== date) : [...prev, date];
      showToast(
        language === 'ar'
          ? exists
            ? `تم تفعيل العمل ليوم ${date}`
            : `تم تحديد يوم ${date} كإجازة للمزود`
          : exists
          ? `Work enabled for ${date}`
          : `Day marked as day-off for ${date}`
      );
      return updated;
    });
  };

  const toggleBlockSlot = (date: string, slotId: string) => {
    setCustomBlockedSlots((prev) => {
      const current = prev[date] || [];
      const isBlocked = current.includes(slotId);
      const updated = isBlocked ? current.filter((s) => s !== slotId) : [...current, slotId];
      return { ...prev, [date]: updated };
    });
  };

  const checkSlotAvailability = (date: string, slotId: string) => {
    if (blockedDayOffDates.includes(date)) {
      return {
        isAvailable: false,
        reasonAr: 'يوم إجازة معتمد للمزود',
        reasonEn: 'Provider day-off',
      };
    }

    const d = new Date(date);
    const dayOfWeek = d.getDay();
    if (!providerSettings.workingDays.includes(dayOfWeek)) {
      return {
        isAvailable: false,
        reasonAr: 'عطلة نهاية أسبوع (الجمعة)',
        reasonEn: 'Weekend non-working day',
      };
    }

    const blockedOnDate = customBlockedSlots[date] || [];
    if (blockedOnDate.includes(slotId)) {
      return {
        isAvailable: false,
        reasonAr: 'الفترة محجوزة أو مغلقة من الفني',
        reasonEn: 'Shift slot blocked by technician',
      };
    }

    const matchingBooking = bookings.find(
      (b) =>
        b.date === date &&
        b.status !== 'cancelled' &&
        (b.timeSlot.includes(slotId) ||
          b.timeSlot.toLowerCase().includes(slotId.toLowerCase()))
    );

    if (matchingBooking) {
      return {
        isAvailable: false,
        reasonAr: `محجوز مسبقاً (${matchingBooking.id})`,
        reasonEn: `Already booked (${matchingBooking.id})`,
      };
    }

    return {
      isAvailable: true,
      reasonAr: 'متاح للحجز الفوري',
      reasonEn: 'Available for instant booking',
    };
  };

  // -------------------------------------------------------------
  // Mutqin Loyalty Program Engine: Earn, Redeem, and Tier Progression
  // -------------------------------------------------------------
  const calculateTier = (lifetimePoints: number) => {
    if (lifetimePoints >= 1500) {
      return {
        tier: 'platinum' as const,
        tierNameAr: 'الفئة البلاتينية (Platinum)',
        tierNameEn: 'Platinum Tier',
        nextTierPointsNeeded: 0,
        earningMultiplier: 1.5,
      };
    }
    if (lifetimePoints >= 500) {
      return {
        tier: 'gold' as const,
        tierNameAr: 'الفئة الذهبية (Gold)',
        tierNameEn: 'Gold Tier',
        nextTierPointsNeeded: 1500 - lifetimePoints,
        earningMultiplier: 1.25,
      };
    }
    return {
      tier: 'silver' as const,
      tierNameAr: 'الفئة الفضية (Silver)',
      tierNameEn: 'Silver Tier',
      nextTierPointsNeeded: 500 - lifetimePoints,
      earningMultiplier: 1.0,
    };
  };

  const earnPoints = (
    sarSpent: number,
    bookingId?: string,
    serviceTitleAr?: string,
    serviceTitleEn?: string
  ) => {
    const pointsGained = Math.round(sarSpent * loyaltyProfile.earningMultiplier);
    if (pointsGained <= 0) return;

    setLoyaltyProfile((prev) => {
      const newLifetime = prev.lifetimeEarned + pointsGained;
      const newBalance = prev.pointsBalance + pointsGained;
      const tierInfo = calculateTier(newLifetime);

      return {
        ...prev,
        pointsBalance: newBalance,
        lifetimeEarned: newLifetime,
        ...tierInfo,
      };
    });

    const tx: LoyaltyTransaction = {
      id: `tx-pts-${Date.now()}`,
      type: 'earned',
      points: pointsGained,
      sarEquivalent: Math.round((pointsGained / 10) * 100) / 100,
      descriptionAr: `نقاط مكتسبة من حجز ${serviceTitleAr || 'صيانة'} #${bookingId || ''}`,
      descriptionEn: `Points earned from ${serviceTitleEn || 'maintenance'} #${bookingId || ''}`,
      date: new Date().toISOString().split('T')[0],
      bookingId,
    };

    setLoyaltyHistory((prev) => [tx, ...prev]);

    // Issue in-app notification for points earned
    const notif: MarketplaceNotification = {
      id: `notif-${Date.now()}-pts`,
      recipientRole: 'customer',
      type: 'status_update',
      titleAr: `مبروك! حصلت على +${pointsGained} نقطة مُتقَن ⭐`,
      titleEn: `Congrats! You earned +${pointsGained} Mutqin Points ⭐`,
      messageAr: `تمت إضافة ${pointsGained} نقطة إلى رصيد مكافآتك (تعادل ${Math.round(pointsGained / 10)} ر.س رصيد خصم).`,
      messageEn: `${pointsGained} points added to your rewards wallet (equivalent to ${Math.round(pointsGained / 10)} SAR credit).`,
      timestamp: 'الآن',
      isRead: false,
      bookingId,
    };

    setNotifications((prev) => [notif, ...prev]);
  };

  const redeemPoints = (pointsToRedeem: number, bookingId?: string) => {
    if (pointsToRedeem <= 0 || pointsToRedeem > loyaltyProfile.pointsBalance) {
      return 0;
    }

    const discountSAR = Math.round((pointsToRedeem / 10) * 100) / 100;

    setLoyaltyProfile((prev) => ({
      ...prev,
      pointsBalance: Math.max(0, prev.pointsBalance - pointsToRedeem),
    }));

    const tx: LoyaltyTransaction = {
      id: `tx-red-${Date.now()}`,
      type: 'redeemed',
      points: -pointsToRedeem,
      sarEquivalent: discountSAR,
      descriptionAr: `استبدال نقاط لخصم ${discountSAR} ر.س على حجز #${bookingId || ''}`,
      descriptionEn: `Points redeemed for ${discountSAR} SAR discount on #${bookingId || ''}`,
      date: new Date().toISOString().split('T')[0],
      bookingId,
    };

    setLoyaltyHistory((prev) => [tx, ...prev]);

    return discountSAR;
  };

  const createBooking = (
    newBooking: Booking,
    invoice: ZatcaInvoice,
    pointsRedeemed?: number
  ) => {
    setBookings((prev) => [newBooking, ...prev]);
    setActiveInvoice(invoice);

    // If customer redeemed points on this order, deduct them
    if (pointsRedeemed && pointsRedeemed > 0) {
      redeemPoints(pointsRedeemed, newBooking.id);
    }

    // Award loyalty points on net amount paid
    earnPoints(
      newBooking.totalSAR,
      newBooking.id,
      newBooking.serviceTitleAr,
      newBooking.serviceTitleEn
    );

    // Create real-time notification for technician
    const isPending = newBooking.status === 'pending';
    const techNotif: MarketplaceNotification = {
      id: `notif-${Date.now()}-tech`,
      recipientRole: 'technician',
      type: 'new_booking',
      titleAr: isPending ? 'طلب موعد صيانة جديد بانتظار موافقتك ⏳' : 'طلب موعد صيانة جديد 🗓️',
      titleEn: isPending ? 'New Booking Request Awaiting Acceptance ⏳' : 'New Service Booking Received 🗓️',
      messageAr: `حجز جديد (${isPending ? 'قيد الانتظار' : 'مؤكد'}): "${newBooking.serviceTitleAr}" بواسطة ${newBooking.customerName} ليوم ${newBooking.date} (${newBooking.timeSlot}) بقيمة ${newBooking.totalSAR} ر.س.`,
      messageEn: `New booking (${isPending ? 'Pending' : 'Confirmed'}): "${newBooking.serviceTitleEn}" by ${newBooking.customerName} on ${newBooking.date} (${newBooking.timeSlot}) for ${newBooking.totalSAR} SAR.`,
      timestamp: 'الآن',
      isRead: false,
      bookingId: newBooking.id,
    };

    // Create confirmation notification for customer
    const custNotif: MarketplaceNotification = {
      id: `notif-${Date.now()}-cust`,
      recipientRole: 'customer',
      type: 'new_booking',
      titleAr: isPending ? 'طلب الحجز قيد المراجعة والموافقة ⏳' : 'تم تأكيد موعدك وتوليد الفاتورة الضريبية 🧾',
      titleEn: isPending ? 'Booking Request Submitted (Pending Review) ⏳' : 'Appointment Confirmed & ZATCA Invoice Generated 🧾',
      messageAr: isPending
        ? `حجزك برقم #${newBooking.id} لخدمة ${newBooking.serviceTitleAr} تم استلامه وهو قيد موافقة الفني. كسبت نقاط مكافآت وتم توليد فاتورة الزكاة والضريبة.`
        : `حجزك برقم #${newBooking.id} مؤكد مع المهندس فيصل العتيبي ليوم ${newBooking.date}. كسبت نقاط مكافآت وتم توليد فاتورة الزكاة والضريبة.`,
      messageEn: isPending
        ? `Your booking #${newBooking.id} for "${newBooking.serviceTitleEn}" is pending technician acceptance. Mutqin points awarded and ZATCA tax invoice generated.`
        : `Your booking #${newBooking.id} is confirmed with Eng. Faisal on ${newBooking.date}. You earned loyalty points and generated your ZATCA invoice.`,
      timestamp: 'الآن',
      isRead: false,
      bookingId: newBooking.id,
    };

    setNotifications((prev) => [techNotif, custNotif, ...prev]);

    showToast(
      language === 'ar'
        ? isPending
          ? `تم إرسال حجزك برقم #${newBooking.id} بنجاح (قيد مراجعة الفني)!`
          : `تم تأكيد حجزك برقم #${newBooking.id} وكسب نقاط مُتقَن المكافئة!`
        : isPending
        ? `Booking #${newBooking.id} placed (pending technician review)!`
        : `Booking #${newBooking.id} confirmed and Mutqin Points awarded!`
    );
  };

  const updateBookingStatus = (bookingId: string, status: Booking['status']) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id !== bookingId) return b;
        let tracking = b.liveTracking;
        if (status === 'in_progress' && !tracking) {
          const destLat = b.latitude || 24.8192;
          const destLng = b.longitude || 46.6621;
          tracking = {
            technicianLat: destLat - 0.015,
            technicianLng: destLng - 0.012,
            etaMinutes: 14,
            distanceKm: 4.2,
            currentRoadAr: 'طريق الملك فهد متجهاً إلى موقع العميل',
            currentRoadEn: 'King Fahd Road heading towards client location',
            speedKmh: 45,
            vehicleModelAr: 'تويوتا هايس - فان صيانة متكامل ومجهز',
            vehicleModelEn: 'Toyota HiAce - Fully Equipped Service Van',
            plateNumberAr: 'أ ب ج ١ ٩ ٨ ٢',
            plateNumberEn: 'ABJ 1982',
            technicianPhone: b.technicianPhone || '+966 50 123 4567',
            routeProgressPercent: 20,
            milestone: 'en_route',
            lastUpdatedTime: 'الآن',
          };
        }
        return { ...b, status, liveTracking: tracking };
      })
    );

    const targetBooking = bookings.find((b) => b.id === bookingId);
    const serviceName = targetBooking?.serviceTitleAr || 'الخدمة';
    const serviceNameEn = targetBooking?.serviceTitleEn || 'Service';

    const notif: MarketplaceNotification = {
      id: `notif-${Date.now()}-status`,
      recipientRole: 'customer',
      type: 'status_update',
      titleAr:
        status === 'confirmed'
          ? 'تم قبول وتأكيد موعد الحجز ✅'
          : status === 'in_progress'
          ? 'الفني في الطريق وبدء المعاينة 🚗'
          : status === 'completed'
          ? 'تم إتمام الصيانة بنجاح ✅'
          : status === 'cancelled'
          ? 'تم إلغاء موعد الحجز ❌'
          : 'تحديث حالة الموعد',
      titleEn:
        status === 'confirmed'
          ? 'Booking Accepted & Confirmed ✅'
          : status === 'in_progress'
          ? 'Technician En Route 🚗'
          : status === 'completed'
          ? 'Service Completed ✅'
          : status === 'cancelled'
          ? 'Booking Cancelled ❌'
          : 'Booking Status Updated',
      messageAr:
        status === 'confirmed'
          ? `وافق الفني على موعد حجز ${serviceName} وتأكدت الزيارة في الموعد المحدد.`
          : status === 'in_progress'
          ? `الفني في طريقه لموقعك لبدء خدمة ${serviceName}. يمكنك تتبع موقعه لحظياً عبر الخريطة.`
          : status === 'completed'
          ? `تم الانتهاء من تنفيذ ${serviceName}، يمكنك الآن تقييم الفني وكتابة تجربتك.`
          : status === 'cancelled'
          ? `تم إلغاء الموعد #${bookingId} لخدمة ${serviceName}.`
          : `تم تحديث الموعد #${bookingId} إلى: ${status}`,
      messageEn:
        status === 'confirmed'
          ? `Technician has accepted your booking for ${serviceNameEn}. Visit confirmed.`
          : status === 'in_progress'
          ? `Technician is en route to your address for ${serviceNameEn}. Track live on map.`
          : status === 'completed'
          ? `Service ${serviceNameEn} completed. Please rate the technician and share your review.`
          : status === 'cancelled'
          ? `Booking #${bookingId} for ${serviceNameEn} has been cancelled.`
          : `Booking #${bookingId} status is now ${status}.`,
      timestamp: 'الآن',
      isRead: false,
      bookingId,
    };

    setNotifications((prev) => [notif, ...prev]);

    const statusLabelsAr: Record<string, string> = {
      pending: 'قيد الانتظار',
      confirmed: 'مؤكد',
      in_progress: 'الفني في الطريق',
      completed: 'مكتمل',
      cancelled: 'ملغي',
    };

    showToast(
      language === 'ar'
        ? `تم تحديث حالة الحجز إلى: ${statusLabelsAr[status] || status}`
        : `Booking status updated to: ${status}`
    );
  };

  const updateBookingLiveTracking = (bookingId: string, telemetry: Partial<LiveTrackingTelemetry>) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id !== bookingId) return b;
        const currentTracking = b.liveTracking || {
          technicianLat: (b.latitude || 24.8192) - 0.015,
          technicianLng: (b.longitude || 46.6621) - 0.012,
          etaMinutes: 12,
          distanceKm: 3.5,
          currentRoadAr: 'طريق الملك فهد متجهاً إلى موقع العميل',
          currentRoadEn: 'King Fahd Road heading towards client location',
          speedKmh: 45,
          vehicleModelAr: 'تويوتا هايس - فان صيانة متكامل ومجهز',
          vehicleModelEn: 'Toyota HiAce - Service Van',
          plateNumberAr: 'أ ب ج ١ ٩ ٨ ٢',
          plateNumberEn: 'ABJ 1982',
          technicianPhone: b.technicianPhone || '+966 50 123 4567',
          routeProgressPercent: 50,
          milestone: 'en_route',
          lastUpdatedTime: 'الآن',
        };
        const updatedTracking = { ...currentTracking, ...telemetry, lastUpdatedTime: 'الآن' };
        return { ...b, liveTracking: updatedTracking };
      })
    );
  };

  const submitBookingReview = (
    bookingId: string,
    reviewData: Omit<ServiceReview, 'id' | 'createdAt'>
  ) => {
    const reviewId = `rev-${Date.now()}`;
    const newReview: ServiceReview = {
      ...reviewData,
      id: reviewId,
      bookingId,
      createdAt: new Date().toISOString().split('T')[0],
      technicianReply:
        language === 'ar'
          ? 'سعدنا بخدمتك وإنجاز الصيانة بأعلى جودة واحترافية! شكراً لثقتك الدائمة بمُتقَن.'
          : 'Thank you for choosing Mutqin! We were proud to deliver this service to the highest standards.',
    };

    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, review: newReview } : b))
    );

    // Award +25 Mutqin points bonus for leaving a review!
    const bonusPoints = 25;
    setLoyaltyProfile((prev) => {
      const updatedBalance = prev.pointsBalance + bonusPoints;
      const updatedLifetime = prev.lifetimeEarned + bonusPoints;
      const tierInfo = calculateTier(updatedLifetime);
      return {
        ...prev,
        pointsBalance: updatedBalance,
        lifetimeEarned: updatedLifetime,
        ...tierInfo,
      };
    });

    const loyaltyTx: LoyaltyTransaction = {
      id: `tx-${Date.now()}-rev`,
      type: 'earned',
      points: bonusPoints,
      sarEquivalent: Math.round((bonusPoints / 10) * 100) / 100,
      date: new Date().toISOString().split('T')[0],
      descriptionAr: `مكافأة تقييم خدمة #${bookingId} وكتابة مراجعة الفني ⭐`,
      descriptionEn: `Review bonus for service #${bookingId} feedback ⭐`,
      bookingId,
    };
    setLoyaltyHistory((prev) => [loyaltyTx, ...prev]);

    // Send notification
    const targetBooking = bookings.find((b) => b.id === bookingId);
    const techName = targetBooking?.technicianName || 'الفني';
    const notif: MarketplaceNotification = {
      id: `notif-${Date.now()}-rev`,
      recipientRole: 'all',
      type: 'status_update',
      titleAr: 'تم تسجيل تقييمك للخدمة بنجاح ⭐',
      titleEn: 'Service Review Submitted Successfully ⭐',
      messageAr: `شكراً لتقييمك (${newReview.rating}/5 نجوم) للمهندس ${techName}. كسبت +${bonusPoints} نقطة ولاء إضافية في محفظتك!`,
      messageEn: `Thank you for rating (${newReview.rating}/5 stars) ${techName}. You earned +${bonusPoints} Mutqin bonus points!`,
      timestamp: 'الآن',
      isRead: false,
      bookingId,
    };
    setNotifications((prev) => [notif, ...prev]);

    showToast(
      language === 'ar'
        ? `شكراً لمشاركتك التقييم! كسبت +${bonusPoints} نقطة ولاء مُتقَن 🌟`
        : `Thank you for reviewing! +${bonusPoints} Mutqin Points awarded 🌟`
    );
  };

  const rescheduleBooking = (bookingId: string, newDate: string, newTimeSlot: string) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId ? { ...b, date: newDate, timeSlot: newTimeSlot } : b
      )
    );

    const notif: MarketplaceNotification = {
      id: `notif-${Date.now()}-reschedule`,
      recipientRole: 'all',
      type: 'reschedule',
      titleAr: 'تمت إعادة جدولة الموعد 🔄',
      titleEn: 'Appointment Rescheduled 🔄',
      messageAr: `تم تحديث موعد الحجز #${bookingId} إلى تاريخ ${newDate} (${newTimeSlot}).`,
      messageEn: `Booking #${bookingId} was rescheduled to ${newDate} (${newTimeSlot}).`,
      timestamp: 'الآن',
      isRead: false,
      bookingId,
    };

    setNotifications((prev) => [notif, ...prev]);

    showToast(
      language === 'ar'
        ? `تمت إعادة جدولة الموعد #${bookingId} إلى ${newDate}`
        : `Booking #${bookingId} rescheduled to ${newDate}`
    );
  };

  const createQuote = (quoteData: Omit<Quote, 'id' | 'bids' | 'createdAt'>) => {
    const newQuote: Quote = {
      ...quoteData,
      id: `quote-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString().split('T')[0],
      bids: [],
    };
    setQuotes((prev) => [newQuote, ...prev]);

    const notif: MarketplaceNotification = {
      id: `notif-${Date.now()}-quote`,
      recipientRole: 'technician',
      type: 'new_booking',
      titleAr: 'طلب تسعير جديد منشور في منطقتك 📢',
      titleEn: 'New Project Quote Request in Your Area 📢',
      messageAr: `طلب تسعير جديد: "${newQuote.title}" في ${newQuote.city} - ${newQuote.district}. يمكنك تقديم عرض سعر الآن.`,
      messageEn: `New quote: "${newQuote.title}" in ${newQuote.city} - ${newQuote.district}. Submit your bid now.`,
      timestamp: 'الآن',
      isRead: false,
      quoteId: newQuote.id,
    };

    setNotifications((prev) => [notif, ...prev]);

    showToast(
      language === 'ar'
        ? 'تم نشر طلب التسعير بنجاح! سيقدم المقاولون عروضهم قريباً.'
        : 'Quote request posted! Certified contractors will submit bids shortly.'
    );
  };

  const submitBid = (quoteId: string, bidData: Omit<QuoteBid, 'id' | 'submittedAt'>) => {
    const newBid: QuoteBid = {
      ...bidData,
      id: `bid-${Date.now().toString().slice(-5)}`,
      submittedAt: language === 'ar' ? 'الآن' : 'Just now',
    };
    setQuotes((prev) =>
      prev.map((q) => (q.id === quoteId ? { ...q, bids: [newBid, ...q.bids] } : q))
    );

    const notif: MarketplaceNotification = {
      id: `notif-${Date.now()}-bid`,
      recipientRole: 'customer',
      type: 'bid_received',
      titleAr: 'عرض سعر جديد من فني معتمد 💰',
      titleEn: 'New Bid Received on Your Quote 💰',
      messageAr: `قدم المهندس فيصل العتيبي عرض سعر بقيمة ${bidData.priceSAR} ر.س على مشروعك.`,
      messageEn: `Eng. Faisal submitted a bid of ${bidData.priceSAR} SAR on your project.`,
      timestamp: 'الآن',
      isRead: false,
      quoteId,
    };

    setNotifications((prev) => [notif, ...prev]);

    showToast(
      language === 'ar'
        ? 'تم تقديم عرض السعر الفني بنجاح إلى العميل!'
        : 'Bid offer submitted to the client successfully!'
    );
  };

  const awardBid = (quoteId: string, bidId: string) => {
    setQuotes((prev) =>
      prev.map((q) =>
        q.id === quoteId ? { ...q, status: 'awarded', awardedBidId: bidId } : q
      )
    );

    const notif: MarketplaceNotification = {
      id: `notif-${Date.now()}-award`,
      recipientRole: 'technician',
      type: 'status_update',
      titleAr: 'تهانينا! تم قبول عرضك وتعميد المشروع 🤝',
      titleEn: 'Congratulations! Your Bid Was Accepted 🤝',
      messageAr: 'قام العميل بقبول عرضك وتم إيداع المبلغ في حساب الضمان البنكي الآمن.',
      messageEn: 'Client accepted your bid and funds have been deposited into escrow.',
      timestamp: 'الآن',
      isRead: false,
      quoteId,
    };

    setNotifications((prev) => [notif, ...prev]);

    showToast(
      language === 'ar'
        ? 'تم قبول العرض وتحويل المبلغ إلى الضمان الآمن (Escrow)!'
        : 'Bid accepted and funds deposited into secure escrow!'
    );
  };

  // ==========================================
  // RECURRING SUBSCRIPTIONS & AUTOMATED SCHEDULING LOGIC
  // ==========================================

  const activeSubscription =
    userSubscriptions.find((s) => s.status === 'active') ||
    userSubscriptions[0] ||
    null;

  const subscribeToPlan = (
    plan: SubscriptionPlan,
    options: {
      billingCadence: SubscriptionBillingCycle;
      preferredDayOfWeek: number;
      preferredTimeSlot: string;
      city: string;
      district: string;
      streetAddress?: string;
      nationalAddressCode?: string;
      billingMethod: SubscriptionBillingMethod;
      lockTechnician?: boolean;
      preferredTechId?: string;
      preferredTechName?: string;
    }
  ): UserSubscription => {
    const subId = `SUB-MUTQ-${Math.floor(1000 + Math.random() * 9000)}`;
    const today = new Date();
    const startDateStr = today.toISOString().split('T')[0];

    // Compute Renewal Date (+30, +90, or +365 days)
    const renewalDays =
      options.billingCadence === 'annual'
        ? 365
        : options.billingCadence === 'quarterly'
        ? 90
        : 30;
    const renewalDate = new Date(today.getTime() + renewalDays * 24 * 60 * 60 * 1000);
    const nextRenewalStr = renewalDate.toISOString().split('T')[0];

    // Compute cycle price with discounts
    let subtotalSAR = plan.basePriceSAR;
    if (options.billingCadence === 'quarterly') {
      subtotalSAR = Math.round(plan.basePriceSAR * 3 * 0.9); // 10% off quarterly
    } else if (options.billingCadence === 'annual') {
      subtotalSAR = Math.round(plan.basePriceSAR * 12 * 0.8); // 20% off annual
    }
    const vatRate = 0.15;
    const vatSAR = Math.round(subtotalSAR * vatRate * 100) / 100;
    const totalSAR = Math.round((subtotalSAR + vatSAR) * 100) / 100;

    // Generate initial recurring visits for the current month cycle
    const visitsCount = plan.visitsPerMonth > 0 ? plan.visitsPerMonth : 1;
    const intervalDays =
      plan.cadence === 'weekly' ? 7 : plan.cadence === 'biweekly' ? 14 : 30;

    const visits: RecurringVisit[] = [];
    for (let i = 0; i < visitsCount; i++) {
      const visitDate = new Date(today.getTime() + (i * intervalDays + 3) * 24 * 60 * 60 * 1000);
      const visitDateStr = visitDate.toISOString().split('T')[0];

      visits.push({
        id: `visit-${subId}-${i + 1}`,
        subscriptionId: subId,
        visitNumber: i + 1,
        scheduledDate: visitDateStr,
        timeSlot: options.preferredTimeSlot,
        status: 'scheduled',
        serviceTitleAr: `زيارة دورية مجدولة #${i + 1} (${plan.nameAr})`,
        serviceTitleEn: `Scheduled Recurring Visit #${i + 1} (${plan.nameEn})`,
        technicianId: options.lockTechnician ? options.preferredTechId || 'tech-faisal' : 'tech-faisal',
        technicianName: options.lockTechnician
          ? options.preferredTechName || 'م. فيصل العتيبي (الفني المعتمد)'
          : 'م. فيصل العتيبي (فني مناوب معتمد)',
        technicianPhone: '+966501234567',
        technicianRating: 4.95,
        checklist: plan.includedServicesAr.map((titleAr, idx) => ({
          titleAr,
          titleEn: plan.includedServicesEn[idx] || titleAr,
          completed: false,
        })),
      });
    }

    const firstVisitDate = visits[0]?.scheduledDate || startDateStr;

    // Generate Initial ZATCA Invoice
    const invoiceNo = `INV-2026-${subId}-M1`;
    const initialInvoice: SubscriptionBillingInvoiceItem = {
      id: `inv-${Date.now()}`,
      date: startDateStr,
      billingCycleNumber: 1,
      amountSAR: totalSAR,
      subtotalSAR,
      vatSAR,
      invoiceNo,
      method: options.billingMethod,
      status: 'paid',
      zatcaQrPayload: 'AQ5NdXRxaW4gU2F1ZGkCCzMxMDk4NDkyMDEwMDMDAzIwMjYtMTAtMTRUMDk6MDA6MDBaBAY' + totalSAR + 'FBjEwMy41MA==',
    };

    const newSub: UserSubscription = {
      id: subId,
      planId: plan.id,
      planNameAr: plan.nameAr,
      planNameEn: plan.nameEn,
      planType: plan.planType,
      category: plan.category,
      status: 'active',
      cadence: plan.cadence,
      billingCadence: options.billingCadence,
      preferredDayOfWeek: options.preferredDayOfWeek,
      preferredTimeSlot: options.preferredTimeSlot,
      preferredTechnicianId: options.preferredTechId || 'tech-faisal',
      preferredTechnicianName: options.preferredTechName || 'م. فيصل العتيبي',
      lockPreferredTechnician: !!options.lockTechnician,
      city: options.city,
      district: options.district,
      streetAddress: options.streetAddress || '',
      nationalAddressCode: options.nationalAddressCode || 'RDHA-5521-KSA',
      startDate: startDateStr,
      nextRenewalDate: nextRenewalStr,
      nextVisitDate: firstVisitDate,
      billingMethod: options.billingMethod,
      pricePerCycleSAR: subtotalSAR,
      vatSAR,
      totalPerCycleSAR: totalSAR,
      autoRenew: true,
      visits,
      billingHistory: [initialInvoice],
      createdAt: today.toISOString(),
    };

    setUserSubscriptions((prev) => [newSub, ...prev]);

    // Award loyalty points bonus (+50 points)
    earnPoints(subtotalSAR, subId, plan.nameAr, plan.nameEn);

    // Create Notification
    const notif: MarketplaceNotification = {
      id: `notif-${Date.now()}-sub`,
      recipientRole: 'customer',
      type: 'new_booking',
      titleAr: `تم تفعيل اشتراكك بنجاح في ${plan.nameAr} 🎉`,
      titleEn: `Subscription Activated: ${plan.nameEn} 🎉`,
      messageAr: `تمت جدولة أولى زيارات الصيانة الدورية بتاريخ ${firstVisitDate}. يمكنك تعديل أو تأجيل المواعيد في أي وقت دون رسوم.`,
      messageEn: `First recurring visit scheduled on ${firstVisitDate}. You can reschedule or skip visits anytime with no fees.`,
      timestamp: 'الآن',
      isRead: false,
      bookingId: subId,
    };
    setNotifications((prev) => [notif, ...prev]);

    showToast(
      language === 'ar'
        ? `تم تفعيل اشتراك ${plan.nameAr} وجدولة الزيارات بنجاح! 🇸🇦`
        : `Subscription ${plan.nameEn} activated with automated scheduling!`
    );

    return newSub;
  };

  const rescheduleRecurringVisit = (
    subscriptionId: string,
    visitId: string,
    newDate: string,
    newSlot: string
  ) => {
    setUserSubscriptions((prev) =>
      prev.map((sub) => {
        if (sub.id !== subscriptionId) return sub;

        const updatedVisits = sub.visits.map((v) =>
          v.id === visitId
            ? { ...v, scheduledDate: newDate, timeSlot: newSlot, status: 'rescheduled' as const }
            : v
        );

        // Find nearest future visit
        const activeVisits = updatedVisits
          .filter((v) => v.status === 'scheduled' || v.status === 'rescheduled')
          .sort((a, b) => a.scheduledDate.localeCompare(b.scheduledDate));

        return {
          ...sub,
          visits: updatedVisits,
          nextVisitDate: activeVisits[0]?.scheduledDate || sub.nextVisitDate,
        };
      })
    );

    const notif: MarketplaceNotification = {
      id: `notif-${Date.now()}-resched`,
      recipientRole: 'customer',
      type: 'reschedule',
      titleAr: 'تم تحديث موعد الزيارة الدورية 🗓️',
      titleEn: 'Recurring Visit Rescheduled 🗓️',
      messageAr: `تم نقل موعد زيارة الصيانة إلى ${newDate} (${newSlot}). تم تحديث تقويم الفني المعتمد.`,
      messageEn: `Visit rescheduled to ${newDate} (${newSlot}). Assigned technician schedule updated.`,
      timestamp: 'الآن',
      isRead: false,
    };
    setNotifications((prev) => [notif, ...prev]);

    showToast(
      language === 'ar'
        ? `تم تأكيد الموعد الجديد للزيارة في ${newDate} بنجاح!`
        : `Visit successfully rescheduled to ${newDate}!`
    );
  };

  const skipRecurringVisit = (subscriptionId: string, visitId: string) => {
    setUserSubscriptions((prev) =>
      prev.map((sub) => {
        if (sub.id !== subscriptionId) return sub;

        const updatedVisits = sub.visits.map((v) =>
          v.id === visitId ? { ...v, status: 'skipped' as const } : v
        );

        const activeVisits = updatedVisits
          .filter((v) => v.status === 'scheduled' || v.status === 'rescheduled')
          .sort((a, b) => a.scheduledDate.localeCompare(b.scheduledDate));

        return {
          ...sub,
          visits: updatedVisits,
          nextVisitDate: activeVisits[0]?.scheduledDate || sub.nextVisitDate,
        };
      })
    );

    const notif: MarketplaceNotification = {
      id: `notif-${Date.now()}-skip`,
      recipientRole: 'customer',
      type: 'status_update',
      titleAr: 'تم تخطي الزيارة الدورية بنجاح ⏭️',
      titleEn: 'Visit Skipped & Rolled Over ⏭️',
      messageAr: 'تم تخطي الزيارة وترحيل رصيدها للشهر القادم دون أي خصم مالي.',
      messageEn: 'Visit was skipped and rolled over to your next cycle balance with 0 penalty.',
      timestamp: 'الآن',
      isRead: false,
    };
    setNotifications((prev) => [notif, ...prev]);

    showToast(
      language === 'ar'
        ? 'تم تخطي الزيارة وترحيلها بنجاح دون أي خصم!'
        : 'Visit skipped and rolled over to next cycle without fee!'
    );
  };

  const toggleTechnicianLock = (
    subscriptionId: string,
    lock: boolean,
    preferredTechId?: string,
    preferredTechName?: string
  ) => {
    setUserSubscriptions((prev) =>
      prev.map((sub) => {
        if (sub.id !== subscriptionId) return sub;

        const updatedVisits = sub.visits.map((v) => {
          if (v.status === 'scheduled' || v.status === 'rescheduled') {
            return {
              ...v,
              technicianId: lock ? preferredTechId || sub.preferredTechnicianId : undefined,
              technicianName: lock
                ? `${preferredTechName || sub.preferredTechnicianName || 'الفني المعتمد'} (مثبت)`
                : 'فني معتمد مناوب (تعيين مرن تلقائي)',
            };
          }
          return v;
        });

        return {
          ...sub,
          lockPreferredTechnician: lock,
          preferredTechnicianId: preferredTechId || sub.preferredTechnicianId,
          preferredTechnicianName: preferredTechName || sub.preferredTechnicianName,
          visits: updatedVisits,
        };
      })
    );

    showToast(
      language === 'ar'
        ? lock
          ? 'تم تثبيت الفني المفضل لكافة الزيارات الدورية القادمة!'
          : 'تم تفعيل التوزيع التلقائي للأقرب جغرافياً لسرعة الإنجاز!'
        : lock
        ? 'Preferred technician locked for all recurring visits!'
        : 'Dynamic nearest-technician auto assignment enabled!'
    );
  };

  const pauseSubscription = (subscriptionId: string) => {
    setUserSubscriptions((prev) =>
      prev.map((s) => (s.id === subscriptionId ? { ...s, status: 'paused' as const } : s))
    );
    showToast(
      language === 'ar'
        ? 'تم إيقاف الاشتراك مؤقتاً. يمكنك استئنافه في أي وقت!'
        : 'Subscription paused. You can resume anytime!'
    );
  };

  const resumeSubscription = (subscriptionId: string) => {
    setUserSubscriptions((prev) =>
      prev.map((s) => (s.id === subscriptionId ? { ...s, status: 'active' as const } : s))
    );
    showToast(
      language === 'ar'
        ? 'تم استئناف الاشتراك وتفعيل جدول المواعيد التلقائي!'
        : 'Subscription resumed! Automated schedule active.'
    );
  };

  const cancelSubscription = (subscriptionId: string) => {
    setUserSubscriptions((prev) =>
      prev.map((s) => (s.id === subscriptionId ? { ...s, status: 'cancelled' as const } : s))
    );
    showToast(
      language === 'ar'
        ? 'تم إلغاء التجديد التلقائي للاشتراك بنجاح.'
        : 'Subscription auto-renew cancelled successfully.'
    );
  };

  const triggerSubscriptionBillingCycle = (subscriptionId: string) => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    setUserSubscriptions((prev) =>
      prev.map((sub) => {
        if (sub.id !== subscriptionId) return sub;

        const nextCycleNum = (sub.billingHistory.length || 0) + 1;
        const invoiceNo = `INV-2026-${sub.id}-M${nextCycleNum}`;

        const newInvoice: SubscriptionBillingInvoiceItem = {
          id: `inv-${Date.now()}`,
          date: todayStr,
          billingCycleNumber: nextCycleNum,
          amountSAR: sub.totalPerCycleSAR,
          subtotalSAR: sub.pricePerCycleSAR,
          vatSAR: sub.vatSAR,
          invoiceNo,
          method: sub.billingMethod,
          status: 'paid',
          zatcaQrPayload:
            'AQ5NdXRxaW4gU2F1ZGkCCzMxMDk4NDkyMDEwMDMDAzIwMjYtMTAtMTRUMDk6MDA6MDBaBAY' +
            sub.totalPerCycleSAR +
            'FBj' +
            sub.vatSAR,
        };

        // Generate 4 visits for the new upcoming month
        const newVisits: RecurringVisit[] = [];
        const intervalDays = sub.cadence === 'weekly' ? 7 : sub.cadence === 'biweekly' ? 14 : 30;
        const visitsCount = sub.cadence === 'weekly' ? 4 : sub.cadence === 'biweekly' ? 2 : 1;

        for (let i = 0; i < visitsCount; i++) {
          const vDate = new Date(today.getTime() + (i * intervalDays + 3) * 24 * 60 * 60 * 1000);
          newVisits.push({
            id: `visit-${sub.id}-c${nextCycleNum}-${i + 1}`,
            subscriptionId: sub.id,
            visitNumber: i + 1,
            scheduledDate: vDate.toISOString().split('T')[0],
            timeSlot: sub.preferredTimeSlot,
            status: 'scheduled',
            serviceTitleAr: `زيارة دورية مجدولة - دورة ${nextCycleNum} (#${i + 1})`,
            serviceTitleEn: `Scheduled Recurring Visit - Cycle ${nextCycleNum} (#${i + 1})`,
            technicianId: sub.preferredTechnicianId || 'tech-faisal',
            technicianName: sub.preferredTechnicianName || 'م. فيصل العتيبي',
            technicianPhone: '+966501234567',
            technicianRating: 4.95,
            checklist: [
              { titleAr: 'فحص التكييف والتبريد والمحركات', titleEn: 'AC cooling & motor audit', completed: false },
              { titleAr: 'غسيل الفلاتر وتعقيم الهواء', titleEn: 'Filter cleanse & sanitization', completed: false },
              { titleAr: 'تدقيق شبكة السباكة وتوازن المضخات', titleEn: 'Plumbing & pump audit', completed: false },
            ],
          });
        }

        const nextRenewalDate = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0];

        return {
          ...sub,
          nextRenewalDate,
          nextVisitDate: newVisits[0]?.scheduledDate || sub.nextVisitDate,
          visits: [...sub.visits, ...newVisits],
          billingHistory: [newInvoice, ...sub.billingHistory],
        };
      })
    );

    earnPoints(100, subscriptionId, 'تجديد اشتراك دوري', 'Recurring subscription renewal');

    showToast(
      language === 'ar'
        ? 'تمت محاكاة التجديد التلقائي بنجاح: تم خصم الدورة وإصدار فاتورة ZATCA الضريبية!'
        : 'Billing renewal processed: ZATCA tax invoice generated & schedule populated!'
    );
  };

  const downloadCalendarEvent = (visit: RecurringVisit, subscription: UserSubscription) => {
    const title = language === 'ar' ? visit.serviceTitleAr : visit.serviceTitleEn;
    const location = `${subscription.city} - ${subscription.district} (${subscription.nationalAddressCode || 'KSA'})`;
    const description = `${title}\\nالفني: ${visit.technicianName || 'مُتقَن الفني المعتمد'}\\nرقم الاشتراك: ${subscription.id}`;

    const dateClean = visit.scheduledDate.replace(/-/g, '');
    const startTime = `${dateClean}T090000Z`;
    const endTime = `${dateClean}T113000Z`;

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Mutqin Care//Saudi Home Maintenance//AR',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:${visit.id}@mutqin.sa`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
      `DTSTART:${startTime}`,
      `DTEND:${endTime}`,
      `SUMMARY:${title}`,
      `DESCRIPTION:${description}`,
      `LOCATION:${location}`,
      'STATUS:CONFIRMED',
      'BEGIN:VALARM',
      'TRIGGER:-PT2H',
      'ACTION:DISPLAY',
      'DESCRIPTION:تذكير: موعد زيارة صيانة مُتقَن المجدولة اليوم',
      'END:VALARM',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `mutqin-visit-${visit.scheduledDate}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast(
      language === 'ar'
        ? 'تم تحميل ملف التقويم (.ics). متوافق مع Apple Calendar و Google Calendar!'
        : 'Calendar event (.ics) downloaded. Compatible with Apple & Google Calendar!'
    );
  };

  return (
    <MarketplaceContext.Provider
      value={{
        language,
        setLanguage,
        role,
        setRole,
        activeTab,
        setActiveTab,
        services,
        bookings,
        quotes,
        technicians,
        chemicalItems,
        selectedServiceForBooking,
        setSelectedServiceForBooking,
        isBookingModalOpen,
        setIsBookingModalOpen,
        isPaymentModalOpen,
        setIsPaymentModalOpen,
        pendingBookingData,
        setPendingBookingData,
        activeInvoice,
        setActiveInvoice,
        isAiModalOpen,
        setIsAiModalOpen,
        createBooking,
        updateBookingStatus,
        rescheduleBooking,
        submitBookingReview,
        updateBookingLiveTracking,
        selectedBookingForLiveTrack,
        setSelectedBookingForLiveTrack,
        selectedBookingForReview,
        setSelectedBookingForReview,
        createQuote,
        submitBid,
        awardBid,
        searchFilter,
        setSearchFilter,
        selectedRegion,
        setSelectedRegion,
        selectedCity,
        setSelectedCity,
        isMobileMenuOpen,
        setIsMobileMenuOpen,
        isCoverageModalOpen,
        setIsCoverageModalOpen,
        toastMessage,
        showToast,

        notifications,
        isNotificationCenterOpen,
        setIsNotificationCenterOpen,
        unreadCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        providerSettings,
        updateProviderSettings,
        blockedDayOffDates,
        toggleDayOffDate,
        customBlockedSlots,
        toggleBlockSlot,
        checkSlotAvailability,

        loyaltyProfile,
        loyaltyHistory,
        isLoyaltyModalOpen,
        setIsLoyaltyModalOpen,
        redeemPoints,
        earnPoints,

        subscriptionPlans,
        userSubscriptions,
        activeSubscription,
        isSubscriptionCheckoutOpen,
        setIsSubscriptionCheckoutOpen,
        selectedPlanForCheckout,
        setSelectedPlanForCheckout,
        subscribeToPlan,
        rescheduleRecurringVisit,
        skipRecurringVisit,
        toggleTechnicianLock,
        pauseSubscription,
        resumeSubscription,
        cancelSubscription,
        triggerSubscriptionBillingCycle,
        downloadCalendarEvent,
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  );
};

export const useMarketplace = () => {
  const context = useContext(MarketplaceContext);
  if (!context) {
    throw new Error('useMarketplace must be used within a MarketplaceProvider');
  }
  return context;
};
