/*
 * @name Schooling
 * @description Demonstration of Craig Reynolds' "Schooling" behavior.
 * See: http://www.red3d.com/cwr/
 * Rules: Cohesion, Separation, Alignment
 * (from <a href="http://natureofcode.com">natureofcode.com</a>).
 *  Drag mouse to add fish into the system.
 */


var school;
var mousePosition;
var centerPoint;
var logo;
var sprite;

var positionModifier;

var canvas;

var logoWeight = 0;
var fishWeight = 0;

p5.disableFriendlyErrors = true;

var firstRun = true;
var menuHeight = 80;

var dimLevel = 0;

function preload(){

    logo = loadImage("assets/halak.png");
    sprite = loadImage("assets/fish copy.png");

}

function setup() {
    canvasSetup();
    canvas.parent('fishery');
    //createP(displayDensity());

    positionModifier = createVector(0, 0);

    school = new School();

    for (var i = 0; i < 50; i++) {
        var b = new Fish(centerPoint.x - 30, centerPoint.y);
        school.addFish(b);
    }

    imageMode(CENTER);

}

function draw() {
    if(dimLevel <= 255){
        tint(255,dimLevel);
        dimLevel+=5;
    } else{
        noTint();
    }
    clear();
    mousePosition = createVector(mouseX, mouseY);
    positionModifier = createVector(-(mouseX - width / 2) / (width / 2), -(mouseY - height / 2) / (height / 2));
    school.run();
    for (var i = school.schoolOfFish.length-1; i >= 0; i--) {
        school.schoolOfFish[i].render();
    }
    image(logo, centerPoint.x + positionModifier.x * logoWeight, centerPoint.y + positionModifier.y * logoWeight, logo.width, logo.height);
    /*
  strokeWeight(1);
  stroke(200);
  line(0, height - 1, width, height - 1);
*/
}

///////////////////////////////////////////////SCHOOL

function School() {
    this.schoolOfFish = [];
}

School.prototype.run = function() {
    for (var i = 0; i < this.schoolOfFish.length; i++) {
        this.schoolOfFish[i].run(this.schoolOfFish);
    }
}

School.prototype.addFish = function(b) {
    this.schoolOfFish.push(b);
}


/////////////////////////////////////////////FISH

function Fish(x, y) {
    this.acceleration = createVector(0, 0);
    this.velocity = createVector(random(-1, 1), random(-1, 1));
    this.position = createVector(x, y);
    this.dim = 3.0;
    this.maxspeed = 3; // Maximum speed
    this.maxforce = 0.05; // Maximum steering force
    this.affinity = (Math.random(0.9, 1.1));
}

Fish.prototype.run = function(schoolOfFish) {
    this.school(schoolOfFish);
    this.update();
    this.borders();
}

Fish.prototype.applyForce = function(force) {
    // We could add mass here if we want A = F / M
    this.acceleration.add(force);
}

// We accumulate a new acceleration each time based on three rules
Fish.prototype.school = function(schoolOfFish) {
    var sep = this.separate(schoolOfFish); // Separation
    var ali = this.align(schoolOfFish); // Alignment
    var coh = this.cohesion(schoolOfFish); // Cohesion
    var cent = this.seek(centerPoint);
    var m = this.seek(mousePosition);
    // Arbitrarily weight these forces
    var d = dist(this.position.x, this.position.y, centerPoint.x, centerPoint.y);
    var multiplier = 0;
    var force = 1.5;
    if (d < 200 * this.affinity) {
        multiplier = -2;
    }
    if (d > 300 * this.affinity) {
        multiplier = 1;
    }

    var mDist = dist(this.position.x, this.position.y, mousePosition.x, mousePosition.y);
    var mForceMultiplier = constrain(mDist / (Math.max(50, width / 4)), 0, 1);
    mForceMultiplier = 1 - mForceMultiplier;
    m.mult(mForceMultiplier * -3);
    cent.mult(multiplier * force);
    sep.mult(3.2);
    ali.mult(1.5);
    coh.mult(2.5);
    // Add the force vectors to acceleration
    this.applyForce(m);
    this.applyForce(cent);
    this.applyForce(sep);
    this.applyForce(ali);
    this.applyForce(coh);
}

// Method to update location
Fish.prototype.update = function() {
    // Update velocity
    this.velocity.add(this.acceleration);
    // Limit speed
    this.velocity.limit(this.maxspeed);
    this.position.add(this.velocity);
    // Reset accelertion to 0 each cycle
    this.acceleration.mult(0);
}

