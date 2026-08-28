import React, { useState, useEffect } from "react";
import { CloudSun, Loader2, MapPin, Wind } from "lucide-react";

const WMO = {
  0: "Clear sky", 1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
  45: "Fog", 48: "Rime fog", 51: "Light drizzle", 53: "Drizzle", 55: "Dense drizzle",
  61: "Light rain", 63: "Rain", 65: "Heavy rain", 71: "Light snow", 73: "Snow", 75: "Heavy snow",
  80: "Showers", 81: "Showers", 82: "Violent showers", 95: "Thunderstorm", 96: "Thunderstorm", 99: "Thunderstorm",
};

export default function WeatherWidget({ city }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!city) { setLoading(false); return; }
      try {
        const gRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`);
        const g = await gRes.json();
        if (!g.results || !g.results.length) { setErr(true); setLoading(false); return; }
        const { latitude, longitude, name, country } = g.results[0];
        const wRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,wind_speed_10m&timezone=auto`);
        const w = await wRes.json();
        if (mounted) setData({ temp: w.current.temperature_2m, code: w.current.weather_code, wind: w.current.wind_speed_10m, name, country });
      } catch (e) { if (mounted) setErr(true); }
      finally { if (mounted) setLoading(false); }
    })();
    return () => { mounted = false; };
  }, [city]);

  if (loading) return <div className="flex items-center gap-2 text-slate-400 text-sm"><Loader2 className="animate-spin" size={16} /> Loading weather…</div>;
  if (err || !data) return <div className="flex items-center gap-2 text-slate-400 text-sm"><CloudSun size={18} /> Weather unavailable for {city}.</div>;

  return (
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
        <CloudSun className="text-primary" size={24} />
      </div>
      <div className="min-w-0">
        <div className="flex items-center gap-1 text-xs text-slate-500"><MapPin size={12} /> <span className="truncate">{data.name}, {data.country}</span></div>
        <div className="text-2xl font-bold text-deep-space">{Math.round(data.temp)}°C</div>
        <div className="text-xs text-slate-500 flex items-center gap-2">
          <span>{WMO[data.code] || "—"}</span>
          <span className="flex items-center gap-0.5"><Wind size={11} /> {Math.round(data.wind)} km/h</span>
        </div>
      </div>
    </div>
  );
}
