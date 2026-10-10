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
    title: "Tap Titans 2 Raid Simulator",
    summary:
      "Raid simulator and deck recommender for my Tap Titans 2 clan.\nRust backend, React + TypeScript frontend.",
    cover: "images/TT2Sims/Dashboard..png",
    page: "projects/taptitan-raid-sims.html",
    featured: true,
  },
  {
    title: "Unfinished History",
    summary:
      "2D pixel-art action platformer made with MonoGame (C#).\nComputer Game Programming final project, team of 3.",
    cover: "images/UnfinishHistory/Thumbnail.png",
    page: "projects/unfinished-history.html",
    featured: true,
  },
  {
    title: "Chip Dealer",
    summary:
      "Casino-themed Puzzle Bobble with poker chips, made with MonoGame (C#).\nClass midterm project, team of 3.",
    cover: "images/ChipDealer/Menu.png",
    page: "projects/chip-dealer.html",
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
