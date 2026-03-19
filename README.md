# FarmRPG Crop Watcher

A lightweight Tampermonkey userscript for FarmRPG that watches your farm status and notifies you when crops are ready to harvest.

## Features

- Monitors your crop status automatically
- Sends a browser notification when a crop reaches 100%
- Includes an in-game sidebar button to start and stop the watcher
- Stops itself after repeated failures to find the farm status container
- Includes an AFK safeguard so it does not notify forever when you are away

## Installation

1. Install the [Tampermonkey browser extension](https://www.tampermonkey.net/)
2. Click the [install link](https://raw.githubusercontent.com/AverageGamerDev/farmrpg-crop-watcher/main/farmrpg-crop-watcher.user.js)
3. Click "Install" when Tampermonkey prompts you
4. Visit FarmRPG and look for the control buttons in the left sidebar
5. Go to FarmRPG and open **your farm page**.

## Usage

1. Visit **your farm page** in FarmRPG.
2. Click **Start Crop Watcher** in the sidebar.
3. Leave the page open while the script checks crop progress every few seconds.
4. When a crop reaches 100%, you will get a notification.
5. Click the button again to stop the watcher.

## How it works

The script checks the farm status container on the page and reads the crop progress value. When the first crop cell reaches 100%, it triggers a notification. It also includes a small safeguard to stop after repeated checks if the page is left idle for too long.

## Notifications

The script uses Tampermonkey notifications when available.  
If Tampermonkey notifications are not available, it falls back to standard browser notifications.

## Notes

- This script is intended for the FarmRPG farm page.
- It will not work correctly if you are not on the farm screen.

## Privacy

This script runs entirely in your browser. No data is sent to external servers. Your username and keywords are stored locally using browser localStorage.

## Compatibility

Tested on:
- Chrome/Edge with Tampermonkey
- Firefox with Tampermonkey
- Safari with Userscripts

Works on both desktop and mobile layouts of FarmRPG.

## Contributing

Bug reports and feature suggestions are welcome. Open an issue or submit a pull request.

## License

MIT License - do whatever you want with it.

## Disclaimer

This is a third-party tool not affiliated with or endorsed by FarmRPG. Use at your own discretion. If this violates any game rules or terms of service, please let me know and I'll remove it immediately.

## Author

Cadis Etrama Di Raizel
