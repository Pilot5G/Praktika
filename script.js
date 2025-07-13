// script.js
// Данные поездов
const trains = [
    {
        id: 1,
        from: "Москва",
        to: "Санкт-Петербург",
        departureTime: "06:40",
        arrivalTime: "10:25",
        duration: "3 ч 45 мин",
        trainNumber: "757А",
        trainName: "Сапсан",
        trainType: "highspeed",
        classType: "second",
        price: 1890,
        seats: 42
    },
    {
        id: 2,
        from: "Москва",
        to: "Санкт-Петербург",
        departureTime: "08:30",
        arrivalTime: "12:15",
        duration: "3 ч 45 мин",
        trainNumber: "759А",
        trainName: "Сапсан",
        trainType: "highspeed",
        classType: "second",
        price: 2100,
        seats: 18
    },
    {
        id: 3,
        from: "Москва",
        to: "Санкт-Петербург",
        departureTime: "16:00",
        arrivalTime: "23:45",
        duration: "7 ч 45 мин",
        trainNumber: "015А",
        trainName: "Красная Стрела",
        trainType: "firm",
        classType: "first",
        price: 3500,
        seats: 8
    },
    {
        id: 4,
        from: "Москва",
        to: "Санкт-Петербург",
        departureTime: "22:50",
        arrivalTime: "07:30",
        duration: "8 ч 40 мин",
        trainNumber: "042Ч",
        trainName: "Гранд Экспресс",
        trainType: "firm",
        classType: "first",
        price: 5400,
        seats: 5
    },
    {
        id: 5,
        from: "Москва",
        to: "Санкт-Петербург",
        departureTime: "19:15",
        arrivalTime: "04:10",
        duration: "8 ч 55 мин",
        trainNumber: "032А",
        trainName: "Невский Экспресс",
        trainType: "common",
        classType: "third",
        price: 1200,
        seats: 126
    },
    {
        id: 6,
        from: "Москва",
        to: "Санкт-Петербург",
        departureTime: "12:20",
        arrivalTime: "16:05",
        duration: "3 ч 45 мин",
        trainNumber: "761А",
        trainName: "Сапсан",
        trainType: "highspeed",
        classType: "second",
        price: 2400,
        seats: 3
    }
];

// Элементы DOM
const searchForm = document.getElementById('searchForm');
const resultsContainer = document.getElementById('resultsContainer');
const passengerCountElement = document.getElementById('passengerCount');
const incrementButton = document.getElementById('increment');
const decrementButton = document.getElementById('decrement');
const sortSelect = document.getElementById('sort');

// Переменные состояния
let passengerCount = 1;

// Инициализация приложения
document.addEventListener('DOMContentLoaded', function() {
    // Загрузка текущей даты в поле даты
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    
    document.getElementById('departure').min = formatDate(today);
    document.getElementById('return').min = formatDate(tomorrow);
    
    // Отображение начальных результатов
    renderTrainResults(trains);
    
    // Обработчики событий
    searchForm.addEventListener('submit', handleSearch);
    incrementButton.addEventListener('click', incrementPassengers);
    decrementButton.addEventListener('click', decrementPassengers);
    sortSelect.addEventListener('change', handleSortChange);
});

// Форматирование даты для input[type=date]
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Обработчик поиска
function handleSearch(e) {
    e.preventDefault();
    
    const from = document.getElementById('from').value;
    const to = document.getElementById('to').value;
    const departure = document.getElementById('departure').value;
    const returnDate = document.getElementById('return').value;
    const trainType = document.getElementById('trainType').value;
    const classType = document.getElementById('classType').value;
    
    // Фильтрация поездов (в реальном приложении это был бы запрос к серверу)
    const filteredTrains = trains.filter(train => {
        // Проверка направления
        if (train.from !== from || train.to !== to) return false;
        
        // Проверка типа поезда
        if (trainType !== 'any' && train.trainType !== trainType) return false;
        
        // Проверка класса
        if (classType !== 'any' && train.classType !== classType) return false;
        
        return true;
    });
    
    // Отображение результатов
    renderTrainResults(filteredTrains);
    
    // Обновление заголовка результатов
    document.querySelector('.section-title').textContent = 
        `Найдено ${filteredTrains.length} поездов`;
}

