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
        giftsPosition:[


        ],
        randomPos:function(){
            var i = Math.floor(Math.random()*this.giftsPosition.length);
            var stop = false
            for(i; i< this.giftsPosition.length; i++){
                if(this.giftsPosition[i].set==false){
                    this.giftsPosition[i].set = true;
                    return this.giftsPosition[i];
                }
                if(i == this.giftsPosition.length -1 && stop == false){
                    i=0;
                    stop =true;
                }
            }
            return false;

        },
        backgroundColorIndex:0,
        canDeal:false,
        constuctor:function(){


            this.stage = $("#gameStage");
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

        },
        initResources:function(){
            var l =  new JinyaLoading();
            var self = this;
            //l.loadImage("img/finger.png","finger");
            //l.loadImage("img/bg.png","background");
            //l.loadImage("img/scan.png","scan");

            l.loadProcess(function(i,c){
                $("#Jinya_loading_process_body").css("width",100*(i/c).toFixed(1)+"%");
                $("#Jinya_loading_process_body").html(100*(i/c).toFixed(1)+"%");
            });
            l.loadDone (function(s){
                self.resources = s;
                $("#Jinya_loading_process_wrap").hide();

                self.initGifts();
                self.initCar();
                self.timeCounterGo();
                self.start();
            })

        },
        giftsIndex:0,
        giftsCount:0,
        initGifts:function(){
            this.gifts = [
                "img/mac.png",
                "img/nikon.png",
                "img/mac.png",
                "img/nikon.png",
                "img/iphone.png",
                "img/wine.png"
            ];
            var w= 100;
            var h =100;
            var c =0;
            for (var xi =0; xi<Math.floor( (this.windowWidth)/w); xi++ ){

                for (var yi =0; yi<Math.floor( (this.windowHeight-h)/w); yi++ ){

                    this.giftsPosition.push({num:c,x:xi*w,y:yi*h,set:false});
                    c++;
                }
            }
            for ( var i =0 ; i<5; i++){
               this.buildGift(this.gifts[i]);
            }
        },
        buildGift:function(img){
            var self = this;
            var w= 100;
            var h =100;
            // var x = w*1.2*Math.ceil(Math.random()*(this.windowWidth-w*1.2)/(w*1.2))-10;
            //var y =h*Math.ceil( Math.random()*(this.windowHeight-h-h-h) / h );
            var pos = this.randomPos();
            var x =pos.x;
            var y = pos.y;
            var c = pos.num;
            var id = "GIFT_"+this.giftsIndex;
            this.giftsIndex++;
            var $dom = $('<div id="'+id+'" data-id="'+c+'" class="gifts" >'+'<img class="gift-photo" src="'+img+'" />'+'</div>');
            $dom.css({left:x,top:y});
            this.stage.append($dom);


            $dom.on("touchstart",function(){

                if(self.runTime%7 ==0){
                    self.buildBoom();
                }
                self.buildGift(self.gifts[Math.floor(Math.random()*self.gifts.length)]);
                var c= $(this).attr("data-id");
                $(this).animate({top:self.car.top,left:self.car.left},500,function(){
                    $(this).remove();
                    self.rightCounter.html("购买:"+self.giftsCount+"个")
                    self.giftsCount++
                    for(var i =0; i<self.giftsPosition.length; i++){
                        if(self.giftsPosition[i].num == c ){
                            self.giftsPosition[i].set = false;
                        }
                    }
                });
            });

            // return {x:x,y:y,w:w,h:h};

        },
        buildBoom:function(){
            var self = this;
            var w= 100;
            var h =100;
            // var x = w*1.2*Math.ceil(Math.random()*(this.windowWidth-w*1.2)/(w*1.2))-10;
            //var y =h*Math.ceil( Math.random()*(this.windowHeight-h-h-h) / h );
            var x = Math.random()*(this.windowWidth-w*1.5);
            var y = Math.random()*(this.windowHeight-h-h-h);

            var $dom = $('<div  class="booms" ><img class="boom-photo" src="img/boom.png"/></div>');
            $dom.css({left:x,top:y});
            this.stage.append($dom);
            setTimeout(function(){
                $dom.remove();
            },5000);
            $dom.on("touchstart",function(){
               self.end();
            });

        },
        initCar:function(){
           this.buildCar();
        },

        buildCar:function(){
            var w= 100;
            var h =150;
            // var x = w*1.2*Math.ceil(Math.random()*(this.windowWidth-w*1.2)/(w*1.2))-10;
            //var y =h*Math.ceil( Math.random()*(this.windowHeight-h-h-h) / h );
            var x = (this.windowWidth-w)/2;
            var y = this.windowHeight-h;
            var id = "CAR";
            var $dom = $('<div id="'+id+'" class="car" ><img class="shopcar-photo" src="img/shopcar.png"/></div>');
            $dom.css({left:x,top:y});
            this.stage.append($dom)
            this.car ={}
            this.car.dom = $dom;
            this.car.top= y;
            this.car.left = x;
        },

        start:function(){

            this.initEnv();


        },
        initEnv:function(){
            this.startFlag = true;
            this.runTime =0;
            this.restTime=0;
            this.canDeal = false;
            this.canTouch = true;
            //this.scan.y=0;



        },
        restart:function(){
            this.initEnv();
            this.dialog.hide();
        },
        end:function(){
            var self = this;
            this.startFlag = false;
            setTimeout(function(){
                self.endAction()

            },500);

        },
        endAction:function(){


            this.backgroundColorIndex=0;

            var title = "";
            var html = ' <div><p>购买:'+this.giftsCount+'个</p></div>'+
                '<div class="btn_wrapper"> <div id="shareGame" class="btn">右上角分享</div>'+
                '<div id="restartGame" class="btn">重新开始</div><p></p>' +
                '</div>';
            shareTitle = title;
            // this.startFlag = false;
            this.showDialog(html);
        },
       
        /*
        * 计时模块
        * */
        timeCounterGo:function(){
            var self = this;

            this.timeInterval = setInterval(function(){
                self.runTime++;
                self.timeCounter.html("计时:"+((self.runTime/10)).toFixed(1));
                if(self.startFlag){
                    //do

                }
                if( self.runTime >= self.timeLimit){
                   //end
                    clearInterval(self.timeInterval);
                    self.end();
                }

            },100);
        },

        showDialog:function(html){
            var html =' <div class="dialog_container">'+html+
            '</div>';
            this.dialog.html(html);

            this.dialog.show();
        }
        


    };

    window.Game =new JinyaRun();
})();
//=============weixin
    