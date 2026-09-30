/**
 * Authentication and User Profile Types
 * System Architecture: Chowra Engineering Team
 */

import { PickupBookingData } from './logistics';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  role: 'Enterprise Director' | 'Supply Chain Lead' | 'Commercial Shipper' | 'Client';
  avatarInitials: string;
  verified: boolean;
  memberSince: string;
  gstNumber?: string;
  creditBalance: number;
  savedAddressesCount: number;
  totalShipmentsCount: number;
}

export interface UserSavedAddress {
  id: string;
  label: string;
  contactPerson: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}

export interface UserBillingInvoice {
  invoiceId: string;
  docketNo: string;
  date: string;
  amount: number;
  gstAmount: number;
  status: 'PAID' | 'CREDIT_ACCOUNT' | 'PENDING';
  serviceType: string;
}

export const DEMO_USERS: UserAccount[] = [
  {
    id: 'usr-venu-01',
    name: 'Chowra Engineering Team',
    email: 'demo.user@chowralogistics.example',
    phone: '+91 98490 55120',
    company: 'Chowra Logistics Enterprise Command',
    role: 'Enterprise Director',
    avatarInitials: 'VR',
    verified: true,
    memberSince: 'March 2021',
    gstNumber: '27AAACC4912K1Z9',
    creditBalance: 250000,
    savedAddressesCount: 6,
    totalShipmentsCount: 142,
  },
  {
    id: 'usr-rajesh-02',
    name: 'Rajesh Malhotra',
    email: 'rajesh@apexindustries.in',
    phone: '+91 98200 44810',
    company: 'Apex Precision Engineering Ltd.',
    role: 'Supply Chain Lead',
    avatarInitials: 'RM',
    verified: true,
    memberSince: 'January 2023',
    gstNumber: '27AABCA1234F1Z5',
    creditBalance: 85000,
    savedAddressesCount: 4,
    totalShipmentsCount: 38,
  },
];
