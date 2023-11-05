const apiControllers = require("../controllers/apiControllers");

module.exports = function(app){
    app.get("/api/getData/:id", function(req, res){
        apiControllers.getData(req, res);
    })
    app.get("/api/generateTags/:id", async function(req, res){
        apiControllers.generateTags(req, res);
    })
    app.get("/api/defaultGenTitles/:id", async function(req, res){
        apiControllers.defaultGenerateTitles(req, res);
    })
    app.get("/api/genTitlesTranscript/:id", async function(req, res){
        apiControllers.generateTitlesTranscript(req, res);
    })
    app.get("/api/genTitlesQueries/:query1/:query2/:query3", async function(req, res){
        apiControllers.generateTitlesQueries(req, res);
    })
}