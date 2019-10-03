var delay = 4000;
var cpu = new Image(130, 70);
var bb1 = new Image(100, 50);
var titleBox = new Image(450, 450);
var temp = 0;

// var billboard = [{
//     x: 70,
//     y: 240,
//     width: 60,
//     height: 30,
// },{
//     x: 20,
//     y: 230,
//     width: 90,
//     height: 60,
// },{
//     x: -80,
//     y: 230,
//     width: 90,
//     height: 60,
// }];

var track = [{
    cpx: 100,
    cpy: 480,
    x: 200,
}];

var LF1 = {
    canvas: null,
    ctx: null,
    canvas2: null,
    ctx2: null,
    colors: {
      sky: "#D4F5FE",
      ground: "#D5D8DC",
      groundDark: "#ABB2B9",
      road: "#606a7c",
      roadLine: "#FFF",
    },
    settings: {
      fps: 60,
      skySize: 250,
      ground: {
        size: 200,
        min: 4,
        max: 120
      },
      road: {
        min: 25,
        max: 700,
      }
    },
    state: {
        trigger: false,
        gameOver: false,
        gameSecTimer: 0,
        score: 1,
        frames: 0,
        time: 50,
        bgpos: 0,
        offset: 0,
        startDark: true,
        curve: 0,
        currentCurve: 0,
        turn: 1,
        speed: 27,
        xpos: 0,
        straight: null,
        signal: null,
        car: {
            maxSpeed: 35,
            friction: 0.4,
            acc: 0.85,
            deAcc: 0.5,
            xpos: 145,
            ypos: 370,
            spaceOnLeft: 0,
            spaceOnRight: 0,
      },
      keypress: {
          space: false,
          up: false,
          left: false,
          right: false,
          down: false
      },
    },
    storage: {
      bg: null
    }
};

LF1.canvas = document.getElementsByTagName('canvas')[0];
LF1.ctx = LF1.canvas.getContext('2d');
LF1.canvas2 = document.createElement('canvas');
LF1.canvas2.width = LF1.canvas.width;
LF1.canvas2.height = LF1.canvas.height;
LF1.ctx2 = LF1.canvas2.getContext('2d');
window.addEventListener("keydown", keyDown, false);
window.addEventListener("keyup", keyUp, false);

// startGame();
drawBg();
gameLoop();

// if(LF1.state.straight === false){
//     for(i = 0; i < 3; i++) {
//         temp++;
//         track[0].cpx -= i;
//         track[0].cpy -= i;
//         track[0].x += i;
//     }
// }if(LF1.state.straight === true){
//    for(i = 0; i < 3; i++) {
//        temp++;
//        track[0].cpx += i;
//        track[0].cpy += i;
//        track[0].x -= i;
//    }
// }

function gamePlaySignal() {
    var RandomNum;

}

function resetGame() {
    LF1.state.keypress.space = false;
    LF1.state.gameOver = false;
    LF1.state.time = 50;
    LF1.state.score = 0;
}

function drawScore(fSize,x,y) {
    LF1.ctx.font = `${fSize}px Arial`;
    LF1.ctx.fillStyle = "#000000";
    LF1.ctx.fillText("Score: "+LF1.state.score, x, y);
}

function drawTimer(fSize,x,y){
    LF1.ctx.font = `${fSize}px Arial`;
    LF1.ctx.fillStyle = "#000000";
    LF1.ctx.fillText("Time: "+LF1.state.time, x, y); 
}

function drawSignal(fSize,x,y){
    LF1.ctx.font = `${fSize}px Arial`;
    LF1.ctx.fillStyle = "#000000";
    LF1.ctx.fillText(+LF1.state.signal, x, y); 
}

function drawBillLeft(image, x, y, width, height,) {
    var travel = LF1.state.speed;
    x += LF1.state.car.spaceOnRight;
    // var xpos = (LF1.state.car.spaceOnRight) + LF1.state.speed *2;
    // var ypos = (LF1.settings.skySize - 20) + LF1.state.speed ;
    bb1.src = "./img/bb1.png";
    LF1.ctx.drawImage(image, x, y, width, height);
}

