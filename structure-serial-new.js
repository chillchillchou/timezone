var maxTimezone = 0;
var prevTimezone = 0;
var timezone = [];
var city = [];
var currentTimezone = 0;
var initialTimezone = 0;
var timeTest;
var fromSerials = []; //array to store all the data from serials
//load json file that store all city infomation and image paths

//try the rotating thing
let x1;
let y1;
let h;
let s;
let l;
let ipt;


var c;
var ctx;

function preload() {
  cityData = loadJSON("cityobject.json");
}

// var sunlight; //slider that indicates sunlight

function setup() {
  ipt = createInput();
  // ipt.position(20, 65);
  // ipt.style(z-index,10);
  //noCanvas();
  //create a canvas
  c = createCanvas(windowWidth, windowHeight);
  ctx = c.drawingContext;

  noStroke();
  c.parent("#main-container");

  //create something for the rotating drawing
  x1 = 0;
  y1 = 0;
  // c.position(width/2, height/2);
  //




  //create slider
  // sunlight=createSlider(0,24,curentTimezone,1);


  //create serial comunnication
  // serial = new p5.SerialPort(); // make a new instance of  serialport librar
  // serial.on('list', printList); // callback function for serialport list event
  // serial.on('data', serialEvent); // callback for new data coming in
  // serial.list(); // list the serial ports
  // serial.open("/dev/cu.usbmodem1411"); // open a port

  //create a slider to control what time to display for each city. The value of the slider represents the timezone that gets the most sunlight or is 12:00 at noon.
  //e.g.: if slider.value=0, then cities in timezone 0 are at 12:00pm. All other timezone's time change accordingly.
  //update images to disply every time the slider value changes
  updateImages(initialTimezone);
}

function draw() {

  //try to draw the rotating thing
  // background(250,255,255,10);

    timeTest = ipt.value();
    console.log(timeTest);
    drawGradient(timeTest);
  // push();
  // translate(width / 2, height / 2);
  // var gradX = mouseX - width / 2;
  // var gradY = mouseY - height / 2;
  // var gradient = ctx.createRadialGradient(0, 0, 400, gradX, gradY, 0);
  // gradient.addColorStop(0, "black");
  // // gradient.addColorStop(0.3,"grey");
  // gradient.addColorStop(1, "orange");
  // ctx.fillStyle = gradient;
  // ellipse(0, 0, 800, 800);
  // pop();
  // drawIndicator(timeTest);


}

function drawGradient(i){

  push();
  translate(width / 2, height / 2);

  //gradX=R*cos(a),gradY=R*sin(a)
  //a=270+*15*i
  var gradX=400*cos(radians(90+15*timeTest*(-1)));
  var gradY=400*sin(radians(90+15*timeTest*(-1)));
  // var gradX = mouseX - width / 2;
  // var gradY = mouseY - height / 2;
  var gradient = ctx.createRadialGradient(0, 0, 400, gradX, gradY, 0);
  gradient.addColorStop(0, "black");
  // gradient.addColorStop(0.3,"grey");
  gradient.addColorStop(1, "orange");
  ctx.fillStyle = gradient;
  ellipse(0, 0, 800, 800);
  pop();
}

function updateImages(t) {
  // this line delets everything in the container div elment,
  // because we are about to populate it with new images.
  document.getElementById("label-container").innerHTML = "";
  document.getElementById("image-container").innerHTML = "";
  //time is the time to display for each timezone
  var time = 12 - t;
  //if time<0, time changed to night in the last time. e.g., -1 = 23:00pm
  if (time < 0) {
    time = 24 + time;
  }

  var timezones = cityData.timezones; //access the timezone array in json file
  // var positionX = 20; //specify initial x position for the first column of photos (timezone 0)
  // var positionY = 200; //specify intial y position for the first city in the timezone 0
  var positionX = window.innerWidth / 2; //specify initial x position for the first column of photos (timezone 0)
  var positionY = window.innerHeight / 2; //specify intial y position for the first city in the timezone 0
  var zoneTextPosX = 60; //specify the position to display timezone text
  var zoneTextPosY = 50;
  // var current_r = t;
  // var t = current_r;

  for (i = 0; i < timezones.length; i++) { //loop through all 24 time zoens


    //here we specify the time to display for timezone 0;
    //if t (serial value) is 0, timezone 0 is 12:00pm;
    //if serial value is 1, timezone 1 is 12:00 which means timezone 0 is 11:00;
    //so the time of the timezone 0 is : (12-sliderValue);

    //loop through all cities in each timezone
    var timezoneContainer = createDiv("GMT" + i + " " + ("0" + time).slice(-2) + ":00");
    timezoneContainer.id("container" + String(i));
    timezoneContainer.class("container");
    timezoneContainer.position(positionX, positionY);
    document.getElementById("container" + String(i)).style.transform = "rotate(" + String(i * (-1) * (15)) + "deg) translate(0px, 400px)";

    timezoneContainer.parent("#image-container");
    //loop through each city
    for (j = 0; j < timezones[i].length; j++) {
      var currentCity = timezones[i][j];
      try {
        //create a container for both texts and image of a city
        cityContainer = createDiv('');
        cityContainer.class("city-container");
        cityContainer.parent("#container" + String(i));
        var currentImage = createImg(currentCity.path + time + currentCity.format); //./ciites/london/london0.png
        currentImage.id("image" + currentCity.name);

        // currentImage.position(positionX, positionY);
        // currentImage.style.transform = "rotate(45deg)";

        currentImage.parent(cityContainer);
        currentImage.show();

        var currentCityname = createP(currentCity.name);
        currentCityname.parent(cityContainer);
        currentCityname.class("cities");


      } catch (err) {
        //this is for debugging
        print("seems like there isn't any ", currentCity.path + t + currentCity.format);
        print("here is the offcicl error message " + err);
      }
      // positionY = positionY + 150;
    }

    //the time increases while timezone number increases
    time = time + 1;
    //if time > 23, time goes back to 0 (for a new day)
    if (time > 23) {
      time = time - 24;
    }
    // positionX = positionX + 250;
    // positionY = 200;
    zoneTextPosX = zoneTextPosX + 255;
  }
}

