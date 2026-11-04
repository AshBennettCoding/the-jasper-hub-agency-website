# Production Deployment

This project is a React build served by Cloudflare Pages with a Pages Function for contact-form delivery through Resend.

## Cloudflare Pages build settings

Configure the Pages project with:

- **Root directory:** repository root
- **Build command:** `npm run build`
- **Build output directory:** `client/build`
- **Functions directory:** `functions/` at the repository root
- **Node.js version:** use the version configured by the Pages build image; Node 18+ is required by the test and build scripts

Do not use `client` as the Pages root directory. The root build script installs the client dependencies and produces the expected output directory.

## Production environment variables

Set these under **Cloudflare Pages > Settings > Environment variables > Production**. Use encrypted/secret values for `RESEND_API_KEY`.

| Variable | Required | Value |
| --- | --- | --- |
| `RESEND_API_KEY` | Yes | A new Resend API key created after revoking any key exposed in repository history |
| `SEND_EMAIL` | Yes | A sender address on a domain verified in Resend |
| `INFO_EMAIL` | Yes | Recipient for creator representation and talent/agency collaboration inquiries |
| `BUSINESS_EMAIL` | Yes | Recipient for the Contact Us brand/company form |

The function also accepts `RECEIVE_EMAIL` and the historical misspelling `RECIEVE_EMAIL` as a temporary fallback when a route-specific recipient is not configured. New production deployments should configure `INFO_EMAIL` and `BUSINESS_EMAIL` explicitly.

The frontend calls the same-origin `/api/contact` endpoint directly, so no frontend environment variable is required for the current build. Never put `RESEND_API_KEY` or recipient credentials in a `REACT_APP_*` variable.

## Resend setup

1. In Resend, verify the sending domain used by `SEND_EMAIL`.
2. Revoke the old API key that appeared in the repository history.
3. Create a replacement API key with only the permissions needed to send mail.
4. Add the replacement key to Cloudflare Pages Production as `RESEND_API_KEY`.
5. Confirm that `SEND_EMAIL` uses the verified domain. Resend may reject unverified sender addresses.

## Delivery behavior

- Creator representation and Talent / Agency Collaboration submissions are sent to `INFO_EMAIL`.
- Contact Us submissions are sent to `BUSINESS_EMAIL`.
- The submitter's validated email is sent as `reply_to`.
- The browser receives only a generic error when configuration or Resend delivery fails.
- No production API key is needed locally; automated tests mock the Resend request.

## Release checklist

1. Revoke and replace any key that has ever been committed.
2. Configure all four production variables in Cloudflare Pages.
3. Trigger a production deployment and inspect the Pages deployment log.
4. Submit one approved real test from the deployed site for the creator form and one for Contact Us.
5. Confirm receipt in the info and business inboxes, then reply to each message to verify `reply_to`.
6. Check Resend logs for accepted delivery and no sender-domain errors.
