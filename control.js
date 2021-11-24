var context, controller, rectangle, loop;

var buttonsPressed = false;
var carrybox = false;
var canvas = document.querySelector('canvas');
var c = canvas.getContext('2d');
//c.canvas.height = 500;
//c.canvas.width = 750;

function spriteAnimator(imgCount,x,y,width,height,src){
  this.imgCount = imgCount;
  this.src = src;
  this.x = x;
  this.y = y;
  this.width = width;
  this.i = 0;
  this.height = height; 
  this.imagesStack = [];
  idle = new Image();
  idle.src = "Run/idle0.png"
  for(var i=0; i<this.imgCount; i++){
    this.imagesStack[i] = new Image();
    this.imagesStack[i].src = this.src +i+'.png';
  }
 
}

function platformBuilder(x,y,width,height,color){
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height; 
  this.color = color;
  this.i = 0;
}

function boxBuilder(x,y,width,height,color,imgCount){
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height; 
  this.color = color;
  this.imgCount = imgCount;
  this.i = 0;
  this.imageStack = [];
  for(var i=0; i<this.imgCount; i++){
    this.imageStack[i] = new Image();
    this.imageStack[i].src = 'Carry/Carry'+i+'.png';
  }
}

rectangle = {

  height:150,
  jumping:true,
  width:150,
  x:130, // center of the canvas
  x_velocity:0,
  y:0,
  y_velocity:0

};

controller = {

  left:false,
  right:false,
  up:false,
  space:false,
  keyListener:function(event) {

    var key_state = (event.type == "keydown")?true:false;

    switch(event.keyCode) {

      case 65:// left key
        controller.left = key_state;
      break;
      case 87:// up key
        controller.up = key_state;
      break;
      case 68:// right key
        controller.right = key_state;
      break;
      case 32: //space key
        controller.space = key_state; 
    }
      
  }

};



var zombie = new spriteAnimator(8,rectangle.x,rectangle.y,rectangle.width,rectangle.height, 'Run/Run');
var plat1 = new platformBuilder(430,298,220,20,'#4d4d4d');
var plat2 = new platformBuilder(45,147,70,28,'#4d4d4d');
var plat3 = new platformBuilder(517,130,213,25,'#4d4d4d');
var box1  = new boxBuilder(300, 256, 40, 40,'#272727',4);
platformBuilder.prototype.draw = function(c, elapsed){
  c.lineWidth = "4";
  c.fillStyle = this.color;
  c.fillRect(this.x, this.y, this.width, this.height);
  }

  boxBuilder.prototype.draw = function(c, elapsed){
  this.i += 10 * (elapsed/2500);
  if (this.i > (this.imgCount -1)){
    this.i = 0;} 
    c.lineWidth = "4";
  c.fillStyle = this.color;
  c.fillRect(this.x, this.y, this.width, this.height);
  let boxgap = box1.x - rectangle.x;
  
  if (boxgap > 30 && boxgap < 85 && controller.space == true){
    carrybox = true; 
  } else {
    carrybox = false;
  }
    
  if (carrybox == true && controller.left == false && controller.right == false){
      rectangle.x_velocity *= 0.8;
      box1.x = rectangle.x + 58;
      box1.y = rectangle.y + 20;
      c.drawImage(box1.imageStack[0],rectangle.x,rectangle.y,rectangle.width,rectangle.height);
    } 

    else if (carrybox == true && controller.right == true){
      rectangle.x_velocity *= 0.8;
      box1.x = rectangle.x + 58;
      box1.y = rectangle.y + 20;
      c.drawImage(box1.imageStack[Math.ceil(this.i)],rectangle.x,rectangle.y,rectangle.width,rectangle.height);
    } 

    else if(carrybox == true && controller.left == true){
      rectangle.x_velocity *= 0.8;
      box1.x = rectangle.x + 52;
      box1.y = rectangle.y + 20;
      c.save();
  c.translate(rectangle.x, rectangle.y);
  c.scale(-1,1);
  c.drawImage(box1.imageStack[Math.ceil(this.i)],-rectangle.width,0,rectangle.width,rectangle.height);
  c.setTransform(1,0,0,1,0,0);
  c.restore();
    }
  }

spriteAnimator.prototype.draw = function(c, elapsed){
  this.i += 10 * (elapsed/800);
  if (this.i > (this.imgCount -1)){
    this.i = 0;}
    if (controller.right == true && rectangle.jumping == false && carrybox == false){
  c.drawImage(this.imagesStack[Math.ceil(this.i)],rectangle.x,rectangle.y,rectangle.width,rectangle.height);
}
 
 else if (controller.left == true && rectangle.jumping == false && carrybox == false){
  c.save();
  c.translate(rectangle.x, rectangle.y);
  c.scale(-1,1);
  c.drawImage(this.imagesStack[Math.ceil(this.i)],-rectangle.width,0,rectangle.width,rectangle.height);
  c.setTransform(1,0,0,1,0,0);
  c.restore();
  } 

else if (carrybox == false){
  c.drawImage(idle,rectangle.x,rectangle.y,rectangle.width,rectangle.height);
}
};



function draw(c, elapsed){
    c.beginPath();
    c.clearRect(0,0, c.canvas.width, c.canvas.height);
if (buttonsPressed) {
    plat1.draw(c,elapsed);
  }
  plat2.draw(c, elapsed);
  plat3.draw(c, elapsed);
  box1.draw(c, elapsed);
  zombie.draw(c, elapsed);
    c.closePath();
}

var then = Date.now();
var now = 0; 
var elapsed = 0;

function loop(){
  now = Date.now();
    elapsed = now - then;
      then = now; 
  if (controller.up && rectangle.jumping == false && controller.space == false) {

    rectangle.y_velocity -= 16;
    rectangle.jumping = true;

  }

  if (controller.left) {

    rectangle.x_velocity -= 0.55;

  }

  if (controller.right) {

    rectangle.x_velocity += 0.55;

  }
  if(box1.y > 256 && controller.space == false){
    box1.y = 256;
  }

  if(rectangle.x < 0){
      controller.left = false;
      rectangle.x_velocity *= -1;
  }

    if(rectangle.x > canvas.width - 110){
      controller.right = false;
      rectangle.x_velocity *= -1;
  }
  
  rectangle.y_velocity += 1.5; // gravity
  if (box1.y <256){
  box1.y += 5;
}
  rectangle.x += rectangle.x_velocity;
  rectangle.y += rectangle.y_velocity;
  rectangle.x_velocity *= 0.9;// friction
  rectangle.y_velocity *= 0.9;// friction


  
  if (rectangle.y > 150 && rectangle.x <350 || rectangle.y > 150 && rectangle.x >350 && buttonsPressed == true) {

    rectangle.jumping = false;
    rectangle.y = 150;
    rectangle.y_velocity = 0;
  
  } 

  if (rectangle.x > 350 && rectangle.y > 300 && buttonsPressed == false 
    || rectangle.x <-20 || rectangle.x > canvas.width -93){
    alert('you died');
    document.location.reload();
    rectangle.x = 200;
    rectangle.y = 0;
  }

  if (box1.x > 338 && box1.x < 360 && box1.y == 256){
    buttonsPressed = true;
  } else{
    buttonsPressed = false;
  } 
  draw(c, elapsed);
  window.requestAnimationFrame(loop);
}

//c.drawImage("sprite/Walk (4).png",this.x,this.y,this.width,this.height);
window.addEventListener("keydown", controller.keyListener)
window.addEventListener("keyup", controller.keyListener);
//setInterval(loop, 90)
window.requestAnimationFrame(loop);