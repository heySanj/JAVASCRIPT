let todoList = [];

while(true){
    let command = prompt("What would you like to do?");

    if (command.toLowerCase() === "new"){
        let newTodo = prompt("What would you like to do?")
        todoList.push(newTodo)
        console.log(`${newTodo} added to the list.`)
    }
    else if (command.toLowerCase() === "list"){
        console.log("****************************")
        for (let i = 0; i < todoList.length; i++){
            console.log(`${i}: ${todoList[i]}`)
        }
        console.log("****************************")
    }
    else if (command.toLowerCase() === "delete"){
        let index = parseInt(prompt("What item number would you like to remove?"))
        todoList.splice(index, 1) // Remove just 1 element at index
        console.log("Todo has been removed from the list.")
    }
    else if (command.toLowerCase() === "quit"){
        console.log("Goodbye.")
        break;
    } else{
        console.log("Sorry, don't know how to do that. 😥")
    }
}