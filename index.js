const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
context.fillStyle = '#FFFFFF';
context.fillRect(0,0,canvas.width,canvas.height);
context.fillStyle = 'black';
context.fillText("Press the 'up arrow' / letter 'p' to start",canvas.width/2 - 100 ,canvas.height/2);
var pause = true;
var finishedGame = false;

var images = {};
images.player = new Image();
images.player.src = './sprites/player/player.png';
images.jet = new Image();
images.jet.src = './sprites/jet.png';

// DEFINO CLASES PARA LOS OBSTACULOS
class Obstacles{
    constructor(){
        this.width = 75;
        this.height = 65;
        this.sprite = images.jet;
        this.y = 250;
        this.x = canvas.width + this.width;
    }
    draw(){
        context.drawImage(this.sprite,0,0, 92,80,this.x,this.y,this.width,this.height);
//        DrawSprite(this.sprite,0,0, 92,80,this.x,this.y,this.width,this.height);
    }
    update(){
        if ( (this.x < playerX + playerWidth) && ((this.x + this.width) > playerX + 40) && (this.y  < playerY + playerHeight)) {
            EndGame();
        }
        if( !(this.x < 0 - this.width)) this.x -= speed;
        else{
            obstacles.shift();
            obstacles.push( new Obstacles() )
        }
    }
}



// PLAYER STATS
const playerWidth  = 50;
const playerHeight = 37;
const gravity = 1;
let playerFrameX = 1;
let beginJump = false;
let playerFrameY = 1;
let playerX = 70;
let playerY = 200;
let playerSpeedY = 0;
let playerAction = "running";
let score = 0;

// OBSTACLES
let speed = 7;
const accelerate = 0.5;
let obstacles = [];
obstacles.push( new Obstacles() );


document.addEventListener('keydown', function(e) {
    switch (e.keyCode) {
        case 38:
            e.preventDefault();
            if (pause) {
                if(finishedGame){
                    NewGame();
                }
                pause = !pause;
            }
            Jump();
            break;
        case 40:
            e.preventDefault();
            Down();
            break;
        case 80:
            if(finishedGame){
                NewGame();
            }
            pause = !pause;
            break;
    }
});

function NewGame (){
    if (obstacles.length > 0) {
        obstacles.shift;
    }
    finishedGame = false;
// PLAYER STATS
playerFrameX = 1;
beginJump = false;
playerFrameY = 1;
playerX = 70;
playerY = 200;
playerSpeedY = 0;
playerAction = "running";
score = 0;

// OBSTACLES
speed = 7;
obstacles = [];
obstacles.push( new Obstacles() );
}

function DrawSprite(img, sX, sY, sW, sH, dX, dY,dW,dH){
    context.drawImage(img, sX, sY, sW, sH, dX, dY,dW,dH);
}

function DrawCanvas() {
    context.fillStyle = '#66ccff';
    context.fillRect(0,0,canvas.width,canvas.height);
    context.fillStyle = '#66cc33';
    context.fillRect(0,canvas.height - (canvas.height / 2.5),canvas.width, canvas.height / 2.5);
    context.fillStyle = 'grey';
    context.fillRect(0,canvas.height - (canvas.height / 2.5) + 10,canvas.width, 30);
    context.lineTo(canvas.width, canvas.height - (canvas.height / 2.5));
    context.stroke();
    DrawSprite(images.player, playerWidth * playerFrameX, playerHeight * playerFrameY, playerWidth, playerHeight, playerX, playerY, playerWidth * 1.5, playerHeight * 1.5);
    for (i = 0; i < obstacles.length; i++) {
        obstacles[i].draw();
        obstacles[i].update();
    }
    
}

function ChoosePlayerSprite(){
    if (playerAction === "running") {
        playerFrameY = 1;
        if (playerFrameX < 7) playerFrameX++;
        if (playerFrameX >= 7) playerFrameX = 1;
    }
    if (playerAction === "jumping") {
        playerFrameY = 2;
        if(beginJump) {
            playerFrameX = 2;
            beginJump = false;
        }
        if (playerFrameX < 7) playerFrameX++;
        if (playerFrameX >= 7) {
            playerFrameX = 1;
            playerFrameY = 1;
            playerAction = "running";
        }
    }
}

function Jump() {
    if( !(playerY>=250)){
        return; 
    }
    playerSpeedY = (-12);
    playerY += playerSpeedY;
    beginJump = true;
    playerAction = "jumping";
}

function Down(){
    if(!(playerY>=250))playerSpeedY = 20;
}

function Gravity() {
    if (!(playerY>=250)) {
        playerSpeedY += gravity;
        playerY += playerSpeedY;
    } else playerY = 250;

}

function PlayGame(){
    if (pause == false) {
        Gravity();
        DrawCanvas();
        score++;
        document.getElementById('score').innerHTML = score.toString();
    }
    
}

function EndGame(){
    pause = true;
    context.fillStyle = 'black';
    context.fillText("Your score is:",canvas.width/2 - 30 ,canvas.height/2);
    context.fillText(score,canvas.width/2 - 5 ,canvas.height/2+ 20);
    context.fillText("Press the 'up arrow' / letter 'p' to start a new game",canvas.width/2 - 120 ,canvas.height/2 + 100);
    finishedGame = true;
}

window.onload = function () {
    setInterval(PlayGame, 1000/30);
    setInterval(function (){
        if (!pause) {
            speed += accelerate;
        }
    }, 2000);
    setInterval(ChoosePlayerSprite,1000/10);
    
}