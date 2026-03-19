// ==UserScript==
// @name         Crop Watcher
// @namespace    http://tampermonkey.net/
// @version      2026-02-08
// @description  try to take over the world!
// @author       Cadis Etrama Di Raizel
// @match        https://farmrpg.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=farmrpg.com
// @grant        none
// ==/UserScript==
const CONFIG = {
  UPDATE_INTERVAL: 5000,
};

const state = {
  notified: false,
  cropWatcher: null,
  notfoundCount: 0,
  readyCount: 0,
  onWatcherStarted: null,
  onWatcherStopped: null,
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function findCropStatusContainer() {
  const container = document.querySelector("#farmstatus");
  if (!container) {
    console.error("[CropStatus] Container not found");
    return null;
  }
  return container;
}

/**
 * Request notification permission (Browser notifications fallback)
 */
async function requestNotificationPermission() {
  if (typeof GM_notification === "undefined") {
    // Fallback to browser notifications
    if (Notification.permission === "default") {
      await Notification.requestPermission();
    }
    return Notification.permission === "granted";
  }
  return true;
}

/**
 * Show notification
 */
function showNotification(title, message) {
  if (typeof GM_notification !== "undefined") {
    GM_notification({
      title: title,
      text: message,
      timeout: 5000,
    });
  } else if (Notification.permission === "granted") {
    new Notification(title, { body: message });
  }
}

// ============================================================================
// FEATURE CONTROLS
// ============================================================================

function startCropWatcher() {
  if (state.cropWatcher) return;

  console.log("[CropStatus] Starting crop watcher");
  state.cropWatcher = setInterval(() => {
    const container = findCropStatusContainer();
    if (!container) {
      state.notfoundCount++;
      if (state.notfoundCount > 5) {
        console.error(
          "[CropStatus] Container not found after multiple attempts, stopping watcher",
        );
        showNotification(
          "Crop Watcher Error",
          "Could not find crop status container. Stopping watcher. Please navigate to the farm page and start the watcher again.",
        );
        stopCropWatcher();
      }
      return;
    }

    const data = container.textContent;
    const firstCellProgress =
      data.length > 0 ? data.split(";")[0].split("-")[1].trim() : "0";

    if (firstCellProgress === "100") {
      state.readyCount += 1;
      if (state.readyCount >= 10) {
          console.error(
          "[CropStatus] You have been afk for so long, stopping watcher",
        );
        showNotification(
          "Crop Watcher",
          "[CropStatus] You have been afk for so long, stopping watcher",
        );
        stopCropWatcher();
      }
      if (state.notified) return;

      showNotification("Crop Ready!", "Your crop is ready to harvest!");
      state.notified = true;
    } else {
      state.notified = false;
      state.readyCount = 0;
    }
  }, CONFIG.UPDATE_INTERVAL);

  if (typeof state.onWatcherStarted === "function") {
    state.onWatcherStarted();
  }
}

function stopCropWatcher() {
  if (!state.cropWatcher) return;
  console.log("[CropStatus] Stopping crop watcher");
  clearInterval(state.cropWatcher);
  state.cropWatcher = null;
  state.notfoundCount = 0;
  state.readyCount = 0;

  if (typeof state.onWatcherStopped === "function") {
    state.onWatcherStopped();
  }
}

// ============================================================================
// UI CONTROLS
// ============================================================================

function createControlButton(text, onClick, inactiveColor = "#8e8e93") {
  const button = document.createElement("button");
  button.textContent = text;
  button.style.cssText = `
    padding: 8px 12px;
    margin: 4px 0;
    width: 100%;
    font-size: 13px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    color: white;
    background-color: ${inactiveColor};
    transition: background-color 0.2s;
  `;

  button.addEventListener("click", onClick);

  return button;
}

function updateButtonState(button, active, activeText, inactiveText) {
  button.textContent = active ? activeText : inactiveText;
  button.style.backgroundColor = active ? "#dc2626" : "#007aff";
}

function initializeUI() {
  // Find the sidebar list
  const sidebar = document.querySelector(".page-content > div > ul");
  if (!sidebar) {
    console.log("[Crops] Sidebar not found, retrying...");
    setTimeout(initializeUI, 500);
    return;
  }

  console.log("[Crops] Initializing UI controls");

  // Create Crop Watcher button
  const cropWatcherButton = createControlButton("Start Crop Watcher", () => {
    state.cropWatcher ? stopCropWatcher() : startCropWatcher();
  });

  state.onWatcherStarted = () => {
    updateButtonState(
      cropWatcherButton,
      true,
      "Stop Crop Watcher",
      "Start Crop Watcher",
    );
  };

  state.onWatcherStopped = () => {
    updateButtonState(
      cropWatcherButton,
      false,
      "Stop Crop Watcher",
      "Start Crop Watcher",
    );
  };

  // Add buttons to sidebar
  const listItem = document.createElement("li");
  listItem.appendChild(cropWatcherButton);
  sidebar.appendChild(listItem);
}

// ============================================================================
// INITIALIZATION
// ============================================================================

(function init() {
  // Wait for DOM
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeUI);
  } else {
    initializeUI();
  }

  console.log("[Crops] FarmRPG Crop Watcher v1.1.0 loaded");
})();

