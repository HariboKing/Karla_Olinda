const versionedMediaDataPath = "assets/data/media.json?v=20260718-1";

function mediaSlug(value) {
  return String(value ?? "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function applyMediaGroupAnchors(groups) {
  const sections = document.querySelectorAll(".portfolio-group");
  sections.forEach((section, index) => {
    const group = groups[index];
    if (!group) {
      return;
    }

    section.id = group.id || mediaSlug(group.title);
  });
}

function scrollToMediaHash() {
  const id = decodeURIComponent(window.location.hash.slice(1));
  if (!id) {
    return;
  }

  window.requestAnimationFrame(() => {
    document.getElementById(id)?.scrollIntoView({ block: "start" });
  });
}

async function refreshMediaPageData() {
  const grid = document.querySelector("[data-portfolio-grid]");
  if (!grid || typeof renderMedia !== "function") {
    return;
  }

  try {
    const response = await fetch(versionedMediaDataPath);
    if (!response.ok) {
      throw new Error("Versioned media data could not be loaded.");
    }

    const data = await response.json();
    renderMedia(data);
    applyMediaGroupAnchors(data.groups ?? []);
    scrollToMediaHash();
  } catch (error) {
    console.error(error);
  }
}

refreshMediaPageData();
