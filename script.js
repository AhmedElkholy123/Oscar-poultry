const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-menu");
const topbarActions = document.querySelector(".topbar-actions");
const navLinks = document.querySelectorAll(".nav-menu a");
const langSwitch = document.querySelector(".lang-switch");
const revealItems = document.querySelectorAll(".reveal");
const contactForm = document.querySelector(".contact-form");
const currentPage = window.location.pathname.split("/").pop() || "index.html";
const whatsappNumber = "201000726196";
const productPages = new Set([
  "products.html",
  "feeding-systems.html",
  "water-systems.html",
  "heating.html",
  "heating-ventilation.html",
  "hatching-machines.html",
  "drinkers-feeders.html",
  "poultry-batteries.html",
  "generators.html",
  "water-pumps.html",
  "feather-cleaners.html",
  "sanitizing-sprayers.html",
  "scales.html",
]);

if (navToggle && topbarActions) {
  navToggle.addEventListener("click", () => {
    const isOpen = topbarActions.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
    document.body.classList.toggle("menu-open", isOpen);
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      topbarActions.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("menu-open");
    });
  });

  if (langSwitch) {
    langSwitch.addEventListener("click", () => {
      topbarActions.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("menu-open");
    });
  }
}

navLinks.forEach((link) => {
  const href = link.getAttribute("href");
  if (!href) {
    return;
  }

  if (
    href === currentPage ||
    (currentPage === "" && href === "index.html") ||
    (href === "products.html" && productPages.has(currentPage))
  ) {
    link.classList.add("is-active");
  }
});

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    },
    {
      threshold: 0.2,
    }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!contactForm.reportValidity()) {
      return;
    }

    const existingMessage = contactForm.querySelector(".form-success");
    if (existingMessage) {
      existingMessage.remove();
    }

    const formData = new FormData(contactForm);
    const isEnglish = document.documentElement.lang === "en";
    const name = String(formData.get("name") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const request = String(formData.get("request") || "").trim();
    const details = String(formData.get("details") || "").trim();
    const messageLines = isEnglish
      ? [
          "Hello Oscar Poultry,",
          "I would like to request a quote.",
          `Name: ${name}`,
          `Phone: ${phone}`,
          `Request Type: ${request}`,
          `Details: ${details}`,
        ]
      : [
          "السلام عليكم شركة أوسكار،",
          "أرغب في طلب عرض سعر.",
          `الاسم: ${name}`,
          `رقم الهاتف: ${phone}`,
          `نوع الطلب: ${request}`,
          `التفاصيل: ${details}`,
        ];
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
      messageLines.join("\n")
    )}`;

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");

    const message = document.createElement("p");
    message.className = "form-success";
    message.textContent =
      isEnglish
        ? "Your message is ready and WhatsApp has been opened so you can send it directly."
        : "تم تجهيز رسالتك وفتح واتساب حتى ترسل الطلب مباشرة.";
    contactForm.appendChild(message);
    contactForm.reset();
  });
}

function buildQuoteMessage(productName, sectionName) {
  const isEnglish = document.documentElement.lang === "en";

  if (isEnglish) {
    return [
      "Hello Oscar Poultry,",
      `I would like a quote for: ${productName}`,
      `Section: ${sectionName}`,
      "Required quantity:",
      "Location:",
      "Additional details:",
    ].join("\n");
  }

  return [
    "السلام عليكم شركة أوسكار،",
    `أرغب في طلب عرض سعر للمنتج: ${productName}`,
    `القسم: ${sectionName}`,
    "الكمية المطلوبة:",
    "الموقع:",
    "تفاصيل إضافية:",
  ].join("\n");
}

function getProductSpecsContent(card, sectionHeading) {
  const isEnglish = document.documentElement.lang === "en";
  const productTag =
    card.querySelector(".catalog-product-tag")?.textContent.trim() ||
    sectionHeading ||
    (isEnglish ? "Poultry product" : "منتج دواجن");

  if (isEnglish) {
    return {
      title: "Quick Specs",
      items: [
        {
          label: "Material",
          value: card.dataset.specMaterial || "Depends on model",
        },
        {
          label: "Size",
          value: card.dataset.specSize || "Available by request",
        },
        {
          label: "Use",
          value: card.dataset.specUse || productTag,
        },
        {
          label: "Supply",
          value: card.dataset.specSupply || "Ask about availability",
        },
      ],
    };
  }

  return {
    title: "مواصفات سريعة",
    items: [
      {
        label: "الخامة",
        value: card.dataset.specMaterial || "حسب الموديل",
      },
      {
        label: "المقاس",
        value: card.dataset.specSize || "حسب الطلب",
      },
      {
        label: "الاستخدام",
        value: card.dataset.specUse || productTag,
      },
      {
        label: "التوريد",
        value: card.dataset.specSupply || "اسأل عن التوفر",
      },
    ],
  };
}

function createProductSpecsPanels() {
  const sectionHeading =
    document.querySelector(".page-hero .eyebrow")?.textContent.trim() ||
    document.querySelector(".page-hero h1")?.textContent.trim() ||
    "";

  document.querySelectorAll(".catalog-product-card").forEach((card) => {
    if (card.querySelector(".product-specs-panel")) {
      return;
    }

    const copy = card.querySelector(".catalog-product-copy");

    if (!copy) {
      return;
    }

    const specContent = getProductSpecsContent(card, sectionHeading);
    const specsPanel = document.createElement("section");
    const specsTitle = document.createElement("strong");
    const specsGrid = document.createElement("div");
    const featureList = copy.querySelector(".catalog-feature-list");

    specsPanel.className = "product-specs-panel";
    specsTitle.className = "product-specs-title";
    specsTitle.textContent = specContent.title;
    specsGrid.className = "product-specs-grid";

    specContent.items.forEach((item) => {
      const specItem = document.createElement("div");
      const specLabel = document.createElement("span");
      const specValue = document.createElement("strong");

      specItem.className = "product-spec-item";
      specLabel.className = "product-spec-label";
      specValue.className = "product-spec-value";

      specLabel.textContent = item.label;
      specValue.textContent = item.value;

      specItem.appendChild(specLabel);
      specItem.appendChild(specValue);
      specsGrid.appendChild(specItem);
    });

    specsPanel.appendChild(specsTitle);
    specsPanel.appendChild(specsGrid);

    if (featureList) {
      featureList.insertAdjacentElement("afterend", specsPanel);
      return;
    }

    copy.appendChild(specsPanel);
  });
}

function createProductQuoteButtons() {
  const sectionHeading =
    document.querySelector(".page-hero .eyebrow")?.textContent.trim() ||
    document.querySelector(".page-hero h1")?.textContent.trim() ||
    "";

  document.querySelectorAll(".catalog-product-card").forEach((card) => {
    if (card.querySelector(".product-quote-actions")) {
      return;
    }

    const copy = card.querySelector(".catalog-product-copy");
    const title = card.querySelector("h3");

    if (!copy || !title) {
      return;
    }

    const actions = document.createElement("div");
    const whatsappLink = document.createElement("a");
    const productName = title.textContent.trim();

    actions.className = "product-quote-actions";
    whatsappLink.className = "button button-primary product-quote-button";
    whatsappLink.href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
      buildQuoteMessage(productName, sectionHeading)
    )}`;
    whatsappLink.target = "_blank";
    whatsappLink.rel = "noreferrer";
    whatsappLink.textContent =
      document.documentElement.lang === "en"
        ? "Request Price on WhatsApp"
        : "اطلب السعر على واتساب";

    actions.appendChild(whatsappLink);
    copy.appendChild(actions);
  });
}

