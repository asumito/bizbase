// script.js
const pdfList = document.getElementById('pdf-list');
const searchInput = document.getElementById('search');

async function loadpdfs() {
  try {
    const response = await fetch('/assets/manifest.json');
    if (!response.ok) throw new Error('manifest not found');
    const files = await response.json();

    const groups = {};
    files.forEach(file => {
      const filename = file.split('/').pop();
      const subjectPart = filename.split('_')[0];
      const subject = subjectPart.charAt(0).toUpperCase() + subjectPart.slice(1); // e.g. AGRI → Agri

      if (!groups[subject]) groups[subject] = [];
      groups[subject].push(file);
    });

    const sortedSubjects = Object.keys(groups).sort((a, b) => a.localeCompare(b));
    rendergroups(sortedSubjects, groups);

    searchInput.addEventListener('input', () => {
      const term = searchInput.value.toLowerCase();
      const filteredGroups = {};

      files.forEach(file => {
        if (file.toLowerCase().includes(term)) {
          const filename = file.split('/').pop();
          const subjectPart = filename.split('_')[0];
          const subject = subjectPart.charAt(0).toUpperCase() + subjectPart.slice(1);

          if (!filteredGroups[subject]) filteredGroups[subject] = [];
          filteredGroups[subject].push(file);
        }
      });

      const sorted = Object.keys(filteredGroups).sort((a, b) => a.localeCompare(b));
      rendergroups(sorted, filteredGroups);
    });

  } catch (err) {
    pdfList.innerHTML = '<li class="no-results">Error loading PDFs.</li>';
    console.error(err);
  }
}

function rendergroups(subjects, groups) {
  if (subjects.length === 0) {
    pdfList.innerHTML = '<li class="no-results">No PDFs found matching your search.</li>';
    return;
  }

  pdfList.innerHTML = subjects.map(subject => {
    const items = groups[subject].map(file => {
      const filename = file.split('/').pop();
      const cleanName = filename
        .replace(/.pdf$/i, '')
        .replace(/_/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());

      return `
        <li>
          <a href="/assets/${file}" target="_blank" rel="noopener">
            📄 ${cleanName}
          </a>
        </li>
      `;
    }).join('');

    return `
      <li class="subject-group">
        <h3>${subject}</h3>
        <ul>${items}</ul>
      </li>
    `;
  }).join('');
}

loadpdfs();