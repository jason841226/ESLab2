//TODO
// Import Firebase
var Firebase = require('firebase');
var myFirebaseRef = new Firebase("https://eslab-d9ff5.firebaseio.com/");
var rootRef = myFirebaseRef.child("data");

var tessel = require("tessel"),
ambientLib = require("ambient-attx4"),
ambient = ambientLib.use(tessel.port["A"]),
triggerVal = 0.022, lightdata, sounddata;

// When the module is connected
ambient.on('ready', function () {
  // Get points of light and sound data.
   setInterval( function () {
     ambient.getLightLevel( function(err, lightdata) {
       if (err) throw err;
       ambient.getSoundLevel( function(err, sounddata) {
         if (err) throw err;
         console.log("Light level:", lightdata.toFixed(8), " ", "Sound Level:", sounddata.toFixed(8));
         rootRef.push().set({
           title: "Ambient Data",
           values: {
             light: lightdata.toFixed(8),
             sound: sounddata.toFixed(8)
           }
         });
       });
     });
   }, 500); // The readings will happen every .5 seconds

  // Set the sound trigger
  ambient.setSoundTrigger(triggerVal);

  // When the sound trigger is reached
  ambient.on('sound-trigger', function triggerHit() {
    // send out data
    //TODO
    rootRef.push({
      light: lightdata,
      sound: sounddata
    });
  });
});

ambient.on('error', function (err) {
  console.log(err);
});
