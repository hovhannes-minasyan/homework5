const canvas = document.getElementById("canvas");
const canvasW = canvas.width;
const canvasH = canvas.height;
const context = canvas.getContext("2d");
const music = new Audio("Star_Wars_Music.mp3");
const colorArray = ["red","green","blue","black","orange","grey","brown","pink"];
const score = document.getElementById("score");
const leftKey = 37;
const upKey = 38;
const rightKey = 39;
const downKey = 40;

const playerImg = new Image();
playerImg.src = "darth.png";
const heartImg = new Image();
heartImg.src = "heart.png";
const lukeImg = new Image();
lukeImg.src="oldLuke.png";
const backImg = new Image ();
backImg.src = "back.jpg";
// return a [0,num) integer
const rand = function(num) {
	return Math.floor(Math.random() * num);
};
const getRandColor= function()
{
	const red=rand(150)+50 + ",";
	const green = rand(150)+50 +",";
	const blue = rand(150)+50;
	
	return "rgb("+red+green+blue+")";
} 

const getRandomPoint = function (canvasW , canvasH)
{
	return {
		x : rand(canvasW-20+1),
		y:rand(canvasH-50+1),
		width: 20,
		height:50,
		deltaX:rand(7)-3 || 2,
		deltaY:rand(7)-3 || 2,
		//color : colorArray[rand(colorArray.length)]
		color : getRandColor(),
		img : lukeImg
		
		}
} 

const fillPointArray = function (count, arr,canvasW,canvasH)
{
	if(count<0){return;}
	arr[count] = getRandomPoint(canvasW,canvasH)
	fillPointArray(count-1,arr,canvasW,canvasH);
}

const getPointArray=function(count,canvasW,canvasH){
	const pArray = [];
	fillPointArray(count-1,pArray,canvasW,canvasH);
	return pArray;
}



const forEach = function(arr, func){
	
	const helper = function (index)
	{
		if(index<0) {return;}
		func(arr[index]);
		helper(index-1)
	}
	helper(arr.length-1);
}


const Start = function(){
const gameData = {
	player : {
		name : "Player", 
		img : playerImg,
		opacity : 1,
		x : 0,
		y : 0,
		height : 50,
		width: 25,
		speed : 2,
		isInvincible : false,
		invincibleTimer :0,
		isDead: false,
		life : 3,
		checkCollision : function (point) {
			//console.log("Checked")
			if (this.x + this.width >= point.x && point.x + point.width >= this.x 
			&& this.y + this.height >= point.y && point.y + point.height >= this.y && !this.isInvincible){
				this.isInvincible = true;
				this.life--; 
				if(this.life <= 0) this.isDead= true; 
					}
				}
	},
	enemies : getPointArray(3,canvasW,canvasH),
	level : 1,
	levelCounter : 0,
	levelUp : function ()
	{
		this.levelCounter=0;
		this.level++;
		this.enemies[this.enemies.length] = getRandomPoint(canvasW,canvasH);
		score.innerHTML= this.level;
	},
	up: false,
	down: false,
	left: false,
	right : false
};



const updatePoint = function(point){
	if(point.x < 0 || point.x + point.width >canvasW) point.deltaX *=-1;
	if(point.y < 0 || point.y + point.height>canvasH) point.deltaY *=-1;
	point.x+= point.deltaX;
	point.y+= point.deltaY;
} 



const drawPoint = function(point)
{
	
	
	context.fillStyle = point.color;
	
	context.drawImage(point.img,point.x,point.y,point.width,point.height)
	//context.fillRect(point.x,point.y,point.width,point.height);
}

const checkPlayerWithPoint = function(point)
{
	gameData.player.checkCollision(point);
}

const drawHeart = function(amount,x,y,width,height)
{
	if(amount <1) return;
	context.drawImage(heartImg,x,y,width,height);
	drawHeart(amount-1,x-width*1.25,y,width,height); // w w/4 w w/4 w
}


const loop = function() 
{
	if(gameData.player.isDead){
		music.pause();
		alert("You lost the game, your score is " + gameData.level); return;
		
		}
	
	const player = gameData.player;
	
	if(gameData.up && player.y>0 ) {gameData.player.y -=player.speed }
	if(gameData.down && player.y<canvasH-player.height ) {gameData.player.y +=player.speed }
	if(gameData.left && player.x>0 ) {player.x -=player.speed }
	if(gameData.right && player.x<canvasW - player.width ) {player.x +=player.speed }
	
	context.clearRect(0,0, canvas.width,canvas.height);
	context.drawImage(backImg,0,0,canvasW,canvasH);	
	forEach(gameData.enemies,drawPoint);
	
	//Draw Player 
	context.globalAlpha = gameData.player.opacity;
	context.drawImage(player.img,player.x,player.y,player.width,player.height);
	context.globalAlpha = 1;
	
	forEach (gameData.enemies,checkPlayerWithPoint);
	
	forEach(gameData.enemies,updatePoint);
	drawHeart(gameData.player.life, canvasW - canvasW*5/100,canvasH - canvasH*5/100,canvasW*3/100,canvasH*3/100 )
	
	
	gameData.levelCounter++;
	if(gameData.levelCounter === 600 ) {gameData.levelUp();} // 10 sec
	if(gameData.player.isInvincible) {
		gameData.player.invincibleTimer++; 
		gameData.player.opacity = (Math.abs((gameData.player.invincibleTimer%60)/30-1));
		//console.log(gameData.player.opacity);
		}
	if(gameData.player.invincibleTimer === 180) {gameData.player.isInvincible=false; gameData.player.invincibleTimer=0;} // 3 sec
	requestAnimationFrame(loop);
}




document.addEventListener('keydown', function(event) {
	if(event.keyCode === upKey) {
		gameData.up = true;
  	}
	else if(event.keyCode === downKey) {
		gameData.down = true;
  	}
	else if(event.keyCode === leftKey) {
		gameData.left = true;
  	}
	else if(event.keyCode === rightKey) {
		gameData.right = true;
  	}
	else if (event.keyCode === 87) {
	gameData.levelUp();
	}
	else if (event.keyCode===88){
	Start();
	}

}, false);

document.addEventListener('keyup', function(event) {
	if(event.keyCode === upKey) {
		gameData.up = false;
  	}
	else if(event.keyCode === downKey) {
        
		gameData.down = false;
  	}
	else if(event.keyCode === leftKey) {
		
		gameData.left = false;
  	}
	else if(event.keyCode === rightKey) {
		
		gameData.right = false;
  	}
	

}, false);



loop();
music.play();
}
Start();