(function () {
  var toc = document.querySelector("[data-post-toc]");
  var list = document.querySelector("[data-post-toc-list]");
  var body = document.querySelector(".post-body");

  if (!body) return;

  var headings = Array.prototype.slice.call(body.querySelectorAll("h2, h3"));
  if (!headings.length) return;

  var buildToc = toc && list && headings.length >= 2;

  var usedIds = {};
  var currentSection = null;
  var currentSublist = null;

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
}());
