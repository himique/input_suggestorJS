let searchNames = [
    { name: "Artem", secondName: "Bondarenko", age: 22, emp: "Developer", id: 1, desc: "I do, what i wanna do" },
    { name: "Hans", secondName: "Amamenko", age: 43, emp: "Waiter", id: 2, desc: "I love be a waiter" },
    { name: "Artem", secondName: "Smith", age: 30, emp: "Engineer", id: 3, desc: "Building the future" },
    { name: "Anna", secondName: "Bondarenko", age: 28, emp: "Designer", id: 4, desc: "Creating beautiful things" },
    { name: "John", secondName: "Doe", age: 35, emp: "Developer", id: 5, desc: "Coding all day" },
];

// ---  1. Данные и функции поиска ---

// Массив `searchNames` содержит объекты данных.  Каждый объект представляет человека
// со свойствами: имя (name), фамилия (secondName), возраст (age), должность (emp),
// уникальный идентификатор (id) и описание (desc).

// Эти функции фильтруют массив `searchNames` на основе поискового запроса:

function findObjectByName(arr, query) {
    query = query.toLowerCase(); // Преобразование запроса в нижний регистр для поиска без учета регистра
    return arr.filter(item => item.name.toLowerCase().includes(query)); //Фильтрация и возврат
}

function findObjectBySecondName(arr, query) {
    query = query.toLowerCase();
    return arr.filter(item => item.secondName.toLowerCase().includes(query));
}

function findObjectByEmp(arr, query) {
    query = query.toLowerCase();
    return arr.filter(item => item.emp.toLowerCase().includes(query));
}

// --- 2. Генерация предложений (getSuggestions) ---

function getSuggestions(arr, query) {
    let results = [];

    if (query.length > 0) {  // Искать только если пользователь что-то ввел
        // 1. Отдавать приоритет совпадениям, которые *начинаются* с запроса:
        results = results.concat(arr.filter(item =>
            item.name.toLowerCase().startsWith(query.toLowerCase()) ||  // Проверить имя
            item.secondName.toLowerCase().startsWith(query.toLowerCase()) || // Проверить фамилию
            item.emp.toLowerCase().startsWith(query.toLowerCase())        // Проверить должность
        ));

        // 2. Добавить совпадения, где запрос находится *где угодно* в полях:
        results = results.concat(findObjectByName(arr, query));
        results = results.concat(findObjectBySecondName(arr, query));
        results = results.concat(findObjectByEmp(arr, query));
    }

    // 3. Удалить дубликаты и построить строки предложений:
    const uniqueSuggestions = [];
    const idsSeen = new Set(); // Использовать Set для отслеживания идентификаторов, которые уже встречались
    for (const item of results) {
        if (!idsSeen.has(item.id)) { // Если этот идентификатор еще не встречался...
            idsSeen.add(item.id);      // Добавить идентификатор в Set
            uniqueSuggestions.push({
                suggestionString: `${item.name} ${item.secondName} (${item.emp})`, // Создать форматированную строку предложения
                id: item.id            // Сохранить идентификатор элемента
            });
        }
    }

    return uniqueSuggestions; // Вернуть массив уникальных объектов предложений
}

// --- 3. Отображение предложений (displaySuggestions) ---

function displaySuggestions(suggestions, resultsContainer) {
    resultsContainer.innerHTML = ''; // Очистить предыдущие предложения

    if (suggestions.length === 0) {  // Если нет предложений...
        resultsContainer.style.display = 'none'; // Скрыть контейнер предложений
        return;
    }

    suggestions.forEach(suggestion => { // Цикл по каждому объекту предложения
        const div = document.createElement('div'); // Создать <div> для предложения
        div.textContent = suggestion.suggestionString; // Установить текст в строку предложения
        div.dataset.id = suggestion.id; // Сохранить идентификатор в атрибуте data-id

        div.addEventListener('click', function() { // Добавить обработчик клика к предложению
            inputField.value = suggestion.suggestionString.split(" (")[0]; // Извлечь имя и фамилию
            resultsContainer.style.display = 'none'; // Скрыть предложения
            inputField.focus();  // Вернуть курсор в поле ввода
        });
        resultsContainer.appendChild(div); // Добавить <div> предложения в контейнер результатов
    });

    resultsContainer.style.display = 'block'; // Показать контейнер предложений
}

