(function(){
	$('body').pageEngine({
		//区别其他模块的唯一标示
		id:'decide',
		//模块选择器
		selector : {
			'nav' : '[_decide=nav]'
		},
		//模板请求
		templateRequests : {
			
		},
		//共用模块盒子
		templateBox : {
				
		},
		//数据请求
		dataRequests : {
			'initUrl':'initPage.action',
			'addUrl':'decideForm.action'
		},
		//界面临时数据
		temporaryData : {
			
		},
		//demo加载完成
		load:function(){
			var _self = this;
			var uploadObj = $('body').upload({
				selector : '#uploadDiv',
				ajaxUrl : 'upload.action',
				downloadUrl : '../pages/download.action',
				downloadHideName : 'filePath',
				uploadFileId : 'uploadFile',
				width : 400
			});
			// 初始化页面
			 tools.ajax({
				url :_self.dataRequests.initUrl,
				data:{taskID:tools.session.get("taskID")},
				successCallback :function(result){
					console.log(result);
					if(result.resultCode){
			 					tools.pop.confirm({
						html : resultCode['code_'+result.resultCode],
						sureFun : function(){
							$.locationHash('index');
						}
					});
				}else{
					$(_self.formNavTemplate().replace('{title}','决定')).appendTo(_self.o.find(_self.selector.nav)); 
					
					// 缓存信息
					tools.session.set("formLableName",result.formLableName);
					tools.session.set("saveFlag",result.saveFlag);
					
					//初始化
					console.log(result.fileUrls);
					uploadObj.uploadFileElem(result.fileUrls);
					//初始化
					//initArr1(result.uploadRespList);
					
					// 事项办件编码
					$('#PROCESS_INSTANCE_ID').html(result.processCode);
					//0：新建 1：暂存
					if(result.saveFlag==0){
						//决定
						$('#DECIDE_DESCRIBE').val(result.form['DECIDE_DESCRIBE'].argDefaultName);
						
						//备注
						$('#REMARK').val(result.form['REMARK'].argDefaultName);
						
						//*立案结果
						var radiovalue=result.form['FILING_RESULTS'].argDefaultName;
						
						initRadio(radiovalue);
						
					}else{
						//决定
						$('#DECIDE_DESCRIBE').val(result.form['DECIDE_DESCRIBE'].value);
						
						//备注
						$('#REMARK').val(result.form['REMARK'].value);
						
						//*立案结果
						var radiovalue=result.form['FILING_RESULTS'].value;
						
						initRadio(radiovalue);
					}
				}
			  }
			});
			 
			 //*立案结果
			 function initRadio(radiovalue){
				 var obj = document.getElementsByName("FILING_RESULTS");
				    for(var i = 0; i < obj.length; i++)
				    {  
				      if(obj[i].value == radiovalue)
				      {  
				        obj[i].checked = true;
				        break;
				      }  
				   }
			 }
			 
			// 提交 powerTransactionBean
			 _self.o.on('click','#subBtn',function(){
				 var taskState="0";
				 saveForm(taskState);
			 });
			 
			 //暂存
			 _self.o.on('click','#temp',function(){
				 var taskState="1";
				 saveForm(taskState);
			 });
			 
			//关闭 
			 _self.o.on('click','#closed',function(){
				 $.locationHash('index');
			 });
			 
			//保存数据
			 function  saveForm(taskState){
				 if(verificationForm()==false){
					 return;
				 }
				 var formTempletBean = {
						 "FILING_RESULTS":$("input[id='FILING_RESULTS']:checked").val(),
						 "DECIDE_DESCRIBE":$('#DECIDE_DESCRIBE').val(),
						 "REMARK":$('#REMARK').val(),
						 // ---------------------------------------------------------附加表单信息
						 "delFileUrl":uploadObj.getUPAndDPath().deletePath,
						 "saveFileUrl":uploadObj.getUPAndDPath().savePath,
						 "LABLE_NAME":tools.session.get("formLableName"),
						 "saveFlag":tools.session.get("saveFlag"),
						 "taskState":taskState
						};
				 $.ajax({
						url :_self.dataRequests.addUrl,
						data:$.param(formTempletBean),
						success :function(data){
							var result=eval("("+data+")");
							tools.pop.info({
				 				html : resultCode['code_'+result.resultCode]
				 			});
							   //跳转首页
							$.locationHash('index');
						}
					});
			 }
			 //初始化上传文件
			 function initArr1(uploadResps){
				 var sound='';
				 for(var i=0;i<uploadResps.length;i++){
					 arr1=uploadResps[i];
					 sound+=' <ul>';
					 sound+=' <li class="upload-txt" _upload="fileName" style="width:251px;">'+uploadResps[i].fileName+'</li>	';
					 sound+=' <li style="padding-top:10px;">	';
					 sound+=' <form action="../pages/download.action" method="post">	';
					 sound+=' <input type="hidden" value="'+uploadResps[i].filePath+'" name="filePath">		';
					 sound+=' <button class="upload-btn-white" _upload="download" type="submit">下载</button>	';
					 sound+=' </form>';
					 sound+=' <button class="upload-btn-white" _upload="delete">删除</button>	';
					 sound+=' </li>	';
					 sound+=' </ul>';
				 }
				 $('.upload-content').append(sound);
			 }
			 
			 //验证表单
			 function verificationForm(){
				 //决定
				 var decide_describe=$('#DECIDE_DESCRIBE').val();
				 //备注
				 var remark=$('#REMARK').val();
				 
				 if(decide_describe==null||$.trim(decide_describe).length<=0){
					 tools.pop.info({
			 				html : "请输入相关决定信息"
			 			});
				  return false;	 
				 }
				 
				 if(remark==null||$.trim(remark).length<=0){
					 tools.pop.info({
			 				html : "请输入备注信息"
			 			});
				  return false;	 
				 }
				 return true;
			 }
		}
	})
})();