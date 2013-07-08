(function(){
	$('body').pageEngine({
		// 区别其他模块的唯一标示
		id:'application',
		// 模块选择器
		selector : {
			'nav' : '[_application=nav]'
		},
		// 模板请求
		templateRequests : {
			
		},
		// 共用模块盒子
		templateBox : {
				
		},
		// 数据请求
		dataRequests : {
			'initUrl':'initPage.action',
			'addUrl':'excuteForm.action'
		},
		// 界面临时数据
		temporaryData : {
			
		},
		// demo加载完成
		load:function(){
			var _self = this;
			var uploadObj = $('body').upload({
				selector : '#uploadDiv',
				ajaxUrl : 'upload.action',
				downloadUrl : '../pages/download.action',
				downloadHideName : 'filePath',
				uploadFileId : 'uploadFile',
				uploadList:'',
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
					//
					$(_self.formNavTemplate().replace('{title}',result.formLableName)).appendTo(_self.o.find(_self.selector.nav));
					
					// 缓存信息
					tools.session.set("formLableName",result.formLableName);
					tools.session.set("saveFlag",result.saveFlag);
					tools.session.set("form",result.form);
					
					//初始化
					console.log(result.fileUrls);
					uploadObj.uploadFileElem(result.fileUrls);
					
					// 记录人员信息
					$('#userName').html(tools.session.get("userName"));
					
					// 部门信息
					$('#DEPT').html(tools.session.get("dept"));
					
					// 事项办件编码
					$('#PROCESS_CODE').html(result.processCode);
					
					//0：新建 1：暂存
					if(result.saveFlag==0){
						// 当事人姓名
						$('#PARTIES_NAME').val(result.form['PARTIES_NAME'].argDefaultName);
						
						// 单位名称
						$('#ILLEGAL_DEPT_NAME').val(result.form['ILLEGAL_DEPT_NAME'].argDefaultName);
						
						// 证照编号
						$('#ILLEGAL_DEPT_DOCUMENT_NO').val(result.form['ILLEGAL_DEPT_DOCUMENT_NO'].argDefaultName);
						
						// 法定代表人
						$('#REPRESENTATIVE').val(result.form['REPRESENTATIVE'].argDefaultName);
						 
						// 地址
						$('#PARTIES_ADDR').val(result.form['PARTIES_ADDR'].argDefaultName);
						
						// 申请内容
						$('#APPLICATION_CONTENT').val(result.form['APPLICATION_CONTENT'].argDefaultName);
						
						// 备注
						$('#COLLECTION_REMARKS').val(result.form['COLLECTION_REMARKS'].argDefaultName);
						
						// 邮政编码
						$('#POSTAL_CODE').val(result.form['POSTAL_CODE'].argDefaultName);
						
						// 联系电话
						$('#PHONE').val(result.form['PHONE'].argDefaultName);
						
						// 证件号码
						$('#CARD_NUM').val(result.form['CARD_NUM'].argDefaultName);
						
						//被征收对象性质
						var radiovalue=result.form['COMPANY_PROPERTY'].argDefaultName;
						
						initRadio(radiovalue);
						
						//单位性质
						var selectValue=result.form['NATURE_UNIT'].argDefaultName;
						
						initSel(selectValue);
						
					}else{
						// 当事人姓名
						$('#PARTIES_NAME').val(result.form['PARTIES_NAME'].value);
						
						// 单位名称
						$('#ILLEGAL_DEPT_NAME').val(result.form['ILLEGAL_DEPT_NAME'].value);
						
						// 证照编号
						$('#ILLEGAL_DEPT_DOCUMENT_NO').val(result.form['ILLEGAL_DEPT_DOCUMENT_NO'].value);
						
						// 法定代表人
						$('#REPRESENTATIVE').val(result.form['REPRESENTATIVE'].value);
						 
						// 地址
						$('#PARTIES_ADDR').val(result.form['PARTIES_ADDR'].value);
						
						// 申请内容
						$('#APPLICATION_CONTENT').val(result.form['APPLICATION_CONTENT'].value);
						
						// 备注
						$('#COLLECTION_REMARKS').val(result.form['COLLECTION_REMARKS'].value);
						
						// 邮政编码
						$('#POSTAL_CODE').val(result.form['POSTAL_CODE'].value);
						
						// 联系电话
						$('#PHONE').val(result.form['PHONE'].value);
						
						// 证件号码
						$('#CARD_NUM').val(result.form['CARD_NUM'].value);
						
						//被征收对象性质
						var radiovalue=result.form['COMPANY_PROPERTY'].value;
						
						initRadio(radiovalue);
						//单位性质
						var selectValue=result.form['NATURE_UNIT'].value;
						
						initSel(selectValue);
					}
				}
			  }
					
			});
			 //被征收对象性质
			 function initRadio(radiovalue){
				 var obj = document.getElementsByName("COMPANY_PROPERTY");
				    for(var i = 0; i < obj.length; i++)
				    {  
				      if(obj[i].value == radiovalue)
				      {  
				        obj[i].checked = true;
				        break;
				      }  
				   }
				
			 }
			 //单位性质
			 function initSel(selectValue){
				 var sel=document.getElementById("NATURE_UNIT").options;   
				 for(var j=0;j<sel.length;j++) 
				 { 
				 if(sel[j].value==selectValue){
					sel[j].selected=true;
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
						 "PARTIES_NAME":$('#PARTIES_NAME').val(),
						 "ILLEGAL_DEPT_NAME":$('#ILLEGAL_DEPT_NAME').val(),
						 "NATURE_UNIT":$('#NATURE_UNIT').val(),
						 "ILLEGAL_DEPT_DOCUMENT_NO":$('#ILLEGAL_DEPT_DOCUMENT_NO').val(),
						 "REPRESENTATIVE":$('#REPRESENTATIVE').val(),
						 "PARTIES_ADDR":$('#PARTIES_ADDR').val(),
						 "COMPANY_PROPERTY":$("input[id='COMPANY_PROPERTY']:checked").val(),
						 "APPLICATION_CONTENT":$('#APPLICATION_CONTENT').val(),
						 "COLLECTION_REMARKS":$('#COLLECTION_REMARKS').val(),
						 "POSTAL_CODE":$('#POSTAL_CODE').val(),
						 "PHONE":$('#PHONE').val(),
						 "CARD_NUM":$('#CARD_NUM').val(),
						 // ---------------------------------------------------------附加表单信息
						 "delFileUrl":uploadObj.getUPAndDPath().deletePath,
						 "saveFileUrl":uploadObj.getUPAndDPath().savePath,
						 "LABLE_NAME":tools.session.get("formLableName"),
						 "saveFlag":tools.session.get("saveFlag"),
						 "taskState":taskState
						 //"form":tools.session.get("form")
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
				 $('body').upload({
					 selector : ''
				 })
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
				 //当事人姓名
				 var parties_name=$('#PARTIES_NAME').val();
				 //单位名称
				 var illegal_dept_name=$('#ILLEGAL_DEPT_NAME').val();
				 //证照编号
				 var illegal_dept_document_no=$('#ILLEGAL_DEPT_DOCUMENT_NO').val();
				 //法定代表人(负责人)
				 var representative=$('#REPRESENTATIVE').val();
				 //地址
				 var parties_addr=$('#PARTIES_ADDR').val();
				 //申请内容
				 var application_content=$('#APPLICATION_CONTENT').val();
				 //备注
				 var collection_remarks=$('#COLLECTION_REMARKS').val();
				 //邮政编码
				 var postal_code=$('#POSTAL_CODE').val();
				 //联系电话
				 var phone=$('#PHONE').val();
				 //身份证(其他有效证件)号码
				 var card_num=$('#CARD_NUM').val();
				 
				 if(parties_name==null||$.trim(parties_name).length<=0){
					 tools.pop.info({
			 				html : "请输入当事人姓名"
			 			});
				  return false;	 
				 }
				 
				 if(illegal_dept_name==null||$.trim(illegal_dept_name).length<=0){
					 tools.pop.info({
			 				html : "请输入单位名称"
			 			});
				  return false;	 
				 }
				 
				 if(illegal_dept_document_no==null||$.trim(illegal_dept_document_no).length<=0){
					 tools.pop.info({
			 				html : "请输入证照编号"
			 			});
				  return false;	 
				 }
				 
				 if(representative==null||$.trim(representative).length<=0){
					 tools.pop.info({
			 				html : "请输入法定代表人(负责人)"
			 			});
				  return false;	 
				 }
				 
				 if(parties_addr==null||$.trim(parties_addr).length<=0){
					 tools.pop.info({
			 				html : "请输入申请人基本地址"
			 			});
				  return false;	 
				 }
				 
				 if(application_content==null||$.trim(application_content).length<=0){
					 tools.pop.info({
			 				html : "请输入申请内容"
			 			});
				  return false;	 
				 }
				 
				 if(collection_remarks==null||$.trim(collection_remarks).length<=0){
					 tools.pop.info({
			 				html : "请输入备注信息"
			 			});
				  return false;	 
				 }
				 
				 if(postal_code==null||$.trim(postal_code).length<=0){
					 tools.pop.info({
			 				html : "请输入邮政编码"
			 			});
				  return false;	 
				 }
				 
				 if(phone==null||$.trim(phone).length<=0){
					 tools.pop.info({
			 				html : "请输入联系电话"
			 			});
				  return false;	 
				 }
				 
				 if(card_num==null||$.trim(card_num).length<=0){
					 tools.pop.info({
			 				html : "请输入身份证(其他有效证件)号码"
			 			});
				  return false;	 
				 }
				 return true;
			 }
			 
		}
	});
})();