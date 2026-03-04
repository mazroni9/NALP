Financial Canon — Source of Truth (NALP)
========================================

Purpose
-------

This document defines the financial “source of truth” used by the Investor Dashboard, projections, and valuation tools.  
It prevents drift between UI numbers and the underlying financial engine.

Scope of Financial Consistency
------------------------------

This financial canon governs all of the following components:

- Investor Dashboard
- Projection tables (monthly / yearly)
- Executive Snapshot totals
- Valuation calculations
- Scenario simulations

No UI component or report may compute independent financial logic outside the engine.

Owner Income Definition (A)
---------------------------

**Owner Income (A) = Landowners’ share only, across all zones.**

Zone A (Auction)
----------------

Owner income over time is computed from the engine as:

- **Pre-breakeven**: `landCut100`  
  (100 SAR per car, applied while the deal is still pre-breakeven)
- **Post-breakeven**: `landOwnerShare50`  
  (50% of profit-after-OPEX, applied after breakeven)

So, for Zone A:

- **OwnerIncome = landCut100 + landOwnerShare50**

Note:

- `landCut100` applies only during **pre-breakeven** periods.
- `landOwnerShare50` applies only during **post-breakeven** periods.

Zones B / C / D (Waterfall model)
---------------------------------

Zones B/C/D now use a 3-layer waterfall between landowners, investors, and operator:

1. **Layer 1 — Return of Capital**  
   Profit is first used to return investor capital (until fully returned).
2. **Layer 2 — Preferred Return**  
   Preferred return is calculated **annually on unreturned capital** (remaining investor capital):  
   `Preferred Return = outstandingCapital × preferredReturnRateDecimal`
3. **Layer 3 — Residual Split**  
   Any remaining profit is split by a fixed residual split (land / investor / operator).

For Owner Income (A) in B/C/D:

- **OwnerIncome = land’s share from the residual layer (engine-derived)**.

If `investmentAmount = 0` (no investor scenario), the investor bucket is zeroed and the investor’s residual share is reassigned to the operator.

Breakeven Policy (A)
--------------------

Breakeven is applied using a clean rule:

- The breakeven period itself is treated as **pre-breakeven** financially.
- **Post-breakeven rules begin from the next period.**

This policy is applied directly for Zone A (operational breakeven).  
UI may label the breakeven period as “Breakeven” for clarity, but calculations follow the rule above.

For Zones B/C/D, the engine’s `breakEvenYear` corresponds to the **capital payback year**  
(the year in which investor capital has been fully returned via the waterfall), not an operational pricing breakeven.

Totals Engine
-------------

Project totals shown in the Executive Snapshot are computed by the **engine**, not from brochure/raw figures.

The totals engine returns (for a given number of years):

- `ownerTotalIncome8Years`
- `avgAnnualIncome`
- `valuationAtExit` (based on `CAP_RATE`)
- optional per-zone breakdown (`perZone`)

Valuation is calculated as:

- `valuationAtExit = avgAnnualIncome / CAP_RATE`

`CAP_RATE` is defined centrally in `financialCanon.ts` and **must not** be duplicated elsewhere.

Totals Mode (Official API Policy)
---------------------------------

`computeProjectTotalsFromEngine` supports:

### Default (Investor Dashboard)

- `mode = "operationalBaseline"` (default)  
  Assumes a real deal with capital fully funded per zone:

  - `investmentAmount = REQUIRED_CAPITAL[zoneId]`

  This is the official basis for **Investor-facing Snapshot/Dashboard totals**.

### Analytical Alternative

- `mode = "noInvestor"`  
  Computes operational capability **without investor capital**:

  - `investmentAmount = 0`

  This is intended for internal analysis and scenario exploration, **not** for the main investor snapshot.

Legacy Brochure Figures
------------------------

Raw/Brochure numbers remain in the codebase for reference and storytelling, but:

- They are **not** the source of truth for totals shown in the Investor Dashboard.

