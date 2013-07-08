/*
 * name: pop;
 * author: licuiting;
 * email: 250602615@qq.com;
 * date: 2012-4-25;
 * version: 1.0;
 * 弹出组件;
 *
 *
 *
 */
 (function ($) {
	$.fn.pop = function(option, settings){
		if(typeof option === 'object'){
			//创建主体
			settings = option;
		}else if(typeof option == 'string'){
			var data = this.data('_pop');
			//通过配置方法名调用组件内部方法
			if(data){
				if(data.s[option] !== undefined&&typeof data.s[option] ==="function"){
					data.s[option](settings||"");
				}else if(data[option] !== undefined&&typeof data[option] ==="function"){
					data[option](settings||"");
				}
				
			}
			return false;
		}
		
		settings = $.extend({
			type:"pop",/* 弹出框分类:
								1.pop普通弹框(用于加载界面);
								2.pop-confirm(用于选择);
								3.pop-success(正确);
								4.pop-error(错误);
								5.waiting(显示等待);
								6.waiting-success;
								7.waiting-error*/
			showMask:true,//是否显示遮罩层;
			showInnerMask:true,//是否显示底层弹出框的遮罩层;
			width:460,//注意设置不能带单位,不加引号;
			height:'',//注意设置不能带单位,不加引号;
			title:'',
			html:'',//弹出框里面的内容;
			sureTxt:"确定",//sureButton上面的文字;
			cancelTxt:"取消",//cancelButton上面的文字;
			defaultTxt:"默认",//cancelButton上面的文字;
			sureShow:false,//显示sure button;
			cancelShow:false,//显示cancel button;
			defaulShow:false,//显示default button；
			closeShow:true,//显示close button(有上角关闭按钮);
			sureFun:function(){},//点击sure执行的函数;
			cancelFun:function(){},//点击calcel执行的函数;
			defaultFun:function(){},//点击default执行的函数;
			closeFun:function(){}//点击close按钮执行的函数;
		}, settings || {});

		// 是否显示按钮列
		settings.buttonShow = settings.buttonShow != undefined ? 
								settings.buttonShow :
								( settings.defaulShow || settings.cancelShow || settings.sureShow );
		var arrV=$(this);

		return this.each(function(){
			var pop = new Pop(settings,$(this));
			$(this).data('_pop',pop);
			var elem=$(this);
			var popType=pop.s.type;
				if(popType.indexOf("-")>0){
					popType=popType.split("-")[0];
				}

			//第一层弹出框显示底层遮罩,其他的遮罩只遮住上一层;
			
			pop.pop_mask();
			//生成弹出层;
			if(popType=="pop"){
				//普通弹出框;
				pop.pop_div();
			}else if(popType=="waiting"){
				//waiting框;
				pop.pop_div_info();
			}
			return pop;
		});
	}

	/**
	 * class 定义
	 */
	function Pop(settings,o){
		this.s = settings;// operate
		this.o=o;// self
		return this;
	}

	/*
	 * prototype
	 */
	Pop.prototype ={
		
		pop_div:function(){
			var elem=this;
			var prevObj;
			var typeVal=elem.s.type;
			var str='';
				str+='<div class="pop-div" _pop="pop" >';
				str+='<div class="pop-div-mask" _pop="popM" style="display:none;"></div>';
				str+='<div class="pop-div-top" _pop="pop_h" style="-moz-user-select:none;user-select:none;" onselectstart="return false;">';
				str+='<div class="inner">'+this.s.title+'</div>';
				if(elem.s.closeShow){
					str+='<div class="pop-div-top-close" _pop="close"></div>';
				}
				str+='</div>';

				str+='<div class="pop-div-content">';
				str+='<div class="inner">';
				str+='<div class="inner-content" _pop="pop_c">';
				//根据不同的type显示不同的弹出框;
				if(typeVal.indexOf("-")>0){
					typeVal=typeVal.split("-")[1];
					str+='<p class="pop-cont">';
					str+='<em class="pop-ico-'+typeVal+'"></em>';
					str+='<span class="ico-txt" style="max-width:240px;_width:240px;text-align:left;">'+elem.s.html+'</span>';
					str+='</p>';
				}else{
					str+='<div>'+elem.s.html+'</div>';
				}
				if(elem.s.buttonShow){
					str+='<p class="btn" style="-moz-user-select:none;user-select:none;" onselectstart="return false;">';
					
					if(elem.s.defaultShow){
						str+='<a _pop="default" class="pop-button" style="margin-right:10px;"><span>'+ elem.s.defaultTxt+'</span></a>';
					}
					if(elem.s.sureShow){
						str+='<a _pop="sure" class="pop-button"><span>'+ elem.s.sureTxt+'</span></a>';
					}
					if(elem.s.cancelShow){
						str+='<a _pop="cancel" class="pop-button" style="margin-left:10px;"><span>'+ elem.s.cancelTxt +'</span></a>';
					}

					str+='</p>';
				}
				str+='</div>';
				str+='</div>';
				str+='</div>';

				str+='<div class="pop-div-footer" _pop="pop_f">';
				str+='<div class="inner"></div>';
				str+='</div>';

				str+='</div>';
			
				this.$div=$(str).appendTo('body');
			//
			if((typeof this.s.height).toLowerCase()==="number"){
				this.$div.find("[_pop=pop_c]").height(this.s.height-this.$div.find("[_pop=pop_h]").height()-this.$div.find("[_pop=pop_f]").height());
			}
			var $doc = $(document);

			var scrollL = $doc.scrollLeft();
			var scrollT = $doc.scrollTop();

			var viewport= this.getViewportInfo();

			var t = scrollT + (viewport.h - this.$div.height())/2;
			var l = scrollL + (viewport.w - this.s.width)/2;

			t = Math.max( 0 , t );
			l = Math.max( 0 , l );

			this.$div.width(this.s.width).css({
				top  			: t,
				left 			: l,
				'z-index' : '999',
				'position': 'absolute'
			});

			//
			//显示底层弹出框的内部遮罩;
			if(elem.s.showInnerMask){
				prevObj=this.$div.prev("[_pop=pop]");
				if(prevObj.length!=0){
					prevObj.find("[_pop=popM]").width(prevObj.width()).height(prevObj.height()).css({
						opacity:0.1, 
						background:"#000",
						zIndex:1000
					}).show();	
				}
			}
			//给控件绑定事件;
			this.pop_event();
		},
		getViewportInfo:(function(){
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
		})(),
		//成功失败提示框
		pop_div_info:function(){
			var widthV;
			var heightV;
			var elem=this;
			var typeVal=elem.s.type;
			if(typeVal.indexOf("-")>0){
				typeVal=typeVal.split("-")[1];
			}
			var str="";
				str+="<div class='pop-create-tipBox'>";
				if(typeVal!="waiting"){
					str+="<div class='pop-create-tipBox-left pop-create-tipBox-"+typeVal+"'></div>";
					str+="<div class='pop-create-tipBox-middle'>"+elem.s.html+"</div>";
				}else{
					str+="<div class='pop-create-tipBox-left'></div>";
					str+="<div class='pop-create-tipBox-middle'><div class='pop-create-tipBox-wait-box'></div>"+elem.s.html+"</div>";
				}
				str+="<div class='pop-create-tipBox-right'></div>";
				str+="</div>";
			this.$divInfo=$(str).appendTo('body');

			widthV=this.$divInfo.width();
			heightV=this.$divInfo.height();

			var $doc = $(document);

			var scrollL = $doc.scrollLeft();
			var scrollT = $doc.scrollTop();

			var viewport= this.getViewportInfo();
			var t = scrollT + (viewport.h - heightV)/2;
			var l = scrollL + (viewport.w - widthV)/2;

			t = Math.max(0,t);
			l = Math.max(0,l);
			//console.log(t+"和"+l);
			this.$divInfo.css({
				top  			: t,
				left 			: l,
				'z-index' : '1110',
				'position': 'absolute'
			})
		},
		//生成遮罩层
		pop_mask:function(){
			var maskHeight;
			if ( !this.s.showMask){
				this.$mask = $([]);
				return;
			}

			if( $.browser.msie &&
					/msie 6\.0/i.test(navigator.userAgent)
			){
				maskHeight = document.documentElement.clientHeight + "px";
			}else{
				maskHeight = "100%";
			}
			if ( this.s.type == "waiting" ) {
				
				// create masklayer
				this.$mask = $('<div _pop="mask_waiting" class="fixed-top"></div>')
					.appendTo('body')
					.css({
						zIndex     : 1100,
						left       : 0,
						opacity    : 0.5, 
						width      : "100%", 
						height     : maskHeight,
						background : "#000"
					});

			} else {
				
				// create masklayer
				this.$mask = $('<div _pop="mask" class="fixed-top"></div>')
					.appendTo('body')
					.css({
						zIndex     : 999,
						left       : 0,
						opacity    : 0.5, 
						width      : "100%", 
						height     : maskHeight,
						background : "#000"
					});

			}
		},
		//给控件绑定事件;
		pop_event:function(){
			var elem      = this;
			var obj       = $("[_pop=pop]");
			var	top       = obj.offset().top;
			var	marginTop = parseInt(obj.css("marginTop"));
			//绑定close事件,拖动组件;
			this.$div.delegate("[_pop=close]","click",function(){
				//点击关闭按钮;
				elem.s.closeFun();
				setTimeout(function(){
					elem.pop_close_fun();
				},0);
			}).delegate("[_pop=sure]","click",function(){
				//点击确定按钮,执行相应函数,如果返回值不等于false,关闭窗口;
				if ( "function" === typeof elem.s.sureFun && elem.s.sureFun( elem ) !== false ) {
					elem.pop_close_fun();
				} 
			}).delegate("[_pop=cancel]","click",function(){
				//点击取消按钮,关闭窗口,并执行相应函数;
				elem.s.cancelFun();
				elem.pop_close_fun();
			}).delegate("[_pop=default]","click",function(){
				elem.s.defaultFun( elem );
			}).data('pop', elem );
			//针对ie6,随滚动条滚动;
			if ($.browser.msie&&$.browser.version == "6.0") {
				//ie6下防止穿透;
				$('embed, object, select').css({ 'visibility' : 'hidden' });
				//弹窗随屏幕滚动;
				$(window).scroll( function() {
					var scrollT=$(document).scrollTop();
					obj.css({"top":top-marginTop+scrollT+"px"});
				});
			}
		},
		//关闭弹出窗和遮罩层
		pop_close_fun:function(){
				(this.$div||this.$divInfo).remove();
				this.$mask.remove();
				(($.browser.msie && /msie 6\.0/i.test(navigator.userAgent))&&$('[_pop=mask]').length==0)&&($('embed, object, select').css({ 'visibility' : 'visible' }));
		},
		pop_ie6:(function(){
			return 	($.browser.msie && /msie 6\.0/i.test(navigator.userAgent))
								?function() {
								 	return "absolute";
								}
								:function() {
								 	return "fixed";
								}
		})()
	}
})(jQuery)