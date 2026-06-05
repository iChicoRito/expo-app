# Objective

## App Optimization and Size Reduction for Android Build (Expo Go Testing)

---

## Description

This objective focuses on scanning the existing codebase to identify and resolve performance bottlenecks, inefficiencies, and unnecessary bloat that negatively impact the app's runtime performance and final build size. All functionalities, screens, and transitions must be reviewed and optimized. The app is being tested via Expo Go during development, so optimizations must ensure the app runs efficiently within the Expo Go environment without high memory or storage consumption. The final production build target is Android only, and all size reduction strategies must be scoped accordingly.

---

## Objectives Breakdown

### 1. Primary Objective

Scan the entire codebase, identify all optimization opportunities, and apply performance and size reduction improvements — ensuring the app runs efficiently in Expo Go during testing and produces a lean final Android build.

---

### 2. Secondary Objectives

- Optimize all screens and transitions for smoother runtime performance within Expo Go.
- Reduce app storage footprint during Expo Go testing and in the final Android build.
- Ensure no heavy dependencies or assets unnecessarily inflate the app size during development or production.

---

### 3. Supporting Tasks

#### 3.1 Codebase Scanning

- Scan all screens, components, and logic files for performance issues and inefficiencies.
- Identify unused imports, dependencies, packages, and dead code.
- Identify redundant re-renders, unoptimized state management, and unnecessary computations.
- Identify unoptimized assets (images, icons, fonts) contributing to bundle and storage size.

#### 3.2 Expo Go Compatibility and Performance

- Ensure all packages and dependencies used are compatible with Expo Go.
- Avoid or replace any packages that require native modules not supported by Expo Go.
- Minimize the JavaScript bundle size to reduce load time and memory usage within Expo Go.
- Avoid large or heavy third-party libraries where lighter alternatives exist and are Expo Go compatible.

#### 3.3 Functionality Optimization

- Optimize all existing functionalities for efficient execution and minimal resource usage.
- Review and optimize localStorage read/write operations.
- Review and optimize the Groq API integration call flow for efficiency.
- Optimize the AI rate limiting logic to avoid unnecessary processing overhead.

#### 3.4 Screen and Transition Optimization

- Review and optimize all screen rendering and navigation transitions.
- Remove or replace heavy animations or transitions that impact performance on Expo Go.
- Ensure all Drawer/Sheet and Modal/Dialog components render efficiently and without unnecessary overhead.

#### 3.5 Android Build Size Reduction

- Enable and configure ProGuard or R8 minification and shrinking for the Android build.
- Enable resource shrinking to strip unused resources from the final APK.
- Review and remove unused dependencies and packages from the project.
- Optimize image and asset files (compression, format conversion where applicable).
- Configure the Android build to exclude debug symbols and unnecessary build artifacts from the release build.

---

### 4. Detailed Breakdown

#### 4.1 Codebase Scan Scope

The scan must cover all layers of the codebase: UI components, screen files, navigation logic, API integration layer, state management, utility functions, and asset files. Both runtime performance issues and build-time bloat must be identified and documented before fixes are applied.

#### 4.2 Expo Go Testing Constraints

Since the app is actively tested through Expo Go, all dependencies and packages must remain within Expo Go's supported ecosystem. Any package requiring a custom native build or bare workflow will not be loadable in Expo Go and must be avoided or replaced. The JavaScript bundle delivered to Expo Go must be kept as lean as possible to prevent slow load times and excessive storage usage on the test device.

#### 4.3 Functionality and Logic Optimization

All existing features — Deck Creation, Question Management, Manual Input, AI Generation via Groq, rate limiting, and localStorage persistence — must be reviewed for inefficient logic, unnecessary re-execution, or redundant operations. Fixes must not alter any existing behavior or functionality.

#### 4.4 Screen and Transition Optimization

Every screen transition and animated component (Drawer/Sheet, Modal/Dialog, navigation transitions) must be evaluated for performance cost. Heavy or blocking animations must be replaced or tuned without removing the visual behavior established in the Figma design references. Optimizations must be validated to perform well within the Expo Go runtime environment.

#### 4.5 Android-Specific Build Configuration

All size reduction measures are scoped to the Android build only. This includes enabling R8/ProGuard for code shrinking and obfuscation, enabling resource shrinking in the Gradle build configuration, configuring split APKs or ABI splits if applicable, and ensuring the release build variant is fully configured to exclude unnecessary debug artifacts.

#### 4.6 Asset Optimization

All image and icon assets must be reviewed for format and compression efficiency. Oversized assets must be compressed or converted to more efficient formats such as WebP where applicable. Unused assets must be identified and removed from the project entirely. Asset sizes must be kept minimal to reduce both the Expo Go bundle footprint and the final Android APK size.
