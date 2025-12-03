/**
 * Farmer Dashboard - Simplified for 3-screen spec
 * Shows: Alert card, 3 quick action buttons, weather snapshot, and learning cards
 */

import { t } from "../i18n.js"
import { getLocation, getAlerts } from "../mockData.js"
import { LanguageToggle } from "../components/LanguageToggle.js"
import { AlertCard } from "../components/AlertCard.js"
import { ActionButton } from "../components/ActionButton.js"
import { LoadingSkeleton } from "../components/LoadingSkeleton.js"
import { Router } from "../router.js"
import { mockFarmerData, mockWeather } from "../mockData.js"

export async function farmerDashboard() {
  const page = document.createElement("div")
  page.className = "page page--dashboard"
  page.setAttribute("data-page", "dashboard")

  page.innerHTML = `
    <header class="dashboard-header">
      <div class="dashboard-header__content">
        <h1 class="dashboard-greeting">${t("dashboard.greeting", { name: mockFarmerData.name })}</h1>
        <p class="dashboard-location" id="locationText">
          <span class="skeleton" style="width: 150px; height: 16px;"></span>
        </p>
      </div>
      <div class="dashboard-header__toggle"></div>
    </header>

    <main class="dashboard-main">
      <!-- Alert Card Section -->
      <section class="dashboard-alert-section" id="alertSection"></section>

      <!-- Quick Actions: 3 buttons only -->
      <section class="dashboard-quick-actions-section" id="quickActionsSection"></section>

      <!-- Weather Snapshot -->
      <section class="dashboard-weather-section" id="weatherSection"></section>

      <!-- Learning Cards Section -->
      <section class="dashboard-learning-section" id="learningSection"></section>
    </main>

    <!-- TTS Modal -->
    <div class="modal modal--hidden" id="ttsModal">
      <div class="modal__overlay" id="ttsModalOverlay"></div>
      <div class="modal__content" role="dialog" aria-labelledby="ttsModalTitle">
        <header class="modal__header">
          <h2 id="ttsModalTitle">[Audio Explanation]</h2>
          <button class="modal__close" id="ttsModalClose" aria-label="${t("common.close")}">×</button>
        </header>
        <div class="modal__body">
          <p id="ttsContent"></p>
          <div class="tts-controls">
            <button class="action-button action-button--primary" id="ttsPlayBtn">
              <span>▶ Play</span>
            </button>
            <button class="action-button action-button--secondary" id="ttsPauseBtn">
              <span>⏸ Pause</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `

  // Language toggle
  const toggleContainer = page.querySelector(".dashboard-header__toggle")
  toggleContainer.appendChild(LanguageToggle.create())

  // Load data
  await loadDashboardData(page)

  return page
}

async function loadDashboardData(page) {
  loadLocation(page)
  loadTodayAlert(page)
  loadQuickActions(page)
  loadWeatherSnapshot(page)
  loadLearningCards(page)
  setupTTSModal(page)
}

async function loadLocation(page) {
  const locationText = page.querySelector("#locationText")
  try {
    const location = await getLocation()
    locationText.innerHTML = `<strong>${t("dashboard.location", { area: location.area })}</strong>`
  } catch (err) {
    locationText.innerHTML = `<strong>[Nakuru Area]</strong>`
  }
}

async function loadTodayAlert(page) {
  const alertSection = page.querySelector("#alertSection")
  alertSection.innerHTML = `
    <h2>[Today's Alert]</h2>
    <div id="alertContainer">
      ${LoadingSkeleton.create({ width: "100%", height: "120px", rows: 1 }).outerHTML}
    </div>
  `

  try {
    const alerts = await getAlerts(1)
    const alert = alerts[0]
    const alertContainer = page.querySelector("#alertContainer")

    const card = AlertCard.create({
      type: alert.type,
      message: alert.message,
      timestamp: alert.timestamp,
      onFeedback: (action) => {
        saveFeedback(alert.id, action)
      },
      onHearExplanation: () => {
        triggerTTS(page, alert.message)
      },
    })

    alertContainer.replaceChild(card, alertContainer.firstChild)
  } catch (err) {
    alertSection.innerHTML += `<p style="color: var(--color-text-secondary);">[Error loading alert]</p>`
  }
}

async function loadQuickActions(page) {
  const actionsSection = page.querySelector("#quickActionsSection")
  const router = Router.instance()

  actionsSection.innerHTML = `<h2>[Quick Actions]</h2><div class="quick-actions-grid" id="quickActionsGrid"></div>`
  const grid = page.querySelector("#quickActionsGrid")

  // Action 1: What to Plant?
  const btn1 = new ActionButton({
    label: "[What should I plant?]",
    icon: "🌽",
    variant: "secondary",
    fullWidth: true,
    onClick: () => router.navigate("/simulator"),
  }).render()
  grid.appendChild(btn1)

  // Action 2: Market Prices
  const btn2 = new ActionButton({
    label: "[Market prices]",
    icon: "💰",
    variant: "secondary",
    fullWidth: true,
    onClick: () => showMarketPrices(page),
  }).render()
  grid.appendChild(btn2)

  // Action 3: Learn
  const btn3 = new ActionButton({
    label: "[Learn]",
    icon: "📚",
    variant: "secondary",
    fullWidth: true,
    onClick: () => toggleLearningCards(page),
  }).render()
  grid.appendChild(btn3)
}