// --- 4. Обработчики событий и взаимодействие с пользователем ---

// Получить ссылки на поле ввода и контейнер результатов предложений:
const inputField = document.getElementById('myInput');
const resultsContainer = document.getElementById('autocomplete-results');
let selectedIndex = -1;  // Отслеживать текущее выбранное предложение (для навигации с клавиатуры)

// --- 4.1. Обработчик события input ---
inputField.addEventListener('input', function() {
    const query = this.value; // Получить текст, введенный пользователем
    const suggestions = getSuggestions(searchNames, query); // Получить предложения на основе запроса
    displaySuggestions(suggestions, resultsContainer); // Отобразить предложения
    selectedIndex = -1; // Сбросить выбранный индекс при изменении ввода
});

// --- 4.2. Обработчик события keydown (для навигации с клавиатуры) ---
inputField.addEventListener('keydown', function(event) {
    const suggestions = resultsContainer.children; // Получить все элементы <div> предложений

    if (event.key === 'ArrowDown') { // Если нажата клавиша "стрелка вниз"...
        event.preventDefault(); // Предотвратить стандартное поведение браузера (перемещение курсора)
        selectedIndex = (selectedIndex + 1) % suggestions.length; // Перейти к следующему предложению (с зацикливанием)
        updateSelection(suggestions, selectedIndex); // Выделить выбранное предложение
    } else if (event.key === 'ArrowUp') { // Если нажата клавиша "стрелка вверх"...
        event.preventDefault();
        selectedIndex = (selectedIndex - 1 + suggestions.length) % suggestions.length; // Перейти к предыдущему предложению (с зацикливанием)
        updateSelection(suggestions, selectedIndex);
    } else if (event.key === 'Enter' && selectedIndex !== -1) { // Если нажат Enter и выбрано предложение...
        event.preventDefault();
        const selectedSuggestion = suggestions[selectedIndex]; // Получить выбранный элемент предложения
        if (selectedSuggestion) {
             const id = parseInt(selectedSuggestion.dataset.id, 10);  //Получить ID
             const fullSuggestionString = selectedSuggestion.textContent; // Получить полный текст предложения
             const nameAndSecondName = fullSuggestionString.split(" (")[0];  // Извлечь имя и фамилию
             inputField.value = nameAndSecondName;     // Установить значение поля ввода
             resultsContainer.style.display = 'none';  // Скрыть контейнер предложений
        }
    } else if (event.key === "Escape") { // Если нажат Escape...
        resultsContainer.style.display = 'none'; // Скрыть контейнер предложений
    }
});

// --- 4.3. Функция updateSelection (для выделения) ---
function updateSelection(suggestions, index) {
    for (let i = 0; i < suggestions.length; i++) {
        suggestions[i].classList.remove('autocomplete-selected'); // Удалить выделение со всех предложений
    }
    if (index >= 0) {
        suggestions[index].classList.add('autocomplete-selected'); // Добавить выделение к выбранному предложению
    }
}

// --- 4.4. Обработчик клика снаружи ---
document.addEventListener('click', function(event) {
    // Если пользователь кликает где-то *вне* контейнера автодополнения...
    if (!event.target.closest('.autocomplete-container')) {
        resultsContainer.style.display = 'none'; // Скрыть контейнер предложений
    }
});


Пошаговое объяснение (на русском)

Настройка данных:

Массив searchNames хранит данные, по которым производится поиск. Каждый элемент массива - это объект, представляющий человека.

Функции поиска (findObjectByName и т.д.):

Это вспомогательные функции. Они принимают массив searchNames и поисковый query (то, что ввел пользователь).

Они используют метод filter() для создания нового массива, содержащего только те объекты, которые соответствуют запросу.

.toLowerCase() используется повсеместно, чтобы сделать поиск нечувствительным к регистру (чтобы "артем" соответствовал "Артем").

.includes(query) проверяет, присутствует ли строка запроса где-либо в поле (имя, фамилия или должность).

getSuggestions (Основная логика):

Входные данные: Принимает массив searchNames и query пользователя.

Приоритетное сопоставление:

