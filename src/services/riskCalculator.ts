import type { RiskLevel } from '../types';

/**
 * Deterministic risk score calculator.
 * Weights:
 *   Rainfall             30%
 *   Soil Moisture        20%
 *   Slope                20%
 *   Geological Susc.     15%
 *   Historical Events    10%
 *   Elevation factor      5%
 */
export function calculateRiskScore(
  rainfall: number,         // 0–300 mm
  soilMoisture: number,     // 0–100 %
  slope: number,            // 0–60 degrees
  geologicalSusceptibility: 'Low' | 'Moderate' | 'High',
  historicalEvents: number, // 0–20+
  elevation: number         // 0–5000 m
): number {
  // Normalize each factor 0–1
  const rainfallNorm = Math.min(rainfall / 300, 1);
  const moistureNorm = Math.min(soilMoisture / 100, 1);
  const slopeNorm = Math.min(slope / 60, 1);

  const geoMap = { Low: 0.2, Moderate: 0.5, High: 0.9 };
  const geoNorm = geoMap[geologicalSusceptibility];

  const histNorm = Math.min(historicalEvents / 20, 1);

  // Elevation factor: mid-elevation (1000–2500m) increases risk slightly
  const elevFactor = elevation > 500 && elevation < 3000 ? 0.6 : 0.3;

  const score =
    rainfallNorm * 0.30 +
    moistureNorm * 0.20 +
    slopeNorm    * 0.20 +
    geoNorm      * 0.15 +
    histNorm     * 0.10 +
    elevFactor   * 0.05;

  return Math.round(Math.min(score * 100, 100));
}

export function getRiskLevel(score: number): RiskLevel {
  if (score <= 25) return 'LOW';
  if (score <= 50) return 'MODERATE';
  if (score <= 75) return 'HIGH';
  return 'CRITICAL';
}

export function getRiskColor(level: RiskLevel): string {
  switch (level) {
    case 'LOW': return '#22c55e';
    case 'MODERATE': return '#eab308';
    case 'HIGH': return '#f97316';
    case 'CRITICAL': return '#ef4444';
  }
}

export function getRiskBgClass(level: RiskLevel): string {
  switch (level) {
    case 'LOW': return 'bg-green-500/20 text-green-400 border-green-500/30';
    case 'MODERATE': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    case 'HIGH': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
    case 'CRITICAL': return 'bg-red-500/20 text-red-400 border-red-500/30';
  }
}

export function getRiskTextClass(level: RiskLevel): string {
  switch (level) {
    case 'LOW': return 'text-green-400';
    case 'MODERATE': return 'text-yellow-400';
    case 'HIGH': return 'text-orange-400';
    case 'CRITICAL': return 'text-red-400';
  }
}

/** Generate feature importance values based on inputs */
export function getFeatureImportance(
  rainfall: number,
  soilMoisture: number,
  slope: number,
  geologicalSusceptibility: 'Low' | 'Moderate' | 'High',
  historicalEvents: number
): { feature: string; value: number; pct: number }[] {
  const r = Math.min(rainfall / 300, 1) * 0.30;
  const m = Math.min(soilMoisture / 100, 1) * 0.20;
  const s = Math.min(slope / 60, 1) * 0.20;
  const geoMap = { Low: 0.2, Moderate: 0.5, High: 0.9 };
  const g = geoMap[geologicalSusceptibility] * 0.15;
  const h = Math.min(historicalEvents / 20, 1) * 0.10;

  const total = r + m + s + g + h || 1;
  return [
    { feature: 'Rainfall', value: r, pct: Math.round((r / total) * 100) },
    { feature: 'Soil Moisture', value: m, pct: Math.round((m / total) * 100) },
    { feature: 'Slope Angle', value: s, pct: Math.round((s / total) * 100) },
    { feature: 'Geological Susceptibility', value: g, pct: Math.round((g / total) * 100) },
    { feature: 'Historical Events', value: h, pct: Math.round((h / total) * 100) },
  ].sort((a, b) => b.value - a.value);
}
