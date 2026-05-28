"use client";

import React, { createContext, useContext } from "react";
import { SiteConfig, DEFAULT_CONFIG } from "@/lib/siteConfig";

const SiteContext = createContext<SiteConfig>(DEFAULT_CONFIG);

export function SiteProvider({
  children,
  config,
}: {
  children: React.ReactNode;
  config: SiteConfig;
}) {
  return (
    <SiteContext.Provider value={config}>
      {children}
    </SiteContext.Provider>
  );
}

export function useSiteConfig() {
  return useContext(SiteContext);
}
