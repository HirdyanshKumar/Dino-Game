
let playArea = document.getElementById("gameCanvas");
let painter = playArea.getContext("2d");

playArea.width = 800;
playArea.height = 300;


let runnerImg = new Image();
runnerImg.src = "./dino.png";

let obstacleImg = new Image();
obstacleImg.src = "./cactus.png";

let jumpAudio = document.getElementById("jumpingSound");
let failAudio = document.getElementById("deadSound");


let runner = {
    posX: 50,
    posY: 180,
    w: 70,
    h: 70,
    speedY: 0,
    fallRate: 0.5,
    hopPower: -10,
    inAir: false
};


let obstacles = [];
let obsW = 50;
let obsH = 60;
let obsMoveSpeed = -5;


let points = 0;
let isLost = false;


document.addEventListener("keydown", function (e) {
    if ((e.key === " " || e.key === "ArrowUp") && !runner.inAir) {
        runner.speedY = runner.hopPower;
        runner.inAir = true;
        jumpAudio.currentTime = 0;
        jumpAudio.play();
    }
});

setInterval(() => {
    if (!isLost) {
        let newObstacle = {
            posX: playArea.width,
            posY: 230,
            w: obsW,
            h: obsH
        };
        obstacles.push(newObstacle);
    }
}, 2000);

function gameLoop() {
    if (isLost) return;

    painter.clearRect(0, 0, playArea.width, playArea.height);

    
    painter.drawImage(runnerImg, runner.posX, runner.posY, runner.w, runner.h);

    
    runner.speedY += runner.fallRate;
    runner.posY += runner.speedY;

    
    if (runner.posY > 180) {
        runner.posY = 180;
        runner.inAir = false;
    }

    
    for (let i = 0; i < obstacles.length; i++) {
        let obs = obstacles[i];
        obs.posX += obsMoveSpeed;

        painter.drawImage(obstacleImg, obs.posX, obs.posY, obs.w, obs.h);

        
        if (runner.posX < obs.posX + obs.w &&
            runner.posX + runner.w > obs.posX &&
            runner.posY < obs.posY + obs.h &&
            runner.posY + runner.h > obs.posY) {
            isLost = true;
            failAudio.play();
            alert("Oops! You scored: " + points);
            document.location.reload();
        }
    }

    
    obstacles = obstacles.filter(obs => obs.posX + obs.w > 0);

  
    points++;
    painter.fillStyle = "black";
    painter.font = "20px Arial";
    painter.fillText("Points: " + points, 10, 20);

    requestAnimationFrame(gameLoop);
}

gameLoop();
