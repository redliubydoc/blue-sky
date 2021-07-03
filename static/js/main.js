const protocol = window.location.protocol;
const host = window.location.host;

const placeholderCity = document.getElementById('main-city');
const placeholderTemp = document.getElementById('main-temp');
const placeholderIcon = document.getElementById('main-icon');
// const placeholderMin = document.getElementById('main-min');
// const placeholderMax = document.getElementById('main-max');
const placeholderCondition = document.getElementById('main-condition');
const placeholderHumidity = document.getElementById('main-humidity');
const placeholderPressure = document.getElementById('main-pressure');
const placeholderWind = document.getElementById('main-wind');
const placeholderFeelslike = document.getElementById('main-feelslike');
const inputSearch = document.getElementById('main-search-input');
const buttonSearch = document.getElementById('main-search-button');

let wthData;
let currentLat;
let currentLon;
let isCelsius = true;


// to fetch weather data based on current location
(function getWthDataByGeo() {
    
    // fetch current location
    let xhr1 = new XMLHttpRequest();
    xhr1.open('get', `${protocol}//extreme-ip-lookup.com/json/`, false);

    xhr1.onload = function() {
        if(this.status === 200) {
            let response = JSON.parse(this.responseText);
            currentLat = response.lat;
            currentLon = response.lon;
        }
    }

    xhr1.send();

    // get weather data based on current location
    let xhr2 = new XMLHttpRequest();
    xhr2.open('get', `${protocol}//${host}/api?lat=${currentLat}&lon=${currentLon}`, true);

    xhr2.onload = function() {
        if(this.status === 200) {
            wthData = JSON.parse(this.responseText);
            
            // on receiving valid data
            if(wthData.cod === 200) {
                show();
            }
        }
    }

    xhr2.send();
})();

function show() {
    
    placeholderCity.innerText = wthData.name;
    placeholderTemp.innerText = `${Math.round(wthData.main.temp)}\xB0C`;
    placeholderIcon.src = `${protocol}//openweathermap.org/img/wn/${wthData.weather[wthData.weather.length-1].icon}@4x.png`;
    placeholderCondition.innerText = wthData.weather[wthData.weather.length-1].description; 
    placeholderHumidity.innerText = `${Math.round(wthData.main.humidity)} %`;
    placeholderPressure.innerText = `${Math.round(wthData.main.pressure)} hPa`;
    placeholderWind.innerText = `${Math.round(wthData.wind.speed * 36)/10 } kph`;
    placeholderFeelslike.innerText = `${Math.round(wthData.main.feels_like)}\xB0C`;


    // day or night 
    let currentTime = (new Date).getTime() / 1000;
    if(currentTime >= wthData.sys.sunrise && currentTime <= wthData.sys.sunset) {
        document.getElementById('main-container').style.cssText = `
            background-image: url('${protocol}//${host}/img/bg_day.png');
        `;
    }
    else {
        document.getElementById('main-container').style.cssText = `
            background-image: url('${protocol}//${host}/img/bg_night.png');
        `;
    }
}

buttonSearch.addEventListener('click', () => {

    if(inputSearch.value === undefined || inputSearch.value === null || inputSearch.value == "") {
        window.alert('Empty Field!');
        return;
    }
    
    buttonSearch.className = 'btn btn-success';
    let xhr = new XMLHttpRequest();

    xhr.open('get', `${protocol}//${host}/api?q=${inputSearch.value}`, true);

    xhr.onload = function() {
        if(this.status === 200) {
            let t = JSON.parse(this.responseText);
            
            // on receiving valid data
            if(t.cod === 200) {
                wthData = t;
                show();
            }
            else {
                window.alert('Invalid Search Query!');
            }
            buttonSearch.className = 'btn btn-danger';
            inputSearch.value = '';
        }
    }

    xhr.send();
});

placeholderTemp.addEventListener('click', () => {
    let mainTempF;
    let feelslikeF;
    let mainTempC = wthData.main.temp;
    let feelslikeC = wthData.main.feels_like;
    

    if(isCelsius) {
        mainTempF = (mainTempC * (9.0 / 5.0)) + 32;
        feelslikeF = (feelslikeC * (9.0 / 5.0)) + 32;

        placeholderTemp.innerText = `${Math.round(mainTempF)}\xB0F`;
        placeholderFeelslike.innerText = `${Math.round(feelslikeF)}\xB0F`;
    }
    else {
        placeholderTemp.innerText = `${Math.round(mainTempC)}\xB0C`;
        placeholderFeelslike.innerText = `${Math.round(feelslikeC)}\xB0C`;
    }
    isCelsius = !isCelsius;
});