Сначала он находит элементы, у которых name, secondName или emp начинается с запроса (используя .startsWith()). Это делает более вероятным появление наиболее релевантных результатов вверху.

Затем он добавляет элементы, в которых запрос встречается где угодно в этих полях (используя .includes()).

Удаление дубликатов:

Из-за приоритетного и подстрочного сопоставления один и тот же элемент может быть найден несколько раз. Set с именем idsSeen используется для отслеживания идентификаторов элементов, которые уже были добавлены в результаты. Множества (Sets) допускают только уникальные значения, поэтому это эффективно предотвращает дублирование.

Создание строки предложения:

При добавлении элементов в массив uniqueSuggestions создается объект с двумя свойствами:

suggestionString: Это отформатированная строка, которая будет отображаться пользователю (например, "Артем Бондаренко (Developer)").

id: Это id исходного объекта данных, который необходим для связи предложения с полными данными.

Возвращаемое значение: Возвращает массив uniqueSuggestions, который содержит объекты со строками предложений и идентификаторами.

displaySuggestions:

Входные данные: Принимает массив uniqueSuggestions (из getSuggestions) и resultsContainer (<div>, где будут отображаться предложения).

Очистить предыдущие результаты: resultsContainer.innerHTML = ''; удаляет все старые предложения.

Проверка на пустоту: Если предложений нет, он скрывает resultsContainer и возвращается.

Создание элементов предложения:

Он перебирает массив suggestions.

Для каждого предложения он создает новый элемент <div>.

Он устанавливает текстовое содержимое <div> в suggestionString.

Он сохраняет id предложения в атрибуте data-id элемента <div>. Вот как вы связываете визуальное предложение с базовыми данными.

Событие Click: Добавляется обработчик клика. При клике на предложение:

В значение поля ввода устанавливается извлеченные имя и фамилия.

Скрывается resultsContainer.

Фокус возвращается на поле ввода.

Он добавляет вновь созданный <div> в resultsContainer.

Показать результаты: resultsContainer.style.display = 'block'; делает поле предложений видимым.

Обработчики событий:

Событие input: Это основной обработчик событий. Он привязан к inputField. Каждый раз, когда пользователь что-то печатает (или удаляет), это событие срабатывает:

Он получает текущее значение поля ввода (this.value).

Он вызывает getSuggestions, чтобы получить соответствующие предложения.

Он вызывает displaySuggestions, чтобы показать предложения пользователю.

Он сбрасывает selectedIndex на -1, поэтому навигация с клавиатуры начинается сверху.

Событие keydown: Обрабатывает навигацию с клавиатуры (стрелки и Enter):

Стрелки: Если пользователь нажимает стрелку вверх или вниз:

preventDefault() останавливает стандартное поведение браузера (которое перемещало бы курсор в поле ввода).

selectedIndex обновляется для перехода к следующему или предыдущему предложению. Оператор % (остаток от деления) используется, чтобы выбор "зацикливался" в начале и конце списка.

Вызывается updateSelection для визуального выделения выбранного предложения.

Клавиша Enter: Если пользователь нажимает Enter и выбрано предложение (selectedIndex !== -1):

Устанавливается значение поля ввода, извлекая имя и фамилию.

Скрывается resultsContainer.

Клавиша Escape: Если пользователь нажимает Escape:

Скрывается resultsContainer

updateSelection: Эта функция обрабатывает выделение текущего выбранного предложения:

Он удаляет класс autocomplete-selected со всех предложений.

Он добавляет класс autocomplete-selected к текущему выбранному предложению (если оно есть).

click (Щелчок снаружи): Этот обработчик событий привязан к document. Если пользователь щелкает за пределами контейнера автодополнения (.autocomplete-container), resultsContainer скрывается. Это важно для удобства использования.

По сути, код делает следующее:

Прослушивает ввод пользователя.

Находит соответствующие данные.

Форматирует совпадения как предложения.

Отображает предложения.

Обрабатывает взаимодействие с пользователем (щелчки и навигацию с клавиатуры).

Обновляет поле ввода при выборе предложения.

Использование атрибутов data-id, Set для удаления дубликатов, приоритетного сопоставления и отдельных функций для разных задач делает код хорошо организованным и эффективным.
