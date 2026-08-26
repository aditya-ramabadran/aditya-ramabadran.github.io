(function () {
  var toc = document.querySelector("[data-post-toc]");
  var list = document.querySelector("[data-post-toc-list]");
  var outline = document.querySelector("[data-post-outline]");
  var outlineRail = document.querySelector("[data-post-outline-rail]");
  var outlineList = document.querySelector("[data-post-outline-list]");
  var body = document.querySelector(".post-body");

  if (!body) return;

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
    if (!outline || !outlineRail || !outlineList || sections.length < 2) return;

    var outlineItems = [];
    var outlineSection = null;
    var outlineSublist = null;

    sections.forEach(function (section) {
      var tick = document.createElement("a");
      tick.className = "post-outline-tick post-outline-tick--" + section.level;
      tick.href = "#" + section.id;
      tick.title = section.title;
      tick.setAttribute("aria-label", "Go to " + section.title);
      outlineRail.appendChild(tick);

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
        tick: tick,
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
        item.tick.classList.toggle("is-active", isActive);
        item.link.classList.toggle("is-active", isActive);

        if (isActive) {
          item.tick.setAttribute("aria-current", "location");
          item.link.setAttribute("aria-current", "location");
        } else {
          item.tick.removeAttribute("aria-current");
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
