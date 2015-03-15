(function(){
    // for apple touchmove window
    document.addEventListener("touchmove",function(e){
        e.preventDefault();  
    });
    document.addEventListener("dbclick",function(e){
        e.preventDefault();  
    });
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
    var DevelopDeviceResolution = [ 384,640];
    var Run = function(){
        this.constuctor();
    };
    Run.prototype={
        x:0,
        y:0,
        timeLimit:60,//计时30秒
        resources:[],
        numCount:0,
        inject:[],
        process:[],
        restTime:0,
        runTime:60,
        startFlag:false,
        canTouch:true,
        backgroundColorIndex:0,
        canDeal:false,
        scores:0,
        heads:[],
        answer:"",
        constuctor:function(){
            this.stage = $("#container");
            this.canvas = $("#gameCanvas");
            this.timeCounter = $("#leftCounter");
            this.share = $("#share")
            this.dialog = $("#dialog");
            this.ctx = this.canvas[0].getContext("2d");
            this.init();
        },
        init:function(){
            this.fullWindow([this.canvas]);
            this.initResources();
            this.bindEvent();
        },
        fullWindow:function(canvas){
            this.windowWidth = $(window).width();
            this.windowHeight = $(window).height();
            this.canvasWidth = this.windowWidth*2;
            this.canvasHeight = this.windowHeight*2;

            $("#container").width(this.windowWidth);
            //不能用.width.height，否则比例拉伸
            this.share.css({width : this.windowWidth, height: this.windowHeight});
            this.stage.css({width : this.windowWidth, height: this.windowHeight});
            for( var i=0; i<canvas.length; i++){
                canvas[i][0].width = this.canvasWidth;
                canvas[i][0].height = this.canvasHeight;
                canvas[i].css({width : this.windowWidth, height: this.windowHeight});
            }

        },
        
        bindEvent:function(){
            var self = this;
            
            this.canvas.on("click",function(e){
                self.processControl(e);
            }).on("touchstart",function(e){
                //self.pointer.x = e.touches[0].pageX;
                self.processControl(e);
            }).on("touchmove",function(e){
                //self.pointer._x = e.touches[0].pageX;
                self.processControl(e);
            }).on("touchend",function(e){
                self.processControl(e);
            });

        },
        processControl:function(e){
            console.log(e)
            var self = this,target,relativePos;
            
            var length = this.getPosition(77)[0];
            if(e.type == "click"){
                relativePos = this.getWindowPosition(e.x,e.y);
               // console.log(relativePos)
                if(relativePos[0] > this.getWindowPosition(111)[0]
                    && relativePos[1] > this.getWindowPosition(0,494)[1]
                 && relativePos[0] < this.getWindowPosition(273)[0]
                 && relativePos[1] < this.getWindowPosition(0,555)[1]
                 && this.process.index == true
                 ){
                    this.process.index= false;
                    delete this.inject["index"];
                    self.drawGame();
                    self.countTime();
                    self.drawTime();
                    self.drawScore();
                    self.drawHead();
                }else if( relativePos[0] > this.getWindowPosition(75)[0]
                    && relativePos[1] > this.getWindowPosition(0,473)[1]
                    && relativePos[0]  < this.getWindowPosition(315)[0]
                    && relativePos[1] < this.getWindowPosition(0,513)[1]
                    && self.startFlag == false ){
                    self.restart();
                }else if( relativePos[0] > this.getWindowPosition(71)[0]
                    && relativePos[1] > this.getWindowPosition(0,511)[1]
                    && relativePos[0]  < this.getWindowPosition(315)[0]
                    && relativePos[1] < this.getWindowPosition(0,550)[1]
                    && self.startFlag == false ){
                    self.share.show();
                    setTimeout(function(){
                        self.share.hide();
                    },4000);

                   
                }
            }else if(e.type == "touchstart" ){
                target = e.touches[0];
                relativePos = this.getPosition(target.pageX,target.pageY);
                if(self.heads){
                    for( var i in self.heads){
                        var item = self.heads[i];
                        if( relativePos[0] > item.position[0]
                            && relativePos[1] > item.position[1]
                            && relativePos[0] < item.position[0]+length
                            && relativePos[1] < item.position[1]+length
                            ){
                            if(item.name == self.answer){
                                self.answer = self.heads[Math.floor(Math.random()*self.heads.length)].name
                                var diff =( self.getPosition(153)[0]- self.getPosition(78)[0])/2
                                self.drawBoom(item.position[0]-diff,item.position[1]-diff);
                               item.position = self.headPosition();
                               self.scores+=10;
                            }
                            console.log("touch:",item.name)
                        }
                    }
                }
            }

        },
        getPosition:function(x,y){
            var key = 0.63492;
            var raX  = x/DevelopDeviceResolution[0];
            var raY  = y/(DevelopDeviceResolution[0]/key);
            return [raX * this.canvasWidth, raY * (this.canvasWidth/ key) ];
        },
        getWindowPosition:function(x,y){
            var key = 0.63492;
            var raX  = x/DevelopDeviceResolution[0];
            var raY  = y/(DevelopDeviceResolution[0]/key);
            console.log(raX,raY)
            return [raX * this.windowWidth,raY * (this.windowWidth/ key) ];
        },
        initResources:function(){

            var l =  new JinyaLoading();
            var self = this;
            l.loadImage("img/index.jpg","index");
            l.loadImage("img/game.jpg","game");
            l.loadImage("img/sheep1.png","sheep1");
            l.loadImage("img/sheep2.png","sheep2");
            l.loadImage("img/fail.png","fail");
            l.loadImage("img/jolin.png","jolin");
            l.loadImage("img/bobeier.png","bobeier");
            l.loadImage("img/zhangmo.png","zhangmo");
            l.loadImage("img/fangzuming.png","fangzuming");
            l.loadImage("img/fengjie.png","fengjie");
            l.loadImage("img/loser.png","loser");
            l.loadImage("img/love.png","love");
            l.loadImage("img/wangzulan.png","wangzulan");
            l.loadImage("img/wangdazhi.png","wangdazhi");

            l.loadImage("img/yangchengang.png","yangchengang");

            l.loadImage("img/boom.png","boom");
            l.loadImage("img/wordwrap.png","wordwrap");

            l.loadImage("img/time.png","time");
            l.loadImage("img/score.png","score");
            l.loadImage("img/result1.jpg","result1");
            l.loadImage("img/result2.jpg","result2");
            l.loadImage("img/result3.jpg","result3");
            l.loadImage("img/share.png","share");


            l.loadProcess(function(i,c){
                self.stage.find(".loading").html("loading.. ("+100*(i/c).toFixed(1)+"%)");
            });
            l.loadDone (function(s){
                self.resources = s;

                for(var i in s){
                    if(i == "index" || i == "game" ||  i == "wordwrap" || i.indexOf("result") !="-1"){
                        self.resources[i].img = self.resizeImage(self.resources[i].image);
                    }
                }
                
                self.initData();
                
                self.start();
               
                

            })


        },
        
        initData:function(){
            var self = this;
            self.canTouch = true;
            this.resultArray= [];
            
            
        },
        drawBoom:function(x,y){
            var self = this;
            var resolution = this.getPosition(153)[0];
            this.inject["boom"] = [function(self){
                var image = self.resources["boom"].image;
                self.ctx.drawImage(image,x,y,resolution,resolution);
               
            },this];
            setTimeout(function(){
                delete self.inject["boom"]

            },1000)
        },
        drawIndex:function(){
            var self = this;
            this.inject["index"] = [function(self){
                var image = self.resources["index"].img;
                self.ctx.drawImage(image,0,0,image.width,image.height);
                self.ctx.fillStyle="#e0b13b";

                self.ctx.fillRect(0,image.height,self.canvasHeight,self.canvasWidth);
               
            },this];
        },
        drawTime:function(){
            var self = this;
            this.inject["time"] = [function(self){
               // var cutPos = self.getPosition(30,35);
                var setPos = self.getPosition(220,45);
                var size ;
                self.ctx.fillStyle="#FFF"
                //var image = self.resources["time"].image;
                self.ctx.fillText(self.runTime,setPos[0],setPos[1]);

            },this];

        },
        drawScore:function(){
            var self = this;
            this.inject["score"] = [function(self){
                var setPos = self.getPosition(220,77);
                
                var size ;
                var image = self.resources["score"].image;
                //console.log(setPos)
               // self.ctx.drawImage(image,cutPos[0],cutPos[1],55,55,setPos[0],setPos[1],55,55);
                self.ctx.fillText(self.scores,setPos[0],setPos[1]);

               // self.ctx.drawImage(image,0,0,image.width,image.height);
               
            },this];

        },
        drawGame:function(){
            var self = this;
            this.inject["game"] = [function(self){
                var image = self.resources["game"].img;
                self.ctx.fillStyle="#e0b13b";

                self.ctx.fillRect(0,image.height,self.canvasHeight,self.canvasWidth);
                self.ctx.drawImage(image,0,0,image.width,image.height);
               
            },this];

        },
        drawHead:function(){
            var self = this;
            var resolution = this.getPosition(76)[0];
            var position=[
                {x:Math.random()*400,y:100},
                {x:Math.random()*400,y:100},
                {x:Math.random()*400,y:100},
                {x:Math.random()*400,y:100},
            ];
            var speedBase = 2;
            var speedScal = 2;
            var heads=[
                { name:"绵羊", obj: self.resources["sheep1"],speed:speedBase+speedScal*Math.random(), position:this.headPosition(true) },
                { name:"草泥马",  obj: self.resources["sheep2"],speed:speedBase+speedScal*Math.random(), position:this.headPosition(true) },
                { name:"房祖名",  obj: self.resources["fangzuming"],speed:speedBase+speedScal*Math.random(), position:this.headPosition(true) },
                { name:"蔡依林",  obj: self.resources["jolin"],speed:speedBase+speedScal*Math.random(), position:this.headPosition(true) },
                { name:"包贝尔",  obj: self.resources["bobeier"],speed:speedBase+speedScal*Math.random(), position:this.headPosition(true) },
                { name:"凤姐",  obj: self.resources["fengjie"],speed:speedBase+speedScal*Math.random(), position:this.headPosition(true) },
                { name:"差劲",  obj: self.resources["loser"],speed:speedBase+speedScal*Math.random(), position:this.headPosition(true) },
                { name:"Love",  obj: self.resources["love"],speed:speedBase+speedScal*Math.random(), position:this.headPosition(true) },
                { name:"王大治",  obj: self.resources["wangdazhi"],speed:speedBase+speedScal*Math.random(), position:this.headPosition(true) },
                { name:"王祖蓝",  obj: self.resources["wangzulan"],speed:speedBase+speedScal*Math.random(), position:this.headPosition(true) },
                { name:"杨臣刚",  obj: self.resources["yangchengang"],speed:speedBase+speedScal*Math.random(), position:this.headPosition(true) },
                { name:"张默",  obj: self.resources["zhangmo"],speed:speedBase+speedScal*Math.random(), position:this.headPosition(true) },

            ];

            var exist = [];
            self.washCards(heads);
            this.heads = heads;
            this.answer = heads[5].name;
            var answerPos = this.getPosition(0,525);

            this.inject["head"] = [function(self,resolution){
                var image,i,j,item,tmp;
                for( i=0 ; i< self.heads.length; i++  ){
                   // console.log(heads[i])
                    item = heads[i];
                    image= item.obj.image;
                    self.ctx.drawImage(image,item.position[0],item.position[1],resolution,resolution);
                    item.position[1]+= item.speed;
                    
                    if(item.position[1] > self.canvasHeight){
                        item.position = self.headPosition();
                    }
                }
                self.ctx.fillStyle="#4e3903";
                self.ctx.textAlign="center";
                self.ctx.font="50px Yahei";
                self.ctx.drawImage(self.resources['wordwrap'].img,0,self.getPosition(0,319)[1],self.resources['wordwrap'].img.width,self.resources['wordwrap'].img.height);

                self.ctx.fillText(self.answer,self.canvasWidth/2,answerPos[1]);

            },this,resolution];
        },
        drawResult:function(num){
            num = this.scores;
            var self = this,text,index,content;
            if(num < 100){
                index = 1;
                text = "成绩偏差，"+num+"分";
                content="居然才！得！到！"+num+"分！！！放学你别跑、我保证不把你打哭！这种速度和精准性离到达“慧眼”得有N万条街的差距，你一定会加油提升“慧眼”值对不？赶紧再来爽一下吧~~"

            }else if( num<200){
                index = 2;
                text = "成绩普通，"+num+"分";
                content="提升空间很大，不过相信骚年你一定不会满足于现在"+num+"分的成绩！想要升级“慧眼”还需要“深度学习”提升速度和精准性哦~！骚年、要不再来约一发？"

            }else{
                index = 3;
                text = "成绩优秀"+num+"分";
                content="如此快速精准的从千万只喜羊羊中找出1只草泥马幼崽这种事显然只有目光如炬、天赋“慧眼”的你才能办得到嘛！得了"+num+"分的好成绩、骚年要不要考虑分享抽个奖？"

            }
            this.inject["result"+index] = [function(self){
                var image = self.resources["result"+index].img;
                self.ctx.drawImage(image,0,0,image.width,image.height);
                 self.ctx.fillStyle="#4e3903";
                self.ctx.textAlign="center";
                self.ctx.width= "300px";
                self.ctx.font="40px Yahei";
                self.ctx.fillText(text,self.canvasWidth/2,self.getPosition(0,250)[1]);
               // self.ctx.fillText(content,self.canvasWidth/2,self.getPosition(0,304)[1],250);

                self.ctx.fillStyle="#e0b13b";
                self.ctx.fillRect(0,image.height,self.canvasHeight,self.canvasWidth);
               self.startFlag = false;
               delete this.inject["result"+index];
            },this];
        
        },
        washCards:function(arr){
            var tmp,i,seed;
            for( i in arr){
                tmp = arr[i];
                seed = Math.floor(Math.random()*arr.length);
                arr[i] = arr[seed];
                arr[seed] = tmp;

            }
            return arr;
        },
        headPosition:function(init){
            //var pos=[12,90,170,260];
            var h ;
            if(init){
                h = -Math.random()*this.canvasHeight;

            }else{
               h= Math.random()*128
            }
            return [Math.random()*(this.getPosition(384-77)[0]) , h]

            /*
            var pos=[12,95,178,260];
            var i = Math.round(Math.random()*4);
            this.headPos[pos[i]] = true;
            return [ pos[i] , Math.random()*128]
            */
        },
        
        resizeImage:function(image,scale){
                if(!image){
                    return;
                }
                if(!scale) scale=1
                var _scale = image.width/image.height;
                 image.width = this.canvasWidth;
                 image.height =image.width/_scale;
           /* if(this.windowWidth / this.windowHeight > _scale){
                image.height =this.windowHeight*scale;
                image.width =image.height*_scale;

            }else{
                image.width =this.windowWidth*scale;
                image.height =image.width/_scale;
            }*/
            return image



        },

        start:function(){
            var self = this;
            this.drawIndex();
            this.initEnv();
            this.animate();
           

        },
        restart:function(){
            var self = this;
            this.drawIndex();
            this.initEnv();
            this.animate();
        },
        countTime:function(){
            var self = this;

            this.timeInterval = setInterval(function(){

                
                if(self.runTime ==0 ){

                    console.log("结束")
                    delete self.inject["game"];
                    delete self.inject["time"];
                    delete self.inject["score"];
                    delete self.inject["head"];

                    self.drawResult();
                    clearInterval(self.timeInterval);
                }
                self.runTime--;
            },1000);
        },
        initEnv:function(){
            this.startFlag = true;
            this.runTime= 1;
            this.scores = 0;
            this.process={};
            this.process.index = true;
            

        },

        end:function(){
            var self = this;
           
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
        animate:function(){
            console.log(this.startFlag);
            if(! this.startFlag) return;
            this.clearCanvas([this.canvas]);
            for (var i in this.inject ){
                //console.log("animate:",i)
                /*
                * [function(argv1,argv2){},argv1,argv2...]
                */
                this.inject[i][0].apply(this,this.inject[i].slice(1));//帧移动
            }
            FPS ++;
            var self = this;
            requestAnimationFrame(function(){ self.animate() });
        }


    };
    var showFPS=function(){
            FPS=0;
            setTimeout(function(){
                console.log("FPS:"+FPS);
                FPS =0;
                showFPS();
            },1000);
        }
    window.FPS = 0;

    window.Game =new Run();
    showFPS();
})();
//=============weixin
    