/**
 * Main app entry point
 * Initializes router, components, and event listeners
 */

import { Router } from "./router.js"
import { t, getLanguage, setLanguage } from "./i18n.js"
import {
  ActionButton,
  ActionButtonStyles,
  LanguageToggle,
  LanguageToggleStyles,
  AlertCard,
  AlertCardStyles,
  LoadingSkeleton,
  LoadingSkeletonStyles,
  ResultCard,
  ResultCardStyles,
} from "./components/index.js"
import { landingPage } from "./pages/landing.js"
import { farmerDashboard } from "./pages/farmerDashboard.js"
import { simulatorPage } from "./pages/simulator.js"

// Inject component CSS into document
function injectComponentStyles() {
  const style = document.createElement("style")
  style.textContent = [
    ActionButtonStyles,
    LanguageToggleStyles,
    AlertCardStyles,
    LoadingSkeletonStyles,
    ResultCardStyles,
  ].join("\n")
  document.head.appendChild(style)
}

// Initialize app
function initApp() {
  injectComponentStyles()

  const router = Router.instance()
  router.register("/", landingPage)
  router.register("/dashboard", farmerDashboard)
  router.register("/simulator", simulatorPage)

  // Handle language changes
  window.addEventListener("kali:lang-changed", (event) => {
    location.reload()
  })

  // Handle browser back/forward
  window.addEventListener("popstate", (event) => {
    const path = event.state?.path || "/"
    router.navigate(path)
  })

  // Initial navigation
  const path = window.location.pathname || "/"
  router.navigate(path)
}

// Bootstrap when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp)
} else {
  initApp()
}

// Export components and utilities globally for debugging
window.KaLI = {
  t,
  setLanguage,
  getLanguage,
  ActionButton,
  LanguageToggle,
  AlertCard,
  LoadingSkeleton,
  ResultCard,
}
