const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs").promises;
const path = require("path");

const filePath = path.join(__dirname, "../ldata/loomians.json");
const url = "https://loomian-legacy.fandom.com/wiki/Loomian";

const fetchData = async () => {
    try {
        const response = await axios.get(url);
    return cheerio.load(response.data);
    } catch (error) {
        throw new Error(`err fetching data: ${error.message}`);
    }
};

const processTableRow = ($, row) => {
    const [idCell, imageCell, typeCell] = $(row).find("td").toArray();

    const loomian = {
        id: $(idCell).text().trim(),
        name: $(imageCell).find("img").attr("alt") || "",
        image: $(imageCell).find("img").attr("data-src") || $(imageCell).find("img").attr("src") || "",
        type: $(typeCell).find("a span").text().replace(/\n/g, "") || "",
    };

    loomian.name = loomian.name.replace(/-menu$/, '');
    loomian.type = loomian.type.replace(/([a-z])([A-Z])/g, '$1:$2');

    return loomian;
};

const processTable = ($) => {
    const loomians = $(".wikitable tbody tr").map((_, row) => processTableRow($, row)).get();
    return loomians.filter(({ id, name, image, type }) => id && name && image && type);
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
        const loomians = processTable($);
        await saveToFile(loomians);
    } catch (error) {
        console.error(error.message);
    }
};

main();
