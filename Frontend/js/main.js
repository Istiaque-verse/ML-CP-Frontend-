const API_URL = "http://localhost:8080/api";

// Fetch and filter problems based on input
async function fetchProblems() {
  const topicInput = document.getElementById("topicInput").value.trim().toLowerCase();
  const difficulty = document.getElementById("difficultySelect").value;
  const logic = document.getElementById("logicSelect").value;

  const query = new URLSearchParams({
    topics: topicInput,
    difficulty,
    logic
  }).toString();

  const url = `${API_URL}/problems/filter?${query}`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Server error: ${res.status}`);
    const problems = await res.json();
    displayProblems(problems, topicInput, logic, difficulty);
  } catch (error) {
    console.error("Error fetching problems:", error);
    document.getElementById("problemList").innerHTML = `<div class="alert alert-danger">Failed to load problems.</div>`;
  }
}

// Display problems in Bootstrap cards
function displayProblems(problems, topicInput, logic, difficulty) {
  const container = document.getElementById("problemList");
  container.innerHTML = "";

  const inputTags = topicInput.split(',').map(tag => tag.trim()).filter(Boolean);

  // Optional: frontend filter backup (if backend filtering is not available)
  const filteredProblems = problems.filter(p => {
    const problemTags = p.topics.map(t => t.name.toLowerCase());
    const difficultyMatch = !difficulty || p.difficulty == difficulty;

    if (inputTags.length === 0) return difficultyMatch;

    const tagMatch =
      logic === 'AND'
        ? inputTags.every(tag => problemTags.includes(tag))
        : inputTags.some(tag => problemTags.includes(tag));

    return tagMatch && difficultyMatch;
  });

  if (filteredProblems.length === 0) {
    container.innerHTML = `<div class="alert alert-info">No problems found.</div>`;
    return;
  }

  filteredProblems.forEach(p => {
    container.innerHTML += `
      <div class="card mb-3 shadow-sm border-0">
        <div class="card-body">
          <h5 class="card-title">
            <a href="${p.url || '#'}" target="_blank" class="text-decoration-none text-primary">
              <i class="fas fa-link me-1"></i>${p.title}
            </a>
          </h5>
          <p class="card-text mb-1">
            <strong>Difficulty:</strong> ${p.difficulty}
          </p>
          <p class="card-text mb-2">
            <strong>Topics:</strong> ${p.topics.map(t => `<span class="badge bg-warning text-dark me-1">${t.name}</span>`).join('')}
          </p>
          <button class="btn btn-sm btn-outline-success" onclick="markSolved('${p.id}')">
            <i class="fas fa-check-circle me-1"></i>Mark as Solved
          </button>
        </div>
      </div>
    `;
  });
}

// Placeholder mark as solved (UI only for now)
function markSolved(id) {
  alert(`✅ Problem ${id} marked as solved (UI only).`);
}
