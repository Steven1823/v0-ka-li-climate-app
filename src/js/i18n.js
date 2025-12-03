/**
 * i18n module: Comprehensive localization system
 * All UI strings are bracketed [like this] for translation
 * Language persists to localStorage as 'kali:lang'
 * Supports: English (en), Swahili (sw)
 */

const LOCALE_DATA = {
  en: {
    // Common
    "app.title": "KaLI",
    "app.tagline": "Your farm. Predicted. Protected. Profitable.",
    "common.welcome": "Welcome, {name}",
    "common.loading": "Loading...",
    "common.error": "Something went wrong",
    "common.retry": "Try Again",
    "common.close": "Close",
    "common.cancel": "Cancel",
    "common.submit": "Submit",
    "common.email": "Email",
    "common.phone": "Phone",
    "common.explore": "Explore",
    "common.just_now": "Just now",

    // Language toggle
    "lang.english": "English",
    "lang.swahili": "Swahili",

    // Landing page
    "landing.tagline": "Your farm. Predicted. Protected. Profitable.",
    "landing.hero": "Climate Intelligence for Every Farm",
    "landing.farmer.title": "Farmer",
    "landing.farmer.subtitle": "Get farm alerts & advice",
    "landing.coop.title": "Cooperative",
    "landing.coop.subtitle": "Manage group alerts",
    "landing.extension.title": "Extension",
    "landing.extension.subtitle": "Field work mode",
    "landing.email.label": "Stay updated",
    "landing.email.placeholder": "Your email address",
    "landing.email.submitted": "Thank you! You're on the waitlist.",
    "landing.footer": "© 2025 KaLI • Climate Intelligence for African Agriculture",

    // Farmer dashboard
    "dashboard.greeting": "Welcome, {name}",
    "dashboard.location": "{area}",
    "dashboard.location.loading": "Loading...",
    "dashboard.today": "Today's Alert",
    "dashboard.alert.weather": "WEATHER",
    "dashboard.alert.market": "MARKET",
    "dashboard.alert.accurate": "✓ Accurate",
    "dashboard.alert.inaccurate": "✗ Not Accurate",
    "dashboard.alert.hear": "🎤 Hear Explanation",
    "dashboard.weather.today": "Today",
    "dashboard.weather.snapshot": "{temp}°C, {rain}% rain",
    "dashboard.actions.plant": "What to Plant?",
    "dashboard.actions.market": "Market Prices",
    "dashboard.actions.insurance": "My Insurance",
    "dashboard.actions.help": "Get Help",

    // Simulator
    "simulator.title": "Planting Advice",
    "simulator.step1.label": "Select crop:",
    "simulator.crop.maize": "Maize",
    "simulator.crop.sorghum": "Sorghum",
    "simulator.crop.beans": "Beans",
    "simulator.crop.millet": "Millet",
    "simulator.button.check": "Check Risk",
    "simulator.button.plan": "Plan This Crop",
    "simulator.button.try": "Try Another",
    "simulator.result.better": "Better than current by {percent}%",
    "simulator.risk.high": "HIGH",
    "simulator.risk.medium": "MEDIUM",
    "simulator.risk.low": "LOW",

    // Co-op portal
    "coop.title": "Cooperative Portal",
    "coop.members": "{count} members",
    "coop.alerts": "Today's Alerts",
    "coop.actions.send": "Send Alert to All",
    "coop.actions.risk": "Check Risk Map",
    "coop.actions.reports": "Member Reports",

    // Extension kit
    "extension.title": "Extension Field Kit",
    "extension.online": "✅ Online",
    "extension.offline": "⚠️ Offline",
    "extension.actions.visit": "New Visit Report",
    "extension.actions.disease": "Disease Checker",
    "extension.actions.sync": "Sync Data",
    "extension.pending": "{count} reports waiting",
  },
  sw: {
    // Common
    "app.title": "KaLI",
    "app.tagline": "Shambani lako. Predhani. Jikinge. Faida.",
    "common.welcome": "Karibu, {name}",
    "common.loading": "Inapakia...",
    "common.error": "Kitu kikawa kimwenyeuko",
    "common.retry": "Jaribu Tena",
    "common.close": "Funga",
    "common.cancel": "Ghairi",
    "common.submit": "Tuma",
    "common.email": "Barua Pepe",
    "common.phone": "Simu",
    "common.explore": "Chunguza",
    "common.just_now": "Sasa tu",

    // Language toggle
    "lang.english": "Kiingereza",
    "lang.swahili": "Kiswahili",

    // Landing page
    "landing.tagline": "Shambani lako. Predhani. Jikinge. Faida.",
    "landing.hero": "Mahitaji Haba kwa Kila Shamba",
    "landing.farmer.title": "Mkulima",
    "landing.farmer.subtitle": "Pata onyo za shambani na ushauri",
    "landing.coop.title": "Kundi",
    "landing.coop.subtitle": "Simamia onyo za kundi",
    "landing.extension.title": "Kompyuta",
    "landing.extension.subtitle": "Mitindo ya kazi",
    "landing.email.label": "Baki kwenye orodha",
    "landing.email.placeholder": "Anwani yako ya barua pepe",
    "landing.email.submitted": "Asante! Wewe ni kwenye orodha.",
    "landing.footer": "© 2025 KaLI • Mahitaji Haba kwa Ukulima wa Kiafrika",

    // Farmer dashboard
    "dashboard.greeting": "Karibu, {name}",
    "dashboard.location": "{area}",
    "dashboard.location.loading": "Inapakia...",
    "dashboard.today": "Onyo ya Leo",
    "dashboard.alert.weather": "TABIA NCHI",
    "dashboard.alert.market": "SOKO",
    "dashboard.alert.accurate": "✓ Sahihi",
    "dashboard.alert.inaccurate": "✗ Si Sahihi",
    "dashboard.alert.hear": "🎤 Sikia Maelezo",
    "dashboard.weather.today": "Leo",
    "dashboard.weather.snapshot": "{temp}°C, {rain}% mvua",
    "dashboard.actions.plant": "Ni Nini Cha Kupanda?",
    "dashboard.actions.market": "Bei za Soko",
    "dashboard.actions.insurance": "Bima Yangu",
    "dashboard.actions.help": "Omba Msaada",

    // Simulator
    "simulator.title": "Ushauri wa Kupanda",
    "simulator.step1.label": "Chagua mbegu:",
    "simulator.crop.maize": "Mahindi",
    "simulator.crop.sorghum": "Gauni",
    "simulator.crop.beans": "Maharagwe",
    "simulator.crop.millet": "Uji",
    "simulator.button.check": "Angalia Hatari",
    "simulator.button.plan": "Pakua Mbegu hii",
    "simulator.button.try": "Jaribu Nyingine",
    "simulator.result.better": "Nzuri kutokana na sasa kwa {percent}%",
    "simulator.risk.high": "KALI",
    "simulator.risk.medium": "WASTANI",
    "simulator.risk.low": "NDOGO",

    // Co-op portal
    "coop.title": "Kituo cha Kundi",
    "coop.members": "Wanakundi {count}",
    "coop.alerts": "Onyo za Leo",
    "coop.actions.send": "Tuma Onyo kwa Wote",
    "coop.actions.risk": "Angalia Ramani ya Hatari",
    "coop.actions.reports": "Ripoti za Kundi",

    // Extension kit
    "extension.title": "Zana za Kazi ya Shambani",
    "extension.online": "✅ Mtandao",
    "extension.offline": "⚠️ Bila Mtandao",
    "extension.actions.visit": "Ripoti Mpya ya Ziarani",
    "extension.actions.disease": "Kuzuza Magonjwa",
    "extension.actions.sync": "Sambaza Data",
    "extension.pending": "Ripoti {count} inangoja",
  },
}

