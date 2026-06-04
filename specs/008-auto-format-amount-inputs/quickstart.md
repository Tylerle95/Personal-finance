# Quickstart: FormattedAmountInput

The `FormattedAmountInput` component is a drop-in replacement for standard `<input type="number" />` fields where monetary amounts are input.

## Usage Example

```tsx
import FormattedAmountInput from '@/components/ui/FormattedAmountInput'

// Inside a form
const [amount, setAmount] = useState('')

return (
  <FormattedAmountInput
    id="tx-amount"
    name="amount" // Submits raw string (e.g. "33000000") via FormData
    currency={activeCurrency} // "VND" or "USD"
    value={amount} // Controlled raw state
    onChange={setAmount} // Sets raw value (e.g., "33000000")
    className="form-input"
    required
  />
)
```

## How It Works Under the Hood

1. **Rendering**: The component reads the raw `value` (e.g. `33000000`) and formats it to a display value (`33.000.000` for VND, `33,000,000` for USD).
2. **Editing**: As the user types, it cleans the input (removing non-digits for VND; removing non-digits and non-dots for USD) and calls `onChange`.
3. **Caret Handling**: It tracks the cursor position relative to the digits, ensuring that when the value formats, the cursor stays at the correct relative position.
4. **Form Submission**: It renders a hidden input: `<input type="hidden" name={name} value={value} />`. The actual text input lacks a `name` attribute, meaning the server action receives only the clean raw string.
5. **Backspace/Delete**: It listens to key down events to ensure deleting separators deletes the digit before/after it, avoiding cursor traps.
