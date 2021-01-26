//VARIABLES

//canvas
let canvas = document.querySelector('#game-board');
let ctx = canvas.getContext('2d');
//game board
let width = canvas.width;
let height = canvas.height;
//ball
let ballRadius = width*0.02;
//ball speed
let speed = 2;
let x = width*0.75;
let y = height/2;
let dx = -speed;
let dy = speed*0.7;
//paddle
let paddleHeight = height*0.025;
let paddleWidth = width*0.18;
let paddleLocation = (width - paddleWidth)/2;
//paddle control
let paddleToRight = false;
let paddleToLeft = false;
//bricks
let brickRowCount = 3;
let brickColumnCount = 5;
let brickWidth = width*0.16;
let brickHeight = height*0.04;
let offsetTop = width*0.025;
let offsetLeft = offsetTop*2;
let brickPadding = offsetTop;
//score
let score = 0;

//FUNCTIONS

//game loop
function draw(){
	ctx.clearRect(0, 0, width, height);
	drawBall();
	bounceH();
	bounceV();
	drawBrick();
	detectCollision();
	checkGame();
	movePaddle();
	drawPaddle();
	//add movement
	x+= dx;
	y+= dy;
}

//drwing ball
function drawBall(){
	ctx.beginPath();
	ctx.arc(x, y, ballRadius, Math.PI*0, Math.PI*2);
	ctx.fillStyle = "green";
	ctx.fill();
	ctx.closePath();
}

//vertical bounce
function bounceV(){
	if(y+dy < 0 + ballRadius){
		dy = -dy;
	}else if(y+dy > (height-(height*0.05))-ballRadius && x >= paddleLocation+ballRadius && x <=paddleLocation + paddleWidth + ballRadius){
			dy = -dy;
	}else if(y+dy > height-ballRadius){
		// dy = -dy;
		//if ball reached bottom
		alert("HAHA BUUUGO!");
		document.location.reload();
		clearInterval(interval);
	}
}
//horizontal bounce
function bounceH(){
	if(x+dx > width-ballRadius || x+dx < 0 + ballRadius){
		dx = -dx;
	}else if(y+dy >= height-(height*0.05)-ballRadius){
		if(x+dx >= paddleLocation && x+dx < paddleLocation + 2){
			dx = -dx;
			dy = -dy;
		}
		if(x+dx <= paddleLocation+paddleWidth && x+dx > (paddleLocation+paddleWidth) - 2){
			dx = -dx;
			dy = -dy;
		}
	}
}

//drawing paddle
function drawPaddle(){
	ctx.beginPath();
	ctx.rect(paddleLocation, height-(height*0.05), paddleWidth, paddleHeight)
	ctx.fillStyle = "blue";
	ctx.fill();
	ctx.closePath();
}

//paddle control movement
function movePaddle(){
	if (paddleToRight) {
		paddleLocation += 4;
	  if(paddleLocation > width - paddleWidth){
	  	paddleLocation = width - paddleWidth;
	  }
	}
	if (paddleToLeft) {
		paddleLocation -= 4;
    if(paddleLocation < 0){
    	paddleLocation = 0;
    }
	}
}
//listen input for paddle controls
function keyDownHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        paddleToRight = true;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        paddleToLeft = true;
    }
}
function keyUpHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        paddleToRight = false;
        if(paddleLocation > width - paddleWidth){
        	paddleLocation = width - paddleWidth;
        }
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        paddleToLeft = false;
        if(paddleLocation < 0){
        	paddleLocation = 0;
        }
    }
}

//drawBricks
function drawBrick(){
	for(let i = 0 ; i < brickColumnCount ; i++){
		for(let j = 0 ; j < brickRowCount ; j++){
			let itX = (i*(brickWidth+brickPadding)) + offsetLeft;
			let itY = (j*(brickHeight+brickPadding)) + offsetTop;
			
			bricks[i][j].x = itX;
			bricks[i][j].y = itY;
			if(bricks[i][j].state){
				ctx.beginPath();
				ctx.rect(itX, itY, brickWidth, brickHeight)
				ctx.fillStyle = "#f00";
				ctx.fill();
				ctx.closePath();
			}
		}
	}
}

//detect collision
function detectCollision(){
	for(let i = 0 ; i < brickColumnCount ; i++){
	for(let j = 0 ; j < brickRowCount ; j++){
		
		let brck = bricks[i][j];
		
		if(brck.state == true){
			
			if((x > brck.x) && (x < (brck.x+brickWidth)) && (y < (brck.y+brickHeight)) && (y > brck.y)){
				dx = -dx;
				bricks[i][j].state = false;
				score++;
			}/*else if((y > (brck.y - ballRadius)) && (y < (brck.y+brickHeight)+ballRadius)  && (x < (brck.x+brickWidth)+ballRadius)){
				dy = -dy;
				// bricks[i][j].state = false;
			}*/
			
		}
	}
	}
}

//check game
function checkGame(){
	if(score == (brickColumnCount*brickRowCount)){
		//if complete
		alert("Galeeeeng!");
		document.location.reload();
		clearInterval(interval);
	}
}

//store bricks
let bricks = [];
for(let i = 0 ; i < brickColumnCount ; i++){
	bricks[i] = [];
	
	for(let j = 0 ; j < brickRowCount ; j++){
		bricks[i][j] = {
			x : 0,
			y : 0,
			state : true
		}
	}
}

//listen for input
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

//game loop
let interval = setInterval(draw, 10);
