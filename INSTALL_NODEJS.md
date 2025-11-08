# How to Install Node.js and npm

## Problem
You're getting the error: `npm : The term 'npm' is not recognized`

This means Node.js (which includes npm) is not installed on your system.

## Solution: Install Node.js

### Option 1: Download from Official Website (Recommended)

1. **Go to the Node.js website:**
   - Visit: https://nodejs.org/
   - Or directly: https://nodejs.org/en/download/

2. **Download the LTS (Long Term Support) version:**
   - Click the green "LTS" button (recommended for most users)
   - This will download the Windows Installer (.msi file)

3. **Run the installer:**
   - Double-click the downloaded `.msi` file
   - Follow the installation wizard
   - **Important:** Make sure to check "Add to PATH" during installation (it's usually checked by default)
   - Click "Next" through all steps
   - Click "Install" and wait for it to complete

4. **Restart your terminal/PowerShell:**
   - Close your current PowerShell window
   - Open a new PowerShell window
   - This is important so it picks up the new PATH

5. **Verify installation:**
   ```powershell
   node --version
   npm --version
   ```
   - You should see version numbers (e.g., `v20.10.0` and `10.2.3`)

### Option 2: Using Chocolatey (If you have it)

If you have Chocolatey package manager installed:

```powershell
choco install nodejs
```

### Option 3: Using Winget (Windows 10/11)

```powershell
winget install OpenJS.NodeJS.LTS
```

---

## After Installation

Once Node.js is installed:

1. **Close and reopen your PowerShell terminal** (important!)

2. **Navigate to the frontend directory:**
   ```powershell
   cd C:\Users\Narendran\OneDrive\Desktop\brea2\frontend
   ```

3. **Install dependencies:**
   ```powershell
   npm install
   ```

4. **Start the development server:**
   ```powershell
   npm run dev
   ```

---

## Troubleshooting

### If npm still not recognized after installation:

1. **Check if Node.js is installed:**
   - Open a NEW PowerShell window
   - Run: `node --version`
   - If it works, npm should work too

2. **Restart your computer** (sometimes needed for PATH changes)

3. **Check PATH manually:**
   - Search for "Environment Variables" in Windows
   - Check if `C:\Program Files\nodejs\` is in your PATH
   - If not, add it manually

### Alternative: Use nvm-windows (Node Version Manager)

If you want to manage multiple Node.js versions:

1. Download from: https://github.com/coreybutler/nvm-windows/releases
2. Install nvm-windows
3. Then install Node.js: `nvm install lts`
4. Use it: `nvm use lts`

---

## Quick Check

After installation, run these commands in a NEW PowerShell window:

```powershell
node --version
npm --version
```

Both should return version numbers. If they do, you're ready to go!

