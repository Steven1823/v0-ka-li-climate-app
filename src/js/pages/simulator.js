import { calculateRisk } from "../mockData.js"
import { LoadingSkeleton } from "../components/LoadingSkeleton.js"
import { LanguageToggle } from "../components/LanguageToggle.js"
import { Router } from "../router.js"

const CROPS = ["maize", "sorghum", "beans", "millet"]
const CROP_ICONS = {
  maize: "🌽",
  sorghum: "🌾",
  beans: "🫘",
  millet: "🍚",
}

export async function simulatorPage() {
  const page = document.createElement("div")
  page.className = "page page--simulator"
  page.setAttribute("data-page", "simulator")

  page.innerHTML = `
    <header class="simulator-header">
      <h1>[Planting Advice]</h1>
      <div class="simulator-header__toggle"></div>
    </header>

    <main class="simulator-main">
      <div class="simulator-container">
        <div class="simulator-step" id="step1">
          <h2>[Which crop?]</h2>
          <div class="crop-buttons" id="cropButtons"></div>
          <button class="action-button action-button--secondary" style="width: 100%; margin-top: 16px;" id="backBtn">
            [Back]
          </button>
        </div>

        <div class="simulator-step simulator-step--hidden" id="step2">
          <div id="resultContainer"></div>
        </div>
      </div>
    </main>
  `

  // Language toggle
  const toggleContainer = page.querySelector(".simulator-header__toggle")
  toggleContainer.appendChild(LanguageToggle.create())

  setupSimulator(page)
  return page
}

function setupSimulator(page) {
  const cropButtonsContainer = page.querySelector("#cropButtons")
  const backBtn = page.querySelector("#backBtn")
  const router = Router.instance()

  CROPS.forEach((crop) => {
    const btn = document.createElement("button")
    btn.className = "crop-button action-button action-button--secondary"
    btn.style.width = "100%"
    btn.style.marginBottom = "8px"
    btn.innerHTML = `${CROP_ICONS[crop]} [${crop.charAt(0).toUpperCase() + crop.slice(1)}]`
    btn.addEventListener("click", () => handleCropSelect(page, crop))
    cropButtonsContainer.appendChild(btn)
  })

  backBtn.addEventListener("click", () => {
    router.navigate("/dashboard")
  })
}

async function handleCropSelect(page, crop) {
  showStep2Loading(page)

  try {
    const riskData = await calculateRisk(crop)
    showStep2Result(page, crop, riskData)
  } catch (err) {
    showStep2Error(page)
  }
}

function showStep2Loading(page) {
  const step1 = page.querySelector("#step1")
  const step2 = page.querySelector("#step2")
  const resultContainer = page.querySelector("#resultContainer")

  step1.classList.add("simulator-step--hidden")
  step2.classList.remove("simulator-step--hidden")

  resultContainer.innerHTML = `
    <div style="padding: var(--spacing-lg);">
      ${LoadingSkeleton.create({ width: "100%", height: "180px", rows: 1 }).outerHTML}
    </div>
  `
}

function showStep2Result(page, crop, riskData) {
  const resultContainer = page.querySelector("#resultContainer")
  const router = Router.instance()

  const riskLevel = riskData.risk
  const cropLabel = crop.charAt(0).toUpperCase() + crop.slice(1)
  const cropIcon = CROP_ICONS[crop]

  const improvements = {
    maize: -15,
    sorghum: 10,
    beans: 5,
    millet: 22,
  }
  const improvementPercent = improvements[crop] || 0

  const resultHTML = `
    <div class="simulator-result">
      <h2 style="text-align: center; margin-bottom: 24px;">[Risk: ${riskLevel}]</h2>
      
      <div class="risk-display">
        <h3>${cropIcon} [${cropLabel}]</h3>
        <div class="risk-bar">
          <div class="risk-bar__fill" style="width: ${riskData.score}%;"></div>
        </div>
        <p class="risk-score">[Risk Score: ${riskData.score}/100]</p>
      </div>

      <div class="comparison">
        <h4>[Compared to current crop:]</h4>
        <p>${improvementPercent > 0 ? "✓" : "✗"} [${Math.abs(improvementPercent)}% ${improvementPercent > 0 ? "better" : "worse"}]</p>
      </div>

      <div class="recommendation">
        <h4>[Recommendation:]</h4>
        <p>${riskData.recommendation}</p>
      </div>

      <div style="display: flex; gap: 8px; margin-top: 24px;">
        <button class="action-button action-button--primary" style="flex: 1;" id="planBtn">
          [Plan This Crop]
        </button>
        <button class="action-button action-button--ghost" style="flex: 1;" id="tryBtn">
          [Try Another]
        </button>
      </div>
    </div>
  `

  resultContainer.innerHTML = resultHTML

  // Button handlers
  page.querySelector("#planBtn").addEventListener("click", () => {
    localStorage.setItem("kali:planned-crop", crop)
    router.navigate("/dashboard")
  })

  page.querySelector("#tryBtn").addEventListener("click", () => {
    page.querySelector("#step1").classList.remove("simulator-step--hidden")
    page.querySelector("#step2").classList.add("simulator-step--hidden")
  })
}

function showStep2Error(page) {
  const resultContainer = page.querySelector("#resultContainer")
  resultContainer.innerHTML = `
    <div style="padding: var(--spacing-lg); text-align: center;">
      <p style="color: var(--color-text-secondary);">[Error calculating risk]</p>
      <button class="action-button action-button--secondary" style="width: 100%;" onclick="location.reload()">
        [Try Again]
      </button>
    </div>
  `
}
