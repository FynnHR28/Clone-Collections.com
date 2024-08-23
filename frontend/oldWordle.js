//FIRST DRAFT OF WORDLE, NOW IN A CLASS


// //document elements

// const gameDisplay =  document.getElementById('game-display');


// //game variables
// let word;
// let wordDict;
// let activeRow;
// let activeCell;
// let guess;
// let rows;
// let guessesLeft;
// let wordleBoard;
// let keyBoard;
// const keys = ['Q','W','E','R','T','Y','U','I','O','P',
//                  'A','S','D','F','G','H','J','K','L',
//                    'Z','X','C','V','B','N','M'];
// let keyRows = [];
// let letterToKeyElement = {};


// //creates rows and appends cells for each letter in word  to each row
// const createWordleBoard = () => {
//     wordleBoard = document.createElement('div');
//     wordleBoard.classList.add('wordle-board');
//     gameDisplay.appendChild(wordleBoard);

//     for(let i = 0; i < 6; i ++){
//         const guessRow = document.createElement('div');
//         guessRow.classList.add('guess-row');
//         for(let i = 0; i < 5 ;i++){
//             const letterBox = document.createElement('div')
//             letterBox.classList.add('letter-box');
//             guessRow.appendChild(letterBox);
//         }
//         wordleBoard.appendChild(guessRow);
//     }
    
// }

// const createKeyboard = () => {
//     letterToKeyElement = {};
//     keyBoard = document.createElement('div');
//     keyBoard.classList.add('keyBoard');
   
//     for(let i = 0; i < 3; i++){
//         const keyRow = document.createElement('div');
//         keyRow.classList.add('keyrow');
//         keyRows.push(keyRow);
//         keyBoard.appendChild(keyRow);
//     }
//     for(let i = 0; i < keys.length; i++){
//         const key = document.createElement('div');
//         key.classList.add('key');
//         key.innerText = keys[i];
//         if(i < 10){
//             keyRows[0].appendChild(key);
//         }
//         else if (i < 19){
//             keyRows[1].appendChild(key);
//         }
//         else{
//             keyRows[2].appendChild(key);
//         }
//         letterToKeyElement[keys[i].toLowerCase()] = key; 
//     }
//     gameDisplay.appendChild(keyBoard);
//     keyRows =[];
   


// }

// // creates and returns dictionary for target word letter frequency
// const createWordDict = (word) => {
//     let dict = {};
//     for(let i = 0; i < word.length; i++){
//         let letter = word[i];
//         if(dict.hasOwnProperty(letter)) dict[letter] += 1;
//         else dict[letter]= 1;
//     }
//     return dict;

// }

// const resetGameState = () => {
//     activeRow = 0;
//     activeCell = 0;
//     guess = "";
//     if(wordleBoard)wordleBoard.remove();
//     if(keyBoard)keyBoard.remove();
//     createWordleBoard(); 
//     createKeyboard(); 
    
    
// }


// async function startGame(){
//     word = await getNewWord();
//     resetGameState();
//     console.log(word);
//     console.log(activeRow)
//     wordDict = createWordDict(word);
//     rows = wordleBoard.children;
//     guessesLeft = 6;
// }


// document.addEventListener('keydown', (e)=>{
//     //reset so that row can vibrate
//     rows[activeRow].classList.remove('vibrate');
   
//     //guard clause, make sure it is a letter OR enter/delete
//     if(!/[a-zA-Z]/.test(e.key))return;
    
//     else if(e.key.length === 1 && guess.length < word.length){
//         //add letter to guess
//         guess += e.key;
//         //ui stuff
//         rows[activeRow].children[activeCell].innerText = e.key;
//         activeCell < word.length? activeCell++ : activeCell = activeCell;   
//     }
//     else if (e.key === 'Backspace' && activeCell > 0){
//         //remove last cletter of guess
//         guess = guess.slice(0,-1);
        
//         //ui stuff
//         rows[activeRow].children[activeCell-1].innerText = "";
//         activeCell > 0 ? activeCell--: activeCell = 0;   
//     }
//     else if (e.key === 'Enter'){
//         if(guess.length != 5){
//             //vibrate and send message
//             rows[activeRow].classList.add('vibrate');
//             sendAlertMessage('Not enough letters')
//             return;
//         }
        
