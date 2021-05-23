// fetch the city temperature data
var apiUrlCurrentWeather = "http://api.openweathermap.org/data/2.5/weather?q=toronto&appid=147c783a9d14b60563419ed8e17c02ec"
var apiUrlGoogleCoordinates = "https://maps.googleapis.com/maps/api/geocode/json?address=toronto&key=AIzaSyAhOZZGJoUqHE0c14emapGTAXw11nkiHqs"

// Variables
var cityInput = document.querySelector("#cityForm");
var cityValue = "Toronto";

//function for the submit Button
var cityInputButtonHandler = cityInput.addEventListener("submit", function(event) {
    event.preventDefault();
    cityValue = document.querySelector("#cityInput").value;
    //API url
    apiUrlGoogleCoordinates = "https://maps.googleapis.com/maps/api/geocode/json?address=" + cityValue + "&key=AIzaSyAhOZZGJoUqHE0c14emapGTAXw11nkiHqs";
    //Pass the url
    apiGoogleCoordCall(apiUrlGoogleCoordinates);
    
});

var defaultCitiesEl = document.querySelector("#defaultCities");

defaultCitiesEl.addEventListener("click", function(event) {
    console.log(event.target);

    var targetCity = event.target.innerHTML;

    cityValue = targetCity;

    console.log(cityValue);
    apiUrlGoogleCoordinates = "https://maps.googleapis.com/maps/api/geocode/json?address=" + cityValue + "&key=AIzaSyAhOZZGJoUqHE0c14emapGTAXw11nkiHqs";
    apiGoogleCoordCall(apiUrlGoogleCoordinates);

})

//API call function to get the city lat and lng
var apiGoogleCoordCall = function(url) {
    fetch(url)
    .then(function(response) {
        response.json()
        .then(function(data) {
        console.log(data);
        passGoogleData(data);
        })  
    });
};

//pass the retrived google data to apiweathercall funtion
var passGoogleData = function(data) {
    var lat = data.results[0].geometry.location.lat;
    //console.log("this is lat", lat);
    var lng = data.results[0].geometry.location.lng;
    //console.log("this is lat", lng);
    var currentCityTitle = document.querySelector("#currentCityTitle");
    currentCityTitle.textContent = data.results[0].formatted_address;

    //API url
    apiUrlCurrentWeather = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lng + "&units=metric&appid=147c783a9d14b60563419ed8e17c02ec&"
    //pass the url
    apiWeatherCall(apiUrlCurrentWeather);

};

//function for the API weathercall
var apiWeatherCall = function(url) {
    fetch(url)
    .then(function(response) {
        response.json()
        .then(function(data) {
        console.log(data);
        displayCurrentWeather(data);
        })  
    });
};

//display the data for current city
var displayCurrentWeather = function(data) {
    //var currentCityTitle = document.querySelector("#currentCityTitle");
    var weatherIcon = document.querySelector(".weatherIcon");
    var dateEl = document.querySelector(".currentDate");
    var weatherEl = document.querySelector(".currentWeather");
    //currentCityTitle.textContent = cityValue;
    weatherIcon.setAttribute("src", "https://openweathermap.org/img/wn/" + data.current.weather[0].icon +".png");
    // var currentDate = new Date();
    // var date = currentDate.getFullYear()+'/'+(currentDate.getMonth()+1)+'/'+currentDate.getDate();
    dateEl.textContent = ` (${dayjs.unix(data.current.dt).format('MMMM D, YYYY')})`;
    weatherEl.textContent = " - " + data.current.weather[0].main;

    var currentWeather = document.querySelector("#currentWeather");
    var temp = document.querySelector(".tempData");
    var wind = document.querySelector(".windData");
    var humid = document.querySelector(".humidData");
    var uvInd = document.querySelector(".uvInData");

    temp.textContent = data.current.temp + " °C";
    wind.textContent = data.current.wind_speed + " KM/h";
    humid.textContent = data.current.humidity + " %";
    uvInd.textContent = data.current.uvi;
    
    // //displayTemperatue
    // var tempEl = document.createElement("p");
    // tempEl.textContent = "Temp : " + data.current.temp;
    // currentWeather.appendChild(tempEl);
    // //Dsiplay Wind
    // var windEl = document.createElement("p");
    // windEl.textContent = "Wind : " + data.current.wind_speed;
    // currentWeather.appendChild(windEl);
    // //Display Humidity
    // var humidityEl = document.createElement("p");
    // humidityEl.textContent = "Humidity : " + data.current.humidity;
    // currentWeather.appendChild(humidityEl);
    // //Display UV Index
    // var uvInEl = document.createElement("p");
    // uvInEl.textContent = "UV Index : " + data.current.uvi;
    // currentWeather.appendChild(uvInEl);

    fiveDayForcast(data);
}

var fiveDayForcast = function(data) {
    var forcastEl = document.querySelector("#fiveDayForcast");
    forcastEl.innerHTML = "";
    //console.log("5day", forcastEl);

    for(var i = 1; i < 6; i++) {
        var fiveDayCard = document.createElement("div");
        fiveDayCard.classList = "column card p-3 m-2 min-width-200 five-day-card";
        forcastEl.appendChild(fiveDayCard);
        var dateEl = document.createElement("h4");
        dateEl.textContent = dayjs.unix(data.daily[i].dt).format('MMMM D, YYYY') + " - " + data.daily[i].weather[0].main;
        fiveDayCard.appendChild(dateEl);
        var dateIconEl = document.createElement("img");
        dateIconEl.setAttribute("src", "https://openweathermap.org/img/wn/" + data.daily[i].weather[0].icon +".png");
        fiveDayCard.appendChild(dateIconEl);
        var tempEl = document.createElement("p");
        tempEl.textContent = "Temp : " + data.daily[i].temp.max + "/" + data.daily[i].temp.min + " °C";
        fiveDayCard.appendChild(tempEl);
        var windEl = document.createElement("p");
        windEl.textContent = "Wind : " + data.daily[i].wind_speed + " KM/h";
        fiveDayCard.appendChild(windEl);
        var HumidEl = document.createElement("p");
        HumidEl.textContent = "Humidity : " + data.daily[i].humidity + " %";
        fiveDayCard.appendChild(HumidEl);
    }
}

//call the google coord for the default city
apiGoogleCoordCall(apiUrlGoogleCoordinates);

