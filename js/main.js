//MyWidget Script
/**************************
Add a link for a CSS file that styles .mywidget
Add a script tag that points to CDN version of jQuery 1.*
Add a script tag that loads your script file from http://m.edumedia.ca/
**************************/
var scriptsLoaded = 0;

document.addEventListener("DOMContentLoaded", init);

function init(){

  var css = document.createElement("link");
  css.setAttribute("rel", "stylesheet");
  css.setAttribute("href", "css/main.css"); 
  //loads the CSS file and applies it to the page
  css.addEventListener("load", loadCount);
  document.querySelector("head").appendChild(css);

  var jq = document.createElement("script");
  jq.addEventListener("load", loadCount);
  jq.setAttribute("src","http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js");
  document.querySelector("head").appendChild(jq);
}

function buildWidget(cls){
  //now do the ajax call then build your page
  console.log("Using div with class %s", cls);
  $.get("https://api.forecast.io/forecast/11e3c01617a44ba183f53e6807a87480/45.3470,-75.7594?units=ca&exclude=daily, minutely, ozone, dewPoint, flags",
  onSuccess,
  "jsonp"
  );

  function onSuccess(data){
    //put data into div with class " + cls
    console.log(data);
  
    var html = '<div class ="table-responsive"><table class= "table">';
    var hourlyWeather = data.hourly.data[0];

    //icons for weather
    var imageMap = {
      "clear-day":"wi-day-sunny",
      "partly-cloudy-day":"wi-day-sunny-overcast",
      "clear-night":"wi-night-clear",
      "partly-cloudy-night":"wi-night-alt-cloudy",
      "wind":"wi-strong-wind",
      "rain":"wi-showers",
      "fog":"wi-fog",
      "snow":"wi-snow",
      "sleet":"wi-sleet",
      "hail":"wi-hail",
      "thunderstorm":"wi-thunderstorm",
      "tornado":"wi-tornado"
    }
    var wicon = "<i class ='wi " + imageMap[hourlyWeather.icon] + "'></i>";

    var date = new Date();
    
    $(".weather-forecast").append('<div id="topDiv">' + '<p id="currentIcon">' + wicon + '</p>' + '<p id="currentTemp">' + hourlyWeather.summary + '<br>' + "Temperature: " + Math.round(hourlyWeather.temperature) + '&#176;' + "C" + '</p>' + '<p id="current">' + "Current Conditions for today, " + date.toDateString() + '</p>' + '</div>');

    for (i=0; i<24; i++){
	hourlyWeather = data.hourly.data[i];
	hour= new Date(hourlyWeather.time * 1000);
	
    
    var time = (hour.getHours() + ":00");

    //table for hourlyWeather
    html += '<tr>'
    html += '<td>' + time + '</td>'
    html += '<td>' + Math.floor(hourlyWeather.temperature) + '&#176;' + "C" + '</td>'
    html += '<td>' + Math.floor(hourlyWeather.humidity * 100) + '%</td>'
    html += '<td><i class = "wi ' + imageMap[hourlyWeather.icon] + ' "></i></td>'
    html += '<td>' + Math.floor(hourlyWeather.cloudCover * 100) + '%</td>'
    html += '<td>' + hourlyWeather.windSpeed + " km/h" + '</td>'
    html += '<td>' + hourlyWeather.summary + '</td>'
    html += '</tr>'
    
 
    if(hour.getHours() === 23)
	{
	  break;
	}
  
    }
    html += '</table></div>'
    $(".weather-forecast").append(html);
  }
}

function loadCount(){
  scriptsLoaded++;
    if(scriptsLoaded === 2){
      //call the function in My widget script to load the JSON and build the widget
      buildWidget(".weather-forecast");
      console.log("both scripts loaded");
    }
}