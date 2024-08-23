export default class LingoLeap {
    
    //class vars

    static keys = ['Q','W','E','R','T','Y','U','I','O','P',
                 'A','S','D','F','G','H','J','K','L',
                   'Z','X','C','V','B','N','M'];

    constructor(){
       this.startNewGame();   
    }

    startNewGame(){
        //backend game logic
        if(this.handleKeyDown)document.removeEventListener('keydown', this.handleKeyDown);
        this.initWordAndKeyListener();
        this.guess = "";
        this.guessesLeft = 6;
        this.letterToKeyElement = {};

        //visuals
        if(this.LingoLeapBoard)this.LingoLeapBoard.remove();
        if(this.keyBoard)this.keyBoard.remove();
        this.gameDisplay = document.getElementById('game-display');
        this.LingoLeapBoard = this.createLingoLeapBoard(this.gameDisplay);
        this.rows = this.LingoLeapBoard.children;
        this.activeRow = 0;
        this.activeCell = 0;
        this.keyBoard = this.createKeyboard();  
  
    }
   

    async initWordAndKeyListener(){
        try{
            this.word = await LingoLeap.getNewWord();
            console.log(this.word);
            this.initKeyListener();
        } catch(err){
            console.error(err);
        }
    }
    
    initKeyListener(){
        this.handleKeyDown = (e) => {
           
            //reset so that row can vibrate
            this.rows[this.activeRow].classList.remove('vibrate');
           
            //guard clause, make sure it is a letter OR enter/delete
            if(!/[a-zA-Z]/.test(e.key)){
                return;
            }
            
            else if(e.key.length === 1 && this.guess.length < this.word.length){
                //add letter to guess
                this.guess += e.key;
                //ui stuff
                this.rows[this.activeRow].children[this.activeCell].innerText = e.key;
                this.activeCell < this.word.length? this.activeCell++ : this.activeCell = this.activeCell;   
            }
            else if (e.key === 'Backspace' && this.activeCell > 0){
                //remove last cletter of guess
                this.guess = this.guess.slice(0,-1);
                
                //ui stuff
                this.rows[this.activeRow].children[this.activeCell-1].innerText = "";
                this.activeCell > 0 ? this.activeCell--: this.activeCell = 0;   
            }
            else if (e.key === 'Enter'){
                if(this.guess.length != 5){
                    //vibrate and send message
                    this.rows[this.activeRow].classList.add('vibrate');
                    LingoLeap.sendAlertMessage('Not enough letters')
                    return;
                }
                
                //check to see if guess is valid using query params
               
                LingoLeap.checkGuessValidity(this.guess).
                then(isValid => {
                    if(!isValid){
                        //little ui to have it vibrate
                        this.rows[this.activeRow].classList.add('vibrate');
                        LingoLeap.sendAlertMessage('Invalid word');
                        //add message to say not a valid word
                        return;
                    }
                    this.processGuess(this.guess);
                    this.activeRow++;
                    this.activeCell = 0;
                    this.guess = "";
                }).
                catch(err => console.error(err));
            }   
             
        }
        document.addEventListener('keydown', this.handleKeyDown);
        
    }
    
    revealGuessOnRow(flipColorDict,row){
        console.log(row);
        for(let i =0; i < this.guess.length; i++){
            //set each letter box to appropriate flip color;
            this.rows[row].children[i].style.setProperty('--flip-color', flipColorDict[i]);
            setTimeout(( )=>{
                this.rows[row].children[i].classList.add('active');
            },i*100);
        }
    }

    createKeyboard = () => {
        let keyRows = [];
        
        let keyBoard = document.createElement('div');
        keyBoard.classList.add('keyBoard');
       
        for(let i = 0; i < 3; i++){
            const keyRow = document.createElement('div');
            keyRow.classList.add('keyrow');
            keyRows.push(keyRow);
            keyBoard.appendChild(keyRow);
        }
        for(let i = 0; i < LingoLeap.keys.length; i++){
            const key = document.createElement('div');
            key.classList.add('key');
            key.innerText = LingoLeap.keys[i];
            if(i < 10){
                keyRows[0].appendChild(key);
            }
            else if (i < 19){
                keyRows[1].appendChild(key);
            }
            else{
                keyRows[2].appendChild(key);
            }

            this.letterToKeyElement[LingoLeap.keys[i].toLowerCase()] = key; 
        }
        
        this.gameDisplay.appendChild(keyBoard);
       
        return keyBoard;
       
    }

   createLingoLeapBoard = () => {
        let LingoLeapBoard = document.createElement('div');
        LingoLeapBoard.classList.add('lingo-leap-board');
        this.gameDisplay.appendChild(LingoLeapBoard);
    
        for(let i = 0; i < 6; i ++){
            const guessRow = document.createElement('div');
            guessRow.classList.add('guess-row');
            for(let i = 0; i < 5 ;i++){
                const letterBox = document.createElement('div')
                letterBox.classList.add('letter-box');
                guessRow.appendChild(letterBox);
            }
            LingoLeapBoard.appendChild(guessRow);
        }
        return LingoLeapBoard;
    }
    
    processGuess(guess){
        this.guessesLeft--;
        let wordDict = LingoLeap.createWordDict(this.word);
        //this is all ui stuff
        //first pass for the greens, result of the enter for under case
        
        //added for the canal case, gotta think man
        let greens = [];
    
        let flipColorDict = {};
      
        for(let i = 0; i < guess.length; i++){
            if(guess[i] === this.word[i]){
                //a green result
                flipColorDict[i] = "green";
                wordDict[guess[i]] -= 1;
                greens.push(i);
                this.letterToKeyElement[guess[i]].style = "background-color: green";
            }   
            else{
                this.letterToKeyElement[guess[i]].style = "background-color: black";   
            }
            
        }
        //second pass at the yellows
        for(let i = 0; i < guess.length; i++){
            if(this.word.includes(guess[i]) && wordDict[guess[i]] > 0 && !greens.includes(i)){
                flipColorDict[i] = "#D2C350";
                wordDict[guess[i]] -= 1;
                this.letterToKeyElement[guess[i]].style = "background-color: #D2C350";
            }   
            
        }
    
       this.revealGuessOnRow(flipColorDict, this.activeRow);
        
        //TODO: will have to check see if they got the word or ran out of guesses here too
        if(guess === this.word){
           this.endgameBox("You're a genius!");
        }
        else if(this.guessesLeft < 1){
            this.endgameBox('Unlucky!');
        }
        
    }

    endgameBox(result){
        const endgameBox = document.createElement('div');
        endgameBox.classList.add('endgame-box');
    
        endgameBox.innerHTML = `<button id="exit-btn"><i class="fa-solid fa-x"></i></button>
        <h2>${result}</h2>
        <div id="word-display">
            <p><strong>The word was: ${this.word}</strong></p>
        </div>`
       
        const newGameBtn = document.createElement('button');
        newGameBtn.innerText = 'New Game';
        newGameBtn.classList.add('new-game-btn');
        newGameBtn.addEventListener('click', ()=>{
            this.startNewGame();
            newGameBtn.parentElement.remove();
        });
        endgameBox.appendChild(newGameBtn);
    
        document.body.append(endgameBox);
    
    
    }


    static createWordDict = (word) => {
        let dict = {};
        for(let i = 0; i < word.length; i++){
            let letter = word[i];
            if(dict.hasOwnProperty(letter)) dict[letter] += 1;
            else dict[letter]= 1;
        }
        return dict;
    
    }
    
    static sendAlertMessage(message){
        let alertBox = document.createElement('div');
        alertBox.classList.add('alert-box');
        alertBox.innerHTML = ` <i class="fa-solid fa-circle-exclamation"></i>
        <div class="alert-message">
            <p>${message}</p>
        </div>`;
        document.body.appendChild(alertBox);
        setTimeout(() => {
         alertBox.remove();
        },1200);
     
    }

    
    static async getNewWord(){
        let response = await fetch('http://localhost:3000/api/get-random-word');
        let data = await response.json();
        return data.word; 
    };
    
    static async checkGuessValidity(guess){
        //using query param ?guess= + guess
        let response = await fetch('http://localhost:3000/api/is-guess-valid?guess=' + guess);
        let data = await response.json();
        return data.isValid;
    }


}

