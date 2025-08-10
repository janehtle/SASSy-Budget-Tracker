/* ideas: use let? use .map? event listener for sure. 
income and expenses in their own arrays (seems too much, keep it simple) - make them as objects and put them in an array. map of arrays?? 
prevent default (look into that), seen people assign an ID to objs..
js version of accumulators in python (work same way?), get list to appear on DOM - innerHTML.
round to whole integers, dont wanna deal with floating decimals 
make class budget for existing income/expenses or free will? (not sure what that looks like, rethink?) */

const remainder = document.getElementById("remainder");
const positive = document.getElementById("positive");
const negative = document.getElementById("negative");
const list = document.getElementById("list");
const form = document.querySelector("form");
const text = document.getElementById("text");
const amount = document.getElementById("amount");


let transactions = []; //will hold an array of objects (memo and amount)

function id() { //generate a random numerical ID for each object to reference
    return Math.floor(Math.random() * 1000); 
    //saw some examples use 8 digits, going for 4 digits to give uniqueness/range for MONTHLY expenses
}

//func that will accept user entries and display under log
function trackInput(event) {
    event.preventDefault(); //prevents page from refreshing each time submit btn clicked and losing each entry
    
    const transaction = { //transaction object
        id: id(),
        text: text.value,
        amount: Number(amount.value) //default value is a str, turn str to a num
    };
    
    transactions.push(transaction); //push object to transactions array
    
    if (text.value.trim() === "" || amount.value.trim() === "") {
    //if memo OR amount (income/expense) inputs are an empty string, return the alert
        alert("Please input valid entries."); //easier as an alert
    }

    //auto clears input fields
    text.value = "";
    amount.value = "";

    calculate(); //calculate income/expenses

    addToDOM(transaction); //displays input aka transaction to browser
}

form.addEventListener("submit", trackInput); //for submit btn

function calculate() {
    const amounts = transactions.map(function(transaction) {
        return transaction.amount;
    }); //assign all inputted amounts to single variable
    
    const total = amounts.reduce(function(acc, val) { //inspired by accumulator in python
        return acc + val;
    }, 0);
    //assign sum of calculated amounts to single variable
    
    //calc income, multiline for chaining methods
    const income = amounts
        .filter((val) => val > 0) //filters positive values
        .reduce((acc, val) => acc + val, 0) //adds only the positive values filtered
        .toFixed(2);

    //calc expense
    const expense = (
        amounts
            .filter((val) => val < 0) //filters neg values
            .reduce((acc, val) => acc + val, 0) * -1 //adds only the neg values filtered
    ).toFixed(2); //need to be outside parentheses otherwise expense will display -$0 instead of -$0.00 in browser
    
    //still trying to understand innerText v innerHTML, did both to see if it works same way (still dont notice any diffs??)
    remainder.innerText = `$${total}`; 
    positive.innerHTML = `+$${income}`;
    negative.innerHTML = `-$${expense}`;
}

function addToDOM(transaction) {
    const sign = transaction.amount < 0 ? "-" : "+"; //ternary operator
    //if amount < 0, display minus sign (expense), otherwise plus sign (income)

    //creates list and displays input to the browser
    const item = document.createElement("li"); 
    item.classList.add(transaction.amount < 0 ? "minus" : "plus");

    item.innerHTML = `${transaction.text} <span>${sign}$${Math.abs(transaction.amount).toFixed(2)}</span> <button class="delete" onclick="remove(${transaction.id})">X</button>`;
    //Example Output: R2H +$525 X

    list.appendChild(item); //will add item to the list after each submit
}

//func that deletes the input from the log by object ID
function remove(id) {
    transactions = transactions.filter((transaction) => transaction.id !== id); //output new array without the id deleted/selected
    refresh(); 
}

function refresh() { //func that auto refreshes the page to reflect updates/changes
    list.innerHTML = "";
    transactions.forEach(addToDOM); //iterate through each element/obj in array and display to browser
    calculate();
}