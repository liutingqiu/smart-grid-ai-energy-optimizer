import { GridZoneTelemetry, OptimizationDirective } from '../types.js';
export declare class SmartGridOptimizerEngine {
    /**
     * Evaluates real-time municipal grid telemetry and generates optimal
     * energy source dispatch directives prioritizing zero-emission renewables.
     */
    static optimizeZoneDispatch(telemetry: GridZoneTelemetry): OptimizationDirective;
}
