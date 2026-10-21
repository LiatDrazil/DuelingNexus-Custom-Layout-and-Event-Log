// ==UserScript==
// @name         Dueling Nexus - Custom Layout & Event Log
// @namespace    https://github.com/LiatDrazil
// @version      3.22
// @description  Right-side Event Log panel and stable table reordering.
// @author       LiatDrazil
// @match        https://duelingnexus.com/duel/*
// @match        https://duelingnexus.com/handtestmode*
// @downloadURL  https://raw.githubusercontent.com/LiatDrazil/DuelingNexus-Custom-Layout-and-Event-Log/main/script.user.js
// @updateURL    https://raw.githubusercontent.com/LiatDrazil/DuelingNexus-Custom-Layout-and-Event-Log/main/script.user.js
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    // Inject core CSS styles for layout alignment, event log styling, and selection window centering.
    const css = `
        #game-container, #game-field {
            margin-left: 0 !important;
            left: 0 !important;
            float: left !important;
        }

        #game-field {
            min-width: 0 !important;
            max-width: none !important;
            width: var(--custom-game-field-width, 1047px) !important;
            height: max(748px, 83vh) !important;
            margin: 0 0 0 15px !important;
            box-sizing: border-box !important;
        }

        #game-field .game-field-zone,
        #game-field .empty-game-field-zone {
            width: 115.7px !important;
            height: 115.7px !important;
        }

        #game-field .empty-game-field-zone-full {
            width: 115.7px !important;
        }

        #game-field .empty-game-field-zone-full > table {
            width: 100% !important;
            min-width: 115.7px !important;
        }

        #game-field #game-field-middle,
        #game-field #game-field-middle-container {
            width: 580px !important;
            min-width: 580px !important;
        }

        #card-column {
            position: relative !important;
            width: var(--custom-side-panel-width, 25vw) !important;
            max-width: var(--custom-side-panel-width, 25vw) !important;
            box-sizing: border-box !important;
        }

        #card-column-header-content .game-card-tab {
            display: flex !important;
        }

        #card-column-header-content .game-card-tab-button {
            flex: 1 1 0 !important;
            float: none !important;
            width: auto !important;
        }

        #game-column {
            display: flex !important;
            justify-content: flex-start !important;
            width: max(0px, calc(100vw - 2 * var(--custom-side-panel-width, 25vw))) !important;
            min-width: calc(var(--custom-game-field-width, 1047px) + 15px) !important;
            padding-left: 0 !important;
            box-sizing: border-box !important;
        }

        #custom-right-panel {
            position: fixed !important;
            top: 0 !important;
            left: auto !important;
            right: 0 !important;
            bottom: 0 !important;
            width: var(--custom-right-panel-width, var(--custom-side-panel-width, 25vw)) !important;
            z-index: 150 !important;
            box-sizing: border-box !important;
            display: flex !important;
            flex-direction: column !important;
            overflow: hidden !important;
            background-image: linear-gradient(rgba(18, 23, 36, 0.7) 0%, rgba(1, 1, 17, 0.7) 100%) !important;
            border-left: 1px solid #777 !important;
        }

        #custom-right-panel[hidden] {
            display: none !important;
        }

        #custom-right-panel-body {
            flex: 1 1 auto !important;
            min-height: 0 !important;
            overflow: hidden !important;
        }

        #custom-right-panel #game-event-log-content::-webkit-scrollbar {
            width: auto !important;
            height: auto !important;
        }

        #custom-right-panel #game-event-log-content::-webkit-scrollbar-track {
            background: rgba(51, 51, 51, 0) !important;
        }

        #custom-right-panel #game-event-log-content::-webkit-scrollbar-thumb {
            background: rgb(109, 28, 180) !important;
            border-radius: 999px !important;
        }

        #custom-right-panel #game-event-log {
            position: relative !important;
            display: flex !important;
            flex: 1 1 auto !important;
            min-height: 0 !important;
            width: 100% !important;
            height: 100% !important;
            box-sizing: border-box !important;
            visibility: visible !important;
            opacity: 1 !important;
        }

        #custom-right-panel #game-event-log-content {
            box-sizing: border-box !important;
            width: 100% !important;
            height: 100% !important;
            margin: 0 !important;
            padding: 7px !important;
            background-color: transparent !important;
            border: 1px solid #777 !important;
            overflow-y: auto !important;
            scrollbar-width: auto !important;
            scrollbar-color: rgb(109, 28, 180) rgba(51, 51, 51, 0) !important;
        }

        #game-field > tbody > tr > .empty-game-field-zone-full > table {
            height: 50% !important;
            box-sizing: border-box !important;
        }

        #game-field .empty-game-field-zone-full .game-avatar-area {
            float: none !important;
            width: 90px !important;
            margin-left: auto !important;
            margin-right: auto !important;
            text-align: center !important;
        }

        #game-field .empty-game-field-zone-full .game-avatar-area.game-avatar-left {
            transform: translateY(var(--custom-player-status-offset, 0px)) !important;
        }

        #game-field .empty-game-field-zone-full .game-life-bar {
            margin-left: auto !important;
            margin-right: auto !important;
        }

        #game-field .empty-game-field-zone-full #game-life-bar-player,
        #game-field .empty-game-field-zone-full #game-life-bar-opponent {
            display: flex !important;
            justify-content: flex-start !important;
        }

        #game-field .empty-game-field-zone-full #game-life-bar-player .game-life-bar-part,
        #game-field .empty-game-field-zone-full #game-life-bar-opponent .game-life-bar-part {
            margin: 0 !important;
        }

        #game-field .empty-game-field-zone-full #game-timer-player,
        #game-field .empty-game-field-zone-full #game-timer-opponent {
            display: inline-block !important;
            width: 44px !important;
            height: 16px !important;
            line-height: 16px !important;
            box-sizing: border-box !important;
            text-align: center !important;
            vertical-align: top !important;
        }

        #game-field .empty-game-field-zone-full #game-timer-bar-player,
        #game-field .empty-game-field-zone-full #game-timer-bar-opponent {
            display: block !important;
            height: 12px !important;
            box-sizing: border-box !important;
        }

        #game-field .empty-game-field-zone-full #game-timer-player[style*="display: none"],
        #game-field .empty-game-field-zone-full #game-timer-opponent[style*="display: none"],
        #game-field .empty-game-field-zone-full #game-timer-bar-player[style*="display: none"],
        #game-field .empty-game-field-zone-full #game-timer-bar-opponent[style*="display: none"] {
            visibility: hidden !important;
        }

        #game-field .empty-game-field-zone-full #game-force-chain-button,
        #game-field .empty-game-field-zone-full #game-cancel-button,
        #game-field .empty-game-field-zone-full #game-reset-button,
        #game-field .empty-game-field-zone-full #game-turn-display,
        #game-field .empty-game-field-zone-full .game-phase-button {
            display: block !important;
            margin-left: auto !important;
            margin-right: auto !important;
        }

        #game-field .empty-game-field-zone-full .game-turn-phase-container {
            text-align: center !important;
        }

        #game-selection-window,
        #game-yesno-window,
        #game-position-window,
        #game-option-window,
        #game-announce-window,
        #game-announce-card-window,
        #game-rps-window {
            position: fixed !important;
            left: 50vw !important;
            top: 50vh !important;
            margin: 0 !important;
            transform: translate(-50%, -50%) !important;
            z-index: 400 !important;
        }

        #game-hint-window {
            position: fixed !important;
            left: var(--custom-field-center-x, 50%) !important;
            margin: 0 !important;
            transform: translateX(-50%) !important;
            z-index: 400 !important;
        }

        #game-selection-window {
            width: 75% !important;
            max-width: 800px !important;
            box-sizing: border-box !important;
        }

        #game-next-turn {
            left: var(--custom-field-center-x, 50%) !important;
            top: var(--custom-field-center-y, 50%) !important;
            transform: translate(-50%, -50%) !important;
            z-index: 500 !important;
        }

    `;

    const previousStyle = document.getElementById('custom-layout-styles');
    if (previousStyle) previousStyle.remove();

    const styleElement = document.createElement('style');
    styleElement.id = 'custom-layout-styles';
    styleElement.type = 'text/css';
    styleElement.appendChild(document.createTextNode(css));
    (document.head || document.documentElement).appendChild(styleElement);

    function removeUndefinedEntries(container) {
        Array.from(container.childNodes).forEach((entry) => {
            const isBareUndefined = entry.textContent.trim() === 'undefined'
                && (entry.nodeType === Node.TEXT_NODE
                    || (entry.nodeType === Node.ELEMENT_NODE && entry.childElementCount === 0));

            if (isBareUndefined) entry.remove();
        });
    }

    function setupEventLogPanel(logElement) {
        if (logElement.dataset.toggleInitialized === "true") return;

        const scrollContainer = logElement.querySelector("#game-event-log-content") || logElement;
        let userHasScrolledUp = false;

        scrollContainer.addEventListener('scroll', () => {
            const threshold = 40;
            const isAtBottom = (scrollContainer.scrollHeight - scrollContainer.scrollTop - scrollContainer.clientHeight) <= threshold;
            userHasScrolledUp = !isAtBottom;
        });

        const observer = new MutationObserver(() => {
            removeUndefinedEntries(scrollContainer);
            if (!userHasScrolledUp) {
                scrollContainer.scrollTop = scrollContainer.scrollHeight;
            }
        });

        removeUndefinedEntries(scrollContainer);
        observer.observe(scrollContainer, { childList: true, subtree: true });

        logElement.dataset.toggleInitialized = "true";
    }

    function removeEventLogTab() {
        const eventLogButton = Array.from(
            document.querySelectorAll("#card-column-header-content .game-card-tab-button")
        ).find((button) =>
            button.textContent.replace(/\s+/g, " ").trim().toLowerCase() === "event log"
        );
        if (!eventLogButton) return;

        if (eventLogButton.classList.contains("game-card-tab-button-active")) {
            document.getElementById("game-button-card-info")?.click();
        }
        eventLogButton.remove();
    }

    function setupRightPanel(logElement, shouldShow) {
        let panel = document.getElementById("custom-right-panel");
        if (!logElement) {
            if (panel) panel.hidden = true;
            return;
        }

        if (!panel) {
            panel = document.createElement("section");
            panel.id = "custom-right-panel";

            const body = document.createElement("div");
            body.id = "custom-right-panel-body";
            panel.appendChild(body);
            document.body.appendChild(panel);
        }

        const body = panel.querySelector("#custom-right-panel-body");
        if (body && logElement.parentElement !== body) body.replaceChildren(logElement);
        logElement.removeAttribute("hidden");
        logElement.classList.remove("log-closed");
        logElement.style.removeProperty("display");
        panel.hidden = !shouldShow;
        setupEventLogPanel(logElement);
    }

    function applyLayoutModifications() {
        const gameField = document.querySelector("#game-field");
        const gameRow = gameField && gameField.querySelector(":scope > tbody > tr");
        if (!gameRow) return;

        const sideCells = Array.from(gameRow.children)
            .filter((cell) => cell.classList.contains("empty-game-field-zone-full"));
        const leftCell = sideCells[0];
        const rightCell = sideCells[1];
        let layoutChanged = false;

        if (leftCell && rightCell) {
            const leftTable = leftCell.querySelector(":scope > table");
            const rightTable = rightCell.querySelector(":scope > table");

            if (leftTable && rightTable) {
                leftCell.insertBefore(rightTable, leftTable);
                rightCell.remove();
                layoutChanged = true;
            }
        }

        if (layoutChanged) {
            const sideTables = leftCell.querySelectorAll(":scope > table");
            const rowContainer = sideTables[1]?.tBodies[0];

            if (rowContainer && rowContainer.dataset.layoutReordered !== "true") {
                const firstRow = rowContainer.rows[0];
                if (firstRow) rowContainer.appendChild(firstRow);
                rowContainer.dataset.layoutReordered = "true";
            }
            gameRow.dataset.customLayoutApplied = "true";
        }
    }

    let observedPlayArea = null;
    let playAreaResizeObserver = null;
    let lastPlayerStatusLayout = "";

    function updateGameFieldCenter() {
        if (!observedPlayArea) return;

        const fieldBounds = observedPlayArea.getBoundingClientRect();
        if (fieldBounds.width === 0 || fieldBounds.height === 0) return;

        const fieldCenterX = Math.round(fieldBounds.left + fieldBounds.width / 2);
        const fieldCenterY = Math.round(fieldBounds.top + fieldBounds.height / 2);
        document.documentElement.style.setProperty("--custom-field-center-x", `${fieldCenterX}px`);
        document.documentElement.style.setProperty("--custom-field-center-y", `${fieldCenterY}px`);

        const playerStatus = document.querySelector(
            "#game-field .empty-game-field-zone-full .game-avatar-area.game-avatar-left"
        );
        const opponentStatus = document.querySelector(
            "#game-field .empty-game-field-zone-full .game-avatar-area.game-avatar-right"
        );
        if (playerStatus && opponentStatus) {
            const playerBounds = playerStatus.getBoundingClientRect();
            const opponentBounds = opponentStatus.getBoundingClientRect();
            const currentOffset = Number.parseFloat(
                getComputedStyle(document.documentElement)
                    .getPropertyValue("--custom-player-status-offset")
            ) || 0;
            const topInset = opponentBounds.top - fieldBounds.top;
            const playerBaseBottom = playerBounds.bottom - currentOffset;
            const layoutKey = [
                fieldBounds.top,
                fieldBounds.bottom,
                topInset,
                playerBaseBottom
            ].map((value) => Math.round(value)).join(":");
            if (layoutKey === lastPlayerStatusLayout) return;

            const offset = Math.round(fieldBounds.bottom - topInset - playerBaseBottom);
            document.documentElement.style.setProperty(
                "--custom-player-status-offset",
                `${offset}px`
            );
            lastPlayerStatusLayout = layoutKey;
        }
    }

    function observePlayArea(playArea) {
        if (playArea === observedPlayArea) return;

        if (playAreaResizeObserver) playAreaResizeObserver.disconnect();
        observedPlayArea = playArea;
        playAreaResizeObserver = null;

        if (!playArea) return;

        playAreaResizeObserver = new ResizeObserver(updateGameFieldCenter);
        playAreaResizeObserver.observe(playArea);
        updateGameFieldCenter();
    }

    function applyModifications() {
        const gameField = document.querySelector("#game-field");
        const playArea = document.querySelector("#game-field-background-div");
        const leftPanel = document.querySelector("#card-column");
        const leftPanelHeader = document.querySelector("#card-column-header-content .game-card-tab");
        const logElement = document.querySelector("#game-event-log");
        removeEventLogTab();
        const leftPanelVisible = Boolean(
            leftPanel
            && leftPanelHeader
            && leftPanelHeader.getBoundingClientRect().width > 0
            && leftPanelHeader.getBoundingClientRect().height > 0
            && getComputedStyle(leftPanel).display !== "none"
            && getComputedStyle(leftPanel).visibility !== "hidden"
        );
        applyLayoutModifications();
        observePlayArea(playArea);

        const playerDeck = document.getElementById("game-field-player-deck");
        if (playerDeck && gameField) {
            const deckBounds = playerDeck.getBoundingClientRect();
            const fieldBounds = gameField.getBoundingClientRect();
            if (deckBounds.width > 0 && fieldBounds.width > 0) {
                const fieldWidth = Math.max(0, deckBounds.right - fieldBounds.left);
                document.documentElement.style.setProperty(
                    "--custom-game-field-width",
                    `${fieldWidth}px`
                );
                const sidePanelWidth = Math.max(0, (window.innerWidth - fieldWidth - 15) / 2);
                if (leftPanel) {
                    document.documentElement.style.setProperty(
                        "--custom-side-panel-width",
                        `${sidePanelWidth}px`
                    );
                }
                document.documentElement.style.setProperty(
                    "--custom-right-panel-width",
                    `${sidePanelWidth}px`
                );
            }
        }

        updateGameFieldCenter();
        setupRightPanel(logElement, leftPanelVisible);
    }

    let modificationsScheduled = false;
    function scheduleApplyModifications() {
        if (modificationsScheduled) return;
        modificationsScheduled = true;
        requestAnimationFrame(() => {
            modificationsScheduled = false;
            applyModifications();
        });
    }

    applyModifications();

    const pageObserver = new MutationObserver(scheduleApplyModifications);
    pageObserver.observe(document.body, { childList: true, subtree: true });
    window.addEventListener("resize", scheduleApplyModifications);
})();
