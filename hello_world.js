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

getColor('slow');