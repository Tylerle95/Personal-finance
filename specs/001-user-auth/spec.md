# Feature Specification: Supabase Authentication Integration with OTP Verification

**Feature Branch**: `001-user-auth`

**Created**: 2026-06-01
**Updated**: 2026-06-01

**Status**: Draft

**Input**: User description: "Supabase Authentication Integration with Email OTP Verification"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - New User Registration (Priority: P1)

As a new visitor, I want to create an account using my email, password, and full name so that I can start tracking my personal finances securely.

**Why this priority**: Crucial first step for any new user. Without an account, the system cannot link transactions or categories to a specific user under the database security policies.

**Independent Test**: A user navigates to the registration page, fills in their details, submits the form, and is successfully registered and redirected to the OTP verification page.

**Acceptance Scenarios**:

1. **Given** a visitor is on the registration page, **When** they fill in a valid full name, a unique email, and a strong password, and submit, **Then** a verification OTP code is sent to their email, and they are redirected to the verification page.
2. **Given** a visitor is on the registration page, **When** they submit an email that is already registered, **Then** they receive an error message stating that the email is already in use.
3. **Given** a visitor is on the registration page, **When** they submit a password that does not meet security requirements, **Then** they see a validation error and cannot register.

---

### User Story 2 - Email OTP Verification (Priority: P1)

As a newly registered user, I want to enter a 6-digit OTP code sent to my email so that I can securely activate my account and log in.

**Why this priority**: Ensures that the registered email address actually belongs to the user, enhancing security and preventing spam registrations, while offering a friction-free activation flow directly on the site (no need to click email link).

**Independent Test**: A user receives a 6-digit OTP code via email, enters it on the verification page, submits, and is automatically logged in and redirected to the dashboard.

**Acceptance Scenarios**:

1. **Given** a user is on the verification page (showing their email), **When** they enter the correct 6-digit OTP code and submit, **Then** their account is activated, they are logged in, and redirected to the dashboard.
2. **Given** a user is on the verification page, **When** they enter an invalid or expired OTP code, **Then** they see an error message "Mã xác thực không hợp lệ hoặc đã hết hạn" and remain on the page to try again.
3. **Given** a user is on the verification page, **When** their OTP code has expired or they didn't receive it, **When** they click "Gửi lại mã", **Then** a new OTP code is sent to their email, and a success notification is shown.

---

### User Story 3 - User Sign In (Priority: P1)

As a registered user, I want to securely log in with my email and password so that I can access my dashboard and view my financial data.

**Why this priority**: Essential for returning users to access their private financial records securely.

**Independent Test**: An existing user visits the login page, inputs their correct email and password, and is redirected to the dashboard.

**Acceptance Scenarios**:

1. **Given** a registered user is on the login page, **When** they input correct credentials and submit, **Then** they are redirected to the dashboard.
2. **Given** a visitor is on the login page, **When** they enter an incorrect email or password, **Then** they see an authentication failure message and remain on the login page.
3. **Given** a registered user whose email is not yet verified attempts to log in, **When** they submit their correct credentials, **Then** they see a warning message and are redirected to the verification page to verify their email.

---

### User Story 4 - Route Protection & Session Management (Priority: P1)

As a user, I want my session to remain active while I use the app, and I want restricted pages to be inaccessible to anyone who is not logged in.

**Why this priority**: Protects sensitive financial data from unauthorized access and ensures a seamless experience for logged-in users.

**Independent Test**: An unauthenticated user attempts to visit the dashboard URL and is redirected back to the login page.

**Acceptance Scenarios**:

1. **Given** an unauthenticated visitor tries to access the dashboard or transactions page directly via URL, **When** they load the page, **Then** they are redirected to the login page.
2. **Given** an authenticated user is on the dashboard, **When** they click the sign-out button, **Then** they are logged out, their session is cleared, and they are redirected to the login page.
3. **Given** an authenticated user is on the dashboard, **When** they close the tab and return later, **Then** they remain logged in and are shown the dashboard directly.

---

### Edge Cases

- **OTP Expiry**: OTP tokens generated by Supabase expire in a short window (typically 5-15 minutes). The verification page must clearly indicate this and provide a cooldown timer for "Resend OTP".
- **Session Expiry**: When a user's session expires due to inactivity, the next interaction must gracefully redirect them to the login page with a message.
- **Network Interruptions**: If the user attempts to sign in, register, or verify OTP without an active internet connection, the system must show a user-friendly offline message.
- **Form Resubmissions**: Double-clicking the submit button during registration, login, or verification must not trigger duplicate requests to the authentication backend.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a secure registration form requiring full name, email, and password.
- **FR-002**: System MUST validate email format (e.g. user@domain.com) and enforce password strength (minimum 8 characters).
- **FR-003**: System MUST support secure login via email and password credentials.
- **FR-004**: System MUST maintain the user's login state across browser sessions and tabs using secure cookies or tokens.
- **FR-005**: System MUST block access to restricted routes (including `/dashboard` and `/transactions`) for unauthenticated users, redirecting them to `/login`.
- **FR-006**: System MUST prevent authenticated users from accessing login and registration pages, redirecting them to `/dashboard` instead.
- **FR-007**: System MUST provide a clear sign-out action that terminates the user session and cleans up stored security tokens.
- **FR-008**: System MUST provide a secure OTP verification page (`/verify`) containing a 6-digit input form, displaying the user's email address.
- **FR-009**: System MUST verify the OTP code against Supabase Auth (`verifyOtp({ email, token, type: 'signup' })`) upon submission.
- **FR-010**: System MUST support sending a new OTP code via a "Resend OTP" button, with a 60-second client-side cooldown timer to prevent spam.

### Key Entities

- **User Profile**: Represents the authenticated user.
  - **Attributes**: Unique Identifier, Full Name, Email Address, Registration Date, Verification Status.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Logged-in users can load and view the dashboard in under 2 seconds.
- **SC-002**: 100% of attempts by unauthenticated users to access restricted pages (dashboard/transactions) are redirected to the login page.
- **SC-003**: User registration, login, and verification forms validate input client-side instantly (under 100ms feedback).
- **SC-004**: System handles up to 5 consecutive login failures by displaying warning messages before showing lockout instructions.
- **SC-005**: OTP verification takes less than 500ms to process on successful token match.

## Assumptions

- Users have a modern web browser that supports secure cookies and localStorage/sessionStorage.
- Supabase is configured to send OTP verification codes to emails (Supabase default email template for signup contains a `{{ .Token }}` or code, which can be configured).
- No social logins (Google, Apple, etc.) are required in the initial release.
