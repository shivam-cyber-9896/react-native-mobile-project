# 💰 FinTrack — React Native Smart Money Manager & PDF Expense Tracker

FinTrack is a full-featured, modern mobile finance management application built with **React Native (Android)**, **Firebase Authentication**, **Firebase Cloud Storage**, and **pdf-lib**. It allows users to track income and expenses, attach PDF receipts stored securely in the cloud, view financial analytics, generate custom PDF expense reports, and switch between Light and Dark themes.

---

## 🚀 Key Features

* **🔐 Authentication**: Google Sign-In & Firebase Auth integration.
* **💸 Transaction Management**: Add income and expense transactions with category selection, date formatting, and custom notes.
* **📊 Analytics Dashboard**: Monthly income/expense overview, balance summary, 7-day visual bar charts, and top spending category progress bars.
* **📜 History & Filtering**: Filter transactions by period (*All*, *Today*, *This Week*, *This Month*) with swipe/pull-to-refresh and long-press to delete.
* **📎 Cloud PDF Receipts**: Attach PDF receipts to transactions using document pickers, uploaded directly to Firebase Storage (`receipts/{userId}/`). Tap any transaction badge in history to download and view receipts locally.
* **📄 PDF Expense Reports**: Export branded monthly PDF expense reports generated dynamically via `pdf-lib`, automatically uploaded to Firebase Storage (`reports/{userId}/`), and previewed using native document viewers with local save capabilities.
* **🌗 Dynamic Theme System (Light & Dark Mode)**: 
  * Automatically matches device system appearance on initial launch (`useColorScheme`).
  * Manual override in **My Profile → Appearance**, persisted across app restarts via `AsyncStorage`.
  * Centralized theme tokens (`src/styles/theme.ts`) applied across all screens and bottom tab navigation.

---

## 🛠️ Tech Stack & Dependencies

| Category | Technology / Package |
|---|---|
| **Framework** | React Native `0.74.x`, TypeScript |
| **Authentication** | `@react-native-firebase/app`, `@react-native-firebase/auth`, `@react-native-google-signin/google-signin` |
| **Cloud Storage** | `@react-native-firebase/storage` (v25 Modular SDK) |
| **Document Pick & View** | `@react-native-documents/picker`, `@react-native-documents/viewer` |
| **File System** | `react-native-fs` |
| **PDF Generation** | `pdf-lib` |
| **State & Local Storage** | `@react-native-async-storage/async-storage` |
| **Navigation** | `@react-navigation/native`, `@react-navigation/bottom-tabs` |
| **Icons & UI** | `react-native-vector-icons` (Ionicons) |

---

## 📁 Project Structure

```
d:/react-native/project_apk/
├── index.js                     # App entry point
├── package.json                 # Project dependencies & scripts
├── android/                     # Native Android project configuration
│   ├── app/
│   │   ├── build.gradle
│   │   └── google-services.json # Firebase Android configuration
│   └── build.gradle
└── android/src/                 # Source code
    ├── features/
    │   ├── auth/
    │   │   └── screens/
    │   │       └── LoginScreen.tsx          # Google Sign-In screen
    │   └── transactions/
    │       └── screens/
    │           ├── DashboardScreen.tsx      # Monthly stats & weekly chart
    │           ├── AddTransactionScreen.tsx  # Add transaction & attach PDF
    │           ├── HistoryScreen.tsx         # Transaction list & export PDF
    │           └── ProfileScreen.tsx         # Profile info & Theme toggle
    ├── hooks/
    │   ├── useAuth.ts            # Firebase Auth state listener
    │   └── useTheme.tsx           # ThemeProvider & theme toggle hook
    ├── navigation/
    │   ├── RootNavigator.tsx      # Auth switch (Login vs MainTabs)
    │   └── MainTabNavigator.tsx   # Theme-aware bottom tab bar & headers
    ├── services/
    │   ├── authService.ts        # Google Sign-In helper methods
    │   ├── transactionService.ts # Local & Cloud storage persistence
    │   └── firebaseConfig.ts     # Firebase Modular Storage helper
    └── styles/
        ├── theme.ts               # Light & Dark color tokens
        ├── dashboardStyles.ts     # Styles for DashboardScreen
        ├── historyStyles.ts       # Styles for HistoryScreen
        ├── addTransactionStyles.ts # Styles for AddTransactionScreen
        └── profileStyles.ts       # Styles for ProfileScreen
```

---

## 🔧 Installation & Build Instructions

### Prerequisites
* **Node.js** (v18 or higher)
* **JDK 17** (configured at `C:\Program Files\Java\jdk-17`)
* **Android SDK & NDK** installed via Android Studio
* Connected Android device or Emulator

### 1. Clone & Install Dependencies
```bash
npm install
```

### 2. Configure Firebase
Ensure `google-services.json` is located in `android/app/google-services.json`.

**Firebase Storage Security Rules**:
Ensure your rules in [Firebase Console → Storage → Rules](https://console.firebase.google.com/) permit authenticated read/write access:
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 3. Run Development Server / Build APK
```bash
# Start Metro bundler with clean cache
npm run clean

# Run on physical connected device
npx react-native run-android --deviceId <YOUR_DEVICE_ID>

# Build Debug APK
npm run assemble
```

---

## 🌗 Theme Customization & Architecture

Themes are defined in [`src/styles/theme.ts`](file:///d:/react-native/project_apk/android/src/styles/theme.ts). 

* **`darkTheme`**: Deep navy background (`#0F172A`), card surfaces (`#1E293B`), blue accents (`#3B82F6`).
* **`lightTheme`**: Soft background (`#F1F5F9`), crisp white surfaces (`#FFFFFF`), primary blue (`#2563EB`).

### How to use `useTheme()` in components:
```tsx
import { useTheme } from '../hooks/useTheme';
import { makeMyStyles } from '../styles/myStyles';

export default function MyScreen() {
  const { theme, isDark, toggleTheme } = useTheme();
  const styles = useMemo(() => makeMyStyles(theme), [theme]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Current theme: {isDark ? 'Dark' : 'Light'}</Text>
    </View>
  );
}
```

---

## 🛠️ Common Troubleshooting

| Issue | Root Cause | Solution |
|---|---|---|
| `[storage/unknown] Permission Denial` | Android system picker returns `content://` URI which background threads cannot read directly. | Files are copied locally into `RNFS.CachesDirectoryPath` (`file://`) prior to uploading. |
| `TypeError: right operand of 'in' is not an object` | Passing string directly to `viewDocument()`. | Pass object `{ uri: 'file://...' }` to `viewDocument()`. |
| `WinAnsi cannot encode` in `pdf-lib` | Helvetica font in `pdf-lib` only supports ASCII characters. | Non-ASCII strings are sanitized using `cleanAscii()` helper before drawing text. |
| Metro Cache Warning (`Unable to deserialize cloned data`) | Stale bundler file map cache. | Run `npm run clean` to start Metro with `--reset-cache`. |

---

## 📄 License
This project is proprietary and built for personal/portfolio use.
