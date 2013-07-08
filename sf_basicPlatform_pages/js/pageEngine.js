/*
 * name: pageEngine;
 * author: licuiting;
 * email: 250602615@qq.com;
 * date: 2013-6-26;
 * version: 1.0;
 * 小模块加载;
 *
 */
(function($){
	function PageEngine(opt){
		this.defaultSetting=$.extend( this, this.defaultSetting, opt ||{});
		this.init();
	}
	
	PageEngine.prototype={
		defaultSetting:{
			//模块标示
			id:'',
			//模块加载
			load:function(){},
			//页面模板加载请求
			templateRequests : {},
			//数据请求
			dataRequests : {}
		},
		init:function(){
			var _self=this;
			this.o = $('#'+this.id);
				_self.load();
				//页面最小宽度
				var minWidth = 990;
				//页面最小高度
				var minHeight = 630;
				//计算宽度
				//高度的计算要放最后
				$(window).resize(function(){
					//获取可见区域对象;
					var getViewportInfo = ((function(){
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
						})())();
					$('#wrapper').width(
						getViewportInfo.w>minWidth?
						getViewportInfo.w:
						minWidth
					).height(
						getViewportInfo.h>minHeight?
						getViewportInfo.h:
						minHeight
					);
					$('#container').height($('#wrapper').height()-$('#header').height()-$('#footer').height()-20);
					$('[_public=formBox]').height($('#container').height()-80);
					//$('[_indexTemplate=mainContent]').height($('#container').height());
					//$('[_public=formBox]').height($('#container').height()-80);
					$('.leftMenu-content').height($('#container').height()-120);
					$('.rightContent').height($('#container').height());
					//$('#rightContent').height($('#leftMenu').height());
				}).resize();
				console.log('------ '+ _self.id +' --------','init success!');
		},
		updatePosition : function(position){
			$('[_indexTemplate=position]').empty().append('<li style="font-weight:bold;">所在位置:</li>'+
					$(position).map(function(i,v){
						return '<li>></li><li>'+ v +'</li>';
					}).get().join('')
				)
		},
		formNavTemplate:function(){
			//隐藏二级导航
			$('.header-nav-breadCrumbs').hide();
			$('#container').css({
								'background' : 'none',
								'border' : '0px'
							})
			return '<span class="txt-box">{title}</span>\
					<span class="btnSpan">\
						<button class="formbtn" _formNavTemplate="subBtn" id="subBtn">提交</button>\
						<button class="formbtn" _formNavTemplate="chkLCT">查看流程图</button>\
						<button class="formbtn" _formNavTemplate="close" id="closed">关闭</button>\
						<button class="formbtn" _formNavTemplate="temporary" id="temp">暂存</button>\
						<button class="formbtn-white" onclick="history.back()">前一步骤处理结果查看</button>\
					</span>';
		},
		$div:function(){
			var _self=this;
			var $divO=$('').appendTo('#'+_self.id);
			return $divO;
		}
	};
	$.fn.pageEngine = function(opt){
		new PageEngine(opt);
	};
})(jQuery);