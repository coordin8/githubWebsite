/////////////////// initial variable declarations

// object literals
var s = {
	rows: 13,
	cols: 20,
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
	x: 15,
	y: 400
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
		bombsFound[i][j] = 0;
	}
}


// images
var boxPic = new Image();
boxPic.src = "img/box.png";
var numPic = new Image();
numPic.src = "img/food.png";
var zeroPic = new Image();
zeroPic.src = "img/wall.png";



var resetPic = new Image();
resetPic.src = "img/reset.png";
var bg = new Image();
bg.src = "img/mineSweeper.png";


// sound effects
var boomSound = new Audio("sound/boomSound.wav"); 
var pressB = new Audio("sound/pressB.wav");
var tada = new Audio("sound/tada.wav");
var consuela = new Audio("sound/consuela.wav"); 


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
	c.font=  "bold 18px verdana, sans-serif ";
	c.fillStyle = "#ffffff"; 

	// pushing map
	s.shiftX = (canvasW - mapW)/2;
	s.shiftY = (canvasH - mapH)-40;

	

	// initializing other things
	init();
}

/////////////////////////////////// initialize
function init(){

	var x;
	var y;



	drawCanvas();
}


//////////////////////////////////// onclick
function clickedCanvas(e){



	var pos = getMousePos(canvas, e);
	mX = pos.x - s.shiftX;
	mY = pos.y - s.shiftY;

	if( collision(  resetButton,  pos.x, pos.y)  == true )
	{

		if(e.button === right){


			

			for(var i =0; i < s.cols ; i++){
				console.log(bombsFound[i]);

			}
			process.stdout.write("\n");
			

			return;
		}

		console.log("Reset Game");
		resetGame();
		pressB.play();
		return;
	}


	
	if(   Math.floor(mX/ s.width) < s.cols && Math.floor(mY/ s.height)  < s.rows ){

		clickedX = Math.floor(mX/ s.width);
		clickedY = Math.floor(mY/ s.height);

		// adding/ removing flag
		if(e.button === right){

			bombsFound[clickedX][clickedY] = 0;
			drawCanvas();
			pressB.play();

			return;
		}
		
		
		

		bombsFound[clickedX][clickedY] = 1;
		drawCanvas();
		pressB.play();

		
		
	}
	else{
		console.log("Out of Range")
	}
}



////////////////////////////////////// reset

function resetGame(){



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
					//c.fillText(bombsFound[i][j], x +9 , y + 21);
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

}

function drawBottom(){

	c.clearRect(0,330, 400, 40);
	c.fillStyle = "rgba(200,200,200,1)";
	c.fillRect(0,330, 400, 40);
	c.fillStyle = "rgba(255,255, 255,1)";

	

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

}


//////////////////////////////////// click pass
function clickPass( x , y ){



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
					//clickPass( newX,  newY );
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

