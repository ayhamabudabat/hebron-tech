
"use strict";

const STORE_WHATSAPP = "972592405995";
const CART_KEY = "hebron-tech-cart-v2";

const PRODUCTS = [
  {
    id: "iphone-16",
    name: "iPhone 16",
    category: "iphone",
    price: 2990,
    description: "هاتف ذكي، سعة ولون حسب اختيارك",
    colors: ["أسود", "أبيض", "وردي", "أزرق"],
    storage: ["128GB", "256GB", "512GB"],
    image: "images/iphone-16.jpg",
    fallback: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=700&auto=format&fit=crop&q=85"
  },
  {
    id: "iphone-15",
    name: "iPhone 15",
    category: "iphone",
    price: 2490,
    description: "شاشة 6.1 إنش وتصميم أنيق",
    colors: ["أسود", "أزرق", "وردي", "أصفر"],
    storage: ["128GB", "256GB", "512GB"],
    image: "images/iphone-15.jpg",
    fallback: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=700&auto=format&fit=crop&q=85"
  },
  {
    id: "iphone-14",
    name: "iPhone 14",
    category: "iphone",
    price: 1990,
    description: "هاتف للاستخدام اليومي والتصوير",
    colors: ["أسود", "أبيض", "أزرق", "بنفسجي"],
    storage: ["128GB", "256GB", "512GB"],
    image: "images/iphone-14.jpg",
    fallback: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=700&auto=format&fit=crop&q=85"
  },
  {
    id: "macbook-air",
    name: "MacBook Air",
    category: "macbook",
    price: 3990,
    description: "خفيف للدراسة والعمل",
    colors: ["فضي", "رمادي"],
    storage: ["256GB", "512GB"],
    image: "images/macbook-air.jpg",
    fallback: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=700&auto=format&fit=crop&q=85"
  },
  {
    id: "macbook-pro",
    name: "MacBook Pro",
    category: "macbook",
    price: 6490,
    description: "لابتوب احترافي للتصميم والعمل",
    colors: ["فضي", "رمادي"],
    storage: ["512GB", "1TB"],
    image: "images/macbook-pro.jpg",
    fallback: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=700&auto=format&fit=crop&q=85"
  },
  {
    id: "ipad",
    name: "iPad",
    category: "ipad",
    price: 1690,
    description: "جهاز لوحي للتعلم والترفيه والرسم",
    colors: ["فضي", "أزرق", "وردي"],
    storage: ["128GB", "256GB"],
    image: "images/ipad.jpg",
    fallback: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=700&auto=format&fit=crop&q=85"
  },
  {
    id: "ipad-air",
    name: "iPad Air",
    category: "ipad",
    price: 2590,
    description: "تابلت خفيف للعمل والإبداع",
    colors: ["رمادي", "أزرق", "بنفسجي"],
    storage: ["128GB", "256GB", "512GB"],
    image: "images/ipad-air.jpg",
    fallback: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=700&auto=format&fit=crop&q=85"
  },
  {
    id: "apple-watch",
    name: "Apple Watch",
    category: "watch",
    price: 1390,
    description: "ساعة ذكية للنشاط والإشعارات",
    colors: ["أسود", "فضي", "وردي"],
    storage: ["قياس 41mm", "قياس 45mm"],
    image: "images/apple-watch.jpg",
    fallback: "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=700&auto=format&fit=crop&q=85"
  },
  {
    id: "airpods",
    name: "AirPods",
    category: "airpods",
    price: 690,
    description: "سماعات لاسلكية للمكالمات والموسيقى",
    colors: ["أبيض"],
    storage: ["إصدار قياسي"],
    image: "images/airpods.jpg",
    fallback: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=700&auto=format&fit=crop&q=85"
  },
  {
    id: "airpods-pro",
    name: "AirPods Pro",
    category: "airpods",
    price: 990,
    description: "سماعات لاسلكية بعزل الضوضاء",
    colors: ["أبيض"],
    storage: ["إصدار Pro"],
    image: "images/airpods-pro.jpg",
    fallback: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=700&auto=format&fit=crop&q=85"
  }
];

const $ = id => document.getElementById(id);
const money = n => n.toLocaleString("en-US") + " ₪";
const productById = id => PRODUCTS.find(p => p.id === id);

let activeCategory = "all";
let searchText = "";
let toastTimer;
let previousFocus;

function setProductImage(img, product) {
  img.src = product.image;
  img.alt = "صورة " + product.name;

  img.onerror = function () {
    img.onerror = null;
    img.src = product.fallback;
  };
}

function readCart() {
  try {
    const saved = localStorage.getItem(CART_KEY);
    const data = JSON.parse(saved || "{}");

    if (!data || typeof data !== "object" || Array.isArray(data)) {
      return {};
    }

    const clean = {};

    for (const [key, qty] of Object.entries(data)) {
      const [id, color, storage] = key.split("|");
      const product = productById(id);

      if (
        product &&
        product.colors.includes(color) &&
        product.storage.includes(storage) &&
        Number.isInteger(qty) &&
        qty > 0
      ) {
        clean[key] = Math.min(99, qty);
      }
    }

    return clean;
  } catch {
    return {};
  }
}

