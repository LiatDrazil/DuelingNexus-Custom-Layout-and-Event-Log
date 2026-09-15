// ==UserScript==
// @name         Dueling Nexus - Custom Layout & Event Log
// @namespace    https://github.com/LiatDrazil
// @version      1.0
// @description  Streamlined layout script with collapsible Event Log and table reordering.
// @author       LiatDrazil
// @match        https://duelingnexus.com/duel/*
// @downloadURL  https://raw.githubusercontent.com/LiatDrazil/DuelingNexus-Custom-Layout-and-Event-Log/main/script.user.js
// @updateURL    https://raw.githubusercontent.com/LiatDrazil/DuelingNexus-Custom-Layout-and-Event-Log/main/script.user.js
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    const logWidth = '360px';

    // Inject core CSS styles for layout alignment, event log styling, and selection window centering.
    const css = `
        #game-container, #game-field {
            margin-left: 0 !important;
            left: 0 !important;
            float: left !important;
        }

        #card-column {
            position: relative !important;
        }

        #game-event-log {
            display: flex !important;
            flex-direction: column !important;
            visibility: visible !important;
            opacity: 1 !important;
            position: fixed !important;
            top: 20px !important;
            right: 15px !important;
            width: ${logWidth} !important;
            height: calc(90vh - 20px) !important;
            z-index: 99999 !important;
            box-sizing: border-box !important;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6) !important;
            border: 2px solid rgba(255, 255, 255, 0.2) !important;
            border-radius: 6px !important;
            background-color: rgba(30, 30, 30, 0.98) !important;
            transition: opacity 0.2s ease, transform 0.2s ease;
        }

        #game-event-log.log-closed {
            display: none !important;
        }

        #game-event-log > *:not(.custom-toggle-header) {
            flex: 1 !important;
            overflow-y: auto !important;
        }

        .custom-toggle-header {
            height: 32px !important;
            background-color: rgba(45, 45, 45, 0.95) !important;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
            display: flex !important;
            align-items: center !important;
            justify-content: space-between !important;
            padding: 0 10px !important;
            font-size: 12px !important;
            color: #fff !important;
            font-family: sans-serif !important;
            user-select: none !important;
            flex-shrink: 0 !important;
            border-top-left-radius: 4px !important;
            border-top-right-radius: 4px !important;
        }

        .custom-toggle-btn {
            background: #444 !important;
            border: 1px solid #666 !important;
            color: #fff !important;
            padding: 2px 8px !important;
            border-radius: 3px !important;
            cursor: pointer !important;
            font-size: 11px !important;
        }

        .custom-toggle-btn:hover {
            background: #555 !important;
        }

        #game-field > tbody > tr > td:nth-child(1) > table,
        #game-field > tbody > tr > td:nth-child(3) > table {
            height: 50% !important;
            box-sizing: border-box !important;
        }

        #game-selection-window {
            width: 75% !important;
            max-width: 800px !important;
            left: 48% !important;
            top: 50% !important;
            transform: translate(-50%, -50%) !important;
            position: fixed !important;
            box-sizing: border-box !important;
        }
    `;

    const styleElement = document.createElement('style');
    styleElement.type = 'text/css';
    styleElement.appendChild(document.createTextNode(css));
    (document.head || document.documentElement).appendChild(styleElement);

    // Inject toggle header and close button into the Event Log.
    function setupEventLogPanel(logElement) {
        if (logElement.dataset.toggleInitialized === "true") return;

        let header = logElement.querySelector(".custom-toggle-header");
        if (!header) {
            header = document.createElement("div");
            header.className = "custom-toggle-header";
            
            const title = document.createElement("span");
            title.innerText = "Event Log";
            
            const closeBtn = document.createElement("button");
            closeBtn.className = "custom-toggle-btn";
            closeBtn.innerText = "✕ Close";
            
            closeBtn.addEventListener('click', () => {
                logElement.classList.add('log-closed');
                createReopenButton();
            });

            header.appendChild(title);
            header.appendChild(closeBtn);
            logElement.insertBefore(header, logElement.firstChild);
        }

        logElement.dataset.toggleInitialized = "true";
    }

    // Create floating button to reopen the Event Log panel.
    function createReopenButton() {
        if (document.getElementById("btn-reopen-log")) return;

        const reopenBtn = document.createElement("button");
        reopenBtn.id = "btn-reopen-log";
        reopenBtn.innerText = "📂 Open Log";
        reopenBtn.style.cssText = `
            position: fixed !important;
            top: 10px !important;
            right: 15px !important;
            z-index: 99999 !important;
            background: #333 !important;
            color: #fff !important;
            border: 1px solid #555 !important;
            padding: 6px 12px !important;
            border-radius: 4px !important;
            cursor: pointer !important;
            font-size: 12px !important;
            box-shadow: 0 4px 12px rgba(0,0,0,0.5) !important;
        `;

        reopenBtn.addEventListener('click', () => {
            const logElement = document.querySelector("#game-event-log");
            if (logElement) {
                logElement.classList.remove('log-closed');
            }
            reopenBtn.remove();
        });

        document.body.appendChild(reopenBtn);
    }

    // Safely apply structural DOM modifications once elements load.
    const applyModifications = setInterval(() => {
        const table3 = document.querySelector("#game-field > tbody > tr > td:nth-child(3) > table");
        const table1 = document.querySelector("#game-field > tbody > tr > td:nth-child(1) > table");
        const logElement = document.querySelector("#game-event-log");

        if (table1 && logElement) {
            if (table3 && table1.parentNode) {
                table1.parentNode.insertBefore(table3, table1);
            }

            const targetRow = document.querySelector("#game-field > tbody > tr > td:nth-child(1) > table:nth-child(2) > tbody > tr:nth-child(1)");
            const rowContainer = document.querySelector("#game-field > tbody > tr > td:nth-child(1) > table:nth-child(2) > tbody");
            if (targetRow && rowContainer) {
                rowContainer.appendChild(targetRow);
            }

            const oldColumn = document.querySelector("#game-field > tbody > tr > td:nth-child(3)");
            if (oldColumn) oldColumn.remove();

            const originalEventLogBtn = document.querySelector("#game-button-event-log");
            if (originalEventLogBtn) originalEventLogBtn.remove();

            setupEventLogPanel(logElement);

            clearInterval(applyModifications);
        }
    }, 250);
})();
