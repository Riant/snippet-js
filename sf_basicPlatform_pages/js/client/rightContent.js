(function(){
	$('body').pageEngine({
		//区别其他模块的唯一标示
		id:'rightContent',
		//模块选择器
		selector : {
			'tab' : '[_rightContent=tab]',
			'tabContent' : '[_rightContent=tabContent]'
		},
		//模板请求
		templateRequests : {
			'rightContent_toDo' : '../client/rightContent_toDo.html'
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
			//加载选项卡
			$('body').tab({
				selector : _self.o.find(_self.selector.tab),
				data : [
			        	{
			        		content:'待办',
			        		clickEv:function(){
			        			
			        			$("#liTaskName").show();
			        			
			        				var _self = this;
			        				var taskSearchCondition = {
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
			        						"taskStatus":'待办'
			        					}
			        				
			        				
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
			        								],
			        								totalData:10,
			        								perPageData:5
			        						},
			        						loaded : function(){
			        						}
			        				});
			        		},
			        		selected:true
			        	},
			        	{
			        		content:'完结',
			        		clickEv:function(){
			        			
		        				var _self = this;
		        				
		        				$("#liTaskName").hide();
		        				
		        				var taskSearchCondition = {
		        						
		        						//当前所属环节名称
		        						"taskName":'结案',
		        						
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
		        						"taskStatus":'完结'
		        					}
		        				
		        				
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
		        								],
		        								totalData:10,
		        								perPageData:5
		        						},
		        						loaded : function(){
		       
		        						}
		        				});
			        		}
			        	}
			        ]
			});
			_self.o.find(_self.selector.tabContent).load(_self.templateRequests.rightContent_toDo)
		}
	})
})();