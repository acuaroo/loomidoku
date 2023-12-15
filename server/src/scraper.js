const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs").promises;
const path = require("path");
const cliProgress = require('cli-progress');

const filePath = path.join(__dirname, "../ldata/loomians.json");
const url = "https://loomian-legacy.fandom.com/wiki/Loomian";

const banPhrases = [
    "Loomians",
    "Typeless Loomians",
    "Pages with broken file links",
    "Work in Progress",
    "Loomians with Variants",
    "Trainer Mastery",
    "Loomians with Rainbow Forms",
    "Set Encounter Loomians",
    "Radiant Loomians"
]

let uniqueCategories = [];

const fetchData = async () => {
    try {
        const response = await axios.get(url);
        return cheerio.load(response.data);
    } catch (error) {
        throw new Error(`err fetching data: ${error.message}`);
    }
};

const processTableRow = async ($, row, progressBar) => {
    const [idCell, imageCell, typeCell] = $(row).find("td").toArray();

    const loomian = {
        id: $(idCell).text().trim(),
        name: $(imageCell).find("img").attr("alt") || "",
        image: $(imageCell).find("img").attr("data-src") || $(imageCell).find("img").attr("src") || "",
        type: $(typeCell).find("a span").text().replace(/\n/g, "") || "",
        categories: [],
    };

    loomian.name = loomian.name.replace(/-menu$/, '');
    loomian.type = loomian.type.replace(/([a-z])([A-Z])/g, '$1:$2');

    loomian.categories = await processLoomianPage(
        `https://loomian-legacy.fandom.com/wiki/${loomian.name}`
    );

    progressBar.increment();
    
    return loomian;
};

const processTable = async ($, progressBar) => {
    const loomians = await Promise.all(
        $(".wikitable tbody tr").map(async (_, row) => await processTableRow($, row, progressBar)).get()
    );
    return loomians.filter(({ id, name, image, type }) => id && name && image && type);
};

const processLoomianPage = async (loomianPageUrl) => {
    try {
        const response = await axios.get(loomianPageUrl);
        const $ = cheerio.load(response.data);

        const categoryLinks = $("div.page-header__categories a[title^='Category:']").map((_, elem) => $(elem).text()).get();
        let categories = categoryLinks
            .map(link => link.replace("Category:", ""))
            .filter(category => !banPhrases.includes(category) && !category.includes("-type"))
            .map(category => category.replace("Loomians", ""))
            .map(category => category.replace(/ /g, "")
            .replace("with", ""));

        categories.forEach(category => {
            if (!uniqueCategories.includes(category)) {
                uniqueCategories.push(category);
            }
        });
        
        return categories;
    } catch (error) {
        console.error(`Error processing Loomian page ${loomianPageUrl}: ${error.message}`);
        return [];
    }
};

const saveToFile = async (data) => {
    try {
        await fs.writeFile(filePath, JSON.stringify(data));
        console.log("loomians saved to ldata/loomians.json!");
    } catch (error) {
        throw new Error(`err saving to file: ${error.message}`);
    }
};

const main = async () => {
    try {
        const $ = await fetchData();
        const totalRows = $(".wikitable tbody tr").length;

        const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
        progressBar.start(totalRows, 0);

        const loomians = await processTable($, progressBar);

        progressBar.stop();

        console.log(uniqueCategories);

        await saveToFile(loomians);
    } catch (error) {
        console.error(error.message);
    }
};

console.log("starting scraper...")
main();
