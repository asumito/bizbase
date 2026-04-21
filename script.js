// script.js - Updated for modern button styling
const pdfList = document.getElementById("pdf-list");
const searchInput = document.getElementById("search");

async function loadpdfs() {
  try {
    const response = await fetch("/assets/manifest.json");
    if (!response.ok) throw new Error("manifest not found");
    const files = await response.json();

    const groups = {};
    files.forEach((file) => {
      const filename = file.split("/").pop();
      const subjectPart = filename.split("_")[0];
      // Formatting Subject Title (e.g., "accounting" -> "Accounting")
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
    pdfList.innerHTML =
      '<div class="no-results">Error loading PDFs. Please try again later.</div>';
    console.error(err);
  }
}

function rendergroups(subjects, groups) {
  if (subjects.length === 0) {
    pdfList.innerHTML =
      '<div class="no-results">No PDFs found matching your search.</div>';
    return;
  }

  // Map through subjects and create the grid structure
  pdfList.innerHTML = subjects
    .map((subject) => {
      const items = groups[subject]
        .map((file) => {
          const filename = file.split("/").pop();
          // Clean up filename: remove .pdf, replace underscores with spaces, capitalize
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

loadpdfs();
