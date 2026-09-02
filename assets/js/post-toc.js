(function () {
  var toc = document.querySelector("[data-post-toc]");
  var list = document.querySelector("[data-post-toc-list]");
  var outline = document.querySelector("[data-post-outline]");
  var outlineList = document.querySelector("[data-post-outline-list]");
  var progressBar = document.querySelector("[data-reading-progress-bar]");
  var backToTop = document.querySelector("[data-back-to-top]");
  var body = document.querySelector(".post-body");

  if (!body) return;

  function setupReadingTools() {
    if (!progressBar && !backToTop) return;

    var updateScheduled = false;

    function updateReadingTools() {
      var scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
      var scrollHeight = Math.max(
        document.documentElement.scrollHeight,
        document.body.scrollHeight
      );
      var scrollableHeight = Math.max(scrollHeight - window.innerHeight, 0);
      var progress = scrollableHeight ? Math.min(Math.max(scrollTop / scrollableHeight, 0), 1) : 0;

      if (progressBar) progressBar.style.transform = "scaleX(" + progress + ")";

      if (backToTop) {
        var isVisible = scrollTop > 320;
        backToTop.classList.toggle("is-visible", isVisible);
        backToTop.setAttribute("aria-hidden", isVisible ? "false" : "true");
        backToTop.tabIndex = isVisible ? 0 : -1;
      }

      updateScheduled = false;
    }

    function scheduleUpdate() {
      if (updateScheduled) return;
      updateScheduled = true;
      window.requestAnimationFrame(updateReadingTools);
    }

    if (backToTop) {
      backToTop.tabIndex = -1;
      backToTop.addEventListener("click", function () {
        var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
      });
    }

    updateReadingTools();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    window.addEventListener("load", scheduleUpdate);
  }

  setupReadingTools();

  var headings = Array.prototype.slice.call(body.querySelectorAll("h2, h3"));
  if (!headings.length) return;

  var buildToc = toc && list && headings.length >= 2;

  var usedIds = {};
  var currentSection = null;
  var currentSublist = null;
  var sections = [];

  function slugify(text) {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }

    return new Promise(function (resolve, reject) {
      var field = document.createElement("textarea");
      field.value = text;
      field.setAttribute("readonly", "");
      field.style.position = "fixed";
      field.style.opacity = "0";
      document.body.appendChild(field);
      field.select();

      try {
        if (document.execCommand("copy")) {
          resolve();
        } else {
          reject(new Error("Copy command failed"));
        }
      } catch (error) {
        reject(error);
      }

      field.remove();
    });
  }

  function addPermalink(heading, id, title) {
    var permalink = document.createElement("a");
    permalink.className = "heading-anchor";
    permalink.href = "#" + id;
    permalink.textContent = "#";
    permalink.title = "Copy link to this section";
    permalink.setAttribute("aria-label", "Copy link to " + title);

    permalink.addEventListener("click", function () {
      var sectionUrl = new URL(window.location.href);
      sectionUrl.hash = id;

      copyText(sectionUrl.toString()).then(function () {
        permalink.classList.add("is-copied");
        permalink.textContent = "✓";
        permalink.setAttribute("aria-label", "Link copied");

        window.setTimeout(function () {
          permalink.classList.remove("is-copied");
          permalink.textContent = "#";
          permalink.setAttribute("aria-label", "Copy link to " + title);
        }, 1200);
      }).catch(function () {
        // The section link still works when clipboard access is unavailable.
      });
    });

    heading.insertBefore(permalink, heading.firstChild);
  }

  function buildOutline() {
    if (!outline || !outlineList || sections.length < 2) return;

    var outlineItems = [];
    var outlineSection = null;
    var outlineSublist = null;

    sections.forEach(function (section) {
      var item = document.createElement("li");
      item.className = "post-outline-item post-outline-item--" + section.level;

      var link = document.createElement("a");
      link.href = "#" + section.id;
      link.textContent = section.title;
      item.appendChild(link);

      if (section.level === "h2") {
        outlineList.appendChild(item);
        outlineSection = item;
        outlineSublist = null;
      } else if (outlineSection) {
        if (!outlineSublist) {
          outlineSublist = document.createElement("ol");
          outlineSublist.className = "post-outline-sublist";
          outlineSection.appendChild(outlineSublist);
        }
        outlineSublist.appendChild(item);
      } else {
        outlineList.appendChild(item);
      }

      outlineItems.push({
        id: section.id,
        heading: section.heading,
        link: link
      });
    });

    function updateActiveSection() {
      var marker = Math.min(240, window.innerHeight * 0.28);
      var active = outlineItems[0];

      outlineItems.forEach(function (item) {
        if (item.heading.getBoundingClientRect().top <= marker) active = item;
      });

      outlineItems.forEach(function (item) {
        var isActive = item === active;
        item.link.classList.toggle("is-active", isActive);

        if (isActive) {
          item.link.setAttribute("aria-current", "location");
        } else {
          item.link.removeAttribute("aria-current");
        }
      });
    }

    var updateScheduled = false;

    function scheduleUpdate() {
      if (updateScheduled) return;
      updateScheduled = true;

      window.requestAnimationFrame(function () {
        updateActiveSection();
        updateScheduled = false;
      });
    }

    outline.hidden = false;
    updateActiveSection();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    window.addEventListener("hashchange", scheduleUpdate);
  }

  headings.forEach(function (heading, index) {
    var title = heading.textContent.trim();
    var baseId = heading.id || slugify(title) || "section-" + (index + 1);
    var id = baseId;
    var suffix = 2;

    while (usedIds[id] || (document.getElementById(id) && document.getElementById(id) !== heading)) {
      id = baseId + "-" + suffix;
      suffix += 1;
    }

    usedIds[id] = true;
    heading.id = id;
    sections.push({
      id: id,
      heading: heading,
      level: heading.tagName.toLowerCase(),
      title: title
    });

    if (buildToc) {
      var item = document.createElement("li");
      var link = document.createElement("a");
      link.href = "#" + id;
      link.textContent = title;
      item.appendChild(link);

      if (heading.tagName === "H2") {
        list.appendChild(item);
        currentSection = item;
        currentSublist = null;
      } else if (currentSection) {
        if (!currentSublist) {
          currentSublist = document.createElement("ol");
          currentSublist.className = "post-toc-sublist";
          currentSection.appendChild(currentSublist);
        }
        currentSublist.appendChild(item);
      } else {
        list.appendChild(item);
      }
    }

    addPermalink(heading, id, title);
  });

  if (buildToc) toc.hidden = false;
  buildOutline();
}());
