# DuelingNexus - Custom Layout & Event Log

A Tampermonkey userscript for **DuelingNexus** that adjusts the duel layout and mirrors the event log in a fixed panel on the right side of the screen.

![Dueling Nexus duel with the custom layout and mirrored event log](./images/CustomLayoutAndEventLog.png)

---

## Features

* **Custom Duel Layout:** Repositions and resizes the game field and side panels to make better use of the available screen space.
* **Mirrored Event Log:** Displays the duel event log in a dedicated right-side panel when the card panel is visible.
* **Scroll-Aware Log:** Automatically follows new events while the log is at the bottom, and preserves your position when you scroll up to read earlier events.
* **Automatic Log Cleanup:** Removes standalone `undefined` entries from the event log.
* **Centered Duel Dialogs:** Keeps selection and other duel windows centered on the screen.
* **Responsive Updates:** Reapplies layout adjustments when the page changes or the browser window is resized.

---

## Installation

To use this userscript, install a browser extension that supports userscripts, such as **Tampermonkey**, **Violentmonkey**, or **Greasemonkey**.

1. Install a userscript manager, for example [Tampermonkey](https://www.tampermonkey.net/).
2. Install the script by opening the raw userscript link:
   * [Install script.user.js](https://raw.githubusercontent.com/LiatDrazil/DuelingNexus-Custom-Layout-and-Event-Log/main/script.user.js)
3. Confirm the installation in your userscript manager.

---

## Supported Pages

The script runs automatically on:

* `https://duelingnexus.com/duel/*`
* `https://duelingnexus.com/handtestmode*`

---

## Usage

After installation, open a supported DuelingNexus page. The layout changes are applied automatically; no in-game settings panel is required.

During a duel, the mirrored event log appears on the right when the card panel is visible. Scroll the log to review previous events; it resumes following new events when you return to the bottom.
