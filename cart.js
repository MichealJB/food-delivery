// ===== Кошик та локальні дані =====
let cart = {};
let confirmedOrders = [];
let orderHistory = JSON.parse(localStorage.getItem("orderHistory") || "[]");
let favorites = JSON.parse(localStorage.getItem("favorites") || "[]");

function clearCart() {
  cart = {};
  document.getElementById("orderList").innerHTML = "<p>Замовлення порожнє</p>";
  document.getElementById("orderTotal").innerHTML = "";
  document.getElementById("customerAddress").value = "";
  document.getElementById("customerPhone").value = "";
  document.getElementById("orderComment").value = "";
  document.getElementById("paymentMethod").value = "";
}

function saveHistory() {
  localStorage.setItem("orderHistory", JSON.stringify(orderHistory));
}

function saveFavorites() {
  localStorage.setItem("favorites", JSON.stringify(favorites));
}