/*
 * name: passwordS;
 * author: licuiting;
 * email: 250602615@qq.com;
 * date: 2012-4-12;
 * version: 1.0;
 * 密码强度验证;
 * 依赖uxe.rebuild.js >ec
 *
 *
 */
tools.until(function(){
	return $.Validate;
},function(){

(function ($) {
	$.fn.passwordS2 = function(option, settings){

		if(typeof option === 'object'){
			//创建主体
			settings = option;
		}else if(typeof option == 'string'){
			var data = this.data('_passwordS');
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
			dColor:["red","orange","green"],//密码强度颜色;
			pos:"right"//判断密码框的方向;
		}, settings || {});
	
		return this.each(function(){
			var passwordS = new PasswordS(settings,$(this));
			var elem      = $(this);
			elem
				.data('_validate', passwordS)
				.data('_passwordS', passwordS)
				.focus(function(){
					// 获得焦点
					// 移除各种提示
					$("._passwordS").hide();
					elem.nextAll("[_validate=flag]").hide();
					// 展示提示信息
					passwordS.passwordS_focus();
					// 如果不为空 进行验证
					passwordS.passwordS_validation();
					// 添加聚焦效果
					elem
						.addClass("passwordS_input_focus")
						.removeClass("passwordS_input_error");
					//调整控件的位置;
					passwordS.$div.css({
						'left': passwordS.o.offset().left + 
									( passwordS.s.pos=="right" ?
										 ( passwordS.o.width() + 16 ) :
										 ( -1 * ( passwordS.$div.width() + 16 ) ) 
									) 
					});
					//
				})
				.blur(function(){
					// 失去焦点
					// 移除各种提示
					passwordS.passwordS_blur();
					elem.removeClass("passwordS_input_focus");
					// 失去焦点的验证
					passwordS.passwordS_validation(0);
				})
				.keyup(function(){
					//验证;
					passwordS.passwordS_empty();
					passwordS.passwordS_validation();

					var type = passwordS.getType();
					console.log( '[pwd2] type', type );
					if ( type == 'oldPassword' ){
						return passwordS.getCur().passwordS_validation('typing');
					}
					if ( type == 'newPassword' || type == 'password' ){
						return passwordS.getCom().passwordS_validation('typing');
					}
				});
		});
	}

	/**
	 * PasswordS class 定义
	 */
	 var i18nList  = {
			title:'SMSG',//说明文字 "密码强度";
			eMsg:'EMSG',//错误信息提示 "密码由6-20个英文字母,数字或特殊字符组成";
			rMsg:'RMSG', //"密码过弱将不会保存密码"
			ullMsg:'ULLMSG',//"密码不能为空"
			specialMsg:'SPECIALMSG',//"密码不能包含特殊字符"
			lengthMsg:'PASSWORD_LENGTH_ERROR',//密码长度输入不正确
			
			newAndOldTip:'NEW_OLDER_PWD_NOTCONSISTENT_TIP',//新旧密码不能一致
			newAndOld:'NEW_OLDER_PWD_NOTCONSISTENT',//新旧密码不能一致
			newAndSure:'NEW_OLDER_PWD_CONSISTENT',//新密码与确认密码必须一致
			passwordAndSure:'PWD_SUREPWD_CONSISTENT',//密码与确认密码必须相同
			
			dMsg:['LV1','LV2','LV3']//密码强度提示信息 弱 中 强
		};
	
	function setI18N ( target ) {
		var data ={}
		$.each(i18nList, function  ( key, value ) {
			data[value] = getI18N( value );
		})
		target.s['i18n'] = data;
	}

	// bind constructor to $
	$.PasswordS = PasswordS;
	function PasswordS(settings,o){
		this.s = settings;// operate
		this.o = o;// self
		var self = this;
		self.s = $.extend(self.s, i18nList);
		setI18N( self );
		ec.on('i18n',function  ( data ) {
			setI18N( self );
		});
	}

	/*
	 * prototype
	 */
	PasswordS.prototype ={
		validate_div : $.Validate.prototype.validate_div,
		validate_tip : $.Validate.prototype.validate_tip,
		// 生成密码提示框
		passwordS_div:function(){
			var type = this.getType();

			if( this.$div ){
				console.log('[vali] has div show');
				this.$div.show().css({
					'position': 'absolute',
					'top'	  : this.o.offset().top,
					"padding" : 0,//padding值
					'z-index' : '1000'
				});
				return;
			}
			
			var str ='<div class="passwordS _passwordS">';
				str+='<div class="passwordS_arrow passwordS_arrow_'+this.s.pos+'">';
				str+='<span class="inAr">◆</span>';
				str+='<span class="ouAr">◆</span>';
				str+='</div>';
				str+='<div class="passwordS_wrap">';

				str+='<div _passwordS="tip_content">\
					<div><span class="passwordS_tip" _passwordS="flagV"></span><span class="passwordS_txt" msgplus="'+ this.s.eMsg +'">'+ getI18N(this.s.eMsg) +'</span></div>\
					<div><span class="passwordS_tip" _passwordS="flagV"></span><span class="passwordS_txt" msgplus="'+this.s.rMsg +'">'+ getI18N(this.s.rMsg) +'</span></div>'+
					( type == 'newPassword' && this.getOri() ?('<div><span class="passwordS_tip" _passwordS="flagV"></span><span class="passwordS_txt" msgplus="'+this.s.newAndOldTip +'">'+ getI18N(this.s.newAndOldTip) +'</span></div>'):'')+
				'</div>';

				str+='<div class="passwordS_content" ><span msgplus="'+ this.s.title +'">' +  getI18N(this.s.title) + '</span>:';
				str+='<div class="passwordS_div" _passwordS="bar_content"><span class="passwordS_bar">';
				//强度表示条;
				str+='<span class="passwordS_bar_orange" _passwordS="bar"></span>';

				str+='</span></div>';
				//
				str+='<span _passwordS="text"></span>';
				//
				str+='</div>';
				str+='</div>';
				str+='</div>';
				//整个盒子
				this.$div=$(str).appendTo('body').css({
					'position': 'absolute',
					'top'	  : this.o.offset().top,
					"padding" : 0,//padding值
					'z-index' : '1000'
				});
				//提示文字
				this.$tip_content=this.$div.find("[_passwordS=tip_content]");
				//包括进度条,强度显示文字的div;
				this.$bar_content=this.$div.find("[_passwordS=bar_content]");
				//进度条
				this.$bar =this.$div.find("[_passwordS=bar]");
				//强度显示文字
				this.$text=this.$div.find("[_passwordS=text]");

		},
		//失去焦点时,生成对错提示框;
		passwordS_tip:function ( classV, msgC, obj ){
			//针对只显示对错的特殊情况;
			if ( this.s.showErr ) { // 非国际化内容 直接显示msgC
				msgC = getI18N( msgC ) == msgC.toUpperCase() ?
					('<span _validate="msg">'+ msgC +'</span>') :
					('<span _validate="msg" msgplus="'+ msgC +'">'+  getI18N(msgC) +'</span>');
			} else {
				msgC = '';
			}
			
			var passClass = "passwordS_"   + classV		+ "_2";
			var str 	  = '<div class="' + passClass	+ '" _validate="flag">'+msgC+'</div>';
			// 
			var nextFlag=this.o.nextAll("[_validate=flag]");

			obj = this.o;

			if( this.$tip ){
				console.log('[pwd2] tip flag already exist', this.o[0], this.$tip[0] );
				this.$tip.show().html(msgC).attr({"class":passClass})
			} else {
				console.log('[pwd2] tip flag not exist, create one');

				var nextFlag  = obj.nextAll ( "[_validate=flag]" );
				//错误提示框;
				if ( nextFlag.length==0 ){
					var errorC = obj.parents('td').first().next('.errorC')
					if ( errorC.length ){
						this.$tip = $(str).appendTo(errorC);
					} else {
						this.$tip = $(str).appendTo(obj.parent());
					}
				}
			}

			obj [ classV == "error" ? 
					'addClass':
					'removeClass']("passwordS_input_error");

		},
		//focus
		passwordS_focus:function(){
			// 移除错误消息
			this.$tip && this.$tip.hide();
			var type = this.getType();
			
			if ( type == "oldPassword" ){
				this.validate_div( 'tip', 'ullMsg' );
			} else if ( type == "surePassword" ){
				this.validate_div( 'tip', 'newAndSure' );
			} else {
				this.passwordS_div();
			}

			this.o.removeClass("passwordS_input_error");
			console.log( this.o.attr('class') );
		},
		//blur
		passwordS_blur:function(){
			// 移除提示框
			this.$div && this.$div.hide();
			console.log( 'blur hide', this.$div[0] );
		},
		passwordS_empty:function(){
			if ( $.trim(this.o.val()).length == 0 ){
				// 没输入信息 移除提示和红框
				this.$tip && this.$tip.hide();
				this.$div && this.$div.hide();
				this.o.removeClass("passwordS_input_error");
			}else{
				this.$div && this.$div.show();
			}
		},
		getVal : function(){
			return this.o.val();
		},
		getType: function(){
			return this.o.attr ( "_validate" );
		},
		getOri : function(){
			return $("[_validate=oldPassword]").data('_validate')
		},
		getCur : function(){
			return $("[_validate=newPassword],[_validate=password]").data('_validate')
		},
		getCom : function(){
			return $("[_validate=surePassword]").data('_validate')
		},
		//验证密码强度
		passwordS_validation:function( valiType ){
			//文本框失去焦点,给出对错提示;
			var inV = this.getVal();
			// 密码输入框类型标识符
			var pAttr = this.getType();
			var type  = 'error';
			// 不需要强度提示的框
			if (pAttr == 'surePassword' || pAttr == 'oldPassword' ){
				if ( valiType === 0 || valiType === 'typing' ){
					if ( !inV.length ){
						return;
					}	
					if ( pAttr == 'surePassword' ){
						var pwd =  this.getCur().getVal();
						if( pwd && pwd != inV ){
							message = this.s.passwordAndSure;
						} else {
							type = 'success';
						}
					} else if( pAttr == "oldPassword" ){
						type = 'success';
					}
					// 不展示强度
					if ( pAttr == "oldPassword" || 
							 pAttr == "surePassword"
					){
						return this.validate_tip( type, message );
					}
				} else {
					if ( pAttr == "oldPassword" ){
						return this.validate_div( type, 'ullMsg' );
					} 
					if ( pAttr == "surePassword" ){
						return this.validate_div( type, 'newAndSure' );
					}
				}
				return;
			}

			// 有密码提示内容和强度提示内容的框的标识
			var tip1 = 'error';

			var tip2 = 'error';
			var tip2_lv = 'red';
			var tip2_msg= 0;

			var tip3 = 'tip';

			var color = 'red';

			var message = '';
			// 密码模式
			//1代表弱,2代表中,3代表强
			var checkM= this.passwordS_checkModes(inV);
			var modes = this.passwordS_checkStrong ( checkM, inV.length );

			// strength check
			if (modes <2 ){
				
			} else if(modes==2){
				// 中
				tip2     = 'success';
				tip2_lv  = "orange";
				tip2_msg = 1;
			} else if( modes == 3 ){
				// 强
				tip2     = 'success';
				tip2_lv  = "green";
				tip2_msg = 2;
			}
			// format check
			if(inV.length<6||inV.length>20){
				//表示长度输入有误
				message = this.s.lengthMsg;
			} else if( checkM == -1 || inV.indexOf(" ")>-1){
				//表示含有特殊字符
				message = this.s.specialMsg;
			} else if( modes < 2){
				tip1 = 'success';
				//密码弱;
				message = this.s.rMsg;
			}else{
				tip1 = 'success';
				if ( pAttr == "password" ){//密码
					type = 'success';			
				} else if( pAttr == "newPassword" ){ //新密码
					var old = this.getOri().getVal();
					if( old && old == inV ){
						message = this.s.newAndOld;
						tip3 = 'error';
					} else {
						tip3 = 'tip';
						type = 'success';
					}
				}
			}


			if ( valiType === 0 ||
					 valiType === 'typing' 
			){
				if ( !inV.length ){
					return;
				}	
				if ( type == "error" ) {
					this.passwordS_tip( type, message );
				} else {
					//密码强弱的展示;
					this.passwordS_tip( type, 
						'<span msgplus="'+ this.s.title +'">' + getI18N(this.s.title) +
						'</span>:<span msgplus="' + this.s.dMsg[tip2_msg] + '">' +
						getI18N ( this.s.dMsg[tip2_msg] ) + '</span>');
				}
				return;
			} 

			//keyup事件给出具体提示信息;
			//显示气泡框;
			this.passwordS_div();

			this.passwordS_spanColor( 0, tip1 );
			this.passwordS_spanColor( 1, tip2 );
			this.passwordS_spanColor( 2, tip3 );

			this.$bar.attr({ "class":"passwordS_bar_" + tip2_lv });
			this.$text.html( getI18N(this.s.dMsg[ tip2_msg ]) );
		},
		//根据index来改变颜色
		passwordS_spanColor:function(index,classV){
			this.$tip_content
				.find("span[_passwordS=flagV]")
				.eq(index)
				.attr({
					"class" : "passwordS_" + classV
				});
		},
		//CharMode函数
		//测试某个字符是属于哪一类.
		passwordS_charMode:function(iN){
			if (iN>=48 && iN <=57){ //数字
				return 1;
			}
			if (iN>=65 && iN <=90){ //大写字母
				return 2;
			}
			if (iN>=97 && iN <=122){ //小写
				return 4;
			}
			return 8; //特殊字符
		},
		//bitTotal函数
		//计算出当前密码当中一共有多少种模式
		passwordS_bitTotal:function(num){
			var modes=0;
			for (i=0;i<4;i++){
				if (num & 1){
					modes++;
				}
				num>>>=1;
			}
			return modes;
		},
		//是否是可见特殊字符
		//可见特殊字符为“,./;'[]\\<>?:\"{}|`~!@#$%^&*()_+=-”
		//如果是可见字符则返回false，否则返回true
		passwordS_isCheckSpecialChar:function(char){
			var zf = ",./;'[]\\<>?:\"{}|`~!@#$%^&*()_+=-";//能输入的特殊字符，不包括空格
			return zf.indexOf(char) == -1
		},
		//checkStrong函数
		//返回密码的多少类型,-1表示含有特殊字符，0表示太短，
		passwordS_checkModes:function(sPW){	
			var Modes = 0;
			for (i=0;i<sPW.length;i++){
				//测试每一个字符的类别并统计一共有多少种模式.
				var mode = this.passwordS_charMode(sPW.charCodeAt(i));			
				if(mode == 8){
					if( this.passwordS_isCheckSpecialChar(sPW.charAt(i)) ){				    
						return -1;//表示含有特殊字符
					}
				}
				Modes|=mode;
				//Modes|=CharMode(sPW.charCodeAt(i));
			}
			return this.passwordS_bitTotal(Modes);
		},
		//返回值1为弱，2为中，3为强
		//弱：1、小于6位;2、全是一种类型
		//中：1、长度：6-12位，两种类型以上
		//强：1、长度6-12位，三种类型以上;2、长度13-20位，两种类型以上
		passwordS_checkStrong:function(mode,length){
			switch(mode){
				case 2:{ //两种类型{
					if(length>=6 && length<=12){//[6,12]
						return 2;//中
					}
					if(length>=13 && length<=20){//[13,20]
						return 3;//强
					}			
				}
				case 3://三种类型
				case 4:{//四种类型	
					if(length>=6 && length<=20){//[6,20]
						return strongStr = 3;//强
					}
				}
			}
			return 1;
		}
	}
})(jQuery);

});