function saveCart(cart) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch {
    showToast("تعذر حفظ السلة");
  }

  renderCart();
}

function showToast(message) {
  const toast = $("toast");
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2300);
}

function renderProducts() {
  const grid = $("products-grid");
  if (!grid) return;

  grid.replaceChildren();

  const filtered = PRODUCTS.filter(product => {
    const categoryMatch =
      activeCategory === "all" ||
      product.category === activeCategory;

    const searchMatch = (
      product.name + " " + product.description
    ).toLowerCase().includes(searchText);

    return categoryMatch && searchMatch;
  });

  for (const product of filtered) {
    const card = document.createElement("article");
    card.className = "product";

    const picture = document.createElement("div");
    picture.className = "product-image";

    const img = document.createElement("img");
    img.loading = "lazy";
    setProductImage(img, product);

    picture.append(img);

    const body = document.createElement("div");
    body.className = "product-body";

    const category = document.createElement("span");
    category.className = "product-type";
    category.textContent = product.category.toUpperCase();

    const title = document.createElement("h3");
    title.textContent = product.name;

    const description = document.createElement("p");
    description.textContent = product.description;

    const bottom = document.createElement("div");
    bottom.className = "product-bottom";

    const price = document.createElement("strong");
    price.className = "price";
    price.textContent = money(product.price);

    const button = document.createElement("button");
    button.type = "button";
    button.className = "detail-btn";
    button.textContent = "اختار التفاصيل +";

    button.addEventListener("click", () => {
      showProduct(product.id);
    });

    bottom.append(price, button);
    body.append(category, title, description, bottom);
    card.append(picture, body);
    grid.append(card);
  }

  if ($("no-results")) {
    $("no-results").hidden = filtered.length > 0;
  }
}

function showProduct(id) {
  const product = productById(id);
  if (!product) return;

  const target = $("product-detail");
  const dialog = $("product-dialog");

  if (!target || !dialog) return;

  target.replaceChildren();

  const layout = document.createElement("div");
  layout.className = "detail-layout";

  const img = document.createElement("img");
  setProductImage(img, product);

  const content = document.createElement("div");

  const title = document.createElement("h2");
  title.textContent = product.name;

  const description = document.createElement("p");
  description.textContent = product.description;

  const colorLabel = document.createElement("label");
  colorLabel.className = "field";
  colorLabel.textContent = "اختار اللون";

  const colorSelect = document.createElement("select");

  for (const color of product.colors) {
    const option = document.createElement("option");
    option.value = color;
    option.textContent = color;
    colorSelect.append(option);
  }

  colorLabel.append(colorSelect);

  const storageLabel = document.createElement("label");
  storageLabel.className = "field";

  if (product.category === "watch") {
    storageLabel.textContent = "اختار القياس";
  } else if (product.category === "airpods") {
    storageLabel.textContent = "الإصدار";
  } else {
    storageLabel.textContent = "اختار السعة";
  }

  const storageSelect = document.createElement("select");

  for (const storage of product.storage) {
    const option = document.createElement("option");
    option.value = storage;
    option.textContent = storage;
    storageSelect.append(option);
  }

  storageLabel.append(storageSelect);

  const price = document.createElement("div");
  price.className = "detail-price";
  price.textContent = money(product.price);

  const note = document.createElement("p");
  note.textContent =
    "السعر تجريبي وقد يختلف حسب اللون والسعة والتوفر.";

  const button = document.createElement("button");
  button.type = "button";
  button.className = "primary full";
  button.textContent = "أضف للسلة 🛒";

  button.addEventListener("click", () => {
    addToCart(
      product.id,
      colorSelect.value,
      storageSelect.value
    );

    dialog.close();
  });

  content.append(
    title,
    description,
    colorLabel,
    storageLabel,
    price,
    note,
    button
  );

  layout.append(img, content);
  target.append(layout);
  dialog.showModal();
}

function addToCart(id, color, storage) {
  const product = productById(id);

  if (
    !product ||
    !product.colors.includes(color) ||
    !product.storage.includes(storage)
  ) {
    return;
  }

  const cart = readCart();
  const key = [id, color, storage].join("|");

  cart[key] = Math.min(99, (cart[key] || 0) + 1);

  saveCart(cart);
  showToast("تمت إضافة " + product.name + " للسلة ✓");
}

function changeQty(key, delta) {
  const cart = readCart();

  if (!cart[key]) return;

  const next = Math.max(
    0,
    Math.min(99, cart[key] + delta)
  );

  if (next > 0) {
    cart[key] = next;
  } else {
    delete cart[key];
  }

  saveCart(cart);
}

