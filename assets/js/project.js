// Страница проекта: рендер по ?p=<имя> через общий ProjectRender.
(function () {
  const root = document.getElementById("project-content");
  if (!root || !window.PROJECTS || !window.ProjectRender) return;

  const name = new URLSearchParams(location.search).get("p");
  const idx = window.PROJECTS.findIndex(p => p.name === name);
  if (idx === -1) { location.replace("index.html"); return; }

  document.title = window.PROJECTS[idx].name + " — smeshidojoe";
  const render = () => window.ProjectRender.render(root, window.PROJECTS[idx], idx);

  document.addEventListener("langchange", render);
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
  render();
})();
