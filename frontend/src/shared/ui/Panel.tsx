// @ts-ignore
import React from "react";

export default function Panel({ title, children }: { title: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="panel">
      <h2 className="panel-title">{title}</h2>
      {children}
    </section>
  );
}
