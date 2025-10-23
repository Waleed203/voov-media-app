Perfect — this is a **Markdown formatting issue**, not your content.
GitHub **renders `.md` (Markdown)** files, which rely on `#`, `##`, backticks (```) and blank lines for proper structure.
Right now, your file is plain text — GitHub shows it as one big blob.

Let’s fix that cleanly. 👇
Below is your exact documentation rewritten **in proper GitHub-compatible Markdown**, preserving your emojis, spacing, and code formatting.
Just copy-paste this into your `README.md` file and commit again — GitHub will render it beautifully.

---

```md
# 📱 Voov Media Mobile App — Handover Documentation

---

## 1. Overview
**Voov Media** is a short-form video sharing app inspired by TikTok.  
Users can scroll through videos, upload their own content, edit or delete uploads, add videos to their watchlist, and manage their profile — all within one seamless experience.

The app is built with **React Native Bare v0.78.1**, optimized for **Android** and **iOS**, and connected to a live backend API for all real-time functionality.

---

## 2. Key Features

### 🏠 Home Feed  
Vertical, swipe-based video feed powered by **FlashList**.  
Smooth playback, auto-pause when off-screen, and integrated **Google Ads** after each video.

### 📤 Creator Uploads  
Upload videos directly from the camera or gallery with auto-generated thumbnails.

### 🧾 Watchlist  
Save videos to a personal watchlist synced with backend APIs.

### 👤 Profile  
Edit name, bio, and profile image, view uploaded videos, and manage your content.

### 🔐 Authentication  
**Google** and **Apple Sign-In** with secure token storage using **AsyncStorage**.

### 📢 Google Ads Integration  
AdMob **Interstitial Ads** appear after every video for monetization.

---

## 3. Technical Stack

- **Framework:** React Native Bare (v0.78.1)  
- **Language:** JavaScript  
- **Backend API:** REST (via Axios)  
- **Video Feed:** FlashList + react-native-video  
- **Authentication:** Google Sign-In, Apple Sign-In  
- **Ads:** Google Mobile Ads (AdMob)  
- **File Handling:** FastImage, Vision Camera, Image Picker  
- **Styling:** React Native StyleSheet  
- **Notifications:** Firebase Messaging (ready)

---

## 4. Folder Structure

The project follows a modular and maintainable architecture:

```

src/
├── assets/              # App images, icons, logos, etc.
├── components/          # Reusable UI components
├── config/              # Configuration files (API URLs, Ads, Env)
├── context/             # Context providers
├── navigation/          # Stack and tab navigation setup
├── screens/             # App screens organized by feature
├── services/            # All API integrations
├── theme/               # Colors, fonts, and global styles
└── utils/               # Helper utilities

````

---

## 5. Backend Integration
All APIs for authentication, video management, watchlist, and profiles are implemented.  
Base URLs and endpoints are configured inside `src/config/config.js`.  
Any domain or upload path change can be managed from that single file.

---

## 6. Build & Run Instructions

### 🧱 Development Setup

#### Clone the repository
```bash
git clone <repository-url>
````

#### Install dependencies

```bash
npm install
```

#### Run Metro bundler

```bash
npx react-native start
# or
npm start
```

#### Run the app

**Android:**

```bash
npx react-native run-android
# or
npm run android
```

**iOS:**

```bash
npx react-native run-ios
# or
npm run ios
```

---

### 📦 Production Build

**Android (APK):**

```bash
cd android && ./gradlew assembleRelease
# or
npm run release
```

Output file:
`android/app/build/outputs/apk/release/app-release.apk`

**Android (AAB):**

```bash
cd android && ./gradlew bundleRelease
# or
npm run bundle
```

**iOS:**

1. Open `ios/VoovMedia.xcworkspace` in **Xcode**.
2. Select **Product → Archive**.
3. Distribute through **TestFlight** or the **App Store**.

---

## 7. Developer Setup Guide

* All environment configurations (API URLs, upload URLs, etc.) are managed in `src/config/config.js`.
* **React Native Version:** 0.78.1
* **Node.js Version:** 18+
* **npm Version:** 9+
* **Java JDK:** 17+
* **Android Studio:** SDK 35+
* **Xcode:** 15+ (for iOS)
* **AdMob configuration:** `src/components/GoogleAds.jsx`
* **Firebase config files:** `google-services.json`, `GoogleService-Info.plist`
* **Deep links** are implemented.

---

### ⚙️ Common Developer Commands

| Task                 | Command                                                        |
| -------------------- | -------------------------------------------------------------- |
| Run app (Android)    | `npx react-native run-android` or `npm run android`            |
| Run app (iOS)        | `npx react-native run-ios` or `npm run ios`                    |
| Start Metro bundler  | `npx react-native start` or `npm start`                        |
| Build production APK | `cd android && ./gradlew assembleRelease` or `npm run release` |
| Build AAB bundle     | `cd android && ./gradlew bundleRelease` or `npm run bundle`    |
| Clean Android build  | `cd android && ./gradlew clean`                                |
| Run Linter           | `npm run lint`                                                 |

---

## 8. Performance Notes

* FlashList ensures lag-free video feed even with large datasets.
* Images cached using FastImage.
* Axios requests optimized with a 10-second timeout.
* Smooth scrolling verified on Pixel 6 Pro and iPhone 14 Pro.

---

## 9. Deployment Checklist

✅ API base URL confirmed in `config.js`
✅ AdMob IDs replaced with production keys
✅ Firebase configured
✅ Tested on real Android and iOS devices

---

## 10. Final Summary

**Project Name:** Voov Media
**Purpose:** Short-form video platform
**Tech Stack:** React Native Bare v0.78.1 | Firebase | AdMob | REST APIs
**Platforms:** Android & iOS
**Developer:** Waleed
**Delivery Date:** 23rd October 2025

---

## 11. Conclusion

All features are implemented, tested, and working live.
This document provides full details for project understanding, build setup, and developer onboarding.
Everything is ready for future maintenance, updates, or scaling.