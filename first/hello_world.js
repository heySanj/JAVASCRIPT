console.log("Hello World!");

let age = 3;

if (age < 18){
    console.warn("Uh oh! You're underage. 😥");
} else {
    console.log("Welcome to the club! 😎");
}

function getColor(phrase){
   if(phrase === 'stop'){
       console.log('red')
   }else if(phrase === 'slow'){
       console.log('yellow')
   }else if(phrase === 'go'){
       console.log('green')
   }else{
       console.log('purple')
   }
}

// getColor('slow');

//------------------ HIGHER / LOWER GUESSING GAME ----------------

let maxNum = prompt("Enter a number to guess between");
let targetNum = Math.floor(Math.random() * maxNum) + 1;
let guess = prompt(`Guess the number between 1 and ${maxNum}`);
let guesses = 1;

while (true){
    if(guess == targetNum){
        console.log(`Congrats! You got it in ${guesses} guesses.`);
        break;
    } else if(guess == 'q'){
        console.log("You quit...");
        break;
    } else if(guess > targetNum){
        guess = prompt(`Too High! Guess again.`);
    } else if(guess < targetNum){
        guess = prompt(`Too Low! Guess again.`);
    } else {
        guess = prompt(`Guess the number between 1 and ${maxNum}`);
    }
    guesses++
}