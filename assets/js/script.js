// Variables
var cityInputForm = document.querySelector("#cityForm");
var currentLocButton = document.querySelector("#currentLocButton");
var incorrectCityVal = "";
var defaultCitiesEl = document.querySelector("#defaultCities");
var recentCities = ["New York City, US", "Melbourne, AU", "London, UK", "Nigara Falls, CA","Montreal", "Brampton", "Mississauga", "Toronto"];
var cityValue = "Toronto";
var errorMsgEl = document.querySelector(".errorMsg");

// DayJs Plugins
dayjs.extend(window.dayjs_plugin_utc);
dayjs.extend(window.dayjs_plugin_timezone);

//function for the submit Button
var cityInputButtonHandler = cityInputForm.addEventListener("submit", function(event) {
    event.preventDefault();
    cityValue = document.querySelector("#cityInput").value.trim();

    //check if the cityinput is empty, if so alert the user
    if(!cityValue) {
        errorMsgEl.classList.remove("notification-hide");
        errorMsgEl.classList.add("notification-display");
    } else {
        errorMsgEl.classList.remove("notification-display");
        errorMsgEl.classList.add("notification-hide");
    }

    //remove the element from array if it is duplicate
    removeElement(recentCities, cityValue);

    //API url
    var newApiUrlGoogleCoordinates = "https://maps.googleapis.com/maps/api/geocode/json?address=" + cityValue + "&key=AIzaSyAhOZZGJoUqHE0c14emapGTAXw11nkiHqs";
    //Pass the url
    apiGoogleCoordCall(newApiUrlGoogleCoordinates);
    //reset the form
    cityInputForm.reset();

});

//error validation when the through google data
var errorValidationForCity = function(error) {
    if (!cityValue) {
        return;
    }
    else if(!error) {
        errorMsgEl.classList.remove("notification-hide");
        errorMsgEl.classList.add("notification-display");
        //return;
    } else {
        if(errorMsgEl.classList.contains("notification-display")) {
            errorMsgEl.classList.remove("notification-display");
            errorMsgEl.classList.add("notification-hide");
            // errorMsgEl.style.display = "none";
        } 
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
        
        console.log("executed errorValidationForCity")
    }
        
};

//remove the array element if it is duplicate
function removeElement(array, el) {
    var index = array.indexOf(el);
    if (index > -1) {
        array.splice(index, 1);
    }
};

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
        return;
    } else {
        recentCities = loadedData;
    }

    //update the city value to the recent city
    cityValue = recentCities[recentCities.length-1];

    //create the buttons with loaded data
    recentCitiesButtons();
};

//Get button value and pass it to Open Weather to display the result
defaultCitiesEl.addEventListener("click", function(event) {
    //if a button is clicked run the apiGoogleCoordCall
    if (event.target.matches(".button")) {
        var targetCity = event.target.innerHTML;
        cityValue = targetCity;

        //remove the element from array if it is duplicate
        removeElement(recentCities, cityValue);

        var newApiUrlGoogleCoordinates = "https://maps.googleapis.com/maps/api/geocode/json?address=" + cityValue + "&key=AIzaSyAhOZZGJoUqHE0c14emapGTAXw11nkiHqs";
        apiGoogleCoordCall(newApiUrlGoogleCoordinates);
    }

});

//get the current location and pass it to Open Weather to display the result
currentLocButton.addEventListener("click", function() {
    getCurrentLocation();
});

var getCurrentLocation = function() {
    var errorMsgEl = document.querySelector(".errorMsg");
    navigator.geolocation.getCurrentPosition((data) => {
        //const geocoder = new google.maps.Geocoder();
            var lat = data.coords.latitude;
            var lng = data.coords.longitude;

        //create the url based on the current latlng
        reverseLookupurl = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat + "," + lng + "&key=AIzaSyAhOZZGJoUqHE0c14emapGTAXw11nkiHqs";
        //pass the url to apiGoogleCoordCall
        apiGoogleCoordCall(reverseLookupurl);

    });
    
    // remove the validation notification
    if(errorMsgEl) {
        console.log("eeror")
        errorMsgEl.classList.remove("notification-display");
        errorMsgEl.classList.add("notification-hide");
    }

};

//API call function to get the city lat and lng
var apiGoogleCoordCall = function(url) {
    fetch(url)
    .then(function(response) {
        if(response.ok) {
            response.json()
            .then(function(data) {
            passGoogleData(data);
            if(data) {
                incorrectCityVal = response.ok; 
                errorValidationForCity(incorrectCityVal);
            }
            }).catch(function(error) {
                incorrectCityVal = response.ok;
                errorValidationForCity(incorrectCityVal);
            });
        } else {
            incorrectCityVal = response.ok;
            errorValidationForCity(incorrectCityVal);
        }
        
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
        displayCurrentWeather(data);
        })  
    });
};

