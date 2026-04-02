

# Finishing InvestFlow -- 3-Prompt Plan

After a full audit of every page, component, context, database table, and RLS policy, here are the three highest-impact prompts to take this project from "working prototype" to "deployment-ready."

---

## Prompt 1 -- Security, Data Integrity, and Auth Hardening

This prompt addresses critical gaps that would cause real problems in production.

**What gets built:**

1. **Forgot Password flow** -- The login page has a "Forgot password?" button that does nothing. Wire it to a password-reset page that calls `supabase.auth.resetPasswordForEmail` and a `/reset-password` route that handles the token callback.

2. **Email verification guard** -- After signup, redirect to a "Check your email" page instead of silently landing. Block unverified users from accessing the dashboard.

3. **Transaction PIN validation** -- The signup form collects a 4-digit Transaction PIN but it is never stored or used. Add a `transaction_pin` column (hashed) to `profiles`, save it on signup, and require it before confirming withdrawals.

4. **Withdrawal balance deduction on submit** -- Currently the WithdrawPage creates a pending transaction but does NOT deduct or hold the balance, so a user can submit multiple withdrawals exceeding their balance. Hold the amount on submission (deduct from balance immediately, refund on rejection).

5. **PlansPage vs InvestmentPage plan mismatch** -- PlansPage shows different min/max values than InvestmentPage. Fetch plans from the `investment_plans` database table on both pages so they stay in sync and admin edits take effect.

6. **Admin RLS for user_investments** -- Admins cannot currently view or manage user investments (no admin SELECT policy). Add an admin SELECT policy on `user_investments`.

---

## Prompt 2 -- UX Polish and Missing Features

This prompt fills functional holes and improves the user experience.

**What gets built:**

1. **Landing page enhancement** -- Add a "How it Works" section (3 steps: Sign Up, Deposit, Earn), a live plan preview section pulling from the database, social proof / testimonials, and a proper FAQ accordion.

2. **Dashboard improvements** -- Replace the hardcoded "Add Account" alert with a conditional alert (show only if no deposits yet). Make the "This Month" stats actually calculate from current-month transactions. Add a recent transactions widget (last 5) with a "View All" link.

3. **Notifications system** -- Wire the bell icon in the header. Create a `notifications` table (user_id, title, message, read, created_at). Auto-create notifications on deposit/withdrawal approval/rejection. Show unread count badge and a dropdown panel.

4. **Investment maturity handling** -- Add logic to check if an active investment's duration has elapsed. When matured, mark it as `completed`, credit the user's balance with principal + ROI, and create a transaction record. This can be an edge function on a cron schedule.

5. **Responsive and mobile QA fixes** -- Ensure the admin panel tabs scroll horizontally on small screens. Fix sidebar overlay behavior on mobile. Add proper loading skeletons instead of plain "Loading..." text.

---

## Prompt 3 -- Production Readiness and Deployment

This prompt handles everything needed to go live.

**What gets built:**

1. **Error boundaries and 404 polish** -- Wrap the app in a React error boundary with a user-friendly fallback. Improve the NotFound page with navigation back to home/dashboard.

2. **SEO and meta tags** -- Add proper `<title>`, `<meta description>`, and Open Graph tags to `index.html`. Add a favicon and apple-touch-icon.

3. **Terms of Service and Privacy Policy pages** -- Create `/terms` and `/privacy` routes with placeholder legal content. Wire all footer and signup links to them.

4. **Rate limiting and abuse prevention** -- Add a deposit/withdrawal cooldown (e.g., max 5 pending requests). Disable the submit button with feedback if limit is reached.

5. **Final admin tooling** -- Add an admin action to manually credit/debit a user (already partially built). Add a "ban user" toggle. Show admin a count of pending items in the sidebar badge.

6. **PWA basics** -- Add a `manifest.json` with app name, theme color, and icons so the app can be added to home screens.

7. **Publish** -- Deploy the app and verify all flows end-to-end.

---

## Priority Summary

| Prompt | Focus | Key Outcome |
|--------|-------|-------------|
| 1 | Security and data integrity | No exploitable gaps, real auth flows |
| 2 | UX and missing features | Complete user journey, notifications, maturity |
| 3 | Production readiness | SEO, legal pages, error handling, deploy |

