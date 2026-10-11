// SPDX-License-Identifier: MIT
import test from 'node:test';
import assert from 'node:assert/strict';
import { SmartGridOptimizerEngine } from '../dist/index.js';

test('1. optimizeZoneDispatch prioritizes 100% solar and renewables when sufficient', () => {
  const telemetry = {
    zoneId: 'accra-central-01',
    zoneName: 'Accra Central Financial District',
    currentDemandMegawatts: 35.0,
    availableCapacityMegawatts: 100.0,
    solarGenerationMegawatts: 40.0,
    batteryReservePercent: 85,
    gridFrequencyHz: 50.02
  };

  const directive = SmartGridOptimizerEngine.optimizeZoneDispatch(telemetry);
  assert.equal(directive.zoneId, 'accra-central-01');
  assert.equal(directive.sourceAllocation.SOLAR_PHOTOVOLTAIC, 35.0);
  assert.equal(directive.sourceAllocation.MUNICIPAL_GRID_IMPORT, 0);
  assert.equal(directive.recommendedCurtailmentMegawatts, 0);
  assert.ok(directive.projectedCostSavingsUSDPerHour > 0);
  assert.ok(directive.co2AbatementKgPerHour > 0);
  assert.ok(directive.stabilityIndex >= 95);
  assert.equal(directive.isAlertTriggered, false);
});

test('2. Deficit triggers battery discharge and grid import balancing', () => {
  const telemetry = {
    zoneId: 'kumasi-industrial-02',
    zoneName: 'Kumasi Industrial Hub',
    currentDemandMegawatts: 80.0,
    availableCapacityMegawatts: 120.0,
    solarGenerationMegawatts: 20.0,
    batteryReservePercent: 60,
    gridFrequencyHz: 49.95
  };

  const directive = SmartGridOptimizerEngine.optimizeZoneDispatch(telemetry);
  assert.equal(directive.sourceAllocation.SOLAR_PHOTOVOLTAIC, 20.0);
  assert.ok(directive.sourceAllocation.BATTERY_STORAGE > 0);
  assert.ok(directive.sourceAllocation.HYDRO_ELECTRIC > 0);
  assert.equal(directive.recommendedCurtailmentMegawatts, 0);
  assert.equal(directive.isAlertTriggered, false);
});

test('3. Extreme demand exceeding capacity triggers load shedding alert', () => {
  const telemetry = {
    zoneId: 'tema-port-03',
    zoneName: 'Tema Port Industrial Zone',
    currentDemandMegawatts: 150.0,
    availableCapacityMegawatts: 90.0, // deficit of 60MW
    solarGenerationMegawatts: 10.0,
    batteryReservePercent: 15, // under 20% threshold
    gridFrequencyHz: 49.60
  };

  const directive = SmartGridOptimizerEngine.optimizeZoneDispatch(telemetry);
  assert.ok(directive.recommendedCurtailmentMegawatts > 0);
  assert.equal(directive.isAlertTriggered, true);
  assert.ok(directive.alertSummary.includes('load shedding recommended'));
  assert.ok(directive.stabilityIndex < 90);
});

test('4. Catastrophic grid frequency excursion throws error', () => {
  assert.throws(() => {
    SmartGridOptimizerEngine.optimizeZoneDispatch({
      zoneId: 'fail-01',
      zoneName: 'Failure Zone',
      currentDemandMegawatts: 50.0,
      availableCapacityMegawatts: 100.0,
      solarGenerationMegawatts: 10.0,
      batteryReservePercent: 50,
      gridFrequencyHz: 44.0 // out of bounds
    });
  }, /Catastrophic grid frequency excursion detected/);
});
