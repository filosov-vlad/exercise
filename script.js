// выбираем элементы на странице
const content = document.querySelector('.content');

// функция для запроса заголовков с сервера
function getTitles() {
    const xhr = new XMLHttpRequest();

    xhr.onload = function() {
        if (xhr.status === 200) {
            const titles = JSON.parse(xhr.responseText);
            renderTitles(titles); // вызываем функцию для отображения заголовков
        } else {
            console.error('Ошибка получения заголовков.');
        }
    };

    xhr.open('GET', 'http://localhost:3000/api/titles'); // здесь необходимо указать путь к API для получения заголовков
    xhr.send();
}

// функция для отображения заголовков на странице
function renderTitles(titles) {
    content.innerHTML = ''; // очищаем содержимое контейнера
    console.log(`Titles count: ${titles.length}`);

    // добавляем нужное количество блоков на страницу
    for (let i = 0; i < titles.length; i++) {
        const title = titles[i];
        const box = document.createElement('div');
        box.classList.add('box');
        if (title) {
            box.innerText = title.length > 15 ? title.substring(0, 12) + '...' : title; // обрезаем заголовок, если он не вмещается
        }
        content.appendChild(box);
    }

    // задаем равномерное расстояние между блоками и от краев
    const numCols = Math.floor((content.clientWidth - 40) / 170); // вычисляем количество столбцов (ширина блока + отступ)
    // const numRows = Math.ceil(titles.length / numCols); // вычисляем количество строк (округляем в большую сторону)
    const gap = (content.clientWidth - numCols * 170) / (numCols + 1);

    content.style.cssText += `grid-template-columns: repeat(${numCols}, 150px); grid-gap: ${gap}px;`;

    // добавляем скрытие блоков, которые не вмещаются при изменении размеров страницы
    window.addEventListener('resize', function() {
        const visibleBoxes = document.querySelectorAll('.box');
        console.log(`Visible boxes: ${visibleBoxes.length}`);
        for (let i = 0; i < visibleBoxes.length; i++) {
            visibleBoxes[i].classList.remove('hidden');
            if (!isVisible(visibleBoxes[i])) {
                visibleBoxes[i].classList.add('hidden');
            }
        }
    });

    // функция для проверки видимости элемента на странице
    function isVisible(element) {
        const rect = element.getBoundingClientRect();
        const viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
        return !(rect.bottom < 0 || rect.top - viewHeight >= 0);
    }
}

// вызываем функцию для получения заголовков с сервера
getTitles();