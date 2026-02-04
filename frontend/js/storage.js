// ================================
// ANSMART BROWSER STORAGE JS
// ================================

// DOM Elements
const addressBar = document.getElementById("addressBar");
const browserFrame = document.getElementById("browserFrame");

// We'll assume you add these elements in index.html
const addBookmarkBtn = document.createElement("button");
addBookmarkBtn.innerText = "+";
addBookmarkBtn.title = "Add current page to bookmarks";
addBookmarkBtn.id = "addBookmarkBtn";
addBookmarkBtn.style.marginLeft = "5px";
addBookmarkBtn.style.padding = "5px 8px";
addBookmarkBtn.style.cursor = "pointer";
addressBar.parentNode.insertBefore(addBookmarkBtn, addressBar.nextSibling);

// Container for showing all visited sites
const visitedContainer = document.createElement("div");
visitedContainer.id = "visitedContainer";
visitedContainer.style.display = "grid";
visitedContainer.style.gridTemplateColumns = "repeat(auto-fill, minmax(120px, 1fr))";
visitedContainer.style.gap = "10px";
visitedContainer.style.padding = "10px";
visitedContainer.style.marginTop = "5px";
visitedContainer.style.maxHeight = "150px";
visitedContainer.style.overflowY = "auto";
visitedContainer.style.border = "1px solid #ccc";
addressBar.parentNode.appendChild(visitedContainer);

// ================================
// LOCAL STORAGE KEYS
// ================================
const HISTORY_KEY = "ansmartHistory";
const BOOKMARKS_KEY = "ansmartBookmarks";

// ================================
// SAVE VISITED URL
// ================================
function saveVisited(url) {
  if (!url) return;
  let history = JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];

  // Avoid duplicates
  if (!history.includes(url)) {
    history.unshift(url); // newest first
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }

  renderVisitedSites();
}

// ================================
// SAVE BOOKMARK
// ================================
function saveBookmark(url) {
  if (!url) return;
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
// RENDER VISITED SITES
// ================================
function renderVisitedSites() {
  let history = JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
  visitedContainer.innerHTML = ""; // clear previous

  // Add counter element at the start
  if (history.length > 0) {
    const counter = document.createElement("button");
    counter.innerText = `All Sites Visited (${history.length})`;
    counter.style.gridColumn = "span 2";
    counter.style.padding = "5px";
    counter.style.cursor = "pointer";
    counter.style.background = "#4285f4";
    counter.style.color = "white";
    counter.style.border = "none";
    counter.style.borderRadius = "5px";
    counter.addEventListener("click", () => {
      history.forEach((url) => openURL(url));
    });
    visitedContainer.appendChild(counter);
  }

  // Add each site in grid
  history.forEach((url) => {
    const siteBtn = document.createElement("button");
    siteBtn.innerText = getShortName(url);
    siteBtn.title = url;
    siteBtn.style.padding = "5px";
    siteBtn.style.cursor = "pointer";
    siteBtn.style.borderRadius = "5px";
    siteBtn.style.border = "1px solid #ccc";
    siteBtn.style.background = "#f5f5f5";
    siteBtn.addEventListener("click", () => openURL(url));
    visitedContainer.appendChild(siteBtn);
  });
}

// ================================
// OPEN URL IN IFRAME
// ================================
function openURL(url) {
  if (!url.startsWith("http")) {
    url = "https://www.google.com/search?q=" + encodeURIComponent(url);
  }
  browserFrame.src = url;
  addressBar.value = url;
}

// ================================
// HELPER: GET SHORT NAME FOR BUTTON
// ================================
function getShortName(url) {
  let shortUrl = url.replace(/^https?:\/\//, "");
  if (shortUrl.length > 20) shortUrl = shortUrl.substring(0, 17) + "...";
  return shortUrl;
}

// ================================
// EVENT LISTENERS
// ================================

// Add current page to bookmarks
addBookmarkBtn.addEventListener("click", () => {
  saveBookmark(browserFrame.src);
});

// When iframe changes, save history automatically
browserFrame.addEventListener("load", () => {
  saveVisited(browserFrame.src);
});

// Initial render
renderVisitedSites();
