"use client";

import { ReactNode } from "react";

interface CrtScreenProps {
  children: ReactNode;
  poweredOn?: boolean;
}

export function CrtScreen({ children, poweredOn = true }: CrtScreenProps) {
  return (
    <div className={`crt-screen ${poweredOn ? "crt-on" : ""}`}>
      <div className="crt-inner">{children}</div>
    </div>
  );
}
