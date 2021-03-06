!(function($,window,document,navigator){"use strict";var pluginName="vide",defaults={volume:1,playbackRate:1,muted:true,loop:true,autoplay:true,position:"50% 50%",posterType:"detect",resizing:true},isIOS=/iPad|iPhone|iPod/i.test(navigator.userAgent),isAndroid=/Android/i.test(navigator.userAgent);function parseOptions(str){var obj={},delimiterIndex,option,prop,val,arr,len,i;arr=str.replace(/\s*:\s*/g,":").replace(/\s*,\s*/g,",").split(",");for(i=0,len=arr.length;i<len;i++){option=arr[i];if(option.search(/^(http|https|ftp):\/\//)!==-1||option.search(":")===-1)
{break;}
delimiterIndex=option.indexOf(":");prop=option.substring(0,delimiterIndex);val=option.substring(delimiterIndex+1);if(!val){val=undefined;}
if(typeof val==="string"){val=val==="true"||(val==="false"?false:val);}
if(typeof val==="string"){val=!isNaN(val)?+val:val;}
obj[prop]=val;}
if(prop==null&&val==null){return str;}
return obj;}
function parsePosition(str){str=""+str;var args=str.split(/\s+/),x="50%",y="50%",len,arg,i;for(i=0,len=args.length;i<len;i++){arg=args[i];if(arg==="left"){x="0%";}else if(arg==="right"){x="100%";}else if(arg==="top"){y="0%";}else if(arg==="bottom"){y="100%";}else if(arg==="center"){if(i===0){x="50%";}else{y="50%";}}else{if(i===0){x=arg;}else{y=arg;}}}
return{x:x,y:y};}
function findPoster(path,callback){var onLoad=function(){callback(this.src);};$("<img src='"+path+".gif'>").load(onLoad);$("<img src='"+path+".jpg'>").load(onLoad);$("<img src='"+path+".jpeg'>").load(onLoad);$("<img src='"+path+".png'>").load(onLoad);}
function Vide(element,path,options){this.$element=$(element);if(typeof path==="string"){path=parseOptions(path);}
if(!options){options={};}else if(typeof options==="string"){options=parseOptions(options);}
if(typeof path==="string"){path=path.replace(/\.\w*$/,"");}else if(typeof path==="object"){for(var i in path){if(path.hasOwnProperty(i)){path[i]=path[i].replace(/\.\w*$/,"");}}}
this.settings=$.extend({},defaults,options);this.path=path;this.init();}
Vide.prototype.init=function(){var vide=this,position=parsePosition(vide.settings.position),sources,poster;vide.$wrapper=$("<div>").css({"position":"absolute","z-index":-1,"top":0,"left":0,"bottom":0,"right":0,"overflow":"hidden","-webkit-background-size":"cover","-moz-background-size":"cover","-o-background-size":"cover","background-size":"cover","background-repeat":"no-repeat","background-position":position.x+" "+position.y});poster=vide.path;if(typeof vide.path==="object"){if(vide.path.poster){poster=vide.path.poster;}else{if(vide.path.mp4){poster=vide.path.mp4;}else if(vide.path.webm){poster=vide.path.webm;}else if(vide.path.ogv){poster=vide.path.ogv;}}}
if(vide.settings.posterType==="detect"){findPoster(poster,function(url){vide.$wrapper.css("background-image","url("+url+")");});}else if(vide.settings.posterType!=="none"){vide.$wrapper.css("background-image","url("+poster+"."+vide.settings.posterType+")");}
if(vide.$element.css("position")==="static"){vide.$element.css("position","relative");}
vide.$element.prepend(vide.$wrapper);if(!isIOS&&!isAndroid){sources="";if(typeof vide.path==="object"){if(vide.path.mp4){sources+="<source src='"+vide.path.mp4+".mp4' type='video/mp4'>";}
if(vide.path.webm){sources+="<source src='"+vide.path.webm+".webm' type='video/webm'>";}
if(vide.path.ogv){sources+="<source src='"+vide.path.ogv+".ogv' type='video/ogv'>";}
vide.$video=$("<video>"+sources+"</video>");}else{vide.$video=$("<video>"+
"<source src='"+vide.path+".mp4' type='video/mp4'>"+
"<source src='"+vide.path+".webm' type='video/webm'>"+
"<source src='"+vide.path+".ogv' type='video/ogg'>"+
"</video>");}
vide.$video.css("visibility","hidden");vide.$video.prop({autoplay:vide.settings.autoplay,loop:vide.settings.loop,volume:vide.settings.volume,muted:vide.settings.muted,playbackRate:vide.settings.playbackRate});vide.$wrapper.append(vide.$video);vide.$video.css({"margin":"auto","position":"absolute","z-index":-1,"top":position.y,"left":position.x,"-webkit-transform":"translate(-"+position.x+", -"+position.y+")","-ms-transform":"translate(-"+position.x+", -"+position.y+")","transform":"translate(-"+position.x+", -"+position.y+")"});vide.$video.bind("loadedmetadata."+pluginName,function(){vide.$video.css("visibility","visible");vide.resize();vide.$wrapper.css("background-image","none");});vide.$element.bind("resize."+pluginName,function(){if(vide.settings.resizing){vide.resize();}});}};Vide.prototype.getVideoObject=function(){return this.$video?this.$video[0]:null;};Vide.prototype.resize=function(){if(!this.$video){return;}
var
videoHeight=this.$video[0].videoHeight,videoWidth=this.$video[0].videoWidth,wrapperHeight=this.$wrapper.height(),wrapperWidth=this.$wrapper.width();if(wrapperWidth/videoWidth>wrapperHeight/videoHeight){this.$video.css({"width":wrapperWidth+2,"height":"auto"});}else{this.$video.css({"width":"auto","height":wrapperHeight+2});}};Vide.prototype.destroy=function(){this.$element.unbind(pluginName);if(this.$video){this.$video.unbind(pluginName);}
delete $[pluginName].lookup[this.index];this.$element.removeData(pluginName);this.$wrapper.remove();};$[pluginName]={lookup:[]};$.fn[pluginName]=function(path,options){var instance;this.each(function(){instance=$.data(this,pluginName);if(instance){instance.destroy();}
instance=new Vide(this,path,options);instance.index=$[pluginName].lookup.push(instance)-1;$.data(this,pluginName,instance);});return this;};$(document).ready(function(){$(window).bind("resize."+pluginName,function(){for(var len=$[pluginName].lookup.length,i=0,instance;i<len;i++){instance=$[pluginName].lookup[i];if(instance&&instance.settings.resizing){instance.resize();}}});$(document).find("[data-"+pluginName+"-bg]").each(function(i,element){var $element=$(element),options=$element.data(pluginName+"-options"),path=$element.data(pluginName+"-bg");$element[pluginName](path,options);});});})(window.jQuery,window,document,navigator);