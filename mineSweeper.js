/////////////////// initial variable declarations

// object literals
var s = {
	rows: 9,
	cols: 13,
	width: 30,
	height: 30,
	numberBombs: 10,
	numberBombsNext: 10,
	shiftX: 0,
	shiftY: 0

};

var resetButton = {
	w: 80,
	h: 30,
	x: 307,
	y: 15,
};

var clock = {
	time: 0,
	x: 25,
	y: 15,
	h: 30,
	w: 80,
	id: 0

};

var b1 = {
	w: 30,
	h: 30,
	x: 30,
	y: 335
};

var b2 = {
	w: 30,
	h: 30,
	x: 90,
	y: 335
};

var b3 = {
	w: 30,
	h: 30,
	x: 150,
	y: 335
};



// setting up arrays
var bombs = [];
var clickedBoxes = [];
var bombsFound = new Array();
var boxesToCheck = [
[-1,-1], 
[0,-1],
[1,-1] ,
[1,0] ,
[1,1], 
[0,1],
[-1,1] ,
[-1, 0 ]
];

for (var i = 0; i < s.cols; i++) {
	bombsFound[i] = new Array(s.rows);
}

for( var i =0; i < s.cols; i++ ){
	for( var j =0; j < s.rows; j++ ){
		bombsFound[i][j] = -1;
	}
}


// images
var boxPic = new Image();
boxPic.src = "img/box.png";
var numPic = new Image();
numPic.src = "img/num.png";
var zeroPic = new Image();
zeroPic.src = "img/zero.png";
var bombPic = new Image();
bombPic.src = "img/bomb.png";
var bombBGPic = new Image();
bombBGPic.src = "img/bombBG.png";

var flag = new Image();
flag.src = "img/flag.png";
var resetPic = new Image();
resetPic.src = "img/reset.png";
var clockPic = new Image();
clockPic.src = "img/clock.png";
var radialS = new Image();
radialS.src = "img/radialS.png";
var radialNS = new Image();
radialNS.src = "img/radialNS.png";
var bg = new Image();
bg.src = "img/minesweeper.png";


// sound effects
var boomSound = new Audio("boomSound.wav"); 
var pressB = new Audio("pressB.wav");
var tada = new Audio("tada.wav");
var consuela = new Audio("consuela.wav"); 


// vars
var c;
var mX;
var mY;
var clickedX;
var clickedY;
var canvas;
var canvasH;
var canvasW;
var gameOver = false;
var right = 2;
var boxesLeft = s.rows* s.cols - s.numberBombs;
var mapW= s.cols  *  s.width;
var mapH= s.rows* s.height;
var rState = 1;



/////////////////////////////////// onload
window.onload = function(){

	//declaring canvas
	canvas = document.getElementById("gCanvas");
	canvas.addEventListener('mouseup', clickedCanvas, false );
	canvasH = canvas.height;
	canvasW = canvas.width;
	canvas.oncontextmenu = function() {
		return false; 
	}

	//giving it style
	c = canvas.getContext("2d");

	//gameCanvas = document.getElementById("gameCanvas");
	console.log("Here is width: " , canvas.width);
	c.font=  "bold 18px verdana, sans-serif ";
	c.fillStyle = "#ffffff"; 

	// pushing map
	s.shiftX = (canvasW - mapW)/2;
	s.shiftY = (canvasH - mapH)-40;
	clock.x = s.shiftX+5; 
	

	// initializing other things
	init();
}

/////////////////////////////////// initialize
function init(){

	var x;
	var y;

	for(var i = 0 ; i< s.numberBombs ; i++){

		// not adding duplicate bombs
		while(true){
			x = Math.floor ( Math.random()*s.cols);
			y = Math.floor ( Math.random()*s.rows);

			if( bombsFound[x][y] != -2){
				bombsFound[x][y] = -2;
				bombs[i] = [x , y];
				break;
			}
			console.log("Almost added a duplicate!");
		}	
	}
	drawCanvas();
}


