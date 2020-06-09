let lat, lon;

//get geolocation data from browser
if ('geolocation' in navigator) {
    try{
        console.log('geolocation available');
        navigator.geolocation.getCurrentPosition(async position => {
        lat = position.coords.latitude;
        lon = position.coords.longitude;
        console.log(lat, lon);
        document.getElementById('latitude').textContent = lat;
        document.getElementById('longitude').textContent = lon;
        const api_url = `/weather/${lat},${lon}`;
        const response = await fetch(api_url);
        const json = await response.json();
        const weather = json.weather;
        //const air = json.air_quality.results[0].measurements[0];
        document.getElementById("summary").textContent=weather.weather[0].main;
        document.getElementById("temperature").textContent=toF(weather.main.temp);
        // document.getElementById("aq_parameter").textContent=air.parameter;
        // document.getElementById("aq_value").textContent=air.value;
        // document.getElementById("aq_units").textContent=air.unit;
        // document.getElementById("aq_date").textContent=air.lastUpdated;
        const data = { lat, lon};
        const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
        };
        const post_response = await fetch('/api', options);
        const post_json = await post_response.json();
        console.log(post_json);
        }); 
    } catch(error){
        console.log('something went wrong');
    }
    } else {
    console.log('geolocation not available');
}

//handle button press
// const button = document.getElementById('submit');
// button.addEventListener('click', async event => {

// });

function toF(k){
    const F = (k-273.15)*9/5+32;
    return Math.round(F);
}


