/*
 * name: miniTable;
 * author: licuiting;
 * email: 250602615@qq.com;
 * date: 2013-4-19;
 * version: 1.0;
 * 迷你表格;
 *
 *
 *
 */
(function($){
	//
	var _miniTable={
		//minitable
		'minitable':'[_miniTable=minitable]',
		'containt' : '[_miniTable=containt]',
		'edit':'[_miniTable=edit]',
		'deleteOper':'[_miniTable=delete]',
		'detail':'[_miniTable=detail]',
		'firstPage':'[_miniTable=firstPage]',
		'lastPage':'[_miniTable=lastPage]',
		'prevPage':'[_miniTable=prevPage]',
		'nextPage':'[_miniTable=nextPage]',
		'pagerA':'[_miniTable=pager] a',
		//全选按钮
		'checkAll':'[_miniTable=checkAll]',
		//全选按钮组
		'checkGroup':'[_miniTable=checkGroup]',
		//表格内容
		'tableContent' : '[_miniTable=content]',
		//表格头部
		'tableHeader' : '[_miniTable=header]',
		//拖动生成的竖线
		'dragLine' : '[_miniTable=dragLine]',
		//可拖动span
		'resize': '[_miniTable=resize]',
		//头部
		'header_h':'[_miniTable=header_h]',
		//
		'header_th' : '[_miniTable=header_th]',
		//选择当前显示条数,并更新table内容
		'rowList':'[_miniTable=rowList]',
		//中间数据部分
		'm-table':'[_miniTable=m-table]',
		//table遮罩部分
		'mask':'[_miniTable=mask]',
		//头部数据部分
		'h-table' : '[_miniTable=h-table]',
		//当前页展示对象
		'currentPage':'[_miniTable=currentPage]'
		
	}
	//
	function MiniTable(opt){
		this.defaultSetting=$.extend( this, this.defaultSetting, opt ||{});
		this.init();
		console.log('--------- minitable init success! ---------')
	}
	MiniTable.prototype={
		defaultSetting:{
			//是否显示全选框
			isShowCheckAll:true,
			//全选文字
			checkAllTxt:'全选',
			//id唯一标识
			id:'',
			//table标题
			caption:'miniTable',
			//列
			//colNames:[],
			colNames:[],
			colModule:[],
			//后台数据
			data:null,
			//是否显示默认序号;
			isShowDefaultNum:true,
			/*data:
			 * {
				 * dataList:
				 * [
						{
							'id':'1',
							'setType':'单IP',
							'matchValueType': '192.168.1.1',
							'maximumUplinkSpeed': '100',
					        'maximumDownlinkSpeed': '100',
					        'timeV': '2010-09-29 14:26:00',
					        'state': '有效',
					        'operate':'<a onclick="b()">edit</a> '
						}
					],
					totalData:10,
					perPageData:5
				},*/
			//操作文字;
			operate:{
				edit:'编辑',
				deleteTxt:'删除',
				detail:'详情'
			},
			//点击编辑调用的方法

			editFun:function(){},
			//点击删除调用的方法
			deleteFun:function(){},
			//点击详情调用的方法
			detailFun:function(){},
			//是否显示分页;
			pagerShow:true,
			//数据总数
			totalData:10,
			//当前页
			currentPage:1,
			//总页数
			totalPage:1,
			//当前显示条数
			perPageData:10,
			totalData_text:'{0}条数据',
			currentPage_text:'【第<em>{0}</em>页】',
			firstPage_text:'首页',
			lastPage_text:'尾页',
			prevPage_text:'上一页',
			nextPage_text:'下一页',
			url:'',
			ajaxData:'',
			noData:'没有数据',
			numberTxt:'序号',
			//设置宽度
			width:'',
			//高度
			height:'',
			//当内容为空时,用空白占位符占位;
			blankPlaceholder:'---',
			//列是否可调整宽度;
			isResize : true,
			//resize的最小宽度;
			resizeMinWidth : 60,
			//当前页显示条数列表
			rowList:[10,20,30],
			//加载完毕
			loaded:function(){
				
			}
		},
		init:function(){
			var _self   =this;
				//_self._data:页面私有数据储存;
				_self._data = {}
				//防止数据重复加载;
				_self._data.repeatLoad = false;
				//开始resize的标识;
				_self._data.reFlag = false;
				//resize的开始坐标;
				_self._data.startX = 0;
				//resize的结束坐标;
				_self._data.endX = 0;
				//_self._obj
				this.o = $('#'+_self.id);
				_self.$ajax();
		},
		//绑定事件
		$event:function(){
			var _self=this;
			this.$div().on('click',_miniTable.edit,function(){
							//编辑方法
							_self.editFun();
						})
					   .on('click',_miniTable.deleteOper,function(){
					   		//删除方法
							_self.detailFun();
						})
					   .on('click',_miniTable.detail,function(){
					   		//点击详细方法
							_self.detailFun();
						})
					   .on('click',_miniTable.pagerA,function(){
						   var miniTableAttr='[_miniTable='+$(this).attr('_miniTable')+']';
					   		if(miniTableAttr==_miniTable.firstPage){
					   			//首页
					   			_self.currentPage=1;
					   		}else if(miniTableAttr==_miniTable.lastPage){
					   			//尾页
					   			_self.currentPage=_self.totalPage;
					   		}else if(miniTableAttr==_miniTable.prevPage){
					   			//前一页
					   			_self.currentPage=(_self.currentPage-1<1)?1:(_self.currentPage-1);
					   		}else if(miniTableAttr==_miniTable.nextPage){
					   			//后一页
					   			_self.currentPage=(_self.currentPage+1>_self.totalPage)?_self.totalPage:(_self.currentPage+1);
					   		}
					   		$(this).addClass('selected').siblings().removeClass('selected');
					   		_self.$ajax();
					   })
					   //点击全选/反选
					   .on('click',_miniTable.checkAll,function(){
					   		var ___self = $(this);
					   		//同名checkbox
					   		var checkGroup = $(this).closest(_miniTable.minitable).find(_miniTable.checkGroup);
					   			checkGroup.attr({'checked':___self.attr('checked')?true:false});
					   })
					   //点击子复选框
					   .on('click',_miniTable.checkGroup,function(){
					   		//checkAll
					   		var checkAll = $(this).closest(_miniTable.minitable).find(_miniTable.checkAll);
					   		var checkGroup = $(this).closest(_miniTable.minitable).find(_miniTable.checkGroup);
					   			checkAll.attr({'checked':(checkGroup.filter(':checked').length == checkGroup.length)})
					   })
					   //内容td中的hover效果;
					   .on('mouseenter',_miniTable.tableContent+' tr',function(){
					   		$(this).addClass('miniTable-tr-td');
					   })
					   .on('mouseleave',_miniTable.tableContent+' tr',function(){
					   		$(this).removeClass('miniTable-tr-td');
					   })
					   //点击背景变黄色
					   .on('click',_miniTable.tableContent+' tr',function(){
					   		_self.o.find(_miniTable.tableContent+' tr').removeClass('minitable-tr-click');
					   		$(this).addClass('minitable-tr-click');
					   })
					   //头部th中的hover效果;
					   .on('mouseenter',_miniTable.tableHeader+' th',function(){
					   		$(this).addClass('miniTable-h-th');
					   })
					   .on('mouseleave',_miniTable.tableHeader+' th',function(){
					   		$(this).removeClass('miniTable-h-th');
					   })
					   //改变宽度
					   .on('mousedown',_miniTable.resize,function(e){
					   		if(!_self.isResize&&_self._data.reFlag){
					   			return false;
					   		}
					   		var _x = e.pageX;
					   		var mainBox_left = _self.o.offset().left;
					   		_self.o.find(_miniTable.dragLine).show().css({
					   			left : (_x-mainBox_left) + 'px'
					   		});
					   		_self._data.startX = $(this).offset().left;
					   		_self.isSelectedTxt(false);
					   		_self._data.reFlag = true;
					   		_self._data.index = _self.o.find(_miniTable.resize).index($(this));
					   		_self._data.width = $(this).parent().find('div').width();
					   })
					   //选择下拉框显示条数
					   .on('change',_miniTable.rowList,function(){
					   		_self.perPageData = $(this).val();	
					   		_self.currentPage = 1 ;
					   		console.log('perPageData',_self.perPageData);
					   		_self.$ajax();
					   })
					   _self.o.find(_miniTable.containt).mousemove(function(e){
					   		if( !_self._data.reFlag ){
					   			return false;
					   		}
					   		var _x = e.pageX;
					   		var mainBox_left = _self.o.offset().left;
					   		_self.o.find(_miniTable.dragLine).css({
					   			left : (_x-mainBox_left) + 'px'
					   		});
					   })
					   $(document).mouseup(function(e){
					   		if( !_self._data.reFlag ){
					   			return false;
					   		}
					   		var _x=e.pageX;
					   		var width = 0;
					   		_self._data.endX = _x;
					   		_self.isSelectedTxt(true);
					   		_self._data.reFlag = false;
					   		_self.o.find(_miniTable.dragLine).hide();
					   		width = _self._data.width+(_self._data.endX-_self._data.startX);
					   		width = ( 
					   				  width<_self.resizeMinWidth?
					   			      _self.resizeMinWidth:
					   			      width
					   			    );
					   		_self.changeWidth(_self._data.index,width);
					   })
					   //拖动横向滚动条
					   _self.o.find(_miniTable.tableContent).scroll(function(){
					   		var __self = $(this);
					   		_self.o.find(_miniTable.tableHeader).css({
					   			'left' :'-'+ __self.scrollLeft()+'px'
					   		})
					   })
					   //计算拖动条的高度
					   _self.o.find(_miniTable.dragLine).height(_self.o.height()-28);
					   _self.loaded();
		},
		$div:function(){
			var _self=this;
			$('#'+_self.id).empty();
			//显示数字列
			_self.customizeColumnsShow(_self.isShowDefaultNum,'mini-num');
			//显示全选项
			_self.customizeColumnsShow(_self.isShowCheckAll,'mini-check');
			//求出总宽度;
			var $divO=$('<div class="miniTable-div" _miniTable="minitable" style="width:'+ _self.width +'px">\
							<div class="miniTable-mask" style="width:100%;height:'+ (parseFloat(_self.height)+55) +'px;" _miniTable="mask"></div>\
							<div class="miniTable-loading" style="'
							+ 
								'top:'+ ((parseFloat(_self.height)+55)/2-25) +'px;left:50%;'
							+
							'" _miniTable="mask">loading...</div>\
							<div class="miniTable-div-container" _miniTable="containt">\
								<div class="miniTable-h" style="width:'+ ((_self.width!='')?(_self.width-17):_self.width) +'px" _miniTable="header_h">\
									<div class="miniTable-h-inner" _miniTable="header">\
										<table class="miniTable-h-table" _miniTable="h-table">\
											<tr class="miniTable-tr-th" _miniTable="header_th">'
											+	//添加表头
												_self.addHeader()						
											+'\
											</tr>\
										</table>\
									</div>\
								</div>\
								<div class="miniTable-m" _miniTable="content" style="width:'+ _self.width +'px;height:'+ _self.height +'px;">'
								+
									(function(){
										if(!_self.data||(_self.data.dataList&&_self.data.dataList.length==0)||_self.data == null){
											return '<div style="padding:20px;text-align:center;">'+ _self.noData +'</div>';
										}else{
											return '';
										}
									})()
								+
								'\
									<div style="position:relative;">\
										<table class="miniTable-m-table" _miniTable="m-table">'
										+	
											//添加表格内容
											_self.addData()
										+
										'</table>\
									</div>\
									<div style="clear:both;"></div>\
								</div>\
							</div>\
							<div class="miniTable-line" _miniTable="dragLine" style="height:'+ (parseFloat(_self.height)+25) +'px">\
							</div>\
							<div class="miniTable-f" style="width:'+ ((_self.width!='')?(_self.width-20):'') +'px">\
								<div style="position:relative;">\
								<table class="miniTable-f-table">'
								+
									_self.addPager()
								+'</table>\
								</div>\
							</div>\
						 </div>').appendTo('#'+_self.id);
			return $divO;
		},
		customizeColumnsShow:function( judgeFlag,judgeTxt ){
			var _self = this;
			if(judgeFlag){
				//mini-num : 为显示数据项的默认标示
				var flag = false;
				var totalWidth = 0;
				$.each(_self.colModule,function(i,v){
					if(v['name'] == judgeTxt){
						flag = true;
					}
					//给宽默认值100px;
					(!v['width'])&&(v['width']=100);
				});
				if(!flag)
				{
					//序号和全选的默认宽度为;
					_self.colModule.unshift (
						judgeTxt == 'mini-num'?
						//序号
						{name:judgeTxt,width:30,isResize:false,'text-align':'center'}:
						//全选
						{name:judgeTxt,width:50,isResize:false,'text-align':'left'}
					);
				}
				if(!flag)
				{
					_self.colNames.unshift (
						judgeTxt == 'mini-num'?
						_self.numberTxt:
						'<input type="checkbox" _miniTable="checkAll" class="miniTable-checkbox"/>'+_self.checkAllTxt
					);
				}
				//计算总宽度;
				$.each(_self.colModule,function(i,v){
					totalWidth += v['width'];
				});
				//求出总宽度;
				console.log( 'totalWidth',totalWidth );
				if(_self.data){
					_self.data['mini-totalWidth'] = totalWidth;
				}
			}
			if(judgeFlag&&_self.data&&_self.data.dataList.length!=0){
				//isCheckBoxDisabled 标示checkbox的禁用或激活状态,true为禁用,false为激活;
				$.each(_self.data.dataList,function(i,v){
					v[judgeTxt] = ( ( judgeTxt == 'mini-num' )?
									( _self.perPageData*(_self.currentPage-1) + (i+1) ):
									( '<input type="checkbox" _miniTable="checkGroup" name = "_miniTable_checkGroup" '+ (v['checkBoxDisabled'] == true?'disabled':'') +'/>' )
								  );
				});
			}
		},
		addHeader:function(){
			var _self=this;
			return $(_self.colNames).map(function(i){
					var Obj = $(_self.colModule).eq(i); 
 					var w = Obj.attr('width');
					var al = Obj.attr('text-align');
						al = al?al:'';
					var n = Obj.attr('name');
					//是否可拖动;
					var isR = Obj.attr('isResize');
						w = w?(w+'px'):'';
						return '<th style="text-align:'+ al +';width:'+ w +';" >\
									<span class="miniTable-resize" style="cursor: '+ (_self.isResize?'col-resize':'') +';display:'+ (isR==false?'none':'') +'" _miniTable="resize">\
										&nbsp;\
									</span>\
									<div class="miniTable-text-limit miniTable-h-div" style="width:'+ w +';" title="'+ ((n=='mini-check'||n=='operate')?'':this) +'" >'+this+'\
										<span class="miniTable-ico-box">\
											<span sort="asc" class="miniTable-arrow-up miniTable-arrow-disabled">\
											</span>\
											<span sort="desc" class="miniTable-arrow-down">\
											</span>\
										</span>\
									</div>\
								</th>'
					}).get()
					  .join('')
		},
		addData:function(){
			var _self=this;
			return (function(){
						if(!_self.data||(_self.data.dataList&&_self.data.dataList.length==0)||_self.data == null){
							return '';
						}else{
							return $(_self.data.dataList).map(function(i){
								var __self = this;
								return (function(){
											var str='<tr class="'+ (i%2!=0?'miniTable-m-interlacedColor':'') +'">';
											$.each(_self.colModule,function(j){
												var ___self=this;
												var w = ___self['width'];
												var al = ___self['text-align'];
													al = al?al:'';
												var n = ___self['name']; 
												var tdS='';
													$.each(__self,function(k,v){
														if(k==___self.name){
															if($.trim(v).length==0){
																v = _self.blankPlaceholder
															}
															tdS = v;
														}
													})
												w = (w?(w+'px'):'');
												str+='<td style="width:'+ w +'"><div class="'+ ((n!='operate')?'miniTable-text-limit':'operate') +' miniTable-m-div" style="width:'+ w +';text-align:'+ al +'" title="'+ ((n=='mini-check'||n=='operate')?'':tdS) +'">'
														+
														tdS
														+
													 '</div></td>';
											})
											str+='</tr>';
											return str
										})()
							}).get().join('')
					}
				})()
		},
		upData:function(){
			var _self = this;
				//显示数字列
				_self.customizeColumnsShow(_self.isShowDefaultNum,'mini-num');
				//显示全选项
				_self.customizeColumnsShow(_self.isShowCheckAll,'mini-check');
				_self.o.find(_miniTable['h-table']).empty().append(_self.addHeader());
				_self.o.find(_miniTable['m-table']).empty().append(_self.addData());
		},
		addPager:function(){
			var _self=this;
			_self.totalPage = Math.ceil(_self.totalData/_self.perPageData);
			_self.totalPage=_self.totalPage==0?1:_self.totalPage
			return '<tr style="display:'+(!_self.pagerShow&&'none')+'">\
						<td colspan="'+_self.colNames.length+'" class="pager" _miniTable="pager">\
							<span>共'+ _self.totalPage +'页</span>\
							<span>'+ _self.totalData_text.replace('{0}',_self.totalData) +'</span>\
							<a href="javascript:void(0)" _miniTable="firstPage">'+ _self.firstPage_text +'</a>\
							<a href="javascript:void(0)" _miniTable="prevPage">'+ _self.prevPage_text +'</a>\
							<a href="javascript:void(0)" _miniTable="nextPage">'+ _self.nextPage_text +'</a>\
							<a href="javascript:void(0)" _miniTable="lastPage">'+ _self.lastPage_text +'</a>\
							<span _miniTable="currentPage">'+ _self.currentPage_text.replace('{0}',_self.currentPage) +'</span>\
							<span>\
								<select _miniTable="rowList">'
								+
									$(_self.rowList).map(function(){
										return '<option value="'+ this +'">'+ this +'</option>'
									}).get().join('');
								+
								'\
								</select>\
							</span>\
						</td>\
					</tr>'
		},
		$ajax:function(){
			var _self=this;
			//给后台传递当前页码;
			console.log('url',_self.url);
			_self.ajaxData.currentPage=_self.currentPage;
			_self.ajaxData.perPageData=_self.perPageData;
			
			   $.ajax({
			    	url:_self.url,
			    	type:'POST',
			    	data:_self.ajaxData,
			    	dataType:'json',
			   	beforeSend: function(){
			   		// Handle the beforeSend event
			  			_self.o.find(_miniTable.mask).fadeIn();
			   	},
			   	success: function(data){
						// Handle the success event
						setTimeout(function(){
							_self.o.find(_miniTable.mask).fadeOut();
						},1000);
						//var data = _self.data;
						_self.data = data;
						_self.o.find(_miniTable.currentPage).html(_self.currentPage_text.replace('{0}',_self.currentPage));
						if(_self._data.repeatLoad){
							//二次加载,只更新中间数据部分;
							_self.upData();
						}else{
							//第一次加载,加载全部;
							if(data){
								_self.data=data;
								_self.totalData=data.totalData;
								//_self.perPageData=data.perPageData;
							}
							_self.$event();
							_self._data.repeatLoad = true;
						}
			   	},
			   	error:function(){
			   		// Handle the error event	
			   	}
			   });
		},
		//禁止选中文本和启用选中文本
		isSelectedTxt : function(flag){
			if(document.onselectstart)//ie&chrome
			{
			    document.onselectstart=function(){return flag;};
			}
			else
			{
			    document.onmousedown=function(){return flag;}
			}
			document.body.onselectstart=function(){ return flag;}
		},
		//改变宽度;
		changeWidth : function(index,width){
			var _self = this;

			_self.o.find('.miniTable-h-table .miniTable-h-div').eq(index).width(width);
			_self.o.find('.miniTable-h-table th').eq(index).width(width);
			_self.o.find('.miniTable-m-table tr').each(function(){
				$(this).find('td').eq( index ).width( width );
				$(this).find('.miniTable-m-div').eq( index ).width( width );
			})
		}
	};
	$.fn.miniTable = function(opt){
		return new MiniTable(opt);
	};
})(jQuery);