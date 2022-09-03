var citySearched = document.querySelector("#citySearches");
var cityInput = document.querySelector("#cityTyped");
var currWeather = document.querySelector("#currentWeather");
var cityGiven = document.querySelector("#cityShown");
var fiveDayEl = document.querySelector("#forecast");
var fiveDayFore = document.querySelector("#fiveDayForecast");
var pastWeathersEl = document.querySelector("#pastWeathers");
var apiKey = "1b02d41e0268828ef67ac94753c6a12d"

var chosenCity = [];

var submitBtnEl = function(event){
    event.preventDefault();
    var city = cityInput.value;
    if(city){
        cityWeatherEl(city);
        show5Day(city);
        chosenCity.unshift({city});
        cityInput.value = "";
    } else{
        alert("City name is required!");
    }
    saveSearches();
    pastSearches(city);
};

var saveSearches = function(){
    localStorage.setItem("city", JSON.stringify(chosenCity));
};

var cityWeatherEl = function(city){
    var apiKey = "1b02d41e0268828ef67ac94753c6a12d"
    var apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`

    fetch(apiURL)
    .then(function(response){
        response.json().then(function(data){
            showWeather(data, city);
        });
    });
};

var showWeather = function(weather, searchCity){
   currWeather.textContent= "";  
   cityGiven.textContent=searchCity;

   var currentDate = document.createElement("div")
   currentDate.textContent=" (" + moment(weather.dt.value).format("MMM D, YYYY") + ") ";
   cityGiven.appendChild(currentDate);

   var weatherIcon = document.createElement("img")
   weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`);
   cityGiven.appendChild(weatherIcon);

   var temperatureEl = document.createElement("div");
   temperatureEl.textContent = "Temperature: " + weather.main.temp + " °F";
   temperatureEl.classList = "temp-lists"
   currWeather.appendChild(temperatureEl);
  
   var humidityEl = document.createElement("div");
   humidityEl.textContent = "Humidity: " + weather.main.humidity + " %";
   humidityEl.classList = "temp-lists"
   currWeather.appendChild(humidityEl);

   var windSpeedEl = document.createElement("div");
   windSpeedEl.textContent = "Wind Speed: " + weather.wind.speed + " MPH";
   windSpeedEl.classList = "temp-lists"
   currWeather.appendChild(windSpeedEl);

   var lat = weather.coord.lat;
   var lon = weather.coord.lon;
   uvIndex(lat,lon)
};

var uvIndex = function(lat,lon){
    var apiKey = "1b02d41e0268828ef67ac94753c6a12d"
    var apiURL = `https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${lat}&lon=${lon}`
    fetch(apiURL)
    .then(function(response){
        response.json().then(function(data){
            showUvIndex(data)
        });
    });
};
 
var showUvIndex = function(index){
    var uvIndexEl = document.createElement("div");
    uvIndexEl.textContent = "UV Index: "
    uvIndexEl.classList = "temp-lists"

    uvIndexValue = document.createElement("div")
    uvIndexValue.textContent = index.value

    if(index.value <=2){
        uvIndexValue.classList = "good"
    }else if(index.value >2 && index.value<=8){
        uvIndexValue.classList = "moderate"
    }
    else if(index.value >8){
        uvIndexValue.classList = "extreme"
    };

    uvIndexEl.appendChild(uvIndexValue);

    currWeather.appendChild(uvIndexEl);
};

var show5Day = function(city){
    var apiKey = "1b02d41e0268828ef67ac94753c6a12d"
    var apiURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`

    fetch(apiURL)
    .then(function(response){
        response.json().then(function(data){
           fiveDayInfo(data);
        });
    });
};

var fiveDayInfo = function(weather){
    fiveDayFore.textContent = ""
    fiveDayEl.textContent = "5-Day Forecast:";

    var forecast = weather.list;
        for (var i=5; i < forecast.length; i=i+8){
       var dailyForecast = forecast[i];
        
       
       var forecastEl=document.createElement("div");
       forecastEl.classList = "card";

       var forecastDate = document.createElement("h5")
       forecastDate.textContent= moment.unix(dailyForecast.dt).format("MM DD, YYYY");
       forecastDate.classList = "card-header text-center"
       forecastEl.appendChild(forecastDate);

       var weatherIcon = document.createElement("img")
       weatherIcon.classList = "card-body text-center";
       weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${dailyForecast.weather[0].icon}@2x.png`);  

       forecastEl.appendChild(weatherIcon);
       
       var forecastTempEl = document.createElement("div");
       forecastTempEl.classList = "card-body text-center";
       forecastTempEl.textContent = "Temperature: " + dailyForecast.main.temp + " °F";forecastEl.appendChild(forecastTempEl);

       var forecastWindEl = document.createElement("div");
       forecastWindEl.classList = "card-body text-center";
       forecastWindEl.textContent = "Wind Speed: " + dailyForecast.wind.speed + " MPH";
       forecastEl.appendChild(forecastWindEl);

       var forecastHumEl = document.createElement("div");
       forecastHumEl.classList = "card-body text-center";
       forecastHumEl.textContent = "Humidity: " + dailyForecast.main.humidity + "  %";forecastEl.appendChild(forecastHumEl);

       fiveDayFore.appendChild(forecastEl);
    };
};

var pastSearches = function(pastSearches){
 
    pastSearchEl = document.createElement("button");
    pastSearchEl.textContent = pastSearches;
    pastSearchEl.classList = "w-100 btn-light past-results";
    pastSearchEl.setAttribute("previous-city",pastSearches)

    pastWeathersEl.prepend(pastSearchEl);
};


var pastSeachesBtn = function(event){
    var city = event.target.getAttribute("previous-city")
    if(city){
        cityWeatherEl(city);
        show5Day(city);
    };
};

citySearched.addEventListener("submit", submitBtnEl);
pastWeathersEl.addEventListener("click", pastSeachesBtn);