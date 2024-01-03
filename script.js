window.onload = function(){
  // var sound = document.getElementById("sound");
  // sound.play();
  var end = document.getElementById("end");
  var c = document.querySelector("canvas");
  var canvas = document.querySelector("canvas");
  c.width = innerWidth;
  c.height = innerHeight;
  c = c.getContext("2d");
  function startGame(){
  mouse = {
    x: innerWidth/2,
    y: innerHeight-33
  };
    
  touch = {
    x: innerWidth/2,
    y: innerHeight-33
  };
    
  canvas.addEventListener("mousemove", function(event){
  mouse.x = event.clientX;
  });
  canvas.addEventListener("touchmove", function(event){
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;
    var touch = event.changedTouches[0];
    var touchX = parseInt(touch.clientX);
    var touchY = parseInt(touch.clientY) - rect.top - root.scrollTop;
    event.preventDefault();
    mouse.x = touchX;
    mouse.y = touchY;
  });
  var player_width = 32;
  var player_height = 32;
  var playerImg = new Image();
  var score = 0;
  var health = 100;
  playerImg.src = "./pha.png";
  
  var _bullets = []; 
  var bullet_width = 10;
  var bullet_height = 10;
  var bullet_speed = 10;
  var bulletImg = new Image();
  bulletImg.src = "./pha.png";

  var _enemies = []; 
  var enemyImg = new Image();
  enemyImg.src = "nhat.png"
  var enemy_width = 40;
  var enemy_height = 40;

  var _healthkits = []; 
  var healthkitImg = new Image();
  healthkitImg.src = "heart.png";
  var healthkit_width = 32;
  var healthkit_height = 32;
  
  function Player(x, y, width, height){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    
    this.draw = function(){
      c.beginPath();
      c.drawImage(playerImg, mouse.x-player_width, mouse.y-player_height); 
    };
    
    this.update = function(){
      this.draw();
    };
  }
  
  function Bullet(x, y, width, height, speed){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = speed;
    
    this.draw = function(){
      c.beginPath();
      // c.drawImage(this.image, this.x, this.y, this.width, this.height);
      c.rect(this.x, this.y, this.width, this.height);
      c.fillStyle = "white";
      c.fill();
    };
    
    this.update = function(){
      this.y -= this.speed;
      this.draw();
    };
  }
  
  function Enemy(x, y, width, height, speed){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = speed;
    
    this.draw = function(){
      c.beginPath();
      c.drawImage(enemyImg, this.x, this.y);
    };
    
    this.update = function(){
      this.y += this.speed;
      this.draw();
    };
  }
  
  function Healthkit(x, y, width, height, speed){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = speed;
    
    this.draw = function(){
      c.beginPath();
      c.drawImage(healthkitImg, this.x, this.y);
    };
    
    this.update = function(){
      this.y += this.speed;
      this.draw();
    };
  }
    
  var __player = new Player(mouse.x, mouse.y, player_width, player_height);
  
  function drawEnemies(){
    for (var _ = 0; _<4; _++){ 
      var x = Math.random()*(innerWidth-enemy_width);
      var y = -enemy_height; 
      var width = enemy_width;
      var height = enemy_height;
      var speed = Math.random()*2;
      var __enemy = new Enemy(x, y, width, height, speed);
      _enemies.push(__enemy);
    }
  }setInterval(drawEnemies, 3000);
    
  function drawHealthkits(){
    for (var _ = 0; _<1; _++){   
      var x = Math.random()*(innerWidth-enemy_width);
      var y = -enemy_height; 
      var width = healthkit_width;
      var height = healthkit_height;
      var speed = Math.random()*2.6;
      var __healthkit = new Healthkit(x, y, width, height, speed);
      _healthkits.push(__healthkit); 
    }
  }setInterval(drawHealthkits, 15000);

  function fire(){ 
    for (var _ = 0; _<1; _++){
      var x = mouse.x-bullet_width/2;
      var y = mouse.y-player_height;
      var __bullet = new Bullet(x, y, bullet_width, bullet_height, bullet_speed);
      _bullets.push(__bullet);
    }
  }setInterval(fire, 200);
    
  canvas.addEventListener("click", function(){
  });
    
  function collision(a,b){
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
  }
  c.font = "1em Arial";
  
  function stoperror() {
    return true;
  }  
  window.onerror = stoperror;

  function animate(){
    requestAnimationFrame(animate); 
    c.beginPath(); 
    c.clearRect(0,0,innerWidth,innerHeight); 
    c.fillStyle = 'white';
    c.font = "1.5em Arial";
    c.fillText("Health: " + health, 5, 20); 
    c.fillText("yêu Ngân: x" + score, 5, 60); 
    
    __player.update();

    for (var i=0; i < _bullets.length; i++){
      _bullets[i].update();
      if (_bullets[i].y < 0){
        _bullets.splice(i, 1);
      }
    }

    for (var k=0; k < _enemies.length; k++){
      _enemies[k].update();
      if(_enemies[k].y > innerHeight){
        _enemies.splice(k, 1);
        health -= 10;
      if(health == 0){
        // end.style.display = "block"
        alert("You lose but i still love you <3");
        startGame();
       }
      }
    }
  
    for(var j = _enemies.length-1; j >= 0; j--){
      for(var l = _bullets.length-1; l >= 0; l--){
        if(collision(_enemies[j], _bullets[l])){
          _enemies.splice(j, 1);
          _bullets.splice(l, 1);
          score++;
        }
      }
    }
    
    for(var h=0; h < _healthkits.length; h++){
      _healthkits[h].update();
    }
    for(var hh = _healthkits.length-1; hh >= 0; hh--){
      for(var hhh = _bullets.length-1; hhh >= 0; hhh--){
        if(collision(_healthkits[hh], _bullets[hhh])){
          _healthkits.splice(hh, 1);
          _bullets.splice(hhh, 1);
          health += 10;
        }
      }
    } 
    
  }
  animate();
  }startGame();
  }; 