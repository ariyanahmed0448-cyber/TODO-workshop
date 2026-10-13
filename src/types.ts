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
  notes?: string;
  totalSAR: number;
  paymentMethod: SaudiPaymentMethod;
  paymentStatus: 'paid' | 'pending';
  zatcaInvoiceNo: string;
  technicianName?: string;
  createdAt: string;
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

export interface TechnicianProfile {
  id: string;
  name: string;
  phone: string;
  city: string;
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