// A method that calculates and applies a steering force towards a target
// STEER = DESIRED MINUS VELOCITY
Fish.prototype.seek = function(target) {
    var desired = p5.Vector.sub(target, this.position); // A vector pointing from the location to the target
    // Normalize desired and scale to maximum speed
    desired.normalize();
    desired.mult(this.maxspeed);
    // Steering = Desired minus Velocity
    var steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxforce); // Limit to maximum steering force
    return steer;
}

Fish.prototype.render = function() {
    // Draw a triangle rotated in the direction of velocity
    var theta = this.velocity.heading() + radians(90);
    push();
    translate(this.position.x, this.position.y);
    rotate(theta);
    image(sprite, 0, 0);
    pop();
}

// Wraparound
Fish.prototype.borders = function() {
    if (this.position.x < -this.dim) this.position.x = width + this.dim;
    if (this.position.y < -this.dim) this.position.y = height + this.dim;
    if (this.position.x > width + this.dim) this.position.x = -this.dim;
    if (this.position.y > height + this.dim) this.position.y = -this.dim;
}

Fish.prototype.separate = function(schoolOfFish) {
    var desiredseparation = 25.0;
    var steer = createVector(0, 0);
    var count = 0;

    for (var i = 0; i < schoolOfFish.length; i++) {
        var d = p5.Vector.dist(this.position, schoolOfFish[i].position);
        if ((d > 0) && (d < desiredseparation)) {
            var diff = p5.Vector.sub(this.position, schoolOfFish[i].position);
            diff.normalize();
            diff.div(d); // Weight by distance
            steer.add(diff);
            count++; // Keep track of how many
        }
    }
    // Average -- divide by how many
    if (count > 0) {
        steer.div(count);
    }

    // As long as the vector is greater than 0
    if (steer.mag() > 0) {
        // Implement Reynolds: Steering = Desired - Velocity
        steer.normalize();
        steer.mult(this.maxspeed);
        steer.sub(this.velocity);
        steer.limit(this.maxforce);
    }
    return steer;
}

// Alignment
// For every nearby boid in the system, calculate the average velocity
Fish.prototype.align = function(schoolOfFish) {
    var neighbordist = 50;
    var sum = createVector(0, 0);
    var count = 0;
    for (var i = 0; i < schoolOfFish.length; i++) {
        var d = p5.Vector.dist(this.position, schoolOfFish[i].position);
        if ((d > 0) && (d < neighbordist)) {
            sum.add(schoolOfFish[i].velocity);
            count++;
        }
    }
    if (count > 0) {
        sum.div(count);
        sum.normalize();
        sum.mult(this.maxspeed);
        var steer = p5.Vector.sub(sum, this.velocity);
        steer.limit(this.maxforce);
        return steer;
    } else {
        return createVector(0, 0);
    }
}

// Cohesion
// For the average location (i.e. center) of all nearby fish, calculate steering vector towards that location
Fish.prototype.cohesion = function(schoolOfFish) {
    var neighbordist = 50;
    var sum = createVector(0, 0); // Start with empty vector to accumulate all locations
    var count = 0;
    for (var i = 0; i < schoolOfFish.length; i++) {
        var d = p5.Vector.dist(this.position, schoolOfFish[i].position);
        if ((d > 0) && (d < neighbordist)) {
            sum.add(schoolOfFish[i].position); // Add location
            count++;
        }
    }
    if (count > 0) {
        sum.div(count);
        return this.seek(sum); // Steer towards the location
    } else {
        return createVector(0, 0);
    }
}

function windowResized() {
    canvasSetup();
}

function canvasSetup() {
    if (firstRun) {
        firstRun = false;
        if (window.innerWidth > window.innerHeight) {
            canvas = createCanvas(window.innerWidth, window.innerHeight-menuHeight);
        } else {
            canvas = createCanvas(window.innerWidth, window.innerWidth-menuHeight);
        }
    } else {
        if (window.innerWidth > window.innerHeight) {
            canvas = resizeCanvas(window.innerWidth, window.innerHeight-menuHeight);
        } else {
            canvas = resizeCanvas(window.innerWidth, window.innerWidth-menuHeight);
        }
    }
    centerPoint = createVector(width / 2, height / 2);
}