/**
 * Cooperative Portal
 * Group management view showing member count, alerts, and team actions
 */

import { t } from "../i18n.js"
import { getAlerts } from "../mockData.js"
import { AlertCard } from "../components/AlertCard.js"
import { ActionButton } from "../components/ActionButton.js"
import { LanguageToggle } from "../components/LanguageToggle.js"
import { LoadingSkeleton } from "../components/LoadingSkeleton.js"
import { mockCooperativeData } from "../mockData.js"

export async function coopPortal() {
  const page = document.createElement("div")
  page.className = "page page--coop"
  page.setAttribute("data-page", "coop")

  page.innerHTML = `
    <header class="coop-header">
      <div>
        <h1>${t("coop.title")}</h1>
      </div>
      <div class="coop-header__toggle"></div>
    </header>

    <main class="coop-main">
      <section class="coop-stats">
        <div class="stat-card">
          <h3>${t("coop.members")}</h3>
          <p class="stat-value">${mockCooperativeData.members}</p>
        </div>
      </section>

      <section class="coop-alerts-section">
        <h2>${t("coop.alerts")}</h2>
        <div id="coopAlertsContainer"></div>
      </section>

      <section class="coop-actions-section">
        <h2>[Quick Actions]</h2>
        <div class="coop-actions-grid" id="coopActionsGrid"></div>
      </section>
    </main>
  `

  // Language toggle
  const toggleContainer = page.querySelector(".coop-header__toggle")
  toggleContainer.appendChild(LanguageToggle.create())

  // Load alerts
  await loadCoopAlerts(page)

  // Setup actions
  setupCoopActions(page)

  return page
}

async function loadCoopAlerts(page) {
  const container = page.querySelector("#coopAlertsContainer")
  container.innerHTML = `
    <div style="padding: var(--spacing-lg);">
      ${LoadingSkeleton.create({ width: "100%", height: "120px", rows: 2 }).outerHTML}
    </div>
  `

  try {
    const alerts = await getAlerts(3)
    container.innerHTML = ""
    alerts.forEach((alert) => {
      const card = AlertCard.create({
        type: alert.type,
        message: alert.message,
        timestamp: alert.timestamp,
        onFeedback: (action) => {
          saveFeedback(alert.id, action)
        },
      })
      container.appendChild(card)
    })
  } catch (err) {
    container.innerHTML = `<p style="color: var(--color-text-secondary);">${t("common.error")}</p>`
  }
}

function setupCoopActions(page) {
  const grid = page.querySelector("#coopActionsGrid")

  const btn1 = new ActionButton({
    label: t("coop.actions.send"),
    icon: "📢",
    variant: "secondary",
    fullWidth: true,
    onClick: () => showActionAlert("[Alert sent to all members]"),
  }).render()
  grid.appendChild(btn1)

  const btn2 = new ActionButton({
    label: t("coop.actions.risk"),
    icon: "🗺",
    variant: "secondary",
    fullWidth: true,
    onClick: () => showRiskMap(page),
  }).render()
  grid.appendChild(btn2)

  const btn3 = new ActionButton({
    label: t("coop.actions.reports"),
    icon: "📊",
    variant: "secondary",
    fullWidth: true,
    onClick: () => showActionAlert("[Member reports loading...]"),
  }).render()
  grid.appendChild(btn3)
}

function saveFeedback(alertId, action) {
  const feedback = JSON.parse(localStorage.getItem("kali:coop-feedback") || "{}")
  feedback[alertId] = action
  localStorage.setItem("kali:coop-feedback", JSON.stringify(feedback))
}

function showActionAlert(message) {
  // Simple notification
  const notification = document.createElement("div")
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: var(--color-primary);
    color: white;
    padding: 12px 24px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    z-index: 1000;
    animation: slideDown 0.3s ease;
  `
  notification.textContent = message
  document.body.appendChild(notification)

  setTimeout(() => {
    notification.remove()
  }, 3000)
}

function showRiskMap(page) {
  const modal = document.createElement("div")
  modal.className = "simple-modal"
  modal.innerHTML = `
    <div class="simple-modal__overlay"></div>
    <div class="simple-modal__box">
      <header class="simple-modal__header">
        <h3>${t("coop.actions.risk")}</h3>
        <button class="simple-modal__close" aria-label="${t("common.close")}">×</button>
      </header>
      <div class="simple-modal__content">
        <div class="risk-map">
          <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
            <!-- Map background -->
            <rect width="400" height="300" fill="#e8f5e9"/>
            <!-- Risk zones -->
            <circle cx="100" cy="80" r="40" fill="#D32F2F" opacity="0.6" title="High risk"/>
            <circle cx="300" cy="150" r="30" fill="#F57C00" opacity="0.6" title="Medium risk"/>
            <circle cx="150" cy="250" r="25" fill="#388E3C" opacity="0.6" title="Low risk"/>
            <!-- Legend -->
            <text x="20" y="290" font-size="12" fill="#333">High Risk</text>
            <text x="180" y="290" font-size="12" fill="#333">Medium Risk</text>
            <text x="320" y="290" font-size="12" fill="#333">Low Risk</text>
          </svg>
        </div>
      </div>
    </div>
  `

  const overlay = modal.querySelector(".simple-modal__overlay")
  const closeBtn = modal.querySelector(".simple-modal__close")

  overlay.addEventListener("click", () => modal.remove())
  closeBtn.addEventListener("click", () => modal.remove())

  document.body.appendChild(modal)
}
