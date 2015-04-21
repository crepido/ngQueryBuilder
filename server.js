var express = require('express');
var app = express();

var port = process.env.PORT;
var ip = process.env.IP;
var wwwroot = "wwwroot/";

app.get('/executeQuery', function (req, res) {
    res.send(req.query);
});

/* serves main page */
app.get("/", function(req, res) {
    res.sendfile(wwwroot + 'index.html')
});

/* serves all the static files */
app.get(/^(.+)$/, function(req, res){ 
    console.log('static file request : ' + req.params);
    res.sendfile( __dirname + "/" + wwwroot + req.params[0]); 
});
 
var server = app.listen(port, function () {
    console.log('Example app listening at http://%s:%s', ip, port);
});