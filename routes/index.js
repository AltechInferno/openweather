var express = require("express");
var request = require("request");
var router = express.Router();
require("dotenv").config();
const url = "https://api.openweathermap.org/data/2.5/weather?q=";
const appID = "&appid=" + process.env.SECRET;
const units = "&units=metric";
const appTitle = "OpenWeather Lambda Function";
let compassSector = [
  "N",
  "NNE",
  "NE",
  "ENE",
  "E",
  "ESE",
  "SE",
  "SSE",
  "S",
  "SSW",
  "SW",
  "WSW",
  "W",
  "WNW",
  "NW",
  "NNW",
  "N",
];
/* GET home page. */
router.get("/*", function (req, res, next) {
  res.render("index", {
    title: appTitle,
    body: "",
  });
});

/* GET weather route */
router.get("/*weather", function (req, res, next) {
  console.log(req.query);
  if (!req.query.city) {
    res.send(
      "You need to go back to homepage and enter a city in the search box"
    );
  } else {
    var cityName = req.query.city;
    let fullUrl = url + cityName + appID + units;
    request(fullUrl, function (error, response, body) {
      body = JSON.parse(body);
      res.send(body);
    });
  }
});

/* POST weather route. */
router.post("/*weather", function (req, res, next) {
  var cityName = req.body.city;
  let fullUrl = url + cityName + appID + units;
  request(fullUrl, function (error, response, body) {
    body = JSON.parse(body);
    if (error && response.statusCode != 200) {
      throw error;
    }
    console.log(body);
    res.render("index", {
      title: appTitle,
      body: body,
      cityName: cityName,
      forecast:
        body.cod === "404"
          ? "City Not Found"
          : `
Country: ${body.sys.country}
Temperature: ${body.main.temp} °C
Weather Conditions: ${body.weather[0].description}

Wind: ${body.wind.speed} km/h
Wind Direction: ${compassSector[(body.wind.deg / 22.5).toFixed(0)]}
Pressure: ${body.main.pressure} millibars
Humidity: ${body.main.humidity} g/kg
      `,
    });
  });
});

module.exports = router;
