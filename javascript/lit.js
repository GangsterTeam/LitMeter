// they told be global variables are wrong, I told them to bite me
var totalQuestions = 0;
var questionsRight = 0;
var clicked = false;

function jsonp(url, callback) {
    var callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random());
    window[callbackName] = function(data) {
        delete window[callbackName];
        document.body.removeChild(script);
        callback(data);
    };

    var script = document.createElement('script');
    script.src = url + (url.indexOf('?') >= 0 ? '&' : '?') + 'callback=' + callbackName;
    document.body.appendChild(script);
}

var x;
jsonp('http://api.urbandictionary.com/v0/random/', function(data) {
   var x = data;
   var y;
   jsonp('http://api.urbandictionary.com/v0/random/', function(data) {
      y = data;
      console.log(x + " " + y);
   });
});

function getJSON(url){
  var Httpreq = new XMLHttpRequest(); // a new request
  Httpreq.open("GET",url,false);
  Httpreq.send(null);

  return Httpreq.responseText;
}

function getUrbanTest() {

  clicked = false;
  document.getElementById("next").style.visibility = 'hidden';
  document.getElementById("answer").style.visibility = 'hidden';
  // get an urban dictionary word, if it is too long (>120 chars) or if the word
  // is in the description
  do {
    var urbanWord1 = JSON.parse(getJSON("http://api.urbandictionary.com/v0/random/"));
    var quote = urbanWord1["list"][0]["definition"]
  } while (quote.split(' ').length > 80 || quote.includes(urbanWord1["list"][0]["word"]));
  var urbanWord2 = JSON.parse(getJSON("http://api.urbandictionary.com/v0/random/"));

  // format quote and insert it into html
  var quote = "\"" + quote + "\"";
  document.getElementById("quote").innerHTML = quote;

  // get the words for the quote
  var word = urbanWord1["list"][0]["word"];
  var fakeWord = urbanWord2["list"][0]["word"];

  var option1 = document.getElementById("option1");
  var option2 = document.getElementById("option2");

  var answer;

  // set html buttons to corresponding words
  // using the most complex random algorithm invented
  // Sombra can't even figure this one out
  if ((Math.floor((Math.random() * 100) + 1) % 2 ) == 0) {
    option1.innerHTML = word;
    option2.innerHTML = fakeWord;
    answer = "option1";
  } else {
    option1.innerHTML = fakeWord;
    option2.innerHTML = word;
    answer = "option2";
  }

  // format buttons so theyre the same width
  if(option1.clientWidth > option2.clientWidth) {
    option2.style.width = option1.clientWidth + "px";
  } else {
    option1.style.width = option2.clientWidth + "px";
  }

  totalQuestions++;

  return answer;

}

function optionClicked(button, answer, nextButton) {

  if(clicked) { // if the user has entered an input, don't let them do it again
    return;
  }

  var answerId = document.getElementById("answer");
  answerId.style.visibility = 'visible';
  if(answer == button) { // user is right
    questionsRight++;
    answerId.innerHTML = "Correct";
    answerId.style.color = "#75E281";
  } else { // user is wrong
    answerId.innerHTML = "Wrong";
    answerId.style.color = "#1EA4DB";
  }

  // fading and setting the score
  fadeAnim(answerId);
  nextButton.style.visibility = 'visible';
  fadeAnim(nextButton);
  var score = Math.round((questionsRight/totalQuestions) * 100);
  var percentage = document.getElementById("percentage");
  percentage.innerHTML = score + "%";
  fadeAnim(percentage);

  clicked = true;
}

// quick fade in for buttons and score
function fadeAnim(e) {
  e.style.opacity = 0;
  var tick = function() {
    e.style.opacity = +e.style.opacity + 0.1;

    if(+e.style.opacity < 1) {
      (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16)
    }
  };
  tick();
}

function initialize() {

  // initialize next button, make it invisible and set up event listener
  var nextButton = document.getElementById("next");
  nextButton.style.visibility = 'hidden';
  nextButton.addEventListener("click", getUrbanTest, false);

  // start the main function
  var answer = getUrbanTest();

  // set up event listeners for both buttons
  document.getElementById("option1").addEventListener("click", function() {
    optionClicked("option1", answer, nextButton);
  }, false);
  document.getElementById("option2").addEventListener("click", function() {
    optionClicked("option2", answer, nextButton);
  }, false);
}
initialize();
