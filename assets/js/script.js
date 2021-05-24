// Variables
var cityInput = document.querySelector("#cityForm");
var currentLocButton = document.querySelector("#currentLocButton");
var cityValue = "Toronto";
var defaultCitiesEl = document.querySelector("#defaultCities");
var recentCities = ["Edmonton", "Ottowa", "London", "Nigara","Mississauga", "Brampton", "North York", "Toronto"];

// API for Google Coordinates
var apiUrlGoogleCoordinates = "https://maps.googleapis.com/maps/api/geocode/json?address=" + cityValue + "&key=AIzaSyAhOZZGJoUqHE0c14emapGTAXw11nkiHqs";

//function for the submit Button
var cityInputButtonHandler = cityInput.addEventListener("submit", function(event) {
    event.preventDefault();
    var errorMsgEl = document.querySelector(".errorMsg");
    cityValue = document.querySelector("#cityInput").value.trim();

    if(!cityValue) {
        errorMsgEl.classList.remove("notification-hide");
        errorMsgEl.classList.add("notification-display");
        return;
    } else {
        if(errorMsgEl) {
            errorMsgEl.classList.remove("notification-display");
            errorMsgEl.classList.add("notification-hide");
            // errorMsgEl.style.display = "none";
        }
        //save the new city value in recentCities
        recentCities.push(cityValue);
        //remove the duplicates
        recentCities = [...new Set(recentCities)]
        //limit the recentCities to eight elements
        if (recentCities.length > 8) {
            recentCities.splice(0,1);
        }

        //save data when the button is clicked
        saveData();
        //load data when the button is clicked
        loadData();

        //API url
        apiUrlGoogleCoordinates = "https://maps.googleapis.com/maps/api/geocode/json?address=" + cityValue + "&key=AIzaSyAhOZZGJoUqHE0c14emapGTAXw11nkiHqs";
        //Pass the url
        apiGoogleCoordCall(apiUrlGoogleCoordinates);
        }
    
});

// Function to create the recent cities buttons
var recentCitiesButtons = function() {
    var buttonsContainer = document.querySelector("#recentCities");
    
    buttonsContainer.innerHTML = "";

    for(var i = recentCities.length - 1; i >= 0; i--) {
        var buttonsEl = document.createElement("button");
        buttonsEl.classList = "button mt-2 is-fullwidth is-info is-light is-capitalize";
        buttonsEl.textContent = recentCities[i];

        buttonsContainer.appendChild(buttonsEl);
    }
};

//Function to save the data
var saveData = function() {
    localStorage.setItem("recentCities", JSON.stringify(recentCities));
};

//funtion to load the data
var loadData = function() {
    //load data from local storage
    loadedData = JSON.parse(localStorage.getItem("recentCities"));

    //if the local storage is empty save the default list to local storage
    if (!loadedData) {
        saveData();
    } else {
        recentCities = loadedData;
    }

    //create the buttons with loaded data
    recentCitiesButtons();
};

//Get button value and pass it to Open Weather to display the result
defaultCitiesEl.addEventListener("click", function(event) {
    //if a button is clicked run the apiGoogleCoordCall
    if (event.target.matches(".button")) {
        var targetCity = event.target.innerHTML;
        cityValue = targetCity;
        apiUrlGoogleCoordinates = "https://maps.googleapis.com/maps/api/geocode/json?address=" + cityValue + "&key=AIzaSyAhOZZGJoUqHE0c14emapGTAXw11nkiHqs";
        apiGoogleCoordCall(apiUrlGoogleCoordinates);
    }

});

//get the current location and pass it to Open Weather to display the result
currentLocButton.addEventListener("click", function() {
    var errorMsgEl = document.querySelector(".errorMsg");
    if(errorMsgEl.classList.contains("notification-display")) {
        errorMsgEl.classList.remove("notification-display");
        errorMsgEl.classList.add("notification-hide");
    }    
    navigator.geolocation.getCurrentPosition((data) => {
        //const geocoder = new google.maps.Geocoder();
            var lat = data.coords.latitude;
            var lng = data.coords.longitude;

        //create the url based on the current latlng
        reverseLookupurl = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" +lat+ "," + lng + "&key=AIzaSyAhOZZGJoUqHE0c14emapGTAXw11nkiHqs";
        //pass the url to apiGoogleCoordCall
        apiGoogleCoordCall(reverseLookupurl);
    });
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
    var currentCityTitle = document.querySelector("#currentCityTitle");
    currentCityTitle.textContent = data.results[0].formatted_address;

    //API url
    apiUrlCurrentWeather = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lng + "&units=metric&appid=147c783a9d14b60563419ed8e17c02ec&";
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

    //var currentWeather = document.querySelector("#currentWeather");
    var temp = document.querySelector(".tempData");
    var wind = document.querySelector(".windData");
    var humid = document.querySelector(".humidData");
    var uvInd = document.querySelector(".uvInData");

    temp.textContent = data.current.temp + " °C";
    wind.textContent = data.current.wind_speed + " KM/h";
    humid.textContent = data.current.humidity + " %";
    uvInd.textContent = data.current.uvi;

    //pass the data to fiveDayForcast
    fiveDayForcast(data);
}

var fiveDayForcast = function(data) {
    var forcastEl = document.querySelector("#fiveDayForcast");
    forcastEl.innerHTML = "";
    //console.log("5day", forcastEl);

    //loop the 5 day cards
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

//Buttons container collapse function on mobile. 
var collapseButton = document.querySelector(".collapsible");

collapseButton.addEventListener("click", function() {
    this.classList.toggle("active");
    var buttons = this.nextElementSibling;
    if (buttons.style.maxHeight) {
        buttons.style.maxHeight = null;
    } else {
        buttons.style.maxHeight = buttons.scrollHeight + "px";
    }
});

//call the google coord for the default city
apiGoogleCoordCall(apiUrlGoogleCoordinates);

//load the data from local storage
loadData();
