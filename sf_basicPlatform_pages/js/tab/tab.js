/*
 * name: tab;
 * author: licuiting;
 * email: 250602615@qq.com;
 * date: 2011-5-14;
 * version: 1.0;
 * 选项卡
 *
 *
 *
 */
(function ($) {
	var _tab = {
		//选项卡
		'li' : '[_tab=li]'
		//选项内容
	}
	function Tab(opt){
		this.defaultSetting=$.extend( this, this.defaultSetting, opt ||{});
		this.init();
	}
	Tab.prototype={
			defaultSetting:{
				//头部选项
				selector : '',
				data : [
				        	{content:'选项一',clickEv:function(){console.log(0)},selected:true},
				        	{content:'选项二',clickEv:function(){console.log(1)}}
				        ],
				 //内容选项
				 contentSelector : '[_tab=content]'
			},
			init:function(){
				var _self   =this;
				this.o = $(_self.selector);
				_self.$div().on('click',_tab.li,function(){
					_self.o.find(_tab.li)
						   .removeClass('selected')
						   .eq($(this).index())
						   .addClass('selected').end()
						   .find(_self.contentSelector)
						   .hide()
						   .eq($(this).index()).show();
					_self.data[$(this).index()].clickEv();
				});
			},
			$div:function(){
				var _self = this;
				$(_self.selector).empty();
				var $div = $('<div class="tab">\
								<div class="tab_top">\
									<ul>'
										+
											$(_self.data).map(function(i,v){
												return '<li class="'+ (v.selected?'selected':'') +'" _tab="li">'+ v.content +'</li>'
											}).get().join('')
										+'\
									</ul>\
								</div>\
							  </div>').appendTo(_self.selector);
				return $div;
			}
	}
	$.fn.tab = function(opt){
		return new Tab(opt);
	};
})(jQuery);
