# Mutqin (مُتقَن) — Instant Live Preview, Slot Scheduling & Mutqin Points Loyalty System

A comprehensive upgrade plan for the Mutqin Saudi service marketplace to resolve the live preview blank screen by binding Vite directly to port 3000, alongside delivering the complete time-slot booking system, technician schedule management, dispatch notifications, and the Mutqin Points customer loyalty rewards program.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following decisions incorporate the user's confirmed choices from Phase 1 clarification:

- **Instant Live Preview Fix**: Switch the dev server configuration to run Vite directly (`vite --port 3000 --host 0.0.0.0`) with custom lightweight dev middleware or proxy for API endpoints. This immediately resolves the blank preview screen caused by port mismatch (`PORT=8080` in backend vs. port 3000 required by preview iframe).
- **Time Slot & Scheduling System**:
  - Customers can pick specific morning, afternoon, and evening booking slots with real-time capacity and prayer-time buffer checks.
  - Service providers have full control in the Technician Portal to configure daily availability, block specific dates/holidays, set maximum jobs per slot, and toggle emergency callouts.
- **Dispatch Notifications**:
  - Real-time notification toasts and in-app Notification Center for booking creations, confirmations, reschedules, and technician arrival updates.
- **Mutqin Points (نقاط مُتقَن) Loyalty Program**:
  - Customers earn loyalty points on every completed booking based on spend (1 SAR = 1 Point, with tier multipliers: Silver 1.0x, Gold 1.25x, Platinum 1.5x).
  - Points can be redeemed as instant SAR cash discounts directly in the payment checkout (10 Points = 1 SAR discount) or converted into voucher codes in the dedicated Loyalty Rewards Hub.

---

## 1. Overview & Core Concept

- **What It Does**: Enables instant live rendering of the bilingual Mutqin marketplace in the AI Studio preview window, while equipping homeowners with a precision time-slot booking flow and a rewarding loyalty points system. Technicians gain schedule management tools and dispatch notifications to organize their daily workload across Saudi cities.
- **Target Audience / Persona**:
  - *Homeowners & Tenants*: Users booking AC maintenance, plumbing, electrical, and deep cleaning services who want flexible appointment scheduling and reward discounts on repeat visits.
  - *Technicians & Service Providers*: Saudi contractors managing daily service routes, buffer times, and dispatch notifications.
- **Key Value**: Immediate application preview visibility, predictable booking slots without scheduling conflicts, and long-term customer retention through Mutqin Points.

---

## 2. User Experience & Visual Design

### Key User Flows

1. **Instant Live Preview Loading**:
   - The preview window boots directly via Vite on `http://0.0.0.0:3000`, rendering the responsive bilingual marketplace interface without blank screen delays.
2. **Time Slot Booking Flow**:
   - Customer selects a service (e.g., Split AC Deep Chemical Cleaning).
   - In the booking modal, customer selects a date via an interactive calendar and views categorized time slots:
     - Morning (09:00 - 11:30)
     - Midday / Dhuhr buffer (12:30 - 14:30)
     - Afternoon / Asr (16:00 - 18:30)
     - Evening (19:30 - 22:00)
   - Real-time indicator displays slot status (Available, Low Availability, or Booked).
3. **Checkout with Mutqin Points Redemption**:
   - In the Payment Modal, customers view their current Mutqin Points balance and can check "Redeem Points for Discount".
   - An interactive slider or 1-click preset applies points (e.g., 500 Points = 50 SAR off), dynamically updating subtotal and ZATCA VAT calculations.
   - Points earned from the current transaction are prominently highlighted (`+280 نقاط مُتقَن`).
4. **Technician Schedule Management & Notification Center**:
   - In the Technician Portal, providers toggle weekly availability (Monday–Sunday), adjust shift hours, block vacation dates, and set slot capacities.
   - Provider receives real-time dispatch alerts whenever a new booking or reschedule request occurs, with direct action buttons (Accept, En Route, Complete).
5. **Mutqin Loyalty Hub Modal**:
   - Accessible via the Navbar points pill (`⭐ 450 نقطة`).
   - Displays tier status (Silver, Gold, Platinum), lifetime points progress bar, point history ledger, and voucher redemption catalog.

### Visual Identity & Theme

- **Aesthetic Direction**: Vision 2030 modern Saudi digital identity — uncluttered, clean, high-contrast, authoritative.
- **Color Palette (60-30-10)**:
  - *60% Canvas*: Off-white `#FBFBFC` (light mode) / Deep slate `#0B1118` (dark mode).
  - *30% Surfaces*: Crisp white cards with hairline borders (`border-slate-200/80`).
  - *10% Brand Accents*: Saudi Palm Emerald (`#0D6E4F`), Desert Amber (`#D97706` for Mutqin Points & ratings), and Sapphire Blue (`#2563EB` for Mada payment security).
