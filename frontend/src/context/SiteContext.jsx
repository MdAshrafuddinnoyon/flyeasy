import React, { createContext, useContext, useState, useEffect } from "react";
import { SiteContent } from "@/lib/api";

const SiteContext = createContext({});

export function SiteProvider({ children }) {
  const [siteData, setSiteData] = useState(null);

  useEffect(() => {
    SiteContent.get()
      .then((data) => setSiteData(data))
      .catch((err) => console.error("Failed to load site content", err));
  }, []);

  // Dynamically update favicon
  useEffect(() => {
    if (siteData?.favicon_url) {
      let link = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement("link");
        link.rel = "icon";
        document.head.appendChild(link);
      }
      link.href = siteData.favicon_url;
    }
  }, [siteData?.favicon_url]);

  // Dynamically update page title
  useEffect(() => {
    if (siteData?.site_name) {
      document.title = `${siteData.site_name} — Effortless Travel, Elevated`;
    }
  }, [siteData?.site_name]);

  return (
    <SiteContext.Provider value={{ siteData, setSiteData }}>
      {children}
    </SiteContext.Provider>
  );
}

export function useSiteContent() {
  return useContext(SiteContext);
}
