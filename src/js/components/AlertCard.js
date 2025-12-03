/**
 * Enhanced AlertCard with improved styling and accessibility
 */

import { ActionButton } from "./ActionButton.js"
import { t } from "../i18n.js"

export class AlertCard {
  constructor(props = {}) {
    this.props = {
      type: "weather", // 'weather' | 'market'
      message: "[Alert message]",
      timestamp: new Date(),
      onFeedback: () => {},
      onHearExplanation: () => {},
      alertId: `alert_${Date.now()}`,
      ...props,
    }
  }

  render() {
    const { type, message, timestamp, onFeedback, onHearExplanation, alertId } = this.props
    const card = document.createElement("article")
    card.className = "alert-card"
    card.setAttribute("data-alert-id", alertId)

    const badgeColor = type === "weather" ? "#2E7D32" : "#FF9800"
    const badgeLabel = type === "weather" ? t("dashboard.alert.weather") : t("dashboard.alert.market")
    const timeAgo = this.getTimeAgo(timestamp)

    card.innerHTML = `
      <div class="alert-card__header">
        <span class="alert-card__badge" style="background-color: ${badgeColor}; color: white;">
          ${badgeLabel}
        </span>
        <span class="alert-card__time" aria-label="Time posted">${timeAgo}</span>
      </div>
      <div class="alert-card__body">
        <p class="alert-card__message">${message}</p>
      </div>
      <div class="alert-card__actions">
        <div class="alert-card__buttons"></div>
      </div>
    `

    const buttonsContainer = card.querySelector(".alert-card__buttons")

    const btnAccurate = new ActionButton({
      label: t("dashboard.alert.accurate"),
      variant: "secondary",
      onClick: () => onFeedback("accurate"),
    }).render()

    const btnInaccurate = new ActionButton({
      label: t("dashboard.alert.inaccurate"),
      variant: "secondary",
      onClick: () => onFeedback("inaccurate"),
    }).render()

    const btnHear = new ActionButton({
      label: t("dashboard.alert.hear"),
      variant: "secondary",
      onClick: () => onHearExplanation(),
    }).render()

    buttonsContainer.appendChild(btnAccurate)
    buttonsContainer.appendChild(btnInaccurate)
    buttonsContainer.appendChild(btnHear)

    return card
  }

  getTimeAgo(date) {
    const now = new Date()
    const seconds = Math.floor((now - date) / 1000)

    if (seconds < 60) return t("common.just_now")
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${t("common.loading").toLowerCase()}`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    return "Some time ago"
  }

  static create(props) {
    return new AlertCard(props).render()
  }
}

export const AlertCardStyles = `
.alert-card {
  background-color: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-md);
  box-shadow: var(--shadow-sm);
  margin-bottom: var(--spacing-md);
  transition: all 0.2s ease;
}

.alert-card:hover {
  box-shadow: var(--shadow-md);
  border-color: rgba(46, 125, 50, 0.3);
}

.alert-card:focus-within {
  outline: 2px solid var(--color-primary);
  outline-offset: 0;
}

.alert-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.alert-card__badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.alert-card__time {
  font-size: 12px;
  color: var(--color-text-secondary);
}

.alert-card__body {
  margin-bottom: var(--spacing-md);
}

.alert-card__message {
  font-size: 15px;
  line-height: 1.6;
  margin: 0;
  color: var(--color-text);
}

.alert-card__actions {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.alert-card__buttons {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: var(--spacing-sm);
}

@media (max-width: 599px) {
  .alert-card {
    padding: var(--spacing-md);
  }

  .alert-card__buttons {
    grid-template-columns: 1fr;
  }

  .alert-card__header {
    flex-direction: column;
    align-items: flex-start;
  }
}
`
