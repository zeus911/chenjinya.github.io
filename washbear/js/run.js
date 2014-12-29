(function(){
    // for apple touchmove window
    document.addEventListener("touchmove",function(e){
        e.preventDefault();  
    })
    window.requestAnimationFrame = (function(){
        return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          window.oRequestAnimationFrame      ||
          window.msRequestAnimationFrame     ||
          function(/* function */ callback, /* DOMElement */ element){
          window.setTimeout(callback, 1000 / 60);
        };
      })();
    imgUrl = "http://www.einino.net/washbear/img/bear.png";
    lineLink = "http://www.einino.net/washbear/index.html";
    descContent = '擦掉贴吧熊';
    shareTitle = '擦掉贴吧熊';
    appid = '';
    var Game = function(){
        this.constuctor();
        //this.eraseDone();
    };
    Game.prototype={
        x:0,
        y:0,
        strokeWidth:10,
        restTime:0,
        runTime:0,
        startFlag:false,
        eraserRange:[80, 142, 160, 160],
        backgroundColor:[
            [51,204,255],
            [230,238,100],
            [238,136,100],
            [51,204,255]
        ],
        backgroundColorIndex:0,
        canDeal:false,
        constuctor:function(){
            this.stage = $("#gameStage");
            this.timeCounter = $("#timeCounter");
            this.dialog = $("#dialog");
            this.init();
        },
        init:function(){

            this.fullWindow();
            this.bindEvent();
            
            this.initDraw();

        },
        fullWindow:function(){
            this.windowWidth = $(document).width();
            this.windowHeight = $(window).height();
            $("#container").width(this.windowWidth).height(this.windowHeight);
            //不能用.width.height，否则比例拉伸
            this.stage[0].width = this.windowWidth;
            this.stage[0].height = this.windowHeight;
            
           
        },
        bindEvent:function(){
            var self = this;
            this.stage.on("touchstart",function(e){
                //console.warn("touch start")
            }).on("touchmove",function(e){
                var target = e.touches[0];
                self.drawEraserLine(self.x,self.y,target.pageX,target .pageY)
                //self.drawEraserPointer(target .pageX,target .pageY)
                self.x = target.pageX;
                self.y = target.pageY;
                self.restTime =1;


            }).on("touchend",function(e){
                var target = e;
                self.x = target.pageX;
                self.y = target.pageY;
                self.restTime = 0 ;
                //console.warn(e)

            });
            this.dialog.on("click","#restartGame",function(){
                self.start();
                self.dialog.hide();
            }).on("click","#startGame",function(){
                    self.start();
                    self.dialog.hide();
            }).on("click","#shareGame",function(){
                    shareTimeline()
                })

        },
        initDraw:function(){
            this.stage[0].width=0;
            this.stage[0].height = 0;
            this.stage[0].width = this.windowWidth;
            this.stage[0].height = this.windowHeight;
            this.context = this.stage[0].getContext( '2d' );
            var context = this.context;

            context.clearRect( 0, 0,this.windowWidth, this.windowHeight);

            context.lineJoin="round";//线段链接
            context.lineCap= "round";
           // console.warn(this.windowHeight,this.windowWidth)
            context.fillStyle = "rgb("+this.backgroundColor[this.backgroundColorIndex].join(",")+")";//填充背景色
            context.fillRect( 0, 0,this.windowWidth, this.windowHeight);
            this.initBody();
        },

        initBody:function(){



            var self = this;
            if(!this.image){
                var image = new Image();
                image.src = "img/bear.png";
                image.onload = function() {
                    var scale = image.width/image.height;
                    image.width =self.windowWidth/1.5;
                    image.height =image.width/scale;
                    self.image = image;
                    self.drawImage(image);
                    self.infoDialog();
                    self.timeCounter.html("计时:0");
                }
            }else{
                this.drawImage(this.image);
            }


        },
        drawImage:function(image){
            var self =this;
            var context = this.context;
            var imglocatX = (self.windowWidth-image.width)/2;
            var imglocatY = self.windowHeight/4;
            //console.log(self.windowWidth,imglocatX,image.width)
            self.eraserRange=[imglocatX,imglocatY,image.width,image.height];
            //console.log(self.er)
           // console.log(self.eraserRange)
            context.drawImage(image, imglocatX, imglocatY,image.width, image.height);
           // context.fillRect( 0, 0,this.windowWidth, this.windowHeight);

        },
        drawEraserLine:function(sx,sy,ex,ey){

            var context = this.context;
            context.strokeStyle="rgb("+this.backgroundColor[this.backgroundColorIndex].join(",")+")";//划线颜色
            context.lineWidth=this.strokeWidth*2;
            if( this.restTime == 0){
                context.moveTo(ex,ey);//移动起点

            }
            context.lineTo(ex,ey);
            context.stroke();
        },
        drawEraserPointer:function(x,y){

            var context = this.context;
            context.fillStyle = 'rgb(255,255,255)';
            context.beginPath();
            context.arc( x, y, this.strokeWidth/2, 0, Math.PI * 2, true );
            context.closePath();
            context.fill();
        },
        orEraserAll:function(imgdata){
            return this.orAllClear(imgdata,this.backgroundColor[this.backgroundColorIndex]);

        },
        orAllClear:function(imgdata,color){
            var faltCount =0;//宽松度计数
            var faltLimit = 10;//宽松度
            var length = imgdata.data.length;
            var colorArray = color;
            var lines = length/4;
            var colorReduce = 10;//色差
            for ( var i =0; i<Math.floor(lines/2); i++ ){

               if(  (Math.abs(imgdata.data[i*4] - colorArray[0]) >colorReduce ) &&  (Math.abs(imgdata.data[i*4+1] -colorArray[1]) >colorReduce )&& (Math.abs(imgdata.data[i*4+2] - colorArray[2]) >colorReduce ) ){
                   faltCount++
                   if (faltCount > faltLimit){
                       return false
                   }

               }

            }
            for (  i =Math.floor(lines); i>=Math.floor(lines/2); i-- ){

                if(  (Math.abs(imgdata.data[i*4] - colorArray[0]) >colorReduce ) &&  (Math.abs(imgdata.data[i*4+1] -colorArray[1]) >colorReduce )&& (Math.abs(imgdata.data[i*4+2] - colorArray[2]) >colorReduce ) ){
                    faltCount++
                    if (faltCount > faltLimit){
                        return false
                    }

                }

            }

            //console.log(faltCount)
            return true;
        },
        start:function(){

            this.startFlag = true;
            this.backgroundColorIndex =this.runTime%3;
            this.runTime =0;
            this.restTime=0;

            this.canDeal = false;
            this.timeCounterGo();
            this.initDraw();
        },
        timeCounterGo:function(){
            var self = this;

            this.timeInterval = setInterval(function(){
                self.runTime++;
                self.timeCounter.html("计时:"+self.runTime);
                var imgData=self.context.getImageData(self.eraserRange[0],self.eraserRange[1],self.eraserRange[2],self.eraserRange[3]);
                //console.log(self.eraserRange)
                if(self.orEraserAll(imgData) ){
                    self.eraseDone();
                    //console.log(imgData)
                }
                if( self.runTime > 600){
                    self.eraseDone(1);
                }

            },100);
        },
        eraseDone:function(num){
            //console.warn("it;s clear")
            //this.context.closePath();
            clearInterval(this.timeInterval);
            var html = ' <div><p>成功擦掉了贴吧熊</p><p>耗时'+this.runTime/10+'秒</p></div>'+
                '<div class="btn_wrapper"> <div id="shareGame" class="btn">右上角分享</div>'+
                '<div id="restartGame" class="btn">重新开始</div><p><a class="contact" href="http://tieba.baidu.com" >百度贴吧，为兴趣而生</a></p>' +
                '<p><a class="contact" href="http://www.chenjinya.cn" >about</a></div>';
            if (num == 1){
                html = ' <div><p>真遗憾</p><p>没有擦掉贴吧熊</p></div>'+
                    '<div class="btn_wrapper"> <div id="shareGame" class="btn">右上角分享</div>'+
                    '<div id="restartGame" class="btn">重新开始</div><p ><a class="contact" href="http://tieba.baidu.com" >百度贴吧，为兴趣而生</a></p>' +
                    '<p><a class="contact" href="http://www.chenjinya.cn" >about</a></p></div>';
            }

            shareTitle = '我成功擦掉了贴吧熊,耗时'+this.runTime/10+'秒'
            this.startFlag = false;
            this.showDialog(html);
        },
        infoDialog:function(){
            var html = ' <div><p>擦掉贴吧熊</p><p>看谁时间短</p></div>'+
                '<div class="btn_wrapper"> <div id="startGame" class="btn">开始</div><div id="shareGame" class="btn">右上角分享</div><p><a class="contact" href="http://tieba.baidu.com" >百度贴吧，为兴趣而生</a></p>'+
                '</div>';
            this.showDialog(html);
        },
        showDialog:function(html){
            var html =' <div class="dialog_container">'+html+
            '</div>';
            this.dialog.html(html);
            this.dialog.show();
        },
        animate:function(){
            requestAnimationFrame(this.animate);
            //this.draw();

        }
        


    };

    window.Game =new Game();
})();
//=============weixin
    
