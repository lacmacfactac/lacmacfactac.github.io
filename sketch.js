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
var parentDiv;

var fishLimit = 100;

var isMobile = false; //initiate as false
var trueFrame = 0;
var prevTime = 0;
var currentTime = 0;
var timeStep = 1.0;
// device detection

function preload(){

    logo = loadImage("assets/halak.png");
    sprite = loadImage("assets/fish copy.png");

}

function setup() {
    
    
    if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
    || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) { 
    isMobile = true;
}

    if(isMobile){
        fishLimit = 30;
    }
    
    /*
    canvas = createCanvas(100,100);
    firstRun = false;
    */
    canvasSetup();
    canvas.parent('#fishSketch');
    //canvas.parent('#fishery');
    //parentDiv = select("#fishery");
    //canvas = resizeCanvas(parentDiv.width, parentDiv.height);
    //createP(displayDensity());

    positionModifier = createVector(0, 0);

    school = new School();

    for (var i = 0; i < fishLimit; i++) {
        var b = new Fish(centerPoint.x, centerPoint.y);
        school.addFish(b);
    }
    
    imageMode(CENTER);

}

function draw() {
    prevTime = currentTime;
currentTime = millis();
    trueFrame = currentTime-prevTime;
    /*
    if(dimLevel <= 255){
        tint(255,dimLevel);
        dimLevel+=5;
    } else{
        noTint();
    }
    */
    clear();
    mousePosition = createVector(mouseX, mouseY);
    positionModifier = createVector(-(mouseX - width / 2) / (width / 2), -(mouseY - height / 2) / (height / 2));
    school.run();
    var desiredFrame = 1000/frameRate();
    timeStep = trueFrame/desiredFrame;
    for (var i = Math.min(school.schoolOfFish.length, fishLimit)-1; i >= 0; i--) {
        school.schoolOfFish[i].render();
    }

    //image(logo, centerPoint.x + positionModifier.x * logoWeight, centerPoint.y + positionModifier.y * logoWeight, logo.width, logo.height);
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
    for (var i = 0; i < Math.min(this.schoolOfFish.length, fishLimit); i++) {
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
    this.maxspeed = 3;
    this.maxforce = 0.05;
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



Fish.prototype.school = function(schoolOfFish) {
    var sep = this.separate(schoolOfFish); // Separate
    var ali = this.align(schoolOfFish); // Align
    var coh = this.cohesion(schoolOfFish); // Cohere
    var cent = this.seek(centerPoint); // Attraction to center
    var m = this.seek(mousePosition); // Attraction to mouse


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

    this.applyForce(m);
    this.applyForce(cent);
    this.applyForce(sep);
    this.applyForce(ali);
    this.applyForce(coh);
}

Fish.prototype.update = function() {
    // Update velocity
    this.velocity.add(this.acceleration);
    // Limit speed
    this.velocity.limit(this.maxspeed);
    var vel = this.velocity.copy();
    vel.mult(timeStep);
    this.position.add(vel);
    // Reset accelertion to 0 each cycle
    this.acceleration.mult(0);
}

Fish.prototype.seek = function(target) {
    var desired = p5.Vector.sub(target, this.position);
    desired.normalize();
    desired.mult(this.maxspeed);
    var steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxforce);
    return steer;
}

Fish.prototype.render = function() {
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

    for (var i = 0; i < Math.min(schoolOfFish.length, fishLimit); i++) {
        var d = p5.Vector.dist(this.position, schoolOfFish[i].position);
        if ((d > 0) && (d < desiredseparation)) {
            var diff = p5.Vector.sub(this.position, schoolOfFish[i].position);
            diff.normalize();
            diff.div(d);
            steer.add(diff);
            count++;
        }
    }

    if (count > 0) {
        steer.div(count);
    }

    if (steer.mag() > 0) {
        steer.normalize();
        steer.mult(this.maxspeed);
        steer.sub(this.velocity);
        steer.limit(this.maxforce);
    }
    return steer;
}


Fish.prototype.align = function(schoolOfFish) {
    var neighbordist = 50;
    var sum = createVector(0, 0);
    var count = 0;
    for (var i = 0; i < Math.min(schoolOfFish.length, fishLimit); i++) {
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



Fish.prototype.cohesion = function(schoolOfFish) {
    var neighbordist = 50;
    var sum = createVector(0, 0);
    var count = 0;
    for (var i = 0; i < Math.min(schoolOfFish.length, fishLimit); i++) {
        var d = p5.Vector.dist(this.position, schoolOfFish[i].position);
        if ((d > 0) && (d < neighbordist)) {
            sum.add(schoolOfFish[i].position);
            count++;
        }
    }
    if (count > 0) {
        sum.div(count);
        return this.seek(sum);
    } else {
        return createVector(0, 0);
    }
}

function windowResized() {
    canvasSetup();
}

function canvasSetup() {
    /*
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
    */
    if(firstRun){
        firstRun = false;
        canvas = createCanvas(window.innerWidth, window.innerHeight-60);
    } else {
        canvas = resizeCanvas(window.innerWidth, window.innerHeight-60);
    }
    centerPoint = createVector(width / 2, height / 2);
}