function drawCPU(image, y, width, height) {
    x = LF1.state.car.spaceOnRight + 200;
    y -= LF1.state.frames * 2.1;
    cpu.src = "./img/f1-cpu.png";
    LF1.ctx.drawImage(image, x, y, width, height);
}

function gameLoop(){
    calcMovement();
    
    // if(LF1.state.speed > 0) {
      // Moves the background left or right depending on keypress
       LF1.state.bgpos += (LF1.state.currentCurve * 0.04) * (LF1.state.speed * 0.2);
       LF1.state.bgpos = LF1.state.bgpos % LF1.canvas.width;
       //Puts image data on screen for background
       LF1.ctx.putImageData(LF1.storage.bg, LF1.state.bgpos, 5);
     //Ternary statement - , move background left. or move it right
       LF1.ctx.putImageData(LF1.storage.bg, LF1.state.bgpos > 0 ? LF1.state.bgpos - LF1.canvas.width : LF1.state.bgpos + LF1.canvas.width, 5);
     // }
     
     //state.offset moves dark green background and white lane dividers. This statement determines speed at which things alternate and give illusion of movement
     LF1.state.offset += LF1.state.speed * 0.05;
     //this IF compares current offset to ground.min value
     if(LF1.state.offset > LF1.settings.ground.min) {
       //Determines ground offset speed
       LF1.state.offset = LF1.settings.ground.min - LF1.state.offset;
       
       LF1.state.startDark = !LF1.state.startDark;
     }

     //Game loop starts here
     if (!LF1.state.keypress.space && !LF1.state.gameOver){
        LF1.ctx.drawImage(titleBox, 0, 0, 450, 450);
        titleBox.src = "./img/title-screen.png";
    }if(LF1.state.keypress.space && !LF1.state.gameOver){
        drawPseudo(LF1.ctx, LF1.state.offset, LF1.colors.ground, LF1.colors.groundDark, LF1.canvas.width);
        drawStraightL();
        drawStraightR();
        drawCar();
        drawScore(16,20,20);
        drawTimer(16,20,40);
        gameTimers();
        gamePlay();
    }if(!LF1.state.keypress.space && LF1.state.gameOver){
        LF1.ctx.drawImage(titleBox, 0, 0, 450, 450);
        drawScore(30,150,250);
    }if(LF1.state.keypress.space && LF1.state.gameOver){
        resetGame();
    }
     
     //Draws road markers
    //  drawRoad(LF1.settings.road.min * 1.30, LF1.settings.road.max * 1.30, 10, LF1.colors.roadLine);
     //Draws lane dividers that offset
    //  drawGround(LF1.ctx2, LF1.state.offset, LF1.colors.roadLine, LF1.colors.road, LF1.canvas.width);
     //Draws road
    //  drawRoad(LF1.settings.road.min, LF1.settings.road.max, 10, LF1.colors.road);
    //  drawRoad2(LF1.colors.road);
    //  Draws and Repeats lanes dividers
    //  drawRoad(3, 24, 0, LF1.ctx.createPattern(LF1.canvas2, 'repeat'));
     //Draws car. Game still works without function
     
     if (LF1.state.trigger === true){
        drawCPU(cpu,400,60,30);
     };
     
    //  drawBillLeft(bb1,70,240,60,30,)
    //  setTimeout(function(){drawBillLeft(bb1,70,240,60,30,)}, 1000)
    //  setTimeout(function(){drawBillLeft(bb1,20,230,90,60,)}, 2000);
    //  setTimeout(function(){drawBillLeft(bb1,-80,230,130,100,)}, 3000);
    //  drawBillLeft(bb1,70,240,60,30,);
    //  drawBillLeft(bb1,20,230,90,60,);
    //  drawBillLeft(bb1,-80,230,130,100,);
    // drawCPU(cpu,260,30,10);
    // drawCPU(cpu,300,60,30);
    // drawCPU(cpu,400,90,60);
    //  playGame();
     requestAnimationFrame(gameLoop);
}

