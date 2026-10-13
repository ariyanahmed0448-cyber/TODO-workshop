export type Language = 'ar' | 'en';

export type UserRole = 'customer' | 'technician';

export type ServiceCategory = 'ac' | 'cleaning' | 'plumbing' | 'electrical' | 'pest_control';

export type SaudiPaymentMethod = 'mada' | 'apple_pay' | 'stc_pay' | 'credit_card';

export interface MarketplaceService {
  id: string;
  category: ServiceCategory;
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  basePriceSAR: number;
  pricingUnitEn: string;
  pricingUnitAr: string;
  rating: number;
  reviewCount: number;
  durationMinutes: number;
  image: string;
  featuresEn: string[];
  featuresAr: string[];
}

export interface Booking {
  id: string;
  customerId: string;
  customerName: string;
  serviceId: string;
  serviceTitleEn: string;
  serviceTitleAr: string;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  date: string;
  timeSlot: string;
  addressCity: string;
  addressDistrict: string;
  streetAddress?: string;
  latitude?: number;
  longitude?: number;
  locationAccuracyMeters?: number;
  nationalAddressCode?: string;
  locationDetectedViaGps?: boolean;
  notes?: string;
  totalSAR: number;
  paymentMethod: SaudiPaymentMethod;
  paymentStatus: 'paid' | 'pending';
  zatcaInvoiceNo: string;
  technicianName?: string;
  createdAt: string;
}

export interface SaudiLocationCoords {
  latitude: number;
  longitude: number;
  accuracyMeters?: number;
  cityId?: string;
  cityNameAr?: string;
  cityNameEn?: string;
  regionNameAr?: string;
  regionNameEn?: string;
  district?: string;
  streetAddress?: string;
  nationalAddressCode?: string;
  isGpsDetected?: boolean;
  distanceToCityCenterKm?: number;
}

export interface QuoteBid {
  id: string;
  quoteId: string;
  technicianId: string;
  technicianName: string;
  technicianRating: number;
  priceSAR: number;
  estimatedDays: number;
  proposal: string;
  submittedAt: string;
}

export interface Quote {
  id: string;
  customerId: string;
  customerName: string;
  title: string;
  description: string;
  category: ServiceCategory;
  city: string;
  district: string;
  budgetRangeSAR: string;
  status: 'open' | 'awarded' | 'completed';
  awardedBidId?: string;
  createdAt: string;
  bids: QuoteBid[];
}

export interface SaudiRegion {
  id: string;
  nameAr: string;
  nameEn: string;
  citiesCount: number;
}

export interface SaudiCity {
  id: string;
  regionId: string;
  regionNameAr: string;
  regionNameEn: string;
  nameAr: string;
  nameEn: string;
  districtsAr: string[];
  districtsEn: string[];
  lat?: number;
  lng?: number;
  postalCodePrefix?: string;
}

export interface TechnicianProfile {
  id: string;
  name: string;
  phone: string;
  city: string;
  regionId?: string;
  regionNameAr?: string;
  regionNameEn?: string;
  coverageCities?: string[];
  specialties: ServiceCategory[];
  rating: number;
  completedJobs: number;
  licenseNumber: string;
  isVerified: boolean;
  hourlyRateSAR: number;
}

export interface ChemicalSafetyItem {
  cid: number;
  name: string;
  arabicName: string;
  commonUseEn: string;
  commonUseAr: string;
  category: string;
  formula: string;
  molecularWeight: string;
  ghsLevel: 'Safe' | 'Moderate' | 'Strict Caution';
  ecoScore: number; // 1-10
  childPetSafe: boolean;
  indoorAirImpact: string;
  protectiveGear: string[];
  sasoComplianceStatus: 'Approved Eco' | 'Approved Industrial' | 'Restricted Residential';
}

export interface TimeSlotOption {
  id: string;
  labelAr: string;
  labelEn: string;
  startTime: string;
  endTime: string;
  period: 'morning' | 'noon' | 'afternoon' | 'evening';
  periodLabelAr: string;
  periodLabelEn: string;
}

export interface DaySchedule {
  date: string; // YYYY-MM-DD
  dayNameAr: string;
  dayNameEn: string;
  isWorkingDay: boolean;
  blockedSlotIds: string[];
}

export interface ProviderWeeklySettings {
  technicianId: string;
  defaultSlots: string[]; // Active slot IDs
  workingDays: number[]; // 0=Sun, 1=Mon, ..., 5=Fri, 6=Sat
  autoAcceptBookings: boolean;
  smsNotificationsEnabled: boolean;
}

export interface LoyaltyTransaction {
  id: string;
  type: 'earned' | 'redeemed' | 'bonus';
  points: number;
  sarEquivalent: number;
  descriptionAr: string;
  descriptionEn: string;
  date: string;
  bookingId?: string;
}

export type LoyaltyTier = 'silver' | 'gold' | 'platinum';

export interface UserLoyaltyProfile {
  pointsBalance: number;
  lifetimeEarned: number;
  tier: LoyaltyTier;
  tierNameAr: string;
  tierNameEn: string;
  nextTierPointsNeeded: number;
  earningMultiplier: number; // 1.0, 1.25, 1.5
}

