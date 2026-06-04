# Research and Decisions: Asset and Income Dashboard Refinements

This document records the key design and implementation decisions for the Asset and Income Dashboard Refinements.

## Decision 1: Converting Income Amount to Asset Quantity for Non-Wallet Assets

- **Decision**: When routing income (logged in fiat currency like VND or USD) to a non-wallet asset (e.g. stock, crypto, gold), the system calculates the quantity increase as `amount / unit_price` using the asset's current price.
- **Rationale**: Keeps the transaction entry unified (fiat amount) while correctly reflecting physical asset acquisition.
- **Alternatives considered**:
  - Requiring the user to input quantity directly in the income form (rejected as it breaks the standard fiat-based income flow).
  - Simply adding the amount directly to the quantity (rejected as it is incorrect for non-cash assets).

## Decision 2: Location of Asset Quantities on Pie Chart Interaction

- **Decision**: Display a detailed breakdown list of asset holdings (names and quantities) in a panel directly below the donut chart upon selecting a category segment.
- **Rationale**: Highly readable and scales well even when a category contains multiple assets (e.g., Bitcoin and Ethereum in "Crypto").
- **Alternatives considered**:
  - Showing inside the donut center overlay (rejected because text gets too small or truncated with multiple assets).
  - Showing inside the legend items (rejected because it makes the legend layout look cluttered).

## Decision 3: Placement of Filter and Sort Controls on Assets Page

- **Decision**: Create a dedicated toolbar directly above the assets list table on the Assets page.
- **Rationale**: Follows standard modern web application layouts, keeps the primary page header clean, and adapts well to mobile screens.
- **Alternatives considered**:
  - Putting them in the main page header next to the buttons (rejected as it crowds the header).
  - Putting them in the table column headers (rejected as it is less responsive on smaller viewports).
