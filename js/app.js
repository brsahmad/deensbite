// GANTI nomor ini dengan nomor WhatsApp admin Deensbite.
// Format internasional tanpa +, spasi, atau tanda hubung. Contoh: 6281234567890
const WHATSAPP_NUMBER = "6282147396569";

const rupiah = value => new Intl.NumberFormat("id-ID", {
  style: "currency", currency: "IDR", maximumFractionDigits: 0
}).format(value);

const cart = {};
const productGrid = document.querySelector("#product-grid");
const cartCount = document.querySelector("#cart-count");
const cartItems = document.querySelector("#cart-items");
const cartSubtotal = document.querySelector("#cart-subtotal");
const checkoutSubtotal = document.querySelector("#checkout-subtotal");
const cartModal = document.querySelector("#cart-modal");
const checkoutModal = document.querySelector("#checkout-modal");
const orderForm = document.querySelector("#order-form");
const toast = document.querySelector("#toast");

document.querySelector("#year").textContent = new Date().getFullYear();
// document.querySelector("#menu-count").textContent = `${PRODUCTS.length} sweet treats`;

function renderProducts() {
  productGrid.innerHTML = PRODUCTS.map(product => `
    <article class="product-card ${product.available ? "" : "is-out-of-stock"}">
      <div class="product-visual" style="background:${product.color}">
        <span class="product-tag">${product.available ? product.tag : "HABIS"}</span>
        <img class="product-image" src="${product.image}" alt="${product.name}" loading="lazy">
      </div>
      <div class="product-info">
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <div class="product-bottom">
          <span class="product-price">${rupiah(product.price)}</span>
          <button class="add-btn" type="button" data-add="${product.id}" aria-label="${product.available ? `Tambah ${product.name}` : `${product.name} habis`}" ${product.available ? "" : "disabled"}>${product.available ? "+" : "−"}</button>
        </div>
      </div>
    </article>
  `).join("");
}

function getCartEntries() {
  return PRODUCTS.filter(product => cart[product.id] > 0)
    .map(product => ({ ...product, quantity: cart[product.id] }));
}

function getSubtotal() {
  return getCartEntries().reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function renderCart() {
  const entries = getCartEntries();
  const count = entries.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = count;
  cartSubtotal.textContent = rupiah(getSubtotal());
  checkoutSubtotal.textContent = rupiah(getSubtotal());

  if (!entries.length) {
    cartItems.innerHTML = '<div class="cart-empty">Your cart is waiting for some sweetness 🍦<br>Yuk pilih dessert favoritmu!</div>';
    return;
  }

  cartItems.innerHTML = entries.map(item => `
    <div class="cart-row">
      <div class="cart-thumb" style="background:${item.color}"><img src="${item.image}" alt="" loading="lazy"></div>
      <div><div class="cart-product-name">${item.name}</div><div class="cart-product-price">${rupiah(item.price)} / item</div></div>
      <div class="qty-control">
        <button type="button" data-qty="-1" data-id="${item.id}" aria-label="Kurangi">−</button>
        <span>${item.quantity}</span>
        <button type="button" data-qty="1" data-id="${item.id}" aria-label="Tambah">+</button>
      </div>
    </div>
  `).join("");
}

function showModal(modal) {
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}
function hideModal(modal) {
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  if (!document.querySelector(".modal-backdrop.is-open")) document.body.style.overflow = "";
}
function notify(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 2200);
}

productGrid.addEventListener("click", event => {
  const button = event.target.closest("[data-add]");
  if (!button) return;
  const id = button.dataset.add;
  const product = PRODUCTS.find(item => item.id === id);
  if (!product || !product.available) return;
  cart[id] = (cart[id] || 0) + 1;
  renderCart();
  notify("Added to your happy cart! ♡");
});

cartItems.addEventListener("click", event => {
  const button = event.target.closest("[data-qty]");
  if (!button) return;
  const id = button.dataset.id;
  cart[id] = (cart[id] || 0) + Number(button.dataset.qty);
  if (cart[id] <= 0) delete cart[id];
  renderCart();
});

document.querySelector("#cart-open").addEventListener("click", () => {
  renderCart();
  showModal(cartModal);
});
document.querySelectorAll("[data-close]").forEach(button => {
  button.addEventListener("click", () => hideModal(document.getElementById(button.dataset.close)));
});
document.querySelectorAll(".modal-backdrop").forEach(backdrop => {
  backdrop.addEventListener("click", event => {
    if (event.target === backdrop) hideModal(backdrop);
  });
});
document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    hideModal(cartModal);
    hideModal(checkoutModal);
  }
});

document.querySelector("#checkout-start").addEventListener("click", () => {
  if (!getCartEntries().length) {
    notify("Keranjang masih kosong. Pilih dessert dulu ya!");
    return;
  }
  hideModal(cartModal);
  renderCart();
  showModal(checkoutModal);
});

function updateMethodFields() {
  const method = orderForm.elements.method.value;
  // const needsAddress = method === "COD" || method === "Kurir";
  const needsAddress = method === "Kurir";
  const addressField = document.querySelector("#address-field");
  const addressInput = document.querySelector("#customer-address");
  document.querySelector("#pickup-note").hidden = needsAddress;
  addressField.hidden = !needsAddress;
  addressInput.required = needsAddress;
}
orderForm.querySelectorAll('input[name="method"]').forEach(input => {
  input.addEventListener("change", updateMethodFields);
});
updateMethodFields();

orderForm.addEventListener("submit", event => {
  event.preventDefault();
  const entries = getCartEntries();
  if (!entries.length) {
    notify("Keranjang masih kosong.");
    hideModal(checkoutModal);
    return;
  }
  if (WHATSAPP_NUMBER.includes("X")) {
    notify("Isi nomor WhatsApp admin di js/app.js terlebih dahulu.");
    return;
  }

  const formData = new FormData(orderForm);
  const name = String(formData.get("name") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const method = String(formData.get("method") || "");
  const address = String(formData.get("address") || "").trim();
  const note = String(formData.get("note") || "").trim();

  const lines = [
    "*PESANAN BARU — DEENSBITE* 🍦",
    "",
    "*Data pelanggan*",
    `Nama: ${name}`,
    `No. WhatsApp: ${phone}`,
    `Metode: ${method}`,
    ...(method === "Ambil sendiri" ? ["Pengambilan: Lokasi Deensbite (konfirmasi admin)"] : [`Alamat: ${address}`]),
    "",
    "*Detail pesanan*",
    ...entries.map(item => `• ${item.name} x ${item.quantity} — ${rupiah(item.price * item.quantity)}`),
    "",
    `*Subtotal: ${rupiah(getSubtotal())}*`,
    method === "Kurir" ? "Ongkir: Mohon konfirmasi admin." : "",
    note ? `\nCatatan: ${note}` : "",
    "",
    "Mohon konfirmasi ketersediaan dan total pembayaran. Terima kasih!"
  ].filter(Boolean);

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
  window.open(url, "_blank", "noopener,noreferrer");
});

renderProducts();
renderCart();