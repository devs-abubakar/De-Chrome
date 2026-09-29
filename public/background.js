async function quickSave() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
  if (!tab?.url || !/^https?:/.test(tab.url)) return // ignore chrome:// pages etc.

  // Read-modify-write on an "inbox" queue in extension storage
  const { inbox = [] } = await chrome.storage.local.get('inbox')
  inbox.push({ url: tab.url, title: tab.title || tab.url, savedAt: Date.now() })
  await chrome.storage.local.set({ inbox })

  chrome.action.setBadgeText({ text: '✓' })
  setTimeout(() => chrome.action.setBadgeText({ text: '' }), 1200)
}

chrome.commands.onCommand.addListener((cmd) => {
  if (cmd === 'quick-save') quickSave()
})
chrome.action.onClicked.addListener(quickSave) // clicking the icon also saves