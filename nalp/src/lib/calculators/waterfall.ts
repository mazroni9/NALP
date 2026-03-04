/**
 * waterfall.ts — 3-layer waterfall for Zones B/C/D (land / investor / operator)
 * Layer 1: Return of Capital
 * Layer 2: Preferred Return
 * Layer 3: Residual Split
 */

export interface WaterfallResidualSplit {
  land: number;
  investor: number;
  operator: number;
}

export interface WaterfallResult {
  landOwnerIncome: number;
  investorIncome: number;
  operatorIncome: number;
  steps: { name: string; amount: number }[];
}

export interface ComputeWaterfall3LayerParams {
  profitAfterOpex: number;
  investmentAmount: number;
  preferredReturnRateDecimal: number;
  residualSplit: WaterfallResidualSplit;
  /** Cumulative capital already returned to investor in prior periods (for multi-year) */
  cumulativeCapitalReturned?: number;
}

/**
 * Applies 3-layer waterfall to a single period's profit after OPEX.
 * Order: Return of Capital → Preferred Return → Residual (land / investor / operator).
 */
export function computeWaterfall3Layer(params: ComputeWaterfall3LayerParams): WaterfallResult {
  const {
    profitAfterOpex,
    investmentAmount,
    preferredReturnRateDecimal,
    residualSplit,
    cumulativeCapitalReturned = 0,
  } = params;

  const steps: { name: string; amount: number }[] = [];
  let remaining = Math.max(0, profitAfterOpex);
  const outstandingCapital = Math.max(0, investmentAmount - cumulativeCapitalReturned);
  const hasInvestor = investmentAmount > 0;

  // Layer 1: Return of Capital
  const returnOfCapital = Math.min(remaining, outstandingCapital);
  remaining -= returnOfCapital;
  steps.push({ name: "Return of Capital", amount: returnOfCapital });

  // Layer 2: Preferred Return (on outstanding capital for this period)
  const preferredReturn = hasInvestor
    ? Math.min(remaining, outstandingCapital * preferredReturnRateDecimal)
    : 0;
  remaining -= preferredReturn;
  steps.push({ name: "Preferred Return", amount: preferredReturn });

  // Layer 3: Residual split
  const landShare = remaining * residualSplit.land;
  const investorResidual = hasInvestor ? remaining * residualSplit.investor : 0;
  const operatorResidual = hasInvestor
    ? remaining * residualSplit.operator
    : remaining * (residualSplit.operator + residualSplit.investor);

  const landOwnerIncome = landShare;
  const investorIncome = hasInvestor
    ? returnOfCapital + preferredReturn + investorResidual
    : 0;
  const operatorIncome = operatorResidual;

  steps.push({ name: "Residual (Land)", amount: landShare });
  steps.push({ name: "Residual (Investor)", amount: investorResidual });
  steps.push({ name: "Residual (Operator)", amount: operatorResidual });

  return {
    landOwnerIncome,
    investorIncome,
    operatorIncome,
    steps,
  };
}
