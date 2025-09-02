import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
// @ts-ignore
import Header from "@/app/layout/Header";
import "./sale.css";

import type { Customer, Line } from "./types";
import { CATALOG } from "./catalog";

import CustomerForm from "./components/CustomerForm";
import ProductPicker from "./components/ProductPicker";
import CartTable from "./components/CartTable";
import PricingSummary from "./components/PricingSummary";

export default function CreateSale() {
  // customer
  const [customer, setCustomer] = useState<Customer>({ name: "", phone: "", email: "" });

  // cart lines
  const [lines, setLines] = useState<Line[]>([]);
  const [nextId, setNextId] = useState(1);

  // pricing
  const [deliveryFee, setDeliveryFee] = useState<number>(0);
  const [discountPct, setDiscountPct] = useState<number>(0);

  // optional notes
  const [deliveryNotes, setDeliveryNotes] = useState<string>("");

  // derived totals
  const totals = useMemo(() => {
    const itemCount = lines.reduce((n, l) => n + (l.qty ?? 0), 0);
    const subtotal = lines.reduce((sum, l) => sum + (l.price ?? 0) * (l.qty ?? 0), 0);
    const discountAmt = subtotal * (Math.max(0, Math.min(discountPct, 100)) / 100);
    const shipping = Math.max(0, deliveryFee);
    const total = Math.max(0, subtotal - discountAmt + shipping);
    return { itemCount, subtotal, discountPct, discountAmt, shipping, total };
  }, [lines, discountPct, deliveryFee]);

  // Add/merge by SKU; only bump nextId if a new row was created
  const handleAddToCart = (sku: string | number) => {
    const item = CATALOG.find((p) => p.sku === sku);
    if (!item) return;

    let created = false;

    setLines((curr) => {
      const i = curr.findIndex((l) => l.sku === sku);
      if (i !== -1) {
        const copy = [...curr];
        const existing = copy[i];
        copy[i] = { ...existing, qty: (existing.qty ?? 0) + 1 };
        return copy;
      }
      created = true;
      return [
        {
          id: nextId,
          sku: item.sku,
          name: item.name,
          price: item.price,
          qty: 1,
        },
        ...curr,
      ];
    });

    if (created) setNextId((n) => n + 1);
  };

  return (
    <>
      <Header />
      <main className="container sale-container">
        <div className="sale-header">
          <h1 className="page-title">Create Sale</h1>
          <Link to="/pos" className="back-link">← Back to Front Desk</Link>
        </div>

        <div className="sale-grid3">
          {/* LEFT: Customer */}
          <aside className="col-left">
            <div className="panel">
              <div className="panel-head">
                <h2 className="panel-title">Customer</h2>
              </div>
              <div className="panel-body">
                {/* Frameless to avoid duplicate inner title */}
                <CustomerForm value={customer} onChange={setCustomer} framed={false} />
              </div>
            </div>
          </aside>

          {/* CENTRE: Product Search / Picker and Cart */}
          <section className="col-center">
            <div className="panel">
              <div className="panel-head">
                <h2 className="panel-title">Add Products</h2>
              </div>
              <div className="panel-body">
                <ProductPicker catalog={CATALOG} onAdd={handleAddToCart} />
              </div>
            </div>

            <div className="panel cart-panel">
              <div className="panel-head">
                <h2 className="panel-title">Cart</h2>
              </div>

              <div className="panel-body cart-scroll">
                {lines.length > 0 ? (
                  <CartTable
                    lines={lines}
                    onChangeQty={(id, delta) => {
                      setLines((arr) =>
                        arr
                          .map((l) =>
                            l.id === id ? { ...l, qty: Math.max(0, (l.qty ?? 1) + delta) } : l
                          )
                          .filter((l) => (l.qty ?? 1) > 0) // drop lines that hit 0
                      );
                    }}
                    onRemove={(id) => setLines((arr) => arr.filter((l) => l.id !== id))}
                  />
                ) : (
                  <div className="cart-empty">
                    <p>Your cart is empty</p>
                    <span className="hint">Search products to add items.</span>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* RIGHT: Pricing and Delivery Instructions */}
          <aside className="col-right">
            <PricingSummary
              deliveryFee={deliveryFee}
              setDeliveryFee={setDeliveryFee}
              discountPct={discountPct}
              setDiscountPct={setDiscountPct}
              totals={totals}
              onSave={() => {}}
              onConfirm={() => {}}
            />

            <div className="panel">
              <div className="panel-head">
                <h2 className="panel-title">Delivery Instructions</h2>
              </div>
              <div className="panel-body">
                <textarea
                  className="input"
                  rows={5}
                  value={deliveryNotes}
                  placeholder="e.g. Call on arrival, gate code, preferred delivery window"
                  onChange={(e) => setDeliveryNotes(e.target.value)}
                />
              </div>
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}