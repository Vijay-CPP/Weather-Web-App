require('dotenv').config()

const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.set('view engine', 'ejs');
const https = require("https");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const port = process.env.PORT || 3000;

app.get("/", function (req, res) {

    res.sendFile(__dirname + "/home.html");
})

app.post("/", function (req, res) {

    let formCity = req.body.cityName;

    const url = "https://api.openweathermap.org/data/2.5/weather?appid=" + process.env.API_KEY + "&units=metric&q=" + formCity;

    https.get(url, function (https_response) {

        https_response.on("data", function (data) {

            let weatherObj = JSON.parse(data);

            if (weatherObj.cod != "404") {
                let icon = weatherObj.weather[0].icon;
                let imgUrl = "http://openweathermap.org/img/wn/" + icon + "@2x.png"

                let obj = {
                    city: formCity,
                    source: imgUrl,
                    temp: weatherObj.main.temp,
                    feel: weatherObj.main.feels_like,
                    cond: weatherObj.weather[0].description,
                    pres: weatherObj.main.pressure,
                    hum: weatherObj.main.humidity,
                    wind: weatherObj.wind.speed,
                }

                res.render("weather", obj);
            }
            else {
                res.sendFile(__dirname + "/faliure.html");
            }
        });
    });

})

app.listen(port, () => {
    console.log("Listening to port 3000");
})

setInterval(function () {
    https.get("https://weather-app-vijay-cpp.herokuapp.com");
}, 300000); // every 5 minutes (300000)