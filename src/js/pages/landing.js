/**
 * Landing Page - Simplified for 3-screen spec
 * Logo, tagline, and single button to enter Farmer Dashboard
 */

import { t } from "../i18n.js"
import { ActionButton } from "../components/ActionButton.js"
import { LanguageToggle } from "../components/LanguageToggle.js"
import { Router } from "../router.js"

export async function landingPage() {
  const page = document.createElement("div")
  page.className = "page page--landing"
  page.setAttribute("data-page", "landing")

  page.innerHTML = `
    <div class="landing-container">
      <!-- Header with language toggle -->
      <header class="landing-header">
        <div class="landing-header__toggle"></div>
      </header>

      <!-- Main content -->
      <main class="landing-main">
        <section class="landing-hero">
          <div class="landing-logo">🌾 ${t("app.title")}</div>
          <p class="landing-tagline">${t("landing.tagline")}</p>
          <div class="landing-button"></div>
        </section>
      </main>
    </div>
  `

  // Language toggle
  const toggleContainer = page.querySelector(".landing-header__toggle")
  toggleContainer.appendChild(LanguageToggle.create())

  // Main button to enter dashboard
  const router = Router.instance()
  const btnContainer = page.querySelector(".landing-button")
  const btn = new ActionButton({
    label: "[Enter Farmer Dashboard]",
    variant: "primary",
    fullWidth: true,
    onClick: () => router.navigate("/dashboard"),
  }).render()
  btnContainer.appendChild(btn)

  return page
}
