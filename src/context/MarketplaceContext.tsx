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
  createQuote: (quote: Omit<Quote, 'id' | 'bids' | 'createdAt'>) => void;
  submitBid: (quoteId: string, bid: Omit<QuoteBid, 'id' | 'submittedAt'>) => void;
  awardBid: (quoteId: string, bidId: string) => void;
  searchFilter: string;
  setSearchFilter: (query: string) => void;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
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
  const [selectedCity, setSelectedCity] = useState('الرياض');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

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
    const techNotif: MarketplaceNotification = {
      id: `notif-${Date.now()}-tech`,
      recipientRole: 'technician',
      type: 'new_booking',
      titleAr: 'طلب موعد صيانة جديد 🗓️',
      titleEn: 'New Service Booking Received 🗓️',
      messageAr: `حجز جديد: "${newBooking.serviceTitleAr}" بواسطة ${newBooking.customerName} ليوم ${newBooking.date} (${newBooking.timeSlot}) بقيمة ${newBooking.totalSAR} ر.س.`,
      messageEn: `New booking: "${newBooking.serviceTitleEn}" by ${newBooking.customerName} on ${newBooking.date} (${newBooking.timeSlot}) for ${newBooking.totalSAR} SAR.`,
      timestamp: 'الآن',
      isRead: false,
      bookingId: newBooking.id,
    };

    // Create confirmation notification for customer
    const custNotif: MarketplaceNotification = {
      id: `notif-${Date.now()}-cust`,
      recipientRole: 'customer',
      type: 'new_booking',
      titleAr: 'تم تأكيد موعدك وتوليد الفاتورة الضريبية 🧾',
      titleEn: 'Appointment Confirmed & ZATCA Invoice Generated 🧾',
      messageAr: `حجزك برقم #${newBooking.id} مؤكد مع المهندس فيصل العتيبي ليوم ${newBooking.date}. كسبت نقاط مكافآت وتم توليد فاتورة الزكاة والضريبة.`,
      messageEn: `Your booking #${newBooking.id} is confirmed with Eng. Faisal on ${newBooking.date}. You earned loyalty points and generated your ZATCA invoice.`,
      timestamp: 'الآن',
      isRead: false,
      bookingId: newBooking.id,
    };

    setNotifications((prev) => [techNotif, custNotif, ...prev]);

    showToast(
      language === 'ar'
        ? `تم تأكيد حجزك برقم #${newBooking.id} وكسب نقاط مُتقَن المكافئة!`
        : `Booking #${newBooking.id} confirmed and Mutqin Points awarded!`
    );
  };

  const updateBookingStatus = (bookingId: string, status: Booking['status']) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status } : b))
    );

    const targetBooking = bookings.find((b) => b.id === bookingId);
    const serviceName = targetBooking?.serviceTitleAr || 'الخدمة';

    const notif: MarketplaceNotification = {
      id: `notif-${Date.now()}-status`,
      recipientRole: 'customer',
      type: 'status_update',
      titleAr:
        status === 'in_progress'
          ? 'الفني في الطريق وبدء المعاينة 🚗'
          : status === 'completed'
          ? 'تم إتمام الصيانة بنجاح ✅'
          : 'تحديث حالة الموعد',
      titleEn:
        status === 'in_progress'
          ? 'Technician En Route 🚗'
          : status === 'completed'
          ? 'Service Completed ✅'
          : 'Booking Status Updated',
      messageAr:
        status === 'in_progress'
          ? `الفني في طريقه لموقعك لبدء خدمة ${serviceName}.`
          : status === 'completed'
          ? `تم الانتهاء من تنفيذ ${serviceName}، وتم توثيق الضمان لمدة 30 يوماً.`
          : `تم تحديث الموعد #${bookingId} إلى: ${status}`,
      messageEn:
        status === 'in_progress'
          ? `Technician is en route to your address for ${serviceName}.`
          : status === 'completed'
          ? `Service ${serviceName} completed with 30-day warranty active.`
          : `Booking #${bookingId} status is now ${status}.`,
      timestamp: 'الآن',
      isRead: false,
      bookingId,
    };

    setNotifications((prev) => [notif, ...prev]);

    showToast(
      language === 'ar'
        ? `تم تحديث حالة الحجز إلى: ${status}`
        : `Booking status updated to: ${status}`
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
        createQuote,
        submitBid,
        awardBid,
        searchFilter,
        setSearchFilter,
        selectedCity,
        setSelectedCity,
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
