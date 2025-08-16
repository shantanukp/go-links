const send = (type, payload) =>
    new Promise(res => chrome.runtime.sendMessage({ type, payload }, res));
  
  function renderList(shortcuts) {
    const list = document.getElementById("list");
    list.innerHTML = "";
    const keys = Object.keys(shortcuts).sort();
    
    if (keys.length === 0) {
      list.innerHTML = '<div class="empty-state">No shortcuts yet. Create your first one above!</div>';
      return;
    }
    
    keys.forEach(key => {
      const div = document.createElement("div");
      div.className = "shortcut-item";
      div.innerHTML = `
        <span class="shortcut-key">${key}</span>
        <span class="shortcut-url">${shortcuts[key]}</span>
        <div class="shortcut-actions">
          <button data-key="${key}" class="btn-danger del">Delete</button>
        </div>
      `;
      
      // Make the entire row clickable to open the URL in a new tab
      div.style.cursor = "pointer";
      div.addEventListener("click", (e) => {
        // Don't open if clicking on the delete button or its children
        if (!e.target.closest(".shortcut-actions")) {
          window.open(shortcuts[key], "_blank");
        }
      });
      
      list.appendChild(div);
    });
  
    list.querySelectorAll(".del").forEach(btn => {
      btn.addEventListener("click", async e => {
        e.stopPropagation(); // Prevent the row click from firing
        const key = e.target.getAttribute("data-key");
        await send("deleteShortcut", { key });
        load();
      });
    });
  }
  
  async function load() {
    const shortcuts = await send("getShortcuts");
    renderList(shortcuts);
  }
  
  document.getElementById("add").addEventListener("click", async () => {
    const key = document.getElementById("key").value.trim();
    const url = document.getElementById("url").value.trim();
    if (!key || !url) return;
  
    await send("saveShortcut", { key, url });
    document.getElementById("key").value = "";
    document.getElementById("url").value = "";
    load();
  });
  
  document.getElementById("export").addEventListener("click", async () => {
    const map = await send("exportShortcuts");
    document.getElementById("json").value = JSON.stringify(map, null, 2);
  });
  
  document.getElementById("import").addEventListener("click", async () => {
    try {
      const map = JSON.parse(document.getElementById("json").value || "{}");
      await send("importShortcuts", { map });
      load();
    } catch (e) {
      alert("Invalid JSON");
    }
  });
  
  load();
  