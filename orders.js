// ===== Замовлення =====
function changeQty(r, i, p, d) {
  if (!cart[r]) cart[r] = {};
  if (!cart[r][i]) cart[r][i] = { qty: 0, price: p };
  cart[r][i].qty = Math.max(0, cart[r][i].qty + d);
  document.getElementById(`qty-${r}-${i}`).textContent = cart[r][i].qty;
}

function goToCart() {
  let h = "<h3>Ваше замовлення:</h3>", t = 0, has = false;
  for (let r in cart) {
    let st = 0, used = false;
    for (let i in cart[r]) {
      if (cart[r][i].qty > 0) {
        if (!used) { h += `<h4>${r}</h4>`; used = true; }
        has = true;
        st += cart[r][i].qty * cart[r][i].price;
        h += `<p>${i} — ${cart[r][i].qty} × ${cart[r][i].price} грн</p>`;
      }
    }
    if (used) { h += `<p><b>Разом по ${r}: ${st} грн</b></p>`; t += st; }
  }
  if (!has) h += "<p>Замовлення порожнє</p>";
  document.getElementById("orderList").innerHTML = h;

  let g = t + (has ? deliveryFee : 0);
  document.getElementById("orderTotal").innerHTML = has ?
    `<p>Сума: ${t} грн</p><p>Доставка: ${deliveryFee} грн</p><h4>Всього: ${g} грн</h4>` : "";

  showScreen(3);
}

function confirmOrder() {
  const a = document.getElementById("customerAddress").value.trim(),
        p = document.getElementById("customerPhone").value.trim(),
        c = document.getElementById("orderComment").value.trim(),
        pay = document.getElementById("paymentMethod").value;

  if (!a) return alert("Введіть адресу");
  if (!p) return alert("Введіть телефон");
  if (!pay) return alert("Оберіть оплату");

  const d = {
    address: `📍 ${a} | 📞 ${p}`,
    items: getOrderItemsHTML(),
    comment: c ? `💬 ${c}` : "",
    payment: pay === "card" ? "💳 Картка" : "💵 Готівка",
    total: document.getElementById("orderTotal").innerHTML,
    statusIndex: 0,
    status: deliveryStatuses[0]
  };

  confirmedOrders.push(d);
  orderHistory.push(d);
  saveHistory();

  renderConfirmedOrders();
  showScreen("confirm");
  sendNotification("Замовлення прийнято", "Ваше замовлення оформлено!");
}

function getOrderItemsHTML() {
  let h = "";
  for (let r in cart) {
    let st = 0, u = false;
    for (let i in cart[r]) {
      if (cart[r][i].qty > 0) {
        if (!u) { h += `<h4>${r}</h4>`; u = true; }
        st += cart[r][i].qty * cart[r][i].price;
        h += `<p>${i} — ${cart[r][i].qty} × ${cart[r][i].price} грн</p>`;
      }
    }
    if (u) h += `<p><b>Разом по ${r}: ${st} грн</b></p>`;
  }
  return h;
}

function renderConfirmedOrders() {
  const c = document.getElementById("confirmedOrders");
  c.innerHTML = "";
  confirmedOrders.forEach((o, i) => {
    c.innerHTML += `<div class="status">
                      <h3>Замовлення ${i + 1}</h3>
                      <p>${o.address}</p>${o.items}
                      <p>${o.comment}</p>
                      <p>${o.payment}</p>
                      <div>${o.total}</div>
                      <p><b>Статус: ${o.status}</b></p>
                      <button class="btn" onclick="updateOrderStatus(${i})">Оновити статус</button>
                      <button class="btn danger" onclick="cancelSingleOrder(${i})">Відмінити</button>
                    </div>`;
  });
}

function updateOrderStatus(i) {
  let o = confirmedOrders[i];
  if (!o.statusIndex) o.statusIndex = 0;
  else o.statusIndex = Math.min(o.statusIndex + 1, deliveryStatuses.length - 1);
  o.status = deliveryStatuses[o.statusIndex];
  sendNotification("Статус замовлення", `Ваше замовлення ${o.status}`);
  renderConfirmedOrders();
}

function cancelSingleOrder(i) {
  confirmedOrders.splice(i, 1);
  renderConfirmedOrders();
}

function newOrder() {
  clearCart();
  showScreen(1);
}

function showHistory() {
  let c = document.getElementById("historyContainer");
  c.innerHTML = "";
  orderHistory.forEach((o, i) => {
    c.innerHTML += `<div class="status">
                      <h4>Замовлення #${i + 1}</h4>
                      ${o.items}<p>${o.total}</p>
                      <p>${o.status || "✅ Прийнято"}</p>
                    </div>`;
  });
}