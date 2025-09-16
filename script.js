let cart = {};
let confirmedOrders = [];
let orderHistory = [];
let favorites = [];
const deliveryFee = 25;

const menus = {
    'Burger House': [
        { name: 'Чизбургер', price: 81, icon: '🍔' },
        { name: 'Фрі', price: 40, icon: '🍟' },
        { name: 'Кола', price: 25, icon: '🥤' }
    ],
    'Fry Chicken': [
        { name: 'Курячі крильця', price: 99, icon: '🍗' },
        { name: 'Картопля по-селянськи', price: 55, icon: '🥔' },
        { name: 'Сік', price: 30, icon: '🧃' }
    ],
    'Pizza Burger': [
        { name: 'Піца Маргарита', price: 120, icon: '🍕' },
        { name: 'Бургер з сиром', price: 90, icon: '🍔' },
        { name: 'Лимонад', price: 35, icon: '🥤' }
    ]
};

function filterRestaurants(){
  const input = document.getElementById('searchInput').value.toLowerCase();
  const list = document.getElementById('restaurantList');
  list.innerHTML = '';
  Object.keys(menus).forEach(name=>{
    if(name.toLowerCase().includes(input)){
      list.innerHTML += `<div class='card' onclick="openMenu('${name}')">${name}</div>`;
    }
  });
}
window.onload = filterRestaurants;

function openMenu(name){
  const menuDiv = document.getElementById('restaurantMenu');
  menuDiv.innerHTML = `<div class='header yellow'><button onclick='backToRestaurants()'>⬅</button> ${name}</div>`;
  menus[name].forEach(item=>{
    menuDiv.innerHTML += `<div class='card'>${item.icon} ${item.name} <span>${item.price} грн <span class='qty'><button onclick="changeQty('${name}','${item.name}',${item.price},-1)">-</button><span id="qty-${name}-${item.name}">0</span><button onclick="changeQty('${name}','${item.name}',${item.price},1)">+</button></span></span></div>`;
  });
  menuDiv.innerHTML += `<button class='btn' onclick='goToCart()'>Перейти до сплати</button>`;
  document.getElementById('restaurantList').style.display='none';
  document.querySelector('.search').style.display='none';
  menuDiv.style.display='block';
}
function backToRestaurants(){
  document.getElementById('restaurantList').style.display='block';
  document.querySelector('.search').style.display='block';
  document.getElementById('restaurantMenu').style.display='none';
}
function backToMenu(){ showScreen(1); }
function changeQty(rest,item,price,delta){
  if(!cart[rest]) cart[rest] = {};
  if(!cart[rest][item]) cart[rest][item] = {qty:0, price:price};
  cart[rest][item].qty = Math.max(0, cart[rest][item].qty + delta);
  document.getElementById('qty-'+rest+'-'+item).textContent = cart[rest][item].qty;
}
function goToCart(){
  let html=''; let total=0; let hasItems=false;
  for(let r in cart){
    let subtotal=0; let rh=false;
    for(let i in cart[r]){
      if(cart[r][i].qty>0){
        if(!rh){html+=`<h4>${r}</h4>`; rh=true;}
        html+=`<p>${i} — ${cart[r][i].qty} × ${cart[r][i].price} грн</p>`;
        subtotal+=cart[r][i].qty*cart[r][i].price; hasItems=true;
      }
    }
    if(rh){ html+=`<p><b>Разом: ${subtotal} грн</b></p>`; total+=subtotal; }
  }
  if(!hasItems) html='<p>Замовлення порожнє</p>';
  document.getElementById('orderList').innerHTML=html;
  let grand=total+(hasItems?deliveryFee:0);
  document.getElementById('orderTotal').innerHTML= hasItems? `<p>Сума: ${total} грн</p><p>Доставка: ${deliveryFee} грн</p><h4>Всього: ${grand} грн</h4>`:'';
  showScreen(3);
}
function clearCart(){ cart={}; goToCart(); document.getElementById('customerAddress').value=''; document.getElementById('customerPhone').value=''; document.getElementById('orderComment').value=''; document.getElementById('paymentMethod').value=''; }
function confirmOrder(){
  const addr=document.getElementById('customerAddress').value.trim();
  const phone=document.getElementById('customerPhone').value.trim();
  const pay=document.getElementById('paymentMethod').value;
  if(!addr||!phone||!pay){ alert('Заповніть всі поля'); return; }
  const order={address:addr, phone:phone, items:getOrderItemsHTML(), total:document.getElementById('orderTotal').innerHTML, status:'Прийнято'};
  confirmedOrders.push(order); orderHistory.push(order);
  renderConfirmedOrders(); renderOrderHistory();
  showScreenConfirm();
}
function getOrderItemsHTML(){
  let html=''; for(let r in cart){ for(let i in cart[r]){ if(cart[r][i].qty>0) html+=`<p>${r}: ${i} × ${cart[r][i].qty}</p>`; } }
  return html;
}
function renderConfirmedOrders(){
  let c=document.getElementById('confirmedOrders'); c.innerHTML='';
  confirmedOrders.forEach((o,i)=>{ c.innerHTML+=`<div class='status'><h3>Замовлення ${i+1}</h3><p>${o.address}</p><p>${o.phone}</p>${o.items}<div>${o.total}</div><p>Статус: ${o.status}</p></div>`; });
}
function renderOrderHistory(){
  let c=document.getElementById('orderHistory'); c.innerHTML='';
  orderHistory.forEach((o,i)=>{ c.innerHTML+=`<div class='status'><h3>Історія ${i+1}</h3><p>${o.address}</p><p>${o.phone}</p>${o.items}<div>${o.total}</div><p>Статус: ${o.status}</p><button class='btn' onclick='repeatOrder(${i})'>🔄 Повторити</button></div>`; });
}
function repeatOrder(index){ const o=orderHistory[index]; cart={}; // simple parse
  o.items.replaceAll('<p','<div').split('</p>').forEach(line=>{ if(line.includes('×')){ let parts=line.replace(/<[^>]+>/g,'').split(':'); if(parts.length==2){ let rest=parts[0].trim(); let rest2=parts[1].split('×'); let item=rest2[0].trim(); let qty=parseInt(rest2[1]); if(!cart[rest]) cart[rest]={}; cart[rest][item]={qty:qty, price:0}; } } }); goToCart(); }
