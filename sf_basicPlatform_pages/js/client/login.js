(function(){
	$('body').pageEngine({
		//区别其他模块的唯一标示
		id:'login',
		//模块选择器
		selector : {
			'loginBtn' : '#login',
			'Reacquire' : '#Reacquire',
			'codeImg' : '#codeImg'
		},
		//模板请求
		templateRequests : {
			
		},
		//共用模块盒子
		templateBox : {
				
		},
		//数据请求
		dataRequests : {
			
		},
		//界面临时数据
		temporaryData : {
			
		},
		//demo加载完成
		load:function(){
			var _self = this;
			$.logOut();

			$('#js_loginForm').validate({
				submitHandler: function( form ){
					$(form).ajaxBind({
						success: function(data){
							afterLogin(data, _self);
						}
					}, {
						type: 'auto'
					});
					return false;
				}
			});
			
			// _self.o.on('click',_self.selector.loginBtn,function(){
			// 	//点击登录
			// 	var loginData = {
			// 			"loginUser.userLoginName":$('#userLoginName').val(),
			// 			"loginUser.userPassword":$('#password').val(),
			// 			"loginUser.authCode":$('#authCode').val()
			// 		}
			// 	 tools.ajax({
			// 	 	url:'loginSYS.action',
			// 	 	data:$.param(loginData),
			// 	 	async:false,
			// 	 	successCallback:function(data){
			// 	 		//console.log(data.resultCode);
			// 	 		if(data.resultCode == "01010000"){
			// 	 			tools.session.set("area",data.userInfoBean.area);
			// 	 			tools.session.set("dept",data.userInfoBean.dept);
			// 	 			tools.session.set("userLoginName",data.userInfoBean.loginName);
			// 	 			tools.session.set("userName",data.userInfoBean.user_name);
			// 	 			$.locationHash('index');
			// 	 			$('#wrap').load(_self.templateRequests.index);
			// 	 		}else{
			// 	 			tools.pop.info({
			// 	 				html : resultCode['code_'+data.resultCode]
			// 	 			})
			// 	 		}
			// 	 	}
			// 	 })
			// });
			_self.o.on('click',_self.selector.Reacquire,function(){
				//获取验证码
				_self.o.find(_self.selector.codeImg).click();
			}).on('click',_self.selector.codeImg,function(){
				//点击验证码
				$(this).attr({"src":"../authcode.jpg?"+Math.random()});
			});
			$(_self.selector.codeImg).click();
			//验证
			// $('body').validate({
			// 	selector : '[_validate]'
			// })
		}
	})
})();
