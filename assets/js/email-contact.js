(function () {
  var contact = document.querySelector("[data-email-contact]");
  var toggle = document.querySelector("[data-email-toggle]");

  if (!contact || !toggle) return;

  var address = contact.querySelector("[data-email-address]");
  var copyButton = contact.querySelector("[data-email-copy]");
  var status = contact.querySelector("[data-email-status]");
  var domain = contact.dataset.emailDomainReversed.split("").reverse().join("");
  var email = contact.dataset.emailUser + "@" + domain;
  var resetTimer;

  address.textContent = email;
  address.href = "mailto:" + email;

  function setOpen(open) {
    toggle.setAttribute("aria-expanded", String(open));
    contact.hidden = !open;
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }

    return new Promise(function (resolve, reject) {
      var textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();

      try {
        if (document.execCommand("copy")) {
          resolve();
        } else {
          reject(new Error("Copy command failed"));
        }
      } catch (error) {
        reject(error);
      } finally {
        textarea.remove();
      }
    });
  }

  toggle.addEventListener("click", function () {
    setOpen(toggle.getAttribute("aria-expanded") !== "true");
  });

  copyButton.addEventListener("click", function () {
    copyText(email).then(function () {
      window.clearTimeout(resetTimer);
      copyButton.classList.add("is-copied");
      copyButton.setAttribute("aria-label", "Email address copied");
      copyButton.title = "Copied";
      status.textContent = "Email address copied";

      resetTimer = window.setTimeout(function () {
        copyButton.classList.remove("is-copied");
        copyButton.setAttribute("aria-label", "Copy email address");
        copyButton.title = "Copy email address";
        status.textContent = "";
      }, 1600);
    });
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
      setOpen(false);
      toggle.focus();
    }
  });
})();
