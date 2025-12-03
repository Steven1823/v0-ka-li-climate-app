/**
 * Mock data module: All app data sources (alerts, prices, members, etc.)
 * Change this file to update mock content
 */

export const mockFarmerData = {
  id: "farmer_001",
  name: "Samuel Kipchoge",
  area: "Rift Valley, Nakuru",
  phone: "+254712345678",
}

export const mockAlerts = [
  {
    id: "alert_1",
    type: "weather", // 'weather' | 'market' | 'other'
    message: "Drought expected in 5 days. Prepare now.",
    timestamp: new Date(Date.now() - 2 * 60000), // 2 min ago
    severity: "high",
  },
  {
    id: "alert_2",
    type: "market",
    message: "Maize prices up 12% this week.",
    timestamp: new Date(Date.now() - 30 * 60000), // 30 min ago
    severity: "medium",
  },
  {
    id: "alert_3",
    type: "weather",
    message: "Heavy rain forecast for Thursday.",
    timestamp: new Date(Date.now() - 2 * 3600000), // 2 hours ago
    severity: "medium",
  },
]

export const mockWeather = {
  temp: 28,
  rainChance: 30,
  condition: "Sunny",
  forecast: [
    { day: "Mon", high: 29, low: 18, rain: 20 },
    { day: "Tue", high: 27, low: 17, rain: 40 },
    { day: "Wed", high: 26, low: 16, rain: 60 },
  ],
}

export const mockMarketPrices = {
  maize: { price: 45, change: "+12%", unit: "KES/kg" },
  beans: { price: 120, change: "-3%", unit: "KES/kg" },
  sorghum: { price: 38, change: "+5%", unit: "KES/kg" },
  millet: { price: 50, change: "+2%", unit: "KES/kg" },
}

export const mockCropRisks = {
  maize: { risk: "HIGH", score: 72, recommendation: "Wait 2 weeks, irrigation needed" },
  beans: { risk: "LOW", score: 28, recommendation: "Optimal conditions now" },
  sorghum: { risk: "MEDIUM", score: 55, recommendation: "Plant with caution" },
  millet: { risk: "LOW", score: 22, recommendation: "Best time to plant" },
}

export const mockCooperativeData = {
  id: "coop_001",
  name: "Nakuru Farmers United",
  members: 247,
  alerts: mockAlerts,
}

export const mockExtensionOfficer = {
  id: "ext_001",
  name: "Grace Omondi",
  pendingReports: 3,
  area: "Kisumu East",
}

// Simulated geolocation fetch (no actual network call)
export async function getLocation() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ area: mockFarmerData.area, lat: -0.3031, lng: 35.8813 })
    }, 800) // Simulate network delay
  })
}

// Simulated alert fetch
export async function getAlerts(limit = 3) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockAlerts.slice(0, limit))
    }, 600)
  })
}

// Simulated market data fetch
export async function getMarketPrices() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockMarketPrices)
    }, 500)
  })
}

// Simulated risk calculation
export async function calculateRisk(crop) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const risk = mockCropRisks[crop] || { risk: "MEDIUM", score: 50 }
      resolve(risk)
    }, 800)
  })
}

// IndexedDB for offline queue
export async function initOfflineDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("kali-offline", 1)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => {
      const db = request.result
      if (!db.objectStoreNames.contains("pending_uploads")) {
        // DB already exists, resolve
        resolve(db)
      }
    }
    request.onupgradeneeded = (event) => {
      const db = event.target.result
      if (!db.objectStoreNames.contains("pending_uploads")) {
        db.createObjectStore("pending_uploads", { keyPath: "id", autoIncrement: true })
      }
      resolve(db)
    }
  })
}

export async function addPendingUpload(data) {
  const db = await initOfflineDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction("pending_uploads", "readwrite")
    const store = tx.objectStore("pending_uploads")
    const request = store.add({ ...data, timestamp: Date.now() })
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export async function getPendingUploads() {
  const db = await initOfflineDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction("pending_uploads", "readonly")
    const store = tx.objectStore("pending_uploads")
    const request = store.getAll()
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export async function clearPendingUpload(id) {
  const db = await initOfflineDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction("pending_uploads", "readwrite")
    const store = tx.objectStore("pending_uploads")
    const request = store.delete(id)
    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}
