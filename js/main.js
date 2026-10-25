/* Demo behaviour. Update contact routing only after the studio approves a channel. */
(function () {
  "use strict";

  var S = window.SITE;
  var $ = function (selector, root) {
    return (root || document).querySelector(selector);
  };

  document.querySelectorAll("[data-brand]").forEach(function (element) {
    element.textContent = S.brand;
  });
  $("#year").textContent = new Date().getFullYear();

  var toggle = $(".nav-toggle");
  var nav = $("#nav");
  toggle.addEventListener("click", function () {
    var open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open);
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });
  nav.addEventListener("click", function (event) {
    if (event.target.closest("a")) {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open menu");
    }
  });

  var grid = $("#grid");
  S.projectPhotos.forEach(function (photo) {
    var figure = document.createElement("figure");
    figure.className = "project-photo";
    var image = document.createElement("img");
    image.src = photo.img;
    image.alt = photo.alt;
    image.loading = "lazy";
    image.width = 1200;
    image.height = 750;
    var caption = document.createElement("figcaption");
    caption.textContent = photo.title;
    figure.append(image, caption);
    grid.appendChild(figure);
  });

  var instagramLink = "https://www.instagram.com/tatvamasi_studio/";
  $("#igLink").href = S.instagram || instagramLink;
  $("#igFoot").href = S.instagram || instagramLink;

  var form = $("#form");
  var formMessage = $("#formMsg");
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (S.demoOnly) {
      formMessage.textContent = "Demo only: nothing was sent or saved. The studio's preferred contact method needs to be confirmed.";
      formMessage.classList.add("demo-message");
    }
  });
})();
