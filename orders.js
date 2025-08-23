// ===== Замовлення =====
function changeQty(r, i, p, d) {
  if (!cart[r]) cart[r] = {};
  if (!cart[r][i]) cart[r][i] = { qty: 0, price: p };
  cart[r][i].qty = Math.max(0, cart[r][i].qty + d);
  document.getElementById(`qty-${r}-${i}`).textContent = cart[r][i].qty;
}

function goToCart() {
  let h = "<h3>Ваше замовлення:</h3>", t = 0, has = false, totalQty = 0;
  for (let r in cart) {
    let st = 0, used = false;
    for (let i in cart[r]) {
      if (cart[r][i].qty > 0) {
        if (!used) { h += `<h4>${r}</h4>`; used = true; }
        has = true;
        st += cart[r][i].qty * cart[r][i].price;
        totalQty += cart[r][i].qty;
        h += `<p>${i} — ${cart[r][i].qty} × ${cart[r][i].price} грн</p>`;
      }
    }
    if (used) { h += `<p><b>Разом по ${r}: ${st} грн</b></p>`; t += st; }
  }
  if (!has) h += "<p>Замовлення порожнє</p>";
  document.getElementById("orderList").innerHTML = h;

  let g = t + (has ? deliveryFee : 0);
  const promo = document.getElementById("promoCode")?.value.trim().toUpperCase();
  if (promo === "SALE10") {
    g = Math.round(g * 0.9);
  }

  document.getElementById("orderTotal").innerHTML = has ?
    `<p>Товарів: ${totalQty} шт.</p>
     <p>Сума: ${t} грн</p>
     <p>Доставка: ${deliveryFee} грн</p>
     ${promo === "SALE10" ? "<p>Знижка: 10%</p>" : ""}
     <h4>Всього: ${g} грн</h4>` : "";

  showScreen(3);
}
