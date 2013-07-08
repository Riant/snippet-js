if(!this.JSON){this.JSON={};}
(function(){function f(n){return n<10?'0'+n:n;}
if(typeof Date.prototype.toJSON!=='function'){Date.prototype.toJSON=function(key){return isFinite(this.valueOf())?this.getUTCFullYear()+'-'+
f(this.getUTCMonth()+1)+'-'+
f(this.getUTCDate())+'T'+
f(this.getUTCHours())+':'+
f(this.getUTCMinutes())+':'+
f(this.getUTCSeconds())+'Z':null;};String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(key){return this.valueOf();};}
var cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta={'\b':'\\b','\t':'\\t','\n':'\\n','\f':'\\f','\r':'\\r','"':'\\"','\\':'\\\\'},rep;function quote(string){escapable.lastIndex=0;return escapable.test(string)?'"'+string.replace(escapable,function(a){var c=meta[a];return typeof c==='string'?c:'\\u'+('0000'+a.charCodeAt(0).toString(16)).slice(-4);})+'"':'"'+string+'"';}
function str(key,holder){var i,k,v,length,mind=gap,partial,value=holder[key];if(value&&typeof value==='object'&&typeof value.toJSON==='function'){value=value.toJSON(key);}
if(typeof rep==='function'){value=rep.call(holder,key,value);}
switch(typeof value){case'string':return quote(value);case'number':return isFinite(value)?String(value):'null';case'boolean':case'null':return String(value);case'object':if(!value){return'null';}
gap+=indent;partial=[];if(Object.prototype.toString.apply(value)==='[object Array]'){length=value.length;for(i=0;i<length;i+=1){partial[i]=str(i,value)||'null';}
v=partial.length===0?'[]':gap?'[\n'+gap+
partial.join(',\n'+gap)+'\n'+
mind+']':'['+partial.join(',')+']';gap=mind;return v;}
if(rep&&typeof rep==='object'){length=rep.length;for(i=0;i<length;i+=1){k=rep[i];if(typeof k==='string'){v=str(k,value);if(v){partial.push(quote(k)+(gap?': ':':')+v);}}}}else{for(k in value){if(Object.hasOwnProperty.call(value,k)){v=str(k,value);if(v){partial.push(quote(k)+(gap?': ':':')+v);}}}}
v=partial.length===0?'{}':gap?'{\n'+gap+partial.join(',\n'+gap)+'\n'+
mind+'}':'{'+partial.join(',')+'}';gap=mind;return v;}}
if(typeof JSON.stringify!=='function'){JSON.stringify=function(value,replacer,space){var i;gap='';indent='';if(typeof space==='number'){for(i=0;i<space;i+=1){indent+=' ';}}else if(typeof space==='string'){indent=space;}
rep=replacer;if(replacer&&typeof replacer!=='function'&&(typeof replacer!=='object'||typeof replacer.length!=='number')){throw new Error('JSON.stringify');}
return str('',{'':value});};}
if(typeof JSON.parse!=='function'){JSON.parse=function(text,reviver){var j;function walk(holder,key){var k,v,value=holder[key];if(value&&typeof value==='object'){for(k in value){if(Object.hasOwnProperty.call(value,k)){v=walk(value,k);if(v!==undefined){value[k]=v;}else{delete value[k];}}}}
return reviver.call(holder,key,value);}
text=String(text);cx.lastIndex=0;if(cx.test(text)){text=text.replace(cx,function(a){return'\\u'+
('0000'+a.charCodeAt(0).toString(16)).slice(-4);});}
if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,'@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,']').replace(/(?:^|:|,)(?:\s*\[)+/g,''))){j=eval('('+text+')');return typeof reviver==='function'?walk({'':j},''):j;}
throw new SyntaxError('JSON.parse');};}}());

