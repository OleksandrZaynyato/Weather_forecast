const dotenv = require('dotenv');
dotenv.config()
const KEY = process.env.KEY;


let weatherContainer = document.getElementById('weatherContainer')
const weatherForecast = document.getElementById('weatherForecast');


let city;
document.getElementById('searchWeather').onclick = () => {
    city = document.getElementById('inputCity').value;
    console.log(city);

    const myTab = document.getElementById('myTab');
    let weatherForecastStyle = weatherForecast.style.width
    myTab.style.width = weatherForecastStyle + 'px'

    addAnimation(weatherContainer, 'formToWeather');
    weatherForecast.style.display = 'block';
    // myTab.style.display = 'block';
    // myTabContent.style.display = 'block';
    hr.style.display = 'block'



    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${KEY}&units=metric`)
        .then(response => {
            if (!response.ok) {
                console.log("Є помилка");
                console.log(response.status);
            }

            return response.json()
        })
        .then((data) => {
            console.log(data);

            createWetherForecast(data.list)
        })
}

function addAnimation(element, animation) {
    element.style.animation = `${animation} 1s forwards`
}

function getWeatherDates(list) {
    const weatherDates = [];
    for (let i = 0; i < list.length; i++) {
        let date = list[i].dt_txt.split(" ")[0];
        if (!weatherDates.includes(date)) {
            weatherDates.push(date);
        }
    }
    return weatherDates;
}

async function createWetherForecast(weatherInfo) {
    const MyTub = document.getElementById('myTab')
    const myTabContent = document.getElementById('myTabContent')

    myTabContent.innerHTML = "";
    MyTub.innerHTML = "";

    const weatherDates = getWeatherDates(weatherInfo)

    for (let i = 0; i < weatherDates.length; i++) {
        const element = weatherDates[i];
        const weatherInfoForDay = getWeatherByDay(element, weatherInfo)
        console.log(weatherInfoForDay);
        const weatherTab = await createTab(element, weatherInfoForDay)

        myTabContent.appendChild(weatherTab.bodyTab);
        MyTub.innerHTML += weatherTab.buttonTab

        // appendChildElement(weatherInfoForDay);
    }
}

async function createTab(date, weatherForDay) { //date - число(дата), weatherForDay - масив даних про погоду на один день
    // const buttonTab = document.createElement('button');
    const dateSlice = date.slice(5, 10);
    const buttonTab = `<li class="nav-item" role="presentation">
                            <button class="nav-link" id="id${dateSlice}" data-bs-toggle="tab"
                                data-bs-target="#id${dateSlice}-pane" type="button" role="tab" aria-controls="id${dateSlice}-pane"
                                aria-selected="true">${dateSlice}</button>
                        </li>`
    // buttonTab.innerText = date;

    // const bodyContent = createDateWeatherList(weatherForDay);
    const bodyContent =  contentForBody(weatherForDay);

    const bodyTab = document.createElement('div');
    bodyTab.setAttribute('id', `id${dateSlice}-pane`);
    bodyTab.classList.add('tab-pane');
    bodyTab.classList.add('fade');
    bodyTab.setAttribute('role', "tabpanel");
    bodyTab.setAttribute('aria-labelledby', `id${dateSlice}`);

    // console.log(bodyContent);
    bodyTab.appendChild(bodyContent)
    return {
        buttonTab,
        bodyTab
    }
}

function contentForBody(weatherForDay) {
    const bodyForCard = document.createElement('div');
    bodyForCard.id = 'bodyForCard';

    const maxValue = getMaxValue(weatherForDay);
    const date = weatherForDay[0].dt_txt.split(" ")[0];
    const dayOfWeek = findDayOfWeek(date);

    const body =  `
                <div class="tab-content-else">
                    <div class="forFlex">
                        <div id="mainWeather">
                            <div class="forFlex">
                                <div id="cloudNow"><img src="http://openweathermap.org/img/w/${maxValue.cloudMostPopular}.png" alt=""></div>
                                <div id="tempNow">${Math.floor(maxValue.tempMax) + "°C"}</div>
                            </div>
                            <div id="feelsLike">FeelsLike: ${Math.floor(maxValue.feelsLikeMax) + "°C"}</div>
                        </div>

                        <ul id="listOfWeatherNow">
                            <li id="Humidity">Humidity: ${Math.floor(maxValue.humidityMax) + "%"}</li>
                            <li id="wind">Wind: ${Math.floor(maxValue.windMax) + "M/s"}</li>
                        </ul>
                    </div>
                    <div id="weather">
                        <h2>Weather</h2>
                        <p id="dayOfWeek">${dayOfWeek}</p>
                        <p id="description">${maxValue.descriptionMostPopular}</p>
                    </div>
                </div>
                `

    const tabulationList = createTabulationForLists(weatherForDay, date);

    bodyForCard.innerHTML += body;
    bodyForCard.appendChild(tabulationList);
    // document.getElementById('bodyForListTemp').appendChild(listOfCards);
    // bodyForListWind.appendChild(listOfCardsWind);
    // weatherForecast.appendChild(bodyForCard);
    // bodyForListTemp.innerHTML = listOfCards;
    // bodyForListWind.innerHTML = listOfCardsWind;
    // appendChildElement(bodyForListWind, listOfCardsWind)
    return bodyForCard
}

function createTabulationForLists(weatherForDay, date) {
    const listOfCardsTemp = createDateWeatherList(weatherForDay);
    const listOfCardsWind = createDateWindList(weatherForDay);



    const tabulationContainer = document.createElement('div');
    const tabulationButton = `
                                <ul class="nav nav-tabs" id="myTab1" role="tablist">
                                    <li class="nav-item" role="presentation">
                                        <button class="nav-link" id="tempButton${date}" data-bs-toggle="tab"
                                            data-bs-target="#tempButton${date}-pane" type="button" role="tab" aria-controls="tempButton${date}-pane"
                                            aria-selected="true">Temperature</button>
                                    </li>
                                    <li class="nav-item" role="presentation">
                                        <button class="nav-link" id="windButton${date}" data-bs-toggle="tab"
                                            data-bs-target="#windButton${date}-pane" type="button" role="tab" aria-controls="windButton${date}-pane"
                                            aria-selected="true">Wind</button>
                                    </li>
                                </ul>
                             `

    const tabulationBodyContainer = document.createElement('div');
    tabulationBodyContainer.classList.add('tab-content');
    

    const bodyTempTab = document.createElement('div');
    bodyTempTab.setAttribute('id', `tempButton${date}-pane`);
    bodyTempTab.classList.add('tab-pane');
    bodyTempTab.classList.add('fade');
    bodyTempTab.setAttribute('role', "tabpanel");
    bodyTempTab.setAttribute('aria-labelledby', `tempButton${date}`);
    bodyTempTab.appendChild(listOfCardsTemp);

    const bodyWindTab = document.createElement('div');
    bodyWindTab.setAttribute('id', `windButton${date}-pane`);
    bodyWindTab.classList.add('tab-pane');
    bodyWindTab.classList.add('fade');
    bodyWindTab.setAttribute('role', "tabpanel");
    bodyWindTab.setAttribute('aria-labelledby', `windButton${date}`);
    bodyWindTab.appendChild(listOfCardsWind);

    tabulationBodyContainer.appendChild(bodyTempTab);
    tabulationBodyContainer.appendChild(bodyWindTab);

    tabulationContainer.innerHTML += tabulationButton;
    tabulationContainer.appendChild(tabulationBodyContainer);
    return tabulationContainer;
}



function appendChildElement(weatherForDay) {
    const listOfCards = createDateWeatherList(weatherForDay);
    const listOfCardsWind = createDateWindList(weatherForDay);
    
    document.getElementById('bodyForListTemp').appendChild(listOfCards);
    document.getElementById('bodyForListWind').appendChild(listOfCardsWind);
}

function createDateWeatherList(weatherForDay) { //
    const listOfCards = document.createElement('div');
    listOfCards.classList.add('listOfCards')
    for (let i = 0; i < weatherForDay.length; i++) {
        const element = weatherForDay[i];
        const card = createWeatherCard(element)
        listOfCards.appendChild(card)
    }
    return listOfCards;
}

function createWeatherCard(weatherForHour) {
    const card = document.createElement('div');
    card.classList.add('card');
    // console.log(weatherForHour);

    const temp = Math.floor(weatherForHour.main.temp);
    const cloudImg = `http://openweathermap.org/img/w/${weatherForHour.weather[0].icon}.png`;
    const hourWithSeconds = weatherForHour.dt_txt.split(" ")[1];
    const hour = hourWithSeconds.split(":")[0] + ":" + hourWithSeconds.split(":")[1];

    card.innerHTML = `  <div class="card__item">
                            <div id="temp">${temp}°</div>
                        </div>
                        <div class="card__item">
                            <div id="cloud"><img src="${cloudImg}" alt=""></div>
                        </div>
                        <div class="card__item">
                            <div id="hour">${hour}</div>
                        </div>
                    `
    return card;
}

