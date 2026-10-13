import { SaudiCity, SaudiLocationCoords } from '../types';
import { SAUDI_CITIES } from '../data/mockData';

// Earth radius in kilometers for Haversine calculation
const EARTH_RADIUS_KM = 6371;

/**
 * Calculates great-circle distance between two GPS coordinates in kilometers.
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(EARTH_RADIUS_KM * c * 10) / 10;
}

/**
 * Coordinates lookup table for all major Saudi cities to ensure accurate reverse geocoding
 */
export const SAUDI_CITY_COORDINATES: Record<string, { lat: number; lng: number; postal: string; shortPrefix: string }> = {
  // Riyadh Region
  'riyadh-city': { lat: 24.7136, lng: 46.6753, postal: '11564', shortPrefix: 'RYDH' },
  'kharj-city': { lat: 24.1554, lng: 47.3119, postal: '11942', shortPrefix: 'KHRJ' },
  'diriyah-city': { lat: 24.7342, lng: 46.5750, postal: '13711', shortPrefix: 'DIRI' },
  'majmaah-city': { lat: 25.9042, lng: 45.3436, postal: '11952', shortPrefix: 'MJMA' },
  'duwadimi-city': { lat: 24.5074, lng: 44.4088, postal: '11911', shortPrefix: 'DUWA' },
  'dawasir-city': { lat: 20.4522, lng: 44.7869, postal: '11991', shortPrefix: 'DWSR' },

  // Makkah Region
  'jeddah-city': { lat: 21.5433, lng: 39.1728, postal: '21577', shortPrefix: 'JDDA' },
  'makkah-city': { lat: 21.3891, lng: 39.8579, postal: '21955', shortPrefix: 'MKKA' },
  'taif-city': { lat: 21.2854, lng: 40.4222, postal: '21944', shortPrefix: 'TAIF' },
  'rabigh-city': { lat: 22.7984, lng: 39.0349, postal: '21911', shortPrefix: 'RABG' },
  'qunfudhah-city': { lat: 19.1281, lng: 41.0787, postal: '21912', shortPrefix: 'QNFD' },

  // Eastern Province
  'dammam-city': { lat: 26.4207, lng: 50.0888, postal: '31411', shortPrefix: 'DMMM' },
  'khobar-city': { lat: 26.2172, lng: 50.1971, postal: '31952', shortPrefix: 'KHBR' },
  'dhahran-city': { lat: 26.2361, lng: 50.0393, postal: '31261', shortPrefix: 'DHRN' },
  'ahsa-city': { lat: 25.3835, lng: 49.5864, postal: '31982', shortPrefix: 'AHSA' },
  'jubail-city': { lat: 27.0046, lng: 49.6582, postal: '31951', shortPrefix: 'JUBL' },
  'qatif-city': { lat: 26.5196, lng: 50.0125, postal: '31911', shortPrefix: 'QATF' },
  'hafr-city': { lat: 28.4328, lng: 45.9708, postal: '31991', shortPrefix: 'HAFR' },
  'khafji-city': { lat: 28.4181, lng: 48.4913, postal: '31971', shortPrefix: 'KHFJ' },

  // Madinah Region
  'madinah-city': { lat: 24.5247, lng: 39.5692, postal: '41411', shortPrefix: 'MDNA' },
  'yanbu-city': { lat: 24.0895, lng: 38.0637, postal: '41912', shortPrefix: 'YNBU' },
  'ula-city': { lat: 26.6174, lng: 37.9234, postal: '41311', shortPrefix: 'AULA' },

  // Al-Qassim Region
  'buraidah-city': { lat: 26.3592, lng: 43.9818, postal: '51411', shortPrefix: 'BRDH' },
  'unaizah-city': { lat: 26.0843, lng: 43.9934, postal: '51911', shortPrefix: 'ONZH' },
  'rass-city': { lat: 25.8694, lng: 43.4975, postal: '51921', shortPrefix: 'RASS' },

  // Asir Region
  'abha-city': { lat: 18.2164, lng: 42.5053, postal: '61411', shortPrefix: 'ABHA' },
  'khamis-city': { lat: 18.3000, lng: 42.7333, postal: '61961', shortPrefix: 'KHMS' },
  'namas-city': { lat: 19.1174, lng: 42.1311, postal: '61977', shortPrefix: 'NMAS' },
  'bisha-city': { lat: 19.9969, lng: 42.6044, postal: '61922', shortPrefix: 'BSHA' },

  // Tabuk & NEOM
  'tabuk-city': { lat: 28.3835, lng: 36.5662, postal: '71411', shortPrefix: 'TABK' },
  'neom-city': { lat: 28.0039, lng: 35.3027, postal: '71000', shortPrefix: 'NEOM' },
  'duba-city': { lat: 27.3514, lng: 35.6901, postal: '71911', shortPrefix: 'DUBA' },

  // Hail Region
  'hail-city': { lat: 27.5114, lng: 41.7208, postal: '81411', shortPrefix: 'HAIL' },
  'baqa-city': { lat: 27.8447, lng: 42.3853, postal: '81911', shortPrefix: 'BAQA' },

  // Northern Borders
  'arar-city': { lat: 30.9753, lng: 41.0381, postal: '91411', shortPrefix: 'ARAR' },
  'rafha-city': { lat: 29.6267, lng: 43.4939, postal: '91911', shortPrefix: 'RFHA' },
  'turaif-city': { lat: 31.6725, lng: 38.6637, postal: '91921', shortPrefix: 'TURF' },

  // Jazan Region
  'jazan-city': { lat: 16.8892, lng: 42.5511, postal: '45142', shortPrefix: 'JAZN' },
  'sabya-city': { lat: 17.1495, lng: 42.6254, postal: '45931', shortPrefix: 'SBYA' },
  'abu-arish-city': { lat: 16.9691, lng: 42.8306, postal: '45911', shortPrefix: 'ABAR' },

  // Najran Region
  'najran-city': { lat: 17.4924, lng: 44.1277, postal: '75411', shortPrefix: 'NJRN' },
  'sharurah-city': { lat: 17.4856, lng: 47.1147, postal: '75911', shortPrefix: 'SHRR' },

  // Al-Bahah Region
  'bahah-city': { lat: 20.0129, lng: 41.4677, postal: '65522', shortPrefix: 'BAHA' },
  'baljurashi-city': { lat: 19.8606, lng: 41.6192, postal: '65632', shortPrefix: 'BLJR' },

  // Al-Jouf Region
  'sakaka-city': { lat: 29.9697, lng: 40.2064, postal: '72341', shortPrefix: 'SKKA' },
  'qurayyat-city': { lat: 31.3318, lng: 37.3428, postal: '77411', shortPrefix: 'QRYT' },
};

