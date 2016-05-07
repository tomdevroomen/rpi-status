var app = require('http').createServer(handler);
var io = require('socket.io').listen(app);
var fs = require('fs');
var sys = require('util');
var exec = require('child_process').exec;
var child;

// Listen on port 8000
app.listen(8000);

function handler(req, res) {
    var indexHtml = __dirname + '/../index.html';
    fs.readFile(indexHtml, function () {
        if (err) {
            console.log('Index not found at: '+indexHtml, err);
            res.writeHead(500);
            return res.end('Error loading index.html');
        }
        res.writeHead(200);
        res.end(data);
    });
};

io.on('connection', function (socket) {
    setInterval(function () {
        child = exec("cat /sys/class/thermal/thermal_zone0/temp", function (error, stdout, stderr) {
            if (error !== null) {
                console.log('exec error: ' + error);
            } else {
                var date = new Date().getTime();
                var temp = parseFloat(stdout) / 1000;
                socket.emit('temperatureUpdate', date, temp);
            }
        });
    }, 5000);
});
