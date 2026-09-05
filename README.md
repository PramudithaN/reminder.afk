# AFK Reminder

![Electron](https://img.shields.io/badge/Electron-191970?style=for-the-badge&logo=Electron&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Three.js](https://img.shields.io/badge/ThreeJs-black?style=for-the-badge&logo=three.js&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)

> A smart, visually engaging, and highly customizable desktop break reminder built with **Electron**, **React**, and **React Three Fiber**. 

This application is designed specifically for developers and power users to prevent optical fatigue (following the 20-20-20 rule) and combat the health risks associated with prolonged sitting. When a scheduled break is triggered, a fully animated 3D character renders directly over the active workspace utilizing a frameless, transparent window. The application enforces breaks through a combination of screen dimming and synthesized audio alerts to ensure focus is successfully interrupted.

---

## Key Features

* **3D Animated Characters**: Choose an active rendering entity (Robot, Spider-Man, or Venom). The models are fully interactive; click and drag anywhere on the screen to rotate and inspect them in 3D space.
* **Developer-Themed UI**: The break notifications are designed to mimic a dark-mode IDE or terminal environment (e.g., `Kernel Panic: Prolonged Sedentary State`), integrating seamlessly into a developer's workflow.
* **Smart Multi-Monitor Support**: For multi-display setups, the application dynamically detects the user's active cursor location and routes the break reminder directly to the active display immediately before triggering.
* **High-Contrast Alerts**: Utilizes a full-screen backdrop filter and custom Web Audio API synthesized alerts to capture user attention effectively.
* **Configuration Panel**: A Material Design settings modal allows users to configure specific intervals for both Optical Rest and Mobility Stretches, as well as hot-swap the active 3D model.

## Health Protocols

1. **Optical Rest (Eye Breaks)**: Defaults to 20 minutes. Adheres to the 20-20-20 rule: Every 20 minutes, shift focus to an object 20 feet away for 20 seconds.
2. **Mobility (Stretch Breaks)**: Defaults to 60 minutes. Recommends stepping away from the workstation to stretch and maintain proper vascular circulation.

## Getting Started

### Prerequisites
Ensure [Node.js](https://nodejs.org/) is installed on the host machine.

### Installation
Clone the repository and install the required dependencies:
```bash
git clone https://github.com/PramudithaN/reminder.afk.git
cd reminder.afk
npm install
```

### Running in Development
To run the application locally with hot-reloading enabled:
```bash
npm run dev
```

## Building for Production

The application can be packaged into standalone installers for **Windows (`.exe`)** and **macOS (`.dmg` / `.zip`)**, allowing it to run silently in the background on system startup without relying on a terminal instance.

### Local Build:
Execute the following command:
```bash
npm run build
```

Upon successful completion, the generated binaries will be located in the `release/` directory.

**Windows Build Requirements:**
The `electron-builder` package requires administrative privileges to create symbolic links during the packaging process on Windows. If the build fails with a `Cannot create symbolic link` error, perform one of the following:
1. **(Recommended)** Navigate to Windows Settings -> Privacy & security -> For developers, and enable **Developer Mode**.
2. **Alternative**: Launch your Terminal or IDE as an **Administrator** prior to running the build command.

### Automated Cloud Builds (GitHub Actions):
The repository includes a GitHub Actions workflow (`.github/workflows/build.yml`) that automatically builds both **macOS (`.dmg` / `.zip` for Apple Silicon & Intel)** and **Windows (`.exe`)** whenever code is pushed to the repository. The installers can be downloaded directly from the GitHub Actions **Artifacts** tab.

## Technology Stack

* [Electron](https://www.electronjs.org/) - Desktop application framework
* [React](https://reactjs.org/) & [Vite](https://vitejs.dev/) - Frontend UI and build tooling
* [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/getting-started/introduction) & [Drei](https://github.com/pmndrs/drei) - 3D rendering pipeline and interactions
* [Three.js](https://threejs.org/) - Core WebGL engine

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
*Maintain optimal health, stay hydrated, and resolve your Kernel Panics.*
