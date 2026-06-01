const header = document.getElementById("siteHeader");
const navToggle = document.getElementById("navToggle");
const navMenu = document.getElementById("navMenu");
const navLinks = document.querySelectorAll(".nav-menu a");
const revealElements = document.querySelectorAll(".reveal");

function updateHeaderShadow() {
  header.classList.toggle("scrolled", window.scrollY > 12);
}

function closeMobileMenu() {
  navToggle.classList.remove("active");
  navToggle.setAttribute("aria-expanded", "false");
  navMenu.classList.remove("open");
}

navToggle.addEventListener("click", () => {
  const isOpen = navMenu.classList.toggle("open");
  navToggle.classList.toggle("active", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.forEach((link) => {
  link.addEventListener("click", closeMobileMenu);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMobileMenu();
  }
});

window.addEventListener("scroll", updateHeaderShadow);
updateHeaderShadow();

function createListItems(items) {
  return items
    .map((item) => `<li>${item}</li>`)
    .join("");
}

function createTechTags(items) {
  return items
    .map((item) => `<span>${item}</span>`)
    .join("");
}

function renderProjectVideo(project) {
  const frame = document.getElementById("projectVideoFrame");

  if (!frame) {
    return;
  }

  if (!project.videoEmbed) {
    frame.innerHTML = `
      <div class="video-placeholder">
        <span data-lucide="video-off" aria-hidden="true"></span>
        <p>Este proyecto esta listo para insertar video. Agrega una URL o iframe en <strong>project-data.js</strong>.</p>
      </div>
    `;
    return;
  }

  if (project.videoEmbed.trim().startsWith("<iframe")) {
    frame.innerHTML = project.videoEmbed;
    return;
  }

  frame.innerHTML = `
    <iframe
      src="${project.videoEmbed}"
      title="Video del proyecto ${project.title}"
      loading="lazy"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowfullscreen>
    </iframe>
  `;
}

function openLightbox(src, alt) {
  const lightbox = document.getElementById("projectLightbox");
  const image = document.getElementById("lightboxImage");

  if (!lightbox || !image) {
    return;
  }

  image.src = src;
  image.alt = alt;
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
}

function closeLightbox() {
  const lightbox = document.getElementById("projectLightbox");
  const image = document.getElementById("lightboxImage");

  if (!lightbox || !image) {
    return;
  }

  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  image.src = "";
  image.alt = "";
}

function renderProjectDetail() {
  const root = document.getElementById("projectDetailRoot");

  if (!root || !window.marRoProjects) {
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const requestedId = params.get("id");
  const project = window.marRoProjects.find((item) => item.id === requestedId) || window.marRoProjects[0];
  const hero = document.getElementById("projectDetailHero");
  const gallery = document.getElementById("projectDetailGallery");

  document.title = `${project.title} | Constructora Mar-Ro`;
  document.getElementById("projectDetailTitle").textContent = project.title;
  document.getElementById("projectDetailSummary").textContent = project.summary;
  document.getElementById("projectDetailCategory").textContent = project.category;
  document.getElementById("projectDetailDescription").textContent = project.description;
  document.getElementById("projectDetailLocation").textContent = project.location;
  document.getElementById("projectDetailMetaCategory").textContent = project.category;
  document.getElementById("projectObjectives").innerHTML = createListItems(project.objectives);
  document.getElementById("projectTechnologies").innerHTML = createTechTags(project.technologies);

  if (hero && project.images.length) {
    hero.style.backgroundImage = `url("${project.images[0]}")`;
  }

  if (gallery) {
    gallery.innerHTML = "";
    project.images.forEach((src, index) => {
      const button = document.createElement("button");
      button.className = "detail-gallery-item";
      button.type = "button";
      button.setAttribute("aria-label", `Ampliar imagen ${index + 1} de ${project.title}`);

      const image = document.createElement("img");
      image.src = src;
      image.alt = `${project.title} - imagen ${index + 1}`;
      image.loading = "lazy";

      button.appendChild(image);
      button.addEventListener("click", () => openLightbox(src, image.alt));
      gallery.appendChild(button);
    });
  }

  renderProjectVideo(project);
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.16,
    rootMargin: "0px 0px -40px 0px",
  }
);

revealElements.forEach((element) => revealObserver.observe(element));

renderProjectDetail();

document.getElementById("projectLightbox")?.addEventListener("click", (event) => {
  if (event.target.id === "projectLightbox" || event.target.classList.contains("lightbox-close")) {
    closeLightbox();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeLightbox();
  }
});

if (window.lucide) {
  window.lucide.createIcons();
}
