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

Zones B / C / D (Temporary assumption)
--------------------------------------

Until a formal “owner/operator waterfall” is defined for these zones, the engine treats:

- **OwnerIncome = profitAfterOpex**

This represents a temporary 100% owner assumption (no operator split modeled yet).  
Once a formal waterfall exists, the engine will be extended accordingly.

Breakeven Policy (A)
--------------------

Breakeven is applied using a clean rule:

- The breakeven period itself is treated as **pre-breakeven** financially.
- **Post-breakeven rules begin from the next period.**

This policy is consistent across:

- Monthly ledger (Zone A)
- Yearly projections (Zone A / Zone D)

UI may label the breakeven period as “Breakeven” for clarity, but calculations follow the rule above.

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

