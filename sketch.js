let mic;
let micVol;
let song;
let button;
let fft;
let volhistory = [];
let slider;
let centroidSlider;

//add preloaded music
function preload() {
  song = loadSound("sample-visualisation.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
//make sure the song in preload can play
  song.play();
  
//create button to toggle music
  button = createButton("STOP");
  button.mousePressed(toggle);
  
//microphone input
  mic = new p5.AudioIn();
  mic.start();
  
//create slider for adjust the background brightness freely
  slider = createSlider(0, 255, 20);
  slider.position(20, 20);
  slider.style("width", "150px");
  
//set the relevant valuesinput of FFT (Fast Fourier Transform) for waveform song visualization
  fft = new p5.FFT(0.5, 128);
  fft.setInput(song);

//add a new slider
  centroidSlider = createSlider(0, 255, 128);
  centroidSlider.position(200, 20);
  centroidSlider.style("width", "150px");
}

//button setting to toggle the playback state of the song
 //if the song is playing, a "STOP" button will be displayed
 //if the song is not playing, the "PLAY" button will display
function toggle() {
  if (song.isPlaying()) {
    song.stop();
    button.html("PLAY");
  } else {
    song.play();
    button.html("STOP");
  }
}

function draw() {
//set the value of the slider
  let val = slider.value();
  background(val);
  
//use array to create palettes which provide colors match the visual theme style for subsequent generation of interactive elements
  let colorPalette1 = random([
    "lavender",
    "aquamarine",
    "lightsteelblue",
    "lightsalmon",
    "paleturquoise",
    "pink",
  ]);
  let colorPalette2 = random([
    "pink",
    "darkorchid",
    "orange",
    "plum",
    "mediumspringgreen",
    "red",
  ]);
  
//use text to add a description of the basic operation
  //make sure the text is in the right spot on the page
  fill(255, 255, 255, 150);
  textFont("Verdana");
  textAlign(CENTER, CENTER);
  textSize(15);
  text(
    "Stop the music through the button in the lower left corner for microphone interaction.",
    width / 2,
    45
  );
  text(
    "Slider in the upper left corner can adjust the background brightness;",
    width / 2,
    65
  );
  text(
    "The second slider on the top adjusts the visualization of the spectral centroid.",
    width / 2,
    85
  );

//set the microphone input as the condition to control the change of sound visualization
  push();

  micVol = mic.getLevel();
  
//create the "starlight" in the background using the "For Loop" method
  for (let i = 0; i < windowWidth; i++) {
    fill(random(250), random(150), random(255), 255);
    //add the input variable of the microphone, so that the overall "starlight" can change visually as the sound is input
    ellipse(i * 10, micVol * 2500 + random(500), 3);
  }

//create "eyes" element with ellipse
  noStroke();
  //adjust the fill color to make the two ellipses stack similar to eyes
  //set the height of the ellipse representing the eyes so that it can interact with the sound input in the process of sound visualization (change the height up and down with the sound)
  fill(0, 200, 261, 200);
  ellipse(windowWidth / 2, height / 2, 120, micVol * 450);
  fill(0);
  ellipse(windowWidth / 2, height / 2, 40, micVol * 400);

//create constant and compute the amplitude value along the frequency domain
  const data = fft.analyze();
  //use the "for loop" method to create the composition of the FFT visual waveform
  for (let i = 0; i < 200; i++) {
    fill(colorPalette2);
    const x = map(i, 0, 130, 0, width);
    const y = map(data[i], 0, 350, 125, 10);
    ellipse(x, y, 6, 2);
  }

//create a visual element of sound around the eye
  stroke(colorPalette1);
  noFill();
  volhistory.push(micVol);
  
  translate(width / 2, height / 2);
  beginShape();
  //use the "for loop" method to create the corrugated circle, make sure it surrounds the "eye" in a circular form and interactively changes depending on the sound input
  for (let i = 0; i < 360; i++) {
    let r = map(volhistory[i], 0, 1, 100, 500);
    let x = r * cos(i);
    let y = r * sin(i);
    vertex(x, y);
  }
  endShape();
  
//set the historical value of the micVol, so that the waveform can be clearly displayed in the interface after constantly changing with the sound input
  if (volhistory.length > 360) {
    volhistory.splice(0, 1);
  }
  pop();
 
  if (volhistory.length > width) {
    volhistory.splice(0, 1);
  }
  
//create graphics amplitude diagrams for sound visualization with sound input
  stroke(colorPalette2);
  fill(colorPalette2);
  //let the whole amplitude graph visually change up and down depending on the sound input amplitude
  let currentY = map(micVol, 0, 1, height, 0);
  translate(0, height - currentY);
  volhistory.push(micVol);
  beginShape();
  //use the "for loop" method to create the corrugated circle, make sure it surrounds the "eye" in a circular form and interactively changes depending on the sound input
  for (let i = 0; i < volhistory.length; i++) {
    let y = map(volhistory[i], 0, 1, (height / 5) * 4.25, 0);
    vertex(i, y);
  }
  endShape();
  
//repeat the above procedure to make a line duplicated version of the amplitude diagram
  stroke(colorPalette2);
  noFill();
  translate(0, height - currentY);
  volhistory.push(micVol);
  beginShape();
  for (let i = 0; i < volhistory.length; i++) {
    let y = map(volhistory[i], 0, 1, (height / 5) * 3.75, 0);
    vertex(i, y);
  }
  endShape();

  if (volhistory.length > width) {
    volhistory.splice(0, 1);
  }

//use the spectral centroid
  const spectralCentroid = fft.getCentroid();
  fill(255);
  rect(width - 50, height - 30, map(spectralCentroid, 0, 12000, 0, 50), 20);

//adjust the visualization of the spectrum centroid according to the slider
  const centroidVal = centroidSlider.value();
  fill(centroidVal);
  rect(width - 100, height - 30, map(spectralCentroid, 0, 12000, 0, 50), 20);
}
