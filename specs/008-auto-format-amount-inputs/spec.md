# Feature Specification: Auto-Format Amount Inputs

**Feature Branch**: `008-auto-format-amount-inputs`

**Created**: 2026-06-04

**Status**: Draft

**Input**: User description: "phần nhập số tiền ở các page mình muốn có prefix tự động thêm dấu . sau khi input"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Auto-Format VND Transaction Amounts (Priority: P1) 🎯 MVP

When the user enters a money amount in VND (e.g., in the Add Income or Add Transaction modal), the input field automatically formats the number with dot (`.`) thousands separators as they type.

**Why this priority**: Core requirement for readability of large numbers in VND, delivering the immediate value of preventing typing errors.

**Independent Test**: Open the "Nhập thu nhập mới" modal on the Assets page, select a VND account, type `33000000` in the amount input, verify the field displays `33.000.000` and saving the transaction records `33000000` in the database.

**Acceptance Scenarios**:
1. **Given** the modal is open and currency is VND, **When** the user types `33000000`, **Then** the input displays `33.000.000`.
2. **Given** the input displays `33.000.000`, **When** the user submits the form, **Then** the transaction is successfully created with the amount of `33000000` in the database.

---

### User Story 2 - Auto-Format USD Transaction Amounts (Priority: P2)

When the user selects USD as the currency, the input field formats the number with comma (`,`) thousands separators and allows entering a decimal point (`.`), matching standard English financial formatting.

**Why this priority**: Ensures consistency across multi-currency support in the application.

**Independent Test**: Open the "Thêm tài sản mới" modal, select USD currency, type `1250.5` in the purchase unit price, verify the field displays `1,250.5`, and saving the asset records `1250.5` in the database.

**Acceptance Scenarios**:
1. **Given** the modal is open and currency is USD, **When** the user types `1250.5`, **Then** the input displays `1,250.5`.

---

### Edge Cases

- **Pasting Non-Numeric Text**: If the user pastes text containing letters or invalid punctuation, the system MUST strip all non-numeric characters before formatting (except the decimal separator in USD).
- **Deleting Separators**: If the user presses backspace on a separator character (e.g., the dot in `33.000.000`), the system MUST delete the adjacent number as well to prevent the user from being trapped by formatting.
- **Empty Value**: If the input is cleared completely, the system MUST display an empty field (or placeholder) without defaulting to `0` or formatting errors.
- **Max Length**: If the user reaches a character limit, formatting MUST not cause overflow or truncate digits unexpectedly.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST automatically format numeric amount inputs on all modals and forms (Transaction creation, Asset creation, Asset edit, Income logging).
- **FR-002**: For VND amounts, the system MUST use `.` as the thousands separator and reject any decimal inputs.
- **FR-003**: For USD amounts, the system MUST use `,` as the thousands separator and `.` as the decimal separator.
- **FR-004**: The system MUST submit the clean raw numeric value (without separators) to the server actions to prevent validation errors or parsing bugs.
- **FR-005**: Text input cursor position MUST be preserved during auto-formatting so that typing in the middle of the string is not disrupted.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of VND transaction amount inputs are automatically formatted with `.` separators as the user types.
- **SC-002**: 100% of USD transaction amount inputs are automatically formatted with `,` separators as the user types.
- **SC-003**: All server action submissions parse the formatted inputs successfully without dropping digits.

## Assumptions

- VND transactions are integer-only.
- The formatting library or utility will be implemented as a reusable React hook or custom component to avoid code duplication across the app.
