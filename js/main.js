/* Site behaviour. Content lives in data/media.js (edit that, not this).
   Runs on file:// (double-click index.html) or any local server like VS Code Live Server. */
(function () {
  "use strict";
  var S = window.SITE, $ = function (s, r) { return (r || document).querySelector(s); };

  /* Placeholder: a tinted SVG shown whenever a real image file is missing */
  function placeholder(label, i) {
    var tones = ["#d8c7b0", "#c9b59a", "#bba68b", "#e0d3c0"];
    var svg = "<svg xmlns='http://www.w3.org/2000/svg' width='800' height='1000'><rect width='100%' height='100%' fill='" +
      tones[i % 4] + "'/><text x='50%' y='50%' fill='#6b5a46' font-family='sans-serif' font-size='28' text-anchor='middle'>" +
      String(label).replace(/[<>&']/g, "") + "</text></svg>";
    return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
  }
  function setImg(img, src, alt, label, i) {
    img.alt = alt || "";
    img.onerror = function () { img.onerror = null; img.src = placeholder(label || "Photo", i || 0); };
    img.src = src;
  }

  /* Brand + contact */
  document.querySelectorAll("[data-brand]").forEach(function (el) { el.textContent = S.brand; });
  $("#year").textContent = new Date().getFullYear();
  var navContact = $("#navContactIcon"), navContactLabel = $("#navContactLabel");
  var whatsappNumber = String(S.whatsapp || "").replace(/\D/g, "");
  if (/^\d{8,15}$/.test(whatsappNumber)) {
    navContact.href = "https://wa.me/" + whatsappNumber;
    navContactLabel.textContent = "WhatsApp";
    navContact.setAttribute("aria-label", "WhatsApp " + S.brand);
  } else if (/^\+?[\d\s()-]{8,}$/.test(S.phone)) {
    navContact.href = "tel:" + S.phone.replace(/[^\d+]/g, "");
    navContactLabel.textContent = "Call";
    navContact.setAttribute("aria-label", "Call " + S.brand);
  } else {
    navContact.removeAttribute("href");
    navContact.setAttribute("aria-disabled", "true");
    navContact.title = "Add the studio phone or WhatsApp number in data/media.js";
  }
  var trustList = $("#trustList");
  (S.trust || []).forEach(function (point) {
    var item = document.createElement("li");
    item.textContent = point;
    trustList.appendChild(item);
  });
  $("#trustStrip").hidden = !trustList.children.length;
  var phoneLink = $("#cPhone"), emailLink = $("#cMail"), emailFallback = $("#emailFallback");
  var hasPhone = /^\+?[\d\s()-]{8,}$/.test(S.phone);
  phoneLink.textContent = S.phone;
  if (hasPhone) phoneLink.href = "tel:" + S.phone.replace(/[^\d+]/g, "");
  else { phoneLink.removeAttribute("href"); phoneLink.setAttribute("aria-disabled", "true"); }
  emailLink.textContent = S.email;
  var hasEmail = /^\S+@\S+\.\S+$/.test(S.email);
  if (hasEmail) emailLink.href = "mailto:" + S.email;
  else { emailLink.removeAttribute("href"); emailLink.setAttribute("aria-disabled", "true"); }
  emailFallback.href = hasEmail ? "mailto:" + S.email + "?subject=" + encodeURIComponent("Interior design enquiry") : "#";
  if (!hasEmail) {
    emailFallback.hidden = true;
  }
  $("#cCity").textContent = S.city;
  $("#igLink").href = S.instagramReels || S.instagram;
  $("#igFoot").href = S.instagram;
  if (S.address) {
    $("#directionsLink").href = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(S.address);
    $("#directionsItem").hidden = false;
  }
  setImg($("#heroImg"), S.hero.img, S.hero.alt, "Hero photo", 0);
  setImg($("#caseImg"), S.caseStudy.img, S.caseStudy.alt, "Featured project", 1);

  /* Mobile nav */
  var toggle = $(".nav-toggle"), nav = $("#nav");
  toggle.addEventListener("click", function () {
    var open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open);
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });
  nav.addEventListener("click", function (e) {
    if (e.target.closest("a")) {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open menu");
    }
  });

  /* Portfolio grid + filter + lightbox */
  var grid = $("#grid"), lb = $("#lightbox"), activeProject = 0;
  $("#projectEmpty").hidden = S.projects.length > 0;
  S.projects.forEach(function (p, i) {
    var b = document.createElement("button");
    b.className = "tile"; b.dataset.cat = p.category;
    b.setAttribute("aria-label", "View " + p.title);
    var img = document.createElement("img");
    img.loading = "lazy"; img.width = 400; img.height = 500;
    setImg(img, p.img, p.alt, p.title, i);
    var cap = document.createElement("span"); cap.textContent = p.title;
    b.append(img, cap);
    b.addEventListener("click", function () {
      activeProject = i;
      var big = $("img", lb); setImg(big, img.src, p.alt, p.title, i);
      $("p", lb).textContent = p.title;
      lb.showModal();
      $(".lb-close", lb).focus();
    });
    grid.appendChild(b);
  });
  function showProject(index) {
    if (!S.projects.length) return;
    activeProject = (index + S.projects.length) % S.projects.length;
    var p = S.projects[activeProject], big = $("img", lb);
    setImg(big, p.img, p.alt, p.title, activeProject);
    $("p", lb).textContent = p.title;
  }
  document.querySelectorAll(".filters .chip").forEach(function (c) {
    c.addEventListener("click", function () {
      document.querySelectorAll(".filters .chip").forEach(function (x) { x.classList.toggle("active", x === c); });
      grid.querySelectorAll(".tile").forEach(function (t) {
        t.hidden = !(c.dataset.filter === "all" || t.dataset.cat === c.dataset.filter);
      });
    });
  });
  $(".lb-close", lb).addEventListener("click", function () { lb.close(); });
  $(".lb-prev", lb).addEventListener("click", function () { showProject(activeProject - 1); });
  $(".lb-next", lb).addEventListener("click", function () { showProject(activeProject + 1); });
  lb.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") { e.preventDefault(); showProject(activeProject - 1); }
    if (e.key === "ArrowRight") { e.preventDefault(); showProject(activeProject + 1); }
    if (e.key !== "Tab") return;
    var focusable = Array.prototype.slice.call(lb.querySelectorAll("button:not([hidden])"));
    var first = focusable[0], last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
  lb.addEventListener("click", function (e) { if (e.target === lb) lb.close(); }); /* click backdrop to close */

  /* Reels */
  $("#reelEmpty").hidden = S.reels.length > 0;
  S.reels.forEach(function (r, i) {
    var w = document.createElement("figure"); w.className = "reel";
    var v = document.createElement("video");
    v.controls = true; v.preload = "none"; v.playsInline = true;
    v.width = 360; v.height = 640;
    v.poster = placeholder(r.title, i);
    var probe = new Image(); probe.onload = function () { v.poster = r.poster; }; probe.src = r.poster;
    v.src = r.src;
    v.setAttribute("aria-label", r.title);
    var c = document.createElement("p"); c.textContent = r.title;
    w.append(v, c); $("#reelList").appendChild(w);
  });
  var instagramPosts = (S.instagramPosts || []).filter(function (url, i, all) {
    return /^https:\/\/www\.instagram\.com\/(?:p|reel)\/[\w-]+\/?$/.test(url) && all.indexOf(url) === i;
  });
  $("#reelEmpty").hidden = S.reels.length + instagramPosts.length > 0;
  instagramPosts.forEach(function (url, i) {
    var item = document.createElement("article");
    item.className = "reel reel-embed";
    var frame = document.createElement("iframe");
    frame.src = url.replace(/\/$/, "") + "/embed";
    frame.title = "Tatwamasi Studio Instagram post " + (i + 1);
    frame.loading = "lazy";
    frame.allowFullscreen = true;
    var link = document.createElement("a");
    link.className = "reel-link";
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener";
    link.setAttribute("aria-label", "Watch Tatwamasi Studio video on Instagram, post " + (i + 1));
    var linkText = document.createElement("span");
    linkText.textContent = "Watch on Instagram";
    var linkArrow = document.createElement("span");
    linkArrow.setAttribute("aria-hidden", "true");
    linkArrow.textContent = "\u2197";
    link.append(linkText, linkArrow);
    item.append(frame, link);
    $("#reelList").appendChild(item);
  });
  if (instagramPosts.length > 1) {
    var duplicate = $("#reelList").cloneNode(true);
    duplicate.removeAttribute("id");
    duplicate.setAttribute("aria-hidden", "true");
    duplicate.querySelectorAll("iframe, a").forEach(function (el) { el.tabIndex = -1; });
    $("#reelTrack").appendChild(duplicate);
  }

  /* Contact form: validates, then opens WhatsApp with the details.
     Change to mailto: or a form service later if preferred. */
  var form = $("#form"), msg = $("#formMsg");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var f = form.elements, bad = [], errors = {
      name: "Please enter your name.",
      phone: "Please enter a valid phone number (at least 8 digits).",
      email: "Please enter a valid email address or leave this field blank.",
      msg: "Please tell us a little about your project."
    };
    var checks = {
      name: f.name.value.trim().length > 1,
      phone: /^[+\d][\d\s()-]{7,}$/.test(f.phone.value.trim()) && f.phone.value.replace(/\D/g, "").length >= 8,
      email: !f.email.value.trim() || /^\S+@\S+\.\S+$/.test(f.email.value.trim()),
      msg: f.msg.value.trim().length > 1
    };
    Object.keys(checks).forEach(function (k) {
      var error = $("#" + (k === "msg" ? "messageError" : k + "Error"));
      f[k].classList.toggle("invalid", !checks[k]);
      error.textContent = checks[k] ? "" : errors[k];
      if (!checks[k]) bad.push(k);
    });
    msg.classList.remove("ok");
    if (bad.length) { msg.textContent = "Please correct the highlighted fields."; f[bad[0]].focus(); return; }
    if (!/^\d{8,15}$/.test(S.whatsapp)) {
      msg.textContent = "WhatsApp is not configured yet. Update [WHATSAPP] in data/media.js before submitting enquiries.";
      return;
    }
    var text = "Hi, I'm " + f.name.value + " (" + f.phone.value + "). Project: " + f.type.value + ". " + f.msg.value;
    msg.textContent = "Thank you! Opening WhatsApp..."; msg.classList.add("ok");
    window.open("https://wa.me/" + S.whatsapp + "?text=" + encodeURIComponent(text), "_blank", "noopener");
    form.reset();
  });

  /* Back to top */
  var top = $("#toTop");
  window.addEventListener("scroll", function () { top.hidden = window.scrollY < 600; }, { passive: true });
  top.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });
})();
