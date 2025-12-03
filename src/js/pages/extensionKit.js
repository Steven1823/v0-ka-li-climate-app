/**
 * Extension Field Kit
 * Offline-first field work mode with sync queue and offline indicator
 */

import { t } from "../i18n.js"
import { ActionButton } from "../components/ActionButton.js"
import { LanguageToggle } from "../components/LanguageToggle.js"
import { getPendingUploads, addPendingUpload, clearPendingUpload } from "../mockData.js"

export async function extensionKit() {
  const page = document.createElement("div")
  page.className = "page page--extension"
  page.setAttribute("data-page", "extension")

  page.innerHTML = `
    <header class="extension-header">
      <div>
        <h1>${t("extension.title")}</h1>
        <div class="online-status" id="onlineStatus">
          ${getOnlineHTML()}
        </div>
      </div>
      <div class="extension-header__toggle"></div>
    </header>

    <main class="extension-main">
      <section class="extension-actions-section">
        <h2>[Quick Actions]</h2>
        <div class="extension-actions-grid" id="extensionActionsGrid"></div>
      </section>

      <section class="extension-sync-section">
        <h2>[Pending Uploads]</h2>
        <div id="pendingUploadsContainer"></div>
      </section>
    </main>
  `

  // Language toggle
  const toggleContainer = page.querySelector(".extension-header__toggle")
  toggleContainer.appendChild(LanguageToggle.create())

  // Setup offline listener
  setupOfflineListener(page)

  // Setup actions
  setupExtensionActions(page)

  // Load pending uploads
  await loadPendingUploads(page)

  return page
}

function getOnlineHTML() {
  const isOnline = navigator.onLine
  return isOnline
    ? `<span class="status-badge status-badge--online">${t("extension.online")}</span>`
    : `<span class="status-badge status-badge--offline">${t("extension.offline")}</span>`
}

function setupOfflineListener(page) {
  const statusEl = page.querySelector("#onlineStatus")

  window.addEventListener("online", () => {
    statusEl.innerHTML = getOnlineHTML()
  })

  window.addEventListener("offline", () => {
    statusEl.innerHTML = getOnlineHTML()
  })
}

function setupExtensionActions(page) {
  const grid = page.querySelector("#extensionActionsGrid")

  const btn1 = new ActionButton({
    label: t("extension.actions.visit"),
    icon: "📝",
    variant: "secondary",
    fullWidth: true,
    onClick: () => createVisitReport(page),
  }).render()
  grid.appendChild(btn1)

  const btn2 = new ActionButton({
    label: t("extension.actions.disease"),
    icon: "🔍",
    variant: "secondary",
    fullWidth: true,
    onClick: () => showDiseaseChecker(page),
  }).render()
  grid.appendChild(btn2)

  const btn3 = new ActionButton({
    label: t("extension.actions.sync"),
    icon: "🔄",
    variant: "primary",
    fullWidth: true,
    onClick: () => syncData(page),
  }).render()
  grid.appendChild(btn3)
}

async function loadPendingUploads(page) {
  const container = page.querySelector("#pendingUploadsContainer")

  try {
    const pending = await getPendingUploads()

    if (pending.length === 0) {
      container.innerHTML = '<p style="color: var(--color-text-secondary);">[No pending uploads]</p>'
      return
    }

    container.innerHTML = `
      <div class="pending-list">
        ${pending
          .map(
            (item, idx) => `
          <div class="pending-item" data-id="${item.id}">
            <div class="pending-item__info">
              <p class="pending-item__type">${item.type || "Report"}</p>
              <p class="pending-item__time">${new Date(item.timestamp).toLocaleString()}</p>
            </div>
            <button class="pending-item__delete" data-id="${item.id}" aria-label="Delete">
              ×
            </button>
          </div>
        `,
          )
          .join("")}
      </div>
      <p style="font-size: 12px; color: var(--color-text-secondary); margin-top: var(--spacing-md);">
        ${t("extension.pending", { count: pending.length })}
      </p>
    `

    // Delete handlers
    container.querySelectorAll(".pending-item__delete").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        const id = Number.parseInt(e.target.getAttribute("data-id"))
        await clearPendingUpload(id)
        await loadPendingUploads(page) // Reload
      })
    })
  } catch (err) {
    container.innerHTML = '<p style="color: var(--color-text-secondary);">[Error loading uploads]</p>'
  }
}

