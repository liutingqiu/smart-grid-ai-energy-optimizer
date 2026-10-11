// SPDX-License-Identifier: MIT

export type EnergySourceType = 'SOLAR_PHOTOVOLTAIC' | 'HYDRO_ELECTRIC' | 'BATTERY_STORAGE' | 'MUNICIPAL_GRID_IMPORT';

export interface GridZoneTelemetry {
  zoneId: string;
  zoneName: string;
  currentDemandMegawatts: number;
  availableCapacityMegawatts: number;
  solarGenerationMegawatts: number;
  batteryReservePercent: number; // 0 to 100
  gridFrequencyHz: number; // nominal 50.00 Hz, stable within 49.5 - 50.5
}

export interface OptimizationDirective {
  zoneId: string;
  sourceAllocation: Record<EnergySourceType, number>; // MW allocated
  recommendedCurtailmentMegawatts: number;
  projectedCostSavingsUSDPerHour: number;
  co2AbatementKgPerHour: number;
  stabilityIndex: number; // 0 to 100, where >= 90 is robust
  isAlertTriggered: boolean;
  alertSummary?: string;
}
