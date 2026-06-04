# Research Notes: Auto-Format Amount Inputs

## Core Research Questions & Decisions

### 1. Form Input Caret Preservation in Controlled React Inputs
- **Decision**: Track the number of "data characters" (excluding thousands separators) before the cursor prior to formatting, and restore the cursor position after formatting by matching that count.
- **Rationale**: Direct string replacement causes React to update the DOM value, resetting the input selection start to the end. Re-mapping the selection start based on the number of data characters ensures typing in the middle of a formatted number works perfectly without cursor jumps.
- **Alternatives Considered**: 
  - Using a third-party library like `react-number-format`. Rejected because we want to avoid extra dependencies, keep the bundle size small, and have complete CSS/custom styling control over the inputs.
  - Restoring cursor by simple index differences. Rejected because index differences are prone to errors when thousands separators are dynamically added or removed (e.g. going from `999` to `1.000` shifts the index by two instead of one).

### 2. Form Submission with Format Separators
- **Decision**: Use a hidden `<input type="hidden" name={name} value={value} />` to submit the clean numeric string, while leaving the formatted string in the visible `<input type="text" />` with no `name` attribute.
- **Rationale**: Since Next.js Server Actions process forms natively using standard `FormData` from input `name` attributes, renaming/omitting the name on the formatted input and adding a hidden input with the clean value ensures the server receives standard numeric strings without any modifications to backend actions or validations.
- **Alternatives Considered**:
  - Intercepting the `onSubmit` event to clean the values inside `FormData`. Rejected because Server Actions are often bound directly to form actions (`action={action}`), making direct onSubmit mutation less reliable than using native hidden input elements.

### 3. Backspace Trap Avoidance
- **Decision**: Intercept `onKeyDown` for `Backspace` and `Delete` keys. If the cursor is adjacent to a thousands separator, programmatically move the selection pointer over the separator before the default delete operation occurs.
- **Rationale**: This lets the browser natively delete the actual digit next to the separator. Otherwise, if the user hits backspace on a dot in `33.000.000`, the dot is deleted, formatting puts the dot back immediately, and the user is unable to delete the numbers before the separator.
- **Alternatives Considered**:
  - Handling deletion inside `onChange` by parsing the diff between old and new strings. Rejected because it is complex to distinguish a backspace on a separator from pasting, cursor selections, or normal editing.
