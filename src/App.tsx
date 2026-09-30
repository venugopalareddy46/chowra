/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Chowra Logistics and Couriers Limited
 * System Architecture & Engineering: Chowra Engineering Team
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { ShipmentTracker } from './components/ShipmentTracker';
import { CourierServices } from './components/CourierServices';
import { ExpressDelivery } from './components/ExpressDelivery';
import { EcommerceLogistics } from './components/EcommerceLogistics';
import { FreightCargo } from './components/FreightCargo';
import { RateCalculator } from './components/RateCalculator';
import { BookingSection } from './components/BookingSection';
import { BookingHistory } from './components/BookingHistory';
import { NetworkCoverage } from './components/NetworkCoverage';
import { WhyChooseUs } from './components/WhyChooseUs';
import { CorporateSolutions } from './components/CorporateSolutions';
import { TestimonialsSection } from './components/TestimonialsSection';
import { FaqSection } from './components/FaqSection';
import { CallToAction } from './components/CallToAction';
import { ContactUs } from './components/ContactUs';
import { Footer } from './components/Footer';
import { PickupBookingModal } from './components/PickupBookingModal';
import { LiveChatWidget } from './components/LiveChatWidget';
import { AuthModal } from './components/AuthModal';
import { UserDashboardModal } from './components/UserDashboardModal';
import { WebsiteLoadingScreen } from './components/WebsiteLoadingScreen';
import { HealthStatusModal } from './components/HealthStatusModal';
import { ApiDocsModal } from './components/ApiDocsModal';
import { PickupBookingData } from './types/logistics';
import { UserAccount, DEMO_USERS } from './types/auth';
import { sqliteDb } from './services/sqliteDb';
import { PackageCheck, ArrowUp } from 'lucide-react';

const INITIAL_BOOKINGS: PickupBookingData[] = [
  {
    bookingId: 'BK-CHW-84920',
    trackingId: 'CHW-8942-IN',
    senderName: 'Rahul Deshmukh',
    senderPhone: '+91 98200 44810',
    senderEmail: 'r.deshmukh@precisiontools.in',
    pickupAddress: 'Plot 42, Marol Industrial Area, Andheri East',
    pickupPincode: '400059',
    pickupCity: 'Mumbai',
    recipientCity: 'New Delhi',
    recipientPincode: '110037',
    packageType: 'Commercial Parcel / Spare Parts',
    estimatedWeightKg: 4.5,
    packageCount: 2,
    pickupDate: 'Today (Within 2 Hours)',
    pickupTimeSlot: 'Evening Slot (16:00 - 19:00)',
    serviceSpeed: 'Chowra Air Express Next-Day',
    status: 'DISPATCHED',
    driverName: 'Vikramjit Singh (Van #MH-02-CW-9921)',
    driverPhone: '+91 98199 12040',
    createdAt: 'Today, 18:20',
    estimatedCost: 880,
  },
  {
    bookingId: 'BK-CHW-55214',
    trackingId: 'CHW-5521-EXP',
    senderName: 'Pooja Sundaram',
    senderPhone: '+91 98450 11920',
    senderEmail: 'pooja@biogen-labs.com',
    pickupAddress: 'Block 4, Electronic City Phase 1',
    pickupPincode: '560100',
    pickupCity: 'Bengaluru',
    recipientCity: 'Hyderabad',
    recipientPincode: '500081',
    packageType: 'Pharma / Medical Life Sciences',
    estimatedWeightKg: 12.0,
    packageCount: 1,
    pickupDate: 'Today (Immediate)',
    pickupTimeSlot: 'Morning Priority (09:00 - 12:00)',
    serviceSpeed: 'Same-Day Metro Hyper-Express',
    status: 'IN_TRANSIT',
    driverName: 'Karthik Raja (Van #KA-01-EXP-4401)',
    driverPhone: '+91 98450 22331',
    createdAt: 'Today, 11:45',
    estimatedCost: 1450,
  },
  {
    bookingId: 'BK-CHW-31049',
    trackingId: 'CHW-3104-DEL',
    senderName: 'Arjun Mehta',
    senderPhone: '+91 98230 77120',
    senderEmail: 'arjun@automotive-components.in',
    pickupAddress: 'MIDC Chakan Phase 2',
    pickupPincode: '410501',
    pickupCity: 'Pune',
    recipientCity: 'Chennai',
    recipientPincode: '600001',
    packageType: 'Heavy Freight / Wooden Crate',
    estimatedWeightKg: 38.0,
    packageCount: 3,
    pickupDate: 'Yesterday',
    pickupTimeSlot: 'Afternoon Standard (12:00 - 16:00)',
    serviceSpeed: 'Express Surface Linehaul Cargo',
    status: 'DELIVERED',
    driverName: 'Suresh Patil (Truck #MH-12-TR-8002)',
    driverPhone: '+91 98220 99411',
    createdAt: 'Yesterday, 14:10',
    estimatedCost: 4200,
  },
  {
    bookingId: 'BK-CHW-99120',
    trackingId: 'CHW-9912-INT',
    senderName: 'Deepak Shah',
    senderPhone: '+91 98110 33890',
    senderEmail: 'd.shah@gemexports.org',
    pickupAddress: 'Bharat Diamond Bourse, BKC',
    pickupPincode: '400051',
    pickupCity: 'Mumbai',
    recipientCity: 'Dubai (UAE)',
    recipientPincode: 'DWC-01',
    packageType: 'Confidential Documents / Legal Envelopes',
    estimatedWeightKg: 1.5,
    packageCount: 1,
    pickupDate: 'Tomorrow Morning',
    pickupTimeSlot: 'Morning Priority (09:00 - 12:00)',
    serviceSpeed: 'Global Express Air Priority',
    status: 'CONFIRMED',
    driverName: 'Mohsin Khan (Van #MH-01-EXP-1109)',
    driverPhone: '+91 98201 55432',
    createdAt: 'Today, 16:40',
    estimatedCost: 2650,
  },
];

