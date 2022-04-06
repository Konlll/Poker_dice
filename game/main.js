// Score Class

class Scores {
    scores;

    constructor() {
        this.scores = new Map([["trash", 0], ["two_in_row", 0], ["three_in_row", 0], ["two_pairs", 0], ["four_in_row", 0], ["full", 0], ["sm_straight", 0], ["lg_straight", 0], ["yahtzee", 0]]);
    }

    get_field(field_name) {
        return this.scores.get(field_name);
    }

    add_score(field_name, score) {
        this.scores.set(field_name, this.scores.get(field_name) + score);
    }
}

// Point Calculator Class

class PointCalculator {
    constructor(throws) {
        this.throws = throws;
    }

    calculate_sm_straight() {
        return 15;
    }

    calculate_lg_straight() {
        return 20;
    }

    calculate_yahtzee() {
        return 50;
    }

    calculate_trash() {
        return sum_arr(this.throws);
    }

    calculate_two_in_row() {
        let sum = 0;
        for (let i = 0; i < this.throws.length; i++) {
            if (this.throws[i] === this.throws[i + 1]) {
                sum = this.throws[i] + this.throws[i + 1];
            }
        }
        return sum;
    }

    calculate_three_in_row() {
        for (let i = 0; i < this.throws.length - 1; i++) {
            if (this.throws[i] === this.throws[i + 1] && this.throws[i + 1] === this.throws[i + 2]) {
                return this.throws[i] + this.throws[i + 1] + this.throws[i + 2];
            }
        }
        return 0;
    }

    calculate_four_in_row() {
        for (let i = 0; i < this.throws.length; i++) {
            if (this.throws[i] === this.throws[i + 1]) {
                this.throws.splice(i - 1, 1)
                return sum_arr(this.throws)
            }
        }
    }

    calculate_two_pairs() {
        let arr = []
        for (let i = 0; i < this.throws.length; i++) {
            if (this.throws[i] === this.throws[i + 1]) {
                arr.push(this.throws[i]);
                arr.push(this.throws[i + 1]);
            }
            if (arr.length === 4) {
                break
            }
        }
        return sum_arr(arr);
    }

    calculate_full() {
        return sum_arr(this.throws);
    }
}

// Summarize an array

function sum_arr(arr) {
    let sum = 0;
    for (let i = 0; i < arr.length; i++) {
        sum += arr[i];
    }
    return sum
}

// Check throw values for each combinations

function check_throw_values(throws) {
    let noDuplicates = Array.from(new Set(throws));
    throws = throws.sort();

    let len = 0;
    let duplicates = [];

    let scores = new Scores();
    let pc = new PointCalculator(throws);

    for (let i = 0; i < throws.length; i++) {
        if (throws[i] === throws[i + 1]) {
            len++;
        } else if (len !== 0) {
            duplicates.push(len);
            len = 0;
        }
    }

    if (noDuplicates.length === 5) {
        if (noDuplicates[0] === 1) {
            scores.add_score('sm_straight', pc.calculate_sm_straight());
        } if (noDuplicates[0] === 2) {
            scores.add_score('lg_straight', pc.calculate_lg_straight());
        }
    } if (noDuplicates.length === 2) {
        if (duplicates.length === 2) {
            scores.add_score('two_in_row', pc.calculate_two_in_row());
            scores.add_score("three_in_row", pc.calculate_three_in_row())
            scores.add_score("two_pairs", pc.calculate_two_pairs())
            scores.add_score('full', pc.calculate_full());
        } else {
            scores.add_score('four_in_row', pc.calculate_four_in_row());
        }
    }
    if (noDuplicates.length === 4) {
        scores.add_score('two_in_row', pc.calculate_two_in_row());
    }
    if (noDuplicates.length === 3) {
        if (duplicates.length === 2) {
            scores.add_score("two_in_row", pc.calculate_two_in_row())
            scores.add_score("two_pairs", pc.calculate_two_pairs())
        } else {
            scores.add_score("three_in_row", pc.calculate_three_in_row())
        }
    }
    if (noDuplicates.length === 1) {
        scores.add_score("two_in_row", pc.calculate_two_in_row())
        scores.add_score("three_in_row", pc.calculate_three_in_row())
        scores.add_score("four_in_row", pc.calculate_four_in_row())
        scores.add_score("yahtzee", pc.calculate_yahtzee())
    }
    scores.add_score("trash", pc.calculate_trash())
    return scores;
}

// Get random numbers by throwing

function getThrows() {
    let throws = new Array(5);
    for (let i = 0; i < 5; i++) {
        throws[i] = Math.floor(Math.random() * 6) + 1;
    }
    return throws;
}

// Get player fields

