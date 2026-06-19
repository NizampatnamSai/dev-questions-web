import { createContext, useContext, useEffect, useState, useCallback } from "react";

function codeToCondition(code) {
  if (code === 0)   return "sunny";
  if (code <= 3)    return "cloudy";
  if (code <= 48)   return "foggy";
  if (code <= 67)   return "rainy";
  if (code <= 77)   return "snowy";
  if (code <= 82)   return "rainy";
  if (code <= 86)   return "snowy";
  return "stormy";
}

export const CONDITION_META = {
  sunny:  { label: "Sunny",  icon: "☀️" },
  cloudy: { label: "Cloudy", icon: "⛅" },
  foggy:  { label: "Foggy",  icon: "🌫️" },
  rainy:  { label: "Rainy",  icon: "🌧️" },
  snowy:  { label: "Snowy",  icon: "❄️" },
  stormy: { label: "Stormy", icon: "⛈️" },
};

const WeatherContext = createContext(null);

export function WeatherProvider({ children }) {
  const [enabled,   setEnabled]   = useState(() => localStorage.getItem("devquiz_weather") === "true");
  const [manual,    setManual]    = useState(() => localStorage.getItem("devquiz_weather_manual") || "");
  // manual location chosen from state/capital picker: { state, capital, lat, lon } | null
  const [manualLoc, setManualLoc] = useState(() => {
    try { return JSON.parse(localStorage.getItem("devquiz_weather_loc") || "null"); }
    catch { return null; }
  });
  const [condition, setCondition] = useState(null);
  const [temp,      setTemp]      = useState(null);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState(null);
  const [locName,   setLocName]   = useState(null);
  const [locDenied, setLocDenied] = useState(false);

  const fetchWeather = useCallback(async (lat, lon, cityHint = null) => {
    setLoading(true);
    setError(null);
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=weather_code,temperature_2m&timezone=auto`;
      const res  = await fetch(url);
      const data = await res.json();
      const code = data.current?.weather_code ?? 0;
      const t    = data.current?.temperature_2m ?? null;
      setCondition(codeToCondition(code));
      setTemp(t !== null ? Math.round(t) : null);

      if (cityHint) {
        setLocName(cityHint);
      } else {
        try {
          const geo = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`);
          const gd  = await geo.json();
          setLocName(gd.address?.city || gd.address?.town || gd.address?.village || gd.address?.county || null);
        } catch { /* city name optional */ }
      }
    } catch {
      setError("Couldn't fetch weather");
    } finally {
      setLoading(false);
    }
  }, []);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocDenied(true);
      setError("Geolocation not supported");
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocDenied(false);
        fetchWeather(pos.coords.latitude, pos.coords.longitude);
      },
      () => {
        setLocDenied(true);
        setError("Location denied");
        setLoading(false);
      }
    );
  }, [fetchWeather]);

  // Set a state/capital as manual location and fetch weather for it
  const setManualLocation = useCallback((locObj) => {
    setManualLoc(locObj);
    setError(null);
    if (locObj) {
      localStorage.setItem("devquiz_weather_loc", JSON.stringify(locObj));
      fetchWeather(locObj.lat, locObj.lon, locObj.capital);
    } else {
      localStorage.removeItem("devquiz_weather_loc");
      setLocDenied(false);
      requestLocation();
    }
  }, [fetchWeather, requestLocation]);

  useEffect(() => {
    localStorage.setItem("devquiz_weather", String(enabled));
    if (enabled && !manual) {
      if (manualLoc) {
        fetchWeather(manualLoc.lat, manualLoc.lon, manualLoc.capital);
      } else {
        requestLocation();
      }
    }
    if (!enabled) {
      setCondition(null); setTemp(null); setLocName(null);
      setError(null); setLocDenied(false);
    }
  }, [enabled]); // eslint-disable-line

  useEffect(() => {
    localStorage.setItem("devquiz_weather_manual", manual);
  }, [manual]);

  const toggleEnabled      = () => setEnabled(v => !v);
  const setManualCondition = (c) => { setManual(c); setError(null); };

  const activeCondition = enabled ? (manual || condition) : null;
  const meta = activeCondition ? CONDITION_META[activeCondition] : null;

  return (
    <WeatherContext.Provider value={{
      enabled, toggleEnabled,
      manual, setManualCondition,
      manualLoc, setManualLocation,
      condition, activeCondition,
      temp, locName, loading, error, locDenied,
      meta, CONDITION_META,
    }}>
      {children}
    </WeatherContext.Provider>
  );
}

export function useWeather() {
  return useContext(WeatherContext);
}
