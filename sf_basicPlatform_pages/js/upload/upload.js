/*
 * name: upload;
 * author: licuiting;
 * email: 250602615@qq.com;
 * date: 2013-7-4;
 * version: 1.0;
 * 上传
 *
 *	本插件依赖 ajaxfileupload.js
 *
 */
(function ($) {
	var _upload = {
		//上传按钮;
		'uploadBtn' : '[_upload=uploadBtn]',
		//下载按钮
		'download' : '[_upload=download]',
		//删除按钮
		'deleteFile' : '[_upload=delete]',
		//上传文件名称
		'fileName' : '[_upload=fileName]',
		//上传内容盒子
		'uploadContent' : '[_upload=uploadContent]'

	}
	function Upload(opt){
		this.defaultSetting=$.extend( this, this.defaultSetting, opt ||{});
		this.init();
	}
	Upload.prototype={
			defaultSetting:{
				//头部选项
				selector : '',
				//默认文件呈现,以|号分隔的字符串;
				uploadList : '',
				//上传文件请求的url;
				ajaxUrl : '',
				//下载文件的url
				downloadUrl : '',
				//下载隐藏域的name
				downloadHideName : '',
				//文件域id
				uploadFileId : 'uploadBtn',
				//宽度
				width : 400
			},
			init:function(){
				var _self   =this;
				this.o = $(_self.selector);
				this.deleteFilePath = [];
				_self.$div()
					 //上传
					 .on('click',_upload.uploadBtn,function(){
					 	//上传文件不能为空
					 	if($.trim($('#'+_self.uploadFileId).val()).length==0){
					 		alert('上传文件不能为空');
					 		return;
					 	}
					 	$.ajaxFileUpload({
							url: _self.ajaxUrl,
							secureuri:false,
							dataType:"json",
							fileElementId:_self.uploadFileId,
							success: function (data){
								console.log('-- data --',data.resultCode);
								var resultCode = data.resultCode;
								if ( !resultCode ) {
									alert('上传错误');
								} else {
									if(resultCode.slice(-2)=='00'){
										alert('成功');
										_self.o.find(_upload.uploadContent).append(_self.addFileElem(data.filePath));
									}else{
										//alert(data.remark);
									}
								}
							},error :function  ( ) {
								//网络错误
								//alert('网络错误')
							}
						});
					 })
					 //删除
					 .on('click',_upload.deleteFile,function(){
					 	var $self = $(this);
					 	var path = $self.closest('li').find('[name='+_self.downloadHideName.replace('.','\\.')+']').val();
					 		_self.deleteFilePath.push(path);
					 		$self.closest('ul').remove();
					 })
			},
			$div:function(){
				var _self = this;
				$(_self.selector).empty();
				var $div = $('<div class="upload" style="width:'+ _self.width +'px;">\
								<div class="upload-top">\
									<div>\
										<input type="file" id="'+ _self.uploadFileId +'" name="'+ _self.uploadFileId +'"/>\
										<button class="upload-btn-white" _upload="uploadBtn">上传</button>\
									</div>\
									<div class="upload-top-txt">注：上传格式为.doc;.docx,并且大小不能超过10M。</div>\
								</div>\
								<div class="upload-content" _upload="uploadContent">\
								</div>\
							  </div>').appendTo(_self.selector);
					_self.uploadFileElem(_self.uploadList);
				return $div;
			},
			uploadFileElem:function(data){
				this.o.find(_upload.uploadContent).append(this.addFileElem(data))
			},
			addFileElem : function(filePath){
				if($.trim(filePath).length==0){
					return '';
				}
				var _self = this;
				var paths = (filePath.indexOf('|')>0?filePath.split('|'):[filePath]);
				
				return $(paths).map(function(i,v){
					return '<ul>\
								<li class="upload-txt" _upload="fileName" style="width:'+ (_self.width-149) +'px;">'+ _self.getBaseName(v) +'</li>\
								<li style="padding-top:10px;">\
									<form action="'+ _self.downloadUrl +'" method="post">\
										<input type="hidden" value="'+v+'" name="'+ _self.downloadHideName +'" />\
										<button class="upload-btn-white" _upload="download" type="submit">下载</button>\
									</form>\
									<button class="upload-btn-white" _upload="delete">删除</button>\
								</li>\
							</ul>'
				}).get().join('');
			},
			//获取全名
			getBaseName : function  ( string ) {
				return (string + '')
					.split('#').pop()
					.split('?').pop()
					.split('/').pop()
					.split('\\').pop();
			},
			//获取上传和删除的文件路径字符串
			getUPAndDPath : function(){
				var _self = this;
				return {
					savePath : $(_self.selector).find('[name='+ _self.downloadHideName.replace('.','\\.') +']').map(function(){
						return $(this).val();
					}).get().join('|'),
					deletePath : _self.deleteFilePath.join('|')
				}
			}
	}
	$.fn.upload = function(opt){
		return new Upload(opt);
	};
})(jQuery);
