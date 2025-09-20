"use client";
import { useEffect } from "react";
import fcl from "@/lib/fcl";

export default function FCLProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // FCL initialization is handled in the fcl.ts file
    // This component ensures FCL is only initialized on the client side
  }, []);

  return <>{children}</>;
}
