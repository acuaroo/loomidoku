const express = require("express");
const dotenv = require('dotenv');
const cron = require("node-cron");

const generatePuzzle = require("./generatePuzzle");

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
dotenv.config();

console.log(generatePuzzle(0));

// cron.schedule('*/1 * * * *', async () => {
//     try {
//         const newPuzzle = generatePuzzle(0);

//         const latestPuzzleId = await prisma.puzzle.findFirst({
//             orderBy: {
//                 createdAt: "desc",
//             },
//         }).id || 0;

//         var str = "" + latestPuzzleId + 1
//         var pad = "000"

//         var final = pad.substring(0, pad.length - str.length) + str

//         newPuzzle.name = "Puzzle #" + final;

//         const createdPuzzle = await prisma.puzzle.create({
//             data: newPuzzle,
//         });

//         console.log("new puzzle created:", createdPuzzle);
//     } catch (error) {
//         console.error("error creating puzzle:", error);
//     }
// });

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