const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs").promises;
const path = require("path");
const cliProgress = require('cli-progress');

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
    "Radiant Loomians",
    "Event Loomians",
    "Beginner Loomians"
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
        categories: [],
    };

    loomian.name = loomian.name.replace(/-menu$/, '');

    loomian.categories = await processLoomianPage(
        `https://loomian-legacy.fandom.com/wiki/${loomian.name}`,
        $(typeCell).find("a span").text().replace(/\n/g, "") || ""
    );

    // let type = $(typeCell).find("a span").text().replace(/\n/g, "") || "";

    // type = type.replace(/([a-z])([A-Z])/g, '$1 $2').split(" ");
    // type = type.filter(Boolean);

    // loomian.categories.push(
    //     ...type.map((type) => type.toUpperCase())
    // )

    progressBar.increment();
    
    return loomian;
};

const processTable = async ($, progressBar) => {
    const loomians = await Promise.all(
        $(".wikitable tbody tr").map(async (_, row) => await processTableRow($, row, progressBar)).get()
    );
    return loomians.filter(({ id, name, image }) => id && name && image);
};

const processLoomianPage = async (loomianPageUrl, type) => {
    try {
        const response = await axios.get(loomianPageUrl);
        const $ = cheerio.load(response.data);

        const categoryLinks = $("div.page-header__categories a[title^='Category:']").map((_, elem) => $(elem).text()).get();
        let categories = categoryLinks
            .map(link => link.replace("Category:", ""))
            .filter(category => !banPhrases.includes(category) && !category.includes("-type"))
            .map(category => category.replace("Loomians", ""))
            .map(category => category.replace(/ /g, "")
            .replace("with", ""))
            .map(category => category.toUpperCase());
        
        type = type.replace(/([a-z])([A-Z])/g, '$1 $2').split(" ");
        type = type.filter(Boolean);
        type = type.map((type) => type.toUpperCase());

        if (type.length > 1) {
            categories.push("DUALTYPE");
        } else {
            categories.push("MONOTYPE");
        }

        categories.push(
            ...type
        )

        if ($("div[data-source='Base']").text().includes("This Loomian does not evolve.")) {
            categories.push("NOEVOLUTIONLINE");
        } else {
            const evolutionHeader = $("h2:contains('Evolution')");

            const evolutionSection = evolutionHeader.parent();
            const evolutionChildren = evolutionSection.children();

            const loomianName = $("h1.page-header__title").text().replace(/\n/g, "").trim();

            for (let i = 0; i < evolutionChildren.length; i++) {
                const textElement = $(evolutionChildren[i]);
                const text = textElement.text().replace(/\n/g, "").trim();
                const strong = textElement.find("strong.mw-selflink.selflink");
                
                if (strong.length > 0 && strong.text().includes(loomianName)) {
                    switch (i) {
                        case 1:
                            categories.push("FIRSTINEVOLUTIONLINE");
                            break;
                        case 3:
                            categories.push("FIRSTEVOLUTION");
                            break;
                        case 5:
                            categories.push("SECONDEVOLUTION");
                            break;
                        default:
                            break;
                    }
                }
            }
        }

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

const saveToFile = async (data, name) => {
    const filePath = path.join(__dirname, `../ldata/${name}`);

    try {
        await fs.writeFile(filePath, JSON.stringify(data));
        console.log(`loomians saved to ldata/${name}!`);
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

        await saveToFile([loomians, uniqueCategories], "loomians.json");
        await saveToFile(
            loomians.map(({ id, categories }) => ([id, ...categories ])),
            "min.json"
        );

        await saveToFile(
            loomians.reduce((acc, { id, name }) => ({ ...acc, [id]: name }), {}),
            "lookup.json"
        );

    } catch (error) {
        console.error(error.message);
    }
};

main();
