/* Render the project directory from the content file used by the content editor.
   The HTML includes a complete fallback, so the directory remains usable if this
   enhancement or the JSON request is unavailable. */
(() => {
  const directory = document.querySelector(".content-grid[aria-label='Kaevoryn projects']");
  if (!directory) return;

  const makeText = (tag, className, value) => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    element.textContent = value;
    return element;
  };

  const makeCard = (project) => {
    const hasPage = typeof project.slug === "string" && project.slug.trim() !== "";
    const card = document.createElement(hasPage ? "a" : "div");
    card.className = "content-card";
    if (hasPage) card.href = `projects/${encodeURIComponent(project.slug)}.html`;

    if (typeof project.image === "string" && project.image.trim()) {
      const image = document.createElement("img");
      image.className = "project-card-image";
      image.src = project.image;
      image.alt = typeof project.image_alt === "string" ? project.image_alt : project.title;
      image.loading = "lazy";
      card.append(image);
    }

    card.append(makeText("span", "card-kicker", project.category));
    card.append(makeText("h2", "", project.title));
    card.append(makeText("p", "", project.description));

    if (hasPage) {
      card.append(makeText("span", "status-pill", "PROJECT OVERVIEW"));
      const action = project.title === "Escape From The Nightmare Forge"
        ? "ENTER THE FORGE ↗"
        : "EXPLORE PROJECT ↗";
      card.append(makeText("span", "card-link", action));
    } else {
      card.append(makeText("span", "status-pill", "⏳ Future"));
    }
    return card;
  };

  fetch("content/projects.json")
    .then((response) => {
      if (!response.ok) throw new Error("Project content could not be loaded.");
      return response.json();
    })
    .then((projects) => {
      if (!Array.isArray(projects) || projects.length === 0) {
        throw new Error("Project content is not a non-empty list.");
      }
      const validProjects = projects.filter((project) =>
        project &&
        typeof project.category === "string" &&
        typeof project.title === "string" &&
        typeof project.description === "string"
      );
      if (validProjects.length !== projects.length) {
        throw new Error("Project content contains an incomplete entry.");
      }
      const fragment = document.createDocumentFragment();
      validProjects.forEach((project) => fragment.append(makeCard(project)));
      directory.replaceChildren(fragment);
      directory.dataset.projectDirectory = "loaded";
    })
    .catch((error) => {
      // Keep the authored HTML fallback intact and log only for maintainers.
      console.warn("Kaevoryn project directory is using its HTML fallback.", error);
    });
})();
