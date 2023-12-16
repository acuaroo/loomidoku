const express = require("express");
const dotenv = require('dotenv');
const cron = require("node-cron");

const { PrismaClient } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient();
dotenv.config();

const PORT = process.env.PORT;

const generatePuzzle = () => {
    return {
        name: "Dev Test Puzzle",
        row1: "BEGINNER",
        row2: "EVENT",
        row3: "SOULBURST",
        column1: "FIRE",
        column2: "PETROLITH",
        column3: "LIGHT",
    };
};

cron.schedule('*/1 * * * *', async () => {
    try {
        const newPuzzle = generatePuzzle();

        const createdPuzzle = await prisma.puzzle.create({
            data: newPuzzle,
        });

        console.log("new puzzle created:", createdPuzzle);
    } catch (error) {
        console.error("error creating puzzle:", error);
    }
});

// app.get("/api/puzzle/current", async (req, res) => {
//     try {
//         const latestPuzzle = await prisma.puzzle.findFirst({
//             orderBy: {
//                 createdAt: "desc",
//             },
//         });

//         res.json(latestPuzzle);
//     } catch (error) {
//         console.error("error fetching current puzzle:", error);
//         res.status(500).send("internal server error!");
//     }
// });