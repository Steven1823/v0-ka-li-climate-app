/**
 * Enhanced LanguageToggle with better styling and accessibility
 */

import { getLanguage, setLanguage, t } from "../i18n.js"

export class LanguageToggle {
  constructor() {
    this.currentLang = getLanguage()
  }

  render() {
    const container = document.createElement("div")
    container.className = "language-toggle"
    container.setAttribute("role", "group")
    container.setAttribute("aria-label", "Language selection")

    const buttonEn = document.createElement("button")
    buttonEn.className = `language-toggle__btn ${this.currentLang === "en" ? "language-toggle__btn--active" : ""}`
    buttonEn.textContent = t("lang.english")
    buttonEn.setAttribute("aria-label", t("lang.english"))
    buttonEn.setAttribute("aria-pressed", this.currentLang === "en")
    buttonEn.setAttribute("type", "button")
    buttonEn.addEventListener("click", () => this.switchLanguage("en", buttonEn, buttonSw))

    const buttonSw = document.createElement("button")
    buttonSw.className = `language-toggle__btn ${this.currentLang === "sw" ? "language-toggle__btn--active" : ""}`
    buttonSw.textContent = t("lang.swahili")
    buttonSw.setAttribute("aria-label", t("lang.swahili"))
    buttonSw.setAttribute("aria-pressed", this.currentLang === "sw")
    buttonSw.setAttribute("type", "button")
    buttonSw.addEventListener("click", () => this.switchLanguage("sw", buttonEn, buttonSw))

    container.appendChild(buttonEn)
    container.appendChild(buttonSw)

    return container
  }

  switchLanguage(lang, btnEn, btnSw) {
    setLanguage(lang)
    this.currentLang = lang

    // Update button states
    btnEn.classList.toggle("language-toggle__btn--active", lang === "en")
    btnSw.classList.toggle("language-toggle__btn--active", lang === "sw")

    btnEn.setAttribute("aria-pressed", lang === "en")
    btnSw.setAttribute("aria-pressed", lang === "sw")
  }

  static create() {
    return new LanguageToggle().render()
  }
}

export const LanguageToggleStyles = `
.language-toggle {
  display: flex;
  gap: var(--spacing-xs);
  align-items: center;
  background-color: rgba(255, 255, 255, 0.1);
  padding: 4px;
  border-radius: var(--radius-sm);
}

.language-toggle__btn {
  padding: 6px 12px;
  border: 1px solid transparent;
  background-color: transparent;
  border-radius: var(--radius-sm);
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  color: rgba(255, 255, 255, 0.8);
  font-family: inherit;
  user-select: none;
  -webkit-user-select: none;
  -webkit-tap-highlight-color: transparent;
}

.language-toggle__btn:hover {
  color: white;
  background-color: rgba(255, 255, 255, 0.15);
}

.language-toggle__btn:focus {
  outline: 2px solid white;
  outline-offset: -2px;
}

.language-toggle__btn--active {
  background-color: white;
  color: var(--color-primary);
  border-color: white;
  font-weight: 600;
}

.language-toggle__btn--active:hover {
  background-color: rgba(255, 255, 255, 0.95);
}

@media (max-width: 599px) {
  .language-toggle {
    padding: 3px;
  }

  .language-toggle__btn {
    padding: 5px 10px;
    font-size: 11px;
  }
}
`
