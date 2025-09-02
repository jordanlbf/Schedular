// @ts-ignore
import React from "react";

export default function Input(
  { prefix, className = "", ...rest }:
  React.InputHTMLAttributes<HTMLInputElement> & { prefix?: string }
) {
  if (prefix !== undefined) {
    return (
      <div className={["input", "prefix", className].join(" ")}>
        <span className="prefix">{prefix}</span>
        <input {...rest} />
      </div>
    );
  }
  return <input className={["input", className].join(" ")} {...rest} />;
}
