import React from "react";
import { useSiteContent } from "@/context/SiteContext";

const FALLBACK_LIGHT = "/images/logo-dark.png";
const FALLBACK_DARK = "/images/logo-light.png";

export default function Logo({ variant = "auto", className = "" }) {
  const { siteData } = useSiteContent();

  const logoLight = siteData?.logo_light_url || FALLBACK_LIGHT;
  const logoDark = siteData?.logo_dark_url || FALLBACK_DARK;

  if (variant === "auto") {
    return (
      <>
        <img src={logoLight} alt={siteData?.site_name || "FlyEasy"} className={`h-9 w-auto object-contain select-none dark:hidden ${className}`} draggable={false} />
        <img src={logoDark} alt={siteData?.site_name || "FlyEasy"} className={`h-9 w-auto object-contain select-none hidden dark:block ${className}`} draggable={false} />
      </>
    );
  }

  const isDark = variant === "dark" || variant === "white";
  const src = isDark ? logoDark : logoLight;

  return (
    <img
      src={src}
      alt={siteData?.site_name || "FlyEasy"}
      className={`h-9 w-auto object-contain select-none ${className}`}
      draggable={false}
    />
  );
}
