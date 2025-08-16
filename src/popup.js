const send = (type, payload) =>
    new Promise(res => chrome.runtime.sendMessage({ type, payload }, res));
  
  document.getElementById("use").addEventListener("click", async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab?.url) document.getElementById("url").value = tab.url;
  });
  
  document.getElementById("save").addEventListener("click", async () => {
    const key = document.getElementById("key").value.trim();
    const url = document.getElementById("url").value.trim();
    if (!key || !url) return;
    
    await send("saveShortcut", { key, url });
    
    // Show success message
    const success = document.createElement("div");
    success.className = "success-message";
    success.textContent = `✓ Shortcut "${key}" saved!`;
    document.body.appendChild(success);
    
    // Clear form
    document.getElementById("key").value = "";
    document.getElementById("url").value = "";
    
    // Close popup after brief delay
    setTimeout(() => {
      window.close();
    }, 1000);
  });
  
  document.getElementById("options").addEventListener("click", async (e) => {
    e.preventDefault();
    chrome.runtime.openOptionsPage();
  });
  