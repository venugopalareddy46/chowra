// Browser Notification API service for real-time shipment milestone and AWB telemetry alerts

export type NotificationPermissionState = 'granted' | 'denied' | 'default' | 'unsupported';

export interface ShipmentNotificationPayload {
  awbNumber: string;
  milestoneTitle: string;
  description: string;
  statusCode?: 'IN_TRANSIT' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CUSTOMS_CLEARANCE' | 'BOOKED' | string;
  location?: string;
  timestamp?: string;
  onClickUrl?: string;
}

const STORAGE_KEY_SUBSCRIBED_AWBS = 'chowra_notification_subscribed_awbs_v1';

// Base64 SVG Icon for notification badge
const NOTIFICATION_ICON_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="%2300bf72"><rect width="100" height="100" rx="20" fill="%23020617"/><path d="M20 35 L50 20 L80 35 L50 50 Z" fill="%2300bf72"/><path d="M20 38 L50 53 L50 82 L20 67 Z" fill="%23008793"/><path d="M50 53 L80 38 L80 67 L50 82 Z" fill="%23a8eb12"/></svg>`;

export function isNotificationSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

export function getNotificationPermission(): NotificationPermissionState {
  if (!isNotificationSupported()) {
    return 'unsupported';
  }
  return Notification.permission as NotificationPermissionState;
}

export async function requestNotificationPermission(): Promise<NotificationPermissionState> {
  if (!isNotificationSupported()) {
    return 'unsupported';
  }

  try {
    const permission = await Notification.requestPermission();
    return permission as NotificationPermissionState;
  } catch (error) {
    console.warn('Failed to request browser notification permission:', error);
    return Notification.permission as NotificationPermissionState;
  }
}

/**
 * Play a clean, subtle dual-tone synthesized dispatch chime using Web Audio API
 */
export function playNotificationChime(): void {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    const audioCtx = new AudioContextClass();
    const osc1 = audioCtx.createOscillator();
    const osc2 = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    const now = audioCtx.currentTime;

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, now); // D5
    osc1.frequency.exponentialRampToValueAtTime(880, now + 0.15); // A5

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(440, now); // A4
    osc2.frequency.exponentialRampToValueAtTime(659.25, now + 0.15); // E5

    gainNode.gain.setValueAtTime(0.09, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.35);
    osc2.stop(now + 0.35);
  } catch {
    // Autoplay or audio context permission restricted
  }
}

/**
 * Sends a real-time native browser notification using Notification API
 * Returns true if the native notification was successfully triggered
 */
export function sendShipmentStatusNotification(
  payload: ShipmentNotificationPayload,
  onNotificationClick?: () => void
): boolean {
  // Always play the subtle chime
  playNotificationChime();

  if (!isNotificationSupported() || Notification.permission !== 'granted') {
    return false;
  }

  try {
    const title = `📦 ${payload.awbNumber}: ${payload.milestoneTitle}`;
    const body = `${payload.location ? `[${payload.location}] ` : ''}${payload.description}`;

    const options: NotificationOptions = {
      body,
      icon: NOTIFICATION_ICON_SVG,
      badge: NOTIFICATION_ICON_SVG,
      tag: `shipment-status-${payload.awbNumber}`, // Group/update notifications for same AWB
      requireInteraction: false,
      silent: false,
    };

    const notification = new Notification(title, options);

    notification.onclick = () => {
      try {
        window.focus();
      } catch {
        // Window focus ignored if cross-origin
      }

      if (onNotificationClick) {
        onNotificationClick();
      } else {
        const trackerEl = document.getElementById('tracker');
        if (trackerEl) {
          trackerEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }

      notification.close();
    };

    return true;
  } catch (error) {
    console.warn('Could not dispatch browser Notification:', error);
    return false;
  }
}

// --- Watchlist / Subscription Persistence ---

export interface SmsEmailNotificationConfig {
  awbNumber: string;
  smsEnabled: boolean;
  emailEnabled: boolean;
  phoneNumber: string;
  emailAddress: string;
  notifyOnPickup: boolean;
  notifyOnInscan: boolean;
  notifyOnOutForDelivery: boolean;
  notifyOnDelivered: boolean;
  lastUpdated?: string;
}

const STORAGE_PREFIX_SMS_EMAIL = 'chowra_sms_email_alerts_';

export function getSmsEmailConfig(awb: string): SmsEmailNotificationConfig {
  const cleanAwb = (awb || '').trim().toUpperCase();
  const defaultVal: SmsEmailNotificationConfig = {
    awbNumber: cleanAwb,
    smsEnabled: false,
    emailEnabled: false,
    phoneNumber: '+91 98200 44810',
    emailAddress: 'tracking.alerts@chowralogistics.example',
    notifyOnPickup: true,
    notifyOnInscan: true,
    notifyOnOutForDelivery: true,
    notifyOnDelivered: true,
    lastUpdated: new Date().toISOString(),
  };

  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX_SMS_EMAIL}${cleanAwb}`);
    if (!raw) return defaultVal;
    return { ...defaultVal, ...JSON.parse(raw) };
  } catch {
    return defaultVal;
  }
}

export function saveSmsEmailConfig(config: SmsEmailNotificationConfig): void {
  try {
    const cleanAwb = config.awbNumber.trim().toUpperCase();
    const updated = {
      ...config,
      awbNumber: cleanAwb,
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem(`${STORAGE_PREFIX_SMS_EMAIL}${cleanAwb}`, JSON.stringify(updated));
  } catch (e) {
    console.warn('Failed to save SMS/Email notification config:', e);
  }
}

export function maskPhoneNumber(phone: string): string {
  if (!phone) return '+91 98*** **810';
  const clean = phone.trim();
  if (clean.length < 6) return clean;
  return `${clean.slice(0, 5)} *** ${clean.slice(-3)}`;
}

export function maskEmail(email: string): string {
  if (!email || !email.includes('@')) return 'al***@company.in';
  const [user, domain] = email.split('@');
  const maskedUser = user.length > 2 ? `${user.slice(0, 2)}***` : `${user}***`;
  return `${maskedUser}@${domain}`;
}

export function getSubscribedAwbs(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SUBSCRIBED_AWBS);
    if (!raw) return ['CHW-8942-IN'];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : ['CHW-8942-IN'];
  } catch {
    return ['CHW-8942-IN'];
  }
}

export function isAwbSubscribed(awb: string): boolean {
  const list = getSubscribedAwbs();
  return list.includes(awb.trim().toUpperCase());
}

export function toggleAwbSubscription(awb: string): boolean {
  const cleanAwb = awb.trim().toUpperCase();
  const current = getSubscribedAwbs();
  let updated: string[];

  if (current.includes(cleanAwb)) {
    updated = current.filter((item) => item !== cleanAwb);
  } else {
    updated = [...current, cleanAwb];
  }

  try {
    localStorage.setItem(STORAGE_KEY_SUBSCRIBED_AWBS, JSON.stringify(updated));
  } catch {
    // Storage quota or disabled
  }

  return updated.includes(cleanAwb);
}