//         //check to see if guess is valid using query params
       
//         checkGuessValidity(guess).
//         then(isValid => {
//             if(!isValid){
//                 //little ui to have it vibrate
//                 rows[activeRow].classList.add('vibrate');
//                 sendAlertMessage('Invalid word');
//                 //add message to say not a valid word
//                 return;
//             }
//             processGuess(guess);
//             activeRow++;
//             activeCell = 0;
//             guess = "";
//         }).
//         catch(err => console.error(err));
//     }   
   
    
// });

// function sendAlertMessage(message){
//    let alertBox = document.createElement('div');
//    alertBox.classList.add('alert-box');
//    alertBox.innerHTML = ` <i class="fa-solid fa-circle-exclamation"></i>
//    <div class="alert-message">
//        <p>${message}</p>
//    </div>`;
//    document.body.appendChild(alertBox);
//    setTimeout(() => {
//     alertBox.remove();
//    },1200);

// }

// function endgameBox(result){
//     const endgameBox = document.createElement('div');
//     endgameBox.classList.add('endgame-box');

//     endgameBox.innerHTML = `<button id="exit-btn"><i class="fa-solid fa-x"></i></button>
//     <h2>${result}</h2>
//     <div id="word-display">
//         <p><strong>The word was: ${word}</strong></p>
//     </div>`
   
//     const newGameBtn = document.createElement('button');
//     newGameBtn.innerText = 'New Game';
//     newGameBtn.classList.add('new-game-btn');
//     newGameBtn.addEventListener('click', ()=>{
//         startGame();
//         newGameBtn.parentElement.remove();
//     });
//     endgameBox.appendChild(newGameBtn);

//     document.body.append(endgameBox);


// }


// function processGuess(guess){
//     guessesLeft--;
//     wordDict = createWordDict(word);
//     //this is all ui stuff
//     //first pass for the greens, result of the enter for under case
    
//     //added for the canal case, gotta think man
//     let greens = [];

//     let flipColorDict = {};
  
//     for(let i = 0; i < guess.length; i++){
//         if(guess[i] === word[i]){
//             //a green result
//             flipColorDict[i] = "green";
//             wordDict[guess[i]] -= 1;
//             greens.push(i);
//             letterToKeyElement[guess[i]].style = "background-color: green";
//         }   
//         else{
            
//             letterToKeyElement[guess[i]].style = "background-color: black";
            
            
//         }
        
//     }
//     //second pass at the yellows
//     for(let i = 0; i < guess.length; i++){
//         if(word.includes(guess[i]) && wordDict[guess[i]] > 0 && !greens.includes(i)){
//             flipColorDict[i] = "#D2C350";
//             wordDict[guess[i]] -= 1;
//             letterToKeyElement[guess[i]].style = "background-color: #D2C350";
//         }   
        
//     }

//     revealGuessOnRow(flipColorDict, activeRow);
    
   

//     //TODO: will have to check see if they got the word or ran out of guesses here too
//     if(guess === word){
//         endgameBox("You're a genius!")
//     }
//     else if(guessesLeft < 1){
//         endgameBox('Unlucky!')
//     }
    
// }

// function revealGuessOnRow(flipColorDict,row){
//     console.log(row);
//     for(let i =0; i < guess.length; i++){
//         //set each letter box to appropriate flip color;
//         rows[row].children[i].style.setProperty('--flip-color', flipColorDict[i]);
//         setTimeout(( )=>{
//             rows[row].children[i].classList.add('active');
//         },i*100);
//     }
// }



// async function getNewWord(){
//     let response = await fetch('http://localhost:3000/api/get-random-word');
//     let data = await response.json();
//     return data.word; 
// };

// async function checkGuessValidity(guess){
//     //using query param ?guess= + guess
//     let response = await fetch('http://localhost:3000/api/is-guess-valid?guess=' + guess);
//     let data = await response.json();
//     return data.isValid;
// }

// startGame();