function createVisitReport(page) {
  const modal = document.createElement("div")
  modal.className = "simple-modal"
  modal.innerHTML = `
    <div class="simple-modal__overlay"></div>
    <div class="simple-modal__box">
      <header class="simple-modal__header">
        <h3>${t("extension.actions.visit")}</h3>
        <button class="simple-modal__close" aria-label="${t("common.close")}">×</button>
      </header>
      <div class="simple-modal__content">
        <form id="visitForm" style="display: flex; flex-direction: column; gap: var(--spacing-md);">
          <div>
            <label style="display: block; margin-bottom: var(--spacing-sm); font-weight: 500;">[Farmer Name]</label>
            <input type="text" required style="width: 100%; padding: 8px 12px; border: 1px solid var(--color-border); border-radius: var(--radius-md); font-family: inherit; min-height: 44px;"/>
          </div>
          <div>
            <label style="display: block; margin-bottom: var(--spacing-sm); font-weight: 500;">[Crop]</label>
            <input type="text" required style="width: 100%; padding: 8px 12px; border: 1px solid var(--color-border); border-radius: var(--radius-md); font-family: inherit; min-height: 44px;"/>
          </div>
          <div>
            <label style="display: block; margin-bottom: var(--spacing-sm); font-weight: 500;">[Notes]</label>
            <textarea style="width: 100%; padding: 8px 12px; border: 1px solid var(--color-border); border-radius: var(--radius-md); font-family: inherit; resize: none; min-height: 100px;"></textarea>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-md);">
            <button type="submit" class="action-button action-button--primary" style="width: 100%;">
              [Save]
            </button>
            <button type="button" class="action-button action-button--secondary cancelBtn" style="width: 100%;">
              [Cancel]
            </button>
          </div>
        </form>
      </div>
    </div>
  `

  const form = modal.querySelector("#visitForm")
  const closeBtn = modal.querySelector(".simple-modal__close")
  const cancelBtn = modal.querySelector(".cancelBtn")
  const overlay = modal.querySelector(".simple-modal__overlay")

  form.addEventListener("submit", async (e) => {
    e.preventDefault()
    const inputs = form.querySelectorAll("input, textarea")
    const data = {
      type: "visit_report",
      farmer: inputs[0].value,
      crop: inputs[1].value,
      notes: inputs[2].value,
    }

    await addPendingUpload(data)
    modal.remove()
    await loadPendingUploads(page)
  })

  closeBtn.addEventListener("click", () => modal.remove())
  cancelBtn.addEventListener("click", () => modal.remove())
  overlay.addEventListener("click", () => modal.remove())

  document.body.appendChild(modal)
}

function showDiseaseChecker(page) {
  const modal = document.createElement("div")
  modal.className = "simple-modal"
  modal.innerHTML = `
    <div class="simple-modal__overlay"></div>
    <div class="simple-modal__box">
      <header class="simple-modal__header">
        <h3>${t("extension.actions.disease")}</h3>
        <button class="simple-modal__close" aria-label="${t("common.close")}">×</button>
      </header>
      <div class="simple-modal__content">
        <div class="disease-symptoms">
          <h4>[Common Diseases]</h4>
          <ul style="margin: 0; padding-left: 20px; list-style: disc;">
            <li>Maize lethal necrosis - Yellow streaks on leaves</li>
            <li>Rust - Brownish pustules on leaf undersides</li>
            <li>Fall armyworm - Holes in leaves and cobs</li>
            <li>Bacterial blight - Water-soaked lesions</li>
          </ul>
          <p style="margin-top: var(--spacing-md); font-size: 12px; color: var(--color-text-secondary);">
            [Contact extension officer for treatment options]
          </p>
        </div>
      </div>
    </div>
  `

  const closeBtn = modal.querySelector(".simple-modal__close")
  const overlay = modal.querySelector(".simple-modal__overlay")

  closeBtn.addEventListener("click", () => modal.remove())
  overlay.addEventListener("click", () => modal.remove())

  document.body.appendChild(modal)
}

async function syncData(page) {
  const btn = page.querySelector(".extension-actions-grid").querySelector(".action-button--primary")
  const originalText = btn.textContent
  btn.textContent = "[Syncing...]"
  btn.disabled = true

  // Simulate sync delay
  await new Promise((resolve) => setTimeout(resolve, 2000))

  const pending = await getPendingUploads()

  if (pending.length === 0) {
    alert("[All data synced!]")
  } else {
    alert(`[Synced ${pending.length} reports]`)
    // Clear pending (simulated sync)
    for (const item of pending) {
      await clearPendingUpload(item.id)
    }
  }

  btn.textContent = originalText
  btn.disabled = false

  await loadPendingUploads(page)
}