//////////////////////////////////// onclick
function clickedCanvas(e){



	var pos = getMousePos(canvas, e);
	mX = pos.x - s.shiftX;
	mY = pos.y - s.shiftY;

	if( collision(  resetButton,  pos.x, pos.y)  == true )
	{
		console.log("Reset Game");
		resetGame();
		pressB.play();
		return;
	}
	else if( collision(  clock,  pos.x, pos.y)  == true )
	{
		consuela.play();
		return;
	}

	else if( collision(  b1,  pos.x, pos.y)  == true )
	{
		rState = 1;
		pressB.play();
		s.numberBombsNext = 10;
		drawBottom();
		return;
	}
	else if( collision(  b2,  pos.x, pos.y)  == true )
	{
		rState = 2;
		pressB.play();
		s.numberBombsNext = 15;
		drawBottom();
		return;
	}
	else if( collision(  b3,  pos.x, pos.y)  == true )
	{
		rState = 3;
		pressB.play();
		s.numberBombsNext = 20;
		drawBottom();
		return;
	}


	if(gameOver == true){
		return;
	}

	
	if(   Math.floor(mX/ s.width) < s.cols && Math.floor(mY/ s.height)  < s.rows ){

		
		clickedX = Math.floor(mX/ s.width);
		clickedY = Math.floor(mY/ s.height);


		// adding/ removing flag
		if(e.button === right){

			//flag non-bomb
			if(bombsFound[clickedX][clickedY] == -1 ){
				bombsFound[clickedX][clickedY] = -3;
				pressB.play();
				drawCanvas();

			}
			else if (bombsFound[clickedX][clickedY] == -3) {
				bombsFound[clickedX][clickedY] = -1;
				pressB.play();
				drawCanvas();
			};

			//flag bomb
			if(bombsFound[clickedX][clickedY] == -2 ){
				bombsFound[clickedX][clickedY] = -4;
				pressB.play();
				drawCanvas();

			}
			else if (bombsFound[clickedX][clickedY] == -4) {
				bombsFound[clickedX][clickedY] = -2;
				pressB.play();
				drawCanvas();
			};
			return;
		}

		if (bombsFound[clickedX][clickedY] == -3 || bombsFound[clickedX][clickedY] == -4 ){
			consuela.play();
			return;
		}



		//check if clicked bomb
		for(var i =0; i< s.numberBombs ; i++){
			if(clickedX == bombs[i][0] && clickedY == bombs[i][1]){
				lose();
				gameOver = true;
				return;
			}
		}

		//mark number
		if( bombsFound[clickedX][clickedY] < 0 ){
			pressB.play();
			clickPass(clickedX, clickedY);

			if(boxesLeft == 0){
				winning();
				gameOver = true;
			}
			else {
				drawCanvas();
			}
		}
		
	}
	else{
		console.log("Out of Range")
	}
}

//////////////////////////////////////  timer

function timer(){


	c.clearRect(clock.x, clock.y, clock.w, clock.h);
	c.drawImage( resetPic , resetButton.x , resetButton.y);
	c.drawImage( clockPic , clock.x , clock.y);
	c.fillStyle = "#000000";
	c.fillText(clock.time, 43 , 37);
	clock.time++;
	if(clock.time == 999){
		clock.time = 989;
	}


}

////////////////////////////////////// reset

function resetGame(){


	clearInterval(clock.id);

	clock.time = 0;
	boxesLeft = s.rows* s.cols - s.numberBombs;
	for( var i =0; i < s.cols; i++ ){
		for( var j =0; j < s.rows; j++ ){
			bombsFound[i][j] = -1;
		}
	}

	var x;
	var y;


	s.numberBombs = s.numberBombsNext;
	for(var i = 0 ; i< s.numberBombs ; i++){

		// not adding duplicate bombs
		while(true){
			x = Math.floor ( Math.random()*s.cols);
			y = Math.floor ( Math.random()*s.rows);

			if( bombsFound[x][y] != -2){
				bombsFound[x][y] = -2;
				bombs[i] = [x , y];
				break;
			}
			console.log("Almost added a duplicate!")
		}
		
	}
	gameOver = false;
	

	drawCanvas();
}

//////////////////////////////////////////////////////////////////
///////////////////////   rendering   ////////////////////////////
//////////////////////////////////////////////////////////////////