tools = window.tools || {};
//重定义console对象;
(function(){
	window.console = (function(){
		if ( window.console ) {
			return window.console;
		} else {
			return { log:function() {} };
			// test code
			var $debug = $('<ul id="debug"><input type="button" value="clear" id="clear-debug"/><input type="button" value="pause" id="pause-debug"/></ul>');
			$debug.pause = true;
			$(function(){
				$debug.prependTo('body');
				$debug.on('dblclick','.remove',function(e) {
				    $(this).parent().remove();
				});
				$('#clear-debug').click(function() {
				    $debug.find('li').remove();
				});
				$('#pause-debug').click(function() {
				   	$debug.pause = !!$debug.pause;
				});
			})
			var console = {
				log : function( ) {
					$debug.pause && $debug.append( 
						['<li><span class="remove">$ su :&nbsp;</span>','</li>'].join(
							$.map(arguments,function( log ) {
								return ['<span>','</span>'].join( log );
							}).get().join('&nbsp;')
						)
					);
				}
			};
			return console;
		}
	})();
})();
//存取cookie
(function () {
		function parseCookie() {
			var cookies = {};
			$.each( document.cookie.split("; "), function( key, val){
				val.replace ( /^([^=]*)\=([^\;]*)/g, function( $, $1, $2 ) {
					cookies[$1] = $2;
				});
			});
			return cookies;
		}
		window.Cookie = function  ( key, value ) {
			if ( value === undefined ) {
				return parseCookie ()[key];
			} else if ( value === "" ) {
				document.cookie = key + "=" + value +"; expires=" + (new Date).toGMTString();
			} else {
				var curTime = new Date();
				document.cookie = key + "=" + value + "; expires=" + (new Date( curTime*2 )).toGMTString();
			} 
		}
	})();
