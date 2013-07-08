(function(){
	$('body').pageEngine({
		//区别其他模块的唯一标示
		id:'wrapper',
		//模块选择器
		selector : {
			'platformOption' : '[_indexTemplate=platformOption]',
			'mainNav' : '[_indexTemplate=mainNav]',
			'mainContent':'[_indexTemplate=mainContent]',
			'navTwo' : '[_indexTemplate=navTwo]',
			//左边模块
			'mainContent-l' : '[_indexTemplate=mainContent-l]',
			//右边模块
			'mainContent-r' : '[_indexTemplate=mainContent-r]'
		},
		//模板请求
		templateRequests : {
			//顶部导航
			'topNav' : ''
		},
		//共用模块盒子
		templateBox : {
			'topNav' : '<div class="header-top-r-elem">{content}</div>',
		},
		//数据请求
		dataRequests : {
			'topNav' : ''
		},
		//界面临时数据
		temporaryData : {
			'topNav' : ['行政权力目录系统','行政权力监察系统'],
			'mainNav' : [
				             {'content' : '首页','href':'index','selected':true},
				             //{'content' : '系统管理','href':''},
				             {'content' : '密码修改','href':'modifyPassword'},
				             //{'content' : '帮助','href':''},
				             {'content' : '退出','href':'login'}
			             ],
			'navTwo' : [{'name' : '所属地区','content' : tools.session.get('area')},
					    {'name' : '所属部门','content' : tools.session.get('dept')}
					   ],
			//子页面
			'subPage' : {
				'examine' : '审查',
				'application' : '申请',
				'register' : '立案',
				'decide' : '决定',//$.locationHash('application');
				'closed' : '结案',
				'accepted' : '受理',
				'execution' : '执行'
			}
		},
		//demo记载完成
		load:function(){
			var _self = this;
			//平台选项卡
			$(
				$(_self.temporaryData.topNav).map(function(i,v){
					return _self.templateBox.topNav.replace('{content}',v);
				}).get().join('')
			).appendTo(_self.o.find(_self.selector.platformOption));
			//导航一
			$(
				$(_self.temporaryData.mainNav).map(function(i,v){
					return '<li class="'+ 
					(
						(
							_self.temporaryData.subPage[$.locationHash()]?
							('index'==v.href):
							($.locationHash()==v.href)
						)?
						'selected':
						''
					) +'"><a _href="'+ v.href +'">'+ v.content +'</a></li>';
				}).get().join('')
			).appendTo(_self.o.find(_self.selector.mainNav))
			 .on('click','a',function(){
			 	$.locationHash($(this).attr('_href'));
			 	return false;
			 })
			//导航二
			$(
				$(_self.temporaryData.navTwo).map(function(i,v){
					return '<li><span>'+ v.name +'：</span><span>'+ v.content +'</span></li>';
				}).get().join('')
			).appendTo(_self.o.find(_self.selector.navTwo));
			_self.updatePosition([$('[_href='+ $.locationHash() +']').text()]);
		}
	})
})();