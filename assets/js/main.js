const mediaDataPath = "assets/data/media.json";

const fallbackMediaData = {
  featured: [
    { title: "Stage Portrait", link: "media.html", image: "" },
    { title: "Performance Moment", link: "media.html", image: "" },
    { title: "Editorial Still", link: "media.html", image: "" },
    { title: "Vocal Work", link: "media.html", image: "" },
    { title: "Theatre Moment", link: "media.html", image: "" }
  ],
  groups: [
    {
      title: "Gigs and Live Performances",
      items: [
        { title: "Live 01", link: "", image: "" },
        { title: "Live 02", link: "", image: "" },
        { title: "Live 03", link: "", image: "" },
        { title: "Live 04", link: "", image: "" },
        { title: "Live 05", link: "", image: "" }
      ]
    },
    {
      title: "Classical & Art Songs",
      items: [
        { title: "Classical 01", link: "", image: "" },
        { title: "Classical 02", link: "", image: "" },
        { title: "Classical 03", link: "", image: "" },
        { title: "Classical 04", link: "", image: "" },
        { title: "Classical 05", link: "", image: "" },
        { title: "Classical 06", link: "", image: "" }
      ]
    },
    {
      title: "Original Songs",
      items: [
        { title: "Original 01", link: "", image: "" },
        { title: "Original 02", link: "", image: "" },
        { title: "Original 03", link: "", image: "" },
        { title: "Original 04", link: "", image: "" },
        { title: "Original 05", link: "", image: "" },
        { title: "Original 06", link: "", image: "" }
      ]
    },
    {
      title: "Choir and Musical",
      items: [
        { title: "Choir 01", link: "", image: "" },
        { title: "Choir 02", link: "", image: "" },
        { title: "Choir 03", link: "", image: "" },
        { title: "Choir 04", link: "", image: "" },
        { title: "Choir 05", link: "", image: "" },
        { title: "Choir 06", link: "", image: "" }
      ]
    }
  ]
};

const SHOWCASE_HOVER_DELAY = 1000;
const SHOWCASE_SHIFT_DURATION = 180;
const LATEST_VIDEO_HOVER_DELAY = 2000;

const state = {
  featuredIndex: 2,
  featuredItems: [],
  showcaseHoverTimer: null,
  showcaseHoverDirection: 0,
  showcaseIsAnimating: false,
  latestVideoHoverTimer: null
};

function setCurrentYear() {
  document.querySelectorAll("[data-year]").forEach((element) => {
    element.textContent = new Date().getFullYear();
  });
}

function setupNavigation() {
  const toggleButtons = document.querySelectorAll(".nav-toggle");

  toggleButtons.forEach((button) => {
    const nav = button.parentElement.querySelector(".site-nav");
    if (!nav) {
      return;
    }

    button.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("is-open");
      button.setAttribute("aria-expanded", String(isOpen));
      button.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("is-open");
        button.setAttribute("aria-expanded", "false");
        button.setAttribute("aria-label", "Open navigation");
      });
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") {
      return;
    }

    document.querySelectorAll(".site-nav.is-open").forEach((nav) => {
      const button = nav.parentElement.querySelector(".nav-toggle");
      nav.classList.remove("is-open");
      button?.setAttribute("aria-expanded", "false");
      button?.setAttribute("aria-label", "Open navigation");
    });
  });
}

function setupPlaceholderLinks() {
  document.querySelectorAll("[data-placeholder-link]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
    });
    link.setAttribute("aria-disabled", "true");
    link.setAttribute("title", "Link will be added later");
  });
}

function getFormValue(form, selector) {
  const field = form.querySelector(selector);
  return field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement || field instanceof HTMLSelectElement
    ? field.value.trim()
    : "";
}

function setFieldInvalid(field, isInvalid) {
  field?.closest(".form-field")?.classList.toggle("is-invalid", isInvalid);
}

