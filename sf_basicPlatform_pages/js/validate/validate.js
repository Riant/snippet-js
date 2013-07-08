/*
 * name: validate;
 * author: licuiting;
 * email: 250602615@qq.com;
 * date: 2012-7-3;
 * version: 1.2;
 * 验证组件;
 *
 *
 *
 */
 (function ($) {
	 	var _regular = {
	 			'email' : /^[a-zA-Z0-9][\w\-]*(\.[a-zA-Z0-9\-]+)*@([\w\-]+\.)+([a-z]{2,9})$/i
	 	}
		function Validate(opt){
			this.defaultSetting=$.extend( this, this.defaultSetting, opt ||{});
			this.init();
			console.log('--------- Validate init success! ---------')
		}
		Validate.prototype={
				defaultSetting:{
					selector : '',
					dColor:["red","orange","green"],//密码强度颜色;
					pos:"right"//框展示方向;
				},
				init:function(){
					var _self = this;
					_self.$div();
				},
				/* 生成密码盒子 */
				$div:function(){
					return $('<div class="validate _validate">\
									<div class="validate_arrow validate_arrow_'+this.pos+'">\
										<span class="inAr">◆</span>\
										<span class="ouAr">◆</span>\
									</div>\
									<div class="validate_wrap">\
										<div _validate="tip_content">\
							    			<div><span class="validate_tip" _validate="flagV"></span><span class="validate_txt">111</span></div>\
											<div><span class="validate_tip" _validate="flagV"></span><span class="validate_txt">222</span></div>\
											<div><span class="validate_tip" _validate="flagV"></span><span class="validate_txt">333</span></div>\
										</div>\
										<div class="validate_content" ><span>55</span>:\
											<div class="validate_div" _validate="bar_content">\
												<span class="validate_bar">\
													<span class="validate_bar_orange" _validate="bar"></span>\
												</span>\
											</div>\
											<span _validate="text"></span>\
										</div>\
									</div>\
								</div>').appendTo('body').css({
									'position': 'absolute',
									'top'	  : this.o.offset().top,
									"padding" : 0,//padding值
									'z-index' : '1000'
								});
				}
		}
		$.fn.validate = function(opt){
			return new Validate(opt);
		};
})(jQuery);