//pop盒子模型
;(function(){
	tools.pop = {};
	//默认弹出框
	tools.pop.defaultPop = function(obj){
		$('body').pop({
			type : 'pop',
			html : obj.html||'',
			width : obj.width||400
		});
	}
	tools.pop.info = function(obj){
		$('body').pop({
			type : 'pop',
			html : '<div style="padding:20px;text-align:center;">'+ obj.html +'</div>'||'',
			width : obj.width ||300,
			sureShow:true
		});	
	}
	//waiting框
	tools.pop.waiting = function(){
		$('body').pop({
			type : 'waiting',
			html : 'loading...'
		});
	}
	//关闭waiting框
	tools.pop.waiting.close = function(){
		$('.pop-create-tipBox').remove();
		$('[_pop=mask_waiting]').remove();
	}
	//删除当前pop框
	tools.pop.closePop = function(id){
		$('#'+id).closest('[_pop=pop]').find('[_pop=close]').click();
	}
	/* param : 
		{
			html : '',
			width : 300,
			sureFun : function(){
	
			}
		}
	*/
	/*tools.pop.confirm({
		html : '成功',
		sureFun : function(){
			location.href=""
		}
	})*/
	//弹出confirm框
	tools.pop.confirm = function(obj){
		$('body').pop({
			type : 'pop-confirm',
			html : obj.html||'',
			width : obj.width||300,
			sureShow:true,//显示sure button;
			cancelShow:true,//显示cancel button;
			sureFun:obj.sureFun||function(){}//点击确定调用的函数
		});
	}
})();
// string helper
;(function () {
	// 计算content utf8长度;
	tools.getUTF8Length = function  ( str ) {
		var i = 0, code, len = 0;
		//处理IE和火狐的回车
		str += "";
		str = str.replace(/\r\n|\n/g,"*");
		for (; i < str.length; i++) {
			code = str.charCodeAt(i);
			if (code < 0x007f) {
				len += 1;
			} else if (code >= 0x0080 && code <= 0x07ff) {
				len += 2;
			} else if (code >= 0x0800 && code <= 0xffff) {
				len += 3;
			}
		}
		return len;
	}
	//计算ucs2长度
	tools.getUCS2Length = function( str ) {
	    var reg = /[^\x00-\x7f]/g;
		if(reg.exec(str)){
			return str.length*2;
		}else{
			return str.length;
		}
	}

	// 正则工具
	tools.haveIllegalChar = function  ( str ) {
		var reg = /[\“\/\:\'\*\?\”\<\>\|\\\;\"]/;
		return reg.test( str ) && ['IllegalChar'];
	}
	
	// Constraint 工具
	tools.checkIllegal = function  (  ) {
		return function  ( data ) {
			if ( tools.haveIllegalChar( data ) ) {
				return ['TOOLS_FOLD_NAME'];
			}
			return true;
		}
	};
	tools.checkUTF8Length = function  ( len, err ) {
		return function  ( data ) {
			if ( tools.getUTF8Length( data ) > len ) {
				return [ err || 'TOOLS_TOO_LONG', len];
			}
			return true;
		};
	}
	tools.checkUCS2Length = function  ( len, err ) {
		return function  ( data ) {
			if ( tools.getUCS2Length( data ) > len ) {
				return [ err || 'TOOLS_TOO_LONG', len];
			}
			return true;
		};
	}
	tools.ajax = function(obj){
		 $.ajax(
		           {
		              type:obj.type||'POST',//通常会用到两种：GET,POST。默认是：GET
		              data:obj.data||{},//参数传递
		              url:obj.url||'',//(默认: 当前页地址) 发送请求的地址
		              dataType:obj.dataType||'json',//预期服务器返回的数据类型。
		              beforeSend:obj.beforeSend||function(){}, //发送请求
		              success:obj.successCallback||function(){}, //请求成功
		              error:obj.errorCallback||function(){},//请求出错 
		              complete:obj.completeCallbacke||function(){}//请求完成
		              
		           }
		   );
	}
})()

;(function () {
	// 获取后缀
	tools.getExtName = function  ( string ) {
		return (string + '').split('.').pop();
	}
	// 获取全名
	tools.getBaseName = function  ( string ) {
		return (string + '')
			.split('#').pop()
			.split('?').pop()
			.split('/').pop()
			.split('\\').pop();
	}
})();
//文件上传
;(function () {
	window.uploadFile = function ( fileInfo, cb ){
		var loadFileName= $.trim($("#uploadFile").val());
		// var extName = loadFileName.split(".").pop();
		if ( null==loadFileName || ""==loadFileName ){
			//上传文件不能为空;
			return;
		}
		$.ajaxFileUpload({
			url: 'upload.action',
			secureuri:false,
			fileElementId:'uploadFile',
			success: function (msg){  				
				//解析object HTMLDocument文档信息
				var jsoninfo=$(msg).contents().text();

				//尝试解析数据
				try{
					var data=$.parseJSON(jsoninfo);   //解析json对象
				} catch(e){
					if ( jsoninfo.match(/null/) ) { // 路径有误
						data = { resultCode : "00000099" };
					} else if ( jsoninfo.match(/uportal\/swf_out/) ) {
						// 符合上传路径
						data = { 
							resultCode : '00000000',
							path : jsoninfo
						};
					}
				}
				
				var resultCode = data.resultCode;
				if ( !resultCode ) {
					//上传错误提示
				} else {
					if ( resultCode.slice(-2) === "00" ) {
						//
					} else {
						if ( data.resultCode === '00000009' ){ // session失效处理
							//session失效处理
						} else {
							//
						}
					}
				}
			},error :function  (  ) {
				//网络错误
			}
		});
		//清除等待框
	}
})();
//
(function () {
	//统计文本框输入的字符长度
	tools.wordCount=function(){
		$(document).on('click input propertychange keyup',"[wordCount]", function  ( e ) {
			// 对付ie 在用户输入时立刻响应
			if ( e.type == 'propertychange' ) {
				if ( e.originalEvent.propertyName != 'value' ) {
					return;
				}
			}
			var $self= $(this);
			var $parent = $self.parent();
			var $wrap;
			var type = $self.attr('wordCount');
			// 防止点击统计文字出现多重文字描述
			if( _(['showLen','currentLen','totalLen'])
					.indexOf( type ) != -1
			){
				return;
			}
			var wordCountArr	= $self.attr("wordCount").split(",");
			var wordCountTotLen = wordCountArr[0];//最大长度;
			var wordCountFlag   = wordCountArr[1];//表示(0表示短信,1表示彩信);
			var curLen=this.value;
			if(wordCountFlag=="0"){
				//短信
				curLen=tools.getUCS2Length(curLen);
			}else{
				//彩信
				curLen=tools.getUTF8Length(curLen);
			}
			if(!$parent.hasClass("wordCount-wrap")){
				$wrap=$self.wrap('<div class="input-dec-send-msg wordCount-wrap" style="width:'+$self.width()+'px;height:'+$self.height()+'px;position:relative;"></div>');
				$self.css({
					"display":"block",
					"overflow":"auto",
					"border":"0px",
					"background":"none",
					"width":'100%',
					"height":($self.height()-20)+"px",
					"position":"absolute",
					"left":"0px",
					"top":"0px"
				}).focus();
			}
			//防止重复生成字数框;
			if( $self.parent().find("[wordCount=showLen]").length==0){
				$self.parent()
					.append("<div style='\
						width:150px;\
						height:20px;\
						line-height:20px;\
						right:5px;\
						bottom:0;\
						position:absolute;\
						text-align:right;'\
					 wordCount='showLen'>\
					 <span wordCount='currentLen'>"+curLen+"</span>/\
					 <span wordCount='totalLen'>"+wordCountTotLen+"</span>\
					 </div>");
			}
		
			//tools.getUCS2Length for sms;
			//tools.getUTF8Length for mms;
			//对tab键进行替换处理;
			var regTab  = /\t/;
			var regTabg = /\t/g;
			if ( this.value.match ( regTab )  ){
				this.value = this.value.replace( regTabg,''); 
			}
			var $self = $(this);
			var $parent = $self.parent();
			var wordCountArr   = $self.attr("wordCount").split(",");
			var wordCountTotLen=wordCountArr[0];//最大长度;
			var wordCountFlag  =wordCountArr[1];//表示(0表示短信,1表示彩信);
			var curLen   	   =this.value;
			if(wordCountFlag=="0"){
				//短信
				curLen=tools.getUCS2Length(curLen);
			}else{
				//彩信
				curLen=tools.getUTF8Length(curLen);
			}
			//
			if(curLen>wordCountTotLen){
				$parent.find("[wordCount=currentLen]")
					.html("<em style='font-style:normal;color:red;'>"+curLen+"</em>");
			}else{
				$parent.find("[wordCount=currentLen]").html(curLen);
			}
		})
	}();
})();

(function(){
	tools.limitHeight = function ( $elem, height ){
		$elem = $( $elem );
		var lineHeight = $elem.css('lineHeight');
		lineHeight = parseInt( lineHeight == 'normal' ? $elem.css('fontSize') : lineHeight );
		if ( height < lineHeight ){
			height = lineHeight;
		}
		console.log( lineHeight );
		var text = $elem.text();
		$elem.data('originalContent', text );
		if ( $elem.height() > height ){
			while ( $elem.height() > height ){
				text = text.slice(0, -10);
				$elem.text( text + "..." );
			}
		}
	}
})();

//获取窗口可视化对象
;(function(){
	tools.getViewportInfo = (function (){
  	return  window.innerWidth != undefined 
  					? function(){
  						return { w : window.innerWidth, 
  										 h : window.innerHeight }; }
  	 			  : (document.documentElement && document.documentElement.clientWidth != undefined ) 
  	 			  ? function(){
  	 					return { w : document.documentElement.clientWidth,
  	 									 h : document.documentElement.clientHeight }; }
  	 				: function(){
  	 					return { w : document.body.offsetWidth,
  	 									 h : document.body.offsetHeight }; }
  })();
})();

// tools.session, deal with ie7
(function ($) {
	tools.session = {};

	var loadData;
	var refreshSessionMap;

	if ($.browser.msie) {
		loadData = function () {
			var apd;
			try {
				apd = window.name != "" ? 
						JSON.parse( window.name ) :
						{};
			} catch (e) {}
			
			if ( apd != undefined && typeof apd == "object") {
				tools.sessionMap = $.extend({}, apd)
			}
		};
		refreshSessionMap = function () {
			var tempData = {};
			var len = 0;
			var key;
			for ( key in tools.sessionMap) {
				if ( tools.sessionMap.hasOwnProperty(key) ) {
					tempData[key] = tools.sessionMap[key];
				};
			}
			window.name = JSON.stringify(tempData);
		};
	} else {
		loadData = function() {
			// other browser
			if ( sessionStorage.uxeSessionMap ) {
				tools.sessionMap = $.parseJSON ( sessionStorage.uxeSessionMap );
			} else {
				tools.sessionMap = {};
				sessionStorage.uxeSessionMap = '{}';
			}
		};
		refreshSessionMap = function () {
			sessionStorage.uxeSessionMap = JSON.stringify(tools.sessionMap);
		};
	}
	// init
	loadData();

	tools.session.set = function (key, value) {
		tools.sessionMap[key] = value;
		refreshSessionMap();
	};
	tools.session.get = function (key) {
		return tools.sessionMap[key]
	};
	tools.session.del = function (key) {
		tools.sessionMap[key] = null;
		refreshSessionMap();
	};
	// 更新session缓存
	tools.session.update = function  ( key, updater) {
		var data =  tools.sessionMap[key];
		if ( data != undefined ) {
			// 遍历指定data
			$.each(data,updater);
			refreshData();
		};
	};
	tools.session.destroy = function () {
		tools.sessionMap = {};
		refreshSessionMap();
	};
})(jQuery);
