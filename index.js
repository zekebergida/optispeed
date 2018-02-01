var express = require('express');
var nodemailer = require('nodemailer')
var request = require('request');
 
var app = express();
var transporter = nodemailer.createTransport({
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

  URL_TO_GET_RESULTS_FOR = req.query.url
  STRATEGY_IN_USE = req.query.strategy

  runPagespeed()
  
  pageSpeedCallbacks.sendEmail = function(result) {
    var mailOptions = {
      from: 'optispeed.radargun@gmail.com',
      to: req.query.client_email,
      subject: 'Your OptiSpeed Notification',
      html: "<h1 style='color:green'>OptiSpeed</h1><p>Your page speed from Google's PageSpeed Insights for URL " + URL_TO_GET_RESULTS_FOR + " is " + result.ruleGroups.SPEED.score.toString() + "/100</p><p>See Google's suggestions for optimizing your page  <a href='https://developers.google.com/speed/pagespeed/insights/?url=" + URL_TO_GET_RESULTS_FOR + "&tab=" + STRATEGY_IN_USE + "'>Here</a></p>"
    };
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      };
    });
  };

  pageSpeedCallbacks.sendSpeedToUI = function(result) {
    res.end(result.ruleGroups.SPEED.score.toString())
  }

});



var API_KEY = 'AIzaSyA-vJWyH1LdKFGFVCFzFam3ccbBIIHAaNk';
var API_URL = 'https://www.googleapis.com/pagespeedonline/v2/runPagespeed?';
var CHART_API_URL = 'http://chart.apis.google.com/chart?';
var URL_TO_GET_RESULTS_FOR 
var STRATEGY_IN_USE

var pageSpeedCallbacks = {}


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

  // Our JSONP callback. Checks for errors, then invokes our callback handlers.
  function runPagespeedCallbacks(testResult) {
    if (testResult.error) {
      var errors = testResult.error.errors;
      for (var i = 0, len = errors.length; i < len; ++i) {
        if (errors[i].reason == 'badRequest' && API_KEY == 'yourAPIKey') {
          alert('Please specify your Google API key in the API_KEY variable.');
        } else {
          // NOTE: your real production app should use a better
          // mechanism than alert() to communicate the error to the user.
          // this code was originally for regular JavaScript in node.js alert is undifined
          alert(errors[i].message);
        };
      };
      return;
    };
    // Dispatch to each function on the callbacks object.
    for (var fn in pageSpeedCallbacks) {
      var f = pageSpeedCallbacks[fn];
      if (typeof f == 'function') {
        pageSpeedCallbacks[fn](testResult);
      };
    };
  };