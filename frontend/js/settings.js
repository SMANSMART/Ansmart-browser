// ================================
// ANSMART BROWSER SETTINGS JS
// ================================

// DOM Elements (assumes these IDs exist in settings.html)
const homepageInput = document.getElementById("homepageInput");
const saveHomepageBtn = document.getElementById("saveHomepageBtn");

const clearHistoryBtn = document.getElementById("clearHistoryBtn");
const clearBookmarksBtn = document.getElementById("clearBookmarksBtn");
const resetPrefsBtn = document.getElementById("resetPrefsBtn");

const themeSelect = document.getElementById("themeSelect");

// ================================
// LOCAL STORAGE KEYS
// ================================
const HISTORY_KEY = "ansmartHistory";
const BOOKMARKS_KEY = "ansmartBookmarks";
const PREFS_KEY = "ansmartPreferences";

// ================================
// LOAD SETTINGS ON STARTUP
// ================================
function loadSettings() {
    const prefs = JSON.parse(localStorage.getItem(PREFS_KEY)) || {};
    
    // Load homepage
    homepageInput.value = prefs.homepage || "https://www.google.com";

    // Load theme
    if (prefs.theme) {
        document.body.classList.remove("dark", "light");
        document.body.classList.add(prefs.theme);
        if(themeSelect) themeSelect.value = prefs.theme;
    } else {
        document.body.classList.add("light");
    }
}

// ================================
// SAVE HOMEPAGE
// ================================
function saveHomepage() {
    let homepage = homepageInput.value.trim();
    if (!homepage.startsWith("http")) homepage = "https://" + homepage;

    const prefs = JSON.parse(localStorage.getItem(PREFS_KEY)) || {};
    prefs.homepage = homepage;
    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));

    alert("Homepage saved: " + homepage);
}

// ================================
// THEME SELECT
// ================================
function changeTheme() {
    const theme = themeSelect.value;
    document.body.classList.remove("light", "dark");
    document.body.classList.add(theme);

    const prefs = JSON.parse(localStorage.getItem(PREFS_KEY)) || {};
    prefs.theme = theme;
    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
}

// ================================
// CLEAR HISTORY
// ================================
function clearHistory() {
    if (confirm("Are you sure you want to clear your browsing history?")) {
        localStorage.removeItem(HISTORY_KEY);
        alert("History cleared.");
    }
}

// ================================
// CLEAR BOOKMARKS
// ================================
function clearBookmarks() {
    if (confirm("Are you sure you want to clear your bookmarks?")) {
        localStorage.removeItem(BOOKMARKS_KEY);
        alert("Bookmarks cleared.");
    }
}

// ================================
// RESET ALL PREFERENCES
// ================================
function resetPreferences() {
    if (confirm("Reset all settings to default?")) {
        localStorage.removeItem(PREFS_KEY);
        localStorage.removeItem(HISTORY_KEY);
        localStorage.removeItem(BOOKMARKS_KEY);
        location.reload();
    }
}

// ================================
// EVENT LISTENERS
// ================================
if (saveHomepageBtn) saveHomepageBtn.addEventListener("click", saveHomepage);
if (clearHistoryBtn) clearHistoryBtn.addEventListener("click", clearHistory);
if (clearBookmarksBtn) clearBookmarksBtn.addEventListener("click", clearBookmarks);
if (resetPrefsBtn) resetPrefsBtn.addEventListener("click", resetPreferences);
if (themeSelect) themeSelect.addEventListener("change", changeTheme);

// Initialize
loadSettings();
