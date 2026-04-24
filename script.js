// script.js
const pdfList = document.getElementById("pdf-list");
const searchInput = document.getElementById("search");

// --- Sticker Logic ---
function showRandomSticker() {
  const container = document.getElementById("sticker-container");
  if (!container) return;

  const stickers = [
    "https://openmoji.org/data/color/svg/1F4DA.svg", // Books
    "https://openmoji.org/data/color/svg/1F4A1.svg", // Idea
    "https://openmoji.org/data/color/svg/1F393.svg", // Cap
    "https://openmoji.org/data/color/svg/1F4DD.svg", // Memo
    "https://openmoji.org/data/color/svg/270F.svg", // Pencil
  ];

  const randomImg = stickers[Math.floor(Math.random() * stickers.length)];
  const imgEl = document.createElement("img");
  imgEl.src = randomImg;
  imgEl.alt = "Study Sticker";

  // Clear container first in case of re-renders
  container.innerHTML = "";
  container.appendChild(imgEl);
}

// --- PDF Loading Logic ---
async function loadpdfs() {
  try {
    const response = await fetch("/assets/manifest.json");
    if (!response.ok) throw new Error("manifest not found");
    const files = await response.json();

    const groups = {};
    files.forEach((file) => {
      const filename = file.split("/").pop();
      const subjectPart = filename.split("_")[0];
      const subject =
        subjectPart.charAt(0).toUpperCase() +
        subjectPart.slice(1).toLowerCase();

      if (!groups[subject]) groups[subject] = [];
      groups[subject].push(file);
    });

    const sortedSubjects = Object.keys(groups).sort((a, b) =>
      a.localeCompare(b),
    );
    rendergroups(sortedSubjects, groups);

    searchInput.addEventListener("input", () => {
      const term = searchInput.value.toLowerCase();
      const filteredGroups = {};

      files.forEach((file) => {
        const filename = file.split("/").pop();
        const normalizedFile = filename.toLowerCase().replace(/_/g, " ");

        if (normalizedFile.includes(term)) {
          const subjectPart = filename.split("_")[0];
          const subject =
            subjectPart.charAt(0).toUpperCase() +
            subjectPart.slice(1).toLowerCase();

          if (!filteredGroups[subject]) filteredGroups[subject] = [];
          filteredGroups[subject].push(file);
        }
      });

      const sorted = Object.keys(filteredGroups).sort((a, b) =>
        a.localeCompare(b),
      );
      rendergroups(sorted, filteredGroups);
    });
  } catch (err) {
    pdfList.innerHTML = '<div class="no-results">Error loading PDFs.</div>';
    console.error(err);
  }
}

function rendergroups(subjects, groups) {
  if (subjects.length === 0) {
    pdfList.innerHTML =
      '<div class="no-results">No PDFs found matching your search.</div>';
    return;
  }

  pdfList.innerHTML = subjects
    .map((subject) => {
      const items = groups[subject]
        .map((file) => {
          const filename = file.split("/").pop();
          const cleanName = filename
            .replace(/.pdf$/i, "")
            .replace(/_/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase());

          return `
          <a href="/assets/${file}" class="pdf-item" target="_blank" rel="noopener">
            <span class="pdf-icon">📄</span>
            <span class="pdf-text">${cleanName}</span>
          </a>
      `;
        })
        .join("");

      return `
      <div class="category-group">
        <div class="category-title">${subject}</div>
        <div class="pdf-grid">${items}</div>
      </div>
    `;
    })
    .join("");
}

// Run functions
loadpdfs();
showRandomSticker();
