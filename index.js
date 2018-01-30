var express = require('express');
var nodemailer = require('nodemailer')
var request = require('request');
 
var app = express();
var smtpTransport = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    auth: {
      user: 'optispeed.radargun@gmail.com',
      pass: 'yoelgabay'
    }
});


app.listen(3000,function(){
console.log("Express Started on Port 3000");
});

app.get('/',function(req,res){
res.sendfile('index.html');
});

app.get('/send',function(req,res){
// var mailOptions={
//    to : req.query.to,
//    subject : req.query.subject,
//    text : req.query.text
// }
// console.log(mailOptions);
// smtpTransport.sendMail(mailOptions, function(error, response){
// if(error){
// console.log(error);
// res.end("error");
// }else{
// console.log("Message sent: " + response.message);
// res.end("sent");
// }
// });
// Add the below code here and use the input fields for the to, the URL_TO_GET_RESULTS_FOR, STRADEGY

console.log(req.query.client_email) 
console.log(req.query.url) 
console.log(req.query.strategy) 
//res.end("sent");




 // Specify your actual API key here:
var API_KEY = 'AIzaSyA-vJWyH1LdKFGFVCFzFam3ccbBIIHAaNk';

// Specify the URL you want PageSpeed results for here:
var URL_TO_GET_RESULTS_FOR = req.query.url
var STRATEGY_IN_USE = req.query.strategy

var API_URL = 'https://www.googleapis.com/pagespeedonline/v2/runPagespeed?';
var CHART_API_URL = 'http://chart.apis.google.com/chart?';

// Object that will hold the callbacks that process results from the
// PageSpeed Insights API.
var callbacks = {}
callbacks.logResults = function(result) {
  console.log(result.ruleGroups.SPEED.score)
}
callbacks.sendEmail = function(result) {
  var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'optispeed.radargun@gmail.com',
    pass: 'yoelgabay'
  }
});
var mailOptions = {
  from: 'optispeed.radargun@gmail.com',
  to: req.query.client_email,
  subject: 'Your OptiSpeed Notification',
  html: "<h1 style='color:green'>OptiSpeed</h1><p>Your page speed from Google's PageSpeed Insights for URL " + URL_TO_GET_RESULTS_FOR + " is " + result.ruleGroups.SPEED.score.toString() + "</p><p>See Google's suggestions for optimizing your page  <a href='https://developers.google.com/speed/pagespeed/insights/?url=" + URL_TO_GET_RESULTS_FOR + "&tab=" + STRATEGY_IN_USE + "'>Here</a></p>"
};
transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
}

callbacks.showSpeed = function(result) {
  res.end(result.ruleGroups.SPEED.score.toString())
}

// Invokes the PageSpeed Insights API. The response will contain
// JavaScript that invokes our callback with the PageSpeed results.
function runPagespeed() {
  var query = [
    'url=' + URL_TO_GET_RESULTS_FOR,
    'strategy=' + STRATEGY_IN_USE,
    'key=' + API_KEY,
  ].join('&');
  
  request(API_URL + query, { json: true }, function(err, res, body){
    var testResults = body
    runPagespeedCallbacks(testResults)
  });

}

runPagespeed()
    

// Our JSONP callback. Checks for errors, then invokes our callback handlers.
function runPagespeedCallbacks(result) {
  if (result.error) {
    var errors = result.error.errors;
    for (var i = 0, len = errors.length; i < len; ++i) {
      if (errors[i].reason == 'badRequest' && API_KEY == 'yourAPIKey') {
        alert('Please specify your Google API key in the API_KEY variable.');
      } else {
        // NOTE: your real production app should use a better
        // mechanism than alert() to communicate the error to the user.
        alert(errors[i].message);
      }
    }
    return;
  }

  // Dispatch to each function on the callbacks object.
  for (var fn in callbacks) {
    var f = callbacks[fn];
    if (typeof f == 'function') {
      callbacks[fn](result);
    }
  }
}


});





//  // Specify your actual API key here:
// var API_KEY = 'AIzaSyA-vJWyH1LdKFGFVCFzFam3ccbBIIHAaNk';

// // Specify the URL you want PageSpeed results for here:
// var URL_TO_GET_RESULTS_FOR = 'https://saferout.herokuapp.com';
// var STRATEGY_IN_USE = 'desktop'

// var API_URL = 'https://www.googleapis.com/pagespeedonline/v2/runPagespeed?';
// var CHART_API_URL = 'http://chart.apis.google.com/chart?';

// // Object that will hold the callbacks that process results from the
// // PageSpeed Insights API.
// var callbacks = {}
// callbacks.logResults = function(result) {
//   console.log(result.ruleGroups.SPEED.score)
// }
// callbacks.sendEmail = function(result) {
//   var transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: 'optispeed.radargun@gmail.com',
//     pass: 'yoelgabay'
//   }
// });
// var mailOptions = {
//   from: 'optispeed.radargun@gmail.com',
//   to: 'zekebergida@gmail.com',
//   subject: 'Your OptiSpeed Notification',
//   html: "<h1 style='color:green'>OptiSpeed</h1><p>Your page speed from Google's PageSpeed Insights for URL " + URL_TO_GET_RESULTS_FOR + " is " + result.ruleGroups.SPEED.score.toString() + "</p><p>See Google's suggestions for optimizing your page  <a href='https://developers.google.com/speed/pagespeed/insights/?url=" + URL_TO_GET_RESULTS_FOR + "&tab=" + STRATEGY_IN_USE + "'>Here</a></p>"
// };
// transporter.sendMail(mailOptions, function(error, info){
//   if (error) {
//     console.log(error);
//   } else {
//     console.log('Email sent: ' + info.response);
//   }
// });
// }

// // Invokes the PageSpeed Insights API. The response will contain
// // JavaScript that invokes our callback with the PageSpeed results.
// function runPagespeed() {
//   var query = [
//     'url=' + URL_TO_GET_RESULTS_FOR,
//     'strategy=' + STRATEGY_IN_USE,
//     'key=' + API_KEY,
//   ].join('&');
  
//   request(API_URL + query, { json: true }, function(err, res, body){
//     var testResults = body
//     runPagespeedCallbacks(testResults)
//   });

// }

// runPagespeed()
    

// // Our JSONP callback. Checks for errors, then invokes our callback handlers.
// function runPagespeedCallbacks(result) {
//   if (result.error) {
//     var errors = result.error.errors;
//     for (var i = 0, len = errors.length; i < len; ++i) {
//       if (errors[i].reason == 'badRequest' && API_KEY == 'yourAPIKey') {
//         alert('Please specify your Google API key in the API_KEY variable.');
//       } else {
//         // NOTE: your real production app should use a better
//         // mechanism than alert() to communicate the error to the user.
//         alert(errors[i].message);
//       }
//     }
//     return;
//   }

//   // Dispatch to each function on the callbacks object.
//   for (var fn in callbacks) {
//     var f = callbacks[fn];
//     if (typeof f == 'function') {
//       callbacks[fn](result);
//     }
//   }
// }











