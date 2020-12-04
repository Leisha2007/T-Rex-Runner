var trex, trexRuns;
var ground, groundmoves, invisibleground;
var o1, o2, o3, o4, o5, o6;
var clouds, cloudimage, cloudgroup;
var gameOver, gameoverimage;
var restart, restartimage;
var collide, collideimage;
var play = 0;
var jump;
var die,a;
var checkpoint,obstaclegroup;
var score = 0;
var raptors_a1,raptors_a2;
var Raptors;
var raptorGroup;
var invisibleBackground;
var x,y;

function preload() {
  trexRuns = loadAnimation("trex1.png","trex3.png","trex4.png");
  groundmoves = loadImage("ground2.png");
  cloudimage = loadImage("cloud.png");
  o1 = loadImage("obstacle1.png");
  o2 = loadImage("obstacle2.png");
  o3 = loadImage("obstacle3.png");
  o4 = loadImage("obstacle4.png");
  o5 = loadImage("obstacle5.png");
  o6 = loadImage("obstacle6.png");
  gameoverimage = loadImage("gameOver.png");
  restartimage = loadImage("restart.png");
  collideimage = loadAnimation("trex_collided.png");
  jump = loadSound("jump.mp3");
  die = loadSound("die.mp3");
  checkpoint = loadSound("checkPoint.mp3");
  raptors_a1 = loadAnimation("Aviraptor_1.png", "Aviraptor_2.png");
  raptors_a2 = loadAnimation("Aviraptor_1.png");

}

function setup() {
  createCanvas(windowWidth, windowHeight);
  trex = createSprite(50, height-40, 20, 50);
  trex.addAnimation("runs", trexRuns);
  trex.addAnimation("collided", collideimage);
  trex.scale = 0.5;
  
  //ground = createSprite(width/2, height-20, width, 20);
  //ground.addImage(groundmoves);
  
  invisibleground = createSprite(width/2, height-10, width, 10);
  invisibleground.visible = false;
  
  cloudgroup = new Group();
  obstaclegroup = new Group();
  raptorGroup = new Group();
  
  gameOver = createSprite(width/2, height/2, 20, 20);
  gameOver.addImage(gameoverimage);
  gameOver.scale = 0.8;
  gameOver.visible = false;
  
  Restart = createSprite(width/2, (height/2)+40, 20, 20);
  Restart.addImage(restartimage);
  Restart.scale = 0.65;
  Restart.visible = false;
  
  a = 0;
  
  invisibleBackground = createSprite(width/2, height/2, width, height);
  invisibleBackground.visible = false;
  x=0;y=width;
}

function draw() {
  background("white");
  
  textSize(20);
  text("Score:" + score, width-100, 30);
  
  image(groundmoves,x,height-20,width,20);
  image(groundmoves,y,height-20,width,20);
  
  if (play == 0) {
    spawnclouds();
    spawnobstacles();
    spawnRaptors();
    x=x-5;
    y=y-5;
  if(x<=-width){
    x=width;
  }
    if(y<=-width){
      y=width;
    }
    if (frameCount % 60 == 0) {score = score + 1;}
    if (score % 10 == 0 && score > 0) {a = a + 1;}
    if (a == 55) {checkpoint.play();a = a + 1;}
    if (obstaclegroup.isTouching(trex) || raptorGroup.overlap(trex, stopRaptors)) {
      play = 1;
      die.play();
    }
    if ((keyDown("space")||touches.length>0) && trex.y > height-40) {
      trex.velocityY = -12;
      jump.play();
    }
    trex.velocityY = trex.velocityY + 0.5;

  } 
  else if (play == 1) {
    trex.velocityY=0;
    
    raptorGroup.overlap(invisibleBackground,stopRaptors)
    
    obstaclegroup.setVelocityXEach(0);
    obstaclegroup.setLifetimeEach(-1);
    
    cloudgroup.setVelocityXEach(0);
    cloudgroup.setLifetimeEach(-1);
    
    
    trex.changeAnimation("collided");
    
    gameOver.visible = true;
    Restart.visible = true;
    
    raptorGroup.setVelocityXEach(0);
    raptorGroup.setLifetimeEach(-1);
    
    if (mousePressedOver(Restart)||touches.length>0) {
      raptorGroup.destroyEach();
      cloudgroup.destroyEach();
      obstaclegroup.destroyEach();
      trex.changeAnimation("runs");
      gameOver.visible = false;
      Restart.visible = false;
      play = 0;
    }
  }

  trex.collide(invisibleground);
  drawSprites();

}

function spawnclouds() {
  if (frameCount % 60 == 0) {
    var clouds = createSprite(width, Math.round(random(10, height-100)), 20, 20);
    clouds.lifetime = width / 5;
    clouds.velocityX = -5;
    clouds.addImage(cloudimage);
    clouds.depth = trex.depth;
    trex.depth = trex.depth + 1;
    cloudgroup.add(clouds);
  }
}

function spawnobstacles() {
  if (frameCount % 100 == 0) {
    var o = Math.round(random(1, 6));
    var obstacles = createSprite(width, height-30, 30, 20);
    obstacles.velocityX = -3;
    obstacles.lifetime = width/3;
    switch (o) {
      case 1:
        obstacles.addImage(o1);
        obstacles.scale = 0.85;
        break;
      case 2:
        obstacles.addImage(o2);
        obstacles.scale = 0.8;
        break;
      case 3:
        obstacles.addImage(o3);
        obstacles.scale = 0.75;
        break;
      case 4:
        obstacles.addImage(o4);
        obstacles.scale = 0.65;
        break;
      case 5:
        obstacles.addImage(o5);
        obstacles.scale = 0.6;
        break;
      case 6:
        obstacles.addImage(o6);
        obstacles.scale = 0.6;
        break;
    }
    obstaclegroup.add(obstacles);
  }
}

function spawnRaptors() {
  if (frameCount % 60 == 0) {
    var r = createSprite(width, Math.round(random(10, height-50)), 20, 20);
    r.lifetime = width / 5;
    r.velocityX = -5;
    r.addAnimation("flying", raptors_a1);
    r.addAnimation("stop", raptors_a2);
    r.scale = 0.5;
    raptorGroup.add(r);
  }
}

function stopRaptors(s1, s2) {
  s1.changeAnimation("stop");
}