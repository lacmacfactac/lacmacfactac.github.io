var colorTable = [];
var pixelTable = [];

var curs = 0;
var limit = 1;
var stripLength = 8;

var currentTime = 0;
var prevTime = 0;
var interval = 100;
var colorDataRaw;
var pixelDataRaw;
var unit;
var prt;
var mode = 0; // 0: once, 1: hold, 2: toggle 
var enabled = false;
var debug = false;
var fuse = false;
var verticalOffset = 0;

var realFps = 0;
function setup() {
    noCursor();
    createCanvas(displayWidth, displayHeight+verticalOffset);
    canvasMagic();
    unit = displayHeight/8;
    if(displayWidth > displayHeight){
        prt = true; 
    } else {
        prt = false;
    }
    background(127);

    var urlP = getURLParams();

    if(urlP.colors !==null){
        colorDataRaw = split(urlP.colors,",");
        var fullCol = 0;
        for(var i = 0; i < colorDataRaw.length;){
            colorTable[fullCol] = [];
            for(var c = 0; c < 3; c++){
                colorTable[fullCol][c] = int(colorDataRaw[i]);
                i++;
            }
            fullCol++;
        }
    } else {
        colorTable[0] = [255,255,255];
    }

    if(urlP.pixels !== null){
        pixelDataRaw = split(urlP.pixels,",");
        var slit = 0;
        for(var i = 0; i < pixelDataRaw.length;){
            pixelTable[slit] = [];
            for(var p = 0; p < stripLength; p++){
                pixelTable[slit][p] = int(pixelDataRaw[i]);
                i++;
            }
            slit++;
        }
        limit = slit;
    } else {
        pixelTable[0] = [0,0,0,0,0,0,0,0];

    }

    if(urlP.mode !== null){
        var modeHolder = urlP.mode;
        if(modeHolder == "once" || modeHolder == "0"){
            mode = 0;
        } else if(modeHolder == "hold" || modeHolder == "1"){
            mode = 1;
        } else if(modeHolder == "toggle" || modeHolder == "2"){
            mode = 2;
        } else {
            mode = 2;
        }
    } else {
        mode = 2;
    }

    if(urlP.fps !== null){
        frameRate(int(urlP.fps));
    }

    if(urlP.debug == 1 || urlP.debug == "true"){
        debug = true;
    }
    ellipseMode(CENTER);
    background(0);
}

function draw() {
    background(0);
    if(enabled){
    for(var i = 0; i < 8; i++){
        var colorHolder = colorTable[pixelTable[curs][i]];
        fill(colorHolder[0],colorHolder[1],colorHolder[2]);
        ellipse(width/2,verticalOffset+(i+0.5)*unit,unit*.8,unit*.8);
    }
    curs++;
    if(curs >= limit){
        curs = 0;
        switch(mode){
            case 0:
                enabled = false;
                break;
            case 1:
                break;
                
            case 2:
                break;
                
            default:
                break;
                
        }
    }

}
    if(debug){
        fill(255);
    prevTime = currentTime;
    currentTime = millis();
    realFps = 1000.0/(currentTime-prevTime);
        var txt ="~" + String(int(realFps))+" fps\n" +
            "Lines: " + String(curs+1) +"/"+String(limit) + "\n" +
            "Colors: " + String(colorTable.length) + "\n" +
            "Mode: " + (mode == 0 ? "play once on touch" : (mode == 1 ? "play while held" : "play until touched again"))+ " (" +String(mode) + ")" +"\n"+
        "Touched: " + (mouseIsPressed ? "yes" : "no");
        text(txt,100,20);
    }
}

function displayResized() {
    canvasMagic();
    if(displayWidth > displayHeight){
        prt = true; 
    } else {
        prt = false;
    }
}

function canvasMagic(){
    
    resizeCanvas(max(displayWidth, windowWidth), max(displayHeight,windowHeight));
    unit = displayHeight/8;
    
}


function mousePressed(){
    if(fuse){
    curs = 0;
    switch(mode){
        case 0:
        enabled = true;
        break;

        case 1:
        enabled = true;
        break;

        case 2:
        enabled=!enabled;
        break;

        default:
        break;

    }
    } else {
    fullscreen(true);
        fuse = true;
    }
}

function mouseReleased(){

    switch(mode){
        case 0:
        break;

        case 1:
        enabled = false;
        break;

        case 2:
        break;

        default:
        break;

    }
}