function createDateWindList(weatherForDay) { //
    const listOfCards = document.createElement('div');
    listOfCards.classList.add('listOfCards')
    for (let i = 0; i < weatherForDay.length; i++) {
        const element = weatherForDay[i];
        const card = createWindCard(element)
        listOfCards.appendChild(card)
    }
    return listOfCards;
}

function createWindCard(weatherForHour) {
    const card = document.createElement('div');
    card.classList.add('card');
    // console.log(weatherForHour);

    const speed = Math.floor(weatherForHour.wind.speed);
    const deg = weatherForHour.wind.deg;
    const hourWithSeconds = weatherForHour.dt_txt.split(" ")[1];
    const hour = hourWithSeconds.split(":")[0] + ":" + hourWithSeconds.split(":")[1];

    card.innerHTML = `  <div class="card__item">
                            <div>${speed}</div>
                        </div>
                        <div class="card__item">
                            <div><img style="transform: rotate(${deg - 90}deg)" src="right-arrow.png" alt=""></div>
                        </div>
                        <div class="card__item">
                            <div>${hour}</div>
                        </div>
                    `
    return card;
}


function getWeatherByDay(day, weatherInfo) {
    const weatherByDay = [];
    for (let i = 0; i < weatherInfo.length; i++) {
        const element = weatherInfo[i];
        const elementDate = element.dt_txt.split(" ")[0];
        if (day === elementDate) {
            weatherByDay.push(element);
        }
    }
    console.log(weatherByDay);
    return weatherByDay
}