function showScreen(n){ document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active')); document.getElementById('screen'+n).classList.add('active'); document.querySelectorAll('.nav button').forEach(b=>b.classList.remove('active')); }
function showScreenConfirm(){ showScreen('Confirm'); }
function toggleTheme(){ document.body.classList.toggle('dark-mode'); const dark=document.body.classList.contains('dark-mode'); localStorage.setItem('theme', dark?'dark':'light'); document.querySelectorAll("button[onclick='toggleTheme()']").forEach(btn=>btn.textContent=dark?'☀️':'🌙'); }
window.addEventListener('load',()=>{ const saved=localStorage.getItem('theme'); if(saved==='dark'){ document.body.classList.add('dark-mode'); document.querySelectorAll("button[onclick='toggleTheme()']").forEach(btn=>btn.textContent='☀️'); } });


// --- LocalStorage для кошика ---
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}
function loadCart() {
    const saved = localStorage.getItem('cart');
    if (saved) cart = JSON.parse(saved);
}

// --- LocalStorage для історії ---
function saveHistory() {
    localStorage.setItem('orderHistory', JSON.stringify(orderHistory));
}
function loadHistory() {
    const saved = localStorage.getItem('orderHistory');
    if (saved) orderHistory = JSON.parse(saved);
}

// --- Повторити замовлення ---
function repeatOrder(index) {
    const order = orderHistory[index];
    if (!order || !order.itemsData) return;
    for (let restaurant in order.itemsData) {
        if (!cart[restaurant]) cart[restaurant] = {};
        for (let item in order.itemsData[restaurant]) {
            const data = order.itemsData[restaurant][item];
            if (!cart[restaurant][item]) {
                cart[restaurant][item] = { qty: 0, price: data.price };
            }
            cart[restaurant][item].qty += data.qty;
        }
    }
    saveCart();
    goToCart();
}

// --- Пошук ресторанів з highlight ---
function filterRestaurants() {
    const input = document.getElementById('searchInput').value.toLowerCase();
    const list = document.getElementById('restaurantList').children;
    let found = false;
    for (let i = 0; i < list.length; i++) {
        const el = list[i];
        const name = el.textContent.toLowerCase();
        if (name.includes(input) && input.length > 0) {
            el.style.display = 'flex';
            found = true;
            const regex = new RegExp(`(${input})`, 'gi');
            el.innerHTML = el.textContent.replace(regex, `<mark>$1</mark>`);
        } else if (input.length === 0) {
            el.style.display = 'flex';
            el.innerHTML = el.textContent;
        } else {
            el.style.display = 'none';
        }
    }
    const noResultMsg = document.getElementById('noResultMsg');
    if (!found && input.length > 0) {
        noResultMsg.style.display = 'block';
    } else {
        noResultMsg.style.display = 'none';
    }
}

// --- Skeleton loading ---
function showSkeleton() {
    const container = document.getElementById('restaurantList');
    container.innerHTML = '';
    for (let i = 0; i < 3; i++) {
        container.innerHTML += `<div class="card skeleton"></div>`;
    }
    setTimeout(loadRestaurants, 1000);
}

function loadRestaurants() {
    const container = document.getElementById('restaurantList');
    container.innerHTML = `
        <div class="card" onclick="openMenu('Burger House')">🍔 Burger House</div>
        <div class="card" onclick="openMenu('Fry Chicken')">🍗 Fry Chicken</div>
        <div class="card" onclick="openMenu('Pizza Burger')">🍕 Pizza Burger</div>
    `;
}