function getContactWidgetCopy() {
  if (document.documentElement.lang === "en") {
    return {
      toggleTitle: "Contact Us",
      toggleText: "Call, WhatsApp & more",
      toggleAria: "Open contact options",
      closeAria: "Close contact options",
      items: [
        {
          type: "call",
          label: "Call",
          value: "01222471174",
          href: "tel:+201222471174",
        },
        {
          type: "whatsapp",
          label: "WhatsApp",
          value: "01000726196",
          href: "https://wa.me/201000726196",
          newTab: true,
        },
        {
          type: "facebook",
          label: "Facebook",
          value: "Oscar Poultry",
          href: "https://www.facebook.com/share/1BPdQzp5FL/",
          newTab: true,
        },
        {
          type: "gmail",
          label: "Gmail",
          value: "oskar.poultry@gmail.com",
          href: "mailto:oskar.poultry@gmail.com",
        },
      ],
    };
  }

  return {
    toggleTitle: "تواصل معنا",
    toggleText: "اتصال وواتساب والمزيد",
    toggleAria: "فتح وسائل التواصل",
    closeAria: "إغلاق وسائل التواصل",
    items: [
      {
        type: "call",
        label: "اتصال مباشر",
        value: "01222471174",
        href: "tel:+201222471174",
      },
      {
        type: "whatsapp",
        label: "واتساب",
        value: "01000726196",
        href: "https://wa.me/201000726196",
        newTab: true,
      },
      {
        type: "facebook",
        label: "فيسبوك",
        value: "Oscar Poultry",
        href: "https://www.facebook.com/share/1BPdQzp5FL/",
        newTab: true,
      },
      {
        type: "gmail",
        label: "Gmail",
        value: "oskar.poultry@gmail.com",
        href: "mailto:oskar.poultry@gmail.com",
      },
    ],
  };
}

