
export type MoonPhase = {
  name: string;
  emoji: string;
  phase: number; // 0-1 value representing the phase
  illumination: number; // 0-1 value
};

export const calculateMoonPhase = (date: Date): MoonPhase => {
  // Moon phase calculation algorithm
  // Based on Conway's algorithm and simplified for our purposes
  
  // Accurate enough for our purposes, but in a real app we would use a more precise library
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // JS months are 0-indexed
  const day = date.getDate();
  
  // Convert the date to Julian date
  let jd = day - 32075 + Math.floor(1461 * (year + 4800 + Math.floor((month - 14) / 12)) / 4) + 
          Math.floor(367 * (month - 2 - Math.floor((month - 14) / 12) * 12) / 12) - 
          Math.floor(3 * Math.floor((year + 4900 + Math.floor((month - 14) / 12)) / 100) / 4);
  
  // Calculate approximate phase
  // The moon's period is 29.53 days
  const moonPeriod = 29.53;
  // New moon date (Julian date)
  const newMoonRef = 2451549.5; // Jan 6, 2000 @ 18:14 UTC
  
  // Calculate days since reference new moon
  const daysSinceNewMoon = jd - newMoonRef;
  
  // Calculate the phase (0 to 1)
  let phase = (daysSinceNewMoon % moonPeriod) / moonPeriod;
  
  // Ensure phase is between 0 and 1
  if (phase < 0) phase += 1;
  
  // Illumination is a sinusoidal function of phase
  // (simplified for our purposes)
  const illumination = Math.abs(Math.cos(phase * 2 * Math.PI)); 
  
  // Determine moon phase name
  let name = "";
  let emoji = "";
  
  if (phase < 0.025 || phase >= 0.975) {
    name = "新月";
    emoji = "🌑";
  } else if (phase < 0.225) {
    name = "眉月";
    emoji = "🌒";
  } else if (phase < 0.275) {
    name = "上弦月";
    emoji = "🌓";
  } else if (phase < 0.475) {
    name = "盈凸月";
    emoji = "🌔";
  } else if (phase < 0.525) {
    name = "满月";
    emoji = "🌕";
  } else if (phase < 0.725) {
    name = "亏凸月";
    emoji = "🌖";
  } else if (phase < 0.775) {
    name = "下弦月";
    emoji = "🌗";
  } else if (phase < 0.975) {
    name = "残月";
    emoji = "🌘";
  }
  
  return {
    name,
    emoji,
    phase,
    illumination,
  };
};

export const getMoonPhases = (month: number, year: number): Record<number, MoonPhase> => {
  const daysInMonth = new Date(year, month, 0).getDate();
  const result: Record<number, MoonPhase> = {};
  
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month - 1, day);
    result[day] = calculateMoonPhase(date);
  }
  
  return result;
};

export const getMoonRiseSet = (date: Date, latitude: number, longitude: number): { rise: string, set: string } => {
  // In a real app, we would calculate this based on the date and location
  // For our MVP, we'll return approximate times
  
  // Simulation of different rise/set times based on moon phase
  const moonPhase = calculateMoonPhase(date);
  const phase = moonPhase.phase;
  
  // Base times that would be calculated from astronomical formulas
  let riseHour = Math.floor((phase * 24 + 18) % 24);
  let setHour = Math.floor((phase * 24 + 6) % 24);
  
  // Add slight randomness for variation
  const riseMinute = Math.floor(Math.random() * 60);
  const setMinute = Math.floor(Math.random() * 60);
  
  const formatTime = (hour: number, minute: number) => {
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  };
  
  return {
    rise: formatTime(riseHour, riseMinute),
    set: formatTime(setHour, setMinute)
  };
};