let currentLang = localStorage.getItem("kali:lang") || "en"

/**
 * Set active language and persist to localStorage
 */
export function setLanguage(lang) {
  if (lang === "en" || lang === "sw") {
    currentLang = lang
    localStorage.setItem("kali:lang", lang)
    window.dispatchEvent(new CustomEvent("kali:lang-changed", { detail: { lang } }))
  }
}

/**
 * Get current active language
 */
export function getLanguage() {
  return currentLang
}

/**
 * Translate a key, optionally with variable substitution
 * Variables use {varName} syntax
 * Example: t('common.welcome', { name: 'Samuel' }) -> "Welcome, Samuel"
 */
export function t(key, variables = {}) {
  let text = LOCALE_DATA[currentLang]?.[key] || LOCALE_DATA.en[key] || key

  // Replace variables: {name} -> value
  Object.entries(variables).forEach(([k, v]) => {
    text = text.replace(new RegExp(`\\{${k}\\}`, "g"), v)
  })

  return text
}

/**
 * Get all translations for current language
 */
export function getTranslations() {
  return LOCALE_DATA[currentLang] || LOCALE_DATA.en
}

/**
 * Check if a key exists in current language
 */
export function hasTranslation(key) {
  return key in (LOCALE_DATA[currentLang] || {})
}