// Увеличение количества пассажиров
function incrementPassengers() {
    if (passengerCount < 10) {
        passengerCount++;
        passengerCountElement.textContent = passengerCount;
    }
}

// Уменьшение количества пассажиров
function decrementPassengers() {
    if (passengerCount > 1) {
        passengerCount--;
        passengerCountElement.textContent = passengerCount;
    }
}

// Обработчик изменения сортировки
function handleSortChange() {
    const sortValue = sortSelect.value;
    const sortedTrains = [...trains];
    
    switch(sortValue) {
        case 'price_asc':
            sortedTrains.sort((a, b) => a.price - b.price);
            break;
        case 'price_desc':
            sortedTrains.sort((a, b) => b.price - a.price);
            break;
        case 'time_asc':
            sortedTrains.sort((a, b) => {
                const aTime = parseDuration(a.duration);
                const bTime = parseDuration(b.duration);
                return aTime - bTime;
            });
            break;
        case 'departure':
            sortedTrains.sort((a, b) => {
                const aTime = parseTime(a.departureTime);
                const bTime = parseTime(b.departureTime);
                return aTime - bTime;
            });
            break;
    }
    
    renderTrainResults(sortedTrains);
}

// Парсинг продолжительности поездки
function parseDuration(duration) {
    const [hours, minutes] = duration.split(' ч ');
    return parseInt(hours) * 60 + parseInt(minutes);
}

// Парсинг времени отправления
function parseTime(time) {
    const [hours, minutes] = time.split(':');
    return parseInt(hours) * 60 + parseInt(minutes);
}

// Отображение результатов поиска
function renderTrainResults(trains) {
    resultsContainer.innerHTML = '';
    
    if (trains.length === 0) {
        resultsContainer.innerHTML = `
            <div class="no-results">
                <i class="fas fa-train fa-3x"></i>
                <h3>Поездов по вашему запросу не найдено</h3>
                <p>Попробуйте изменить параметры поиска</p>
            </div>
        `;
        return;
    }
    
    trains.forEach(train => {
        const trainElement = document.createElement('div');
        trainElement.className = 'ticket-card';
        
        // Определение класса вагона
        let classLabel = '';
        switch(train.classType) {
            case 'first':
                classLabel = 'Первый класс';
                break;
            case 'second':
                classLabel = 'Второй класс';
                break;
            case 'third':
                classLabel = 'Третий класс';
                break;
        }
        
        // Форматирование цены
        const formattedPrice = train.price.toLocaleString('ru-RU');
        
        trainElement.innerHTML = `
            <div class="ticket-info">
                <div class="ticket-route">
                    <div class="route-station">
                        <h3>${train.departureTime}</h3>
                        <p>${train.from}</p>
                    </div>
                    
                    <div class="route-divider">
                        <i class="fas fa-arrow-right"></i>
                        <div class="route-duration">${train.duration}</div>
                    </div>
                    
                    <div class="route-station">
                        <h3>${train.arrivalTime}</h3>
                        <p>${train.to}</p>
                    </div>
                </div>
                
                <div class="ticket-details">
                    <div class="train-info">
                        <i class="fas fa-train"></i>
                        <div>
                            <div>${train.trainName} №${train.trainNumber}</div>
                            <div>${classLabel}</div>
                        </div>
                    </div>
                    
                    <div class="ticket-price">
                        <div class="price">${formattedPrice} ₽</div>
                        <div>${train.seats} мест</div>
                        <button class="btn-buy" data-id="${train.id}">Купить билет</button>
                    </div>
                </div>
            </div>
        `;
        
        resultsContainer.appendChild(trainElement);
    });
    
    // Добавляем обработчики событий для кнопок покупки
    document.querySelectorAll('.btn-buy').forEach(button => {
        button.addEventListener('click', function() {
            const trainId = this.getAttribute('data-id');
            const train = trains.find(t => t.id == trainId);
            alert(`Вы выбрали билет на поезд ${train.trainName} №${train.trainNumber} за ${train.price} ₽`);
        });
    });
}

// Эмуляция серверной части
// В реальном приложении здесь были бы AJAX-запросы к серверу
function fetchTrainData(from, to, date) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(trains.filter(train => 
                train.from === from && 
                train.to === to
            ));
        }, 500);
    });
}