function renderCart() {
  const list = $("cart-items");
  if (!list) return;

  const cart = readCart();
  const entries = Object.entries(cart);

  list.replaceChildren();

  const count = entries.reduce(
    (sum, [, qty]) => sum + qty,
    0
  );

  $("cart-count").textContent = count;

  let total = 0;

  if (entries.length === 0) {
    const empty = document.createElement("p");
    empty.className = "muted";
    empty.textContent =
      "السلة فاضية. اختار جهاز من قسم المنتجات.";

    list.append(empty);
  }

  for (const [key, qty] of entries) {
    const [id, color, storage] = key.split("|");
    const product = productById(id);

    if (!product) continue;

    total += product.price * qty;

    const row = document.createElement("div");
    row.className = "cart-row";

    const info = document.createElement("div");

    const name = document.createElement("strong");
    name.textContent = product.name;

    const details = document.createElement("small");
    details.textContent =
      color + " · " + storage + " · " +
      money(product.price * qty);

    info.append(name, details);

    const controls = document.createElement("div");
    controls.className = "qty";

    const minus = document.createElement("button");
    minus.type = "button";
    minus.textContent = "−";
    minus.setAttribute(
      "aria-label",
      "تقليل " + product.name
    );

    minus.addEventListener("click", () => {
      changeQty(key, -1);
    });

    const amount = document.createElement("span");
    amount.textContent = qty;

    const plus = document.createElement("button");
    plus.type = "button";
    plus.textContent = "+";
    plus.setAttribute(
      "aria-label",
      "زيادة " + product.name
    );

    plus.addEventListener("click", () => {
      changeQty(key, 1);
    });

    controls.append(minus, amount, plus);
    row.append(info, controls);
    list.append(row);
  }

  $("cart-total").textContent = money(total);

  if ($("checkout-button")) {
    $("checkout-button").disabled = entries.length === 0;
  }
}

function openCart() {
  previousFocus = document.activeElement;

  $("cart-overlay").hidden = false;
  $("cart-panel").classList.add("open");
  $("cart-panel").setAttribute("aria-hidden", "false");

  document.body.classList.add("cart-open");
  $("close-cart").focus();
}

function closeCart() {
  $("cart-panel").classList.remove("open");
  $("cart-panel").setAttribute("aria-hidden", "true");

  $("cart-overlay").hidden = true;
  document.body.classList.remove("cart-open");

  if (previousFocus && previousFocus.focus) {
    previousFocus.focus();
  }
}

function checkoutWhatsApp() {
  const entries = Object.entries(readCart());

  if (!entries.length) return;

  if (!/^\d{8,15}$/.test(STORE_WHATSAPP)) {
    alert("يرجى ضبط رقم واتساب المحل");
    return;
  }

  let total = 0;

  const lines = entries.map(([key, qty]) => {
    const [id, color, storage] = key.split("|");
    const product = productById(id);
    const subtotal = product.price * qty;

    total += subtotal;

    return (
      "• " + product.name +
      " | " + color +
      " | " + storage +
      " × " + qty +
      " = " + money(subtotal)
    );
  });

  const message = [
    "مرحبًا، بدي أستفسر عن توفر الأجهزة التالية من HEBRON TECH:",
    "",
    ...lines,
    "",
    "المجموع حسب الأسعار التجريبية: " + money(total),
    "",
    "ممكن تأكدولي التوفر والسعر النهائي؟"
  ].join("\n");

  const url =
    "https://wa.me/" +
    STORE_WHATSAPP +
    "?text=" +
    encodeURIComponent(message);

  window.open(url, "_blank", "noopener,noreferrer");
}

document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  renderCart();

  $("search-input").addEventListener("input", event => {
    searchText = event.target.value.trim().toLowerCase();
    renderProducts();
  });

  document.querySelectorAll(".filter").forEach(button => {
    button.addEventListener("click", () => {
      activeCategory = button.dataset.category;

      document.querySelectorAll(".filter").forEach(item => {
        item.classList.remove("active");
      });

      button.classList.add("active");
      renderProducts();
    });
  });

  $("cart-toggle").addEventListener("click", openCart);

  $("contact-cart-button").addEventListener(
    "click",
    openCart
  );

  $("close-cart").addEventListener("click", closeCart);
  $("cart-overlay").addEventListener("click", closeCart);

  $("clear-cart").addEventListener("click", () => {
    saveCart({});
    showToast("تم إفراغ السلة");
  });

  $("checkout-button").addEventListener(
    "click",
    checkoutWhatsApp
  );

  $("close-product").addEventListener("click", () => {
    $("product-dialog").close();
  });

  $("menu-toggle").addEventListener("click", () => {
    const isOpen = $("nav-links").classList.toggle("open");

    $("menu-toggle").setAttribute(
      "aria-expanded",
      String(isOpen)
    );
  });

  document.querySelectorAll("#nav-links a").forEach(link => {
    link.addEventListener("click", () => {
      $("nav-links").classList.remove("open");
      $("menu-toggle").setAttribute("aria-expanded", "false");
    });
  });

  document.addEventListener("keydown", event => {
    if (
      event.key === "Escape" &&
      $("cart-panel").classList.contains("open")
    ) {
      closeCart();
    }
  });
});
