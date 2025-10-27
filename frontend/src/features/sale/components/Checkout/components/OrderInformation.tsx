import type { Customer, DeliveryDetails } from '@/features/sale/types';
import { Card } from '@/ui';

interface OrderInformationProps {
  customer: Customer;
  deliveryDetails: DeliveryDetails;
}

// Inline SVG Icons
const UserIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const PhoneIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const MailIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const MapPinIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const PackageIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);

const ClockIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const CheckCircleIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

export function OrderInformation({
  customer,
  deliveryDetails
}: OrderInformationProps) {
  return (
    <Card title="Order Information">
      <div className="order-info-grid">
        {/* Customer Card */}
        <div className="order-info-card">
          <div className="order-info-icon">
            <UserIcon />
          </div>
          <div className="order-info-label">CUSTOMER</div>
          <div className="order-info-content">
            <div className="content-primary">{customer.name}</div>
            
            {/* Contact Section */}
            <div className="content-group">
              <div className="section-label">Contact</div>
              <div className="content-item">
                <PhoneIcon />
                <span>{customer.phone}</span>
              </div>
              {customer.email && (
                <div className="content-item">
                  <MailIcon />
                  <span>{customer.email}</span>
                </div>
              )}
            </div>

            {/* Address Section */}
            {customer.deliveryAddress && (
              <div className="content-address">
                <div className="section-label">Address</div>
                <div className="address-content">
                  <MapPinIcon />
                  <span>
                    {customer.deliveryAddress.street}, {customer.deliveryAddress.city}, {customer.deliveryAddress.state} {customer.deliveryAddress.zip}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Delivery Card */}
        <div className="order-info-card">
          <div className="order-info-icon">
            <PackageIcon />
          </div>
          <div className="order-info-label">DELIVERY</div>
          <div className="order-info-content">
            <div className="content-primary">{deliveryDetails.preferredDate || 'To be scheduled'}</div>
            
            {/* Time Slot Section */}
            <div className="content-group">
              <div className="section-label">Time Slot</div>
              <div className="content-item">
                <ClockIcon />
                <span>{deliveryDetails.timeSlot || 'Time TBD'}</span>
              </div>
            </div>

            {/* Services Section */}
            {(deliveryDetails.whiteGloveService || deliveryDetails.oldMattressRemoval || deliveryDetails.setupService) && (
              <div className="content-services">
                <div className="section-label">Services</div>
                {deliveryDetails.whiteGloveService && (
                  <div className="service-item">
                    <CheckCircleIcon />
                    <span>White Glove Service</span>
                  </div>
                )}
                {deliveryDetails.oldMattressRemoval && (
                  <div className="service-item">
                    <CheckCircleIcon />
                    <span>Old Mattress Removal</span>
                  </div>
                )}
                {deliveryDetails.setupService && (
                  <div className="service-item">
                    <CheckCircleIcon />
                    <span>Basic Setup Service</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
