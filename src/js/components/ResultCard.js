/**
 * ResultCard: Factory function version (not used in 3-screen spec but keeping for future)
 */

function createResultCard(props = {}) {
  const config = {
    title: "[Result]",
    content: "",
    riskLevel: null, // 'HIGH' | 'MEDIUM' | 'LOW'
    actions: [],
    icon: null,
    subtitle: null,
    ...props,
  }

  const { title, content, riskLevel, actions, icon, subtitle } = config
  const card = document.createElement("article")
  card.className = "result-card"

  let riskBg = "transparent"
  let riskColor = "var(--color-text)"

  if (riskLevel === "HIGH") {
    riskBg = "#D32F2F"
    riskColor = "white"
  } else if (riskLevel === "MEDIUM") {
    riskBg = "#F57C00"
    riskColor = "white"
  } else if (riskLevel === "LOW") {
    riskBg = "#388E3C"
    riskColor = "white"
  }

  let html = `<div class="result-card__header">`
  if (icon) {
    html += `<span class="result-card__icon" aria-hidden="true">${icon}</span>`
  }
  html += `<div class="result-card__title-group">
    <h3>${title}</h3>`
  if (subtitle) {
    html += `<p class="result-card__subtitle">${subtitle}</p>`
  }
  html += `</div>`

  if (riskLevel) {
    html += `<span class="result-card__risk" style="background-color: ${riskBg}; color: ${riskColor};" role="status">
      ${riskLevel}
    </span>`
  }
  html += `</div>`

  if (content) {
    html += `<div class="result-card__body"><p class="result-card__content">${content}</p></div>`
  }

  if (actions.length > 0) {
    html += `<div class="result-card__actions"></div>`
  }

  card.innerHTML = html

  // Add action buttons
  if (actions.length > 0) {
    const actionsContainer = card.querySelector(".result-card__actions")
    actions.forEach((action) => {
      actionsContainer.appendChild(action)
    })
  }

  return card
}

export const ResultCard = {
  create: createResultCard,
}

export const ResultCardStyles = `
.result-card {
  background-color: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-md);
  margin-bottom: var(--spacing-md);
  transition: all 0.2s ease;
}

.result-card:hover {
  box-shadow: var(--shadow-lg);
}

.result-card:focus-within {
  outline: 2px solid var(--color-primary);
  outline-offset: 0;
}

.result-card__header {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
}

.result-card__icon {
  font-size: 32px;
  line-height: 1;
}

.result-card__title-group {
  flex: 1;
}

.result-card__title-group h3 {
  margin: 0 0 var(--spacing-xs) 0;
  font-size: 18px;
  color: var(--color-primary);
}

.result-card__subtitle {
  margin: 0;
  font-size: 12px;
  color: var(--color-text-secondary);
}

.result-card__risk {
  display: inline-block;
  padding: 6px 14px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
}

.result-card__body {
  margin-bottom: var(--spacing-md);
}

.result-card__content {
  font-size: 15px;
  line-height: 1.6;
  margin: 0;
  color: var(--color-text-secondary);
}

.result-card__actions {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

@media (max-width: 599px) {
  .result-card {
    padding: var(--spacing-md);
  }

  .result-card__header {
    grid-template-columns: auto 1fr;
  }

  .result-card__risk {
    grid-column: 1 / -1;
    justify-self: start;
  }

  .result-card__icon {
    font-size: 24px;
  }

  .result-card__title-group h3 {
    font-size: 16px;
  }
}
`
