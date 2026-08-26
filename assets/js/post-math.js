(function () {
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

  function enhanceMath() {
    document.querySelectorAll(".math-display[data-tex]").forEach(function (display) {
      if (display.dataset.mathEnhanced === "true") return;

      var renderedMath = display.querySelector("mjx-container[display='true']");
      if (!renderedMath) return;

      var scrollArea = document.createElement("div");
      scrollArea.className = "math-display-scroll";
      display.insertBefore(scrollArea, renderedMath);
      scrollArea.appendChild(renderedMath);

      var button = document.createElement("button");
      button.className = "math-copy-button";
      button.type = "button";
      button.textContent = "Copy LaTeX";
      button.setAttribute("aria-label", "Copy equation as LaTeX");

      button.addEventListener("click", function () {
        copyText(display.dataset.tex).then(function () {
          button.classList.add("is-copied");
          button.textContent = "Copied";

          window.setTimeout(function () {
            button.classList.remove("is-copied");
            button.textContent = "Copy LaTeX";
          }, 1200);
        }).catch(function () {
          button.textContent = "Select equation";
        });
      });

      display.appendChild(button);
      display.dataset.mathEnhanced = "true";
    });
  }

  function latexToken(element) {
    if (element.classList.contains("math-display")) {
      return "\\[\n" + element.dataset.tex + "\n\\]";
    }

    return "\\(" + element.dataset.tex + "\\)";
  }

  function selectionWithLatex(selection) {
    if (!selection || selection.isCollapsed || !selection.rangeCount) return null;

    var range = selection.getRangeAt(0);
    var postBody = document.querySelector(".post-body");
    if (!postBody || !postBody.contains(range.commonAncestorContainer)) return null;

    var selectedMath = Array.prototype.filter.call(
      postBody.querySelectorAll(".math[data-tex], .math-display[data-tex]"),
      function (element) {
        try {
          return range.intersectsNode(element);
        } catch (error) {
          return false;
        }
      }
    );

    if (!selectedMath.length) return null;

    if (selectedMath.length === 1 && selectedMath[0].contains(range.commonAncestorContainer)) {
      return latexToken(selectedMath[0]);
    }

    var holder = document.createElement("div");
    holder.appendChild(range.cloneContents());

    holder.querySelectorAll(".math[data-tex], .math-display[data-tex]").forEach(function (element) {
      element.replaceWith(document.createTextNode(latexToken(element)));
    });

    holder.querySelectorAll(".math-copy-button").forEach(function (button) {
      button.remove();
    });

    holder.style.position = "fixed";
    holder.style.left = "-100000px";
    holder.style.top = "0";
    holder.style.width = "65ch";
    holder.style.whiteSpace = "normal";
    document.body.appendChild(holder);

    var text = holder.innerText;
    holder.remove();
    return text;
  }

  document.addEventListener("copy", function (event) {
    var text = selectionWithLatex(window.getSelection());
    if (!text || !event.clipboardData) return;

    event.preventDefault();
    event.clipboardData.setData("text/plain", text);
  });

  if (window.MathJax && window.MathJax.startup && window.MathJax.startup.promise) {
    window.MathJax.startup.promise.then(enhanceMath);
  } else {
    window.addEventListener("load", enhanceMath);
  }
}());
