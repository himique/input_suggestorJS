// Пример данных (массив объектов)
const data = [
    { id: 1, firstName: 'Иван', lastName: 'Петров', jobTitle: 'Инженер' },
    { id: 2, firstName: 'Мария', lastName: 'Сидорова', jobTitle: 'Врач' },
    { id: 3, firstName: 'Петр', lastName: 'Иванов', jobTitle: 'Учитель' },
    { id: 4, firstName: 'Анна', lastName: 'Кузнецова', jobTitle: 'Инженер' },
    { id: 5, firstName: 'Иван', lastName: 'Сидоров', jobTitle: 'Программист' },
    { id: 6, firstName: 'Сергей', lastName: 'Петров', jobTitle: 'Инженер-программист' },
    { id: 7, firstName: 'Елена', lastName: 'Иванова', jobTitle: 'Дизайнер' },
];

// Получаем ссылки на элементы DOM
const searchInput = document.getElementById('searchInput');
const resultsDiv = document.getElementById('results');

// Функция для отображения результатов
function displayResults(items) {
    // Очищаем предыдущие результаты
    resultsDiv.innerHTML = '';

    if (items.length === 0) {
        resultsDiv.innerHTML = '<div class="no-results">Совпадений не найдено</div>';
        return;
    }

    items.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('result-item');
        // Формируем красивый вывод данных
        itemDiv.innerHTML = `
            <span><strong>ID:</strong> ${item.id}</span>
            <span><strong>Имя:</strong> ${item.firstName} ${item.lastName}</span>
            <span><strong>Должность:</strong> ${item.jobTitle}</span>
        `;
        resultsDiv.appendChild(itemDiv);
    });
}

// Функция поиска
function searchAdvisor(query, dataList) {
    // 1. Подготовка запроса: убираем лишние пробелы, нижний регистр, разделение на слова
    const searchTerms = query.trim().toLowerCase().split(' ').filter(term => term !== ''); // filter убирает пустые строки от двойных пробелов

    // Если запрос пустой после очистки, ничего не ищем
    if (searchTerms.length === 0) {
        return [];
    }

    // 2. Фильтрация данных
    const results = dataList.filter(item => {
        // 3. Создание строки со всеми значениями для поиска (в нижнем регистре)
        //    ID преобразуется в строку для поиска
        const searchableContent = `${item.id} ${item.firstName} ${item.lastName} ${item.jobTitle}`.toLowerCase();

        // 4. Проверка, содержит ли элемент ВСЕ термины из запроса
        //    Используем метод every(), который вернет true, только если все элементы массива удовлетворяют условию
        return searchTerms.every(term => searchableContent.includes(term));
    });

    return results;
}

// Обработчик события ввода в поле поиска
searchInput.addEventListener('input', (event) => {
    const query = event.target.value;
    const foundItems = searchAdvisor(query, data);
    displayResults(foundItems);
});

// Опционально: Отобразить все элементы при загрузке (или не отображать ничего)
// displayResults(data); // Раскомментируйте, если хотите видеть все сразу
// Или оставить пустым, чтобы результаты появлялись только после ввода
displayResults([]); // Показывает пустой контейнер или сообщение "не найдено", если оно есть в displayResults для 0 items