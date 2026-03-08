/**
 * Reusable helpers: compute project metrics from scenario assumptions using the shared engine.
 */

import { computeProjectTotalsFromEngine } from "@/lib/calculators/projectTotalsEngine";
import type { ProjectTotalsEngineResult } from "@/lib/calculators/projectTotalsEngine";
import { getScenarioAssumptions } from "./scenarios";
import type { ScenarioId } from "./scenarios";

/**
 * Computes project-level metrics (owner total, avg annual, valuation, per-zone) for the given scenario.
 * Uses the shared engine; no duplicate logic.
 */
export function computeProjectMetrics(
  scenarioId: ScenarioId,
  years?: number
): ProjectTotalsEngineResult {
  const assumptions = getScenarioAssumptions(scenarioId);
  const projectionYears = years ?? assumptions.project.projectionYearsDefault;
  return computeProjectTotalsFromEngine({
    years: projectionYears,
    mode: "operationalBaseline",
    assumptions,
  });
}
