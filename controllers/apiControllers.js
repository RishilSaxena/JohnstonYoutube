const axios = require("axios")
const API_KEY = 'AIzaSyBs2cU-dDMX3hFNOzqtw62hI9mgiNIlHzg'
module.exports = {
    getData: function(req, res){
        // console.log(req.params["id"])
       axios.get(`https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${req.params["id"]}&key=${API_KEY}`).then(function(data){
        res.json(data.data.items[0]);
       })
    }
}