//serial staff down there
//print serial port lists
function printList(portList) {
  for (var i = 0; i < portList.length; i++) {
    // Display the list the console:
    console.log(i + " " + portList[i]);
  }
}

var timezoneMapping = [20, 19, 18, 17, 7, 6, 5, 4, 3, 2, 1, 0, 8, 9, 10, 11, 12, 13, 14, 15, 16, 23, 22, 21];

function serialEvent() {
  // this is called when data is recieved, data will then live in fromSerial
  var stringFromSerial = serial.readLine(); // reads everything till the new line charecter
  if (stringFromSerial.length > 0) { // is something there ?
    var trimmedString = trim(stringFromSerial); // get rid of all white space
    var myArray = split(trimmedString, ","); // splits the string into an array on commas

    fromSerials = Array.from({
      length: timezoneMapping.length
    }).map(function(v, i) {
      return Number(myArray[timezoneMapping[i]]);
    });

    console.log(myArray, fromSerials);
    maxReading = Math.max.apply(Math, fromSerials);
    minReading = Math.min.apply(Math, fromSerials);
    // maxTimezone=fromSerials.indexOf(maxReading);
    if ((maxReading - minReading) > 15) {
      if (fromSerials.indexOf(maxReading) != maxTimezone) {
        maxTimezone = fromSerials.indexOf(maxReading);
        console.log("max timezone is" + maxTimezone);
        updateImages(maxTimezone);
        drawIndicator(fromSerials.indexOf(maxReading));
        console.log(maxTimezone);
        document.getElementById("container" + String(fromSerials.indexOf(maxReading))).style.color = "yellow";
        // console.log(fromSerials);
      }
    } else {
      sleep();
    }
  }
}

function sleep() {
  document.getElementById("label-container").innerHTML = "";
  document.getElementById("image-container").innerHTML = "";
  // background(0,90);
  //time is the time to display for each timezone
  var timezones = cityData.timezones; //access the timezone array in json file
  var positionX = window.innerWidth / 2; //specify initial x position for the first column of photos (timezone 0)
  var positionY = window.innerHeight / 2; //specify intial y position for the first city in the timezone 0
  var zoneTextPosX = 60; //specify the position to display timezone text
  var zoneTextPosY = 50;

  for (i = 0; i < timezones.length; i++) { //loop through all 24 time zoens
    //loop through all cities in each timezone
    var timezoneContainer = createDiv("");
    timezoneContainer.id("container" + String(i));
    timezoneContainer.class("container");
    timezoneContainer.position(positionX, positionY);
    document.getElementById("container" + String(i)).style.transform = "rotate(" + String((-1) * i * 15) + "deg) translate(0px, 400px)";
    timezoneContainer.parent("#image-container"); //loop through each city
    for (j = 0; j < timezones[i].length; j++) {
      var currentCity = timezones[i][j];
      // var pictures = [];
      try {
        cityContainer = createDiv('');
        cityContainer.class("city-container");
        cityContainer.parent("#container" + String(i));
        var currentImage = createImg(currentCity.path + 0 + currentCity.format); //./ciites/london/london0.png
        currentImage.id("image" + String(i) + String(j));

        // currentImage.position(positionX, positionY);
        // currentImage.style.transform = "rotate(45deg)";

        currentImage.parent(cityContainer);
        currentImage.show();

        var currentCityname = createP(currentCity.name);
        currentCityname.parent(cityContainer);
        currentCityname.class("cities");
      } catch (err) {
        //this is for debugging
        print("seems like there isn't any ", currentCity.path + t + currentCity.format);
        print("here is the offcicl error message " + err);
      }
      // positionY = positionY + 150;
    }
    zoneTextPosX = zoneTextPosX + 255;
  }
}


function drawIndicator(i) {
  // background(0, 95);
  push();
  translate(width / 2, height / 2);
  rotate(radians(180 + i * (-1) * 15));
  scale(2);
  colorMode(HSL);
  // fill(47,100,70,0.04);
  // noStroke();
  // ellipse(x1,y1,50);
  h = 0;
  s = 0;
  l = 70;
  noFill();
  stroke(h, s, l);
  // triangle(x1,y1,-80,80,60,80);

  //stroke(255);
  //line(x1,y1,x2,y2);

  strokeWeight(1);

  //fill(360,100,100,random(0.5,0.95));
  stroke(360, 100, frameCount % 360, 1);
  strokeWeight(2);
  line(0, 0, 0, -150);
  x1 = x1 + random(-2, 2);
  y1 = y1 + random(-2, 2);
  //x1=20


}



// window.onload = function() {
//   Maptastic("main-container");
// };
