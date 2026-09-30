/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Chowra Logistics Browser Storage Service
 * Zero-network dependency relational engine for Pan-India consignments, bookings, and audit dockets.
 * Core Architecture & Engineering: Chowra Engineering Team
 */

import { PickupBookingData } from '../types/logistics';

const SQLITE_STORAGE_KEY = 'chowra_sqlite_records_v1';

export interface SqliteConsignmentRow {
  awb: string;
  origin_city: string;
  destination_city: string;
  sender_entity: string;
  recipient_entity: string;
  status: string;
  service_tier: string;
  weight_kg: number;
  eway_bill_no?: string;
  current_hub: string;
  updated_at: string;
}

class SqliteDatabaseService {
  private bookingsTable: Map<string, PickupBookingData> = new Map();
  private consignmentsTable: Map<string, SqliteConsignmentRow> = new Map();
  private metadataTable: Map<string, string> = new Map();
  private isInitialized = false;

  constructor() {
    this.initDatabase();
  }

  private initDatabase(): void {
    try {
      // Initialize default schema & metadata
      this.metadataTable.set('lead_architect', 'Chowra Engineering Team');
      this.metadataTable.set('db_engine', 'Browser Storage Demo');
      this.metadataTable.set('jurisdiction', 'India - GSTIN & E-Way Bill Compliant');
      this.metadataTable.set('version', '3.44.0');

      // Hydrate from persistent store if exists
      const saved = localStorage.getItem(SQLITE_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.bookings)) {
          parsed.bookings.forEach((b: PickupBookingData) => {
            if (b && b.bookingId) {
              this.bookingsTable.set(b.bookingId, b);
            }
          });
        }
        if (Array.isArray(parsed.consignments)) {
          parsed.consignments.forEach((c: SqliteConsignmentRow) => {
            if (c && c.awb) {
              this.consignmentsTable.set(c.awb, c);
            }
          });
        }
      }
      this.isInitialized = true;
    } catch (e) {
      console.warn('Browser storage hydration initialized with fresh tables:', e);
      this.isInitialized = true;
    }
  }

  private persist(): void {
    try {
      const payload = {
        meta: Object.fromEntries(this.metadataTable),
        bookings: Array.from(this.bookingsTable.values()),
        consignments: Array.from(this.consignmentsTable.values()),
        lastSync: new Date().toISOString(),
      };
      localStorage.setItem(SQLITE_STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
      console.error('Failed to sync browser storage to storage:', e);
    }
  }

  public async ready(): Promise<void> {
    return Promise.resolve();
  }

  /**
   * Execute INSERT OR REPLACE INTO pickup_bookings ...
   */
  public async insertBooking(booking: PickupBookingData): Promise<void> {
    const sanitizedBooking: PickupBookingData = {
      ...booking,
      bookingId: booking.bookingId || `BK-CHW-${Math.floor(10000 + Math.random() * 90000)}`,
      createdAt: booking.createdAt || new Date().toISOString(),
      driverName: booking.driverName || 'Chowra Dispatch Executive',
      driverPhone: booking.driverPhone || '+91 98200 44810',
    };

    this.bookingsTable.set(sanitizedBooking.bookingId, sanitizedBooking);
    this.persist();
  }

  /**
   * Execute SELECT * FROM pickup_bookings ORDER BY rowid DESC
   */
  public async getAllBookings(): Promise<PickupBookingData[]> {
    const list = Array.from(this.bookingsTable.values());
    // Return in reverse chronological order
    return list.reverse();
  }

  /**
   * Execute SELECT * FROM consignments WHERE awb = ?
   */
  public async getConsignment(awb: string): Promise<SqliteConsignmentRow | null> {
    return this.consignmentsTable.get(awb) || null;
  }

  /**
   * Execute INSERT OR REPLACE INTO consignments ...
   */
  public async insertConsignment(consignment: SqliteConsignmentRow): Promise<void> {
    this.consignmentsTable.set(consignment.awb, consignment);
    this.persist();
  }

  /**
   * Execute arbitrary SQL query simulator for diagnostics and console inspection
   */
  public async executeSql(sql: string): Promise<any[]> {
    const normalized = sql.trim().toUpperCase();

    if (normalized.startsWith('SELECT') && normalized.includes('PICKUP_BOOKINGS')) {
      return [{
        columns: ['booking_id', 'tracking_id', 'sender_name', 'pickup_city', 'recipient_city', 'status', 'cost'],
        values: Array.from(this.bookingsTable.values()).map(b => [
          b.bookingId, b.trackingId, b.senderName, b.pickupCity, b.recipientCity, b.status, b.estimatedCost
        ]),
      }];
    }

    if (normalized.startsWith('SELECT') && normalized.includes('SYSTEM_METADATA')) {
      return [{
        columns: ['param_key', 'param_value'],
        values: Array.from(this.metadataTable.entries()),
      }];
    }

    return [{
      status: 'SUCCESS',
      message: 'Statement executed against Browser storage tables.',
      tablesUpdated: ['pickup_bookings', 'consignments', 'system_metadata'],
    }];
  }

  /**
   * Return Browser storage diagnostics
   */
  public getStatus() {
    return {
      engine: 'Browser Storage (localStorage)',
      storageBackend: 'Client-Side localStorage',
      isReady: this.isInitialized,
      totalBookings: this.bookingsTable.size,
      leadArchitect: 'Chowra Engineering Team',
    };
  }
}

export const sqliteDb = new SqliteDatabaseService();
