document.addEventListener("DOMContentLoaded", () => {
  // Load saved theme
  chrome.storage.local.get(["theme"], function (result) {
    if (result.theme === "dark") {
      document.body.classList.add("dark-mode");
    }
  });

  chrome.storage.local.get(["researchNotes"], function (result) {
    if (result.researchNotes) {
      document.getElementById("notes").value = result.researchNotes;
    }
  });

  document
    .getElementById("summarizeBtn")
    .addEventListener("click", summarizeText);
  document.getElementById("saveNotesBtn").addEventListener("click", saveNotes);
  document
    .getElementById("toggleThemeBtn")
    .addEventListener("click", toggleTheme);
});

async function summarizeText() {
  try {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    const [{ result }] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: () => window.getSelection().toString(),
    });

    if (!result) {
      showResults("Please select some text first");
      return;
    }

    const response = await fetch("http://localhost:8080/api/research/process", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: result, operation: "summarize" }),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const text = await response.text();
    showResults(text.replace(/\n/g, "<br>"));
  } catch (error) {
    showResults("Error: " + error.message);
  }
}

async function saveNotes() {
  const notes = document.getElementById("notes").value;
  chrome.storage.local.set({ researchNotes: notes }, function () {
    alert("Notes saved successfully");
  });
}

function showResults(content) {
  document.getElementById(
    "results"
  ).innerHTML = `<div class="result-item"><div class="result-content">${content}</div></div>`;
}

// Toggle Dark/Light Mode
function toggleTheme() {
  document.body.classList.toggle("dark-mode");

  const isDarkMode = document.body.classList.contains("dark-mode");
  chrome.storage.local.set({ theme: isDarkMode ? "dark" : "light" });
}

// document.addEventListener("DOMContentLoaded", () => {
//   chrome.storage.local.get(["researchNotes"], function (result) {
//     if (result.researchNotes) {
//       document.getElementById("notes").value = result.researchNotes;
//     }
//   });

//   document
//     .getElementById("summarizeBtn")
//     .addEventListener("click", summarizeText);
//   document.getElementById("saveNotesBtn").addEventListener("click", saveNotes);
// });

// async function summarizeText() {
//   try {
//     const [tab] = await chrome.tabs.query({
//       active: true,
//       currentWindow: true,
//     });
//     const [{ result }] = await chrome.scripting.executeScript({
//       target: { tabId: tab.id },
//       function: () => window.getSelection().toString(),
//     });

//     if (!result) {
//       showResults("Please select some text first");
//       return;
//     }

//     const response = await fetch("http://localhost:8080/api/research/process", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ content: result, operation: "summarize" }),
//     });

//     if (!response.ok) {
//       throw new Error(`API Error: ${response.status}`);
//     }

//     const text = await response.text();
//     showResults(text.replace(/\n/g, "<br>"));
//   } catch (error) {
//     showResults("Error: " + error.message);
//   }
// }

// async function saveNotes() {
//   const notes = document.getElementById("notes").value;
//   chrome.storage.local.set({ researchNotes: notes }, function () {
//     alert("Notes saved successfully");
//   });
// }

// function showResults(content) {
//   document.getElementById(
//     "results"
//   ).innerHTML = `<div class="result-item"><div class="result-content">${content}</div></div>`;
// }
