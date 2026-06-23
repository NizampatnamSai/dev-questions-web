import { useContext, useMemo, useCallback } from "react";
import { WeatherContext } from "../context/WeatherContext";

// Custom hook to prevent unnecessary re-renders from Weather context
export function useWeatherOptimized() {
  const context = useContext(WeatherContext);

  // Memoize only the values we actually use
  return useMemo(() => ({
    condition: context?.condition,
    temp: context?.temp,
    activeCondition: context?.activeCondition,
  }), [context?.condition, context?.temp, context?.activeCondition]);
}

export function useWeatherControls() {
  const context = useContext(WeatherContext);

  return useMemo(() => ({
    enabled: context?.enabled,
    loading: context?.loading,
    toggleWeather: context?.toggleWeather,
    requestLocation: context?.requestLocation,
  }), [context?.enabled, context?.loading, context?.toggleWeather, context?.requestLocation]);
}
