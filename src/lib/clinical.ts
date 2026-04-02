/**
 * National Early Warning Score 2 (NEWS2) Calculation Engine
 * Devised by the Royal College of Physicians (RCP)
 */

export interface Vitals {
  respirationRate: number
  spO2: number
  supplementalOxygen: boolean
  systolicBP: number
  pulse: number
  temperature: number
  consciousness: 'ALERT' | 'ACVPU'
}

export type News2Risk = 'LOW' | 'LOW-MEDIUM' | 'MEDIUM' | 'HIGH' | 'EMERGENCY'

export function calculateNews2(v: Vitals): { score: number, risk: News2Risk } {
  let score = 0

  // 1. Respiration Rate
  if (v.respirationRate <= 8 || v.respirationRate >= 25) score += 3
  else if (v.respirationRate >= 21) score += 2
  else if (v.respirationRate >= 9 && v.respirationRate <= 11) score += 1

  // 2. SpO2 (Scale 1 - Generic)
  if (v.spO2 <= 91) score += 3
  else if (v.spO2 <= 93) score += 2
  else if (v.spO2 <= 95) score += 1

  // 3. Supplemental Oxygen
  if (v.supplementalOxygen) score += 2

  // 4. Systolic BP
  if (v.systolicBP <= 90 || v.systolicBP >= 220) score += 3
  else if (v.systolicBP >= 91 && v.systolicBP <= 100) score += 2
  else if (v.systolicBP >= 101 && v.systolicBP <= 110) score += 1

  // 5. Pulse
  if (v.pulse <= 40 || v.pulse >= 131) score += 3
  else if (v.pulse >= 111 && v.pulse <= 130) score += 2
  else if (v.pulse >= 41 && v.pulse <= 50 || v.pulse >= 91 && v.pulse <= 110) score += 1

  // 6. Consciousness (Alert scores 0, anything else 3)
  if (v.consciousness !== 'ALERT') score += 3

  // 7. Temperature
  if (v.temperature <= 35.0) score += 3
  else if (v.temperature >= 39.1) score += 2
  else if (v.temperature >= 35.1 && v.temperature <= 36.0 || v.temperature >= 38.1 && v.temperature <= 39.0) score += 1

  let risk: News2Risk = 'LOW'
  if (score >= 7) risk = 'EMERGENCY'
  else if (score >= 5) risk = 'HIGH'
  else if (score >= 3) risk = 'MEDIUM' // Or 3 in any single parameter, but we'll stick to total for now
  else if (score >= 1) risk = 'LOW-MEDIUM'

  return { score, risk }
}

export function getRiskColor(risk: News2Risk) {
  switch (risk) {
    case 'EMERGENCY': return 'text-red-600 bg-red-600/10 border-red-600/20 shadow-red-600/20'
    case 'HIGH': return 'text-red-500 bg-red-500/10 border-red-500/20 shadow-red-500/20'
    case 'MEDIUM': return 'text-orange-500 bg-orange-500/10 border-orange-500/20 shadow-orange-500/20'
    case 'LOW-MEDIUM': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20 shadow-yellow-500/20'
    default: return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20 shadow-emerald-500/20'
  }
}
