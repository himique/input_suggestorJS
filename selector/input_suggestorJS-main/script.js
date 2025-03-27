document.addEventListener('DOMContentLoaded', () => {
    const listContainer = document.getElementById('list-container');
    const dataList = document.getElementById('data-list');
    let items = []; // Массив элементов списка
    let currentSelectedIndex = -1; // Индекс текущего *логически* выбранного элемента
    let itemHeight = 0; // Высота одного элемента списка

    // --- Генерация тестовых данных ---
    function generateItems(count) {
        dataList.innerHTML = ''; // Очищаем список перед генерацией
        items = [];
        for (let i = 1; i <= count; i++) {
            const item = document.createElement('div');
            item.classList.add('list-item');
            item.textContent = `Элемент ${i}`;
            dataList.appendChild(item);
            items.push(item);
        }

        // Определяем высоту элемента и устанавливаем высоту контейнера
        if (items.length > 0) {
            // offsetHeight включает padding и border
            itemHeight = items[0].offsetHeight;
            // Устанавливаем высоту контейнера для отображения ровно 2х элементов
            // Добавляем небольшой запас (1-2px), если есть нюансы с border
            listContainer.style.height = `${itemHeight * 4}px`;
        } else {
            listContainer.style.height = '0px'; // Или другая высота для пустого списка
        }
    }
    // --- Конец генерации данных ---

    // Функция для установки ВЫБРАННОГО элемента и ПРОКРУТКИ
    function selectItem(index) {
        // Проверка границ индекса
        if (index < 0 || index >= items.length || index === currentSelectedIndex) {
            return; // Выход, если индекс некорректный или не изменился
        }

        // Снимаем выделение с предыдущего элемента
        if (currentSelectedIndex !== -1 && items[currentSelectedIndex]) {
            items[currentSelectedIndex].classList.remove('selected');
        }

        // Устанавливаем новый индекс и выделяем *логический* элемент
        currentSelectedIndex = index;
        const selectedElement = items[currentSelectedIndex];
        selectedElement.classList.add('selected');

        // --- Логика прокрутки ---
        // Цель: Поместить *логически выбранный* элемент на *первую видимую позицию*.
        // scrollTop - это насколько прокручен контент ВНУТРИ контейнера ВВЕРХ.
        // selectedElement.offsetTop - это расстояние от начала dataList до начала selectedElement.
        // Устанавливая scrollTop равным offsetTop, мы поднимаем контент так,
        // чтобы верх выбранного элемента совпал с верхом видимой области контейнера.
        listContainer.scrollTop = selectedElement.offsetTop;

        // listContainer.focus(); // Можно раскомментировать, если фокус теряется
    }

    // Обработчик нажатия клавиш
    listContainer.addEventListener('keydown', (event) => {
        if (items.length === 0) return; // Ничего не делать, если список пуст

        let newIndex = currentSelectedIndex;

        switch (event.key) {
            case 'ArrowDown':
                event.preventDefault();
                newIndex = Math.min(currentSelectedIndex + 1, items.length - 1); // Движение вниз без зацикливания
                break;
            case 'ArrowUp':
                event.preventDefault();
                newIndex = Math.max(currentSelectedIndex - 1, 0); // Движение вверх без зацикливания
                break;
            default:
                return;
        }

        selectItem(newIndex);
    });

    // Обработчик кликов
    dataList.addEventListener('click', (event) => {
        const clickedItem = event.target.closest('.list-item');
        if (clickedItem) {
            const index = items.indexOf(clickedItem);
            if (index !== -1) {
                selectItem(index);
            }
        }
    });

    // --- Инициализация ---
    generateItems(35); // Генерируем элементы

    // Выбираем первый элемент при загрузке (если есть)
    if (items.length > 0) {
        selectItem(0);
    }

    // Ставим фокус на контейнер, чтобы сразу можно было использовать стрелки
    listContainer.focus();
});