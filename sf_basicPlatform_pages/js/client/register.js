(function(){
	$('body').pageEngine({
		//区别其他模块的唯一标示
		id:'register',
		//模块选择器
		selector : {
			'nav' : '[_register=nav]'
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
			$(_self.formNavTemplate().replace('{title}','立案')).appendTo(_self.o.find(_self.selector.nav));
			
		}
	})
})();