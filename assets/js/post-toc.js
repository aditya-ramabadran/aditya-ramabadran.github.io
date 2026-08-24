(function () {
  var toc = document.querySelector("[data-post-toc]");
  var list = document.querySelector("[data-post-toc-list]");
  var body = document.querySelector(".post-body");

  if (!toc || !list || !body) return;

  var headings = Array.prototype.slice.call(body.querySelectorAll("h2, h3"));
  if (headings.length < 2) return;

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

  headings.forEach(function (heading, index) {
    var baseId = heading.id || slugify(heading.textContent) || "section-" + (index + 1);
    var id = baseId;
    var suffix = 2;

    while (usedIds[id] || (document.getElementById(id) && document.getElementById(id) !== heading)) {
      id = baseId + "-" + suffix;
      suffix += 1;
    }

    usedIds[id] = true;
    heading.id = id;

    var item = document.createElement("li");
    var link = document.createElement("a");
    link.href = "#" + id;
    link.textContent = heading.textContent;
    item.appendChild(link);

    if (heading.tagName === "H2") {
      list.appendChild(item);
      currentSection = item;
      currentSublist = null;
      return;
    }

    if (currentSection) {
      if (!currentSublist) {
        currentSublist = document.createElement("ol");
        currentSublist.className = "post-toc-sublist";
        currentSection.appendChild(currentSublist);
      }
      currentSublist.appendChild(item);
    } else {
      list.appendChild(item);
    }
  });

  toc.hidden = false;
}());
