var weatherDisplay = document.getElementById('weather')
var form = document.querySelector('form')
var input = document.querySelector('input')

form.onsubmit = function (e) {
    e.preventDefault()
    var userInput = input.value.trim()
    if(!userInput) return
    getWeather(userInput)
        .then(displayWeatherInfo)
        .catch(displayLocNotFound)
    input.value = ""
}

function getWeather(query){
    if(!query.includes(",")) query += ',us'
    return fetch(
        'https://api.openweathermap.org/data/2.5/weather?q=' + query + '&units=imperial&APPID=7fcef07db5cff5be6c9510f0b7fde678'
    )
    .then(function(res){
        return res.json()
    })
    .then (function(data){
        if(data.cod === "404")throw new Error('location not found')
        var iconUrl = 'https://openweathermap.org/img/wn/' + data.weather[0].icon + '@2x.png'
        var description = data.weather[0].description
        var actualTemp = data.main.temp
        var feelsLikeTemp = data.main.feels_like
        var place = data.name + ", " + data.sys.country
        var updatedAt = new Date(data.dt *1000)

        return{
            coords: data.coord.lat + "," + data.coord.lon,
            description : description,
            iconUrl : iconUrl,
            actualTemp: actualTemp,
            feelsLikeTemp: feelsLikeTemp,
            place: place,
            updatedAt: updatedAt
        }

    })
}

function displayLocNotFound(){
    weatherDisplay.innerHTML = "";
    var errMsg = document.createElement('h2')
    errMsg.textContent = "Location not found"
    weatherDisplay.appendChild(errMsg)
}

function displayWeatherInfo(weatherObj){
    weatherDisplay.innerHTML = "";
    function addBreak(){
        weatherDisplay.appendChild(
            document.createElement('br')
        )
    }

    var placeName= document.createElement('h2')
    placeName.textContent = weatherObj.place
    weatherDisplay.appendChild(placeName)

    var googleLink = document.createElement('a')
    googleLink.textContent = "Click to view map"
    googleLink.href = "https://www.google.com/maps/search/?api=1&query=" + weatherObj.coords
    googleLink.target = "_BLANK"
    weatherDisplay.appendChild(googleLink)

    var icon = document.createElement('img')
    icon.src = weatherObj.iconUrl
    weatherDisplay.appendChild(icon)

    var description = document.createElement('p')
    description.textContent = weatherObj.description
    description.style.textTransform = 'capitalize'
    weatherDisplay.appendChild(description)

    addBreak()

    var temp = document.createElement('p')
    temp.textContent = "Current: " + 
    weatherObj.actualTemp +
    "℉"
    weatherDisplay.appendChild(temp)

    var feelsLikeTemp = document.createElement('p')
    feelsLikeTemp.textContent = "Feels Like: " + 
    weatherObj.feelsLikeTemp + 
    "℉"
    weatherDisplay.appendChild(feelsLikeTemp)

    addBreak()

    var updatedAt = document.createElement('p')
    updatedAt.textContent = "Last updated: " +
    weatherObj.updatedAt.toLocaleTimeString (
        'en-US',
        {
            hour: 'numeric', 
            minute: '2-digit'
        } 
    )
    
    addBreak()

    weatherDisplay.appendChild(updatedAt)
}