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

// CACHE FOR WEATHER DATA (60-minute TTL)
const WEATHER_CACHE = new Map();
const CACHE_DURATION = 60 * 60 * 1000;  // 60 minutes
let weatherFetchTimer = null;

function getCachedWeather(lat, lon) {
  const key = `${lat.toFixed(4)},${lon.toFixed(4)}`;
  const cached = WEATHER_CACHE.get(key);
  if (cached && Date.now() - cached.time < CACHE_DURATION) {
    return cached.data;
  }
  return null;
}

function setCachedWeather(lat, lon, data) {
  const key = `${lat.toFixed(4)},${lon.toFixed(4)}`;
  WEATHER_CACHE.set(key, { data, time: Date.now() });
}

export function WeatherProvider({ children }) {
  const [enabled,   setEnabled]   = useState(() => localStorage.getItem("devquiz_weather") === "true");
  const [manual,    setManual]    = useState(() => localStorage.getItem("devquiz_weather_manual") || "");
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
    // Check cache first
    const cached = getCachedWeather(lat, lon);
    if (cached) {
      setCondition(cached.condition);
      setTemp(cached.temp);
      setLocName(cached.locName);
      setError(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // Validate coordinates
      if (!lat || !lon || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
        setError("Invalid location coordinates");
        setLoading(false);
        return;
      }

      // Fetch weather with short timeout (5 seconds max)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat.toFixed(4)}&longitude=${lon.toFixed(4)}&current=weather_code,temperature_2m&timezone=auto`;
        const res = await fetch(url, { signal: controller.signal, cache: 'default' });
        clearTimeout(timeoutId);

      if (!res.ok) {
        setError("Weather service unavailable");
        setLoading(false);
        return;
      }

      const data = await res.json();

      if (!data.current) {
        setError("No weather data available");
        setLoading(false);
        return;
      }

      const code = data.current.weather_code ?? 0;
      const t    = data.current.temperature_2m ?? null;

      setCondition(codeToCondition(code));
      setTemp(t !== null ? Math.round(t) : null);

      const finalLocName = cityHint || "Current Location";
      setLocName(finalLocName);

      // Cache the weather data
      setCachedWeather(lat, lon, {
        condition: codeToCondition(code),
        temp: t !== null ? Math.round(t) : null,
        locName: finalLocName,
      });

      // Lazy load city name in background (don't block on this)
      if (!cityHint) {
        setTimeout(async () => {
          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3000);
            const geo = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${lat.toFixed(4)}&lon=${lon.toFixed(4)}&format=json`,
              { signal: controller.signal, cache: 'default' }
            );
            clearTimeout(timeoutId);
            if (geo.ok) {
              const gd = await geo.json();
              const cityName = gd.address?.city || gd.address?.town || gd.address?.village || gd.address?.county || gd.address?.state || null;
              if (cityName) setLocName(cityName);
            }
          } catch { /* city name is optional */ }
        }, 0);
      }
    } catch (err) {
      console.error("Weather fetch error:", err);
      setError("Couldn't fetch weather. Check your location.");
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
        const { latitude, longitude, accuracy } = pos.coords;
        console.log(`Location: ${latitude.toFixed(4)}, ${longitude.toFixed(4)} (accuracy: ${accuracy}m)`);
        fetchWeather(latitude, longitude);
      },
      (error) => {
        setLocDenied(true);
        console.error("Geolocation error:", error.code, error.message);
        setError(
          error.code === 1 ? "Location permission denied" :
          error.code === 2 ? "Location unavailable" :
          "Couldn't get location"
        );
        setLoading(false);
      },
      {
        enableHighAccuracy: true,  // Request high accuracy
        timeout: 10000,             // 10 second timeout
        maximumAge: 60000           // Use cached location if less than 1 min old
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
