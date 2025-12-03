/**
 * Simple client-side router for SPA
 * Routes: '/', '/dashboard', '/simulator', '/coop', '/extension'
 */

export class Router {
  constructor() {
    this.routes = {}
    this.currentRoute = "/"
  }

  register(path, handler) {
    this.routes[path] = handler
  }

  async navigate(path) {
    if (this.routes[path]) {
      this.currentRoute = path
      window.history.pushState({ path }, "", path)
      const appElement = document.getElementById("app")
      appElement.innerHTML = ""
      const page = await this.routes[path]()
      appElement.appendChild(page)
    }
  }

  static instance() {
    if (!window.__kaliRouter) {
      window.__kaliRouter = new Router()
    }
    return window.__kaliRouter
  }
}

export function link(path, text) {
  const a = document.createElement("a")
  a.href = path
  a.textContent = text
  a.addEventListener("click", (e) => {
    e.preventDefault()
    Router.instance().navigate(path)
  })
  return a
}
