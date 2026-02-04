// ================================
// ANSMART BROWSER TABS JS
// ================================

// DOM Elements
const tabsContainer = document.createElement("div");
tabsContainer.id = "tabsContainer";
tabsContainer.style.display = "flex";
tabsContainer.style.gap = "5px";
tabsContainer.style.padding = "5px";
tabsContainer.style.background = "#f1f1f1";
tabsContainer.style.overflowX = "auto";
tabsContainer.style.borderBottom = "1px solid #ccc";

// Insert tabs container above iframe
const main = document.querySelector("main");
main.parentNode.insertBefore(tabsContainer, main);

// Store tabs
let tabs = []; // each tab = {id, url, title}
let activeTabId = null;

// Helper to generate unique ID
function generateTabId() {
  return "tab_" + Date.now() + "_" + Math.floor(Math.random() * 1000);
}

// ================================
// CREATE NEW TAB
// ================================
function createTab(url = "https://www.google.com") {
  const id = generateTabId();
  tabs.push({ id, url, title: getShortName(url) });
  activeTabId = id;
  renderTabs();
  openTab(id);
}

// ================================
// RENDER TABS
// ================================
function renderTabs() {
  tabsContainer.innerHTML = "";

  tabs.forEach((tab) => {
    const tabBtn = document.createElement("button");
    tabBtn.innerText = tab.title;
    tabBtn.style.padding = "5px 10px";
    tabBtn.style.border = "1px solid #ccc";
    tabBtn.style.borderRadius = "5px 5px 0 0";
    tabBtn.style.background = tab.id === activeTabId ? "#4285f4" : "#ddd";
    tabBtn.style.color = tab.id === activeTabId ? "#fff" : "#000";
    tabBtn.style.cursor = "pointer";
    tabBtn.style.display = "flex";
    tabBtn.style.alignItems = "center";
    tabBtn.style.gap = "5px";

    // Click to switch tab
    tabBtn.addEventListener("click", () => {
      activeTabId = tab.id;
      openTab(tab.id);
      renderTabs();
    });

    // Close tab button
    const closeBtn = document.createElement("span");
    closeBtn.innerText = "✖";
    closeBtn.style.marginLeft = "5px";
    closeBtn.style.cursor = "pointer";
    closeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      closeTab(tab.id);
    });

    tabBtn.appendChild(closeBtn);
    tabsContainer.appendChild(tabBtn);
  });

  // Add "+" button for new tab
  const newTabBtn = document.createElement("button");
  newTabBtn.innerText = "+";
  newTabBtn.style.padding = "5px 10px";
  newTabBtn.style.border = "1px solid #ccc";
  newTabBtn.style.borderRadius = "5px";
  newTabBtn.style.background = "#4caf50";
  newTabBtn.style.color = "#fff";
  newTabBtn.style.cursor = "pointer";
  newTabBtn.addEventListener("click", () => createTab());

  tabsContainer.appendChild(newTabBtn);
}

// ================================
// OPEN TAB
// ================================
function openTab(id) {
  const tab = tabs.find((t) => t.id === id);
  if (!tab) return;

  // Update iframe URL
  const frame = document.getElementById("browserFrame");
  frame.src = tab.url;

  // Update address bar
  const addressBar = document.getElementById("addressBar");
  addressBar.value = tab.url;

  activeTabId = id;
}

// ================================
// CLOSE TAB
// ================================
function closeTab(id) {
  tabs = tabs.filter((t) => t.id !== id);
  if (tabs.length === 0) {
    createTab(); // always have at least one tab
  } else if (activeTabId === id) {
    openTab(tabs[tabs.length - 1].id); // switch to last tab
  }
  renderTabs();
}

// ================================
// UPDATE CURRENT TAB URL
// ================================
function updateActiveTabURL(url) {
  const tab = tabs.find((t) => t.id === activeTabId);
  if (tab) {
    tab.url = url;
    tab.title = getShortName(url);
    renderTabs();
  }
}

// Listen to iframe load to update tab URL and history
const frame = document.getElementById("browserFrame");
frame.addEventListener("load", () => {
  const url = frame.src;
  updateActiveTabURL(url);

  // Save to history (reuse storage.js function)
  if (typeof saveVisited === "function") saveVisited(url);
});

// ================================
// HELPER: GET SHORT NAME FOR TAB
// ================================
function getShortName(url) {
  let shortUrl = url.replace(/^https?:\/\//, "");
  if (shortUrl.length > 15) shortUrl = shortUrl.substring(0, 12) + "...";
  return shortUrl;
}

// ================================
// INITIALIZE WITH ONE TAB
// ================================
createTab();