//display the data for current city
var displayCurrentWeather = function(data) {
    //var currentCityTitle = document.querySelector("#currentCityTitle");
    //var weatherIcon = document.querySelector(".weatherIcon");
    var dateEl = document.querySelector(".currentDate");
    var weatherEl = document.querySelector(".currentWeather");
    var tempDisplay = document.querySelector("#tempDisplay");
    var imgDisplay = document.querySelector("#imgDisplay")
    var uvIndData = data.current.uvi;
    var feelsLike = document.querySelector("#feelsLike");

    // Date and time based on the location
    dateEl.textContent = dayjs().tz(data.timezone).format('MMMM D, YYYY h:mm A');
    weatherEl.textContent = data.current.weather[0].description;

    //var currentWeather = document.querySelector("#currentWeather");
    var temp = document.querySelector(".tempData");
    var wind = document.querySelector(".windData");
    var humid = document.querySelector(".humidData");
    var uvInd = document.querySelector(".uvInData");

    temp.textContent = data.current.temp + " °C";
    wind.textContent = data.current.wind_speed + " KM/h";
    humid.textContent = data.current.humidity + " %";
    uvInd.textContent = data.current.uvi;

    imgDisplay.setAttribute("src", "https://openweathermap.org/img/wn/" + data.current.weather[0].icon +"@2x.png")
    tempDisplay.innerHTML = Math.round(data.current.temp) + "<span class='is-size-5'> °C </span>";
    feelsLike.innerHTML = "Feels Like: " + Math.round(data.current.feels_like) + " °C";

    // set the backgound color for UVindex
    if (uvIndData < 2) {
        uvInd.classList.add("bg-green");
        uvInd.classList.remove("bg-orange");
        uvInd.classList.remove("bg-red");
    } else if (uvIndData < 5) {
        uvInd.classList.add("bg-orange");
        uvInd.classList.remove("bg-green");
        uvInd.classList.remove("bg-red");
    } else {
        uvInd.classList.add("bg-red"); 
        uvInd.classList.remove("bg-green");
        uvInd.classList.remove("bg-orange");
    }

    //pass the data to fiveDayForcast
    fiveDayForcast(data);
};


var fiveDayForcast = function(data) {
    var forcastEl = document.querySelector("#fiveDayForcast");
    forcastEl.innerHTML = "";
    //console.log("5day", forcastEl);

    //loop the 5 day cards
    for(var i = 1; i < 6; i++) {
        var fiveDayCard = document.createElement("div");
        fiveDayCard.classList = "column card p-3 m-2 min-width-250 five-day-card";
        forcastEl.appendChild(fiveDayCard);
        var dateEl = document.createElement("h4");
        dateEl.innerHTML = '<i class="fas fa-calendar-day"></i>&nbsp ' + dayjs.unix(data.daily[i].dt).format('MMMM D, YYYY') + " - " + data.daily[i].weather[0].main;
        fiveDayCard.appendChild(dateEl);
        var iconEl = document.createElement("div");
        fiveDayCard.appendChild(iconEl);
        var dateIconEl = document.createElement("img");
        dateIconEl.setAttribute("src", "https://openweathermap.org/img/wn/" + data.daily[i].weather[0].icon +"@2x.png");
        iconEl.appendChild(dateIconEl);
        var tempEl = document.createElement("p");
        tempEl.innerHTML = "<i class='fas fa-thermometer-half'></i>&nbsp Temp : " + data.daily[i].temp.max + "/" + data.daily[i].temp.min + " °C";
        fiveDayCard.appendChild(tempEl);
        var windEl = document.createElement("p");
        windEl.innerHTML = "<i class='fas fa-wind'></i> Wind : " + data.daily[i].wind_speed + " KM/h";
        fiveDayCard.appendChild(windEl);
        var HumidEl = document.createElement("p");
        HumidEl.innerHTML = "<i class='fas fa-tint'></i>&nbsp Humidity : " + data.daily[i].humidity + " %";
        fiveDayCard.appendChild(HumidEl);
    }
};

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

// load the old data when reloads the page
loadData(); 

// API for Google Coordinates
var apiUrlGoogleCoordinates = "https://maps.googleapis.com/maps/api/geocode/json?address=" + cityValue + "&key=AIzaSyAhOZZGJoUqHE0c14emapGTAXw11nkiHqs";

//call the apiGoogleCoordCall when the page loads
apiGoogleCoordCall(apiUrlGoogleCoordinates);