/**
 * Given latitude and longitude, finds the nearest Saudi city in our database.
 */
export function findNearestSaudiCity(
  latitude: number,
  longitude: number,
  citiesList: SaudiCity[] = SAUDI_CITIES
): {
  city: SaudiCity;
  distanceKm: number;
  coords: { lat: number; lng: number };
} {
  let closestCity = citiesList[0];
  let minDistance = Infinity;
  let closestCoords = { lat: 24.7136, lng: 46.6753 };

  for (const city of citiesList) {
    const cityCoord = SAUDI_CITY_COORDINATES[city.id] || { lat: 24.7136, lng: 46.6753 };
    const dist = calculateDistanceKm(latitude, longitude, cityCoord.lat, cityCoord.lng);

    if (dist < minDistance) {
      minDistance = dist;
      closestCity = city;
      closestCoords = cityCoord;
    }
  }

  return {
    city: closestCity,
    distanceKm: minDistance,
    coords: closestCoords,
  };
}

/**
 * Generates a realistic Saudi National Address short code (4 letters + 4 digits)
 */
export function generateSaudiShortCode(cityId: string): string {
  const meta = SAUDI_CITY_COORDINATES[cityId] || { shortPrefix: 'RYDH' };
  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  return `${meta.shortPrefix}${randomDigits}`;
}

/**
 * Estimates technician dispatch ETA based on distance
 */
export function estimateDispatchEta(distanceKm: number): {
  etaMinutes: number;
  statusLabelAr: string;
  statusLabelEn: string;
} {
  if (distanceKm <= 5) {
    return {
      etaMinutes: 15 + Math.round(distanceKm * 2),
      statusLabelAr: 'فني معتمد متاح بالجوار · وصول سريع جداً',
      statusLabelEn: 'Certified Pro Nearby · Fast Dispatch',
    };
  }
  if (distanceKm <= 20) {
    return {
      etaMinutes: 25 + Math.round(distanceKm * 1.5),
      statusLabelAr: 'تغطية منتظمة بالحي · وصول قياسي',
      statusLabelEn: 'Standard Dispatch Zone · On-time Arrival',
    };
  }
  return {
    etaMinutes: 45 + Math.round(distanceKm * 0.8),
    statusLabelAr: 'توجيه فرقة فنية مجهزة · جدولة مسبقة',
    statusLabelEn: 'Regional Dispatch Unit · Pre-scheduled Arrival',
  };
}

/**
 * Requests location from browser Geolocation API with graceful fallback
 */
export function requestBrowserGeolocation(): Promise<{
  coords: { latitude: number; longitude: number; accuracy: number };
  isSimulatedFallback?: boolean;
}> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          coords: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: Math.round(position.coords.accuracy || 10),
          },
          isSimulatedFallback: false,
        });
      },
      (error) => {
        // In sandboxes or denied permissions, allow returning graceful friendly error
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 9000,
        maximumAge: 30000,
      }
    );
  });
}
