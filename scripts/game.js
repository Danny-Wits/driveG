const track = document.getElementById("track");
const inputL = document.getElementById("inputL");
const inputR = document.getElementById("inputR");
const ctx = track.getContext("2d");

document.addEventListener("keydown", eventDHandle);
document.addEventListener("keyup", eventUHandle);

let i = -20;
const FPS = 60;

let acceleratorPressed = false;
let brakePressed = false;
let clutchPressed = false;

//car
class Car {
  constructor(engine) {
    this.start = true;
    this.engine = engine;
    this.x = 100;
    this.y = 100;
    this.vx = 0;
    this.vy = 0;
  }
  getVelocity() {
    this.vy = this.engine.getVelocity(this.vy);
  }
  draw() {
    this.getVelocity();
    inputL.innerText += "\nGEAR : " + this.engine.gearBox.gear;
    if (clutchPressed) inputL.innerText += "\nCLUTCH";
    inputL.innerText += "\nRPM  :" + this.engine.RPM.toFixed(2);
    if (this.start) {
      inputL.innerText += "\nSTARTED\n";
      this.engine.accelerate();
    }
    this.engine.brake();
    if (!clutchPressed) {
      this.engine.traction(1);
    } else {
      this.engine.traction(2);
    }
    if (brakePressed && this.vy > 0) {
      this.vy--;
    }
    if (this.vy > 0.2) {
      this.vy -= 0.2;
    }
    if (this.vy < 0) {
      this.vy = 0;
    }
    ctx.fillStyle = this.start ? "green" : "red";
    ctx.fillRect(this.x, this.y, 30, 20);
  }
}

class Engine {
  constructor(gearBox) {
    this.gearBox = gearBox;
    this.RPM = 0;
  }
  accelerate() {
    if (car.start && acceleratorPressed && this.RPM <= 100) {
      this.RPM++;
      inputL.innerText += "\n ACCELERATOR ";
    }
    if (this.RPM < 0) {
      this.RPM = 0;
    }
  }
  traction(x) {
    if (this.RPM > 0) {
      this.RPM -= 0.2 * x;
    }
  }
  brake() {
    if (brakePressed && this.RPM >= 0) {
      this.RPM--;
      inputL.innerText += "\n BRAKE ";
    }
  }

  getVelocity(vy) {
    return this.gearBox.getVelocity(this.RPM, vy);
  }
}

class GearBox {
  constructor() {
    this.gear = 1;
  }
  gearUp() {
    if (this.gear < 6 && clutchPressed) this.gear++;
    console.log(this.gear, clutchPressed);
  }
  gearDown() {
    if (this.gear > 1 && clutchPressed) this.gear--;
    console.log(this.gear);
  }
  getVelocity(RPM, velocity) {
    let opt = this.gear * (RPM / 10)+this.gear * 5;
    let min = this.gear * 10 - RPM / 5;
    inputL.innerText += "\n" + min.toFixed(2) + " | " + opt.toFixed(2);
    if (clutchPressed) return velocity;
    if (velocity < min) {
      car.start = false;
      return velocity;
    }
    if (velocity > opt + this.gear * 5) return velocity;
    if (velocity > opt) velocity += RPM / 400;
    if (velocity < opt) velocity += this.gear * (RPM / 400);
    return velocity;
  }
}
const gearBox = new GearBox();
const engine = new Engine(gearBox);
const car = new Car(engine);

function drawRoad() {
  if (i > track.height / 2 - 20) i = -20;
  i += car.vy / 7;
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, track.width, track.height);

  //strips code
  ctx.fillStyle = "white";
  ctx.fillRect(track.width / 2, i, 10, 20);
  ctx.fillStyle = "white";
  ctx.fillRect(track.width / 2, i + track.height / 2, 10, 20);
  ctx.fillStyle = "white";
  ctx.fillRect(track.width / 2, i + track.height, 10, 20);
}

function render() {
  clearCanvas();
  inputL.innerText = "";
  drawRoad();
  inputL.innerText += `\nSPEED : ${car.vy.toFixed(2)}`;
  car.draw();
  setTimeout(render, 1000 / FPS);
}
render();
//Input Handling
function eventDHandle(event) {
  switch (event.key) {
    case " ":
      car.start = !car.start;
      break;
    case "w":
      acceleratorPressed = true;
      break;
    case "W":
      acceleratorPressed = true;
      break;
    case "s":
      brakePressed = true;
      break;
    case "S":
      brakePressed = true;
      break;
    case "Q":
      gearBox.gearUp();
      break;
    case "E":
      gearBox.gearDown();
      break;
    case "Shift":
      clutchPressed = true;
      break;
  }
}
function eventUHandle(event) {
  switch (event.key) {
    case "w":
      acceleratorPressed = false;
      break;
    case "s":
      brakePressed = false;
      break;
    case "W":
      acceleratorPressed = false;
      break;
    case "S":
      brakePressed = false;
      break;
    case "Shift":
      clutchPressed = false;
      break;
  }
}

// canvas functions
function clearCanvas() {
  ctx.clearRect(0, 0, track.width, track.height);
}