function getContactIcon(type) {
  if (type === "call") {
    return `
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M6.6 10.8a15.4 15.4 0 0 0 6.6 6.6l2.2-2.2a1.2 1.2 0 0 1 1.2-.3c1 .3 2 .4 3 .4a1.2 1.2 0 0 1 1.2 1.2V20a1.2 1.2 0 0 1-1.2 1.2A18.8 18.8 0 0 1 2.8 4.4 1.2 1.2 0 0 1 4 3.2h3.5A1.2 1.2 0 0 1 8.7 4.4c0 1 .1 2 .4 3a1.2 1.2 0 0 1-.3 1.2z"></path>
      </svg>
    `;
  }

  if (type === "whatsapp") {
    return `
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M20 11.7A8.1 8.1 0 0 0 6.1 6.1a8 8 0 0 0-1.7 8.7L3 21l6.4-1.3a8.1 8.1 0 0 0 10.6-8zm-8 6.5a6.5 6.5 0 0 1-3.3-.9l-.5-.3-3.8.8.8-3.7-.3-.6a6.5 6.5 0 1 1 7.1 4.7zm3.7-4.9c-.2-.1-1.3-.6-1.5-.7-.2-.1-.4-.1-.5.1l-.7.8c-.1.2-.3.2-.5.1a5.4 5.4 0 0 1-2.7-2.4c-.1-.2 0-.3.1-.5l.4-.5.2-.4a.6.6 0 0 0 0-.5l-.7-1.6c-.2-.3-.4-.3-.5-.3h-.5a1 1 0 0 0-.7.4 2.9 2.9 0 0 0-.9 2.1 5 5 0 0 0 1 2.6 11.4 11.4 0 0 0 4.3 3.8 5.2 5.2 0 0 0 2 .7 2.4 2.4 0 0 0 1.7-.4 2 2 0 0 0 .8-1.3c0-.2 0-.4-.2-.4z"></path>
      </svg>
    `;
  }

  if (type === "facebook") {
    return `
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M13.5 21v-7.6H16l.4-3h-2.9V8.4c0-.9.2-1.5 1.5-1.5h1.6V4.2c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.3H8v3h2.4V21z"></path>
      </svg>
    `;
  }

  return `
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M3.8 6.2A2.2 2.2 0 0 1 6 4h12a2.2 2.2 0 0 1 2.2 2.2v11.6A2.2 2.2 0 0 1 18 20H6a2.2 2.2 0 0 1-2.2-2.2zm2 .4v.3l6.2 4.7 6.2-4.7v-.3a.3.3 0 0 0-.3-.3H6a.3.3 0 0 0-.2.3zm12.4 2.9-5.5 4.1a1.2 1.2 0 0 1-1.4 0L5.8 9.5v8.3c0 .2 0 .3.2.3h12c.2 0 .3-.1.3-.3z"></path>
    </svg>
  `;
}

