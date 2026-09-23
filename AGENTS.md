# Homify

Next.js App Router demo for customer, provider, and admin home services.

## Development

```bash
pnpm dev
```

`pnpm dev` starts Next.js. `pnpm build` creates the production build, and `pnpm start` serves it.

## Routes

- `/` splash, then `/login`, `/otp`, `/signup`
- `/home`, `/location`, `/rewards`
- `/services/[category]` and `/services/[category]/[service]`
- `/booking`, `/booking/payment`, `/booking/confirmed`
- `/bookings`, `/bookings/rate`, `/profile` and profile sections
- `/provider`, `/provider/requests`, `/provider/active`, `/provider/earnings`, `/provider/kyc`
- `/admin`, `/admin/providers`, `/admin/services`, `/admin/bookings`, `/admin/commission`

Shared demo state lives in `src/state/DemoState.tsx` and is kept for the browser session. The phone frame and role switcher are in `src/components/AppFrame.tsx`.

## Styling

Tailwind CSS v4 is loaded from `app/globals.css` through `@tailwindcss/postcss`. Use Tailwind utilities in JSX. Shared screen styles stay in `app/globals.css`.

## Code quality

- Use double quotes for strings containing apostrophes (`"We're here to help"`), or escape them in single-quoted strings.
- Ensure JSX tags are closed and braces are balanced.
- Export route screens from `src/features` and mount them from `app`.
