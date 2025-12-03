/**
 * Enhanced ActionButton with improved accessibility and refined styling
 */

export class ActionButton {
  constructor(props = {}) {
    this.props = {
      label: "[Button]",
      icon: null,
      variant: "primary", // 'primary' | 'secondary' | 'ghost'
      fullWidth: false,
      onClick: () => {},
      disabled: false,
      ariaLabel: null,
      ...props,
    }
  }

  render() {
    const { label, icon, variant, fullWidth, onClick, disabled, ariaLabel } = this.props
    const button = document.createElement("button")

    button.className = [
      "action-button",
      `action-button--${variant}`,
      fullWidth && "action-button--full-width",
      disabled && "action-button--disabled",
    ]
      .filter(Boolean)
      .join(" ")

    button.setAttribute("aria-label", ariaLabel || label)
    button.disabled = disabled
    button.setAttribute("type", "button")

    let html = ""
    if (icon) {
      html += `<span class="action-button__icon" aria-hidden="true">${icon}</span>`
    }
    html += `<span class="action-button__label">${label}</span>`

    button.innerHTML = html
    button.addEventListener("click", onClick)

    return button
  }

  static create(props) {
    return new ActionButton(props).render()
  }
}

export const ActionButtonStyles = `
.action-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  min-height: 44px;
  padding: var(--spacing-sm) var(--spacing-md);
  border: none;
  border-radius: var(--radius-md);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
  user-select: none;
  -webkit-user-select: none;
  -webkit-tap-highlight-color: transparent;
}

.action-button:hover:not(:disabled) {
  transform: translateY(-1px);
}

.action-button:active:not(:disabled) {
  transform: translateY(0);
}

.action-button:focus {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.action-button:focus:not(:focus-visible) {
  outline: none;
}

.action-button:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.action-button--primary {
  background-color: var(--color-primary);
  color: white;
  box-shadow: var(--shadow-sm);
}

.action-button--primary:hover:not(:disabled) {
  background-color: var(--color-primary-light);
  box-shadow: var(--shadow-md);
}

.action-button--primary:active:not(:disabled) {
  box-shadow: var(--shadow-sm);
}

.action-button--secondary {
  background-color: var(--color-bg-secondary);
  color: var(--color-text);
  border: 1px solid var(--color-border);
}

.action-button--secondary:hover:not(:disabled) {
  background-color: #efefef;
  border-color: var(--color-primary);
}

.action-button--ghost {
  background-color: transparent;
  color: var(--color-primary);
  border: 1.5px solid var(--color-primary);
}

.action-button--ghost:hover:not(:disabled) {
  background-color: rgba(46, 125, 50, 0.08);
  border-color: var(--color-primary-light);
}

.action-button--full-width {
  width: 100%;
}

.action-button--disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.action-button__icon {
  font-size: 18px;
  line-height: 1;
  display: flex;
  align-items: center;
}

.action-button__label {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex-shrink: 1;
}

@media (max-width: 599px) {
  .action-button {
    font-size: 13px;
    padding: 8px 12px;
  }
}
`
