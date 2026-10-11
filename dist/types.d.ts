export type EnergySourceType = 'SOLAR_PHOTOVOLTAIC' | 'HYDRO_ELECTRIC' | 'BATTERY_STORAGE' | 'MUNICIPAL_GRID_IMPORT';
export interface GridZoneTelemetry {
    zoneId: string;
    zoneName: string;
    currentDemandMegawatts: number;
    availableCapacityMegawatts: number;
    solarGenerationMegawatts: number;
    batteryReservePercent: number;
    gridFrequencyHz: number;
}
export interface OptimizationDirective {
    zoneId: string;
    sourceAllocation: Record<EnergySourceType, number>;
    recommendedCurtailmentMegawatts: number;
    projectedCostSavingsUSDPerHour: number;
    co2AbatementKgPerHour: number;
    stabilityIndex: number;
    isAlertTriggered: boolean;
    alertSummary?: string;
}
