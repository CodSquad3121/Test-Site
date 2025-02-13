//board
let board;
let boardWidth = 750; 
let boardHeight = 250; 
let context;

//dino
let dinoWidth = 88;
let dinoHeight = 94;
let dinoX = 50;
let dinoY = boardHeight - dinoHeight;
let dinoImg;

let dino = {
    x: dinoX, 
    y: dinoY, 
    width: dinoWidth, 
    height: dinoHeight,
}

//cactus
let cactusArray = [];

let cactus1Width = 34;
let cactus2Width = 69;
let cactus3Width = 102;

let cactusHeight = 70;
let cactusX = 700;
let cactusY = boardHeight - cactusHeight;

let cactus1Img;
let cactus2Img;
let cactus3Img;

//physics
let velocity = -8; //cactus moving left speed
let velocityY = 0; //dino jumping speed
let gravity = 0.4; //dino falling speed, reduced for smoother jump

let gameOver = true; // Start with game over to allow starting the game
let score = 0; //default score
let cactusInterval;
let animationFrameId;

window.onload = function() {  //loads board when window loaded
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;

    context = board.getContext("2d"); //used for drawing

    //test dinosaur
    //context.fillStyle = "blue";
    //context.fillRect(dino.x, dino.y, dino.width, dino.height);

    dinoImg = new Image();
    dinoImg.src = "./img/dino.png";
    dinoImg.onload = function() { //loads dino on load
        context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height); //must draw out "Img" to "Image" in function name
    }

    //cactus 1 call
    cactus1Img = new Image();
    cactus1Img.src = "./img/cactus1.png";

    //cactus 2 call
    cactus2Img = new Image();
    cactus2Img.src = "./img/cactus2.png";

    //cactus 3 call
    cactus3Img = new Image();
    cactus3Img.src = "./img/cactus3.png";

    startGame(); // Automatically start the game on page load
    board.addEventListener("click", resetGame); // Add event listener to canvas for resetting the game
}

function startGame() {
    if (!gameOver) {
        return; // Prevent starting the game if it's already running
    }
    gameOver = false;
    score = 0;
    cactusArray = [];
    velocityY = 0;
    dino.y = dinoY;
    dinoImg.src = "./img/dino.png";
    if (cactusInterval) {
        clearInterval(cactusInterval);
    }
    cactusInterval = setInterval(placeCactus, 1000); //calls placeCactus function below (1000ms / 1sec)
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
    animationFrameId = requestAnimationFrame(update); //calls update function below

    // Remove existing event listener to prevent multiple game starts
    document.removeEventListener("keydown", moveDino);
    document.addEventListener("keydown", moveDino); //calls moveDino function below when key is pressed
    document.addEventListener("keyup", standUpDino); //calls standUpDino function below when key is released
}

function resetGame() {
    gameOver = true; // Stop the current game loop
    clearInterval(cactusInterval); // Stop the cactus placement
    cancelAnimationFrame(animationFrameId); // Stop the animation frame
    cactusArray = [];
    velocityY = 0;
    dino.y = dinoY;
    dinoImg.src = "./img/dino.png";
    context.clearRect(0, 0, boardWidth, boardHeight); // Clear the board
    context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
    score = 0;
    startGame(); // Start the game again
}

function update() {
    if (gameOver) {
        return; // Stop the update loop if the game is over
    }

    animationFrameId = requestAnimationFrame(update);

    context.clearRect(0, 0, boardWidth, boardHeight); // Clear the board

    //dino
    velocityY += gravity; //falling speed
    dino.y = Math.min(dino.y + velocityY, dinoY); //apply gravity to dino.y to make it not exceed ground level
    context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);

    // Draw cacti
    for (let i = 0; i < cactusArray.length; i++) {
        let cactus = cactusArray[i];
        cactus.x += velocity; //Move cactus to the left
        context.drawImage(cactus.img, cactus.x, cactus.y, cactus.width, cactus.height);

        if (detectCollision(dino, cactus)) { // Added parentheses
            gameOver = true;
            dinoImg.src = "./img/dino-dead.png";
            dinoImg.onload = function() {
                context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
            }
            // Draw the score even when the game is over
            context.fillStyle = "black";
            context.font = "20px Courier";
            context.fillText(score, 5, 20);
            return; // Stop the update loop
        }
    }

    // Score
    if (!gameOver) {
        score++;
    }
    context.fillStyle = "black"; // Corrected from fillsStyle to fillStyle
    context.font = "20px Courier";
    context.fillText(score, 5, 20);

    // Remove cacti that have moved off the screen
    cactusArray = cactusArray.filter(cactus => cactus.x + cactus.width > 0);
}

function moveDino(e){
    if (gameOver) {
        return;
    }

    if ((e.code == "Space" || e.code == "ArrowUp") && dino.y == dinoY) {
        //jump
        velocityY = -10; //jump height
    }
    else if (e.code == "ArrowDown" && dino.y == dinoY) {
        //duck
        dinoImg.src = "./img/dino-duck.png";
        dino.height = 59;
        dino.y = boardHeight - dino.height;
        context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
    }
}

function standUpDino(e) {
    if (e.code == "ArrowDown") {
        dinoImg.src = "./img/dino.png";
        dino.height = dinoHeight;
        dino.y = dinoY;
        context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
    }
}

function placeCactus() {
    if (gameOver) {
        return;
    }
    
    //place cactus
    let cactus = {
        img: null,
        x: cactusX,
        y: cactusY,
        width: null,
        height: cactusHeight //height is same for all cacti
    }

    let placeCactusChance = Math.random(); //random generator 0 to 0.9999

    if (placeCactusChance > 0.90) { //10% chance of cactus3
        cactus.img = cactus3Img;
        cactus.width = cactus3Width;
        cactusArray.push(cactus);
    }
     else if (placeCactusChance > 0.70) { //30% chance of cactus2
        cactus.img = cactus2Img;
        cactus.width = cactus2Width;
        cactusArray.push(cactus);
    }
     else if (placeCactusChance > 0.50) { //50% chance of cactus1
        cactus.img = cactus1Img;
        cactus.width = cactus1Width;
        cactusArray.push(cactus);
    }

    if (cactusArray.length > 5) {
        cactusArray.shift(); //removes first cactus in array so array doesnt continue to grow
    }
}

//collision detection formula
function detectCollision(a, b){
    return a.x < b.x + b.width &&   //a's left corner doesnt touch b's top right corner
           a.x + a.width > b.x &&   //a's top left corner passes b's top right corner
           a.y < b.y + b.height &&  //a's top left corner doesnt touch b's bottom right corner
           a.y + a.height > b.y;    //a's bottom left corner passes b's top right corner
}