# Mutqin Care Pass: Recurring Home Maintenance Subscriptions

A comprehensive recurring service subscription platform for regular home maintenance across Saudi Arabia (weekly, bi-weekly, monthly) featuring automated visit scheduling, flexible visit rescheduling/skipping, recurring billing integration (Mada, Apple Pay, STC Pay, and Wallet auto-debit), and ZATCA Phase-2 compliant recurring tax invoices.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following requirements and architecture have been confirmed through user clarification:
> - **Subscription Plans**: Full support for all tiers—cadence-based packages (weekly, bi-weekly, monthly), property-tailored bundles (Apartment, Villa, Luxury Palace), and a dedicated "Mutqin Care Pass" membership with recurring discounts and loyalty point multipliers.
> - **Recurring Billing Modes**: Multi-method recurring billing engine supporting automated Mada/credit card auto-debit simulation, digital wallet balance auto-deduction with low-balance alerts, and a pay-per-visit upon technician dispatch model. Every billing cycle generates a compliant ZATCA Phase-2 recurring tax invoice.
> - **Automated Scheduling Flexibility**: Fully automated recurring schedule generator that projects upcoming visits, paired with one-tap skip, date/time slot rescheduling, dedicated technician locking, and calendar export (ICS / Google Calendar).

---

## 1. Overview & Core Concept

- **What It Does**: Empowers Saudi homeowners, tenants, and property managers to automate their recurring residential maintenance needs—including AC filter & coil cleaning, deep domestic cleaning, plumbing sanitization, electrical inspections, and pest barrier protection. Users select a recurring cadence, property tier, and preferred day/time slot, and Mutqin's automated scheduler creates a rolling timeline of service visits with zero manual rebooking required.
- **Target Audience / Persona**: Saudi families, villa owners, and working professionals in Riyadh, Jeddah, Dammam, and across all 13 provinces seeking continuous, hassle-free upkeep with vetted technicians and predictable monthly budgeting.
- **Key Value**: Eliminates repetitive single bookings, guarantees technician availability during peak seasons (such as Saudi summer heatwaves for AC servicing), provides up to 25% cost savings over ad-hoc bookings, and delivers complete control to pause, reschedule, or skip visits at will.

---

## 2. User Experience & Visual Design

### Key User Flows

1. **Discovery & Subscription Catalog (`/subscriptions` or Care Pass Tab)**:
   - Users browse curated recurring plans categorized by property scale (e.g., *Apartment Essential*, *Villa Comprehensive*, *Palace Executive*) and cadence (Weekly, Bi-Weekly, Monthly).
   - Dynamic price calculator displays the per-visit cost, monthly total in SAR, savings percentage, and Mutqin Points multiplier.
2. **Subscription Setup & Automated Slot Selection**:
   - 3-step setup modal:
     - **Step 1: Plan & Frequency**: Choose service category, cadence, and property size.
     - **Step 2: Preferred Schedule & Dispatch City**: Select preferred day of the week (e.g., Every Saturday), time window (Morning 8-12, Afternoon 1-5, Evening 5-9), city/district (with browser GPS location detection pre-filling the National Address), and optional dedicated technician lock.
     - **Step 3: Billing & Recurring Payment Authorization**: Select payment method (Mada, Apple Pay, STC Pay, or Wallet), preview the recurring billing schedule and VAT breakdown, and authorize the automated subscription.
3. **Subscriber Management Dashboard**:
   - Active subscription card showcasing status (`Active`, `Paused`, `Renewing Soon`), next scheduled visit countdown, billing cadence, and accumulated savings.
   - **Interactive Visit Timeline**: Visual list of upcoming projected visits with status pills (`Scheduled`, `Dispatched`, `Completed`, `Skipped`).
   - **Visit Actions**: One-tap **"تخطي الزيارة / Skip Visit"** (shifts billing credit to the next cycle) and **"إعادة الجدولة / Reschedule"** (picks an alternative date/time slot).
   - **Subscription Controls**: Pause subscription, Resume, Change payment method, or Cancel with immediate confirmation toast.
4. **Recurring Billing & Invoice Hub**:
   - Access recurring billing history showing monthly transaction receipts, payment statuses, and instant view/download of ZATCA Phase-2 QR e-invoices for each cycle.

### Visual Identity & Theme

