// Storage shape:
// { shortcuts: { "design": "https://figma.com/file/...", "roadmap": "https://..." } }

const STORAGE_KEY = "shortcuts";

async function getShortcuts() {
  const data = await chrome.storage.sync.get(STORAGE_KEY);
  return data[STORAGE_KEY] || {};
}

async function setShortcuts(shortcuts) {
  await chrome.storage.sync.set({ [STORAGE_KEY]: shortcuts });
}

function ensureUrl(url) {
  // If user saved "docs.google.com/..." normalize to "https://docs.google.com/..."
  if (!/^https?:\/\//i.test(url)) return "https://" + url;
  return url;
}

// Omnibox: provide suggestions as the user types after "go "
chrome.omnibox.onInputChanged.addListener(async (text, suggest) => {
  const q = text.trim().toLowerCase();
  const shortcuts = await getShortcuts();
  const entries = Object.entries(shortcuts);

  const matches = q
    ? entries.filter(([k]) => k.toLowerCase().includes(q))
    : entries.slice(0, 5);

  suggest(
    matches.slice(0, 8).map(([key, url]) => ({
      content: key,                         // what gets passed to onInputEntered
      description: `${key} — ${url}`
    }))
  );
});

// When user hits Enter after typing something
chrome.omnibox.onInputEntered.addListener(async (input, disposition) => {
  const shortcuts = await getShortcuts();
  const raw = input.trim();

  // Support "key extra/path?x=y" → append to base if it's a URL
  // Example: key="docs" -> https://docs.google.com, input="docs /spreadsheet" → https://docs.google.com/spreadsheet
  // If no key is found, treat input as a full URL or search.
  let target;

  const [maybeKey, ...rest] = raw.split(/\s+/);
  const base = shortcuts[maybeKey];

  if (base) {
    const suffix = rest.join(" ").trim();
    if (suffix) {
      // if user wrote "/foo", just append; otherwise add a space
      if (suffix.startsWith("/")) {
        target = ensureUrl(base.replace(/\/+$/, "") + suffix);
      } else {
        target = ensureUrl(base) + " " + suffix; // allow passing search terms to sites that handle them
      }
    } else {
      target = ensureUrl(base);
    }
  } else {
    // Not a known key. If it looks like a URL, go there; else open options page.
    if (/^[\w.-]+\.[a-z]{2,}($|\/|\?)/i.test(raw)) {
      target = ensureUrl(raw);
    } else {
      target = chrome.runtime.getURL("pages/options.html");
    }
  }

  // Open according to disposition (current/new tab/window)
  const open = async () => {
    if (disposition === "currentTab") {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab?.id) await chrome.tabs.update(tab.id, { url: target });
      else await chrome.tabs.create({ url: target });
    } else if (disposition === "newForegroundTab") {
      await chrome.tabs.create({ url: target, active: true });
    } else {
      await chrome.tabs.create({ url: target, active: false });
    }
  };

  try {
    await open();
  } catch (e) {
    console.error(e);
  }
});

// Expose helper methods for popup/options via chrome.runtime
chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  (async () => {
    if (msg?.type === "getShortcuts") {
      sendResponse(await getShortcuts());
    } else if (msg?.type === "saveShortcut") {
      const { key, url } = msg.payload;
      const shortcuts = await getShortcuts();
      shortcuts[key.trim()] = url.trim();
      await setShortcuts(shortcuts);
      sendResponse({ ok: true });
    } else if (msg?.type === "deleteShortcut") {
      const { key } = msg.payload;
      const shortcuts = await getShortcuts();
      delete shortcuts[key];
      await setShortcuts(shortcuts);
      sendResponse({ ok: true });
    } else if (msg?.type === "importShortcuts") {
      const { map } = msg.payload; // { key: url, ... }
      const shortcuts = await getShortcuts();
      await setShortcuts({ ...shortcuts, ...map });
      sendResponse({ ok: true });
    } else if (msg?.type === "exportShortcuts") {
      sendResponse(await getShortcuts());
    }
  })();
  // Keep the message channel open for async response
  return true;
});