function setupContactForm() {
  const form = document.querySelector("[data-contact-form]");
  if (!(form instanceof HTMLFormElement)) {
    return;
  }

  const nameField = form.querySelector("[data-contact-name]");
  const emailField = form.querySelector("[data-contact-email]");
  const phoneField = form.querySelector("[data-contact-phone]");
  const error = form.querySelector("[data-contact-error]");

  if (!(nameField instanceof HTMLInputElement) || !(emailField instanceof HTMLInputElement) || !(phoneField instanceof HTMLInputElement)) {
    return;
  }

  const validateContactForm = () => {
    const hasName = nameField.value.trim() !== "";
    const hasEmail = emailField.value.trim() !== "";
    const hasPhone = phoneField.value.trim() !== "";
    const hasContactDetail = hasEmail || hasPhone;

    nameField.setCustomValidity(hasName ? "" : "Please fill in your name.");
    emailField.setCustomValidity(hasContactDetail ? "" : "Please fill in either an email address or phone number.");
    phoneField.setCustomValidity(hasContactDetail ? "" : "Please fill in either an email address or phone number.");

    setFieldInvalid(nameField, !hasName);
    setFieldInvalid(emailField, !hasContactDetail);
    setFieldInvalid(phoneField, !hasContactDetail);

    if (error instanceof HTMLElement) {
      error.hidden = hasName && hasContactDetail;
    }

    return hasName && hasContactDetail;
  };

  [nameField, emailField, phoneField].forEach((field) => {
    field.addEventListener("input", validateContactForm);
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const passesRequiredRules = validateContactForm();
    if (!passesRequiredRules || !form.reportValidity()) {
      form.reportValidity();
      return;
    }

    const name = getFormValue(form, "[data-contact-name]");
    const email = getFormValue(form, "[data-contact-email]");
    const phone = getFormValue(form, "[data-contact-phone]");
    const lessonInquiry = getFormValue(form, "[data-contact-lessons]");
    const message = getFormValue(form, "[data-contact-message]");
    const body = [
      `Name: ${name}`,
      `Email address: ${email || "Not provided"}`,
      `Phone number: ${phone || "Not provided"}`,
      `Lesson inquiry: ${lessonInquiry}`,
      "",
      "Message:",
      message || "No message provided."
    ].join("\n");

    const subject = `Karla Olinda contact form - ${name}`;
    window.location.href = `mailto:info@jovka.org?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
}

function setupLatestVideoHover() {
  const video = document.querySelector("[data-latest-video]");
  if (!(video instanceof HTMLVideoElement)) {
    return;
  }

  const clearLatestVideoTimer = () => {
    if (state.latestVideoHoverTimer === null) {
      return;
    }

    window.clearTimeout(state.latestVideoHoverTimer);
    state.latestVideoHoverTimer = null;
  };

  video.addEventListener("pointerenter", () => {
    clearLatestVideoTimer();
    state.latestVideoHoverTimer = window.setTimeout(() => {
      state.latestVideoHoverTimer = null;
      video.play().catch(() => {});
    }, LATEST_VIDEO_HOVER_DELAY);
  });

  video.addEventListener("pointerleave", () => {
    clearLatestVideoTimer();
    video.pause();
  });
}

function hasUsableLink(link) {
  return typeof link === "string" && link.trim() !== "" && link.trim() !== "#";
}

function isExternalLink(link) {
  return /^https?:\/\//i.test(link);
}

function getDetailValue(value, fallback) {
  return typeof value === "string" && value.trim() !== "" ? value : fallback;
}

function applyMediaImage(element, image) {
  if (typeof image !== "string" || image.trim() === "") {
    return;
  }

  element.classList.add("has-image");
  element.style.setProperty("--media-image", `url("${image}")`);
}

function createShowcaseCard(item, roleClass) {
  const card = document.createElement("button");
  card.type = "button";
  card.className = `showcase-card ${roleClass}`;
  card.setAttribute("aria-label", item.title);
  applyMediaImage(card, item.image);

  const caption = document.createElement("span");
  caption.className = "showcase-card-caption";
  caption.textContent = item.title;
  card.appendChild(caption);

  return card;
}

function getShowcaseRole(offset) {
  if (offset === 0) {
    return "is-center";
  }

  if (offset === -1) {
    return "is-side is-left";
  }

  if (offset === 1) {
    return "is-side is-right";
  }

  return offset < 0 ? "is-far is-far-left" : "is-far is-far-right";
}

function clearShowcaseHoverTimer() {
  if (state.showcaseHoverTimer === null) {
    return;
  }

  window.clearTimeout(state.showcaseHoverTimer);
  state.showcaseHoverTimer = null;
}

function stopShowcaseHoverLoop() {
  clearShowcaseHoverTimer();
  state.showcaseHoverDirection = 0;
}

function scheduleShowcaseHoverStep() {
  clearShowcaseHoverTimer();

  if (state.showcaseHoverDirection === 0) {
    return;
  }

  state.showcaseHoverTimer = window.setTimeout(() => {
    state.showcaseHoverTimer = null;

    if (state.showcaseHoverDirection === 0) {
      return;
    }

    if (state.showcaseIsAnimating) {
      scheduleShowcaseHoverStep();
      return;
    }

    const total = state.featuredItems.length;
    if (total === 0) {
      stopShowcaseHoverLoop();
      return;
    }

    const nextIndex = (state.featuredIndex + state.showcaseHoverDirection + total) % total;
    moveFeaturedShowcaseTo(nextIndex, {
      preserveHoverLoop: true,
      onComplete: scheduleShowcaseHoverStep
    });
  }, SHOWCASE_HOVER_DELAY);
}

function startShowcaseHoverLoop(direction) {
  state.showcaseHoverDirection = direction;
  scheduleShowcaseHoverStep();
}

function getShowcaseShiftClass(index) {
  const total = state.featuredItems.length;
  const forwardDistance = (index - state.featuredIndex + total) % total;
  const backwardDistance = (state.featuredIndex - index + total) % total;

  return forwardDistance <= backwardDistance ? "is-shifting-next" : "is-shifting-prev";
}

function moveFeaturedShowcaseTo(index, options = {}) {
  if (!options.preserveHoverLoop) {
    stopShowcaseHoverLoop();
  }

  if (index === state.featuredIndex || state.showcaseIsAnimating) {
    options.onComplete?.();
    return;
  }

  const track = document.querySelector("[data-featured-track]");
  if (!track) {
    state.featuredIndex = index;
    renderFeaturedShowcase();
    options.onComplete?.();
    return;
  }

  const shiftClass = getShowcaseShiftClass(index);
  state.showcaseIsAnimating = true;
  track.classList.remove("is-shifting-next", "is-shifting-prev");

  window.requestAnimationFrame(() => {
    track.classList.add(shiftClass);

    window.setTimeout(() => {
      state.featuredIndex = index;
      state.showcaseIsAnimating = false;
      track.classList.remove(shiftClass);
      renderFeaturedShowcase();
      options.onComplete?.();
    }, SHOWCASE_SHIFT_DURATION);
  });
}

function renderFeaturedShowcase() {
  const track = document.querySelector("[data-featured-track]");
  if (!track || state.featuredItems.length === 0) {
    return;
  }

  track.innerHTML = "";
  track.classList.remove("is-shifting-next", "is-shifting-prev");
  track.onpointerleave = stopShowcaseHoverLoop;

  const total = state.featuredItems.length;
  const offsets = total >= 5 ? [-2, -1, 0, 1, 2] : [-1, 0, 1];

  offsets.forEach((offset) => {
    const index = (state.featuredIndex + offset + total) % total;
    const item = state.featuredItems[index];
    const roleClass = getShowcaseRole(offset);
    const card = createShowcaseCard(item, roleClass);

    if (offset !== 0) {
      card.addEventListener("pointerenter", () => {
        startShowcaseHoverLoop(offset > 0 ? 1 : -1);
      });
    } else {
      card.addEventListener("pointerenter", stopShowcaseHoverLoop);
    }

    card.addEventListener("click", () => {
      if (offset !== 0) {
        moveFeaturedShowcaseTo(index);
        return;
      }

      if (hasUsableLink(item.link)) {
        window.location.href = item.link;
      }
    });

    track.appendChild(card);
  });

  const prev = document.querySelector(".showcase-arrow-prev");
  const next = document.querySelector(".showcase-arrow-next");

  if (prev) {
    prev.onclick = () => {
      moveFeaturedShowcaseTo((state.featuredIndex - 1 + total) % total);
    };
  }

  if (next) {
    next.onclick = () => {
      moveFeaturedShowcaseTo((state.featuredIndex + 1) % total);
    };
  }
}

function renderPortfolio(groups) {
  const container = document.querySelector("[data-portfolio-grid]");
  if (!container) {
    return;
  }

  container.innerHTML = "";

  groups.forEach((group) => {
    const section = document.createElement("section");
    section.className = "portfolio-group";

    const title = document.createElement("h2");
    title.textContent = group.title;
    section.appendChild(title);

    const items = document.createElement("div");
    items.className = "portfolio-items";

    group.items.forEach((item) => {
      const entry = document.createElement(hasUsableLink(item.link) ? "a" : "div");
      entry.className = "portfolio-item";
      if (hasUsableLink(item.link)) {
        entry.href = item.link;
        if (isExternalLink(item.link)) {
          entry.target = "_blank";
          entry.rel = "noreferrer";
        }
      } else {
        entry.tabIndex = 0;
      }

      const image = document.createElement("div");
      image.className = "portfolio-item-image";
      image.setAttribute("role", "img");
      image.setAttribute("aria-label", item.title);
      applyMediaImage(image, item.image);

      const label = document.createElement("span");
      label.className = "portfolio-item-title";
      label.textContent = item.title;
      image.appendChild(label);

      const details = document.createElement("div");
      details.className = "portfolio-item-details";

      const meta = document.createElement("div");
      meta.className = "portfolio-item-meta";

      const date = document.createElement("span");
      date.textContent = getDetailValue(item.date, "XXXX-XXXX");

      const location = document.createElement("span");
      location.textContent = getDetailValue(item.location, "Leeg");

      const description = document.createElement("p");
      description.textContent = getDetailValue(item.description, "Leeg");

      meta.append(date, location);
      details.append(meta, description);
      image.appendChild(details);
      entry.appendChild(image);
      items.appendChild(entry);
    });

    section.appendChild(items);
    container.appendChild(section);
  });
}

async function loadMediaData() {
  try {
    const response = await fetch(mediaDataPath);
    if (!response.ok) {
      throw new Error("Media data could not be loaded.");
    }

    const data = await response.json();
    renderMedia(data);
  } catch (error) {
    console.error(error);
    renderMedia(fallbackMediaData);
  }
}

function renderMedia(data) {
  state.featuredItems = data.featured ?? [];
  renderFeaturedShowcase();
  renderPortfolio(data.groups ?? []);
}

setCurrentYear();
setupNavigation();
setupPlaceholderLinks();
setupContactForm();
setupLatestVideoHover();
if (document.querySelector("[data-featured-track], [data-portfolio-grid]")) {
  loadMediaData();
}
