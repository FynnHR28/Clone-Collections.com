
//using the geoapify api to get lat and long
let APIKEY = '9e7012b0296e4796855db9eba33e159b';


const countries = ["Afghanistan","Albania","Algeria","Andorra","Angola","Anguilla","Antigua &amp; Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia &amp; Herzegovina","Botswana","Brazil","British Virgin Islands","Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Cape Verde","Cayman Islands","Chad","Chile","China","Colombia","Congo","Cook Islands","Costa Rica","Cote D Ivoire","Croatia","Cruise Ship","Cuba","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Estonia","Ethiopia","Falkland Islands","Faroe Islands","Fiji","Finland","France","French Polynesia","French West Indies","Gabon","Gambia","Georgia","Germany","Ghana","Gibraltar","Greece","Greenland","Grenada","Guam","Guatemala","Guernsey","Guinea","Guinea Bissau","Guyana","Haiti","Honduras","Hong Kong","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Isle of Man","Israel","Italy","Jamaica","Japan","Jersey","Jordan","Kazakhstan","Kenya","Kuwait","Kyrgyz Republic","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macau","Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Mauritania","Mauritius","Mexico","Moldova","Monaco","Mongolia","Montenegro","Montserrat","Morocco","Mozambique","Namibia","Nepal","Netherlands","Netherlands Antilles","New Caledonia","New Zealand","Nicaragua","Niger","Nigeria","Norway","Oman","Pakistan","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Puerto Rico","Qatar","Reunion","Romania","Russia","Rwanda","Saint Pierre &amp; Miquelon","Samoa","San Marino","Satellite","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","South Africa","South Korea","Spain","Sri Lanka","St Kitts & Nevis","St Lucia","St Vincent","St. Lucia","Sudan","Suriname","Swaziland","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Timor L'Este","Togo","Tonga","Trinidad &amp; Tobago","Tunisia","Turkey","Turkmenistan","Turks &amp; Caicos","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States of America","Uruguay","Uzbekistan","Venezuela","Vietnam","Virgin Islands (US)","Yemen","Zambia","Zimbabwe"];
const countryElementList = [];
const searchBar = document.getElementById('search');
const countryElements = document.getElementById('country-list');
const countryImg = document.querySelector('country-image');

countries.forEach((country) => {
    let countryElement = document.createElement('div');
    countryElement.classList.add('country-elem');
    countryElement.innerText = country;
    countryElements.append(countryElement);
    countryElementList.push(countryElement);
    
});


searchBar.addEventListener('input', (e)=>{
    const value = e.target.value.toLowerCase();
    value.length > 0? countryElements.classList.add('active'): countryElements.classList.remove('active');
    
    countryElementList.forEach(countryElem =>{
        const isVisible = countryElem.innerText.toLowerCase().includes(value);
        countryElem.classList.toggle('hidden', !isVisible);
    });

});
















async function getLongAndLat(country){
    try{
        const requestOptions = {
            method: 'GET',
          };
        let response = await fetch("https://api.geoapify.com/v1/geocode/search?country=" + country + "&apiKey=" + APIKEY, requestOptions)
        let data = await response.json();
        const [lon,lat] = data.features[0].geometry.coordinates;
        //returns in better format
        return [lat, lon];   
    }catch(err){
        throw(err);
    }
    
}

async function getCountryData(country){
    try{
        const response = await fetch('https://restcountries.com/v3.1/name/'+country);
        const data = await response.json();
        console.log(data);
    }catch(err){
        throw(err);
    }
    
}

function toRadians(degrees) {
    return degrees * Math.PI / 180;
  };
   
  // Converts from radians to degrees.
  function toDegrees(radians) {
    return radians * 180 / Math.PI;
  }
  
  function bearing(startLat, startLng, destLat, destLng){
    startLat = toRadians(startLat);
    startLng = toRadians(startLng);
    destLat = toRadians(destLat);
    destLng = toRadians(destLng);
  
    let y = Math.sin(destLng - startLng) * Math.cos(destLat);
    let x = Math.cos(startLat) * Math.sin(destLat) -
          Math.sin(startLat) * Math.cos(destLat) * Math.cos(destLng - startLng);
    let brng = Math.atan2(y, x);
    brng = toDegrees(brng);
    brng = (brng + 360) % 360;
    const bearings = ["NE", "E", "SE", "S", "SW", "W", "NW", "N"];

    let index = brng - 22.5;
    if (index < 0)
        index += 360;
    index = parseInt(index / 45);

    return(bearings[index]);
  }

  function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in km
    let dLat = deg2rad(lat2-lat1);  // deg2rad below
    let dLon = deg2rad(lon2-lon1); 
    let a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    let d = R * c; // Distance in km
    return d;
  }
  
  function deg2rad(deg) {
    return deg * (Math.PI/180)
  }

// const [lat1,lon1] = await getLongAndLat("Germany");
// const [lat2,lon2] = await getLongAndLat("Austria");

// console.log(getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2));
// console.log(bearing(lat1,lon1,lat2,lon2));

  

// Converts from degrees to radians.