function gamePlay() {
    if(LF1.state.time == 40){
        rightTurn();
    }if(LF1.state.time == 35){
        turnReset();
    }

 

    if(LF1.state.time == 29){
        LF1.state.trigger = true;
    }if(LF1.state.time == 28){
        LF1.state.trigger = false;
    }if(LF1.state.time == 27){
        LF1.state.trigger = true;
    }if(LF1.state.time == 26){
        LF1.state.trigger = false;
    } 

    if(LF1.state.time == 25){
        rightTurn();
    }if(LF1.state.time == 20){
        turnReset();
    }

    if(LF1.state.time == 15){
        rightTurn();
    }if(LF1.state.time == 10){
        turnReset();
    }if(LF1.state.time == 0){
        LF1.state.gameOver = true;
        LF1.state.keypress.space = false;
    }
}

function rightTurn () {
    for(i = 0; i < 3; i++) {
        temp++;
        track[0].cpx -= i;
        track[0].cpy -= i;
        track[0].x += i;
    }
}

function turnReset () {
    for(i = 0; i < 3; i++) {
        temp++;
        track[0].cpx += i;
        track[0].cpy += i;
        track[0].x -= i;
    }
}

function calcMovement() {
    var move = LF1.state.speed * 0.01
    var newCurve = 0;
    if(LF1.state.keypress.space){
        LF1.state.gameStart = true;
    }

    if(LF1.state.keypress.up) {
      LF1.state.speed += LF1.state.car.acc - (LF1.state.speed * 0.015);
    } else if (LF1.state.speed > 0) {
      LF1.state.speed -= LF1.state.car.friction;
    }
    
    if(LF1.state.keypress.down && LF1.state.speed > 0) {
      LF1.state.speed -= 1;
    }
    
    // Left and right
    LF1.state.xpos -= (LF1.state.currentCurve * LF1.state.speed) * 0.005;
    
    if(LF1.state.speed) {
      if(LF1.state.keypress.left) {
          LF1.state.car.spaceOnLeft--;
          LF1.state.car.spaceOnRight++;
        // LF1.state.xpos += (Math.abs(LF1.state.turn) + 7 + (LF1.state.speed > LF1.state.car.maxSpeed / 4 ? (LF1.state.car.maxSpeed - (LF1.state.speed / 2)) : LF1.state.speed)) * 0.2;
        // LF1.state.turn -= 1;
      }
    
      if(LF1.state.keypress.right) {
          LF1.state.car.spaceOnLeft++;
          LF1.state.car.spaceOnRight--;
        // LF1.state.xpos -= (Math.abs(LF1.state.turn) + 7 + (LF1.state.speed > LF1.state.car.maxSpeed / 4 ? (LF1.state.car.maxSpeed - (LF1.state.speed / 2)) : LF1.state.speed)) * 0.2;
        // LF1.state.turn += 1;
      }
      
      if(LF1.state.turn !== 0 && !LF1.state.keypress.left && !LF1.state.keypress.right) {
        LF1.state.turn += LF1.state.turn > 0 ? -0.25 : 0.25;
      }
    }
    
    LF1.state.turn = clamp(LF1.state.turn, -5, 5);
    LF1.state.speed = clamp(LF1.state.speed, 0, LF1.state.car.maxSpeed);
    
    // section
    LF1.state.section -= LF1.state.speed;
    
    // if(LF1.state.section < 0) {
    //   LF1.state.section = randomRange(1000, 9000);
      
    //   newCurve = randomRange(-50, 50);
      
    //   if(Math.abs(LF1.state.curve - newCurve) < 20) {
    //     newCurve = randomRange(-50, 50);
    //   }
      
    //   LF1.state.curve = newCurve;
    // }
    
    // if(LF1.state.currentCurve < LF1.state.curve && move < Math.abs(LF1.state.currentCurve - LF1.state.curve)) {
    //   LF1.state.currentCurve += move;
    // }else if(LF1.state.currentCurve > LF1.state.curve && move < Math.abs(LF1.state.currentCurve - LF1.state.curve)) {
    //   LF1.state.currentCurve -= move;
    // }
    
    if(Math.abs(LF1.state.xpos) > 550) {
      LF1.state.speed *= 0.96;
    }
    
    LF1.state.xpos = clamp(LF1.state.xpos, -650, 650);
}
 
