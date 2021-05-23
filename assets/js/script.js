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

//API call function to get the city lat and lng
var apiGoogleCoordCall = function(url) {
    fetch(url)
    .then(function(response) {
        response.json()
        .then(function(data) {
        //console.log(data);
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
        //console.log(data);
        displayCurrentWeather(data);
        })  
    });
};

//display the data for current city
var displayCurrentWeather = function(data) {
    var currentCityTitle = document.querySelector("#currentCityTitle");
    var weatherIcon = document.querySelector(".weatherIcon");
    var dateEl = document.querySelector(".currentDate");
    currentCityTitle.textContent = cityValue;
    weatherIcon.setAttribute("src", "https://openweathermap.org/img/wn/" + data.current.weather[0].icon +".png");
    // var currentDate = new Date();
    // var date = currentDate.getFullYear()+'/'+(currentDate.getMonth()+1)+'/'+currentDate.getDate();
    dateEl.textContent = ` (${dayjs().format('MMMM D, YYYY')})`;

    var currentWeather = document.querySelector("#currentWeather");
    var temp = document.querySelector(".tempData");
    var wind = document.querySelector(".windData");
    var humid = document.querySelector(".humidData");
    var uvInd = document.querySelector(".uvInData");

    temp.textContent = data.current.temp + " ℃";
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
}

//call the google coord for the default city
apiGoogleCoordCall(apiUrlGoogleCoordinates);

