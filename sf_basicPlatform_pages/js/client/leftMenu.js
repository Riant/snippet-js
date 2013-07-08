(function(){
	$('body').pageEngine({
		//区别其他模块的唯一标示
		id:'leftMenu',
		//模块选择器
		selector : {
			'powerMatters' : '[_leftMenu=powerMatters]'
		},
		//模板请求
		templateRequests : {
			
		},
		//共用模块盒子
		templateBox : {
			
		},
		//数据请求
		dataRequests : {
			'leftUrl' : 'getPermittedProcesses.action',
			'leftSearch' : 'searchPowerListByCondition.action',
			'addUrl':'createTask.action'
		},
		//界面临时数据
		temporaryData : {
			'powerMatters' : [
			                  //	{'content':'权力事项','url':'http://www.baidu.com'}
			                  ]
		},
		//demo加载完成
		load:function(){
			var _self = this;
			//#{$'searchPermitted'}
			
			//权力事项初始化
				$.ajax({
					url :_self.dataRequests.leftUrl,
					success :function(result){
						addData(result);
					}
				});
				
			//搜索权力事项
			 $('.searchBtn').click(function(){
				 	//模糊值
					var value=$('#powerName').val();
					//分类值	
					var type=$('#powerType').val();
					var powerSearchBean = {
							"powerSearchBean.powerName":value,
							"powerSearchBean.powerType":type,
							'r' : Math.random()
						};
					
					$.ajax({
						url :_self.dataRequests.leftSearch,
						data:$.param(powerSearchBean),
						success :function(result){
							addData(result);
						}
					});
			  });
			 
			 //加载数据
			 function addData(result){
			    var data=eval("("+result+")");
				$('#addSound').empty();//每次清空列表后再重新构造
				$(
					$(data).map(function(i,v){
						var sound='';
						sound+='<li ><a id="'+v.processGuid+'"  title="';
						sound+=v.transactionID+'" name="transaction" href="javascript:void(0)">'+v.description ;
						sound+='</a></li>';
						return  sound;
					}).get().join('')
				  ).appendTo(_self.o.find(_self.selector.powerMatters))
				  //点击事件触发
				   .on('click','[name=transaction]',function(){
					   addTask(this.title,this.id);
				   });
			 }
			 
			 //跳转至创建任务页面
			 function addTask(transactionID,processGuid){
				tools.pop.confirm({
						html : '你确定是否启用权力事项?',
						sureFun : function(){
							var powerTransactionBean = {
									"powerTransactionBean.transactionID":transactionID,
									"powerTransactionBean.processGuid":processGuid
								};
								 $.ajax({
									url :_self.dataRequests.addUrl,
									data:$.param(powerTransactionBean),
									success :function(result){
										var data=eval("("+result+")");
										
								 		if(data.resultCode == "01000005"){
								 			tools.session.set("transactionID",transactionID);
								 			tools.session.set("taskID",data.taskID);
								 			tools.session.set("processGuid",processGuid);
								 			 indexData.leftMenu.transactionID = transactionID;
											 indexData.leftMenu.taskID = data.taskID;
											 indexData.leftMenu.processGuid=processGuid;
											 $.locationHash('application');
								 		}else{
								 			tools.pop.info({
								 				html : resultCode['code_'+data.resultCode]
								 			})
								 		}
									}
								});
						}
					})
			 }
		}
	});
})();