import type { DeliveryDetails } from '@/features/sale/types';
import { SERVICE_OPTIONS } from '@/features/sale/components/Wizard/constants/wizard';
import { Card } from '@/ui';

interface ServiceSelectorProps {
  deliveryDetails: DeliveryDetails;
  setDeliveryDetails: (details: DeliveryDetails) => void;
}

export function ServiceSelector({
  deliveryDetails,
  setDeliveryDetails
}: ServiceSelectorProps) {
  return (
    <Card title="Additional Services" size="compact">
        <div className="services-list-compact">
          <label className="service-item-compact no-additional-services">
            <input
              type="checkbox"
              checked={!deliveryDetails.whiteGloveService && !deliveryDetails.oldMattressRemoval && !deliveryDetails.setupService}
              onChange={(e) => {
                if (e.target.checked) {
                  setDeliveryDetails({
                    ...deliveryDetails,
                    whiteGloveService: false,
                    oldMattressRemoval: false,
                    setupService: false
                  });
                }
              }}
              className="service-checkbox-compact"
            />
            <div className="service-info-compact">
              <div className="service-main">
                <span className="service-name-compact">No additional services</span>
                <span className="service-price-compact">$0</span>
              </div>
              <span className="service-desc-compact">Standard delivery only - no extra services needed</span>
            </div>
          </label>

          <label className="service-item-compact">
            <input
              type="checkbox"
              checked={deliveryDetails.whiteGloveService}
              onChange={(e) => setDeliveryDetails({
                ...deliveryDetails,
                whiteGloveService: e.target.checked
              })}
              className="service-checkbox-compact"
            />
            <div className="service-info-compact">
              <div className="service-main">
                <span className="service-name-compact">{SERVICE_OPTIONS.whiteGlove.name}</span>
                <span className="service-price-compact">+${(SERVICE_OPTIONS.whiteGlove.price / 100).toFixed(0)}</span>
              </div>
              <span className="service-desc-compact">{SERVICE_OPTIONS.whiteGlove.description}</span>
            </div>
          </label>

          <label className="service-item-compact">
            <input
              type="checkbox"
              checked={deliveryDetails.oldMattressRemoval}
              onChange={(e) => setDeliveryDetails({
                ...deliveryDetails,
                oldMattressRemoval: e.target.checked
              })}
              className="service-checkbox-compact"
            />
            <div className="service-info-compact">
              <div className="service-main">
                <span className="service-name-compact">{SERVICE_OPTIONS.mattressRemoval.name}</span>
                <span className="service-price-compact">+${(SERVICE_OPTIONS.mattressRemoval.price / 100).toFixed(0)}</span>
              </div>
              <span className="service-desc-compact">{SERVICE_OPTIONS.mattressRemoval.description}</span>
            </div>
          </label>

          <label className="service-item-compact">
            <input
              type="checkbox"
              checked={deliveryDetails.setupService}
              onChange={(e) => setDeliveryDetails({
                ...deliveryDetails,
                setupService: e.target.checked
              })}
              className="service-checkbox-compact"
            />
            <div className="service-info-compact">
              <div className="service-main">
                <span className="service-name-compact">{SERVICE_OPTIONS.setupService.name}</span>
                <span className="service-price-compact">+${(SERVICE_OPTIONS.setupService.price / 100).toFixed(0)}</span>
              </div>
              <span className="service-desc-compact">{SERVICE_OPTIONS.setupService.description}</span>
            </div>
          </label>
        </div>
    </Card>
  );
}