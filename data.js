// ===== Дані =====
const deliveryFee = 25;

const menus = {
  "Burger House": [
    { name: "Чизбургер", price: 81, icon: "🍔" },
    { name: "Фрі", price: 40, icon: "🍟" },
    { name: "Кола", price: 25, icon: "🥤" }
  ],
  "Fry Chicken": [
    { name: "Курячі крильця", price: 99, icon: "🍗" },
    { name: "Картопля по-селянськи", price: 55, icon: "🥔" },
    { name: "Сік", price: 30, icon: "🧃" }
  ],
  "Pizza Burger": [
    { name: "Піца Маргарита", price: 120, icon: "🍕" },
    { name: "Бургер з сиром", price: 90, icon: "🍔" },
    { name: "Лимонад", price: 35, icon: "🥤" }
  ]
};

const deliveryStatuses = [
  "✅ Прийнято",
  "👨‍🍳 Готується",
  "🚚 Доставляється",
  "🏠 Доставлено"
];