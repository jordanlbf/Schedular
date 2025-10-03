import type { DeliveryDetails } from '@/features/sale/types';
import { SERVICE_OPTIONS } from '@/features/sale/components/Wizard/constants/wizard';
import { Card } from '@/ui';

interface ServiceSelectorProps {
  deliveryDetails: DeliveryDetails;
  setDeliveryDetails: (details: DeliveryDetails) => void;
}

// Service icons mapping
const SERVICE_ICONS = {
  standard: '📦',
  whiteGlove: '✨',
  mattressRemoval: '♻️',
  setup: '🔧'
};

export function ServiceSelector({
  deliveryDetails,
  setDeliveryDetails
}: ServiceSelectorProps) {
  
  const handleServiceClick = (serviceType: 'standard' | 'whiteGlove' | 'mattressRemoval' | 'setup') => {
    switch(serviceType) {
      case 'standard':
        setDeliveryDetails({
          ...deliveryDetails,
          whiteGloveService: false,
          oldMattressRemoval: false,
          setupService: false
        });
        break;
      case 'whiteGlove':
        setDeliveryDetails({
          ...deliveryDetails,
          whiteGloveService: !deliveryDetails.whiteGloveService
        });
        break;
      case 'mattressRemoval':
        setDeliveryDetails({
          ...deliveryDetails,
          oldMattressRemoval: !deliveryDetails.oldMattressRemoval
        });
        break;
      case 'setup':
        setDeliveryDetails({
          ...deliveryDetails,
          setupService: !deliveryDetails.setupService
        });
        break;
    }
  };

  const isStandardSelected = !deliveryDetails.whiteGloveService && 
                              !deliveryDetails.oldMattressRemoval && 
                              !deliveryDetails.setupService;

  return (
    <Card title="Additional Services" size="compact">
      <div className="services-grid-icon">
        <button
          type="button"
          className={`service-tile-icon ${isStandardSelected ? 'selected' : ''}`}
          onClick={() => handleServiceClick('standard')}
          aria-pressed={isStandardSelected}
        >
          <div className="service-icon-wrapper">{SERVICE_ICONS.standard}</div>
          <div className="service-tile-content">
            <div className="service-tile-name">Standard</div>
            <div className="service-tile-price">$0</div>
          </div>
        </button>

        <button
          type="button"
          className={`service-tile-icon ${deliveryDetails.whiteGloveService ? 'selected' : ''}`}
          onClick={() => handleServiceClick('whiteGlove')}
          aria-pressed={deliveryDetails.whiteGloveService}
        >
          <div className="service-icon-wrapper">{SERVICE_ICONS.whiteGlove}</div>
          <div className="service-tile-content">
            <div className="service-tile-name">White Glove</div>
            <div className="service-tile-price">+${(SERVICE_OPTIONS.whiteGlove.price / 100).toFixed(0)}</div>
          </div>
        </button>

        <button
          type="button"
          className={`service-tile-icon ${deliveryDetails.oldMattressRemoval ? 'selected' : ''}`}
          onClick={() => handleServiceClick('mattressRemoval')}
          aria-pressed={deliveryDetails.oldMattressRemoval}
        >
          <div className="service-icon-wrapper">{SERVICE_ICONS.mattressRemoval}</div>
          <div className="service-tile-content">
            <div className="service-tile-name">Removal</div>
            <div className="service-tile-price">+${(SERVICE_OPTIONS.mattressRemoval.price / 100).toFixed(0)}</div>
          </div>
        </button>

        <button
          type="button"
          className={`service-tile-icon ${deliveryDetails.setupService ? 'selected' : ''}`}
          onClick={() => handleServiceClick('setup')}
          aria-pressed={deliveryDetails.setupService}
        >
          <div className="service-icon-wrapper">{SERVICE_ICONS.setup}</div>
          <div className="service-tile-content">
            <div className="service-tile-name">Basic Setup</div>
            <div className="service-tile-price">+${(SERVICE_OPTIONS.setupService.price / 100).toFixed(0)}</div>
          </div>
        </button>
      </div>
    </Card>
  );
}