function gameTimers() {
    LF1.state.frames++
    if(LF1.state.frames == 60) {
        LF1.state.gameSecTimer++;
        LF1.state.time--;
        LF1.state.frames = 0;
    }
}

function drawBg() {
    LF1.ctx.fillStyle = LF1.colors.sky;
    LF1.ctx.fillRect(0, 0, LF1.canvas.width, LF1.settings.skySize);
    LF1.storage.bg = LF1.ctx.getImageData(0, 0, LF1.canvas.width, LF1.canvas.height);
}

function norm(value, min, max) {
    return (value - min) / (max - min);
}

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

function randomRange(min, max) {
    return min + Math.random() * (max - min);
}

// function drawRoad(min, max, squishFactor, color) {
//     var basePos = LF1.canvas.width + LF1.state.xpos;
//     LF1.ctx.fillStyle = color;
//     LF1.ctx.beginPath();
//     LF1.ctx.moveTo(((basePos + min) / 2) - (LF1.state.currentCurve * 3), LF1.settings.skySize);
//     LF1.ctx.quadraticCurveTo((((basePos / 2) + min)) + (LF1.state.currentCurve / 3) + squishFactor, LF1.settings.skySize + 52, (basePos + max) / 2, LF1.canvas.height);
//     LF1.ctx.lineTo((basePos - max) / 2, LF1.canvas.height);
//     LF1.ctx.quadraticCurveTo((((basePos / 2) - min)) + (LF1.state.currentCurve / 3) - squishFactor, LF1.settings.skySize + 52, ((basePos - min) / 2) - (LF1.state.currentCurve * 3), LF1.settings.skySize);
//     LF1.ctx.closePath();
//     LF1.ctx.fill();
// }

function drawStraightL() {
    LF1.ctx.beginPath();
    LF1.ctx.moveTo(0, LF1.settings.skySize);
    LF1.ctx.lineTo(0, LF1.canvas.height);
    LF1.ctx.quadraticCurveTo(- track[0].cpx - LF1.state.car.spaceOnLeft, track[0].cpy, track[0].x - LF1.state.car.spaceOnLeft, LF1.settings.skySize)
    LF1.ctx.closePath();
    LF1.ctx.fillStyle = "#1E8449";
    LF1.ctx.fill();
    // LF1.ctx.moveTo(0, LF1.settings.skySize);
    // LF1.ctx.lineTo(0, LF1.canvas.length);
    // LF1.ctx.lineTo(200, LF1.canvas.length);
}

function drawStraightR() {
    LF1.ctx.beginPath();
    LF1.ctx.moveTo(LF1.canvas.width, LF1.settings.skySize);
    LF1.ctx.lineTo(LF1.canvas.width, LF1.canvas.height);
    LF1.ctx.quadraticCurveTo((LF1.canvas.width + track[0].cpx) + LF1.state.car.spaceOnRight, track[0].cpy, (track[0].x + 30) + LF1.state.car.spaceOnRight, LF1.settings.skySize)
    LF1.ctx.closePath();
    LF1.ctx.fillStyle = "#1E8449";
    LF1.ctx.fill();
    // LF1.ctx.moveTo(0, LF1.settings.skySize);
    // LF1.ctx.lineTo(0, LF1.canvas.length);
    // LF1.ctx.lineTo(200, LF1.canvas.length);
}