async function loadWeatherSnapshot(page) {
  const weatherSection = page.querySelector("#weatherSection")
  weatherSection.innerHTML = `
    <h2>[Weather Today]</h2>
    <div class="weather-snapshot">
      <div class="weather-snapshot__today">
        <div class="skeleton" style="width: 100%; height: 60px;"></div>
      </div>
      <div class="weather-snapshot__forecast">
        <div class="skeleton" style="width: 100%; height: 60px;"></div>
      </div>
    </div>
  `

  try {
    const weather = mockWeather
    const snapshot = weatherSection.querySelector(".weather-snapshot")

    snapshot.innerHTML = `
      <div class="weather-snapshot__today">
        <div class="weather-card">
          <span class="weather-icon">☀️</span>
          <div class="weather-info">
            <p class="weather-temp">[${weather.temp}°C, ${weather.rainChance}% rain chance]</p>
            <p class="weather-condition">[${weather.condition}]</p>
          </div>
        </div>
      </div>
      <div class="weather-snapshot__forecast">
        <div class="forecast-bars">
          ${weather.forecast
            .map(
              (f, idx) => `
            <div class="forecast-bar" title="${f.day}: ${f.high}°C, ${f.rain}% rain">
              <div class="forecast-bar__label">${f.day}</div>
              <div class="forecast-bar__chart">
                <div class="forecast-bar__rain" style="height: ${f.rain}%;"></div>
              </div>
              <div class="forecast-bar__temp">${f.high}°</div>
            </div>
          `,
            )
            .join("")}
        </div>
      </div>
    `
  } catch (err) {
    weatherSection.innerHTML += `<p style="color: var(--color-text-secondary);">[Error]</p>`
  }
}

function loadLearningCards(page) {
  const learningSection = page.querySelector("#learningSection")
  learningSection.innerHTML = `
    <h2>[Learning Resources]</h2>
    <div class="learning-cards" id="learningCardsContainer" style="display: none;">
      <div class="learning-card">
        <h4>[Understanding Crop Insurance]</h4>
        <p>[Learn how crop insurance can protect your investment and ensure stable income even during difficult seasons.]</p>
        <button class="action-button action-button--ghost" style="width: 100%;">[Learn more]</button>
      </div>
      <div class="learning-card">
        <h4>[Climate Smart Farming Tips]</h4>
        <p>[Discover sustainable farming practices that adapt to climate change and improve soil health.]</p>
        <button class="action-button action-button--ghost" style="width: 100%;">[Learn more]</button>
      </div>
    </div>
  `
}

function toggleLearningCards(page) {
  const container = page.querySelector("#learningCardsContainer")
  if (container) {
    container.style.display = container.style.display === "none" ? "grid" : "none"
  }
}

function showMarketPrices(page) {
  const prices = {
    maize: { price: 45, change: "+12%" },
    beans: { price: 120, change: "-3%" },
    sorghum: { price: 38, change: "+5%" },
    millet: { price: 50, change: "+2%" },
  }

  const modal = createSimpleModal("[Market Prices]")
  const content = modal.querySelector(".simple-modal__content")

  const html = `
    <div class="price-grid">
      <div class="price-card"><h4>[Maize]</h4><p class="price">KES ${prices.maize.price}/kg <span class="change">${prices.maize.change}</span></p></div>
      <div class="price-card"><h4>[Beans]</h4><p class="price">KES ${prices.beans.price}/kg <span class="change">${prices.beans.change}</span></p></div>
      <div class="price-card"><h4>[Sorghum]</h4><p class="price">KES ${prices.sorghum.price}/kg <span class="change">${prices.sorghum.change}</span></p></div>
      <div class="price-card"><h4>[Millet]</h4><p class="price">KES ${prices.millet.price}/kg <span class="change">${prices.millet.change}</span></p></div>
    </div>
  `

  content.innerHTML = html
  document.body.appendChild(modal)

  const closeBtn = modal.querySelector(".simple-modal__close")
  closeBtn.addEventListener("click", () => modal.remove())
}

function saveFeedback(alertId, action) {
  const feedback = JSON.parse(localStorage.getItem("kali:alert-feedback") || "{}")
  feedback[alertId] = action
  localStorage.setItem("kali:alert-feedback", JSON.stringify(feedback))
}

function triggerTTS(page, text) {
  const modal = page.querySelector("#ttsModal")
  const content = page.querySelector("#ttsContent")
  content.textContent = text
  modal.classList.remove("modal--hidden")
  page.querySelector("#ttsPlayBtn").focus()
}

function setupTTSModal(page) {
  const modal = page.querySelector("#ttsModal")
  const overlay = page.querySelector("#ttsModalOverlay")
  const closeBtn = page.querySelector("#ttsModalClose")
  const playBtn = page.querySelector("#ttsPlayBtn")
  const pauseBtn = page.querySelector("#ttsPauseBtn")

  let utterance = null

  const closeModal = () => {
    modal.classList.add("modal--hidden")
    if (utterance) window.speechSynthesis.cancel()
  }

  closeBtn.addEventListener("click", closeModal)
  overlay.addEventListener("click", closeModal)

  playBtn.addEventListener("click", () => {
    if (utterance) window.speechSynthesis.cancel()
    const text = page.querySelector("#ttsContent").textContent
    utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = "sw"
    utterance.rate = 0.9
    window.speechSynthesis.speak(utterance)
  })

  pauseBtn.addEventListener("click", () => {
    if (window.speechSynthesis.speaking) window.speechSynthesis.pause()
  })

  modal.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal()
  })
}

function createSimpleModal(title) {
  const modal = document.createElement("div")
  modal.className = "simple-modal"
  modal.innerHTML = `
    <div class="simple-modal__overlay"></div>
    <div class="simple-modal__box">
      <header class="simple-modal__header">
        <h3>${title}</h3>
        <button class="simple-modal__close" aria-label="Close">×</button>
      </header>
      <div class="simple-modal__content"></div>
    </div>
  `

  const overlay = modal.querySelector(".simple-modal__overlay")
  overlay.addEventListener("click", () => modal.remove())

  return modal
}
