import React, { useState, useEffect } from 'react';
import { Booking, LiveTrackingTelemetry } from '../types';
import { useMarketplace } from '../context/MarketplaceContext';
import {
  MapPin,
  Navigation,
  Phone,
  MessageSquare,
  ShieldCheck,
  Clock,
  Compass,
  Maximize2,
  Minimize2,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  Building2,
  Car,
  X,
  Share2,
} from 'lucide-react';

interface LiveTrackingMapProps {
  booking: Booking;
  isModal?: boolean;
  onClose?: () => void;
  onOpenReviewModal?: (booking: Booking) => void;
}

export const LiveTrackingMap: React.FC<LiveTrackingMapProps> = ({
  booking,
  isModal = false,
  onClose,
  onOpenReviewModal,
}) => {
  const { language, updateBookingStatus, updateBookingLiveTracking, showToast } = useMarketplace();
  const isAr = language === 'ar';

  const defaultTracking: LiveTrackingTelemetry = booking.liveTracking || {
    technicianLat: (booking.latitude || 24.8192) - 0.015,
    technicianLng: (booking.longitude || 46.6621) - 0.012,
    etaMinutes: 12,
    distanceKm: 3.4,
    currentRoadAr: 'طريق الملك فهد متجهاً شمالاً نحو تقاطع أنس بن مالك',
    currentRoadEn: 'King Fahd Rd heading North towards Anas Ibn Malik',
    speedKmh: 46,
    vehicleModelAr: 'تويوتا هايس - فان صيانة متكامل ومجهز',
    vehicleModelEn: 'Toyota HiAce - Service Van',
    plateNumberAr: 'أ ب ج ١ ٩ ٨ ٢',
    plateNumberEn: 'ABJ 1982',
    technicianPhone: booking.technicianPhone || '+966 50 123 4567',
    routeProgressPercent: 55,
    milestone: 'en_route',
    lastUpdatedTime: 'الآن',
  };

  const [progress, setProgress] = useState(defaultTracking.routeProgressPercent);
  const [isPlaying, setIsPlaying] = useState(true);
  const [mapTheme, setMapTheme] = useState<'light' | 'dark'>('light');
  const [copiedLink, setCopiedLink] = useState(false);

  // Dynamic values calculated along the route path
  const remainingDistance = Math.max(0.2, Math.round(((100 - progress) / 100) * 6.5 * 10) / 10);
  const remainingMinutes = Math.max(1, Math.round((remainingDistance / 35) * 60));
  const currentSpeed = progress >= 98 ? 0 : isPlaying ? 42 + Math.floor(Math.sin(progress) * 8) : 0;

  // Waypoints along simulated Riyadh route (SVG normalized coordinates from 0 to 100)
  // Tech starts at (15, 80), curves through (35, 55), (60, 45), to customer home at (85, 20)
  const getCoordinatesAlongPath = (t: number) => {
    // t is 0.0 to 1.0
    // Quadratic / Cubic Bezier interpolation:
    // P0 = (15, 78) [Dispatch Station]
    // P1 = (40, 68) [Intersection 1]
    // P2 = (55, 35) [Intersection 2]
    // P3 = (82, 22) [Customer House]
    const u = 1 - t;
    const tt = t * t;
    const uu = u * u;
    const uuu = uu * u;
    const ttt = tt * t;

    const p0 = { x: 15, y: 78 };
    const p1 = { x: 42, y: 68 };
    const p2 = { x: 55, y: 35 };
    const p3 = { x: 82, y: 22 };

    const x = uuu * p0.x + 3 * uu * t * p1.x + 3 * u * tt * p2.x + ttt * p3.x;
    const y = uuu * p0.y + 3 * uu * t * p1.y + 3 * u * tt * p2.y + ttt * p3.y;

    // Calculate heading angle
    const dx = 3 * uu * (p1.x - p0.x) + 6 * u * t * (p2.x - p1.x) + 3 * tt * (p3.x - p2.x);
    const dy = 3 * uu * (p1.y - p0.y) + 6 * u * t * (p2.y - p1.y) + 3 * tt * (p3.y - p2.y);
    const angleRad = Math.atan2(dy, dx);
    const angleDeg = (angleRad * 180) / Math.PI;

    return { x, y, angleDeg };
  };

  const techPos = getCoordinatesAlongPath(progress / 100);

  // Auto animation loop to simulate live vehicle movement
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 98) {
          setIsPlaying(false);
          return 98;
        }
        return Math.min(98, prev + 1.2);
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [isPlaying]);

  // Keep tracking telemetry synchronized
  useEffect(() => {
    const milestone: LiveTrackingTelemetry['milestone'] =
      progress >= 95 ? 'arrived' : progress >= 75 ? 'approaching' : 'en_route';

    updateBookingLiveTracking(booking.id, {
      routeProgressPercent: Math.round(progress),
      etaMinutes: remainingMinutes,
      distanceKm: remainingDistance,
      speedKmh: currentSpeed,
      milestone,
    });
  }, [progress]);

  const handleSimulateArrival = () => {
    setProgress(100);
    setIsPlaying(false);
    updateBookingStatus(booking.id, 'completed');
    showToast(
      isAr
        ? 'تم وصول الفني وإتمام الزيارة بنجاح! يمكنك الآن تقييم الخدمة.'
        : 'Technician arrived & service completed! You can now rate the service.'
    );
    if (onOpenReviewModal) {
      setTimeout(() => {
        onOpenReviewModal({ ...booking, status: 'completed' });
      }, 600);
    }
  };

  const handleShareTrackingLink = () => {
    setCopiedLink(true);
    navigator.clipboard?.writeText(window.location.href);
    showToast(
      isAr
        ? 'تم نسخ رابط تتبع موقع الفني المباشر للمشاركة مع العائلة.'
        : 'Live technician tracking link copied to share with family.'
    );
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const techName = booking.technicianName || (isAr ? 'م. فيصل العتيبي' : 'Eng. Faisal Al-Otaibi');
  const nationalAddress = booking.nationalAddressCode || 'RDHA3492';

  return (
    <div
      className={`relative overflow-hidden bg-white border border-slate-200 rounded-3xl shadow-lg transition-all ${
        isModal ? 'max-w-4xl w-full p-4 sm:p-6' : 'p-4 sm:p-6 my-4'
      }`}
    >
      {/* Top Header & Telemetry Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-emerald-800 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              <Car className="w-6 h-6 text-white" />
            </div>
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                {isAr ? 'تتبع مسار الفني المباشر' : 'Live Technician En Route'}
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>{isAr ? 'تحديث لحظي' : 'Real-time GPS'}</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
              <span>{isAr ? 'حجز رقم' : 'Booking'} #{booking.id}</span>
              <span>•</span>
              <span>{isAr ? booking.serviceTitleAr : booking.serviceTitleEn}</span>
            </p>
          </div>
        </div>

        {/* Action Controls in Header */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            onClick={() => setMapTheme(mapTheme === 'light' ? 'dark' : 'light')}
            className="px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            title={isAr ? 'تبديل نمط الخريطة' : 'Toggle Map Theme'}
          >
            {mapTheme === 'light' ? '🌙' : '☀️'}
          </button>

          <button
            onClick={handleShareTrackingLink}
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <Share2 className="w-3.5 h-3.5 text-slate-500" />
            <span>{copiedLink ? (isAr ? 'تم النسخ!' : 'Copied!') : isAr ? 'مشاركة' : 'Share'}</span>
          </button>

          {isModal && onClose && (
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Primary KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4">
        <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-2xl">
          <div className="flex items-center gap-1.5 text-emerald-800 text-[11px] font-semibold">
            <Clock className="w-3.5 h-3.5" />
            <span>{isAr ? 'الوقت المتوقع للوصول' : 'Estimated Arrival'}</span>
          </div>
          <div className="text-xl font-black text-emerald-950 mt-1 tabular-nums">
            {progress >= 98 ? (isAr ? 'وصل الآن' : 'Arrived') : `${remainingMinutes} ${isAr ? 'دقيقة' : 'mins'}`}
          </div>
          <div className="text-[10px] text-emerald-700 mt-0.5">
            {progress >= 98 ? (isAr ? 'عند باب المنزل' : 'At doorstep') : isAr ? 'حركة المرور سالكة' : 'Normal traffic'}
          </div>
        </div>

        <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl">
          <div className="flex items-center gap-1.5 text-slate-600 text-[11px] font-semibold">
            <Navigation className="w-3.5 h-3.5 text-emerald-700" />
            <span>{isAr ? 'المسافة المتبقية' : 'Distance Remaining'}</span>
          </div>
          <div className="text-xl font-black text-slate-900 mt-1 tabular-nums">
            {progress >= 98 ? '0' : remainingDistance} <span className="text-xs font-bold text-slate-500">{isAr ? 'كم' : 'km'}</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5 truncate">
            {isAr ? defaultTracking.currentRoadAr : defaultTracking.currentRoadEn}
          </div>
        </div>

        <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl">
          <div className="flex items-center gap-1.5 text-slate-600 text-[11px] font-semibold">
            <Compass className="w-3.5 h-3.5 text-blue-600" />
            <span>{isAr ? 'السرعة الحالية' : 'Current Speed'}</span>
          </div>
          <div className="text-xl font-black text-slate-900 mt-1 tabular-nums">
            {currentSpeed} <span className="text-xs font-bold text-slate-500">{isAr ? 'كم/س' : 'km/h'}</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            {isAr ? defaultTracking.vehicleModelAr : defaultTracking.vehicleModelEn}
          </div>
        </div>

        <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-2xl">
          <div className="flex items-center gap-1.5 text-amber-900 text-[11px] font-semibold">
            <Building2 className="w-3.5 h-3.5 text-amber-700" />
            <span>{isAr ? 'العنوان الوطني المحدد' : 'National Address'}</span>
          </div>
          <div className="text-base font-bold font-mono text-amber-950 mt-1">
            {nationalAddress}
          </div>
          <div className="text-[10px] text-amber-800 mt-0.5 truncate">
            {booking.addressDistrict} - {booking.addressCity}
          </div>
        </div>
      </div>

      {/* Styled Interactive SVG Map Placeholder */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-inner bg-slate-100 h-72 sm:h-88">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full object-cover select-none"
          style={{
            backgroundColor: mapTheme === 'light' ? '#F4F5F8' : '#111827',
          }}
        >
          <defs>
            {/* Patterns for Urban Blocks */}
            <pattern id="urbanGrid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path
                d="M 10 0 L 0 0 0 10"
                fill="none"
                stroke={mapTheme === 'light' ? '#E5E7EB' : '#1F2937'}
                strokeWidth="0.4"
              />
            </pattern>

            {/* Gradient for Route Path */}
            <linearGradient id="routeGradient" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#059669" />
              <stop offset="60%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>

            {/* Shadow for markers */}
            <filter id="markerShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" floodOpacity="0.25" />
            </filter>
          </defs>

          {/* District Ground Base */}
          <rect width="100" height="100" fill="url(#urbanGrid)" />

          {/* Green Parks / Saudi Landmarks Zones */}
          <path
            d="M 5 5 Q 15 2 25 8 T 35 22 Q 22 28 8 20 Z"
            fill={mapTheme === 'light' ? '#DCFCE7' : '#064E3B'}
            opacity="0.8"
          />
          <path
            d="M 68 65 Q 85 62 95 72 T 88 95 Q 70 92 65 80 Z"
            fill={mapTheme === 'light' ? '#DCFCE7' : '#064E3B'}
            opacity="0.7"
          />

          {/* Secondary Roads & Street Grid */}
          <g stroke={mapTheme === 'light' ? '#E2E8F0' : '#1E293B'} strokeWidth="1.2" strokeLinecap="round">
            <line x1="0" y1="30" x2="100" y2="30" />
            <line x1="0" y1="50" x2="100" y2="50" />
            <line x1="0" y1="70" x2="100" y2="70" />
            <line x1="25" y1="0" x2="25" y2="100" />
            <line x1="50" y1="0" x2="50" y2="100" />
            <line x1="75" y1="0" x2="75" y2="100" />
          </g>

          {/* Major Highway 1 (e.g. King Fahd Road diagonal) */}
          <path
            d="M 5 95 L 30 70 L 60 40 L 95 10"
            stroke={mapTheme === 'light' ? '#CBD5E1' : '#334155'}
            strokeWidth="4"
            fill="none"
          />
          <path
            d="M 5 95 L 30 70 L 60 40 L 95 10"
            stroke={mapTheme === 'light' ? '#FFFFFF' : '#475569'}
            strokeWidth="3"
            strokeDasharray="2 2"
            fill="none"
          />

          {/* Highway 2 (Northern Ring Road horizontal curve) */}
          <path
            d="M 0 45 Q 50 40 100 48"
            stroke={mapTheme === 'light' ? '#CBD5E1' : '#334155'}
            strokeWidth="3.5"
            fill="none"
          />

          {/* Full Planned Route Polyline / Bezier Curve (Dispatched to Destination) */}
          {/* P0=(15,78), P1=(42,68), P2=(55,35), P3=(82,22) */}
          <path
            d="M 15 78 C 42 68, 55 35, 82 22"
            fill="none"
            stroke={mapTheme === 'light' ? '#CBD5E1' : '#374151'}
            strokeWidth="2.5"
            strokeDasharray="1.5 1.5"
            strokeLinecap="round"
          />

          {/* Dynamic Completed Traversed Route */}
          <path
            d="M 15 78 C 42 68, 55 35, 82 22"
            fill="none"
            stroke="url(#routeGradient)"
            strokeWidth="3"
            strokeDasharray="100"
            strokeDashoffset={100 - progress}
            strokeLinecap="round"
            className="transition-all duration-300"
          />

          {/* Waypoint Labels on Map */}
          <text
            x="14"
            y="88"
            fill={mapTheme === 'light' ? '#64748B' : '#94A3B8'}
            fontSize="2.4"
            fontWeight="bold"
            textAnchor="middle"
          >
            {isAr ? 'مركز انطلاق الفني' : 'Dispatch Hub'}
          </text>

          <text
            x="48"
            y="65"
            fill={mapTheme === 'light' ? '#64748B' : '#94A3B8'}
            fontSize="2.2"
            textAnchor="middle"
          >
            {isAr ? 'طريق الملك فهد' : 'King Fahd Rd'}
          </text>

          <text
            x="82"
            y="14"
            fill="#065F46"
            fontSize="2.6"
            fontWeight="bold"
            textAnchor="middle"
          >
            {isAr ? 'منزل العميل (الوجهة)' : 'Client Residence'}
          </text>

          {/* Start Point Pin (Dispatch Station) */}
          <circle cx="15" cy="78" r="2" fill="#64748B" />
          <circle cx="15" cy="78" r="0.8" fill="#FFFFFF" />

          {/* Destination Pin (Customer Residence) with Pulsing Waves */}
          <g transform="translate(82, 22)">
            {/* Animated Ripple Pulse */}
            <circle cx="0" cy="0" r="5" fill="#10B981" opacity="0.2" className="animate-ping" />
            <circle cx="0" cy="0" r="3.5" fill="#10B981" opacity="0.3" />

            {/* Pin Body */}
            <path
              d="M 0 0 C -2.5 -2.5, -2.5 -6, 0 -8.5 C 2.5 -6, 2.5 -2.5, 0 0 Z"
              fill="#065F46"
              filter="url(#markerShadow)"
            />
            <circle cx="0" cy="-5.5" r="1.5" fill="#FFFFFF" />

            {/* House Icon inside pin */}
            <path
              d="M -0.8 -5.5 L 0 -6.3 L 0.8 -5.5 L 0.8 -4.7 L -0.8 -4.7 Z"
              fill="#065F46"
            />
          </g>

          {/* Moving Technician Vehicle Marker */}
          <g
            transform={`translate(${techPos.x}, ${techPos.y})`}
            filter="url(#markerShadow)"
            className="transition-all duration-300"
          >
            {/* Radar wave pulse */}
            <circle cx="0" cy="0" r="4.5" fill="#047857" opacity="0.25" className="animate-pulse" />

            {/* Vehicle outer circle */}
            <circle cx="0" cy="0" r="3.2" fill="#065F46" stroke="#FFFFFF" strokeWidth="0.8" />

            {/* Vehicle icon rotated to heading */}
            <g transform={`rotate(${techPos.angleDeg + 90})`}>
              <path
                d="M 0 -1.6 L 1.2 1.4 L 0 0.8 L -1.2 1.4 Z"
                fill="#FFFFFF"
              />
            </g>

            {/* Live Name Pill Above Vehicle */}
            <g transform="translate(0, -5)">
              <rect
                x="-11"
                y="-3"
                width="22"
                height="4.2"
                rx="2"
                fill="#0F172A"
                opacity="0.9"
              />
              <text
                x="0"
                y="-0.4"
                fill="#FFFFFF"
                fontSize="1.9"
                fontWeight="bold"
                textAnchor="middle"
              >
                {techName.split(' ')[0]} {techName.split(' ')[1]}
              </text>
            </g>
          </g>
        </svg>

        {/* Floating Map Overlays */}
        {/* Top-Right: Map Orientation & Coordinates */}
        <div className="absolute top-3 right-3 rtl:right-auto rtl:left-3 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-xl shadow-xs border border-slate-200/80 text-[10px] font-mono text-slate-700 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping"></span>
          <span>
            {booking.latitude?.toFixed(4) || '24.8192'}°N, {booking.longitude?.toFixed(4) || '46.6621'}°E
          </span>
        </div>

        {/* Bottom-Center: Route Progress Bar and Play/Pause Simulator Control */}
        <div className="absolute bottom-3 inset-x-3 sm:inset-x-6 bg-white/95 backdrop-blur-md p-2.5 sm:p-3 rounded-2xl shadow-md border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-1.5 rounded-xl bg-emerald-800 text-white hover:bg-emerald-900 transition-colors shrink-0"
              title={isPlaying ? (isAr ? 'إيقاف مؤقت' : 'Pause') : isAr ? 'تشغيل المحاكاة' : 'Play'}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={() => {
                setProgress(15);
                setIsPlaying(true);
              }}
              className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors shrink-0"
              title={isAr ? 'إعادة البداية' : 'Restart Route'}
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            <div className="flex-1 sm:w-56">
              <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium mb-1">
                <span>{isAr ? 'تقدم المسار المباشر' : 'Route Progress'}</span>
                <span className="font-mono font-bold text-emerald-900">{Math.round(progress)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={(e) => {
                  setProgress(Number(e.target.value));
                  setIsPlaying(false);
                }}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-800"
              />
            </div>
          </div>

          {/* Quick Simulate Arrival Trigger */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={handleSimulateArrival}
              className="w-full sm:w-auto px-3 py-1.5 text-xs font-bold text-emerald-950 bg-emerald-100 hover:bg-emerald-200 rounded-xl transition-colors border border-emerald-300 flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
              <span>{isAr ? 'محاكاة وصول الفني وإتمام الخدمة' : 'Simulate Arrival & Complete'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Technician & Vehicle Info Card + Direct Contacts */}
      <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-700 to-emerald-950 text-white flex items-center justify-center font-bold text-base shadow-xs shrink-0">
            {techName.split(' ')[0]?.[0]}
            {techName.split(' ')[1]?.[0]}
          </div>

          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm text-slate-900">{techName}</span>
              <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                <ShieldCheck className="w-3 h-3 text-emerald-700" />
                <span>{isAr ? 'فني معتمد ومفحوص' : 'Certified Tech'}</span>
              </span>
            </div>

            <div className="text-xs text-slate-600 flex flex-wrap items-center gap-2">
              <span>⭐ 4.95 (412 {isAr ? 'تقييم' : 'reviews'})</span>
              <span>•</span>
              <span className="font-mono bg-white px-2 py-0.5 rounded-md border border-slate-200 text-slate-700">
                {isAr ? defaultTracking.plateNumberAr : defaultTracking.plateNumberEn}
              </span>
              <span>•</span>
              <span className="text-slate-500">
                {isAr ? defaultTracking.vehicleModelAr : defaultTracking.vehicleModelEn}
              </span>
            </div>
          </div>
        </div>

        {/* Contact Buttons */}
        <div className="flex items-center gap-2 self-end md:self-center">
          <a
            href={`tel:${defaultTracking.technicianPhone}`}
            className="px-3.5 py-2 text-xs font-bold text-slate-800 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <Phone className="w-3.5 h-3.5 text-emerald-800" />
            <span>{isAr ? 'اتصال بالفني' : 'Call Tech'}</span>
          </a>

          <a
            href={`https://wa.me/${defaultTracking.technicianPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
              isAr
                ? `مرحباً مهندس ${techName}، بخصوص حجز الخدمة #${booking.id} في ${booking.addressDistrict}.`
                : `Hello Eng. ${techName}, regarding booking #${booking.id}.`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 text-xs font-bold text-emerald-950 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-800" />
            <span>{isAr ? 'محادثة واتساب' : 'WhatsApp'}</span>
          </a>
        </div>
      </div>

      {/* Real-time Journey Milestones Steps */}
      <div className="mt-4 pt-3 border-t border-slate-100">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
          <div className="flex items-center gap-1.5 text-emerald-800 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>{isAr ? '1. تم قبول الموعد' : '1. Order Confirmed'}</span>
          </div>

          <div className="flex items-center gap-1.5 text-emerald-800 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>{isAr ? '2. انطلق من المركز' : '2. Departed Hub'}</span>
          </div>

          <div
            className={`flex items-center gap-1.5 font-bold ${
              progress >= 95 ? 'text-emerald-800' : 'text-blue-700'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping shrink-0"></span>
            <span>{isAr ? '3. في الطريق لموقعك' : '3. En Route (Live)'}</span>
          </div>

          <div
            className={`flex items-center gap-1.5 ${
              progress >= 98 ? 'text-emerald-800 font-bold' : 'text-slate-400'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full shrink-0 ${
                progress >= 98 ? 'bg-emerald-600' : 'bg-slate-300'
              }`}
            ></span>
            <span>{isAr ? '4. الوصول وبدء الخدمة' : '4. Arrival & Start'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
