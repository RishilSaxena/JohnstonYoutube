const apiControllers = require("../controllers/apiControllers");

module.exports = function(app){
    app.get("/api/getData/:id", function(req, res){
        apiControllers.getData(req, res);
    })
    app.get("/api/generateTags/:id", async function(req, res){
        apiControllers.generateTags(req, res);
    })
}