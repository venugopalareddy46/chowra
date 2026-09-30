import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, CheckCircle2, Clock, AlertCircle, Copy, Check, FileText, 
  MapPin, Plane, Truck, ArrowRight, ShieldCheck, Thermometer, User, 
  Building2, ExternalLink, Bell, BellRing, BellOff, Zap, Play, Pause, 
  Radio, Volume2, Sparkles, RefreshCw, X, MessageSquare, Mail, Smartphone, 
  Send, Settings, CheckCheck, ToggleLeft, ToggleRight
} from 'lucide-react';
import { ShipmentData } from '../types/logistics';
import { getShipmentByAwb } from '../data/mockShipments';
import { 
  getNotificationPermission, 
  requestNotificationPermission, 
  sendShipmentStatusNotification, 
  isAwbSubscribed, 
  toggleAwbSubscription, 
  playNotificationChime,
  NotificationPermissionState,
  getSmsEmailConfig,
  saveSmsEmailConfig,
  maskPhoneNumber,
  maskEmail,
  SmsEmailNotificationConfig
} from '../services/notificationService';
import { advanceShipmentMilestone } from '../data/shipmentMilestoneAdvancer';
import { ShipmentVisualMapTracker } from './ShipmentVisualMapTracker';

interface ShipmentTrackerProps {
  currentAwb: string;
  onAwbChange: (awb: string) => void;
}

