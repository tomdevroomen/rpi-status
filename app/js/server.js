var exec = require('child_process').exec;
var mqtt = require('mqtt');
var argv = require('minimist')(process.argv.slice(2));
var mqttClient = mqtt.connect('mqtt://'+argv._[0]+'/');

mqttClient.subscribe('presence');
mqttClient.subscribe('rpi-temp');
mqttClient.publish('presence', 'rpi-status is alive at: ' + Date());
mqttClient.on('message', function (topic, message) {
    // message is Buffer 
    console.log(message.toString());
    
    switch (topic) {
        case 'presence' : {
            console.log('Start reading temp');
            readTemp();
        }
    }
});

var readTemp = function() {
    setInterval(function () {
        exec("cat /sys/class/thermal/thermal_zone0/temp", function (error, stdout, stderr) {
            if (error !== null) {
                console.log('exec error: ' + error);
                mqttClient.publish('rpi-temp', 
                    JSON.stringify({'error': error}));
            } else {
                var date = new Date();
                var temp = parseFloat(stdout) / 1000;
                mqttClient.publish('rpi-temp', 
                    JSON.stringify({'date' : date, 'temp' : temp}));
            }
        });
    }, 5000);
};