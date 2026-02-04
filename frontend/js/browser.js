// ================================
// ANSMART BROWSER JS
// ================================

// Get DOM elements
const frame = document.getElementById("browserFrame");
const addressBar = document.getElementById("addressBar");
const backBtn = document.getElementById("backBtn");
const forwardBtn = document.getElementById("forwardBtn");
const reloadBtn = document.getElementById("reloadBtn");
const homeBtn = document.getElementById("homeBtn");
const goBtn = document.getElementById("goBtn");
const themeToggleBtn = document.getElementById("themeToggle");

// ================================
// LOCAL STORAGE KEYS
// ================================
const HISTORY_KEY = "ansmartHistory";
const BOOKMARKS_KEY = "ansmartBookmarks";

// ================================
// UTILITY FUNCTIONS
// ================================
function saveHistory(url) {
  let history = JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
  history.unshift({ url: url, time: new Date().toISOString() });
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

function saveBookmark(url) {
  let bookmarks = JSON.parse(localStorage.getItem(BOOKMARKS_KEY)) || [];
  if (!bookmarks.includes(url)) {
    bookmarks.push(url);
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
    alert("Bookmark saved!");
  } else {
    alert("Bookmark already exists!");
  }
}

// ================================
// BROWSER FUNCTIONS
// ================================

function loadPage() {
  let url = addressBar.value.trim();

  // If user entered URL without http/https, treat as Google search
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = "https://www.google.com/search?q=" + encodeURIComponent(url);
  }

  frame.src = url;
  saveHistory(url);
}

// Load Google homepage by default
function goHome() {
  const homeURL = "https://www.google.com";
  frame.src = homeURL;
  addressBar.value = "";
  saveHistory(homeURL);
}

// Reload page
function reloadPage() {
  frame.contentWindow.location.reload();
}

// Navigate back
function goBack() {
  try {
    frame.contentWindow.history.back();
  } catch (e) {
    console.warn("Cannot go back");
  }
}

// Navigate forward
function goForward() {
  try {
    frame.contentWindow.history.forward();
  } catch (e) {
    console.warn("Cannot go forward");
  }
}

// ================================
// THEME TOGGLE
// ================================
function toggleTheme() {
  document.body.classList.toggle("dark");
  let theme = document.body.classList.contains("dark") ? "dark" : "light";
  localStorage.setItem("ansmartTheme", theme);

  // Optionally, switch separate CSS file
  const themeLink = document.getElementById("themeLink");
  if (themeLink) {
    themeLink.href = theme === "dark" ? "css/dark.css" : "css/light.css";
  }
}

// Load saved theme on startup
function loadTheme() {
  const savedTheme = localStorage.getItem("ansmartTheme") || "light";
  if (savedTheme === "dark") document.body.classList.add("dark");
}

// ================================
// EVENT LISTENERS
// ================================
goBtn.addEventListener("click", loadPage);
addressBar.addEventListener("keydown", (e) => {
  if (e.key === "Enter") loadPage();
});

backBtn.addEventListener("click", goBack);
forwardBtn.addEventListener("click", goForward);
reloadBtn.addEventListener("click", reloadPage);
homeBtn.addEventListener("click", goHome);
themeToggleBtn.addEventListener("click", toggleTheme);

// Initialize
loadTheme();
goHome();
