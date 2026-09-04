(function () {
  var dialog = document.querySelector("[data-fun-media-dialog]");
  var image = document.querySelector("[data-fun-media-image]");
  var video = document.querySelector("[data-fun-media-video]");
  var caption = document.querySelector("[data-fun-media-caption]");
  var closeButton = document.querySelector("[data-fun-media-close]");
  var triggers = Array.prototype.slice.call(document.querySelectorAll("[data-fun-media-open]"));
  var lastTrigger = null;

  if (!dialog || !image || !video || !caption || !closeButton || !triggers.length) return;

  function cleanup() {
    document.documentElement.classList.remove("lightbox-open");
    video.pause();
    video.removeAttribute("src");
    video.removeAttribute("poster");
    video.load();
    video.hidden = true;
    image.removeAttribute("src");
    image.hidden = true;
    caption.textContent = "";
    caption.hidden = true;

    if (lastTrigger) {
      lastTrigger.focus();
      lastTrigger = null;
    }
  }

  function closeMedia() {
    if (dialog.open && typeof dialog.close === "function") {
      dialog.close();
    } else {
      dialog.removeAttribute("open");
      cleanup();
    }
  }

  function openMedia(trigger) {
    var kind = trigger.dataset.mediaKind;
    var source = trigger.dataset.mediaSrc;
    var mediaCaption = trigger.dataset.mediaCaption;

    lastTrigger = trigger;
    document.documentElement.classList.add("lightbox-open");

    if (kind === "video") {
      video.src = source;
      video.poster = trigger.dataset.mediaPoster || "";
      video.setAttribute("aria-label", trigger.dataset.mediaAlt || mediaCaption || "Concert video");
      video.hidden = false;
    } else {
      image.src = source;
      image.alt = trigger.dataset.mediaAlt || "";
      image.hidden = false;
    }

    if (mediaCaption) {
      caption.textContent = mediaCaption;
      caption.hidden = false;
    }

    if (typeof dialog.showModal === "function") {
      dialog.showModal();
    } else {
      dialog.setAttribute("open", "");
    }

    if (kind === "video") {
      video.play().catch(function () {
        // Native controls remain available when autoplay is blocked.
      });
      video.focus();
    } else {
      closeButton.focus();
    }
  }

  triggers.forEach(function (trigger) {
    trigger.addEventListener("click", function () {
      openMedia(trigger);
    });
  });

  dialog.dataset.funMediaReady = "true";

  closeButton.addEventListener("click", closeMedia);

  dialog.addEventListener("click", function (event) {
    if (event.target === dialog) closeMedia();
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && dialog.hasAttribute("open") && typeof dialog.showModal !== "function") {
      closeMedia();
    }
  });

  dialog.addEventListener("close", cleanup);
}());
