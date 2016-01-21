$(".winnerBox").hide();

var PLAYER_START_X = 300;
var PLAYER_START_Y = 580;
//------------------------------------------------------
//------- Enemy Constructor and Methods ----------------
//------------------------------------------------------
//Enemy constructor function
var Enemy = function(enemyStartX, enemyStartY, speed) {
 // Variables applied to each of our instances go here.
 // These variables specify how each instance will be different.
 //Properties of the objects
 //These values are passed from instantiating the object down below
 this.x = enemyStartX;
 this.y = enemyStartY;
 this.speed = speed;
 this.sprite = 'images/enemy-bug.png';
};
// Below are how all instances of the class Enemy should be similar
//stored as properties of the prototype object, methods on the object
// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
 ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Update the enemy's position (required method for game)
// Parameter: dt, a time delta between ticks
//This runs
Enemy.prototype.update = function(dt) {
 // We must multiply any movement by the 'dt 'parameter
 // this will ensure the game runs at the same speed for all computers.
 //console.log("update!!");
 this.x += this.speed * dt;
 //below repositions the enemy object to start moving again from left to right
 // if we don't have this, the enemy bugs will move right only one time
 // also we call a newRandomSpeed() in order to change the speed when
 // the enemy bugs starts from the left again.
 if (this.x > 700) {
  this.x = -70;
  this.newRandomSpeed();
 }
};

//this is the new "random" speed generated on each object every time
//called from update() above when the enemy bug 'x' position is > 500
// the enemy 'x' resets to -60 and is given a new "random" speed.
Enemy.prototype.newRandomSpeed = function() {
 this.speed = Math.floor((Math.random() * 5 + 1) * 70);
};

//-----------------------------------------------
//------- Player Constructor and Methods --------
//-----------------------------------------------
//Player constructor function
var Player = function() {
 // Variables applied to each of our instances go here.
 this.x = PLAYER_START_X;
 this.y = PLAYER_START_Y;
 this.collision = false;
 this.sprite = 'images/char-horn-girl.png';
};

// Draw the player on the screen, required method for game
Player.prototype.render = function() {
 ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Update the player's position, required method for game
// Parameter: dt, a time delta between ticks
Player.prototype.update = function(dt) {
 // You should multiply any movement by the dt parameter
 // which will ensure the game runs at the same speed for
 // all computers.
 this.testCollision();
};

Player.prototype.handleInput = function(direction) {
 if (direction === "left" && this.x > -62) {
  this.x -= 20;
 } else if (direction === "left" && this.x <= -62) { //lets sprite wrap left
  this.x = 695;
 }
 if (direction === "right" && this.x < 695) {
  this.x += 20;
 } else if (direction === "right" && this.x >= 695) { //lets sprite wrap right
  this.x = 0;
 }
 if (direction === "up" && this.y > 8) {
  this.y -= 20;
 }
 if (direction === "down" && this.y < 580) {
  this.y += 20;
 }
 if (direction === "up" && this.y <= 8) {
  this.gameOver();
 }
};

Player.prototype.gameOver = function() {
  // the scope of 'this' changes in the click listener callback fn.
  var self = this; // so "alias this"
  //DO NOT directly access the instance 'player' in its class definition,
  //(i.e. player.startOver()).
  $(".winnerBox").show();
  $("#playAgain").on('click', function() {
  $(".winnerBox").hide();
  self.startOver();
  });
}

// If the player is within range of an enemy bug, reset the game
//unless the player is behind a rock then no collision will happen.
Player.prototype.testCollision = function() {
 this.collision = true;
 for (var i = 0; i < allRocks.length; i++) {
  if (this.x < allRocks[i].x + 30 &&
   this.x + 30 > allRocks[i].x &&
   this.y < allRocks[i].y + 30 &&
   this.y + 30 > allRocks[i].y) {
   this.collision = false;
  }
 }
 for (var i = 0; i < allEnemies.length; i++) {
  if (this.collision === true && this.x < allEnemies[i].x + 30 &&
   this.x + 30 > allEnemies[i].x &&
   this.y < allEnemies[i].y + 30 &&
   this.y + 30 > allEnemies[i].y) {
   this.startOver();
  }
 }
};

Player.prototype.startOver = function() {
 this.x = PLAYER_START_X;
 this.y = PLAYER_START_Y;
};

//---------------------------------------------
//------- Rock Constructor and Methods --------
//---------------------------------------------

var Rock = function(rockX, rockY) {
 this.x = rockX;
 this.y = rockY;
 this.sprite = 'images/Rock.png';
};

Rock.prototype.render = function() {
 ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
Rock.prototype.update = function(dt) {};

//---------------------------------------
//------- Instantiate the Objects -------
//---------------------------------------

// Instantiate the rock objects:
var allRocks = [new Rock(100, 75), new Rock(200, 300), new Rock(500, 140)];

// Place all enemy objects in an array called 'allEnemies'
var allEnemies = [];
//When we instantiate an enemy object, we must pass it an initial speed
//I like speeds between 100-500, so tried to pick random equation to generate
for (var i = 0; i < 5; i++) {
 //console.log("instantiate enemy");
 var firstMovingSpeed = Math.floor((Math.random() * 5 + 1) * 80);
 allEnemies.push(new Enemy(60, 60 * (i + 1), firstMovingSpeed));
}
//Next step is the Enemy constructor function (line 4), the parameters
//above (new Enemy(x,y,speed)) are passed to the constructor to build our object.

// Instantiate the player object
var player = new Player();

//--------------------------------------------------
// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
//http://keycode.info/
document.addEventListener('keyup', function(e) {
 var allowedKeys = {
  37: 'left',
  38: 'up',
  39: 'right',
  40: 'down'
 };

 player.handleInput(allowedKeys[e.keyCode]);

});