- **Aesthetic Direction**: High-trust, utilitarian luxury tailored for Saudi domestic services. Clean whitespace, crisp hairline borders, deep emerald accents reflecting Saudi identity, and gold accents for premium membership tiers.
- **Color Palette & Mood**:
  - Dominant Neutral Canvas (60%): `--background` (`#FBFBFC` light, `#0F172A` dark)
  - Structural Surfaces (30%): `--card` (`#FFFFFF`), `--border` (`rgba(0, 0, 0, 0.08)` hairline dividers), `--muted` (`#64748B`)
  - Accent Budget (10%): `--primary` (`#065F46` / `emerald-800`), `--accent` (`#047857` / `emerald-700`), `--highlight` (`#F59E0B` / `amber-500` for VIP Care Pass badges)
- **Typography & Hierarchy**:
  - Display Font: `Plus Jakarta Sans` / `IBM Plex Sans Arabic` for authoritative headings.
  - Body Prose: `Plus Jakarta Sans` / system Arabic sans at 15px with balanced line-height.
  - Tabular Figures: `tabular-nums` for all SAR prices, VAT calculations, and schedule dates.
- **Zero-Pill Metadata Discipline**:
  - Informational metadata (frequencies, visit numbers, invoice codes) rendered with unboxed typographic separators (`·`, `/`).
  - Active filter controls and cadence selectors styled as segmented tab buttons.
- **Interactive Feedback & Motion**:
  - Micro-interactions $\le 150\text{ms}$ on plan selection.
  - Smooth drawer transitions for visit reschedule modal.
  - Tactile confirmation checkmarks on subscription creation and visit skip actions.

---

## 3. Key Product Decisions & Trade-Offs

### Decision 1: Client-Side Automated Rolling Schedule Generation vs Static Placeholders
- **Chosen Approach**: Deterministic schedule generator function (`generateSubscriptionVisits`) that calculates real upcoming dates starting from the subscriber's chosen start date, respecting provider working days, Islamic weekends (Friday/Saturday), and user-selected time slots for the entire subscription term (rolling 4, 8, or 12 visits).
- **Why**: Delivers instant, realistic schedule projections without requiring external server cron jobs, while allowing interactive mutations (skip, reschedule, dispatch) in real time.
- **Trade-off**: Requires client-side state reconciliation if the user changes base cadence, handled cleanly through reactive context updates.

### Decision 2: Multi-Modal Recurring Billing Simulation
- **Chosen Approach**: Full simulation of recurring payment gateways: Mada automated recurring tokenization, Saudi digital wallet deduction with balance alerts, and pay-per-visit on dispatch. Each auto-renewal logs a dedicated transaction in `subscriptionInvoices` and automatically updates the user's Mutqin Points.
- **Why**: Allows users to test and experience authentic Saudi fintech workflows (Mada debit, STC Pay, Apple Pay) and see accurate ZATCA tax invoice receipts for recurring charges.

### Decision 3: Unified Navigation & Mobile First Ergonomics
- **Chosen Approach**: Embed "باقات الصيانة الدورية / Subscriptions" directly into the desktop Navbar, Mobile Bottom Navigation bar (as a dedicated view or via the Services dropdown), and Mobile Drawer.
- **Why**: Ensures effortless mobile access across smartphones throughout Saudi Arabia without exceeding the 15% mobile sticky height cap.

---

## 4. Technical Architecture & Data Strategy

### Architecture & Component Diagram

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                 MUTQIN APPLICATION ROOT                                │
│                                                                                        │
│  ┌──────────────────────────────────────────────────────────────────────────────────┐  │
│  │                              MarketplaceContext                                  │  │
│  │   • activeSubscriptions: UserSubscription[]                                      │  │
│  │   • subscriptionPlans: SubscriptionPlan[]                                        │  │
│  │   • subscribeToPlan(planId, options): void                                       │  │
│  │   • pauseSubscription / resumeSubscription / cancelSubscription                  │  │
│  │   • rescheduleSubscriptionVisit / skipSubscriptionVisit                          │  │
│  │   • triggerRecurringBillingCycle(subId): void                                    │  │
│  └────────────────────────────────────────┬─────────────────────────────────────────┘  │
│                                           │                                            │
│            ┌──────────────────────────────┼─────────────────────────────┐              │
│            ▼                              ▼                             ▼              │
│  ┌──────────────────┐          ┌──────────────────────┐      ┌──────────────────────┐  │
│  │ Navbar & Mobile  │          │   SubscriptionsTab   │      │ SubscriptionManager  │  │
│  │ Navigation Links │          │  (Browse & Purchase) │      │  (Subscriber Portal) │  │
│  │ • Nav Care Pass  │          │  • Cadence Switcher  │      │  • Active Sub Card   │  │
│  │ • Mobile Drawer  │          │  • Property Bundles  │      │  • Upcoming Timeline │  │
│  │ • Quick Actions  │          │  • Savings Breakdown │      │  • Skip/Reschedule   │  │
│  └──────────────────┘          └──────────┬───────────┘      └──────────┬───────────┘  │
│                                           │                             │              │
│                                           ▼                             ▼              │
│                                ┌──────────────────────┐      ┌──────────────────────┐  │
│                                │ SubscriptionCheckout │      │ RecurringInvoiceHub  │  │
│                                │ • 3-Step Setup Modal │      │ • ZATCA QR Invoices  │  │
│                                │ • GPS National Addr  │      │ • Billing History    │  │
│                                │ • Payment Gateway    │      │ • Payment Auto-debit │  │
│                                └──────────────────────┘      └──────────────────────┘  │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### Data Models (`src/types.ts`)

