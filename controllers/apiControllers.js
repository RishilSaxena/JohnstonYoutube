const axios = require("axios");
// const { spawn } = require("child_process");
// const { readFile } = require("fs/promises");
// const { appendFile } = require("fs/promises");
// const { join } = require("path");
const dotenv = require("dotenv")
dotenv.config();
const API_KEY = process.env.API_KEY;
const GPT_KEY = process.env.GPT_KEY;
const bodyParser = require('body-parser')

module.exports = {
  getData: function (req, res) {
    // console.log(req.params["id"])
    axios
      .get(
        `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${req.params["id"]}&key=${API_KEY}`
      )
      .then(function (data) {
        res.json(data.data.items[0]);
      });
  },
  generateTags: async function (req, res) {
    let returnData = [];
    console.log('working')
    const spawn = require("child_process").spawn;
    const pythonProcess = spawn("python", ["py_scripts.py", "generate_tags", req.params["id"], API_KEY])
    console.log("connecting to python...")
    pythonProcess.stdout.on('data', (data) => {
        console.log(data.toString());
        res.json(JSON.parse(data.toString()))
    });
  },
  defaultGenerateTitles: async function (req, res) {
    let returnData = [];
    console.log('working')
    const spawn = require("child_process").spawn;
    const pythonProcess = spawn("python", ["py_scripts.py", "default_generate_titles", req.params["id"], API_KEY, GPT_KEY])
    console.log("connecting to python...")
    pythonProcess.stdout.on('data', (data) => {
        console.log(data.toString());
        res.json(JSON.parse(data.toString()))
    });
  },
  generateTitlesTranscript: async function (req, res) {
    let returnData = [];
    console.log('working')
    const spawn = require("child_process").spawn;
    const pythonProcess = spawn("python", ["py_scripts.py", "generate_title_transcript", req.params["id"], GPT_KEY])
    console.log("connecting to python...")
    pythonProcess.stdout.on('data', (data) => {
        console.log(data.toString());
        res.json(JSON.parse(data.toString()))
    });
  },
  generateTitlesQueries: async function (req, res) {
    let returnData = [];
    console.log('working')
    const spawn = require("child_process").spawn;
    const pythonProcess = spawn("python", ["py_scripts.py", "gen_titles_queries", API_KEY, GPT_KEY, req.params["query1"], req.params["query2"], req.params["query3"]])
    console.log("connecting to python...")
    pythonProcess.stdout.on('data', (data) => {
        console.log(data.toString());
        res.json(JSON.parse(data.toString()))
    });
  },
  generateTitlesNumbers: async function (req, res) {
    let returnData = [];
    console.log('working')
    const spawn = require("child_process").spawn;
    const pythonProcess = spawn("python", ["py_scripts.py", "gen_titles_numbers", req.params["id"], API_KEY, GPT_KEY,])
    console.log("connecting to python...")
    pythonProcess.stdout.on('data', (data) => {
        console.log(data.toString());
        res.json(JSON.parse(data.toString()))
    });
  },
};

// await appendFile("./args.json", JSON.stringify(req.params["id"]), {
//     encoding: "utf-8",
//     flag: "w",
//   });
//   console.log("appended")
//   const pythonProcess = await spawnSync("python3", [
//     "/py_scripts.py",
//     "generate_tags",
//     "/args.json",
//     "/results.json",
//   ]);
//   const result = pythonProcess.stdout?.toString()?.trim();
//   console.log(result);
//   const error = pythonProcess.stderr?.toString()?.trim();
//   console.log(error);
//   const status = result === "OK";
//   if (status) {
//     const buffer = await readFile("/results.json");
//     const resultParsed = JSON.parse(buffer?.toString());
//     res.send(resultParsed.toString());
//   } else {
//     console.log(error);
//     res.send(JSON.stringify({ status: 500, message: "Server error" }));
//   }