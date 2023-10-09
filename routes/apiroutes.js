const apiControllers = require("../controllers/apiControllers");


module.exports = function(app){
    app.get("/api/getData/:id", function(req, res){
        apiControllers.getData(req, res);
    })
}