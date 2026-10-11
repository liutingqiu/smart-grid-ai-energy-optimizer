// SPDX-License-Identifier: MIT
import {
  GridZoneTelemetry,
  OptimizationDirective
} from '../types.js';

export class SmartGridOptimizerEngine {
  /**
   * Evaluates real-time municipal grid telemetry and generates optimal
   * energy source dispatch directives prioritizing zero-emission renewables.
   */
  public static optimizeZoneDispatch(telemetry: GridZoneTelemetry): OptimizationDirective {
    if (telemetry.currentDemandMegawatts < 0) {
      throw new Error('Demand cannot be negative');
    }
    if (telemetry.gridFrequencyHz < 45.0 || telemetry.gridFrequencyHz > 55.0) {
      throw new Error('Catastrophic grid frequency excursion detected');
    }

    const demand = telemetry.currentDemandMegawatts;
    let remainingDemand = demand;

    // 1. Dispatch Solar First (marginal cost = $0)
    const solarAllocated = Math.min(remainingDemand, telemetry.solarGenerationMegawatts);
    remainingDemand -= solarAllocated;

    // 2. Dispatch Battery Storage if reserves > 20%
    let batteryAllocated = 0;
    if (telemetry.batteryReservePercent > 20 && remainingDemand > 0) {
      const maxBatteryDischargeMW = (telemetry.batteryReservePercent / 100) * 50; // max 50MW rating
      batteryAllocated = Math.min(remainingDemand, maxBatteryDischargeMW);
      remainingDemand -= batteryAllocated;
    }

    // 3. Dispatch Hydro Electric
    let hydroAllocated = 0;
    if (remainingDemand > 0) {
      const hydroCapacityMW = 40; // baseline 40MW hydro
      hydroAllocated = Math.min(remainingDemand, hydroCapacityMW);
      remainingDemand -= hydroAllocated;
    }

    // 4. Municipal Grid Import for remaining deficit
    let gridImportAllocated = 0;
    let recommendedCurtailment = 0;
    if (remainingDemand > 0) {
      const maxImportAllowed = telemetry.availableCapacityMegawatts - (solarAllocated + batteryAllocated + hydroAllocated);
      if (maxImportAllowed >= remainingDemand) {
        gridImportAllocated = remainingDemand;
        remainingDemand = 0;
      } else {
        gridImportAllocated = Math.max(0, maxImportAllowed);
        recommendedCurtailment = remainingDemand - gridImportAllocated;
      }
    }

    // Savings calculation: baseline fossil generation = $0.14/kWh vs solar = $0.03/kWh
    // (Solar + Battery + Hydro) MW * 1000 kW * ($0.14 - $0.03) = savings
    const renewableTotalMW = solarAllocated + batteryAllocated + hydroAllocated;
    const costSavingsUSD = Number((renewableTotalMW * 1000 * 0.11).toFixed(2));

    // CO2 Abatement: ~0.82 kg CO2 per kWh of fossil fuel replaced
    const co2AbatementKg = Number((renewableTotalMW * 1000 * 0.82).toFixed(1));

    // Grid Frequency Stability Index: 50.00 Hz = 100 points
    const frequencyDeviation = Math.abs(50.00 - telemetry.gridFrequencyHz);
    let stabilityIndex = Math.max(0, Math.floor(100 - frequencyDeviation * 80));
    if (recommendedCurtailment > 0) {
      stabilityIndex = Math.max(20, stabilityIndex - 30);
    }

    const isAlert = recommendedCurtailment > 0 || frequencyDeviation > 0.4;
    const alertSummary = isAlert
      ? (recommendedCurtailment > 0
          ? `Capacity deficit: ${recommendedCurtailment.toFixed(1)} MW load shedding recommended`
          : `Frequency volatility: ${telemetry.gridFrequencyHz.toFixed(2)} Hz`)
      : undefined;

    return {
      zoneId: telemetry.zoneId,
      sourceAllocation: {
        SOLAR_PHOTOVOLTAIC: Number(solarAllocated.toFixed(2)),
        BATTERY_STORAGE: Number(batteryAllocated.toFixed(2)),
        HYDRO_ELECTRIC: Number(hydroAllocated.toFixed(2)),
        MUNICIPAL_GRID_IMPORT: Number(gridImportAllocated.toFixed(2))
      },
      recommendedCurtailmentMegawatts: Number(recommendedCurtailment.toFixed(2)),
      projectedCostSavingsUSDPerHour: costSavingsUSD,
      co2AbatementKgPerHour: co2AbatementKg,
      stabilityIndex,
      isAlertTriggered: isAlert,
      alertSummary
    };
  }
}
