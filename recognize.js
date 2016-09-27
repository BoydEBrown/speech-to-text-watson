var SpeechToTextV1 = require('watson-developer-cloud/speech-to-text/v1');
var fs = require('fs');
var async = require('async');

var speech_to_text = new SpeechToTextV1({
  "password": process.env.SERVICE_NAME_PASSWORD,
  "username": process.env.SERVICE_NAME_USERNAME
});

var checked = [],
    tracked = [],
    files = fs.readdirSync('./resources'),
    currentItem = '',
    ready = false;

files.forEach(function(file, idx){
  if(file.match(/(\.|\/)(wav)$/i)){
    checked.push(file);
    tracked.push(file);
    if(idx === files.length - 1) {
      ready = true;
    }
  } else {
    if(file[0] != '.'){
      console.log("Bad file type, format must be .WAV");
      if(idx === files.length - 1) {
        ready = true;
      }
    } else {
      console.log("Hidden file or directory (.DS_Store or .git usually), skipping.");
    }
  }
});

if(ready){
  fs.writeFile('./resources/tracker/tracker.txt', tracked);
  try {
    async.eachLimit(checked, process.env.FILE_ASYNC_LIMIT, function(item, callback) {
      console.log("Running "+item);
      currentItem = item;

      tracked.splice(tracked,indexOf(item), 1);

      fs.writeFile('./resources/tracker/tracker.txt', tracked);

      fs.createReadStream('./resources/'+item)
      .pipe(
        speech_to_text.createRecognizeStream({
          content_type: 'audio/l16; rate=44100'
        }).on('error', function(err){
          console.log("Speech to Text Stream Error", err);
          checked[checked.indexOf(item)] = {Status: "Completed", fileLocation: "./resources/'+item"};
          fs.writeFile('./resources/tracker/tracker.txt', checked);
          fs.writeFile('./results/errors/watson-error-'+item, err);
        })
      ).pipe(
        fs.createWriteStream('./results/'+item+'.txt').on('error', function(err){
          console.log("Write Stream Error", err);
          checked[checked.indexOf(item)] = {Status: "Completed", fileLocation: "./resources/'+item"};
          fs.writeFile('./resources/tracker/tracker.txt', checked);
          fs.writeFile('./results/errors/write-error-'+item, err);
        })
      ).on('finish', function(){
        console.log("Conversion finished for "+item);
        checked[checked.indexOf(item)] = {Status: "Completed", fileLocation: "./resources/'+item"};
        callback(null, true);
      });
    });
  } catch(err) {
    console.log("Error", err);
    fs.writeFile('./results/errors/catch-error-'+currentItem, err);
  }
};