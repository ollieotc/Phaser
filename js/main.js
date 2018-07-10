window.onload = function(){


  var ground;    //地板
  var player;    // 玩家
  var platforms; // 地板及跳台 群組
  var cursors;   // 鍵盤控制
  var stars;     // 星星

  // 分數
  var score =0 ;
  var scoreText;

  var main = {
    preload : function(){
      console.log('preload');
      game.load.image('sky','assets/img/sky.png');
      game.load.image('ground','assets/img/platform.png');
      game.load.image('star','assets/img/star.png');
      game.load.spritesheet('dude','assets/img/dude.png', 32 ,48); // 寬 & 高
    },

    create : function(){
      // ------------- 開啟物理引擎 ARCADE 碰撞系統 ------------- //
      game.physics.startSystem(Phaser.Physics.ARCADE);
      game.add.sprite(0, 0, 'sky');

      // ------------- 地板及跳台 群組 ------------- //
      platforms = game.add.group();
      platforms.enableBody = true;   // 啟動群組的物理引擎的 body
      
      // ------------- 群組直接用create ------------- //
      var ground =  platforms.create( 0 , game.world.height-64 , 'ground'); 
      ground.body.immovable =true; // 設置該物體是固定的（true）還是不固定的（false）
      ground.scale.setTo(2,2);
      
      // ------------- 跳台 加上物理引擎 ------------- //
      var ledge = platforms.create(400, 400, 'ground');
      ledge.body.immovable = true;
      ledge = platforms.create(-150, 250, 'ground');
      ledge.body.immovable = true;

      /* 
      當在一個sprite上啟用了物理引擎後，該 sprite 就會擁有一個 body屬性 [物理屬性都是附加在 sprite 的 body 對象上]
      >> 物理屬性:
      1.速度velocity | 2.加速度acceleration | 3.阻力drag | 4.重力gravity | 5.彈跳bounce | ....其他
      */

      // ------------- 使用者 ------------- //
      player = game.add.sprite( 32 , game.world.height-150 , 'dude');
      game.physics.arcade.enable(player);  // 在使用者上啟用arcade物理引擎
      player.body.gravity.y= 150; // 在使用者加上重力
      player.body.collideWorldBounds = true; // 使用者碰撞世界邊界

      //  -------------  將使用者加上動畫 ------------- //
      // left”動畫使用0,1,2和3幀，並以每秒10幀運行，動畫循環表示“true”
      player.animations.add( 'left' , [0,1,2,3] , 10 , true );
      player.animations.add( 'right' , [5,6,7,8] , 10 , true );

      cursors = game.input.keyboard.createCursorKeys(); // 設定鍵盤輸入

      // ------------- 星星群組 ------------- //
      stars = game.add.group();
      stars.enableBody = true;
      // 創12顆星星
      for(var i = 0 ; i<12 ; i++){
        var star = stars.create(i *70 , 0 ,'star');
        star.body.gravity.y = 300; //加上重力
        star.body.bounce.y = 0.5+ Math.random() *0.2; //加上彈跳
      }
      // 顯示位置的座標 | 顯示文字 |css
      scoreText = game.add.text(16,16,' Score : 0 ', {fontSize:'23px', fill:'	#800000'})
    },

    update: function(){
      //collide方法會檢測兩個物體之間的碰撞，而且會產生碰撞的物理效果
      game.physics.arcade.collide(player,platforms);
      // 星星與地板加上碰撞
      game.physics.arcade.collide(stars,platforms);
      // 星星與使用者加上碰撞
      game.physics.arcade.overlap(player , stars , collectStar , null , this );
      // ------------- 偵測鍵盤 左右 ------------- //
      
      if(cursors.left.isDown){  // 向左
        player.body.velocity.x = -150; //速度velocity X軸的速度（正數往右，負數往左）
        player.animations.play('left');
      } else if(cursors.right.isDown){ //向右
        player.body.velocity.x = 150; //速度velocity X軸的速度（正數往右，負數往左）
        player.animations.play('right');
      } else {  // 不動
        player.body.velocity.x = 0; //速度velocity X軸的速度（正數往右，負數往左）
        player.frame =4; //停止時直接指定為第4幀
      }
      // ------------- 偵測鍵盤 上下  & 當遊戲接觸到底部時，執行跳躍------------- //
      if(cursors.up.isDown && player.body.touching.down){
        player.body.velocity.y = -230;
      }
      function collectStar(player , star){
        star.kill();  // 調用 kill，讓物件消失
        score += 10;  // 分數加10
        scoreText.text = 'Score : '+score;
      };
    },
  };

  var game = new Phaser.Game( 800 , 600 , Phaser.AUTO , 'gameDiv' ,);
  game.state.add('main' , main);
  game.state.start('main');
} 



