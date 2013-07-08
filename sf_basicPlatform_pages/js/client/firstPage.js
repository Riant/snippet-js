(function(){
	$('body').pageEngine({
		//区别其他模块的唯一标示
		id:'firstPage',
		//模块选择器
		selector : {
			//左边模块
			'mainContent-l' : '[_indexTemplate=mainContent-l]',
			//右边模块
			'mainContent-r' : '[_indexTemplate=mainContent-r]'
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
			//加载leftMenu
			_self.o.find(_self.selector['mainContent-l']).load('../client/leftMenu.html')
			//加载rightContent
			_self.o.find(_self.selector['mainContent-r']).load('../client/rightContent.html')
		}
	})
})();