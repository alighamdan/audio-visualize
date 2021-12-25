var song;
var fft;
var particles = [];
var bgimg;
var times = 1;
var mainimg;
var guidetext;
const musicFolder = "Music/";
function preload() {
  bgimg = loadImage("bg.jpg");
  mainimg = loadImage("crmainimg.png");

  if (getallqueries().find((e) => e.key === "song") != null) {
    song = loadSound(getallqueries().find((e) => e.key === "song").value);
  } else {
    return alert("Please Provide song Param And Set The Value With .mp3 url")
    // song = loadSound(musicFolder + getrandomelement(allsongs));
  }
}
function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  imageMode(CENTER);
  rectMode(CENTER);
  bgimg.filter(BLUR, 10);
  fft = new p5.FFT();
  // playanother();
  song.play();
}

function draw() {
  background(0);
  translate(width / 2, height / 2);
  fft.analyze();
  var correctVoice = song.getVolume() * 100;
  amp = fft.getEnergy(20, 200);
  push();
  if (amp > 230) {
    rotate(random(-0.5, 0.5));
  }
  image(bgimg, 0, 0, width, height);
  pop();
  var alpha = map(amp, 0, 255, 180, 150);
  fill(0, alpha);
  noStroke();
  rect(0, 0, width, height);

  stroke(255);
  strokeWeight(1.3);
  noFill();

  textSize(32);
  text(Math.floor(amp), 600, 300);
  textSize(32);
  text(
    `${sstohhmmss(Math.floor(song.duration()))} / ${sstohhmmss(
      Math.floor(song.currentTime())
    )}`,
    -660,
    300
  );
  textSize(32);
  text(`Volume: ${Math.floor(correctVoice)} |`, -670, -290);
  textSize(25);
  text(
    `Song: ${
      song.url
      // song.url.length > 20
      //   ? `${song.url.substr(0, 20)}${
      //       song.url.substr(0, 20).split(".")[1] !== ".mp3" ? `.mp3` : ``
      //     }`
      //   : `${song.url}`
    }`
      .replace(musicFolder, "")
      .split(".")
      .reverse()
      .slice(1)
      .reverse()
      .join("."),
    -470,
    -290
  );
  if (correctVoice < 0) {
    song.setVolume(0);
  } else if (correctVoice > 100) {
    song.setVolume(1);
  }
  var wave = fft.waveform();

  for (let t = -1; t <= 1; t += 2) {
    beginShape();
    for (let i = 0; i <= 180; i += 0.5) {
      var index = floor(map(i, 0, 180, 0, wave.length));
      var r = map(Number(wave[index]), -1, 1, 150, 350);
      var x = r * sin(i) * t;
      var y = r * cos(i);
      if (getallqueries().find((e) => e.key === "type")?.value === "points") {
        point(x, y);
      } else {
        vertex(x, y);
      }
    }
    endShape();
  }

  var p = new Particle();
  particles.push(p);

  for (let i = particles.length - 1; i >= 0; i--) {
    const particle = particles[i];
    if (!particle.edges()) {
      particle.update(amp);
      if (amp > 250) {
        particle.update(amp);
      }
      particle.show();
    } else particles.splice(i, 1);
  }

  image(mainimg, 0, 0, 690, 690);
}

function mouseClicked() {
  if (song.isPlaying()) {
    song.pause();
    noLoop();
  } else {
    song.play();
    loop();
  }
}

function keyPressed() {
  let all = song.duration();
  let duration = song.currentTime();
  if (key == "ArrowLeft") {
    if (duration < 5) return;
    song.jump(duration - 5);
  } else if (key == "ArrowRight") {
    if (all - duration < 5) return;
    song.jump(duration + 5);
  }
}

function mouseWheel(event) {
  let v = -event.delta / 1000;
  if (song.getVolume() * 100 === 100 && v === 0.1) return;
  if (song.getVolume() * 100 <= 0 && v === -0.1) return;
  song.setVolume(v + song.getVolume());
}

class Particle {
  constructor() {
    this.pos = p5.Vector.random2D().mult(250);
    this.vel = createVector(0, 0);
    this.acc = this.pos.copy().mult(random(0.0001, 0.00001));

    this.w = random(3, 5);

    this.color = [
      random(200, 255),
      random(200, 255),
      random(200, 255),
      random(200, 255),
    ];
  }
  update(cond) {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    if (cond > 200) {
      for (let i = 0; i < Math.floor(cond / 70); i++) {
        this.pos.add(this.vel);
        this.pos.add(this.vel);
      }
    }
  }
  edges() {
    if (
      this.pos.x < -width / 2 ||
      this.pos.x > width / 2 ||
      this.pos.y < -height / 2 ||
      this.pos.y > height / 2
    ) {
      return true;
    } else return false;
  }
  show() {
    noStroke();
    fill(this.color);
    ellipse(this.pos.x, this.pos.y, this.w);
  }
}

function sstohhmmss(s) {
  let m = 0;
  while (s > 60) {
    m += 1;
    s -= 60;
  }

  return `${m > 9 ? "" : "0"}${m}:${s > 9 ? "" : "0"}${s}`;
}

function getallqueries() {
  let all = location.search
    .replace("?", "")
    .split("&")
    .map((e) => {
      return {
        key: e.split("=")[0],
        value: e.split("=")[1],
      };
    });

  return all;
}

// function getrandomelement(array) {
//   return array.sort(() => Math.random() - 0.5)[0];
// }

// function playanother() {
//   song.load(() => {
//     setTimeout(() => {
//       song._onended = () => {
//         if (Math.floor(song.duration()) <= Math.floor(song.currentTime())) {
//           song = loadSound(musicFolder + getrandomelement(allsongs));
//           song.load(() => {
//             song.play();
//             playanother();
//           });
//         }
//       };
//     }, 1000);
//   });
// }
