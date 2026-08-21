(function () {
  var root = document.documentElement;
  var button = document.querySelector("[data-theme-toggle]");
  var label = document.querySelector("[data-theme-label]");

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

  updateLabel();
}());