// function drawCurveL() {
//     LF1.ctx.beginPath();
//     LF1.ctx.moveTo(0, LF1.settings.skySize);
//     LF1.ctx.lineTo(0, LF1.canvas.height);
//     LF1.ctx.quadraticCurveTo(50 - LF1.state.car.spaceOnLeft, 400, 50 - LF1.state.car.spaceOnLeft, LF1.settings.skySize)
//     LF1.ctx.closePath();
//     LF1.ctx.fillStyle = "#000";
//     LF1.ctx.fill();
//     // LF1.ctx.moveTo(0, LF1.settings.skySize);
//     // LF1.ctx.lineTo(0, LF1.canvas.length);
//     // LF1.ctx.lineTo(200, LF1.canvas.length);
// }

// function drawCurveR() {
//     LF1.ctx.beginPath();
//     LF1.ctx.moveTo(LF1.canvas.width, LF1.settings.skySize);
//     LF1.ctx.lineTo(LF1.canvas.width, LF1.canvas.height);
//     LF1.ctx.quadraticCurveTo((LF1.canvas.width + 100) + LF1.state.car.spaceOnRight, 400, 150 + LF1.state.car.spaceOnRight, LF1.settings.skySize)
//     LF1.ctx.closePath();
//     LF1.ctx.fillStyle = "#000";
//     LF1.ctx.fill();
//     // LF1.ctx.moveTo(0, LF1.settings.skySize);
//     // LF1.ctx.lineTo(0, LF1.canvas.length);
//     // LF1.ctx.lineTo(200, LF1.canvas.length);
// }

function drawCar() {
    var carWidth = 160;
    var carHeight = 50;
    LF1.ctx.fillStyle = 'green';
    LF1.ctx.fillRect(LF1.state.car.xpos, LF1.state.car.ypos, carWidth, carHeight);
}

function drawPseudo(ctx, offset, lightColor, darkColor, width) {
    var pos = (LF1.settings.skySize - LF1.settings.ground.min) + offset;
    var stepSize = 1;
    var drawDark = LF1.state.startDark;
    var firstRow = true;
    //Light ground color is just one rectangle
    ctx.fillStyle = lightColor;
    ctx.fillRect(0, LF1.settings.skySize, width, LF1.settings.ground.size);
    //Dark ground color strips react to speed, acceleration and position to determine size
    ctx.fillStyle =  darkColor;
    //Alternating light and dark background strip loop relating to texture speed, acceleration, and position
    while(pos <= LF1.canvas.height) {
      stepSize = norm(pos, LF1.settings.skySize, LF1.canvas.height) * LF1.settings.ground.max;
      if(stepSize < LF1.settings.ground.min) {
        stepSize = LF1.settings.ground.min;
      }
      // Repeats darker ground color and steps it in size as it get closer to edge of canvas
      if(drawDark) {
        if(firstRow) {
          ctx.fillRect(0, LF1.settings.skySize, width, stepSize - (offset > LF1.settings.ground.min ? LF1.settings.ground.min : LF1.settings.ground.min - offset));
        } else {
          ctx.fillRect(0, pos < LF1.settings.skySize ? LF1.settings.skySize : pos, width, stepSize);
        }
      }
      firstRow = false;
      pos += stepSize;
      drawDark = !drawDark;
    }
}

function keyUp(e) {
    move(e, false);
}

function keyDown(e) {
    move(e, true);
}

function move(e, isKeyDown) {

    if(e.keyCode === 32){
        LF1.state.keypress.space = true;
    }

    if(e.keyCode >= 37 && e.keyCode <= 40) {
        e.preventDefault();
    }

    if(e.keyCode === 37) {
        LF1.state.keypress.left = isKeyDown;
    } 

    if(e.keyCode === 38) {
        LF1.state.keypress.up = isKeyDown;
    } 

    if(e.keyCode === 39) {
        LF1.state.keypress.right = isKeyDown;
    } 

    if(e.keyCode === 40) {
        LF1.state.keypress.down = isKeyDown;
    }
}