//////////////////////////////////// draw canvas
function drawCanvas(){

	c.clearRect(0,0, 400, 400);
	c.fillStyle = "rgba(200,200,200,1)";
	c.fillRect(0,0, 400, 400);
	c.fillStyle = "rgba(255,255, 255,1)";
	c.drawImage( bg , 5 , 5);

	for( i = 0 ; i < s.cols ; i++){
		for( j =0; j < s.rows ; j++){
			var x = i*s.width + s.shiftX;
			var y = j*s.height + s.shiftY;


			if( bombsFound[i][j] > -1 ){
				if ( bombsFound[i][j]  > 0 ){
					c.drawImage(numPic, x, y);
					c.fillText(bombsFound[i][j], x +9 , y + 21);
				}
				else
					c.drawImage( zeroPic, x, y);

			}
			else if( bombsFound[i][j] == -3 ||  bombsFound[i][j] == -4 ){
				c.drawImage(flag, x, y); 	
			}
			else {c.drawImage(boxPic, x, y); }

		}

	}
	c.drawImage( resetPic , resetButton.x , resetButton.y);
	c.drawImage( clockPic , clock.x , clock.y);

	c.fillText("E", 10 , 355 );
	c.drawImage( radialNS , 30 , 335 );
	c.fillText("M", 70 , 355 );
	c.drawImage( radialNS , 90 , 335 );
	c.fillText( "H" , 130 , 355 );
	c.drawImage( radialNS , 150 , 335 );

	switch(rState)
	{
	case 1:
	  c.drawImage( radialS , 30 , 335 );
	  break;
	case 2:
	  c.drawImage( radialS , 90 , 335 );
	  break;
	case 3:
	  c.drawImage( radialS , 150 , 335 );
	  break;
	default:
	  console.log("This shouldn't display!");
	}
	c.fillText( s.numberBombsNext, 330 , 357);
	c.drawImage( bombPic , 360 , 335 );

	c.fillStyle = "#000000";
	c.fillText(clock.time, 43 , 37);
}


//////////////////////////////////// lose
function lose(){

	drawCanvas();


	//Rendering Bombs
	for(var i =0; i< s.numberBombs; i++){
		var x = bombs[i][0]*s.width + s.shiftX;
		var y = bombs[i][1]*s.height + s.shiftY;
		c.drawImage( bombBGPic, x, y );
	}

	boomSound.play();
	console.log("Boom! You lost    :<(   ");
	clearInterval(clock.id);
}

function drawBottom(){

	c.clearRect(0,330, 400, 40);
	c.fillStyle = "rgba(200,200,200,1)";
	c.fillRect(0,330, 400, 40);
	c.fillStyle = "rgba(255,255, 255,1)";

	c.fillText("E", 10 , 355 );
	c.drawImage( radialNS , 30 , 335 );
	c.fillText("M", 70 , 355 );
	c.drawImage( radialNS , 90 , 335 );
	c.fillText( "H" , 130 , 355 );
	c.drawImage( radialNS , 150 , 335 );

	switch(rState)
	{
	case 1:
	  c.drawImage( radialS , 30 , 335 );
	  break;
	case 2:
	  c.drawImage( radialS , 90 , 335 );
	  break;
	case 3:
	  c.drawImage( radialS , 150 , 335 );
	  break;
	default:
	  console.log("This shouldn't display!");
	}
	c.fillText( s.numberBombsNext, 330 , 357);
	c.drawImage( bombPic , 360 , 335 );
	
}

function winning(){
	
	drawCanvas();


	// showing bombs
	for(var i =0; i< s.numberBombs; i++){
		var x = bombs[i][0]*s.width + s.shiftX;
		var y = bombs[i][1]*s.height + s.shiftY;
		c.drawImage( flag, x, y );
	}


	tada.play();

	console.log("You Won!   :<) ");
	clearInterval(clock.id);
}


//////////////////////////////////// click pass
function clickPass( x , y ){

	if(boxesLeft == s.rows* s.cols - s.numberBombs){
		clock.id = setInterval ( timer, 1000 );
		clock.time++;
	}

	boxesLeft--;


	var numBombs = 0;

	for( i in boxesToCheck ){

		var newX = x + boxesToCheck[i][0];
		var newY = y + boxesToCheck[i][1];

		if( newX >= 0 && newY >= 0 && newY < s.rows && newX < s.cols){

			//check if bomb
			if( bombsFound[newX][newY] == -2 || bombsFound[newX][newY] == -4){
				numBombs++;
			} 
			

		}
	}

	bombsFound[x][y] = numBombs;

	
	if(numBombs == 0){
		for( i in boxesToCheck ){
			var newX = x + boxesToCheck[i][0];
			var newY = y + boxesToCheck[i][1];
			if( newX >= 0 && newY >= 0 && newY < s.rows && newX < s.cols ){
				if(bombsFound[newX][newY] == -1){
					clickPass( newX,  newY );
				}
			}
		}
	}
	
	
}

////////////////////////////////////  get actual position

function getMousePos(canvas, evt) {
	var rect = canvas.getBoundingClientRect();
	return {
		x: evt.clientX - rect.left,
		y: evt.clientY - rect.top
	};
}

//////////////////////////// checking if collsion with button
function collision( boundary , x, y){

	if( boundary.x + boundary.w < x)
		return false;
	if( boundary.x > x)
		return false;
	if( boundary.y + boundary.h < y)
		return false;
	if( boundary.y > y)
		return false;

	return true;

}

