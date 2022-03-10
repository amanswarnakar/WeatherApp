require('dotenv').config();
const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const ejs = require('ejs');

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function(req, res) {
  res.render("home");
});

app.post("/", function(req, res) {
  const query =  `${req.body.cityName[0].toUpperCase()}${req.body.cityName.slice(1)}`;
  const apiKey = process.env.API_KEY;
  const unit = "metric";
  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&units=" + unit + "&appid=" + apiKey;
  https.get(url, function (response) {
    if(response.statusCode >= 200 && response.statusCode < 300){
      response.on("data", function (data) {
        const weatherData = JSON.parse(data);
        const temp = weatherData.main.temp; //main.temp
        const weatherDescription = weatherData.weather[0].description; //main.temp
        const icon = weatherData.weather[0].icon;
        const iconURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
        const bgImage = weatherData.weather[0].main;
        const humidity = weatherData.main.humidity;
        const temp_min = weatherData.main.temp_min;
        const temp_max = weatherData.main.temp_max;
        res.render("display", {
          query: query,
          temp: temp,
          weatherDescription: weatherDescription,
          iconURL: iconURL,
          bgImage: bgImage,
          humidity: humidity,
          temp_min: temp_min,
          temp_max: temp_max,
        });
      });
    } else {
      res.render('404');
    }
    });
})

let port = process.env.PORT;
if (port == null || port == ""){
  port = 3000;
}

app.listen(port, function () {
  console.log(`Server started on ${port}`);
});