import React from "react";

export default function AuthLayout({ icon: Icon, title, subtitle, footer, children }) {
  // Support both Lucide icons (component) and custom render functions
  const renderIcon = () => {
    if (!Icon) return null;
    // If it's a React element already (JSX), render directly
    if (typeof Icon === 'function') {
      // Check if it returns JSX directly (render function) or is a component
      try {
        const el = Icon({});
        if (el && el.props) return el; // It's a render function returning JSX
      } catch {}
      return <Icon className="w-7 h-7 text-primary-foreground" aria-hidden="true" />;
    }
    return null;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center mb-6">
            {/* Light Mode Logo (hidden in dark mode) */}
            <img src="/images/logo-light.png" alt="Company Logo" className="h-16 dark:hidden object-contain" onError={(e) => e.target.style.display = 'none'} />
            {/* Dark Mode Logo (hidden in light mode) */}
            <img src="/images/logo-dark.png" alt="Company Logo" className="h-16 hidden dark:block object-contain" onError={(e) => e.target.style.display = 'none'} />
            
            {/* Fallback Icon if images fail or missing */}
            <div className="w-16 h-16 rounded-2xl bg-deep-space shadow-lg hidden [&:has(+img[style*='display: none'])]:flex items-center justify-center">
              {renderIcon()}
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{title}</h1>
          {subtitle && <p className="text-muted-foreground mt-2">{subtitle}</p>}
        </div>
        <div className="bg-card rounded-2xl shadow-sm border border-border p-8">
          {children}
        </div>
        {footer && (
          <p className="text-center text-sm text-muted-foreground mt-6">{footer}</p>
        )}
      </div>
    </div>
  );
}
