# Roadside Estimator Widget

This is a drop-in estimate tool for towing and roadside assistance pricing.

The visual styling is matched to the Rapid Roadside Runner site: royal blue service bands, uppercase headings, squared form controls, and thin bordered sections.

## Current Pricing

- Jump start: `$110`
- Fuel delivery: `$110 + fuel cost`
- Lockout: `$145`
- Tire change: `$145`
- Tire change for SUV/truck: `$175`
- Towing: `$225` for the first `5` tow miles, plus `$7` for each additional mile
- Winching: `$280/hour`
- After-hours fee: `$75` for towing and winching after `8 PM`
- Towing is selected by default.
- Tow miles use whole-number increments and typed decimals are rounded up before pricing.
- The after-8 PM option is labeled as an after-hours fee.
- The form includes a `CALL NOW` button linked to `206-289-0379`.
- Towing includes a `Name Your Own Price` slider capped at 30% below the quoted price.
- Offers within 10% of the quote show good odds, offers over 25% below quote show poor odds, and the middle range shows low odds.
- The custom price slider shows playful coaching comments at every 2% discount step.
- Pickup and drop-off fields show address suggestions while typing to reduce mistyped addresses.
- Non-towing and non-winching services show a standard service-area disclaimer.

## Files

- `index.html`: demo page and form markup
- `roadside-estimator.css`: widget styling
- `roadside-estimator.js`: pricing, show/hide logic, GPS pickup button, and submit placeholder

## Website Install

Copy the form markup from `index.html` into the page where the estimator should appear, then include:

```html
<link rel="stylesheet" href="/path-to/roadside-estimator.css" />
<script src="/path-to/roadside-estimator.js" defer></script>
```

The GPS button uses the browser's Geolocation API. It works on HTTPS websites and on localhost during testing.

## Important Note About Towing Distance

The current version calculates towing miles automatically after the pickup and drop-off locations are entered. It uses Google Maps address autocomplete and Google driving distance, rounds the result up to the next mile, and updates the towing estimate.

To enable Google Maps, replace `YOUR_GOOGLE_MAPS_API_KEY` in `index.html` with your Google Maps API key. In Google Cloud, enable:

- Maps JavaScript API
- Places API
- Distance Matrix API

Restrict the key to your website domain before publishing.

## Form Submission

The submit handler currently logs the request in the browser console and shows a confirmation message. Connect `handleSubmit` in `roadside-estimator.js` to your booking system, email service, SMS service, CRM, or website backend.
