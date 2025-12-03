/**
 * Enhanced LoadingSkeleton with better animations
 */

export class LoadingSkeleton {
  constructor(props = {}) {
    this.props = {
      width: "100%",
      height: "16px",
      rows: 1,
      type: "text", // 'text' | 'avatar' | 'card'
      ...props,
    }
  }

  render() {
    const { width, height, rows, type } = this.props
    const container = document.createElement("div")
    container.className = `skeleton-container skeleton-container--${type}`
    container.setAttribute("aria-busy", "true")
    container.setAttribute("role", "status")
    container.setAttribute("aria-label", "Loading content")

    for (let i = 0; i < rows; i++) {
      const skeleton = document.createElement("div")
      skeleton.className = "skeleton"
      skeleton.style.width = width
      skeleton.style.height = height
      skeleton.style.marginBottom = i < rows - 1 ? "var(--spacing-sm)" : "0"
      container.appendChild(skeleton)
    }

    return container
  }

  static create(props) {
    return new LoadingSkeleton(props).render()
  }
}

export const LoadingSkeletonStyles = `
.skeleton-container {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.skeleton {
  animation: skeleton-loading 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  background: linear-gradient(
    90deg,
    var(--color-bg-secondary) 0%,
    #f0f0f0 50%,
    var(--color-bg-secondary) 100%
  );
  background-size: 200% 100%;
  border-radius: var(--radius-md);
  display: block;
  height: auto;
}

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.skeleton-container--avatar .skeleton {
  border-radius: 50%;
}

.skeleton-container--card {
  padding: var(--spacing-md);
  background-color: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
}
`
