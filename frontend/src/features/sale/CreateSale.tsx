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
  const [deliveryFee, setDeliveryFee] = useState(0); // cents
  const [discountPct, setDiscountPct] = useState(0);
  const taxRate = 0.1;

  // actions
  const addItem = (sku: string) => {
    const p = CATALOG.find((x) => x.sku === sku);
    if (!p) return;
    setLines((xs) => {
      const exist = xs.find((l) => l.sku === sku);
      if (exist) return xs.map((l) => (l.sku === sku ? { ...l, qty: l.qty + 1 } : l));
      const id = nextId; setNextId(id + 1);
      return [...xs, { id, sku: p.sku, name: p.name, qty: 1, price: p.price }];
    });
  };
  const changeQty = (id: number, delta: number) =>
    setLines((xs) => xs.map((l) => (l.id === id ? { ...l, qty: Math.max(1, l.qty + delta) } : l)));
  const removeLine = (id: number) => setLines((xs) => xs.filter((l) => l.id !== id));

  // totals
  const totals = useMemo(() => {
    const subtotal = lines.reduce((s, l) => s + l.qty * l.price, 0);
    const discount = Math.round((subtotal * Math.min(100, Math.max(0, discountPct))) / 100);
    const withFees = subtotal - discount + deliveryFee;
    const tax = Math.round(withFees * taxRate);
    const total = withFees + tax;
    return { subtotal, discount, tax, total };
  }, [lines, discountPct, deliveryFee]);

  return (
    <div className="home-wrap">
      <Header right={<Link to="/pos" className="btn btn-soft">Front Desk</Link>} />

      <main className="page">
        <h1 className="page-title">Create Sale</h1>

        <div className="sale-grid">
          <CustomerForm value={customer} onChange={setCustomer} />

          <section className="panel">
            <ProductPicker catalog={CATALOG} onAdd={addItem} />
            <CartTable lines={lines} onChangeQty={changeQty} onRemove={removeLine} />
          </section>

          <PricingSummary
            deliveryFee={deliveryFee}
            setDeliveryFee={setDeliveryFee}
            discountPct={discountPct}
            setDiscountPct={setDiscountPct}
            totals={totals}
            onSave={() => {/* TODO: wire later */}}
            onConfirm={() => {/* TODO: payment modal later */}}
          />
        </div>

        <p><Link to="/pos" className="back-link">← Back to Front Desk</Link></p>
      </main>

      <footer className="home-footer">© {new Date().getFullYear()} Schedular</footer>
    </div>
  );
}