export const ShipmentTracker: React.FC<ShipmentTrackerProps> = ({ currentAwb, onAwbChange }) => {
  const [inputAwb, setInputAwb] = useState(currentAwb || 'CHW-8942-IN');
  const [shipment, setShipment] = useState<ShipmentData>(getShipmentByAwb(currentAwb || 'CHW-8942-IN'));
  const [copied, setCopied] = useState(false);
  const [showPodModal, setShowPodModal] = useState(false);

  // SMS & Email Real-Time Consignment Notification State for this specific tracking ID
  const [smsEmailConfig, setSmsEmailConfig] = useState<SmsEmailNotificationConfig>(() =>
    getSmsEmailConfig(currentAwb || 'CHW-8942-IN')
  );
  const [showSmsEmailModal, setShowSmsEmailModal] = useState<boolean>(false);
  const [tempPhone, setTempPhone] = useState<string>(smsEmailConfig.phoneNumber);
  const [tempEmail, setTempEmail] = useState<string>(smsEmailConfig.emailAddress);
  const [tempSmsEnabled, setTempSmsEnabled] = useState<boolean>(smsEmailConfig.smsEnabled);
  const [tempEmailEnabled, setTempEmailEnabled] = useState<boolean>(smsEmailConfig.emailEnabled);
  const [tempNotifyOnPickup, setTempNotifyOnPickup] = useState<boolean>(smsEmailConfig.notifyOnPickup);
  const [tempNotifyOnInscan, setTempNotifyOnInscan] = useState<boolean>(smsEmailConfig.notifyOnInscan);
  const [tempNotifyOnOutForDelivery, setTempNotifyOnOutForDelivery] = useState<boolean>(smsEmailConfig.notifyOnOutForDelivery);
  const [tempNotifyOnDelivered, setTempNotifyOnDelivered] = useState<boolean>(smsEmailConfig.notifyOnDelivered);
  const [modalSavedToast, setModalSavedToast] = useState<string | null>(null);

  // Real-Time Browser Notification System State
  const [permission, setPermission] = useState<NotificationPermissionState>(getNotificationPermission());
  const [isSubscribed, setIsSubscribed] = useState<boolean>(() => isAwbSubscribed(currentAwb || 'CHW-8942-IN'));
  const [isAutoStreaming, setIsAutoStreaming] = useState<boolean>(false);
  const [showNotificationToast, setShowNotificationToast] = useState(false);
  const [recentNotification, setRecentNotification] = useState<{
    awb: string;
    title: string;
    description: string;
    location?: string;
    statusCode: string;
    timestamp: string;
    isNativeSent: boolean;
  } | null>(null);

  const toastTimeoutRef = useRef<number | null>(null);

  // Sync if parent passes updated AWB
  useEffect(() => {
    if (currentAwb && currentAwb !== shipment.awbNumber) {
      setInputAwb(currentAwb);
      setShipment(getShipmentByAwb(currentAwb));
      setIsSubscribed(isAwbSubscribed(currentAwb));
    }
  }, [currentAwb, shipment.awbNumber]);

  // Sync SMS/Email config when active consignment AWB changes
  useEffect(() => {
    const config = getSmsEmailConfig(shipment.awbNumber);
    setSmsEmailConfig(config);
    setTempPhone(config.phoneNumber);
    setTempEmail(config.emailAddress);
    setTempSmsEnabled(config.smsEnabled);
    setTempEmailEnabled(config.emailEnabled);
    setTempNotifyOnPickup(config.notifyOnPickup);
    setTempNotifyOnInscan(config.notifyOnInscan);
    setTempNotifyOnOutForDelivery(config.notifyOnOutForDelivery);
    setTempNotifyOnDelivered(config.notifyOnDelivered);
  }, [shipment.awbNumber]);

  // Sync permission state on window focus or mount
  useEffect(() => {
    const handleFocus = () => {
      setPermission(getNotificationPermission());
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const triggerInAppToast = (data: {
    awb: string;
    title: string;
    description: string;
    location?: string;
    statusCode: string;
    isNativeSent: boolean;
  }) => {
    if (toastTimeoutRef.current) {
      window.clearTimeout(toastTimeoutRef.current);
    }
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setRecentNotification({ ...data, timestamp });
    setShowNotificationToast(true);
    toastTimeoutRef.current = window.setTimeout(() => {
      setShowNotificationToast(false);
    }, 5500);
  };

  const handleEnableBrowserNotifications = async () => {
    const res = await requestNotificationPermission();
    setPermission(res);

    if (res === 'granted') {
      if (!isSubscribed) {
        toggleAwbSubscription(shipment.awbNumber);
        setIsSubscribed(true);
      }
      playNotificationChime();
      const sent = sendShipmentStatusNotification({
        awbNumber: shipment.awbNumber,
        milestoneTitle: 'Real-Time Browser Notifications Enabled',
        description: `You will now receive desktop alerts whenever status changes for consignment #${shipment.awbNumber}.`,
        statusCode: shipment.statusCode,
        location: shipment.origin.city,
      });

      triggerInAppToast({
        awb: shipment.awbNumber,
        title: 'Browser Notifications Authorized',
        description: `Desktop push notifications active for AWB #${shipment.awbNumber}.`,
        location: shipment.origin.city,
        statusCode: shipment.statusCode,
        isNativeSent: sent,
      });
    } else if (res === 'denied') {
      triggerInAppToast({
        awb: shipment.awbNumber,
        title: 'Browser Notifications Blocked',
        description: 'Please enable notifications in your browser address bar settings to receive desktop push alerts.',
        statusCode: shipment.statusCode,
        isNativeSent: false,
      });
    }
  };

  const handleToggleSubscription = async () => {
    if (permission === 'default') {
      await handleEnableBrowserNotifications();
      return;
    }

    const newState = toggleAwbSubscription(shipment.awbNumber);
    setIsSubscribed(newState);

    if (newState) {
      playNotificationChime();
      triggerInAppToast({
        awb: shipment.awbNumber,
        title: 'Subscribed to AWB Telemetry',
        description: `Milestone alerts active for consignment #${shipment.awbNumber}.`,
        statusCode: shipment.statusCode,
        isNativeSent: permission === 'granted',
      });
    }
  };

  const handleToggleSmsDirect = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    const updated: SmsEmailNotificationConfig = {
      ...smsEmailConfig,
      smsEnabled: !smsEmailConfig.smsEnabled,
    };
    setSmsEmailConfig(updated);
    saveSmsEmailConfig(updated);
    playNotificationChime();

    if (updated.smsEnabled) {
      triggerInAppToast({
        awb: shipment.awbNumber,
        title: 'SMS Alerts Activated',
        description: `Real-time SMS alerts enabled for #${shipment.awbNumber}. Automated dispatches will be sent to ${maskPhoneNumber(updated.phoneNumber)}.`,
        statusCode: shipment.statusCode,
        isNativeSent: false,
      });
    } else {
      triggerInAppToast({
        awb: shipment.awbNumber,
        title: 'SMS Alerts Paused',
        description: `SMS notifications disabled for consignment #${shipment.awbNumber}.`,
        statusCode: shipment.statusCode,
        isNativeSent: false,
      });
    }
  };

  const handleToggleEmailDirect = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    const updated: SmsEmailNotificationConfig = {
      ...smsEmailConfig,
      emailEnabled: !smsEmailConfig.emailEnabled,
    };
    setSmsEmailConfig(updated);
    saveSmsEmailConfig(updated);
    playNotificationChime();

    if (updated.emailEnabled) {
      triggerInAppToast({
        awb: shipment.awbNumber,
        title: 'Email Alerts Activated',
        description: `Consignment telemetry email alerts active for #${shipment.awbNumber}. Sent to ${maskEmail(updated.emailAddress)}.`,
        statusCode: shipment.statusCode,
        isNativeSent: false,
      });
    } else {
      triggerInAppToast({
        awb: shipment.awbNumber,
        title: 'Email Alerts Paused',
        description: `Email notifications disabled for consignment #${shipment.awbNumber}.`,
        statusCode: shipment.statusCode,
        isNativeSent: false,
      });
    }
  };

  const handleOpenSmsEmailModal = () => {
    const config = getSmsEmailConfig(shipment.awbNumber);
    setSmsEmailConfig(config);
    setTempPhone(config.phoneNumber);
    setTempEmail(config.emailAddress);
    setTempSmsEnabled(config.smsEnabled);
    setTempEmailEnabled(config.emailEnabled);
    setTempNotifyOnPickup(config.notifyOnPickup);
    setTempNotifyOnInscan(config.notifyOnInscan);
    setTempNotifyOnOutForDelivery(config.notifyOnOutForDelivery);
    setTempNotifyOnDelivered(config.notifyOnDelivered);
    setModalSavedToast(null);
    setShowSmsEmailModal(true);
  };

  const handleSaveSmsEmailSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: SmsEmailNotificationConfig = {
      awbNumber: shipment.awbNumber,
      smsEnabled: tempSmsEnabled,
      emailEnabled: tempEmailEnabled,
      phoneNumber: tempPhone.trim() || '+91 98200 44810',
      emailAddress: tempEmail.trim() || 'tracking.alerts@chowralogistics.example',
      notifyOnPickup: tempNotifyOnPickup,
      notifyOnInscan: tempNotifyOnInscan,
      notifyOnOutForDelivery: tempNotifyOnOutForDelivery,
      notifyOnDelivered: tempNotifyOnDelivered,
      lastUpdated: new Date().toISOString(),
    };
    setSmsEmailConfig(updated);
    saveSmsEmailConfig(updated);
    playNotificationChime();
    setModalSavedToast(`Alert preferences saved for #${shipment.awbNumber}!`);

    setTimeout(() => {
      setModalSavedToast(null);
      setShowSmsEmailModal(false);
    }, 1100);

    triggerInAppToast({
      awb: shipment.awbNumber,
      title: 'Alert Preferences Updated',
      description: `SMS (${updated.smsEnabled ? 'ON' : 'OFF'}) & Email (${updated.emailEnabled ? 'ON' : 'OFF'}) configured for Consignment #${shipment.awbNumber}.`,
      statusCode: shipment.statusCode,
      isNativeSent: false,
    });
  };

  const handleSendTestSmsEmail = () => {
    playNotificationChime();
    triggerInAppToast({
      awb: shipment.awbNumber,
      title: 'Real-Time Dispatch Test Sent',
      description: `📲 SMS test delivered to ${maskPhoneNumber(smsEmailConfig.phoneNumber)} & ✉️ Email dispatch delivered to ${maskEmail(smsEmailConfig.emailAddress)} for AWB #${shipment.awbNumber}.`,
      statusCode: shipment.statusCode,
      isNativeSent: permission === 'granted',
    });
  };

  const triggerStatusEvent = (isAutomated = false) => {
    const result = advanceShipmentMilestone(shipment);
    setShipment(result.updatedShipment);

    // Notify if explicitly triggered or if user subscribed this AWB or enabled SMS/Email
    const shouldNotify = !isAutomated || isSubscribed || smsEmailConfig.smsEnabled || smsEmailConfig.emailEnabled;

    if (shouldNotify) {
      const isNativeSent = sendShipmentStatusNotification({
        awbNumber: result.updatedShipment.awbNumber,
        milestoneTitle: result.eventTitle,
        description: result.eventDescription,
        statusCode: result.statusCode,
        location: result.location,
      });

      const channelsDispatched: string[] = [];
      if (smsEmailConfig.smsEnabled) channelsDispatched.push(`SMS to ${maskPhoneNumber(smsEmailConfig.phoneNumber)}`);
      if (smsEmailConfig.emailEnabled) channelsDispatched.push(`Email to ${maskEmail(smsEmailConfig.emailAddress)}`);

      const channelNote = channelsDispatched.length > 0 
        ? ` [Dispatched via ${channelsDispatched.join(' & ')}]` 
        : '';

      triggerInAppToast({
        awb: result.updatedShipment.awbNumber,
        title: result.eventTitle,
        description: `${result.eventDescription}${channelNote}`,
        location: result.location,
        statusCode: result.statusCode,
        isNativeSent,
      });
    }
  };

  const handleTestNotification = () => {
    playNotificationChime();
    const sent = sendShipmentStatusNotification({
      awbNumber: shipment.awbNumber,
      milestoneTitle: 'Chowra Control Tower Ping',
      description: `Telemetry test: Status is currently "${shipment.statusCode.replace('_', ' ')}" at ${shipment.origin.hub}.`,
      statusCode: shipment.statusCode,
      location: shipment.origin.city,
    });

    triggerInAppToast({
      awb: shipment.awbNumber,
      title: 'Control Tower Telemetry Ping',
      description: `Verified real-time dispatch channel for AWB #${shipment.awbNumber}.`,
      location: shipment.origin.city,
      statusCode: shipment.statusCode,
      isNativeSent: sent,
    });
  };

  // Auto-stream background simulation
  useEffect(() => {
    let timer: number | null = null;
    if (isAutoStreaming) {
      timer = window.setInterval(() => {
        triggerStatusEvent(true);
      }, 18000);
    }
    return () => {
      if (timer) window.clearInterval(timer);
    };
  }, [isAutoStreaming, shipment, isSubscribed]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputAwb.trim()) return;
    const data = getShipmentByAwb(inputAwb);
    setShipment(data);
    setIsSubscribed(isAwbSubscribed(data.awbNumber));
    onAwbChange(data.awbNumber);
  };

  const selectSample = (awb: string) => {
    setInputAwb(awb);
    const data = getShipmentByAwb(awb);
    setShipment(data);
    setIsSubscribed(isAwbSubscribed(data.awbNumber));
    onAwbChange(awb);
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText?.(window.location.origin + '?awb=' + shipment.awbNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusColor = (status: ShipmentData['statusCode']) => {
    switch (status) {
      case 'DELIVERED':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'OUT_FOR_DELIVERY':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'CUSTOMS_CLEARANCE':
        return 'text-purple-700 bg-purple-50 border-purple-200';
      default:
        return 'text-amber-700 bg-amber-50 border-amber-200';
    }
  };

  return (
    <section id="tracker" className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-10">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 uppercase tracking-wider mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            <span>Real-Time Milestone Control</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-slate-900 tracking-tight">
            Consignment Tracking & Live Telemetry
          </h2>
          <p className="mt-2 text-slate-600 text-sm sm:text-base leading-relaxed">
            Verify shipment milestones, flight allocations, transit temperatures, and authenticated digital proofs of delivery across Chowra's multimodal transit network.
          </p>
        </div>

        {/* Search Console Card */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 sm:p-6 mb-8">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={inputAwb}
                onChange={(e) => setInputAwb(e.target.value)}
                placeholder="Enter Consignment AWB Number (e.g., CHW-8942-IN, CHW-5521-EXP)"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-4 pr-10 py-3 text-sm text-slate-900 placeholder-slate-400 font-data focus:outline-none focus:border-amber-500 focus:bg-white transition-colors"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
            </div>
            <button
              type="submit"
              className="py-3 px-6 bg-slate-950 hover:bg-slate-800 text-white font-semibold text-sm rounded-lg transition-colors flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer shadow-sm"
            >
              <span>Search Consignment</span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </button>
          </form>

          {/* Quick sample chips */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span className="font-medium text-slate-700">Sample Consignments:</span>
            <button
              type="button"
              onClick={() => selectSample('CHW-8942-IN')}
              className={`px-2.5 py-1 rounded border font-data text-xs cursor-pointer transition-colors ${
                shipment.awbNumber === 'CHW-8942-IN' 
                  ? 'bg-amber-100 border-amber-300 text-amber-900 font-semibold' 
                  : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
              }`}
            >
              CHW-8942-IN (Air Cargo Express)
            </button>
            <button
              type="button"
              onClick={() => selectSample('CHW-5521-EXP')}
              className={`px-2.5 py-1 rounded border font-data text-xs cursor-pointer transition-colors ${
                shipment.awbNumber === 'CHW-5521-EXP' 
                  ? 'bg-amber-100 border-amber-300 text-amber-900 font-semibold' 
                  : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
              }`}
            >
              CHW-5521-EXP (Cold Chain Intl)
            </button>
            <button
              type="button"
              onClick={() => selectSample('CHW-3104-DEL')}
              className={`px-2.5 py-1 rounded border font-data text-xs cursor-pointer transition-colors ${
                shipment.awbNumber === 'CHW-3104-DEL' 
                  ? 'bg-amber-100 border-amber-300 text-amber-900 font-semibold' 
                  : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
              }`}
            >
              CHW-3104-DEL (Same-Day Delivered)
            </button>
          </div>
        </div>

        {/* Live Shipment Dashboard Card */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          
          {/* Dashboard Header Bar */}
          <div className="bg-slate-900 text-white p-5 sm:p-6 border-b border-slate-800">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-xl sm:text-2xl font-display font-extrabold font-data text-amber-400">
                    {shipment.awbNumber}
                  </span>
                  <span className="text-xs text-slate-400 font-data">Ref: {shipment.referenceNumber}</span>
                  <span className={`text-xs px-2.5 py-1 rounded border font-medium ${getStatusColor(shipment.statusCode)}`}>
                    {shipment.statusCode.replace('_', ' ')}
                  </span>
                </div>
                <div className="text-xs text-slate-300 mt-1.5 flex items-center gap-2">
                  <span>{shipment.serviceType}</span>
                  <span>·</span>
                  <span className="text-slate-400">Updated {shipment.lastUpdated}</span>
                </div>
              </div>

              {/* Utility actions */}
              <div className="flex items-center gap-2 flex-wrap">
                {/* SMS & Email Alerts Quick Action */}
                <button
                  type="button"
                  onClick={handleOpenSmsEmailModal}
                  className={`px-3 py-1.5 rounded-lg border text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
                    smsEmailConfig.smsEnabled || smsEmailConfig.emailEnabled
                      ? 'bg-emerald-950/80 border-[#00bf72] text-[#a8eb12] shadow-sm'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                  }`}
                  title={`Configure SMS/Email Real-Time Alerts for Consignment #${shipment.awbNumber}`}
                >
                  <Smartphone className="w-3.5 h-3.5 text-amber-400" />
                  <span>SMS/Email Alerts:</span>
                  <strong className={`font-semibold ${
                    smsEmailConfig.smsEnabled && smsEmailConfig.emailEnabled
                      ? 'text-[#a8eb12]'
                      : smsEmailConfig.smsEnabled
                      ? 'text-amber-400'
                      : smsEmailConfig.emailEnabled
                      ? 'text-sky-400'
                      : 'text-slate-400'
                  }`}>
                    {smsEmailConfig.smsEnabled && smsEmailConfig.emailEnabled
                      ? 'SMS + Email Active'
                      : smsEmailConfig.smsEnabled
                      ? 'SMS Active'
                      : smsEmailConfig.emailEnabled
                      ? 'Email Active'
                      : 'Off'}
                  </strong>
                </button>

                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                  <span>{copied ? 'Link Copied' : 'Share AWB'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowPodModal(true)}
                  className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>View Proof of Delivery (POD)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Real-Time Visual Tracker with SVG Map Component */}
          <ShipmentVisualMapTracker shipment={shipment} className="border-x-0 border-t-0 rounded-none border-b border-slate-800" />

          {/* Transit Route & Status Summary Grid */}
          <div className="p-5 sm:p-6 border-b border-slate-100 bg-slate-50/50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Origin */}
              <div className="space-y-1">
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wider block">Origin Terminal</span>
                <div className="text-base font-semibold text-slate-900 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>{shipment.origin.city}, {shipment.origin.country}</span>
                </div>
                <div className="text-xs text-slate-500 pl-5">
                  {shipment.origin.hub} (PIN: {shipment.origin.pin})
                </div>
                <div className="text-xs text-slate-600 pl-5 pt-1">
                  Consignor: <span className="font-medium text-slate-800">{shipment.senderName}</span>
                </div>
              </div>

              {/* Transit Indicator */}
              <div className="flex flex-col items-center justify-center text-center px-4 py-2 bg-white rounded-lg border border-slate-200/80">
                <div className="text-xs font-medium text-slate-500 mb-1">Estimated Commitment</div>
                <div className="text-sm sm:text-base font-display font-bold text-slate-900">
                  {shipment.estimatedDelivery}
                </div>
                <div className="mt-2 w-full flex items-center justify-center gap-2">
                  <div className="h-1 flex-1 bg-amber-500 rounded-full" />
                  {shipment.vehicleOrFlightNo?.includes('Flight') || shipment.vehicleOrFlightNo?.includes('Air') || shipment.vehicleOrFlightNo?.includes('Lufthansa') ? (
                    <Plane className="w-4 h-4 text-amber-600" />
                  ) : (
                    <Truck className="w-4 h-4 text-amber-600" />
                  )}
                  <div className={`h-1 flex-1 rounded-full ${shipment.statusCode === 'DELIVERED' ? 'bg-amber-500' : 'bg-slate-200'}`} />
                </div>
                <div className="text-[11px] text-slate-500 mt-1 font-data">
                  Carrier: {shipment.vehicleOrFlightNo || 'Chowra Linehaul 12'}
                </div>
              </div>

              {/* Destination */}
              <div className="space-y-1 md:text-right">
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wider block">Destination Terminal</span>
                <div className="text-base font-semibold text-slate-900 flex items-center md:justify-end gap-1.5">
                  <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{shipment.destination.city}, {shipment.destination.country}</span>
                </div>
                <div className="text-xs text-slate-500">
                  {shipment.destination.hub} (PIN: {shipment.destination.pin})
                </div>
                <div className="text-xs text-slate-600 pt-1">
                  Consignee: <span className="font-medium text-slate-800">{shipment.recipientName}</span>
                </div>
              </div>

            </div>

            {/* Spec strip */}
            <div className="mt-6 pt-4 border-t border-slate-200/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block">Gross Weight</span>
                <span className="font-data font-semibold text-slate-900">{shipment.weightKg} kg</span>
              </div>
              <div>
                <span className="text-slate-400 block">Number of Pieces</span>
                <span className="font-data font-semibold text-slate-900">{shipment.pieces} Package(s)</span>
              </div>
              <div>
                <span className="text-slate-400 block">Service Class</span>
                <span className="font-semibold text-slate-900">Priority Secure</span>
              </div>
              <div>
                <span className="text-slate-400 block">IoT Environmental State</span>
                <span className="font-data font-semibold text-slate-900 flex items-center gap-1">
                  {shipment.temperature ? (
                    <>
                      <Thermometer className="w-3.5 h-3.5 text-blue-600" />
                      <span>{shipment.temperature}</span>
                    </>
                  ) : (
                    <span>Ambient Dry Cargo (Controlled)</span>
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Real-Time Browser Notification & Telemetry Control Console */}
          <div className="p-4 sm:p-6 bg-slate-900 border-b border-slate-800 text-white">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
              
              {/* Left: Status & Notification API details */}
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <div 
                    className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-slate-950 text-xs shadow-md"
                    style={{ background: 'linear-gradient(135deg, #008793, #00bf72)' }}
                  >
                    <BellRing className="w-4 h-4 text-slate-950 animate-pulse" />
                  </div>
                  <h4 className="font-display font-extrabold text-sm sm:text-base text-white">
                    Real-Time Browser Notification System
                  </h4>

                  {/* Permission Badge */}
                  {permission === 'granted' ? (
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-[#a8eb12] border border-emerald-500/40 flex items-center gap-1.5 font-data">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      <span>Notification API: Granted & Active</span>
                    </span>
                  ) : permission === 'denied' ? (
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center gap-1.5 font-data">
                      <BellOff className="w-3.5 h-3.5 text-rose-400" />
                      <span>Notification API: Blocked by Browser</span>
                    </span>
                  ) : (
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1.5 font-data">
                      <Clock className="w-3 h-3 text-amber-400" />
                      <span>Notification API: Permission Required</span>
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
                  Subscribed consignments leverage the browser's native <code className="text-[#a8eb12] bg-slate-950 px-1.5 py-0.5 rounded font-mono text-[11px] border border-slate-800">window.Notification</code> API to alert your operating system with real-time push banners & audio chimes when linehaul flights depart, hubs scan, or deliveries sign off for <strong className="text-white font-data">#{shipment.awbNumber}</strong>.
                </p>
              </div>

              {/* Right: Live Interactive Controls */}
              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                {/* Enable Button if permission not yet granted */}
                {permission !== 'granted' && (
                  <button
                    type="button"
                    onClick={handleEnableBrowserNotifications}
                    className="py-2.5 px-4 rounded-xl font-bold text-xs text-slate-950 flex items-center gap-2 cursor-pointer shadow-lg transition-all hover:scale-105 active:scale-95"
                    style={{
                      background: 'linear-gradient(135deg, #008793 0%, #00bf72 50%, #a8eb12 100%)'
                    }}
                  >
                    <Bell className="w-3.5 h-3.5 text-slate-950" />
                    <span>Enable Browser Notifications</span>
                  </button>
                )}

                {/* Watch Consignment Toggle */}
                <button
                  type="button"
                  onClick={handleToggleSubscription}
                  className={`py-2 px-3.5 rounded-xl font-semibold text-xs border flex items-center gap-1.5 cursor-pointer transition-all ${
                    isSubscribed
                      ? 'bg-emerald-950/70 border-[#00bf72] text-[#a8eb12] shadow-sm'
                      : 'bg-slate-950 border-slate-700 hover:border-slate-600 text-slate-300'
                  }`}
                  title={isSubscribed ? `Consignment #${shipment.awbNumber} is actively monitored for push alerts` : 'Click to monitor status changes'}
                >
                  {isSubscribed ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#00bf72]" />
                      <span>Watching Consignment</span>
                    </>
                  ) : (
                    <>
                      <Bell className="w-3.5 h-3.5 text-slate-400" />
                      <span>Watch This AWB</span>
                    </>
                  )}
                </button>

                {/* Simulate Next Milestone Event */}
                <button
                  type="button"
                  onClick={() => triggerStatusEvent(false)}
                  className="py-2 px-3.5 rounded-xl font-bold text-xs text-slate-950 flex items-center gap-1.5 cursor-pointer transition-all hover:scale-105 active:scale-95 shadow-md"
                  style={{
                    background: 'linear-gradient(135deg, #f59e0b, #fbbf24)'
                  }}
                  title="Simulate immediate status milestone event and dispatch browser notification"
                >
                  <Zap className="w-3.5 h-3.5 text-slate-950 fill-current" />
                  <span>Simulate Status Change</span>
                </button>

                {/* Auto Stream Telemetry Simulation */}
                <button
                  type="button"
                  onClick={() => setIsAutoStreaming(!isAutoStreaming)}
                  className={`py-2 px-3.5 rounded-xl font-semibold text-xs border flex items-center gap-1.5 cursor-pointer transition-all ${
                    isAutoStreaming
                      ? 'bg-slate-800 border-amber-400 text-amber-300 shadow-sm'
                      : 'bg-slate-950 border-slate-700 hover:border-slate-600 text-slate-300'
                  }`}
                  title={isAutoStreaming ? 'Auto-streaming linehaul status events' : 'Simulate continuous background telemetry (every 18s)'}
                >
                  {isAutoStreaming ? (
                    <>
                      <Radio className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                      <span>Streaming (Active)</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 text-slate-400" />
                      <span>Auto-Stream</span>
                    </>
                  )}
                </button>

                {/* Test notification chime & ping */}
                <button
                  type="button"
                  onClick={handleTestNotification}
                  className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors cursor-pointer"
                  title="Test notification sound & dispatch ping"
                >
                  <Volume2 className="w-4 h-4 text-slate-300" />
                </button>
              </div>

            </div>

            {/* SMS & Email Real-Time Consignment Alerts Interactive Card */}
            <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-950/70 p-3.5 sm:p-4 rounded-xl border border-slate-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-amber-400 font-display flex items-center gap-1.5">
                    <Smartphone className="w-3.5 h-3.5 text-amber-400" />
                    <span>SMS & Email Real-Time Telemetry Alerts</span>
                  </span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
                    AWB #{shipment.awbNumber}
                  </span>
                </div>
                <div className="text-xs text-slate-400 flex items-center gap-3 flex-wrap">
                  <span>
                    SMS Dispatch: <strong className={smsEmailConfig.smsEnabled ? "text-[#a8eb12]" : "text-slate-500"}>
                      {smsEmailConfig.smsEnabled ? maskPhoneNumber(smsEmailConfig.phoneNumber) : 'Disabled'}
                    </strong>
                  </span>
                  <span>·</span>
                  <span>
                    Email Dispatch: <strong className={smsEmailConfig.emailEnabled ? "text-sky-400" : "text-slate-500"}>
                      {smsEmailConfig.emailEnabled ? maskEmail(smsEmailConfig.emailAddress) : 'Disabled'}
                    </strong>
                  </span>
                </div>
              </div>

              {/* Direct interactive toggle buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                {/* SMS Toggle */}
                <button
                  type="button"
                  onClick={handleToggleSmsDirect}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    smsEmailConfig.smsEnabled
                      ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md font-bold'
                      : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white hover:border-slate-600'
                  }`}
                  title={smsEmailConfig.smsEnabled ? `SMS alerts active for #${shipment.awbNumber}. Click to turn OFF.` : `Click to turn ON real-time SMS alerts for #${shipment.awbNumber}`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>SMS: {smsEmailConfig.smsEnabled ? 'ON' : 'OFF'}</span>
                </button>

                {/* Email Toggle */}
                <button
                  type="button"
                  onClick={handleToggleEmailDirect}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    smsEmailConfig.emailEnabled
                      ? 'bg-sky-400 text-slate-950 border-sky-300 shadow-md font-bold'
                      : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white hover:border-slate-600'
                  }`}
                  title={smsEmailConfig.emailEnabled ? `Email telemetry active for #${shipment.awbNumber}. Click to turn OFF.` : `Click to turn ON real-time email alerts for #${shipment.awbNumber}`}
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email: {smsEmailConfig.emailEnabled ? 'ON' : 'OFF'}</span>
                </button>

                {/* Configure Modal trigger */}
                <button
                  type="button"
                  onClick={handleOpenSmsEmailModal}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Configure recipient phone, email, and milestone triggers"
                >
                  <Settings className="w-3.5 h-3.5 text-slate-400" />
                  <span>Configure</span>
                </button>

                {/* Quick Test dispatch */}
                {(smsEmailConfig.smsEnabled || smsEmailConfig.emailEnabled) && (
                  <button
                    type="button"
                    onClick={handleSendTestSmsEmail}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
                    title="Send immediate test SMS & Email dispatch now"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Timeline & Milestone Logs Section */}
          <div className="p-5 sm:p-6">
            <h3 className="text-base font-display font-bold text-slate-900 mb-6 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span>Detailed Checkpoint Logs & Chain of Custody</span>
                {isAutoStreaming && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold border border-emerald-300 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                    <span>Auto-Polling Telemetry</span>
                  </span>
                )}
              </span>
              <span className="text-xs font-normal text-slate-500 font-data">
                {shipment.checkpoints.length} verified events logged
              </span>
            </h3>

            {/* Checkpoints list */}
            <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-2.5 sm:before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {shipment.checkpoints.map((cp, idx) => (
                <div key={cp.id || idx} className="relative group">
                  {/* Node icon indicator */}
                  <div className={`absolute -left-6 sm:-left-8 top-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    cp.status === 'current'
                      ? 'bg-amber-500 border-amber-200 text-white ring-4 ring-amber-100'
                      : cp.status === 'completed'
                      ? 'bg-slate-900 border-slate-900 text-white'
                      : 'bg-white border-slate-300'
                  }`}>
                    {cp.status === 'completed' ? (
                      <Check className="w-3 h-3 text-white" />
                    ) : cp.status === 'current' ? (
                      <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    ) : null}
                  </div>

                  {/* Content card */}
                  <div className={`p-4 rounded-lg border transition-all ${
                    cp.status === 'current' 
                      ? 'bg-amber-50/70 border-amber-200/90 shadow-xs' 
                      : 'bg-white border-slate-200/80 hover:border-slate-300'
                  }`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-slate-900">
                          {cp.description}
                        </span>
                        {idx === 0 && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-800 font-bold border border-amber-500/30 font-data">
                            LATEST MILESTONE
                          </span>
                        )}
                      </div>
                      <span className="font-data text-xs text-slate-500 whitespace-nowrap">
                        {cp.timestamp}
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 flex items-center gap-1.5 mt-0.5 font-medium">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>{cp.location}</span>
                    </div>

                    {cp.details && (
                      <p className="mt-2 text-xs text-slate-500 bg-slate-50/80 p-2 rounded border border-slate-100 leading-relaxed font-data">
                        {cp.details}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Notification alert banner */}
            <div className="mt-8 p-4 bg-slate-900 text-white rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 border border-slate-800 shadow-md">
              <div className="text-xs flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0">
                  <BellRing className="w-4 h-4 text-[#00bf72]" />
                </div>
                <div>
                  <span className="font-semibold text-white block text-sm">
                    Automated Consignment Milestone Alerts
                  </span>
                  <span className="text-slate-400 mt-0.5 block">
                    Receive instant native browser notifications and Web Audio telemetry chimes whenever #{shipment.awbNumber} advances.
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => triggerStatusEvent(false)}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Simulate Next Step</span>
                </button>
                <button
                  type="button"
                  onClick={handleToggleSubscription}
                  className="px-4 py-2 font-bold text-xs rounded-xl transition-all whitespace-nowrap cursor-pointer active:scale-95 shadow-md flex items-center gap-1.5"
                  style={{
                    background: isSubscribed 
                      ? 'linear-gradient(135deg, #008793, #00bf72)' 
                      : 'linear-gradient(135deg, #f59e0b, #fbbf24)',
                    color: '#020617'
                  }}
                >
                  {isSubscribed ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-slate-950" />
                      <span>Alerts Subscribed ✓</span>
                    </>
                  ) : (
                    <>
                      <Bell className="w-3.5 h-3.5 text-slate-950" />
                      <span>Subscribe Browser Alerts</span>
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Proof of Delivery (POD) Modal Simulation */}
      {showPodModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-600" />
                <h4 className="font-display font-bold text-slate-900 text-lg">Electronic Proof of Delivery (e-POD)</h4>
              </div>
              <button
                onClick={() => setShowPodModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-4 text-xs text-slate-700">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-400 block">AWB Consignment Number</span>
                  <span className="font-data font-bold text-slate-900">{shipment.awbNumber}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Delivery Timestamp</span>
                  <span className="font-data font-bold text-slate-900">{shipment.podTimestamp || 'Pending Final Delivery'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Recipient / Signatory</span>
                  <span className="font-semibold text-slate-900">{shipment.podSignedBy || shipment.recipientName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">GPS Coordinates Handover</span>
                  <span className="font-data font-bold text-slate-900">19.0760° N, 72.8777° E</span>
                </div>
              </div>

              {/* Digital Signature Simulation */}
              <div>
                <span className="text-slate-500 font-medium block mb-1">Recipient Digital Signature on File:</span>
                <div className="h-20 bg-slate-100 rounded-lg border border-dashed border-slate-300 flex items-center justify-center p-2 relative">
                  <span className="font-serif italic text-xl text-slate-800 tracking-wider">
                    {shipment.podSignedBy ? shipment.podSignedBy : shipment.recipientName.split(' ')[0]}
                  </span>
                  <div className="absolute right-2 bottom-1 text-[10px] text-emerald-700 font-data flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span>Cryptographically Signed</span>
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-slate-500 leading-normal">
                This document is a certified computer-generated delivery verification issued by Chowra Logistics and Couriers Limited under Indian Carriage by Road Act & IATA Cargo Regulations.
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  window.print();
                }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold cursor-pointer"
              >
                Print / Download PDF
              </button>
              <button
                type="button"
                onClick={() => setShowPodModal(false)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold cursor-pointer"
              >
                Close Verification
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SMS & Email Real-Time Consignment Alerts Modal */}
      {showSmsEmailModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 relative animate-in fade-in zoom-in-95 duration-200">
            <button
              type="button"
              onClick={() => setShowSmsEmailModal(false)}
              className="absolute right-4 top-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3 mb-5">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-950 font-bold shadow-md shrink-0"
                style={{ background: 'linear-gradient(135deg, #008793, #00bf72)' }}
              >
                <Smartphone className="w-5 h-5 text-slate-950" />
              </div>
              <div>
                <h3 className="text-lg font-display font-bold text-slate-900">
                  SMS & Email Real-Time Alerts
                </h3>
                <p className="text-xs text-slate-500 font-data">
                  Direct cellular & digital updates for Tracking ID: <span className="font-bold text-amber-600">#{shipment.awbNumber}</span>
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveSmsEmailSettings} className="space-y-4">
              {/* Channel Toggles Header Cards */}
              <div className="grid grid-cols-2 gap-3">
                {/* SMS Toggle Box */}
                <div 
                  onClick={() => setTempSmsEnabled(!tempSmsEnabled)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    tempSmsEnabled
                      ? 'bg-amber-50/80 border-amber-300 ring-2 ring-amber-400/20'
                      : 'bg-slate-50 border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-amber-600" />
                      <span>SMS Alert</span>
                    </span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      tempSmsEnabled ? 'bg-amber-400 text-slate-950' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {tempSmsEnabled ? 'ON' : 'OFF'}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 block leading-tight">
                    Instant SMS on Indian cellular networks (+91)
                  </span>
                </div>

                {/* Email Toggle Box */}
                <div 
                  onClick={() => setTempEmailEnabled(!tempEmailEnabled)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    tempEmailEnabled
                      ? 'bg-sky-50/80 border-sky-300 ring-2 ring-sky-400/20'
                      : 'bg-slate-50 border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-sky-600" />
                      <span>Email Alert</span>
                    </span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      tempEmailEnabled ? 'bg-sky-400 text-slate-950' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {tempEmailEnabled ? 'ON' : 'OFF'}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 block leading-tight">
                    E-Way bill manifests & milestone dockets
                  </span>
                </div>
              </div>

              {/* Input Fields with Placeholders */}
              <div className="space-y-3 pt-1">
                {/* Tracking ID (Read-only reference) */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Active Consignment AWB / Tracking ID
                  </label>
                  <input
                    type="text"
                    value={shipment.awbNumber}
                    readOnly
                    placeholder="e.g. CHW-8942-IN or BLR-4019-EXP"
                    className="w-full bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono font-bold text-slate-700 cursor-not-allowed"
                  />
                </div>

                {/* Mobile Number for SMS */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                    <span>Mobile Phone Number (India & International)</span>
                    <span className="text-[10px] text-slate-400">For instant SMS updates</span>
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={tempPhone}
                      onChange={(e) => setTempPhone(e.target.value)}
                      placeholder="e.g. +91 98200 44810 or 98765 43210"
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-3 pr-10 py-2.5 text-xs font-data text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
                    />
                    <Smartphone className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
                  </div>
                </div>

                {/* Email Address for Alerts */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                    <span>Consignee / Consignor Email Address</span>
                    <span className="text-[10px] text-slate-400">For digital tracking dockets</span>
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={tempEmail}
                      onChange={(e) => setTempEmail(e.target.value)}
                      placeholder="e.g. logistics.manager@company.in or consignee@domain.com"
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-3 pr-10 py-2.5 text-xs font-data text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
                    />
                    <Mail className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
                  </div>
                </div>
              </div>

              {/* Event Triggers Checkboxes */}
              <div className="pt-2 border-t border-slate-100">
                <span className="block text-xs font-bold text-slate-800 mb-2">
                  Select Milestone Alert Triggers:
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-700 font-sans">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={tempNotifyOnPickup}
                      onChange={(e) => setTempNotifyOnPickup(e.target.checked)}
                      className="rounded border-slate-300 text-amber-500 focus:ring-amber-400"
                    />
                    <span>Pickup & Inward Scan</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={tempNotifyOnInscan}
                      onChange={(e) => setTempNotifyOnInscan(e.target.checked)}
                      className="rounded border-slate-300 text-amber-500 focus:ring-amber-400"
                    />
                    <span>Hub Departures & Transit</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={tempNotifyOnOutForDelivery}
                      onChange={(e) => setTempNotifyOnOutForDelivery(e.target.checked)}
                      className="rounded border-slate-300 text-amber-500 focus:ring-amber-400"
                    />
                    <span>Out for Doorstep Delivery</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={tempNotifyOnDelivered}
                      onChange={(e) => setTempNotifyOnDelivered(e.target.checked)}
                      className="rounded border-slate-300 text-amber-500 focus:ring-amber-400"
                    />
                    <span>Delivered & Digital POD</span>
                  </label>
                </div>
              </div>

              {/* Success notice */}
              {modalSavedToast && (
                <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{modalSavedToast}</span>
                </div>
              )}

              {/* Footer actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleSendTestSmsEmail}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Send immediate test alert"
                >
                  <Send className="w-3.5 h-3.5 text-amber-600" />
                  <span>Send Test Alert</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowSmsEmailModal(false)}
                    className="px-3.5 py-2 text-slate-600 hover:text-slate-900 text-xs font-semibold rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-slate-950 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-all shadow-md cursor-pointer hover:scale-[1.02] active:scale-95"
                  >
                    Save & Activate Alerts
                  </button>
                </div>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Alert toast notification */}
      {showNotificationToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 text-xs flex items-center gap-3 animate-in slide-in-from-bottom-5 max-w-md">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <div className="space-y-0.5">
            <div className="font-bold text-amber-400 font-display flex items-center gap-1.5">
              <span>{recentNotification?.title || 'Notification Received'}</span>
              {recentNotification?.awb && (
                <span className="text-[10px] text-slate-400 font-mono">#{recentNotification.awb}</span>
              )}
            </div>
            <div className="text-slate-300 text-[11px] leading-tight">
              {recentNotification?.description || `Automated milestone updates subscribed for AWB #${shipment.awbNumber}`}
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
