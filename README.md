# Tetris Game 🎮

A fully functional **Tetris game** built with **Expo + React Native**. Play offline on iOS and Android devices and share with friends!

## Features

✅ **Complete Tetris gameplay** — All 7 tetromino shapes (I, O, T, S, Z, J, L)  
✅ **Line clearing & scoring** — Complete rows to earn points  
✅ **Touch controls** — Buttons for move left/right, rotate, drop  
✅ **Pause/Resume** — Take a break anytime  
✅ **Game Over detection** — Restart anytime  
✅ **Offline-first** — Works without internet  
✅ **Cross-platform** — Runs on iOS, Android, and web  

## Quick Start

### Prerequisites
- **Node.js** 18+ and npm
- **Expo CLI**: `npm install -g expo-cli`
- **Device or Emulator**: iOS Simulator, Android Emulator, or physical device with Expo Go app

### Installation & Run

```bash
cd tetris-game
npm install
npm start
```

Then:
- **iOS**: Press `i` in terminal or scan QR code with Expo Go
- **Android**: Press `a` in terminal or scan QR code with Expo Go
- **Web**: Press `w` in terminal

## How to Play

- **← LEFT / RIGHT →** — Move piece left/right
- **ROTATE** — Rotate tetromino
- **↓ DROP** — Move piece down faster
- **PAUSE** — Pause/resume game
- Complete rows to clear them and earn points

## Build & Share

### Share as Live Link (Easiest)
```bash
npm start
# Scan QR code or share link with friends
```

### Build for App Store

**iOS:**
```bash
npm run build-ios
# Upload .ipa to TestFlight or App Store
```

**Android:**
```bash
npm run build-android
# Upload .apk to Google Play Store or share directly
```

## Project Files

- `App.jsx` — Entry point
- `TetrisGame.jsx` — Game logic & UI (all 300+ lines)
- `app.json` — Expo configuration
- `package.json` — Dependencies

## Customize

Edit `TetrisGame.jsx` to:
- Change colors, board size, or cell styling
- Adjust game speed (modify `setInterval`)
- Add sound effects
- Add difficulty levels
- Save high scores to device storage

## License

MIT — Feel free to share, modify, and distribute!

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
