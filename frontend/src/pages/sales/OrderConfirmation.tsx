import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header, ActionBar } from '@/app/layout';
import { paths } from '@/app/routing/paths';
import { SaleAPI } from '@/features/sale/api';
import type { SaleOrder } from '@/shared/types';
import './OrderConfirmation.css';

export default function OrderConfirmationPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<SaleOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadOrder = async () => {
      if (!orderId) {
        setError('No order ID provided');
        setLoading(false);
        return;
      }

      try {
        const orderData = await SaleAPI.getOrder(parseInt(orderId));
        setOrder(orderData);
      } catch (err) {
        console.error('Error loading order:', err);
        setError('Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [orderId]);

  const handleCreateAnother = () => {
    navigate(paths.sales.root());
  };

  const handleGoToDashboard = () => {
    navigate(paths.dashboard());
  };

  if (loading) {
    return (
      <>
        <Header title="Order Confirmation" />
        <main className="confirmation-container">
          <div className="confirmation-loading">
            <div className="spinner"></div>
            <p>Loading order details...</p>
          </div>
        </main>
        <ActionBar />
      </>
    );
  }

  if (error || !order) {
    return (
      <>
        <Header title="Order Confirmation" />
        <main className="confirmation-container">
          <div className="confirmation-error">
            <div className="error-icon">⚠️</div>
            <h2>Oops!</h2>
            <p>{error || 'Order not found'}</p>
            <button onClick={handleGoToDashboard} className="btn-primary">
              Go to Dashboard
            </button>
          </div>
        </main>
        <ActionBar />
      </>
    );
  }

  // Helper to safely convert to number and format
  const toNumber = (val: any): number => {
    if (typeof val === 'number') return val;
    if (typeof val === 'string') return parseFloat(val);
    return 0;
  };

  const formatPrice = (price: any): string => {
    return `$${toNumber(price).toFixed(2)}`;
  };

  const formatCurrency = (cents: any): string => {
    return `$${(toNumber(cents) / 100).toFixed(2)}`;
  };

  return (
    <>
      <Header title="Order Confirmation" />
      <main className="confirmation-container">
        <div className="confirmation-card">
          {/* Success Header */}
          <div className="confirmation-header">
            <div className="success-icon">✓</div>
            <h1>Order Created Successfully!</h1>
            <p className="order-number">Order #{order.id}</p>
          </div>

          {/* Customer Info */}
          <section className="confirmation-section">
            <h2>Customer Information</h2>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Name:</span>
                <span className="info-value">{order.customer.name || `${order.customer.firstName} ${order.customer.lastName}`}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Phone:</span>
                <span className="info-value">{order.customer.phone}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Email:</span>
                <span className="info-value">{order.customer.email}</span>
              </div>
            </div>
          </section>

          {/* Order Items */}
          <section className="confirmation-section">
            <h2>Items Ordered</h2>
            <div className="items-list">
              {order.items.map((item) => (
                <div key={item.id} className="item-row">
                  <div className="item-details">
                    <span className="item-name">{item.name}</span>
                    {item.color && <span className="item-color">Color: {item.color}</span>}
                    <span className="item-sku">SKU: {item.sku}</span>
                  </div>
                  <div className="item-quantity">×{item.qty}</div>
                  <div className="item-price">{formatPrice(item.price)}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Delivery Info */}
          <section className="confirmation-section">
            <h2>Delivery Details</h2>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Preferred Date:</span>
                <span className="info-value">{order.delivery.preferredDate}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Time Slot:</span>
                <span className="info-value">{order.delivery.timeSlot}</span>
              </div>
              {order.delivery.specialInstructions && (
                <div className="info-item full-width">
                  <span className="info-label">Instructions:</span>
                  <span className="info-value">{order.delivery.specialInstructions}</span>
                </div>
              )}
            </div>
            {(order.delivery.whiteGloveService || order.delivery.oldMattressRemoval || order.delivery.setupService) && (
              <div className="services-list">
                <span className="info-label">Additional Services:</span>
                <ul>
                  {order.delivery.whiteGloveService && <li>White Glove Service</li>}
                  {order.delivery.oldMattressRemoval && <li>Old Mattress Removal</li>}
                  {order.delivery.setupService && <li>Setup Service</li>}
                </ul>
              </div>
            )}
          </section>

          {/* Order Total */}
          <section className="confirmation-section totals-section">
            <h2>Order Summary</h2>
            <div className="totals-grid">
              <div className="total-row">
                <span>Subtotal:</span>
                <span>{formatPrice(order.totals.subtotal)}</span>
              </div>
              <div className="total-row">
                <span>Delivery Fee:</span>
                <span>{formatCurrency(order.totals.deliveryFee)}</span>
              </div>
              {toNumber(order.totals.discount) > 0 && (
                <div className="total-row discount">
                  <span>Discount:</span>
                  <span>-{formatCurrency(order.totals.discount)}</span>
                </div>
              )}
              <div className="total-row total">
                <span>Total:</span>
                <span>{formatCurrency(order.totals.total)}</span>
              </div>
            </div>
          </section>

          {/* Payment Info */}
          <section className="confirmation-section">
            <h2>Payment</h2>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Method:</span>
                <span className="info-value">{order.payment.method.toUpperCase()}</span>
              </div>
              {toNumber(order.payment.depositAmount) > 0 && (
                <div className="info-item">
                  <span className="info-label">Deposit Paid:</span>
                  <span className="info-value">{formatPrice(order.payment.depositAmount)}</span>
                </div>
              )}
            </div>
          </section>

          {/* Action Buttons */}
          <div className="confirmation-actions">
            <button onClick={handleCreateAnother} className="btn-primary">
              Create Another Order
            </button>
            <button onClick={handleGoToDashboard} className="btn-secondary">
              Go to Dashboard
            </button>
          </div>
        </div>
      </main>
      <ActionBar />
    </>
  );
}