function getItems(selector){
    const itemsDiv = document.querySelector(selector)
    const playerItems = Object.values(itemsDiv.childNodes).filter(item => {
        if (item.nodeName != "#text") return item
    })
    return playerItems
}

// Load stored data if exists

function checkStoredValues(){
    let playerSummary = localStorage.getItem("playerSummary")
    let playerScores = JSON.parse(localStorage.getItem("playerScores"))
    if(playerSummary && playerScores){
        const playerScore = document.querySelector("#playerScore")
        const playerItems = getItems(".player-items")
        playerScore.innerHTML = playerSummary
        playerItems.forEach((item, index) => {
            if(playerScores[index] != undefined){
                const span = document.createElement("span")
                span.innerHTML = playerScores[index]
                span.classList.add("chosen")
                item.appendChild(span)
            }
        })

    }
}

// Place into InnerHTML the thrown values on clicking
document.getElementById('generate').addEventListener('click', (e) => {
    const throws = getThrows()
    const randomNumbersDiv = document.querySelector(".random-numbers")
    randomNumbersDiv.innerHTML = ""
    for (let i = 0; i < throws.length; i++) {
        const span = document.createElement("span")
        span.innerHTML = throws[i]
        randomNumbersDiv.appendChild(span)
    }
    e.target.style.display = "none"

    addCalculatedItems(throws)
})

// When the generate button is clicked upon, we will call the getThrows() function and add the combinations to our items

function addCalculatedItems(numbers) {
    const playerItems = getItems(".player-items")
    const calculatedValues = check_throw_values(numbers).scores
    const arrayValues = []
    calculatedValues.forEach((value, key) => {
        arrayValues.push(value)
    })

    playerItems.forEach((item, index) => {
        if (item.childNodes.length == 0) {
            const span = document.createElement("span")
            span.innerHTML = arrayValues[index]
            item.appendChild(span)
            span.addEventListener("click", () => addChosenValue(playerItems, span, arrayValues[index]))
        }
    })
}

// When the user selects a combination we will summarize that and save as well

function addChosenValue(itemsDiv, element, value) {
    const score = document.getElementById("playerScore")
    let scoreValue = parseInt(score.innerHTML)
    scoreValue += value
    score.innerHTML = scoreValue
    element.classList.add("chosen")
    let playerScores = []
    itemsDiv.forEach(item => {
        Object.values(item.childNodes).forEach(span => {
            if (span.classList.contains("chosen") == false) {
                span.parentNode.removeChild(span)
                playerScores.push(undefined)
            } else{
                playerScores.push(span.innerHTML)
            }
        })
    })
    localStorage.setItem('playerScores', JSON.stringify(playerScores))
    localStorage.setItem("playerSummary", score.innerHTML)
    // Next row should be deleted in the future
    document.querySelector("#generate").style.display = "block"
    ai_move();
}



function ai_move() {
    let throw_score = check_throw_values(getThrows());

    const playerItems = getItems(".ai-items");
    const calculatedValues = throw_score.scores;
    const arrayValues = [];
    calculatedValues.forEach((value, key) => {
        arrayValues.push(value)
    })

    let scores = [];

    let addedValue = false;

    let maxIndex = arrayValues.indexOf(Math.max(...arrayValues))

    playerItems.forEach((item, index) => {
        if (item.childNodes.length != 0) {
            arrayValues.splice(index, 1, 0);
            let maxIndex = arrayValues.indexOf(Math.max(...arrayValues))
            scores.push(item.childNodes[index])

        } else if(maxIndex == index) {
            const span = document.createElement("span")
            span.innerHTML = arrayValues[index]
            span.classList.add("chosen");
            item.appendChild(span)
            let icr = 0;
            aiScore.scores.forEach((value, key) => {
                if (index == icr) {
                    aiScore.add_score(key, arrayValues[index]);
                }
                icr++;
            })
            addedValue = true;
        }
    })

    if (addedValue == false) {
        playerItems.forEach((item, index) => {
            if (item.childNodes.length == 0 && !addedValue) {
                const span = document.createElement("span")
                span.innerHTML = arrayValues[index]
                span.classList.add("chosen");
                item.appendChild(span);
                let icr = 0;
                aiScore.scores.forEach((value, key) => {
                    icr++;
                    if (index == icr) {
                        aiScore.add_score(key, arrayValues[index]);
                    }
                })
                addedValue = true;
            }

        })
    }

    // localStorage.setItem('aiScores', JSON.stringify(scores))
    // localStorage.setItem("aiSummary", document.getElementById('aiScore').innerHTML)

}


function clearData() {
    localStorage.clear();
    location.reload();
}

let aiScore = new Scores();

// When page loaded we always should check whether there is stored data or not
checkStoredValues()