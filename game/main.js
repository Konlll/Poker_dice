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

    convertArrToScores(arr) {
        if (arr.length != 9) {
            throw new Error("The array length is larger than the length of the max possible score fields.")
        }
        let incr = 0;
        this.scores.forEach((val, index) => {
            this.scores.set(index, arr[incr]);
            incr++;
        })
    }

    getAsArr() {
        let arr = [];
        this.scores.forEach((value, index) => {
            arr.push(value);
        })
        return arr;
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

let aiScore = [new Scores(), [false, false, false, false, false, false, false, false, false]]

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

function checkStoredValues(scoresStorage, summaryStorage, scoresStorageId, summaryStorageId){
    let summary = localStorage.getItem(summaryStorage)
    let scores = JSON.parse(localStorage.getItem(scoresStorage))
    if(summary && scores){
        const playerScore = document.querySelector(scoresStorageId)
        const playerItems = getItems(summaryStorageId)
        playerScore.innerHTML = summary
        playerItems.forEach((item, index) => {
            if(scores[index] != undefined){
                const span = document.createElement("span")
                span.innerHTML = scores[index]
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
    const throws = getThrows()
    let throw_score = check_throw_values(throws).getAsArr();
    let curr_score = aiScore[0].getAsArr();

    let maxIndex = 0;

    let addedScore = false;

    let randomNumbers = document.querySelector(".random-numbers")
    while(randomNumbers.firstChild){
        randomNumbers.removeChild(randomNumbers.lastChild)
    }

    throws.forEach((value, index) => {
        const span = document.createElement("span")
        span.innerHTML = throws[index]
        randomNumbers.appendChild(span)
    })
    
    setTimeout(() => {
        throw_score.forEach((val, index) => {
            if (curr_score[index] != 0) {
                throw_score.splice(index, 1, 0);
                maxIndex == throw_score.indexOf(Math.max(...curr_score));
            } else if (!addedScore && throw_score[index] != 0 && !aiScore[1][index]) {
                curr_score[index] = throw_score[index];
                aiScore[1][index] = true;
                addedScore = true;
            }
        })
    
        aiScore[0].convertArrToScores(curr_score);
    
        let scoreVal = 0;
        
        for (let i = 0; i < curr_score.length; i++) {
            scoreVal += curr_score[i];
        }
    
        document.getElementById('aiScore').innerHTML = scoreVal;
    
        const aiItems = getItems(".ai-items");
    
        aiItems.forEach((item, index) => {
            if (aiScore[1][index] == true && item.childNodes.length == 0) {
                const span = document.createElement("span");
                span.innerHTML = throw_score[index];
                span.classList.add("chosen");
                item.appendChild(span)
                addAiScores(throw_score[index], scoreVal)
            } else if (item.childNodes.length == 0 && !addedScore) {
                const span = document.createElement("span");
                span.innerHTML = 0;
                addedScore = true;
                aiScore[1][index] = true;
                span.classList.add("chosen");
                item.appendChild(span)
                addAiScores(0, scoreVal)
            }
            
        })
    }, 3000)
}

function getWinner(playerScore, aiScore) {
    if (aiScore > playerScore) {
        alert("A gép nyert ellened!")
    } else if (aiScore == playerScore) {
        alert("Az eredmény döntetlen!")
    } else {
        alert("Nyertél! Gratulálunk!")
    }
}

function addAiScores(score, summary){
    let storageAiScores = JSON.parse(localStorage.getItem('aiScores'));
    if (storageAiScores == null) storageAiScores = [];
    storageAiScores.push(score);
    if (!aiScore[1].includes(false)) {
        getWinner(Number.parseInt(JSON.parse(localStorage.getItem('playerScores'))), Number.parseInt(JSON.parse(localStorage.getItem('aiScores'))))
    };
    localStorage.setItem("aiScores", JSON.stringify(storageAiScores));
    localStorage.setItem("aiSummary", summary);
}

function downloadPlayerData() {
    let array = [];
    array.push(localStorage.getItem("playerScores"),"\n", localStorage.getItem("playerSummary"),"\n", localStorage.getItem("aiScores"),"\n", localStorage.getItem("aiSummary"))
    const file = new File(array, `gameSave ${new Date().toLocaleString()}.txt`, {
        type: 'text/plain',
    });

    const link = document.createElement('a');
    const url = URL.createObjectURL(file);

    link.href = url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
}

function clearData() {
    localStorage.clear();
    location.reload();
}

// When page loaded we always should check whether there is stored data or not
checkStoredValues("playerScores", "playerSummary", "#playerScore", ".player-items")
checkStoredValues("aiScores", "aiSummary", "#aiScore", ".ai-items")