# PWA Setup

This app is configured as a **Progressive Web App (PWA)** so users can install it on their home screen and use it like a native app.

## Features

- **Install to Home Screen** – Add to home screen on Android, iOS, and desktop
- **Standalone Display** – Runs in fullscreen without browser UI when installed
- **Offline Support** – Basic offline caching via service worker
- **App-like Experience** – Theme color, splash screen, and native feel

## How to Install

### Android / Chrome
1. Open the app in Chrome
2. Tap the install banner or menu → "Install app" / "Add to Home screen"

### iOS (Safari)
1. Open the app in Safari
2. Tap the Share button
3. Select "Add to Home Screen"

### Desktop (Chrome, Edge)
1. Open the app
2. Click the install icon in the address bar or use the install banner

## Regenerating Icons

To regenerate PWA icons (e.g., after changing branding):

```bash
npm run generate-pwa-icons
```

## Requirements

- **HTTPS** – PWAs require a secure context. Use HTTPS in production.
- **Local testing** – For local PWA testing, use `next dev --experimental-https` or deploy to a staging URL.