async function getWeatherNow() {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${KEY}&units=metric`);
    const dataNow = await response.json();
    return dataNow;
}

function findDayOfWeek(dateString) {
    // Розбиваємо рядок на частини за допомогою "-"
    var parts = dateString.split('-');
    
    // Парсимо частини як числа
    var year = parseInt(parts[0]);
    var month = parseInt(parts[1]);
    var day = parseInt(parts[2]);
    
    // Виконуємо алгоритм Дацюка для знаходження дня тижня
    var daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var d = day;
    var m = (month < 3) ? month + 10 : month - 2;
    var Y = (month < 3) ? year - 1 : year;
    var y = Y % 100;
    var c = Math.floor(Y / 100);
    var dayOfWeekIndex = (d + Math.floor(2.6 * m - 0.2) + y + Math.floor(y / 4) + Math.floor(c / 4) - 2 * c) % 7;
    
    // Повертаємо день тижня
    return daysOfWeek[dayOfWeekIndex];
}

function getMaxValue(weatherForDay) {
    let tempMas = [];
    let humidityMas = [];
    let windMas = [];
    let cloudMas = [];
    let descriptionMas = [];
    let feelsLikeMas = [];
    
    weatherForDay.forEach((el)=>{
        tempMas.push(el.main.temp);
        humidityMas.push(el.main.humidity);
        windMas.push(el.wind.speed);
        cloudMas.push(el.weather[0].icon);
        descriptionMas.push(el.weather[0].description);
        feelsLikeMas.push(el.main.feels_like);
    });
    const tempMax = Math.max(...tempMas);
    const humidityMax = Math.max(...humidityMas);
    const windMax = Math.max(...windMas);
    const cloudMostPopular = getMostPopular(cloudMas);
    const descriptionMostPopular = getMostPopular(descriptionMas);
    const feelsLikeMax = Math.max(...feelsLikeMas);

    return{
        tempMax,
        humidityMax,
        windMax,
        cloudMostPopular,
        descriptionMostPopular,
        feelsLikeMax
    }
}

function getMostPopular(arr) {
    let obj = {};
    for (let i = 0; i < arr.length; i++) {
        const element = arr[i];
        if (!obj[element]) {
            obj[element] = 0;
        } 
        obj[element] ++;
    }
    let mostPopular={
        name:'',
        count:0
    }
    for (const key in obj) {
        if (Object.hasOwnProperty.call(obj, key)) {
            const count = obj[key];
            if (count > mostPopular.count) {
                mostPopular = {
                    name : key,
                    count : count
                }
            }
        }
    }
    return mostPopular.name;
}



let dog = {
    age:3,
    name:"Sharik"
}
console.log(dog.name);

















let чорнийЯщик = {
    // setTimeout(() => {

    //     let weatherContainerWidth = weatherContainer.offsetWidth;
    //     let inputCityContainerWidth = document.getElementById('inputCityContainer').offsetWidth;
    //     document.getElementById('weather').style.width = weatherContainerWidth - inputCityContainerWidth + 'px';
    //     console.log(document.getElementById('weather').style.width);

    // }, 1000)

    // console.log(weatherContainerWidth);
    // console.log(inputCityContainerWidth);

     // const bodyForCard = document.createElement('div')
    // bodyForCard.classList.add('tab-content-else')

    // const mainWeather = document.createElement('div');
    // mainWeather.id = 'mainWeather';
    // bodyForCard.appendChild(mainWeather);

    // const forFlex = document.createElement('div');
    // mainWeather.classList.add('forFlex');

    // const cloudNow = document.createElement('div');
    // mainWeather.id = 'cloudNow';
    // forFlex.

    // Створення основного контейнера
// const tabContentElse = document.createElement('div');
// tabContentElse.classList.add('tab-content-else');

// // Створення основного блоку погоди
// const mainWeather = document.createElement('div');
// mainWeather.id = 'mainWeather';

// // Створення контейнера для іконки та температури
// const forFlex = document.createElement('div');
// forFlex.classList.add('forFlex');

// // Створення блоку для хмар
// const cloudNow = document.createElement('div');
// cloudNow.id = 'cloudNow';

// // Створення блоку для температури
// const tempNow = document.createElement('div');
// tempNow.id = 'tempNow';

// // Додавання блоків до контейнера для іконки та температури
// forFlex.appendChild(cloudNow);
// forFlex.appendChild(tempNow);

// // Додавання контейнера для іконки та температури до основного блоку погоди
// mainWeather.appendChild(forFlex);

// // Створення блоку для "відчувається як"
// const feelsLike = document.createElement('div');
// feelsLike.id = 'feelsLike';

// // Додавання блоку "відчувається як" до основного блоку погоди
// mainWeather.appendChild(feelsLike);

// // Додавання основного блоку погоди до основного контейнера
// tabContentElse.appendChild(mainWeather);

// // Створення списку погодних параметрів
// const listOfWeatherNow = document.createElement('ul');
// listOfWeatherNow.id = 'listOfWeatherNow';

// // Створення елементів списку погодних параметрів
// ['Precipitation', 'Humidity', 'wind'].forEach(param => {
//     const listItem = document.createElement('li');
//     listItem.id = param;
//     listOfWeatherNow.appendChild(listItem);
// });

// // Додавання списку погодних параметрів до основного контейнера
// tabContentElse.appendChild(listOfWeatherNow);

// // Додавання основного контейнера до DOM
// document.body.appendChild(tabContentElse);


// weatherContainer.addEventListener('click', () => {
//     setTimeout(() => {
//         addAnimation(weatherContainer);

//     }, 1000)

// })

    // fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${KEY}&units=metric`)
    //     .then(response => {
    //         if (!response.ok) {
    //             console.log("Є помилка");
    //             console.log(response.status);
    //         }

    //         return response.json()
    //     })
    //     .then((data) => {
    //         console.log(data);
    //         const dataNow = data;
    //         return dataNow
    //     })

    

            // document.getElementById('')

            // document.getElementById('country').innerHTML = `${data.sys.country} <img src="http://flagsapi.com/${data.sys.country}/flat/64.png" alt="countryImg">`

            // document.getElementById('temprature').innerText = Math.floor(data.main.temp) + "°C"
            // document.querySelector('#sun img').src=`http://openweathermap.org/img/w/${data.weather[0].icon}.png`;

