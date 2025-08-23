// ===== Push Notification =====
function sendNotification(title, body) {
  if (Notification.permission === "granted") {
    new Notification(title, { body });
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then(p => {
      if (p === "granted") new Notification(title, { body });
    });
  }
}

// ===== Навігація =====
function showScreen(n) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.querySelectorAll(".nav button").forEach(b => b.classList.remove("active"));

  if (n === "confirm") {
    document.getElementById("screenConfirm").classList.add("active");
    document.querySelectorAll(".nav button")[2].classList.add("active");
    return;
  }

  if (typeof n === "number") {
    document.getElementById("screen" + n).classList.add("active");
    document.querySelectorAll(".nav button")[n - 1]?.classList.add("active");
  } else {
    document.getElementById("screen" + n).classList.add("active");
    document.querySelector(".nav button:last-child").classList.add("active");
    if (n === "History") showHistory();
  }
}

// ===== Init =====
document.addEventListener("DOMContentLoaded", () => {
  renderRestaurantList();

  // кнопки
  document.getElementById("clearCartBtn").addEventListener("click", clearCart);
  document.getElementById("confirmOrderBtn").addEventListener("click", confirmOrder);
  document.getElementById("newOrderBtn").addEventListener("click", newOrder);
  document.getElementById("backToMenuBtn").addEventListener("click", () => showScreen(1));
  document.getElementById("backToCartBtn").addEventListener("click", () => showScreen(3));

  document.getElementById("searchInput").addEventListener("input", filterRestaurants);

  document.querySelectorAll(".nav button").forEach(btn => {
    btn.addEventListener("click", () => {
      let screen = btn.dataset.screen;
      showScreen(isNaN(screen) ? screen : Number(screen));
    });
  });
});