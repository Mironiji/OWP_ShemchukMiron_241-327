'use struct';

document.getElementById('post').addEventListener('click', checkOrderState);

/* ========== Функция загрузки блюд ========== */
function loadDishes() {
    const apiURL = 'https://edu.std-900.ist.mospolytech.ru/labs/api/dishes';

    fetch(apiURL)
        .then(response => response.json())
        .then(data => {
            const menuWrapper = document.querySelector('.menu-wrapper');

            // Разделяем блюда по категориям
            const categories = {
                soup: document.querySelector('.menu-soup-wrapper'),
                main: document.querySelectorAll('.menu-soup-wrapper')[1],
                drink: document.querySelectorAll('.menu-soup-wrapper')[2],
                dessert: document.querySelectorAll('.menu-soup-wrapper')[3],
                salad: null
            };

            data.forEach(dish => {
                // Создаем карточку блюда
                const card = document.createElement('div');
                card.classList.add('menu-card');
                card.dataset.name = dish.name;
                card.dataset.category = dish.category;
                card.dataset.type = dish.kind;
                card.dataset.price = dish.price;

                card.innerHTML = `
                    <img src="${dish.image}" class="menu-card-pic">
                    <p class="menu-card-price">${dish.price}₽</p>
                    <p class="menu-card-name">${dish.name}</p>
                    <p class="menu-card-weight">${dish.count}</p>
                    <button class="adding-button">Добавить</button>
                `;

                if (categories[dish.category]) {
                    categories[dish.category].appendChild(card);
                }

                // Слушатель выбора блюда
                card.addEventListener('click', () => {
                    const category = card.dataset.category;
                    const price = Number(card.dataset.price);
                    const name = card.dataset.name;

                    selectedPrices[category] = price;
                    renderTotal();
                });

                // Слушатель кнопки "Добавить"
                const addBtn = card.querySelector('.adding-button');
                addBtn.addEventListener('click', e => {
                    e.stopPropagation(); // чтобы не срабатывал выбор при клике
                    const name = card.dataset.name;
                    const price = Number(card.dataset.price);

                    const li = document.createElement('li');
                    li.textContent = `${name} — ${price} ₽`;
                    orderList.appendChild(li);

                    total += price;
                    totalCostEl.textContent = total + ' ₽';
                });
            });

            /* Фильтры */
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
        })
        .catch(err => console.error('Ошибка загрузки блюд:', err));
}

// Загружаем блюда при старте страницы
loadDishes();
