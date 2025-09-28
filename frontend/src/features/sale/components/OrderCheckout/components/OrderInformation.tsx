import type { Customer, DeliveryDetails } from '../../../types';
import { Card } from '@/shared/components';

interface OrderInformationProps {
  customer: Customer;
  deliveryDetails: DeliveryDetails;
}

export function OrderInformation({
  customer,
  deliveryDetails
}: OrderInformationProps) {
  return (
    <Card title="Order Information">
        <div className="payment-info-grid">
          <div className="info-section">
            <h4>Customer</h4>
            <div className="info-content">
              <div className="customer-name">{customer.name}</div>
              <div className="customer-contact">{customer.phone}</div>
              {customer.email && <div className="customer-contact">{customer.email}</div>}
              <div className="delivery-address">
                {customer.deliveryAddress?.street}<br/>
                {customer.deliveryAddress?.city}, {customer.deliveryAddress?.state} {customer.deliveryAddress?.zip}
              </div>
            </div>
          </div>

          <div className="info-section">
            <h4>Delivery</h4>
            <div className="info-content">
              <div className="delivery-date">{deliveryDetails.preferredDate || 'To be scheduled'}</div>
              <div className="delivery-time">{deliveryDetails.timeSlot || 'Time TBD'}</div>
              {(deliveryDetails.whiteGloveService || deliveryDetails.oldMattressRemoval || deliveryDetails.setupService) && (
                <div className="delivery-services">
                  {deliveryDetails.whiteGloveService && <div>• White Glove Service</div>}
                  {deliveryDetails.oldMattressRemoval && <div>• Old Mattress Removal</div>}
                  {deliveryDetails.setupService && <div>• Basic Setup Service</div>}
                </div>
              )}
            </div>
          </div>
        </div>
    </Card>
  );
}