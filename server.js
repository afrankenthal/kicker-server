var express = require('express');
var app = express();
var router = express.Router();
var bodyParser = require('body-parser');
var fs = require('fs');

router.use(bodyParser.json());

router.use(function(req,res,next) {

    console.log(req.method, req.url);

    next();
});

router.get('/get/json', function(req,res) {
    var monitorData = fs.readFileSync('/media/card/json/monitorData.json', 'utf8');
    var obj = JSON.parse(monitorData);
		console.log(monitorData);
    res.json(monitorData);
});

router.get('/get/controlJSON', function(req,res) {
    var initialControlData = fs.readFileSync('/media/card/json/controlData.json');
    var obj = JSON.parse(initialControlData);
    console.log(obj);
    res.json(obj);
});

router.post('/post/json', function(req,res) {
    console.log(req.body);
    fs.writeFileSync('/media/card/json/controlData.json', JSON.stringify(req.body));
    res.send({});
});

router.use(express.static(__dirname + '/public'));

app.use('/', router);

app.listen(8081, function() {
    console.log('Listening in port 8081...');
})