export interface MarketplaceNotification {
  id: string;
  recipientRole: 'customer' | 'technician' | 'all';
  type: 'new_booking' | 'status_update' | 'reschedule' | 'bid_received';
  titleAr: string;
  titleEn: string;
  messageAr: string;
  messageEn: string;
  timestamp: string;
  isRead: boolean;
  bookingId?: string;
  quoteId?: string;
}

export interface ZatcaInvoice {
  invoiceNumber: string;
  issueDate: string;
  sellerName: string;
  vatRegistrationNumber: string;
  crNumber: string;
  customerName: string;
  serviceTitle: string;
  subtotalSAR: number;
  vatRate: number; // 0.15
  vatAmountSAR: number;
  totalSAR: number;
  paymentMethod: SaudiPaymentMethod;
  qrPayload: string;
}

export interface PubchemCompoundResult {
  found: boolean;
  cid?: number;
  title?: string;
  formula?: string;
  molecularWeight?: string;
  iupacName?: string;
  inchikey?: string;
  pubchemUrl?: string;
  provenance?: string;
  message?: string;
  error?: string;
}

export interface GroundingChunkSource {
  web?: {
    uri: string;
    title: string;
  };
}

export interface PaymentProcessResponse {
  success: boolean;
  transactionId: string;
  gateway: SaudiPaymentMethod;
  amountSAR: number;
  subtotalSAR: number;
  vatAmountSAR: number;
  invoiceNumber: string;
  zatcaQrPayload: string;
  merchantCR: string;
  status: 'APPROVED' | 'DECLINED';
  timestamp: string;
  messageEn: string;
  messageAr: string;
}

// ==========================================
// RECURRING HOME MAINTENANCE SUBSCRIPTION TYPES
// ==========================================

export type SubscriptionPlanType = 'cadence' | 'tiered_bundle' | 'flat_membership';
export type SubscriptionCadence = 'weekly' | 'biweekly' | 'monthly';
export type SubscriptionBillingCycle = 'monthly' | 'quarterly' | 'annual';
export type SubscriptionBillingMethod = SaudiPaymentMethod | 'wallet' | 'pay_per_visit';

export interface SubscriptionPlan {
  id: string;
  planType: SubscriptionPlanType;
  nameAr: string;
  nameEn: string;
  taglineAr: string;
  taglineEn: string;
  category: ServiceCategory | 'comprehensive';
  visitsPerMonth: number;
  basePriceSAR: number;
  originalPriceSAR: number;
  discountPercentage: number;
  cadence: SubscriptionCadence;
  homeSizeTier: 'apartment' | 'villa' | 'large_estate' | 'all';
  homeSizeLabelAr: string;
  homeSizeLabelEn: string;
  includedServicesAr: string[];
  includedServicesEn: string[];
  perksAr: string[];
  perksEn: string[];
  popularBadge?: boolean;
  emergencyResponseHours: number; // e.g. 2 for VIP, 4 for regular
  colorGradient: string;
}

export interface RecurringVisitChecklistItem {
  titleAr: string;
  titleEn: string;
  completed: boolean;
}

export interface RecurringVisit {
  id: string;
  subscriptionId: string;
  visitNumber: number; // e.g. 1 of 4
  scheduledDate: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "09:00 - 11:30"
  status: 'scheduled' | 'in_progress' | 'completed' | 'skipped' | 'rescheduled';
  serviceTitleAr: string;
  serviceTitleEn: string;
  technicianId?: string;
  technicianName?: string;
  technicianPhone?: string;
  technicianRating?: number;
  notes?: string;
  checklist: RecurringVisitChecklistItem[];
  completedAt?: string;
  zatcaInvoiceNo?: string;
}

export interface SubscriptionBillingInvoiceItem {
  id: string;
  date: string;
  billingCycleNumber: number;
  amountSAR: number;
  subtotalSAR: number;
  vatSAR: number;
  invoiceNo: string;
  method: SubscriptionBillingMethod;
  status: 'paid' | 'pending' | 'failed';
  zatcaQrPayload: string;
  downloadUrl?: string;
}

export interface UserSubscription {
  id: string;
  planId: string;
  planNameAr: string;
  planNameEn: string;
  planType: SubscriptionPlanType;
  category: ServiceCategory | 'comprehensive';
  status: 'active' | 'paused' | 'cancelled';
  cadence: SubscriptionCadence;
  billingCadence: SubscriptionBillingCycle;
  preferredDayOfWeek: number; // 0=Sun, 1=Mon, ..., 6=Sat
  preferredTimeSlot: string;
  preferredTechnicianId?: string;
  preferredTechnicianName?: string;
  lockPreferredTechnician: boolean;
  city: string;
  district: string;
  streetAddress?: string;
  nationalAddressCode?: string;
  latitude?: number;
  longitude?: number;
  startDate: string;
  nextRenewalDate: string;
  nextVisitDate: string;
  billingMethod: SubscriptionBillingMethod;
  pricePerCycleSAR: number;
  vatSAR: number;
  totalPerCycleSAR: number;
  autoRenew: boolean;
  visits: RecurringVisit[];
  billingHistory: SubscriptionBillingInvoiceItem[];
  createdAt: string;
}