function createFloatingContactWidget() {
  document.querySelectorAll(".floating-whatsapp").forEach((item) => item.remove());

  if (document.querySelector(".floating-contact")) {
    return;
  }

  const copy = getContactWidgetCopy();
  const widget = document.createElement("aside");
  widget.className = "floating-contact";

  const listMarkup = copy.items
    .map((item) => {
      const target = item.newTab ? ' target="_blank" rel="noreferrer"' : "";

      return `
        <a class="floating-contact-link floating-contact-link--${item.type}" href="${item.href}"${target}>
          <span class="floating-contact-link-icon" aria-hidden="true">${getContactIcon(item.type)}</span>
          <span class="floating-contact-link-copy">
            <strong>${item.label}</strong>
            <small>${item.value}</small>
          </span>
        </a>
      `;
    })
    .join("");

  widget.innerHTML = `
    <div class="floating-contact-list" aria-label="${copy.toggleTitle}">
      ${listMarkup}
    </div>
    <button class="floating-contact-toggle" type="button" aria-expanded="false" aria-label="${copy.toggleAria}">
      <span class="floating-contact-link-icon floating-contact-link-icon--toggle" aria-hidden="true">${getContactIcon("call")}</span>
      <span class="floating-contact-link-copy">
        <strong>${copy.toggleTitle}</strong>
        <small>${copy.toggleText}</small>
      </span>
    </button>
  `;

  document.body.appendChild(widget);

  const toggle = widget.querySelector(".floating-contact-toggle");

  if (!toggle) {
    return;
  }

  const setOpenState = (isOpen) => {
    widget.classList.toggle("is-open", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute("aria-label", isOpen ? copy.closeAria : copy.toggleAria);
  };

  toggle.addEventListener("click", () => {
    setOpenState(!widget.classList.contains("is-open"));
  });

  document.addEventListener("click", (event) => {
    if (!widget.contains(event.target)) {
      setOpenState(false);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setOpenState(false);
    }
  });
}

function getFooterMapCopy() {
  if (document.documentElement.lang === "en") {
    return {
      title: "View on Map",
      text: "Open Oscar Poultry location in Google Maps",
      aria: "Open Oscar Poultry location in Google Maps",
      url: "https://maps.app.goo.gl/SV87ST5RS8LtewNp7",
    };
  }

  return {
    title: "الموقع على الخريطة",
    text: "افتح موقع أوسكار على Google Maps",
    aria: "فتح موقع أوسكار على خرائط جوجل",
    url: "https://maps.app.goo.gl/SV87ST5RS8LtewNp7",
  };
}

function createFooterMapLink() {
  const footer = document.querySelector(".footer");

  if (!footer || footer.querySelector(".footer-map-card")) {
    return;
  }

  const copy = getFooterMapCopy();
  const mapUrl =
    copy.url ||
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(copy.query || "")}`;
  const mapCard = document.createElement("a");

  mapCard.className = "footer-map-card";
  mapCard.href = mapUrl;
  mapCard.target = "_blank";
  mapCard.rel = "noreferrer";
  mapCard.setAttribute("aria-label", copy.aria);
  mapCard.innerHTML = `
    <span class="footer-map-mini" aria-hidden="true">
      <span class="footer-map-pin">
        <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
          <path d="M12 2.8a6.4 6.4 0 0 0-6.4 6.4c0 4.5 5 10.5 5.7 11.3a.9.9 0 0 0 1.4 0c.8-.8 5.7-6.8 5.7-11.3A6.4 6.4 0 0 0 12 2.8zm0 8.9a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"></path>
        </svg>
      </span>
    </span>
    <span class="footer-map-copy">
      <strong>${copy.title}</strong>
      <small>${copy.text}</small>
    </span>
  `;

  footer.appendChild(mapCard);
}

function getFooterContactType(link) {
  const href = link.getAttribute("href") || "";

  if (href.startsWith("https://wa.me/")) {
    return "whatsapp";
  }

  if (href.startsWith("tel:")) {
    return "call";
  }

  if (href.startsWith("mailto:")) {
    return "gmail";
  }

  if (href.includes("facebook.com")) {
    return "facebook";
  }

  return "";
}

function enhanceFooterContactLinks() {
  const footer = document.querySelector(".footer");

  if (!footer) {
    return;
  }

  footer.querySelectorAll(".footer-links a").forEach((link) => {
    const type = getFooterContactType(link);

    if (!type) {
      return;
    }

    link.classList.add("footer-contact-link", `footer-contact-link--${type}`);
    link.closest(".footer-links")?.classList.add("footer-links--contact");

    if (link.querySelector(".footer-contact-link-icon")) {
      return;
    }

    const icon = document.createElement("span");
    icon.className = "footer-contact-link-icon";
    icon.setAttribute("aria-hidden", "true");
    icon.innerHTML = getContactIcon(type);
    link.prepend(icon);
  });
}

function initCatalogMediaSliders() {
  const sliders = document.querySelectorAll(".catalog-media-slider");

  if (!sliders.length) {
    return;
  }

  const isEnglish = document.documentElement.lang === "en";
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  sliders.forEach((slider) => {
    const slides = Array.from(slider.querySelectorAll(".catalog-media-slide"));

    if (!slides.length) {
      return;
    }

    let activeIndex = slides.findIndex((slide) => slide.classList.contains("is-active"));

    if (activeIndex < 0) {
      activeIndex = 0;
    }

    const interval = Number.parseInt(slider.dataset.sliderInterval || "5000", 10);
    const dots = slides.length > 1 ? document.createElement("div") : null;
    let timerId = 0;

    if (dots) {
      dots.className = "catalog-media-dots";
      dots.setAttribute("aria-label", isEnglish ? "Image navigation" : "التنقل بين الصور");

      slides.forEach((_, index) => {
        const dot = document.createElement("button");

        dot.type = "button";
        dot.className = "catalog-media-dot";
        dot.setAttribute(
          "aria-label",
          isEnglish ? `Show image ${index + 1}` : `عرض الصورة ${index + 1}`
        );

        dot.addEventListener("click", () => {
          setActiveSlide(index);
          restartAutoplay();
        });

        dots.appendChild(dot);
      });

      slider.appendChild(dots);
    }

    function setActiveSlide(index) {
      activeIndex = index;

      slides.forEach((slide, slideIndex) => {
        const isActive = slideIndex === activeIndex;
        slide.classList.toggle("is-active", isActive);
        slide.setAttribute("aria-hidden", String(!isActive));
      });

      if (!dots) {
        return;
      }

      Array.from(dots.children).forEach((dot, dotIndex) => {
        dot.classList.toggle("is-active", dotIndex === activeIndex);
      });
    }

    function stopAutoplay() {
      if (timerId) {
        window.clearInterval(timerId);
        timerId = 0;
      }
    }

    function startAutoplay() {
      if (prefersReducedMotion || slides.length < 2) {
        return;
      }

      stopAutoplay();
      timerId = window.setInterval(() => {
        const nextIndex = (activeIndex + 1) % slides.length;
        setActiveSlide(nextIndex);
      }, interval);
    }

    function restartAutoplay() {
      stopAutoplay();
      startAutoplay();
    }

    slider.addEventListener("mouseenter", stopAutoplay);
    slider.addEventListener("mouseleave", startAutoplay);
    slider.addEventListener("focusin", stopAutoplay);
    slider.addEventListener("focusout", (event) => {
      if (!slider.contains(event.relatedTarget)) {
        startAutoplay();
      }
    });

    setActiveSlide(activeIndex);
    startAutoplay();
  });
}

if (document.readyState === "loading") {
  document.addEventListener(
    "DOMContentLoaded",
    () => {
      createFloatingContactWidget();
      initCatalogMediaSliders();
      createProductSpecsPanels();
      createProductQuoteButtons();
      createFooterMapLink();
      enhanceFooterContactLinks();
    },
    {
      once: true,
    }
  );
} else {
  createFloatingContactWidget();
  initCatalogMediaSliders();
  createProductSpecsPanels();
  createProductQuoteButtons();
  createFooterMapLink();
  enhanceFooterContactLinks();
}
