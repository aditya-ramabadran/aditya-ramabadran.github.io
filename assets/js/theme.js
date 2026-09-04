(function () {
  var root = document.documentElement;
  var button = document.querySelector("[data-theme-toggle]");
  var label = document.querySelector("[data-theme-label]");
  var systemTheme = window.matchMedia("(prefers-color-scheme: dark)");

  function updateLabel() {
    if (!label) return;
    label.textContent = root.dataset.theme === "dark" ? "Light mode" : "Dark mode";
  }

  if (button) {
    button.addEventListener("click", function () {
      var next = root.dataset.theme === "dark" ? "light" : "dark";
      root.dataset.theme = next;
      localStorage.setItem("theme", next);
      updateLabel();
    });
  }

  function followSystemTheme(event) {
    if (localStorage.getItem("theme")) return;
    root.dataset.theme = event.matches ? "dark" : "light";
    updateLabel();
  }

  if (typeof systemTheme.addEventListener === "function") {
    systemTheme.addEventListener("change", followSystemTheme);
  }

  updateLabel();
}());
