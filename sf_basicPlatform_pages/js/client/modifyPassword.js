(function(){
	$('body').pageEngine({
		//区别其他模块的唯一标示
		id:'modifyPassword',
		//模块选择器
		selector : {
			'cancel' : '#cancel',
			'submit' : '#submit'
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
			
			//self.o.on('click',_self.selector.submit,function(){
			$("#submit").click(function() {
				//点击登录
				var modifyData = {
						"modifyUserPassword.oldPwd":$('#oldPwd').val(),
						"modifyUserPassword.newPwd":$('#newPwd').val(),
						"modifyUserPassword.confirmPwd":$('#confirmPwd').val()
					}
				
				 tools.ajax({
				 	url:'modifyUserPassword.action',
				 	data:$.param(modifyData),
				 	successCallback:function(data){
				 		console.log(data.resultCode);
					 		if(data.resultCode == "01030000"){
					 			$.locationHash('index');
						 		$('#wrap').load(_self.templateRequests.index);
					 		}else{
					 			tools.pop.info({
					 				html : resultCode['code_'+data.resultCode]
					 			})
					 		}
				 	}
				 })
			})
	
			//.on('click',_self.selector.cancel,function(){
			$("#cancel").click(function() {
				//点击取消
				$.locationHash('index');
				
			})
			
		}
	})
})();