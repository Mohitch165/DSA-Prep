import { useState, useCallback, useEffect } from 'react';

export type EnergyLevel = 'low' | 'medium' | 'high';

const ENERGY_KEY = 'adhd_energy_v1';
const LAST_VISIT_KEY = 'adhd_last_visit_v1';

export function useADHD() {
  const [energyLevel, setEnergyLevelState] = useState<EnergyLevel>(() => {
    return (localStorage.getItem(ENERGY_KEY) as EnergyLevel) || 'medium';
  });

  const [welcomeBack, setWelcomeBack] = useState(false);

  useEffect(() => {
    const lastVisit = localStorage.getItem(LAST_VISIT_KEY);
    const today = new Date().toISOString().slice(0, 10);
    if (lastVisit && lastVisit !== today) {
      setWelcomeBack(true);
    }
    localStorage.setItem(LAST_VISIT_KEY, today);
  }, []);

  const setEnergyLevel = useCallback((level: EnergyLevel) => {
    setEnergyLevelState(level);
    localStorage.setItem(ENERGY_KEY, level);
  }, []);

  const dismissWelcomeBack = useCallback(() => setWelcomeBack(false), []);

  return { energyLevel, setEnergyLevel, welcomeBack, dismissWelcomeBack };
}