export default function App() {
  const [activeTrackingAwb, setActiveTrackingAwb] = useState('CHW-8942-IN');
  const [pickupModalOpen, setPickupModalOpen] = useState(false);
  const [pickupPrefill, setPickupPrefill] = useState<{
    origin?: string;
    destination?: string;
    weight?: number;
    serviceTier?: string;
  }>({});

  // Auth & User Dashboard state (Default to Chowra Engineering Team for seamless enterprise experience)
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    try {
      const saved = localStorage.getItem('chowra_user_session_v2');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // fallback
    }
    return DEMO_USERS[0];
  });
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const [isLoadingScreen, setIsLoadingScreen] = useState(true);
  const [healthModalOpen, setHealthModalOpen] = useState(false);
  const [healthModalTab, setHealthModalTab] = useState<'telemetry' | 'custom-domain' | 'tech-stack'>('telemetry');
  const [apiDocsModalOpen, setApiDocsModalOpen] = useState(false);

  // URL Path & Hash route listener for /health, /domain, /stack, and /docs
  React.useEffect(() => {
    const handleUrlRoute = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path.includes('/health') || hash === '#health' || hash === '#/health') {
        setHealthModalTab('telemetry');
        setHealthModalOpen(true);
      } else if (path.includes('/domain') || hash === '#domain' || hash === '#custom-domain') {
        setHealthModalTab('custom-domain');
        setHealthModalOpen(true);
      } else if (path.includes('/stack') || hash === '#stack' || hash === '#tech-stack') {
        setHealthModalTab('tech-stack');
        setHealthModalOpen(true);
      } else if (path.includes('/docs') || hash === '#docs' || hash === '#/docs') {
        setApiDocsModalOpen(true);
      }
    };
    handleUrlRoute();
    window.addEventListener('hashchange', handleUrlRoute);
    window.addEventListener('popstate', handleUrlRoute);
    return () => {
      window.removeEventListener('hashchange', handleUrlRoute);
      window.removeEventListener('popstate', handleUrlRoute);
    };
  }, []);

  const handleLoginSuccess = (user: UserAccount) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('chowra_user_session_v2', JSON.stringify(user));
    } catch (e) {}
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('chowra_user_session_v2');
    } catch (e) {}
    setDashboardOpen(false);
  };

  const [bookings, setBookings] = useState<PickupBookingData[]>(() => {
    try {
      const saved = localStorage.getItem('chowra_bookings_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      // fallback to initial
    }
    return INITIAL_BOOKINGS;
  });

  // Load existing bookings from relational SQLite database
  React.useEffect(() => {
    sqliteDb.getAllBookings().then((dbBookings) => {
      if (dbBookings && dbBookings.length > 0) {
        setBookings(dbBookings);
      }
    }).catch((err) => {
      console.warn('SQLite initial load notice:', err);
    });
  }, []);

  const handleBookingComplete = (newBooking: PickupBookingData) => {
    setBookings((prev) => {
      const updated = [newBooking, ...prev];
      try {
        localStorage.setItem('chowra_bookings_v2', JSON.stringify(updated));
      } catch (e) {
        // ignore storage errors
      }
      return updated;
    });

    // Also persist into SQLite database
    sqliteDb.insertBooking(newBooking).catch((err) => {
      console.error('Failed to insert booking into SQLite:', err);
    });
  };

  const handleScrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleTrackShipment = (awb: string) => {
    setActiveTrackingAwb(awb);
    handleScrollToSection('tracker');
  };

  const handleBookWithQuote = (quoteData: {
    origin: string;
    destination: string;
    weight: number;
    serviceTier: string;
    estimatedCost: number;
  }) => {
    setPickupPrefill({
      origin: quoteData.origin,
      destination: quoteData.destination,
      weight: quoteData.weight,
      serviceTier: quoteData.serviceTier,
    });
    // Smoothly navigate directly to the on-page booking module
    handleScrollToSection('booking');
  };

  return (
    <div className="w-full min-h-screen overflow-x-clip bg-slate-50 text-slate-900 flex flex-col font-sans antialiased selection:bg-amber-400 selection:text-slate-950">
      
      {/* 0. Website Initial Loading & Telemetry Calibration Screen */}
      {isLoadingScreen && (
        <WebsiteLoadingScreen onComplete={() => setIsLoadingScreen(false)} />
      )}

      {/* 1. Header & Navigation (3-Zone Contract) */}
      <Header
        onOpenPickupModal={() => {
          handleScrollToSection('booking');
        }}
        onScrollToSection={handleScrollToSection}
        bookingCount={bookings.length}
        currentUser={currentUser}
        onOpenAuthModal={() => setAuthModalOpen(true)}
        onOpenDashboard={() => setDashboardOpen(true)}
        onOpenHealthModal={(tab) => {
          if (tab) setHealthModalTab(tab);
          setHealthModalOpen(true);
        }}
        onOpenDocsModal={() => setApiDocsModalOpen(true)}
      />

      <main className="w-full flex-1">
        {/* 2. Hero Section with Logistics Visuals & Multi-Action Console */}
        <HeroSection
          onTrackShipment={handleTrackShipment}
          onOpenPickupModal={() => {
            handleScrollToSection('booking');
          }}
          onScrollToSection={handleScrollToSection}
        />

        {/* 3. Track Your Shipment (Interactive Live Consignment Dashboard) */}
        <ShipmentTracker
          currentAwb={activeTrackingAwb}
          onAwbChange={(awb) => setActiveTrackingAwb(awb)}
        />

        {/* 4. Dedicated On-Page Doorstep Pickup & Courier Booking Section */}
        <BookingSection
          prefillData={pickupPrefill}
          onBookingComplete={handleBookingComplete}
        />

        {/* 5. Booking History & Dispatch Registry linked to BookingSection */}
        <BookingHistory
          bookings={bookings}
          onTrackBooking={handleTrackShipment}
          onOpenNewBooking={() => handleScrollToSection('booking')}
        />

        {/* 6. Domestic & International Courier Services */}
        <CourierServices
          onOpenPickupModal={() => handleScrollToSection('booking')}
          onOpenCalculator={() => handleScrollToSection('calculator')}
        />

        {/* 6. Express Delivery Services (Same-day, NFO, Cold-chain) */}
        <ExpressDelivery
          onOpenPickupModal={() => handleScrollToSection('booking')}
        />

        {/* 7. E-commerce Logistics (Fulfillment, 24-hr COD Remittance) */}
        <EcommerceLogistics
          onOpenPickupModal={() => handleScrollToSection('booking')}
        />

        {/* 8. Multimodal Freight & Cargo Services */}
        <FreightCargo
          onOpenPickupModal={() => handleScrollToSection('booking')}
          onOpenCalculator={() => handleScrollToSection('calculator')}
        />

        {/* 9. Rate Calculator / Quick Quote (Volumetric IATA formula) */}
        <RateCalculator onBookWithQuote={handleBookWithQuote} />

        {/* 10. Service Coverage / Super-Hub Network */}
        <NetworkCoverage />

        {/* 11. Why Choose Chowra Logistics */}
        <WhyChooseUs />

        {/* 12. Corporate Logistics & B2B Solutions */}
        <CorporateSolutions />

        {/* 13. Customer Case Studies & Enterprise Shippers */}
        <TestimonialsSection />

        {/* 14. Customer FAQs & Knowledge Center */}
        <FaqSection onScrollToSection={handleScrollToSection} />

        {/* 15. Call-to-Action */}
        <CallToAction
          onOpenPickupModal={() => handleScrollToSection('booking')}
          onOpenCalculator={() => handleScrollToSection('calculator')}
        />

        {/* 16. User-Friendly Lead Generation Contact Us Section */}
        <ContactUs />
      </main>

      {/* 17. Professional Corporate Footer */}
      <Footer
        onScrollToSection={handleScrollToSection}
        onOpenPickupModal={() => handleScrollToSection('booking')}
        onOpenHealthModal={(tab) => {
          if (tab) setHealthModalTab(tab);
          setHealthModalOpen(true);
        }}
        onOpenDocsModal={() => setApiDocsModalOpen(true)}
      />

      {/* 18. Persistent Quick Floating Actions & 24/7 Live Chat Support */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2">
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="w-10 h-10 bg-slate-900/90 hover:bg-slate-800 text-white rounded-full shadow-lg border border-slate-700 flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer"
          title="Scroll to Top"
        >
          <ArrowUp className="w-4 h-4 text-amber-400" />
        </button>

        <button
          type="button"
          onClick={() => handleScrollToSection('booking')}
          className="hidden sm:flex px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-full shadow-2xl border-2 border-slate-950 items-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          title="Book Doorstep Pickup Now"
        >
          <PackageCheck className="w-4 h-4 text-slate-950" />
          <span>Book Pickup</span>
        </button>

        {/* Live Chat Floating Trigger & Interactive Socket Window */}
        <LiveChatWidget
          onNavigateSection={handleScrollToSection}
          onTrackAwb={handleTrackShipment}
        />
      </div>

      {/* 19. Doorstep Pickup Booking Modal */}
      <PickupBookingModal
        isOpen={pickupModalOpen}
        onClose={() => setPickupModalOpen(false)}
        prefillData={pickupPrefill}
        onBookingComplete={handleBookingComplete}
      />

      {/* 20. Shipper Authentication Modal (Login / Register) */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* 21. Corporate User Dashboard (Consignments, Pickups, Invoices, Architecture Dossier) */}
      {currentUser && (
        <UserDashboardModal
          isOpen={dashboardOpen}
          onClose={() => setDashboardOpen(false)}
          user={currentUser}
          onLogout={handleLogout}
          bookings={bookings}
          onTrackAwb={handleTrackShipment}
          onOpenBookingModal={() => handleScrollToSection('booking')}
          onOpenHealthModal={(tab) => {
            if (tab) setHealthModalTab(tab);
            setHealthModalOpen(true);
          }}
          onOpenDocsModal={() => setApiDocsModalOpen(true)}
        />
      )}

      {/* 22. System Health & Heartbeat (/health, /domain, /stack) */}
      <HealthStatusModal
        isOpen={healthModalOpen}
        onClose={() => setHealthModalOpen(false)}
        initialTab={healthModalTab}
      />

      {/* 23. OpenAPI Documentation & Interactive Explorer (/docs) */}
      <ApiDocsModal
        isOpen={apiDocsModalOpen}
        onClose={() => setApiDocsModalOpen(false)}
      />

    </div>
  );
}
