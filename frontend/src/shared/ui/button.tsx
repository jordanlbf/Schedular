// @ts-ignore
import React from "react";

type Variant = "primary" | "soft" | "ghost";

export default function Button(
  { variant = "primary", full, className = "", ...rest }:
  React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; full?: boolean }
) {
  const base = "btn";
  const kind = variant === "primary" ? "btn-primary" : variant === "soft" ? "btn-soft" : "btn-ghost";
  const width = full ? "w-full" : "";
  return <button className={[base, kind, width, className].filter(Boolean).join(" ")} {...rest} />;
}
