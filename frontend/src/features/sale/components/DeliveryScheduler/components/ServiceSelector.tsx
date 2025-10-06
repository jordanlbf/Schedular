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
  
  const handleServiceToggle = (serviceType: 'standard' | 'whiteGlove' | 'mattressRemoval' | 'setup') => {
    switch(serviceType) {
      case 'standard':
        // If clicking standard, deselect all other services
        if (!isStandardSelected) {
          setDeliveryDetails({
            ...deliveryDetails,
            whiteGloveService: false,
            oldMattressRemoval: false,
            setupService: false
          });
        }
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
      <div className="services-minimal-grid">
        
        {/* Standard Delivery */}
        <button
          type="button"
          className={`service-minimal-tile glass-tile ${isStandardSelected ? 'selected' : ''}`}
          onClick={() => handleServiceToggle('standard')}
          aria-pressed={isStandardSelected}
        >
          <span className="ripple"></span>
          <div className="minimal-service-title">Standard</div>
          <div className="minimal-icon-wrapper">
            <svg className="minimal-svg-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <div className="minimal-service-amount free">FREE</div>
        </button>

        {/* White Glove Service */}
        <button
          type="button"
          className={`service-minimal-tile glass-tile ${deliveryDetails.whiteGloveService ? 'selected' : ''}`}
          onClick={() => handleServiceToggle('whiteGlove')}
          aria-pressed={deliveryDetails.whiteGloveService}
        >
          <span className="ripple"></span>
          <div className="minimal-service-title">White Glove</div>
          <div className="minimal-icon-wrapper">
            <svg className="minimal-svg-icon" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4,14V4a1.5,1.5,0,0,1,3,0v5h1V2a1.5,1.5,0,0,1,3,0v7h1V3a1.5,1.5,0,0,1,3,0v6h1V5a1.5,1.5,0,0,1,3,0v9a8,8,0,0,1-8,8H4a2,2,0,0,1-2-2V16A2,2,0,0,1,4,14Z"/>
            </svg>
          </div>
          <div className="minimal-service-amount">+${(SERVICE_OPTIONS.whiteGlove.price / 100).toFixed(0)}</div>
        </button>

        {/* Mattress Removal */}
        <button
          type="button"
          className={`service-minimal-tile glass-tile ${deliveryDetails.oldMattressRemoval ? 'selected' : ''}`}
          onClick={() => handleServiceToggle('mattressRemoval')}
          aria-pressed={deliveryDetails.oldMattressRemoval}
        >
          <span className="ripple"></span>
          <div className="minimal-service-title">Removal</div>
          <div className="minimal-icon-wrapper">
            <svg className="minimal-svg-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <div className="minimal-service-amount">+${(SERVICE_OPTIONS.mattressRemoval.price / 100).toFixed(0)}</div>
        </button>

        {/* Basic Setup */}
        <button
          type="button"
          className={`service-minimal-tile glass-tile ${deliveryDetails.setupService ? 'selected' : ''}`}
          onClick={() => handleServiceToggle('setup')}
          aria-pressed={deliveryDetails.setupService}
        >
          <span className="ripple"></span>
          <div className="minimal-service-title">Setup</div>
          <div className="minimal-icon-wrapper">
            <svg className="minimal-svg-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div className="minimal-service-amount">+${(SERVICE_OPTIONS.setupService.price / 100).toFixed(0)}</div>
        </button>

      </div>
    </Card>
  );
}