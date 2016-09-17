var SpeechToTextV1 = require('watson-developer-cloud/speech-to-text/v1');
var fs = require('fs');
var async = require('async');

var speech_to_text = new SpeechToTextV1({
  "password": process.env.SERVICE_NAME_PASSWORD,
  "username": process.env.SERVICE_NAME_USERNAME
});

var checked = [],
    files = fs.readdirSync('./resources'),
    ready = false;

files.forEach(function(file, idx){
  if(file.match(/(\.|\/)(wav)$/i)){
    checked.push(file);
    if(idx === files.length - 1) {
      ready = true;
    }
  } else {
    if(file[0] != '.'){
      console.log("Bad file type, format must be .WAV");
      if(idx === files.length - 1) {
        ready = true;
      }
    }
  }
});

if(ready){
  async.eachSeries(checked, function(item, callback) {
    console.log("Running "+item);
    fs.createReadStream('./resources/'+item)
    .pipe(
      speech_to_text.createRecognizeStream({
        content_type: 'audio/l16; rate=44100'
      })
    ).pipe(
      fs.createWriteStream('./results/'+item+'.txt')
    ).on('finish', function(){
      console.log("Conversion finished for "+item);
      callback(null, true);
    });
  });
};