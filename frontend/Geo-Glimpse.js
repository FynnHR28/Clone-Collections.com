import { getDistanceFromLatLonInKm, bearing } from "./GeoCalculations.js";
/*it'll be a class with TBD name
static vars:
  countries, 
*/

export default class GeoGlimpse {
  static countries = ["Afghanistan","Albania","Algeria","Andorra","Angola","Anguilla","Antigua and Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia and Herzegovina","Botswana","Brazil","Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Cape Verde","Cayman Islands","Chad","Chile","China","Colombia","Congo","Cook Islands","Costa Rica","Ivory Coast","Croatia","Cuba","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Estonia","Ethiopia","Falkland Islands","Faroe Islands","Fiji","Finland","France","French Polynesia","Gabon","Gambia","Georgia","Germany","Ghana","Gibraltar","Greece","Greenland","Grenada","Guatemala","Guinea","Guinea-Bissau","Guyana","Haiti","Honduras","Hungary","Iceland","India","Indonesia","Iran","Iraq","Israel","Italy","Jamaica","Japan","Jordan","Kazakhstan","Kenya","Kuwait","Kyrgyz Republic","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macau","Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Mauritania","Mauritius","Mexico","Moldova","Monaco","Mongolia","Montenegro","Montserrat","Morocco","Mozambique","Namibia","Nepal","Netherlands","New Caledonia","New Zealand","Nicaragua","Niger","Nigeria","Norway","Oman","Pakistan","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Puerto Rico","Qatar","Romania","Russia","Rwanda","Samoa","San Marino","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","South Africa","South Korea","Spain","Sri Lanka","Saint Kitts and Nevis","Saint Vincent","Saint Lucia","Sudan","Suriname","Swaziland","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Timor-Leste","Togo","Tonga","Trinidad and Tobago","Tunisia","Turkey","Turkmenistan","Turks and Caicos","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States of America","Uruguay","Uzbekistan","Venezuela","Vietnam","Yemen","Zambia","Zimbabwe"];
  static gameContainer = document.getElementById('game-container');
  //in contstructor initialize html in game container

  constructor (){
    
    GeoGlimpse.gameContainer.innerHTML = `<div id="data-display">
    <div id="target-country-data">
        
    </div>
    </div>
    
    
    <div id="make-a-guess-container">
        <div class="search-container">
            <div class="search-wrapper">
                <input type="search" id="search" placeholder="Enter a country..." autocomplete="off">
                <div id="country-list">
    
                </div>
            </div>  
        </div>
        <button id="submit-guess"><i class="fa-solid fa-check"></i></button>
    </div>
    
    <div class="center-wrapper">
    <div id="guesses-container">
        <div class="guess">Guess 1</div>
        <div class="guess">Guess 2</div>
        <div class="guess">Guess 3</div>
        <div class="guess">Guess 4</div>
        <div class="guess">Guess 5</div>
        <div class="guess">Guess 6</div>
    </div>
    </div>
    `;
    //ELEMS
    this.countryElementList = [];
    this.searchBar = document.getElementById('search');
    this.countriesDiv = document.getElementById('country-list');
    this.submitGuessBtn = document.getElementById('submit-guess');
    this.countryDataContainer = document.getElementById("target-country-data");
    this.guessBoxes = document.querySelectorAll('.guess');
    
    this.initCountryList();
    //GAME VARS
    this.currentGuess = 0;
    this.targetName = GeoGlimpse.countries[Math.floor(Math.random() * GeoGlimpse.countries.length)];
    this.targetCountry = {};
    this.countryToLatAndLng = {};
    
    this.setupAsyncData(this.targetName);
    
    
    
  }

  initCountryList(){
    GeoGlimpse.countries.forEach((country) => {
      let countryElement = document.createElement('div');
      countryElement.classList.add('country-elem');
      countryElement.innerText = country;
      countryElement.addEventListener('click', ()=> {
        this.searchBar.value = countryElement.innerText;
        this.countriesDiv.classList.toggle('active');
      });
      this.countriesDiv.append(countryElement);
      this.countryElementList.push(countryElement);
      
      
  });
  
  }

  async fetchLatLngForCountry(country) {
    try{
      const data = await GeoGlimpse.getCountryData(encodeURIComponent(country));
      const {
        latlng
      } = data[0];
      return {country: country, lat: latlng[0], lng: latlng[1]}
      
    }
    catch(err){
      console.error(err);
    }
  }
    
