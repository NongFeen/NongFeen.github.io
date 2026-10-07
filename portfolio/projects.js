// ─── Your projects ────────────────────────────────────────────────────────────
// Add one { ... } block per project. Paths are relative to the portfolio folder.
//   summary         → put \n where you want a new line.
//   featured: true  → also shown on the main page (the first 4 featured ones).
//   page            → the project's own page in projects/ (copy an existing one).
const PROJECTS = [
  {
    title: "Veloryx Overload",
    summary:
      "2D Multiplayer RPG top-down with Unity. Controller supported.\nSemifinalist in the Central Region of the 2026 National Software Contest (NSC), Thailand",
    cover: "images/veloryx/Main-menu.png",
    page: "projects/veloryx-overload.html",
    featured: true,
  },
  {
    title: "Sample project 1",
    summary: "Placeholder project. Replace me in projects.js.",
    cover: "images/example.svg",
    page: "projects/sample-project.html",
    featured: true,
  },
  {
    title: "Sample project 2",
    summary: "Placeholder project. Replace me in projects.js.",
    cover: "images/example-2.svg",
    page: "projects/sample-project.html",
    featured: true,
  },
  {
    title: "Sample project 3",
    summary: "Placeholder project. Replace me in projects.js.",
    cover: "images/example.svg",
    page: "projects/sample-project.html",
    featured: true,
  },
  {
    title: "Sample project 4",
    summary:
      "Only on the All projects page: the main page shows the first 4 featured.",
    cover: "images/example-2.svg",
    page: "projects/sample-project.html",
    featured: true,
  },
];

const MAX_FEATURED = 4;

for (const grid of document.querySelectorAll(".project-grid[data-projects]")) {
  const root = grid.dataset.root ?? "";
  const list =
    grid.dataset.projects === "featured"
      ? PROJECTS.filter((project) => project.featured).slice(0, MAX_FEATURED)
      : PROJECTS;

  for (const project of list) {
    const tile = document.createElement("a");
    tile.className = "project-tile";
    tile.href = root + project.page;

    const cover = document.createElement("img");
    cover.src = root + project.cover;
    cover.alt = "";
    cover.loading = "lazy";

    const body = document.createElement("span");
    body.className = "tile-body";
    const title = document.createElement("span");
    title.className = "tile-title";
    title.textContent = project.title;
    const summary = document.createElement("span");
    summary.className = "tile-summary";
    summary.textContent = project.summary;
    body.append(title, summary);

    tile.append(cover, body);
    grid.append(tile);
  }
}
