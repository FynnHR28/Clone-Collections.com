import express, {response} from 'express';
import { request } from 'http';
import cors from 'cors';
import fs from 'fs';



//read the word files and turn them into lists
function readFileAsLines (filePath) {
    try{
        const data = fs.readFileSync(filePath, 'utf-8');
        const lines = data.split('\n');
        return lines;
    }
    catch(error){
        console.log('error reading file: ', error);
        return [];
    }
}

// ../ because resources is in the parent directory so we must move up a branch to access it
const validWords = readFileAsLines('../Resources/validWordleWords.txt');
const targetWordOptions = readFileAsLines('../Resources/chosenWords.txt');



//server app setup
const app = express();
app.use(express.json());
//middleware enabling cross origin referencing (my live frontend server can make requests to this one)
app.use(cors());
const PORT = process.env.PORT || 3000;


//request handlers

app.get('/api/get-random-word', (request, response) => {
    const wordIndex = Math.floor(Math.random() * targetWordOptions.length);
    return response.status(200).send({word: targetWordOptions[wordIndex]}); 
});

app.get('/api/is-guess-valid', (request,response) => {
    const {
        query : {guess},
    } = request;
    if(!guess) return response.sendStatus(400);

    if(validWords.includes(guess)) return response.status(200).send({isValid: true});
    else return response.status(200).send({isValid: false});
});




//call back function used to confirm that server has started on port
app.listen(PORT, () => {
    console.log(`Running on ${PORT}`);
});









