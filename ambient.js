var config = {
      apiKey: "AIzaSyAuxYEJL2tgqop9s9khcy-PF9SbygUKX6w",
      authDomain: "eslab-d9ff5.firebaseapp.com",
      databaseURL: "https://eslab-d9ff5.firebaseio.com",
      projectId: "eslab-d9ff5",
      storageBucket: "",
      messagingSenderId: "44006788250"
    };
    firebase.initializeApp(config);
var rootRef = firebase.database().ref().child('datas');

var tessel = require("tessel"),
ambientLib = require("ambient-attx4"),
ambient = ambientLib.use(tessel.port["A"]),
WebSocket = require('ws'),
ws = new WebSocket('ws://localhost:5000'),
triggerVal = 0.22, lightdata, sounddata;

// When the module is connected
ambient.on('ready', function () {
  // Get points of light and sound data.
   setInterval( function () {
     ambient.getLightLevel( function(err, lightdata) {
       if (err) throw err;
       ambient.getSoundLevel( function(err, sounddata) {
         if (err) throw err;
         console.log("Light level:", lightdata.toFixed(8), " ", "Sound Level:", sounddata.toFixed(8));
       });
     });
   }, 500); // The readings will happen every .5 seconds

  // Set the sound trigger
  ambient.setSoundTrigger(triggerVal);

  // When the sound trigger is reached
  ambient.on('sound-trigger', function triggerHit() {
    // send out data
    rootRef.push({
      light: lightdata,
      sound: sounddata
    });
  });
});

ambient.on('error', function (err) {
  console.log(err);
});