// async function getWeatherDataAsXML(city, apiKey) {
//     const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&mode=xml&units=metric`;

//     try {
//         const response = await fetch(url);
//         const xmlText = await response.text();
//         const parser = new DOMParser();
//         const xmlDoc = parser.parseFromString(xmlText, 'application/xml');
//         return xmlDoc;
//     } catch (error) {
//         console.log(error);
//         throw error;
//     }
// }







        // console.log(weatherTab);
        // weatherForecast.appendChild(weatherTab.buttonTab)
        // weatherForecast.appendChild(weatherTab.body);
        // MyTub.appendChild(weatherTab.buttonTab);
        // myTabContent.innerHTML += weatherTab.bodyTab

    // contentForBody(weatherForDay)
    // console.log(bodyContent);
    // const bodyTab = `
    //                 <div class="tab-pane fade" id="id${dateSlice}-pane" role="tabpanel" aria-labelledby="id${dateSlice}"
    //                     >${bodyContent}
    //                 </div>
    //                 `







    // const body =  `
    // <div class="tab-content-else">
    //     <div class="forFlex">
    //         <div id="mainWeather">
    //             <div class="forFlex">
    //                 <div id="cloudNow"><img src="http://openweathermap.org/img/w/${weatherNow.weather[0].icon}.png" alt=""></div>
    //                 <div id="tempNow">${Math.floor(weatherNow.main.temp) + "°C"}</div>
    //             </div>
    //             <div id="feelsLike">FeelsLike: ${Math.floor(weatherNow.main.feels_like) + "°C"}</div>
    //         </div>

    //         <ul id="listOfWeatherNow">
    //             <li id="Humidity">Humidity: ${Math.floor(weatherNow.main.humidity) + "%"}</li>
    //             <li id="wind">Wind: ${Math.floor(weatherNow.wind.speed) + "M/s"}</li>
    //         </ul>
    //     </div>
    //     <div id="weather">
    //         <h2>Weather</h2>
    //         <p>${weatherNow.weather[0].description}</p>
    //     </div>
    // </div>
    // `



    
}

