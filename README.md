# LanceBox

LanceBox is a mobile invoicing app built with Expo Router. It walks a user through account creation and profile setup, then lets them create, preview, save, and export invoices as PDF — all stored locally on-device.

## Tech stack

- [Expo](https://expo.dev) SDK 57, React 19, React Native 0.86 (new architecture)
- [Expo Router](https://docs.expo.dev/router/introduction/) for file-based navigation, with typed routes
- [Zustand](https://github.com/pmndrs/zustand) + `persist` (backed by `@react-native-async-storage/async-storage`) for local state
- [Formik](https://formik.org) + [Yup](https://github.com/jquense/yup) for form validation
- [expo-print](https://docs.expo.dev/versions/latest/sdk/print/) + [expo-sharing](https://docs.expo.dev/versions/latest/sdk/sharing/) for PDF generation and export
- TypeScript throughout

## Features

- **Onboarding** — sign-up with validated email/password, profile setup (logo upload, business/individual role), with an animated logo transition between screens
- **Invoice creation flow** — invoice details → bank details → preview → send, all validated inline and autosaved as a draft as you go
- **PDF export** — download or share a generated invoice as a real PDF from the preview screen, the send screen, or any previously saved invoice on the home screen
- **Local persistence** — session, profile, in-progress invoice draft, and saved invoices all survive an app restart (no backend; everything lives in `AsyncStorage`)
- **Error handling** — a root-level Expo Router error boundary with a recoverable fallback screen, a global JS error handler, and a custom `+not-found` screen for unmatched routes

## Getting started

This project uses [Bun](https://bun.sh) (`bun.lock` is checked in).

```bash
bun install
bunx expo start
```

Scan the QR code with [Expo Go](https://expo.dev/go), or press `i` / `a` in the terminal to open an iOS Simulator / Android emulator.

## Project structure

```
src/
  app/            Expo Router routes (screens + layouts)
    (auth)/        sign-up, profile setup
    (app)/         home, invoice creation flow
  components/     Shared UI components
  store/          Zustand stores (auth, profile, invoice draft, saved invoices)
  lib/            Validation schemas, PDF generation, formatting helpers, error reporting
```

## Commands

```bash
bunx expo start              # start the dev server
bunx expo lint                # lint
npx tsc --noEmit              # typecheck
bunx expo-doctor              # diagnose dependency/config issues
bunx expo install --fix       # fix incompatible package versions
```

There is no test suite configured in this repo currently.