  async populateCountryToLatLng(){
      const promises = GeoGlimpse.countries.map(country => this.fetchLatLngForCountry(country));
      const results = await Promise.all(promises);
      results.forEach(result => {
        if(result){
          this.countryToLatAndLng[result.country] = {lat: result.lat, lng: result.lng}; 
        }
      });
  }
  static async getCountryData(country){
    try{
        const response = await fetch('https://restcountries.com/v3.1/name/'+country);
        const data = await response.json();
        return data;
        
    }catch(err){
        throw(err);
    }
    
  }
  repeatGuess(guess){
    for(let i = 0; i < this.guessBoxes.length; i++){
      if( 'country' in this.guessBoxes[i].dataset){
          if(this.guessBoxes[i].dataset.country === guess) return true;
      }
      else{ return false;}
    }
  }


  async setupAsyncData(targetName){
    let targetData;
    try{targetData = await GeoGlimpse.getCountryData(encodeURIComponent(targetName));}
    catch(err){console.error(err);}
    //destructure necessary data from json object
    try{await this.populateCountryToLatLng();}
    catch(err){console.error(err);}
    
    const {
      independent, landlocked, area, population, latlng, 
      coatOfArms, capital, gini
    } = targetData[0];
    let giniValue;
    if(gini){
      //some countries don't return a gini value
      giniValue = Object.values(gini);
    }
    this.targetCountry = {
      name: targetName,
      capital: capital,
      gini: giniValue,
      independent: independent,
      landlocked: landlocked,
      area: area,
      population: population,
      lat: Math.floor(latlng[0]),
      lng:  Math.floor(latlng[1]),
      coatImageLink: coatOfArms.png
   }
    const displayDataContent = {
      Capital: "Starts with  " + capital[0][0],
      Gini: giniValue,
      Independent: independent,
      Landlocked: landlocked,
      Area: area.toLocaleString() + " km sq",
      Population: population.toLocaleString(),
      LatitudeAndLongitude: [Math.floor(latlng[0]), Math.floor(latlng[1])]
    }
    //creating the data display element that goes inside #target-country-data
    const dataDisplayDiv = document.createElement('div');
    dataDisplayDiv.classList.add('data-display');

        //add each data point to the datadisplaydiv
    for( const key in displayDataContent){
      if(displayDataContent[key] != null){
        const dataPoint = document.createElement('div');
        dataPoint.classList.add('data-point', key);
        if(key == "LatitudeAndLongitude"){
          dataPoint.innerText = `Latitude & Longitude: ${displayDataContent[key]}`
        }
        else{
          dataPoint.innerText = `${key}: ${displayDataContent[key]}`
        }
        
        dataDisplayDiv.appendChild(dataPoint);
      }
      
    }
    const coatImg =  document.createElement('img');
    coatImg.src = coatOfArms.png;
    coatImg.classList.add('coat-of-arms');

    dataDisplayDiv.appendChild(coatImg);

    //add to target country data div
    this.countryDataContainer.appendChild(dataDisplayDiv);
    this.initKeyListeners();
    
  }

  initKeyListeners(){
          //EVENT LISTENERS
      this.searchBar.addEventListener('input', (e)=>{
        const value = e.target.value.toLowerCase();
        value.length > 0? this.countriesDiv.classList.add('active'): countriesDiv.classList.remove('active');
        this.countryElementList.forEach(countryElem =>{
          const isVisible = countryElem.innerText.toLowerCase().includes(value);
          countryElem.classList.toggle('hidden', !isVisible);
        });

      });


      //TODO: handle most of game logic here
      this.submitGuessBtn.addEventListener('click', () => {
        const guess = this.searchBar.value;
        if(!GeoGlimpse.countries.includes(guess)) return;
        else{
          if(guess === this.targetName){
            console.log("you got it!")
          }
          else{
        
            if(this.repeatGuess(guess)){
             //placeholder, should trigger alert box
             return;
            } 
        
            //Valid guess, get details and update display
            const guessLatLng = this.countryToLatAndLng[guess];
            
            //handle the guess reveal part
            const dist = Math.floor(getDistanceFromLatLonInKm(this.targetCountry.lat,this.targetCountry.lng,guessLatLng.lat, guessLatLng.lng));
            const dir = bearing(guessLatLng.lat, guessLatLng.lng,this.targetCountry.lat,this.targetCountry.lng);
            
            console.log(dir)
            this.guessBoxes[this.currentGuess].classList.add('used');

            const arrowIcon = document.createElement('div');
            
            arrowIcon.innerHTML = `<i class="fa-solid fa-arrow-up"></i>`;
            arrowIcon.classList.add(dir);
            
            this.guessBoxes[this.currentGuess].innerText = guess + ": " + dist.toLocaleString() + " km";
            this.guessBoxes[this.currentGuess].dataset.country = guess;
            this.guessBoxes[this.currentGuess].append(arrowIcon);
            
            this.currentGuess++;
            this.searchBar.value = "";

            if(this.currentGuess == this.guessBoxes.length) console.log(`You lost! The country was: ${this.targetCountry.name}`)

        
          }
        }
      });
  }


  //END OF CLASS
}

















  


