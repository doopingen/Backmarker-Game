//Game Objects literals
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
    race: {
        turnRoll: 1,
        signal: true,
    },
    state: {
        input: true,
        trigger: false,
        gameOver: false,
        gameSecTimer: 0,
        score: 0,
        frames: 0,
        time: 50,
        bgpos: 0,
        offset: 0,
        startDark: true,
        curve: 0,
        currentCurve: 0,
        speed: 27,
        xpos: 0,
        car: {
            maxSpeed: 35,
            friction: 0.4,
            acc: 0.85,
            deAcc: 0.5,
            xpos: 175,
            ypos: 370,
            spaceOnLeft: 0,
            spaceOnRight: 0,
            normie: true,
            turn: false,
            crash: false,
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

//DOM events
LF1.canvas = document.getElementsByTagName('canvas')[0];
LF1.ctx = LF1.canvas.getContext('2d');
LF1.canvas2 = document.createElement('canvas');
LF1.canvas2.width = LF1.canvas.width;
LF1.canvas2.height = LF1.canvas.height;
LF1.ctx2 = LF1.canvas2.getContext('2d');
window.addEventListener("keydown", keyDown, false);
window.addEventListener("keyup", keyUp, false);

//Global Variables and Image attributes
var delay = 4000;
var cpu = new Image(130, 70);
var bb1 = new Image(100, 50);
var titleBox = new Image(450, 450);
var endGame = new Image(450, 450);
var temp = 0;

//Track Details
var track = [{
    cpx: 100,
    cpy: 480,
    x: 200,
}];

//Initialize game. This is where the magic happens
drawBg();
gameLoop();

/* ---------------------- Game Functions and Game State logic Start -------------------------- */

//Generates integer for left/right decision making
function getRandomInt(max) {
    LF1.race.turnRoll =  Math.floor(Math.random() * Math.floor(max));
}

//Ternary used for oncoming car decision and on-screen text
function turnSignal() {
    LF1.race.turnRoll === 1 && LF1.race.signal ? drawSignal("Go Right",50,120,160,"red") :  drawSignal("Go Left",50,120,160,"red");
}

//Shoots CPU car forward after player has cleared themselves
function incCPU(){
    if(LF1.race.turnRoll === 0 && LF1.state.car.spaceOnLeft < -100){
        drawCPU(cpu,400,60,30);
        drawSignal("Clear",50,150,160,"green");
    }if(LF1.race.turnRoll === 1 && LF1.state.car.spaceOnRight > -100){
        LF1.state.car.crash = true;
        LF1.state.input = false;
        if(!LF1.state.input && LF1.state.frames === 59){
            LF1.state.gameOver = true;
            LF1.state.keypress.space = false;
            LF1.state.input = true;
        }
    }if(LF1.race.turnRoll === 1 && LF1.state.car.spaceOnRight < -80){
        drawCPU(cpu,400,60,30);
        drawSignal("Clear",50,150,160,"green");
    }if(LF1.race.turnRoll === 1 && LF1.state.car.spaceOnRight > -80){
        LF1.state.car.crash = true;
        LF1.state.input = false;
        if(!LF1.state.input && LF1.state.frames === 59){
            LF1.state.gameOver = true;
            LF1.state.keypress.space = false;
            LF1.state.input = true;
        }
    }
}

//Resets game
function resetGame() {
    LF1.state.keypress.space = false;
    LF1.state.gameOver = false;
    LF1.state.time = 50;
    LF1.state.score = 0;
    LF1.state.car.crash = false;
    LF1.state.gameSecTimer = 0;
}

//Places score on-screen
function drawScore(fSize,x,y) {
    LF1.ctx.font = `${fSize}px ArcadeClassic`;
    LF1.ctx.fillStyle = "#000000";
    LF1.ctx.fillText("Score: "+LF1.state.score, x, y);
}

//Places time countdown on screen
function drawTimer(fSize,x,y){
    LF1.ctx.font = `${fSize}px ArcadeClassic`;
    LF1.ctx.fillStyle = "#000000";
    LF1.ctx.fillText("Time: "+LF1.state.time, x, y); 
}

//Callback function for turnSignal and incCPU
function drawSignal(text,fSize,x,y,color){
    LF1.ctx.font = `${fSize}px ArcadeClassic`;
    LF1.ctx.fillStyle = color;
    LF1.ctx.fillText(text, x, y); 
}

//Places Billboard on-screen at multiple sizes
function drawBillLeft(image, x, y, width, height,) {
    x += LF1.state.car.spaceOnRight;
    bb1.src = "./img/bb1.png";
    LF1.ctx.drawImage(image, x, y, width, height);
}

//Places Player1 car on-screen
function player1() {
    var carWidth = 90;
    var carHeight = 40;
    var norm = new Image(130, 70);
    var turn = new Image(130, 70);
    var crash = new Image(130, 70);
    norm.src = "./img/car.png";
    turn.src = "./img/turn.png";
    crash.src = "./img/crash.png";
    LF1.state.score = LF1.state.gameSecTimer * 3;
    if(LF1.state.car.normie && !LF1.state.car.turn && !LF1.state.car.crash){
        LF1.ctx.drawImage(norm, LF1.state.car.xpos, LF1.state.car.ypos, carWidth, carHeight);
    }if(LF1.state.car.normie && LF1.state.car.turn && !LF1.state.car.crash){
        LF1.ctx.drawImage(turn, LF1.state.car.xpos, LF1.state.car.ypos, carWidth, carHeight);
    }if(LF1.state.car.normie && !LF1.state.car.turn && LF1.state.car.crash){
        LF1.ctx.drawImage(crash, LF1.state.car.xpos, LF1.state.car.ypos, carWidth, carHeight);
    }
}

//Callback for incCPU
function drawCPU(image, y, width, height) {
    x = LF1.state.car.spaceOnRight + 200;
    y -= LF1.state.frames * 2.1;
    cpu.src = "./img/f1-cpu.png";
    LF1.ctx.drawImage(image, x, y, width, height);
}

//Gameloop!!
function gameLoop(){

    // Moves the background left or right depending on keypress. Clay note: Having problems with performance.
    LF1.state.bgpos += (LF1.state.currentCurve * 0.04) * (LF1.state.speed * 0.2);
    LF1.state.bgpos = LF1.state.bgpos % LF1.canvas.width;

    //Puts image data on screen for background
    LF1.ctx.putImageData(LF1.storage.bg, LF1.state.bgpos, 5);

    //Ternary statement - , move background left. or move it right
    LF1.ctx.putImageData(LF1.storage.bg, LF1.state.bgpos > 0 ? LF1.state.bgpos - LF1.canvas.width : LF1.state.bgpos + LF1.canvas.width, 5);
    //state.offset moves dark green background and white lane dividers. This statement determines speed at which things alternate and give illusion of movement
    LF1.state.offset += LF1.state.speed * 0.05;
    //this IF compares current offset to ground.min value
    if(LF1.state.offset > LF1.settings.ground.min) {
        //Determines ground offset speed
        LF1.state.offset = LF1.settings.ground.min - LF1.state.offset;
        LF1.state.startDark = !LF1.state.startDark;
    }

    /* ------------------------- Game state logic starts here ------------------------------- */

    if (!LF1.state.keypress.space && !LF1.state.gameOver && LF1.state.input){
        LF1.ctx.drawImage(titleBox, 0, 0, 450, 450);
        titleBox.src = "./img/title-screen.png";
        calcMovement();
    }if(LF1.state.keypress.space && !LF1.state.gameOver && LF1.state.input){
        calcMovement();
        drawPseudo(LF1.ctx, LF1.state.offset, LF1.colors.ground, LF1.colors.groundDark, LF1.canvas.width);
        drawStraightL();
        drawStraightR();
        player1();
        drawScore(30,20,70);
        drawTimer(30,20,100);
        gameTimers();
    }if(LF1.state.keypress.space && !LF1.state.gameOver && !LF1.state.input){
        drawPseudo(LF1.ctx, LF1.state.offset, LF1.colors.ground, LF1.colors.groundDark, LF1.canvas.width);
        drawStraightL();
        drawStraightR();
        player1();
        drawScore(30,20,70);
        drawTimer(30,20,100);
        gameTimers();
    }if(!LF1.state.keypress.space && LF1.state.gameOver){
        LF1.ctx.drawImage(endGame, 0, 0, 450, 450);
        endGame.src = "./img/game-over-screen.png"
        drawScore(30,150,250);
    }if(LF1.state.keypress.space && LF1.state.gameOver){
        resetGame();
    }if (LF1.state.trigger === true){
        drawCPU(cpu,400,60,30);
    }

    switch (LF1.state.time) {
        case 48:
            drawBillLeft(bb1,70,240,60,30,);
            break;   
        case 47:
            drawBillLeft(bb1,20,230,90,60,);
            break;               
        case 46:
            drawBillLeft(bb1,-80,230,130,100,);
            LF1.race.turnRoll = 0;
            break; 
        case 45:
            turnSignal(); 
            break;  
        case 44:
            drawBillLeft(bb1,70,240,60,30,);
            break;   
        case 43:
            incCPU();
            drawBillLeft(bb1,20,230,90,60,);
            break;               
        case 42:
            drawBillLeft(bb1,-80,230,130,100,);
            break; 
        case 40:
            rightTurn();
            break;
        case 39:
            LF1.state.car.turn = true;
            break;    
        case 35:
            turnReset();
            LF1.state.car.turn = false;
            LF1.race.turnRoll = 0;
            break;
        case 30:
            turnSignal();
            break;
        case 29:
            break;
        case 28:
            incCPU();
            break;
        case 27:
            drawBillLeft(bb1,20,230,90,60,);
            LF1.race.turnRoll = 1;
            break;            
        case 26:
            drawBillLeft(bb1,-80,230,130,100,);
            turnSignal();
            break;
        case 25:
            break;                
        case 24:
            incCPU();
            break;
        case 23:
            break;                  
        case 22:
            rightTurn();
            break; 
        case 21:
            LF1.state.car.turn = true;
            break;                 
        case 18:
            turnReset();
            break;  
        case 17:
            LF1.state.car.turn = false;
            LF1.race.turnRoll = 0;
            break;                
        case 18:
            drawBillLeft(bb1,70,240,60,30,);
            turnSignal();
            break;   
        case 17:
            drawBillLeft(bb1,20,230,90,60,);
            break;               
        case 16:
            drawBillLeft(bb1,-80,230,130,100,);
            incCPU();
            break; 
        case 15:
            LF1.race.turnRoll = 0;
            break;                 
        case 14:
            turnSignal();
            drawBillLeft(bb1,70,240,60,30,);
            break;
        case 13:
            drawBillLeft(bb1,20,230,90,60,);
            break;                  
        case 12:
            incCPU();
            drawBillLeft(bb1,-80,230,130,100,);
            break;
        case 11:
            LF1.race.turnRoll = 1;
            break;                  
        case 10:
            turnSignal()
            drawBillLeft(bb1,70,240,60,30,);
            break;
        case 9:
            drawBillLeft(bb1,20,230,90,60,);
            break;                  
        case 8:
            incCPU();
            drawBillLeft(bb1,-80,230,130,100,);
            break;
        case 7:
            LF1.race.turnRoll = 0;
            break;                  
        case 6:
            turnSignal();
            drawBillLeft(bb1,70,240,60,30,); 
            break; 
        case 5:
            drawBillLeft(bb1,20,230,90,60,);
            break;                
        case 4:
            incCPU();
            drawBillLeft(bb1,-80,230,130,100,); 
            break;
        case 3:
            break;                  
        case 2:
            break; 
        case 1:
            break;    
        case 0:
            LF1.state.gameOver = true;
            LF1.state.keypress.space = false;         
    }
     
     requestAnimationFrame(gameLoop);
}

/* ------------------------------- Game state logic ends ------------------------------------ */

/* ------------------------------- Road definition logic -------------------------------- */

function drawStraightL() {
    LF1.ctx.beginPath();
    LF1.ctx.moveTo(0, LF1.settings.skySize);
    LF1.ctx.lineTo(0, LF1.canvas.height);
    LF1.ctx.quadraticCurveTo(- track[0].cpx - LF1.state.car.spaceOnLeft, track[0].cpy, track[0].x - LF1.state.car.spaceOnLeft, LF1.settings.skySize)
    LF1.ctx.closePath();
    LF1.ctx.fillStyle = "#1E8449";
    LF1.ctx.fill();
}

function drawStraightR() {
    LF1.ctx.beginPath();
    LF1.ctx.moveTo(LF1.canvas.width, LF1.settings.skySize);
    LF1.ctx.lineTo(LF1.canvas.width, LF1.canvas.height);
    LF1.ctx.quadraticCurveTo((LF1.canvas.width + track[0].cpx) + LF1.state.car.spaceOnRight, track[0].cpy, (track[0].x + 30) + LF1.state.car.spaceOnRight, LF1.settings.skySize)
    LF1.ctx.closePath();
    LF1.ctx.fillStyle = "#1E8449";
    LF1.ctx.fill();
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

/* ------------------------------- Road definition logic end -------------------------------- */

/* ------------------------------- Player 1 movement and Pseudo3d stepping -------------------------------- */

function calcMovement() {
    var move = LF1.state.speed * 0.01
    // var newCurve = 0;
    
    //Player 1 start game
    if(LF1.state.keypress.space){
        LF1.state.gameStart = true;
    }

    // Player 1 Key press up
    if(LF1.state.keypress.up) {
      LF1.state.speed += LF1.state.car.acc - (LF1.state.speed * 0.015);
    } else if (LF1.state.speed > 0) {
      LF1.state.speed -= LF1.state.car.friction;
    }
    
    //Create brake effect for player1
    if(LF1.state.keypress.down && LF1.state.speed > 0) {
      LF1.state.speed -= 1;
    }
    
    // Left, right movement illusion for Player 1
    LF1.state.xpos -= (LF1.state.currentCurve * LF1.state.speed) * 0.005;
    
    //Player 1 left and right
    if(LF1.state.speed) {
      if(LF1.state.keypress.left) {
          LF1.state.car.spaceOnLeft-=4;
          LF1.state.car.spaceOnRight+=4;
      }
    
      if(LF1.state.keypress.right) {
          LF1.state.car.spaceOnLeft+=4;
          LF1.state.car.spaceOnRight-=4;
      }
      
    }
    
    // Disabled clamp code
    // LF1.state.turn = clamp(LF1.state.turn, -5, 5);
    // LF1.state.speed = clamp(LF1.state.speed, 0, LF1.state.car.maxSpeed);

    // Define section
    // LF1.state.section -= LF1.state.speed;
    
    //Logic to smooth out stepping animation
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

/* ---------------------- Functions that relate to player 1 control ------------------------- */

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



