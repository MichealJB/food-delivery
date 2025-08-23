// ===== UI та ресторани =====
function renderRestaurantList() {
  const list = document.getElementById("restaurantList");
  list.innerHTML = Object.keys(menus).map(rest => {
    let fav = favorites.includes(rest) ? "❤️" : "🤍";
    return `<div class="card">
              <span class="fav" data-rest="${rest}">${fav}</span>
              <span class="open-menu" data-rest="${rest}">${rest}</span>
            </div>`;
  }).join("");

  list.querySelectorAll(".fav").forEach(el =>
    el.addEventListener("click", () => toggleFavorite(el.dataset.rest))
  );
  list.querySelectorAll(".open-menu").forEach(el =>
    el.addEventListener("click", () => openMenu(el.dataset.rest))
  );
}

function toggleFavorite(rest) {
  if (favorites.includes(rest)) {
    favorites = favorites.filter(x => x !== rest);
  } else {
    favorites.push(rest);
  }
  saveFavorites();
  renderRestaurantList();
}

function filterRestaurants() {
  const input = document.getElementById("searchInput").value.toLowerCase();
  [...document.getElementById("restaurantList").children].forEach(el => {
    el.style.display = el.textContent.toLowerCase().includes(input) ? "flex" : "none";
  });
}

function openMenu(restaurant) {
  const m = document.getElementById("restaurantMenu");
  m.innerHTML = `<div class="header yellow">
                   <button id="backToRestaurantsBtn">⬅</button> ${restaurant}
                 </div>`;

  menus[restaurant].forEach(item => {
    m.innerHTML += `<div class="card">${item.icon} ${item.name}
                      <span>${item.price} грн 
                        <span class="qty">
                          <button class="dec" data-r="${restaurant}" data-i="${item.name}" data-p="${item.price}">-</button>
                          <span id="qty-${restaurant}-${item.name}">0</span>
                          <button class="inc" data-r="${restaurant}" data-i="${item.name}" data-p="${item.price}">+</button>
                        </span>
                      </span>
                    </div>`;
  });

  m.innerHTML += `<button class="btn" style="margin-top:10px;" id="goToCartBtn">Перейти до сплати</button>`;

  document.querySelectorAll("#screen1 > #restaurantList, #screen1 > .search")
    .forEach(e => e.style.display = "none");
  m.style.display = "block";

  document.getElementById("backToRestaurantsBtn").addEventListener("click", backToRestaurants);
  document.getElementById("goToCartBtn").addEventListener("click", goToCart);

  m.querySelectorAll(".inc").forEach(btn =>
    btn.addEventListener("click", () => changeQty(btn.dataset.r, btn.dataset.i, +btn.dataset.p, 1))
  );
  m.querySelectorAll(".dec").forEach(btn =>
    btn.addEventListener("click", () => changeQty(btn.dataset.r, btn.dataset.i, +btn.dataset.p, -1))
  );
}

function backToRestaurants() {
  document.querySelectorAll("#screen1 > #restaurantList, #screen1 > .search")
    .forEach(e => e.style.display = "");
  document.getElementById("restaurantMenu").style.display = "none";
}