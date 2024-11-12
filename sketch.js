let squares = [];// stores the squares
let maxSize = 20;// max size of the squares
let colors;// color variable
let squareDensity = 100;// amount of squares
let driftSpeed = 0.5;// speed
let maxSpeed = 1.5;// max speed

function setup() {
  createCanvas(500, 500);
  rectMode(CENTER);      
  angleMode(DEGREES);    

  // Define color sets for different sections
  colors = [
    [color(255, 0, 0, 150), color(255, 50, 0, 150), color(255, 100, 0, 150), color(255, 30, 30, 150)],  // Red shades
    [color(255, 255, 0, 150), color(255, 215, 0, 150), color(255, 255, 50, 150), color(255, 230, 0, 150)], // Yellow shades
    [color(100, 100, 100, 150), color(130, 130, 130, 150), color(170, 170, 170, 150), color(200, 200, 200, 150)] // Gray shades
  ];

  
  createSquares();// makes the squares
}

function draw() {
  background(255);  

  
  for (let square of squares) { // displays and moves square
    square.move();
    square.checkCollisions(squares);
    square.display();
  }
}


function createSquares() {
  let sectionWidth = width / 3;

  
  for (let i = 0; i < 3; i++) { // loop for creation
    let xStart = i * sectionWidth;
    let xEnd = xStart + sectionWidth;
    let chosenColors = colors[i];

    
    for (let j = 0; j < squareDensity; j++) { // generates squares with random values
      let x = random(xStart, xEnd);
      let y = random(height);
      let color = random(chosenColors);                
      let size = random(10, maxSize);                   
      let rotation = random(-10, 10);                   
      let dx = random(-driftSpeed, driftSpeed);         
      let dy = random(-driftSpeed, driftSpeed);         

      
      squares.push(new Square(x, y, dx, dy, size, color, rotation)); // adds squares 
    }
  }
}

class Square { //square class
  constructor(x, y, dx, dy, size, color, rotation) {
    this.x = x;               
    this.y = y;               
    this.dx = dx;// speed              
    this.dy = dy;// speed             
    this.size = size;        
    this.color = color;      
    this.rotation = rotation; 
  }

  
  move() {
    this.x += this.dx;
    this.y += this.dy;

    
    if (this.x < 0 || this.x > width) this.dx *= -1; // reverse direction if hitting canvas edges
    if (this.y < 0 || this.y > height) this.dy *= -1; // reverse direction if hitting canvas edges

    this.limitSpeed();
  }

  
  checkCollisions(squares) {// checks for collision
    for (let other of squares) {
      if (other !== this) {
        let distance = dist(this.x, this.y, other.x, other.y);
        let minDist = (this.size + other.size) / 2;

        if (distance < minDist) {
          let angle = atan2(this.y - other.y, this.x - other.x); // calculates vectors and if distance is enough for collision
          let repulsion = 0.1; 
          this.dx += cos(angle) * repulsion;
          this.dy += sin(angle) * repulsion;
          other.dx -= cos(angle) * repulsion;
          other.dy -= sin(angle) * repulsion;
          this.limitSpeed();
          other.limitSpeed();
        }
      }
    }
  }

  limitSpeed() {
    let speed = sqrt(this.dx * this.dx + this.dy * this.dy);
    if (speed > maxSpeed) {
      let scale = maxSpeed / speed;
      this.dx *= scale;
      this.dy *= scale;
    }
  }

  display() {
    push();
    translate(this.x, this.y);           
    rotate(this.rotation);               
    noFill();                            
    stroke(this.color);                  
    strokeWeight(2);                     
    rect(0, 0, this.size, this.size);    
    pop();
  }
}
