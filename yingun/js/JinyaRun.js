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
    imgUrl = "http://www.einino.net/yingun/img/3.png";
    lineLink = "http://www.einino.net/yingun/index.html";
    descContent = '贴吧研究院-“棍状物”测试！';
    shareTitle = '贴吧研究院-“棍状物”测试！';
    appid = '';
    var JinyaRun = function(){
        this.constuctor();
    };
    JinyaRun.prototype={
        x:0,
        y:0,
        timeLimit:300,//计时30秒
        resources:[],
        restTime:0,
        runTime:0,
        startFlag:false,
        canTouch:true,
        backgroundColor:[
            [51,204,255],
            [230,238,100],
            [238,136,100],
            [51,204,255],
            [140,189,92],
            [178,108,196],
            [178,108,166]
        ],
        backgroundColorIndex:0,
        canDeal:false,
        constuctor:function(){


            this.stage = $("#gameStage");
            this.context = this.stage[0].getContext( '2d' );
            this.timeCounter = $("#leftCounter");
            this.rightCounter = $("#rightCounter")
            this.dialog = $("#dialog");

            this.init();
        },
        init:function(){

            this.fullWindow();
            this.initResources();
            this.bindEvent();




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
              self.canTouch && self.startFlag &&  self.setGun();
                self.canTouch = false;
            }).on("touchmove",function(e){


            }).on("touchend",function(e){

                    //self.restart();
            });
            this.dialog.on("click","#restartGame",function(){
                self.restart();

				
            }).on("click","#startGame",function(){
                    self.start();
					
                    self.dialog.hide();
            }).on("click","#shareGame",function(){
					
                    shareTimeline()
                }).on("click",".contact",function(){
                
            });

        },
        initDraw:function(){

            this.backgroundColorIndex =0;

            var context = this.context;
            this.inject["drawBackground"] = [function(self){

                var ctx =self.context;
                ctx.clearRect( 0, 0,self.windowWidth, self.windowHeight);
                ctx.fillStyle = "rgb("+self.backgroundColor[self.backgroundColorIndex].join(",")+")";//填充背景色
                ctx.fillRect( 0, 0,self.windowWidth, self.windowHeight);
                var image = self.resizeImage(self.resources.background.image);
                ctx.drawImage(image,(self.windowWidth-image.width)/2,(self.windowHeight-image.height)/2,image.width,image.height);
            },this];
            context.lineJoin="round";//线段链接
            context.lineCap= "round";
        },
        initResources:function(){

            var l =  new JinyaLoading();
            var self = this;
            l.loadImage("img/finger.png","finger");
            l.loadImage("img/bg.png","background");
            l.loadImage("img/scan.png","scan");

            l.loadProcess(function(i,c){
                $("#Jinya_loading_process_body").css("width",100*(i/c).toFixed(1)+"%");
                $("#Jinya_loading_process_body").html(100*(i/c).toFixed(1)+"%");
            });
            l.loadDone (function(s){
                self.resources = s;
                $("#Jinya_loading_process_wrap").hide();
                self.initDraw();
                self.initScan()
                self.showTip();
                self.animate();
                self.start();
            })
            var ctx =self.context;
            ctx.clearRect( 0, 0,self.windowWidth, self.windowHeight);
            ctx.fillStyle = "rgb("+self.backgroundColor[self.backgroundColorIndex].join(",")+")";//填充背景色
            ctx.fillRect( 0, 0,self.windowWidth, self.windowHeight);



        },

        finger:{},
        showTip:function(){

            var fingerImage =this.resources["finger"].image;
            this.finger.pos =[0,0]

            ///this.drawImage(fingerImage.image);
            var self = this;
            var imglocatX = (self.windowWidth-fingerImage.width)-fingerImage.width;
            var imglocatY = (self.windowHeight-fingerImage.height)+fingerImage.height;
            this.finger.pos= [0,imglocatY];
            this.finger.delay = 100;
            var x =2;
            var y = 3*x;
            this.inject["tip_finger"] = [function(fingerImage){

                var context  = self.context;
                var pos = self.finger.pos;


                if( pos[0] >=(self.windowWidth-fingerImage.width)/2  ){

                    self.finger.delay--;
                    if(self.finger.delay <=0 ){
                         pos[0] =0;
                         pos[1] = (self.windowHeight-fingerImage.height)+fingerImage.height;
                        self.finger.delay = 180;
                    }

                }else{

                    pos[0]+=x;
                    pos[1]-=y;
                }
                context.drawImage(fingerImage, pos[0], pos[1],fingerImage.width, fingerImage.height);

            },fingerImage]
        },
        scan:{},
        initScan:function(){
            var scanImage =this.resizeImage(this.resources["scan"].image);
            this.scan.y = - scanImage.height;

            ///this.drawImage(fingerImage.image);
            var self = this;

            this.scan.speed=4;


            this.inject["scaning"] = [function(img){

                var context  = self.context;
                if(  self.scan.y >= self.windowHeight){

                   self.scan.y =- img.height;

                }else{
                   self.scan.y+=self.scan.speed;
                }
                context.drawImage(img,  0 , self.scan.y ,self.windowWidth, scanImage.height);

            },scanImage]

        },
        resizeImage:function(image,scale){
                if(!image){
                    return;
                }
                if(!scale) scale=1
                var _scale = image.width/image.height;
            if(this.windowWidth > this.windowHeight){
                image.height =this.windowHeight*scale;
                image.width =image.height*scale;

            }else{
                image.width =this.windowWidth*scale;
                image.height =image.width/scale;
            }
            return image



        },
        processbar:{},
        initProcessbar:function(){
            this.processbar.length=0;
            this.inject["drawProcessbar"] = [function(self){
                var ctx =self.context;

                ctx.fillStyle = "rgb("+self.backgroundColor[1].join(",")+")";//填充背景色;//填充背景色
                var l = self.windowWidth/6;
                ctx.fillRect( l, 30 ,self.processbar.length, 20);
                self.processbar.length++
                if(self.processbar.length >= l*4){
                    self.processbar.length =l*4
                    this.startFlag && self.end()
                }

            },this];
        },
        setGun:function(){
            this.inject["tip_finger"] =null;
            this.backgroundColorIndex =0;
            this.scan.speed=14;
            this.initProcessbar()
            /*this.inject["drawBackground"] = [function(self){
                var ctx =self.context;
                ctx.clearRect( 0, 0,self.windowWidth, self.windowHeight);
                ctx.fillStyle = "rgb("+self.backgroundColor[self.backgroundColorIndex].join(",")+")";//填充背景色
                ctx.fillRect( 0, 0,self.windowWidth, self.windowHeight);
                var image = self.resizeImage(self.resources.background.image);
                ctx.drawImage(image,(self.windowWidth-image.width)/2,(self.windowHeight-image.height)/2,image.width,image.height);
            },this];*/
        },

        start:function(){

            this.initEnv();
            this.rightCounter.html("贴吧研究院“棍状物”测试");


        },
        initEnv:function(){
            this.startFlag = true;
            this.runTime =0;
            this.restTime=0;
            this.canDeal = false;
            this.canTouch = true;
            //this.scan.y=0;
            this.inject["drawProcessbar"] = null;
            this.processbar.length=0


        },
        restart:function(){
            this.initEnv();

            this.initDraw();
            this.showTip();
            this.scan.speed=2;

            this.dialog.hide();
        },
        end:function(){
            var self = this;
            this.startFlag = false;
            setTimeout(function(){
                self.endAction()

            },1000);

        },
        endAction:function(){

            this.scan.speed = 2;
            this.backgroundColorIndex=0;
            this.inject["drawProcessbar"] = null;
            var title = this.resultList[Math.floor(Math.random()*4)].title;
            var html = ' <div><p>该物体经测试为'+title+'</p></div>'+
                '<div class="btn_wrapper"> <div id="shareGame" class="btn">右上角分享</div>'+
                '<div id="restartGame" class="btn">重新开始</div><p><a class="contact" href="http://tieba.baidu.com?fr=washbear" >百度贴吧，为兴趣而生</a></p>' +
                '</div>';
            shareTitle = "我被诊断为"+title;
            // this.startFlag = false;
            this.showDialog(html);
        },
        resultList:[
            {title:"淫棍"},
            {title:"恶棍"},
            {title:"棍中棍"},
            {title:"双截棍"}
        ],
        /*
        * 计时模块
        * */
        timeCounterGo:function(){
            var self = this;

            this.timeInterval = setInterval(function(){
                self.runTime++;
                //self.timeCounter.html("扫描中:"+((self.runTime*100)/3).toFixed(1));
                if(self.startFlag){
                    //do

                }
                if( self.runTime >= self.timeLimit){
                   //end
                }

            },100);
        },

        showDialog:function(html){
            var html =' <div class="dialog_container">'+html+
            '</div>';
            this.dialog.html(html);

            this.dialog.show();
        },
        /**
         *  清画布
         */
        clearCanvas:function(canvas){
            for ( var i =0 ; i < canvas.length; i++){
                var context = canvas[i][0].getContext('2d');
                // console.log("clear",0, 0,this.windowWidth, this.windowHeight)
                context.clearRect( 0, 0,this.windowWidth, this.windowHeight);

            }

        },
        /*
         * 动画引擎
         * 依赖 inject 对象
         */
        inject:[],
        /*
        *
        * this.inject["name"] = [function(){},arg1,arg2,....]
        * */
        animate_timestamp:0,
        animate_stop:false,
         animate:function(){
           // console.log(new Date().getTime() - this.animate_timestamp);
            if(! this.startFlag && this.animate_stop ) return;
            this.clearCanvas([this.stage]);
            for (var i in this.inject ){
                //console.log("animate:",i)
                /*
                 * [function(){},argv1,argv2...]
                 */
                this.inject[i]&&  this.inject[i][0].apply(this,this.inject[i].slice(1));//帧移动

            }
            var self = this;
             self.animate_timestamp= new Date().getTime();
            requestAnimationFrame(function(){  self.animate() });

        }
        


    };

    window.Game =new JinyaRun();
})();
//=============weixin
    