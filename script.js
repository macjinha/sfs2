async function loadData() {
  try {
    const response = await fetch("data.json", { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Ошибка загрузки data.json: ${response.status}`);
    }
    const data = await response.json();
    initSite(data);
  } catch (err) {
    console.error(err);
  }
}

function initSite(data) {
  const site = data.site || {};
  const products = Array.isArray(data.products) ? data.products : [];

  // TITLE
  if (site.title) {
    document.title = site.title;
  }

  // HERO
  const heroTitle = document.getElementById("hero-title");
  const heroTagline = document.getElementById("hero-tagline");
  const heroDescription = document.getElementById("hero-description");

  if (heroTitle) {
    heroTitle.textContent = site.storeName || "Магазин";
  }

  if (heroTagline) {
    heroTagline.textContent = site.tagline || "Интернет-магазин";
  }

  if (heroDescription) {
    heroDescription.textContent =
      site.heroDescription ||
      "Простой лендинг, чтобы продавать вещи без лишних танцев с бубном.";
  }

  // PRODUCTS HEADER
  const productsTitle = document.getElementById("products-title");
  const productsSubtitle = document.getElementById("products-subtitle");

  if (productsTitle) {
    productsTitle.textContent = site.productsTitle || "Каталог товаров";
  }

  if (productsSubtitle) {
    productsSubtitle.textContent =
      site.productsSubtitle || "Выбирайте, что нравится, и звоните для оформления заказа.";
  }

  // PRODUCTS GRID
  const grid = document.getElementById("products-grid");
  if (grid) {
    grid.innerHTML = "";
    if (!products.length) {
      const empty = document.createElement("p");
      empty.textContent = "Пока тут пусто. Но это временно.";
      empty.style.color = "var(--color-muted)";
      grid.appendChild(empty);
    } else {
      products.forEach((product) =>
        grid.appendChild(createProductCard(product))
      );
    }
  }

  // FOOTER
  const footerBrand = document.getElementById("footer-brand");
  const footerLegal = document.getElementById("footer-legal");
  const footerPhone = document.getElementById("footer-phone");
  const footerEmail = document.getElementById("footer-email");
  const footerAddress = document.getElementById("footer-address");

  if (footerBrand) {
    footerBrand.textContent = site.storeName || "Магазин";
  }

  if (footerLegal) {
    const legalParts = [];
    if (site.legalName) legalParts.push(site.legalName);
    if (site.inn) legalParts.push(`ИНН ${site.inn}`);
    footerLegal.textContent = legalParts.join(" • ");
  }

  if (footerPhone && site.phone) {
    footerPhone.textContent = site.phone;
    footerPhone.href = `tel:${site.phone.replace(/\s+/g, "")}`;
  }

  if (footerEmail && site.email) {
    footerEmail.textContent = site.email;
    footerEmail.href = `mailto:${site.email}`;
  }

  if (footerAddress && site.address) {
    footerAddress.textContent = site.address;
  }

  // MODAL INIT
  setupModal(site);
}

function createProductCard(product) {
  const card = document.createElement("article");
  card.className = "product-card";

  const imageWrap = document.createElement("div");
  imageWrap.className = "product-image-wrap";

  const img = document.createElement("img");
  img.className = "product-image";
  img.alt = product.name || "Товар";

  if (product.image) {
    img.src = product.image;
  } else {
    img.src =
      "https://via.placeholder.com/600x600.png?text=Нет+фото";
  }

  imageWrap.appendChild(img);

  const body = document.createElement("div");
  body.className = "product-body";

  const title = document.createElement("h3");
  title.className = "product-title";
  title.textContent = product.name || "Без названия";

  const meta = document.createElement("div");
  meta.className = "product-meta";

  const price = document.createElement("div");
  price.className = "product-price";
  price.textContent = product.price || "Цена по запросу";

  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "product-order-btn";
  btn.textContent = "Заказать";
  btn.addEventListener("click", () => openOrderModal(product));

  meta.appendChild(price);
  meta.appendChild(btn);

  body.appendChild(title);
  body.appendChild(meta);

  card.appendChild(imageWrap);
  card.appendChild(body);

  return card;
}

/* MODAL LOGIC */

let siteSettings = null;

function setupModal(site) {
  siteSettings = site || {};

  const modalBackdrop = document.getElementById("order-modal");
  const closeBtn = modalBackdrop?.querySelector("[data-modal-close]");

  if (closeBtn) {
    closeBtn.addEventListener("click", closeOrderModal);
  }

  if (modalBackdrop) {
    modalBackdrop.addEventListener("click", (e) => {
      if (e.target === modalBackdrop) {
        closeOrderModal();
      }
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeOrderModal();
    }
  });
}

function openOrderModal(product) {
  const modalBackdrop = document.getElementById("order-modal");
  if (!modalBackdrop) return;

  const modalTitle = document.getElementById("modal-title");
  const modalText = document.getElementById("modal-text");
  const modalPhone = document.getElementById("modal-phone");
  const modalNote = document.getElementById("modal-note");

  const phone = siteSettings?.phone || "";
  const storeName = siteSettings?.storeName || "магазина";

  if (modalTitle) {
    modalTitle.textContent = "Заказ по телефону";
  }

  if (modalText) {
    const productName = product?.name || "товар";
    modalText.textContent = `Чтобы оформить заказ на «${productName}», просто позвоните оператору ${storeName}.`;
  }

  if (modalPhone) {
    if (phone) {
      modalPhone.textContent = phone;
      modalPhone.href = `tel:${phone.replace(/\s+/g, "")}`;
    } else {
      modalPhone.textContent = "Номер телефона не указан";
      modalPhone.removeAttribute("href");
    }
  }

  if (modalNote) {
    modalNote.textContent =
      "Назовите название товара и уточните наличие. Оплата и доставка обсуждаются по телефону.";
  }

  modalBackdrop.hidden = false;
}

function closeOrderModal() {
  const modalBackdrop = document.getElementById("order-modal");
  if (!modalBackdrop) return;
  modalBackdrop.hidden = true;
}

/* INIT */

document.addEventListener("DOMContentLoaded", loadData);
