(function(){
	$('body').pageEngine({
		//区别其他模块的唯一标示
		id:'rightContent_toDo',
		//模块选择器
		selector : {
			'dataList' : '[_rightContent_toDo=dataList]',
			//处理按钮
			'processBtn' : '[name=processBtn]'
		},
		//模板请求
		templateRequests : {
			
		},
		//共用模块盒子
		templateBox : {
				
		},
		//数据请求
		dataRequests : {
			//查询权力事项
			'taskUrl' : 'refreshModel.action'
		},
		//界面临时数据
		temporaryData : {
			
		},
		//demo加载完成
		load:function(){
			var _self = this;
			
			var initSearchCondition = {
					
					//当前所属环节名称
					"taskName":$('#taskName').val(),
					
					//事项办件编码
					"powerNumber":$('#powerNumber').val(),
					
					//当事人
					"punishedName":$('#punishedName').val(),
					
					//当事单位
					"punishedCompany":$('#punishedCompany').val(),
					
					//事项名称
					"queryPowerName":$('#queryPowerName').val(),
					
					//任务到达时间
					"startTime":$('#startTime').val(),
					
					//任务到达时间
					"endTime":$('#endTime').val(),
					
					//任务状态
					"taskStatus":$('[_tab=li].selected').text()
				};
			
			searchTask(initSearchCondition);
			
			$('#searchTask').click(function(){
				
				var searchCondition = {
						
						//当前所属环节名称
						"taskName":$('#taskName').val(),
						
						//事项办件编码
						"powerNumber":$('#powerNumber').val(),
						
						//当事人
						"punishedName":$('#punishedName').val(),
						
						//当事单位
						"punishedCompany":$('#punishedCompany').val(),
						
						//事项名称
						"queryPowerName":$('#queryPowerName').val(),
						
						//任务到达时间
						"startTime":$('#startTime').val(),
						
						//任务到达时间
						"endTime":$('#endTime').val(),
						
						//任务状态
						"taskStatus":$('[_tab=li].selected').text()
					};
				
				searchTask(searchCondition);
			});
			
			$("#flashTask").click(function(){
					var flashCondition = {
						
							//当前所属环节名称
							"taskName":'',
							
							//事项办件编码
							"powerNumber":'',
							
							//当事人
							"punishedName":'',
							
							//当事单位
							"punishedCompany":'',
							
							//事项名称
							"queryPowerName":'',
							
							//任务到达时间
							"startTime":'',
							
							//任务到达时间
							"endTime":'',
							
							//任务状态
							"taskStatus":$('[_tab=li].selected').text()
					};
				searchTask(flashCondition);
			});
			
			 function searchTask(taskSearchCondition){
					
					//加载选项卡
					$('body').miniTable({
						height:260,
						id : 'dataList',
						url:'refreshModel.action',
						ajaxData:{
							taskName:taskSearchCondition.taskName,
							powerNumber:taskSearchCondition.powerNumber,
							punishedName:taskSearchCondition.punishedName,
							punishedCompany:taskSearchCondition.punishedCompany,
							queryPowerName:taskSearchCondition.queryPowerName,
							startTime:taskSearchCondition.startTime,
							endTime:taskSearchCondition.endTime,
							taskStatus:taskSearchCondition.taskStatus},
						isShowCheckAll : false,
						colNames:['事项办件编码','所属事项名称','当前所属环节','当事人','当事单位','到达时间','办理时长','操作'],
						colModule:[
						           {name:'dealNumber'},
						           {name:'powerDescription'},
						           {name:'taskName'},
						           {name:'punishedName'},
						           {name:'punishedCompany'},
						           {name:'receiveDate'},
						           {name:'duration'},
						           {name:'operate'}
						          ],
						data:{
							 dataList:
								  [
										{
											'mattersCode':'AWS3456-43ER',
											'currentLinks':'形成处理意见',
											'status': '审查',
											'arrivalTime': '2013-4-5 20:00:00',
									        'handleLength': '100',
									        'operate': '<button class="minitable-btn" name="processBtn" _val="examine">进行处理</button>'
										}
									],
									totalData:10,
									perPageData:5
							},
							loaded : function(){
								var $self = this;
								$self.o.on('click',_self.selector.processBtn,function(){
									var excuteData = {
											"taskFlag":$(this).attr('_taskFlag'),
											"taskID":$(this).attr('_taskID')
										}
									 tools.ajax({
										 	url:'redirectPage.action',
											data:$.param(excuteData),
										 	successCallback:function(data){
										 		
										 		console.log(data);
										 		if(data == null){
										 			window.location.href="../systemError.jsp";
										 		}else{
										 			console.log(excuteData.taskID);
											 		tools.session.set("taskID",excuteData.taskID);
											 		$.locationHash(data.viewName);
											 		}
										 	}
										 })
								})
							}
					});
			 }
		}
	})
})();