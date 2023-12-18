const loomians = require("../ldata/loomians.json");
const minLoomians = require("../ldata/min.json");

const uniqueCategories = loomians[1];

const MAX_ITTERATIONS = 1000;
const MIN_LOOMIANS_PER_CATEGORY = 2;

const checkGeneration = (columnCategory, category) => {
    const matchingLoomians = minLoomians.filter((loomian) => {
        return loomian.includes(columnCategory) && loomian.includes(category);
    });

    return matchingLoomians;
}

const generatePuzzle = (tries) => {
    let columns = [];
    let rows = [];
    let itterations = 0;

    if (tries > 3) {
        console.warn("!!! CRITICAL ERROR: function exausted after 3 tries!");
        console.warn("!!! DEFAULTING TO SET PUZZLE!");

        return {
            name: "Puzzle",
            row1: "DUALTYPE",
            row2: "BRANCHEDEVOLUTIONS",
            row3: "AIR",
            column1: "ICE",
            column2: "PLANT",
            column3: "MIDDLEEVOLUTION",
        };;
    }

    while (columns.length < 3) {
        let category = uniqueCategories[Math.floor(Math.random() * uniqueCategories.length)];

        if (!columns.includes(category)) {
            columns.push(category);
        }
    }

    while (rows.length < 3) {
        let validRow = false;
        let overuseCap = 0;
        let category;

        let uniqueCategoriesCopy = [...uniqueCategories];

        do {
            category = uniqueCategoriesCopy[Math.floor(Math.random() * uniqueCategories.length)];
            columnCategory = columns[0];

            if (columns.includes(category) || rows.includes(category)) {
                continue;
            }
            
            if (category !== undefined && (
                category.indexOf("MONOTYPE") === -1 ||
                category.indexOf("DUALTYPE") === -1 ||
                category.indexOf("EVOLUTION") === -1)) {
                
                overuseCap += 1;

                if (overuseCap >= 2) {
                    overuseCap = 0
                    continue;
                }
            }

            let answerKey = [];

            for (let i = 0; i < 3; i++) {
                let matchingLoomians = checkGeneration(columnCategory, category)

                if (matchingLoomians.length >= MIN_LOOMIANS_PER_CATEGORY) {
                    answerKey.push(matchingLoomians);
                    columnCategory = columns[i + 1];
                } else {
                    itterations++;
                    break;
                }
            }

            if (answerKey.length >= 3) {
                validRow = true;
            } else {
                uniqueCategoriesCopy = uniqueCategoriesCopy.filter((cat) => {
                    return cat !== category;
                });

                validRow = false;
            }
        } while (!validRow && itterations <= MAX_ITTERATIONS);
        
        if (itterations >= MAX_ITTERATIONS) {
            console.log(`function exausted after ${itterations} itterations!`)
            console.log(`columns: ${columns}`)

            return generatePuzzle(tries + 1);
        }

        rows.push(category);
    }

    return {
        row1: rows[0],
        row2: rows[1],
        row3: rows[2],
        column1: columns[0],
        column2: columns[1],
        column3: columns[2],
    };
};

module.exports = generatePuzzle;