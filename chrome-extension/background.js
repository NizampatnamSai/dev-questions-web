// Registers the right-click "Save selection to DevQuiz Notes" context menu
// item. Clicking it stores the selection + page info + timestamp locally
// (chrome.storage, isolated from any website's own storage) and badges the
// toolbar icon — the user then opens the extension popup to pick an
// importance level and confirm the save. Chrome doesn't allow a background
// script to force-open the popup, so this two-step flow is the reliable way.

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "save-to-devquiz-notes",
    title: 'Save "%s" to DevQuiz Notes',
    contexts: ["selection"],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId !== "save-to-devquiz-notes" || !info.selectionText) return;

  chrome.storage.local.set({
    pendingClip: {
      text: info.selectionText,
      url: tab?.url || "",
      title: tab?.title || "",
      timestamp: new Date().toISOString(),
    },
  });

  chrome.action.setBadgeText({ text: "1" });
  chrome.action.setBadgeBackgroundColor({ color: "#6366F1" });
});
