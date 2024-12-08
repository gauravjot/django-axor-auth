// Copy code block buttons
const btns = document.querySelectorAll("button.markdown-it-code-copy");
const clipboard = new ClipboardJS(btns);

clipboard.on("success", function (e) {
  let innerHTML = e.trigger.innerHTML;
  e.trigger.innerHTML = "Copied!";
  setTimeout(() => {
    e.trigger.innerHTML = innerHTML;
  }, 3000);
});

// Sidebar toggle
// Topbar toggler
const sidebar_toggler_topbar = document.getElementById('sidebar-toggler');
// Togglers inside the sidebar
const sidebar_toggler_sbot = document.getElementById("sidebar-toggle");
const sidebar_toggler_sbot_closed = document.getElementById("sidebar-toggle-closed");
// Sidebar and content
const sidebar_pane = document.getElementById("sidebar");
const content_pane = document.getElementById("content");
// Check if the screen is mobile
function isMobile() { return window.matchMedia("only screen and (max-width: 1023px)").matches; }

function toggleSidebar() {
  if (sidebar_pane?.dataset.hidden === "true") {
    showSidebar();
  } else {
    hideSidebar();
  }
}
function showSidebar() {
  if (!sidebar_pane) return;
  if (isMobile()) {
    sidebar_pane.dataset.hidden = "false";
    content_pane?.classList.remove("sidebar-open");
  } else {
    sidebar_pane.dataset.hidden = "false";
    content_pane?.classList.add("sidebar-open");
    content_pane?.classList.remove("ml-16");
  }
}
function hideSidebar() {
  if (window.matchMedia("only screen and (min-width: 1536px)").matches) {
    return; // dont hide sidebar on large screens
  }
  if (!sidebar_pane) return;
  if (isMobile()) {
    sidebar_pane.dataset.hidden = "true";
    content_pane?.classList.remove("sidebar-open");
  } else {
    sidebar_pane.dataset.hidden = "true";
    content_pane?.classList.remove("sidebar-open");
    content_pane?.classList.add("ml-16");
  }
}

// Initial setup
if (isMobile()) {
  hideSidebar();
}
// Show/hide sidebar on resize
window.addEventListener("resize", () => {
  if (isMobile()) {
    hideSidebar();
  } else {
    showSidebar();
  }
});

// Add event listeners
sidebar_toggler_topbar?.addEventListener("click", toggleSidebar);
sidebar_toggler_sbot?.addEventListener("click", hideSidebar);
sidebar_toggler_sbot_closed?.addEventListener("click", showSidebar);