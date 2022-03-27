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
            if (this.throws[i] === this.throws[i+1]) {
                this.throws.splice(i-1, 1)
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

function sum_arr(arr) {
    let sum = 0;
    for (let i = 0; i < arr.length; i++) {
        sum += arr[i];
    }
    return sum
}

function check_throw_values(throws) {
    let noDuplicates = Array.from(new Set(throws));
    throws = throws.sort();

    let len = 0;
    let duplicates = [];

    let scores = new Scores();
    let pc = new PointCalculator(throws);

    for (let i = 0; i < throws.length; i++) {
        if (throws[i] === throws[i+1]) {
            len++;
        } else if (len !== 0) {
                duplicates.push(len);
                len = 0;
        }
    }

    if (noDuplicates.length === 5) {
        if (noDuplicates[0] === 1) {
            scores.add_score('sm_straight', pc.calculate_sm_straight());
        }if (noDuplicates[0] === 2) {
            scores.add_score('lg_straight', pc.calculate_lg_straight());
        }
    }if (noDuplicates.length === 2) {
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

function get_throw() {
    let throws = new Array(5);
    for (let i = 0; i < 5; i++) {
        throws[i] = Math.floor(Math.random() * 6) + 1;
    }
     return throws;
}