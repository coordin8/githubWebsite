/////////////////// initial variable declarations

// object literals
var s = {
	rows: 9,
	cols: 13,
	width: 30,
	height: 30,
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


var level = new Array();


// create level
for (var i = 0; i < s.cols; i++) {
	level[i] = new Array(s.rows);
}
// initialize level
for( var i =0; i < s.cols; i++ ){
	for( var j =0; j < s.rows; j++ ){
		level[i][j] = 1;
	}
}

level[3][3] = 2;


// images
var wallPic = new Image();
wallPic.src = "img/wall.png";
var foodPic = new Image();
foodPic.src = "img/food.png";
var resetPic = new Image();
resetPic.src = "img/reset.png";
var clockPic = new Image();
clockPic.src = "img/clock.png";
var radialS = new Image();
radialS.src = "img/radialS.png";
var radialNS = new Image();
radialNS.src = "img/radialNS.png";
var bg = new Image();
bg.src = "img/pacmanBG.png";



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
var boxesLeft = s.rows* s.cols - s.numberBombs;
var mapW= s.cols *  s.width;
var mapH= s.rows * s.height;
var rState = 1;



/////////////////////////////////// onload
window.onload = function(){


	var cardRules = new Array();
    $.get('level1.txt', function(data){
            cardRules = data.split('\n');
            console.log(cardRules);
        });

    console.log("Herrrr");

	//declaring canvas
	canvas = document.getElementById("gCanvas");
	canvas.addEventListener('mouseup', mouseInput, false );
	window.addEventListener('keydown', keyboardInput, false );
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
	clock.x = s.shiftX+5; 
	drawCanvas();
	
}



//////////////////////////////////// onclick
function mouseInput(e){


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
		drawBottom();
		return;
	}
	else if( collision(  b2,  pos.x, pos.y)  == true )
	{
		rState = 2;
		pressB.play();
		drawBottom();
		return;
	}
	else if( collision(  b3,  pos.x, pos.y)  == true )
	{
		rState = 3;
		pressB.play();
		drawBottom();
		return;
	}


	if(gameOver == true){
		return;
	}

}

///////////////////////////    keyboard input

//////////////////////////////////// onclick
function keyboardInput(e){


	console.log("yo u pressed a button");



	if(gameOver == true){
		return;
	}


	var code = e.keyCode;

	switch(code)
	{
		case 65:
		console.log("a pressed");
		break;
		case 97:
		console.log("a pressed");
		break;
		case 68:
		console.log("d pressed");
		break;
		case 100:
		console.log("d pressed");
		break;
		case 83:
		console.log("s pressed");
		break;
		case 115:
		console.log("s pressed");
		break;
		case 87:
		console.log("w pressed");
		break;
		case 119:
		console.log("w pressed");
		break;
		default:
		console.log("This shouldn't display!");
	}


/*
	
	if(   Math.floor(mX/ s.width) < s.cols && Math.floor(mY/ s.height)  < s.rows ){

		
		clickedX = Math.floor(mX/ s.width);
		clickedY = Math.floor(mY/ s.height);


		if (bombsFound[clickedX][clickedY] == -3 || bombsFound[clickedX][clickedY] == -4 ){
			consuela.play();
			return;
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

	*/
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


			if( level[i][j] == 1 ){
				c.drawImage(wallPic, x, y);
			}
			else if( level[i][j] == 2){
				c.drawImage(foodPic, x, y); 	
			}
			else { console.log("This shouldn't display"); }

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

