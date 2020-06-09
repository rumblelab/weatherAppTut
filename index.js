require('dotenv').config();
const express = require('express');
const Datastore = require('nedb');
const fetch = require('node-fetch');
const app = express();
const port = process.env.PORT||3000;
app.listen(port, ()=>console.log(`listening at ${port}`));
app.use(express.static('public'));
app.use(express.json({limit:'1mb'}));
const api_key = process.env.API_KEY;

const database = new Datastore('database.db');
database.loadDatabase();

app.post('/api',(request,response)=>{
    const data = request.body;
    const timestamp = Date.now();
    data.timestamp = timestamp;
    database.insert(data);
    response.json(data);
});

app.get('/api',(request,response)=>{
    database.find({},(err,data)=>{
        if(err){
            response.end();
            return;
        }
        response.json(data);
    });
});
//http://api.openweathermap.org/data/2.5/weather?

app.get('/weather/:latlon',async (request,response)=>{
    const latlon=request.params.latlon.split(',');
    console.log(latlon);
    const lat = latlon[0];
    const lon = latlon[1];
    const weather_url = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}`;
    const weather_response = await fetch(weather_url);
    const weather_data = await weather_response.json();

    // const aq_url = `https://api.openaq.org/v1/latest?coordinates=${lat},${lon}`;
    // const aq_response = await fetch(aq_url);
    // const aq_data = await aq_response.json();

    const data = {
        weather: weather_data//,
        // air_quality: aq_data
    };
    response.json(data);
});