- **Typography**: IBM Plex Sans Arabic for Arabic RTL, Plus Jakarta Sans for English LTR, and monospace tabular numerals (`tabular-nums`) for currency and time slots.
- **Anti-Slop Restraint**: Zero decorative floating pills on static text; clean unboxed metadata with typographic dots (`·`); interactive buttons designed as crisp tactile elements.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Vite Dev Server on Port 3000 for Instant Live Preview**
  - *Chosen Approach*: Update `package.json` dev script to `vite --port 3000 --host 0.0.0.0` and configure `vite.config.ts` with custom server handlers for `/api/*` routes.
  - *Why*: The AI Studio preview iframe strictly connects to port 3000. When `tsx server.ts` ran with `process.env.PORT=8080`, the iframe received connection refused or hung on a blank screen. Running Vite on port 3000 restores instant preview functionality.
- **Decision 2: Integrated Time Slot Availability Engine**
  - *Chosen Approach*: Maintain synchronized slot availability and technician rules in `MarketplaceContext`, preventing double-booking across concurrent services and factoring in technician day-off dates.
  - *Why*: Provides immediate client-side validation feedback without waiting for round-trip latency, with graceful fallback to alternative slots.
- **Decision 3: Transparent Mutqin Points Valuation (10 pts = 1 SAR)**
  - *Chosen Approach*: Standardize point earnings (1 SAR = 1 point) and redemptions (10 points = 1 SAR) with clear tier multipliers.
  - *Why*: Intuitive math that builds customer trust and mirrors leading Saudi loyalty ecosystems (e.g., Qitaf, Mokafaa).

---

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Mutqin Frontend (Vite)                          │
│                                                                        │
│ ┌────────────────────────────────────────────────────────────────────┐ │
│ │ Navbar: Brand │ Services │ Schedule Hub │ Mutqin Points ⭐ │ Bell 🔔│ │
│ └────────────────────────────────────────────────────────────────────┘ │
│ ┌─────────────────┐  ┌──────────────────┐  ┌─────────────────────────┐ │
│ │ Customer View   │  │ Provider Portal  │  │ Mutqin Loyalty Hub      │ │
│ │ - Slot Selector │  │ - Day/Slot Hours │  │ - Tier Status & Card    │ │
│ │ - Points Slider │  │ - Blocked Dates  │  │ - Discount Calculator   │ │
│ │ - Mada Checkout │  │ - Dispatch Alerts│  │ - Voucher Catalog       │ │
│ └────────┬────────┘  └────────┬─────────┘  └────────────┬────────────┘ │
│          │                    │                         │              │
│ ┌────────┴────────────────────┴─────────────────────────┴────────────┐ │
│ │ Marketplace Context: Slots, Bookings, Notifications, Loyalty Profile│ │
│ └─────────────────────────────┬──────────────────────────────────────┘ │
└───────────────────────────────┼────────────────────────────────────────┘
                                │ Local State / Vite Dev Middleware (/api/*)
┌───────────────────────────────▼────────────────────────────────────────┐
│               Simulated Local Services & Gemini Proxy Engine           │
│ ┌─────────────────────────┐ ┌──────────────────────┐ ┌───────────────┐ │
│ │ ZATCA Tax & Invoicing   │ │ PubChem Safety Lab   │ │ Gemini AI Hub │ │
│ │ - QR Phase 2 Payload    │ │ - Chemical CIDs      │ │ - Chat & Diag │ │
│ │ - Instant SAR Ledger    │ │ - GHS Classifications│ │ - Estimates   │ │
│ └─────────────────────────┘ └──────────────────────┘ └───────────────┘ │
└────────────────────────────────────────────────────────────────────────┘
```

### Data Models

1. **TimeSlot**: `{ id, labelAr, labelEn, startTime, endTime, period ('morning'|'afternoon'|'evening'), isAvailable, capacity, bookedCount }`
2. **ProviderSchedule**: `{ dayOfWeek, isWorkingDay, shifts, maxConcurrentJobs, blockedDates }`
3. **LoyaltyProfile**: `{ currentPoints, lifetimePoints, tier ('Silver'|'Gold'|'Platinum'), earningMultiplier, transactions: LoyaltyTransaction[] }`
4. **MarketplaceNotification**: `{ id, recipientRole ('customer'|'technician'), type, titleAr, titleEn, messageAr, messageEn, timestamp, read, bookingId }`

---

## 5. Verification & Delivery Plan

1. **Dev Server & Preview Validation**: Configure Vite on port 3000, restart dev server, and verify that the application renders immediately in the preview iframe.
2. **Booking & Slot Selection Verification**: Test date and time slot selection in `BookingModal`, ensuring booked/full slots cannot be reserved and valid slots proceed to checkout.
3. **Provider Schedule Controls Verification**: Test updating shift hours and blocking dates in `TechnicianPortal`, ensuring updates reflect dynamically on customer availability.
4. **Loyalty System Verification**: Verify point accrual upon booking completion, point deduction when redeemed at checkout, and tier progression in `LoyaltyModal`.
5. **Codebase Linting & Compilation**: Execute `compile_applet` and `lint_applet` to ensure zero compilation or TypeScript errors.
