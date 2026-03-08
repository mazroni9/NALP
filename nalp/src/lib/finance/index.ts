/**
 * Finance module: central assumptions, scenarios, and metrics.
 */

export {
  getDefaultAssumptionsBundle,
  getSensitiveAssumptionsForZone,
  PROJECT_ASSUMPTIONS,
  SENSITIVE_ASSUMPTION_KEYS_ZONE_C,
  SENSITIVE_ASSUMPTION_KEYS_ZONE_D,
  ZONE_A_ASSUMPTIONS,
  ZONE_B_ASSUMPTIONS,
  ZONE_C_ASSUMPTIONS,
  ZONE_D_ASSUMPTIONS,
  type Assumption,
  type AssumptionsBundle,
  type ConfidenceLevel,
  type SourceType,
} from "./assumptions";

export { resolveAssumptionsToEngineInputs, type ResolvedEngineInputs } from "./engineInputs";

export { computeProjectMetrics } from "./metrics";

export { getScenarioAssumptions, type ScenarioId } from "./scenarios";

export {
  getIncomeByZone,
  getIncomeByType,
  INCOME_TYPE_LABELS,
  ZONE_TO_INCOME_TYPES,
  type IncomeByTypeRow,
  type IncomeByZoneRow,
  type IncomeTypeId,
} from "./incomeClassification";
