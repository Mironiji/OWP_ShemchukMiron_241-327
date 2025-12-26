'use strict';

const orderList = document.getElementById('order-list');
const totalCostEl = document.getElementById('total-cost');
let total = 0;
let totalCost = 0;

const costElement = document.getElementById('cost');

const selects = {
    soup: document.getElementById('soup-select'),
    main: document.getElementById('main-select'),
    drink: document.getElementById('water-select'),
    dessert: document.getElementById('dessert-select'),
    salad: document.getElementById('salad-select')
};

const selectedPrices = {
    soup: 0,
    main: 0,
    drink: 0,
    dessert: 0,
    salad: 0
};

/* выбор блюда */
document.querySelectorAll('.menu-card').forEach(card => {
    card.addEventListener('click', () => {
        const category = card.dataset.category;
        if (category == "soup") isSoup = true;
        const price = Number(card.dataset.price);
        const name = card.querySelector('.menu-card-name').textContent;

        selectedPrices[category] = price;

        if (selects[category]) {
            [...selects[category].options].forEach(opt => {
                opt.selected = opt.textContent === name;
            });
        }

        renderTotal();
    });
});

/* фильтры */
document.querySelectorAll('.filters button').forEach(btn => {
    btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;
        const category = btn.parentElement.dataset.category;

        document.querySelectorAll(`.menu-card[data-category="${category}"]`)
            .forEach(card => {
                card.style.display =
                    filter === 'all' || card.dataset.type === filter
                        ? 'flex'
                        : 'none';
            });
    });
});

function renderTotal() {
    totalCost = Object.values(selectedPrices)
        .reduce((a, b) => a + b, 0);
    totalCostEl.textContent = totalCost + ' ₽';
}

document.querySelectorAll('.adding-button').forEach(btn => {
    btn.addEventListener('click', () => {
        const card = btn.closest('.menu-card');
        const name = card.dataset.name;
        const price = Number(card.dataset.price);

        const li = document.createElement('li');
        li.textContent = `${name} — ${price} ₽`;
        orderList.appendChild(li);

        total += price;
        totalCostEl.textContent = total + ' ₽';
    });
});

const notification = document.getElementById('notification');
const notificationText = document.getElementById('notification-text');
const notificationOk = document.getElementById('notification-ok');

function showNotification(text) {
    notificationText.textContent = text;
    notification.classList.remove('hidden');
}

notificationOk.addEventListener('click', () => {
    notification.classList.add('hidden');
});

/* Проверка состояния заказа */
function checkOrderState() {
    const missingCategories = [];

    // Проверяем каждую категорию
    if (!selectedPrices.soup) missingCategories.push('суп');
    if (!selectedPrices.salad) missingCategories.push('салат');
    if (!selectedPrices.main) missingCategories.push('главное блюдо');
    if (!selectedPrices.drink) missingCategories.push('напиток');
    if (!selectedPrices.dessert) missingCategories.push('десерт');

    if (missingCategories.length === 0) {
        showNotification('Вы выбрали все необходимые блюда!');
    } else {
        showNotification(`Не выбраны следующие блюда: ${missingCategories.join(', ')}`);
    }
}

// Исправляем добавление события на кнопку
document.getElementById('post').addEventListener('click', checkOrderState);