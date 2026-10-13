/* Progressive project directory: static HTML remains as a fallback. */
(async function renderProjectDirectory() {
  const grid = document.querySelector(".project-grid");
  if (!grid) return;

  try {
    const response = await fetch("content/projects.json", { headers: { Accept: "application/json" } });
    if (!response.ok) throw new Error("Project content could not be loaded.");
    const projects = await response.json();
    if (!Array.isArray(projects) || projects.length === 0) throw new Error("Project content is empty.");

    const fragment = document.createDocumentFragment();
    for (const project of projects) {
      if (!project || typeof project.title !== "string" || typeof project.description !== "string") continue;

      const card = project.slug ? document.createElement("a") : document.createElement("article");
      card.className = "content-card project-card";
      if (project.slug) card.href = `projects/${encodeURIComponent(project.slug)}.html`;

      if (typeof project.image === "string" && project.image.trim()) {
        const image = document.createElement("img");
        image.className = "project-artwork";
        const imagePath = project.image.trim();
        // GitHub Pages project sites live under /Website/, so keep CMS media
        // paths relative instead of accidentally pointing at the domain root.
        image.src = imagePath.startsWith("/media/") ? `media/${imagePath.slice("/media/".length)}` : imagePath;
        image.alt = typeof project.image_alt === "string" ? project.image_alt.trim() : "";
        image.loading = "lazy";
        image.decoding = "async";
        card.append(image);
      }

      if (typeof project.category === "string" && project.category.trim()) {
        const category = document.createElement("span");
        category.className = "card-kicker";
        category.textContent = project.category;
        card.append(category);
      }

      const heading = document.createElement("h2");
      heading.textContent = project.title;
      card.append(heading);

      const description = document.createElement("p");
      description.textContent = project.description;
      card.append(description);

      const status = document.createElement("span");
      status.className = "status-pill";
      status.textContent = project.slug ? "PROJECT OVERVIEW" : (project.status || "⏳ Future");
      card.append(status);

      if (project.slug && typeof project.link_label === "string" && project.link_label.trim()) {
        const linkLabel = document.createElement("span");
        linkLabel.className = "card-link";
        linkLabel.textContent = project.link_label;
        card.append(linkLabel);
      }

      fragment.append(card);
    }

    if (!fragment.childNodes.length) throw new Error("No valid project entries were found.");
    grid.replaceChildren(fragment);
    grid.dataset.projectsRendered = "true";
  } catch (error) {
    // Keep the hand-authored fallback cards available if fetch or content parsing fails.
    grid.dataset.projectsRendered = "fallback";
  }
})();
