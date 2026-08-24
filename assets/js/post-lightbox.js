(function () {
  var dialog = document.querySelector("[data-image-lightbox]");
  var lightboxImage = document.querySelector("[data-image-lightbox-image]");
  var caption = document.querySelector("[data-image-lightbox-caption]");
  var closeButton = document.querySelector("[data-image-lightbox-close]");
  var images = Array.prototype.slice.call(document.querySelectorAll(".post-hero img, .post-body figure img"));
  var lastTrigger = null;

  if (!dialog || !lightboxImage || !caption || !closeButton || !images.length) return;

  function cleanup() {
    document.documentElement.classList.remove("lightbox-open");
    lightboxImage.removeAttribute("src");

    if (lastTrigger) {
      lastTrigger.focus();
      lastTrigger = null;
    }
  }

  function closeLightbox() {
    if (dialog.open && typeof dialog.close === "function") {
      dialog.close();
    } else {
      dialog.removeAttribute("open");
      cleanup();
    }
  }

  function openLightbox(image) {
    var figure = image.closest("figure");
    var sourceCaption = figure ? figure.querySelector("figcaption") : null;

    lastTrigger = image;
    lightboxImage.src = image.getAttribute("src");
    lightboxImage.alt = image.alt;

    if (sourceCaption && sourceCaption.textContent.trim()) {
      caption.textContent = sourceCaption.textContent.trim();
      caption.hidden = false;
    } else {
      caption.textContent = "";
      caption.hidden = true;
    }

    document.documentElement.classList.add("lightbox-open");

    if (typeof dialog.showModal === "function") {
      dialog.showModal();
    } else {
      dialog.setAttribute("open", "");
    }

    closeButton.focus();
  }

  images.forEach(function (image) {
    image.classList.add("post-image-zoom");
    image.setAttribute("role", "button");
    image.setAttribute("tabindex", "0");
    image.setAttribute("aria-haspopup", "dialog");
    image.setAttribute("aria-label", "Open larger view: " + image.alt);

    image.addEventListener("click", function (event) {
      event.preventDefault();
      openLightbox(image);
    });

    image.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openLightbox(image);
      }
    });
  });

  closeButton.addEventListener("click", closeLightbox);

  dialog.addEventListener("click", function (event) {
    if (event.target === dialog) closeLightbox();
  });

  dialog.addEventListener("close", cleanup);
}());