```typescript
export type SubscriptionCadence = 'weekly' | 'biweekly' | 'monthly';
export type PropertyType = 'apartment' | 'villa' | 'palace';
export type SubscriptionStatus = 'active' | 'paused' | 'cancelled' | 'expired';
export type RecurringPaymentType = 'mada_auto_debit' | 'wallet_auto_deduct' | 'pay_per_visit';

export interface SubscriptionPlan {
  id: string;
  category: ServiceCategory;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  cadence: SubscriptionCadence;
  visitsPerMonth: number;
  propertyType: PropertyType;
  pricePerVisitSAR: number;
  monthlyTotalSAR: number;
  discountPercentage: number;
  includedFeaturesAr: string[];
  includedFeaturesEn: string[];
  popularBadge?: boolean;
}

export interface SubscriptionVisit {
  id: string;
  subscriptionId: string;
  visitNumber: number;
  scheduledDate: string; // YYYY-MM-DD
  timeSlot: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'skipped' | 'rescheduled';
  technicianName?: string;
  notes?: string;
  completedAt?: string;
}

export interface UserSubscription {
  id: string;
  planId: string;
  planNameAr: string;
  planNameEn: string;
  category: ServiceCategory;
  cadence: SubscriptionCadence;
  propertyType: PropertyType;
  status: SubscriptionStatus;
  startDate: string;
  nextBillingDate: string;
  nextVisitDate: string;
  preferredDayOfWeek: number; // 0=Sun .. 6=Sat
  preferredTimeSlot: string;
  addressCity: string;
  addressDistrict: string;
  streetAddress?: string;
  latitude?: number;
  longitude?: number;
  monthlyTotalSAR: number;
  paymentMethod: SaudiPaymentMethod;
  paymentType: RecurringPaymentType;
  dedicatedTechnicianId?: string;
  dedicatedTechnicianName?: string;
  visits: SubscriptionVisit[];
  createdAt: string;
  autoRenew: boolean;
}

export interface RecurringBillingRecord {
  id: string;
  subscriptionId: string;
  billingDate: string;
  amountSAR: number;
  vatAmountSAR: number;
  paymentMethod: SaudiPaymentMethod;
  status: 'paid' | 'pending' | 'failed';
  zatcaInvoiceNo: string;
  qrCodeSvgData?: string;
}
```

### Interactive Component & State Mapping

1. **`SubscriptionPlansCatalog.tsx`**:
   - Filter tabs for Cadence (`Weekly`, `Bi-Weekly`, `Monthly`) and Property scale (`Apartment`, `Villa`, `Palace`).
   - Cards display visit counts, price comparison vs single bookings, bulleted perks, and "اشترك الآن / Subscribe" CTA button.
2. **`SubscriptionCheckoutModal.tsx`**:
   - Step 1: Confirm plan parameters, add-on requests.
   - Step 2: Preferred day of week selector, time window slot, integrated `SaudiLocationPicker` to capture GPS & National Address.
   - Step 3: Payment authorization (Mada, Apple Pay, STC Pay, Wallet), terms acceptance, VAT calculation, and instant activation.
3. **`SubscriptionDashboard.tsx`**:
   - Overview metrics: Active plans count, next scheduled visit countdown, total SAR saved, Mutqin points earned.
   - Interactive upcoming visit timeline with one-tap skip and reschedule modals.
   - Billing cycle receipt viewer launching `ZatcaInvoiceModal`.
4. **`App.tsx` & Navigation**:
   - Add `'subscriptions'` tab to `Navbar.tsx`, `MobileBottomNav.tsx`, and `MobileDrawer.tsx`.
   - Seamless switching between standard on-demand services and recurring subscriptions.
