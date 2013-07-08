/*
 * name: tree;
 * author: licuiting;
 * email: 250602615@qq.com;
 * date: 2011-4-22;
 * version: 2.0;
 * 调用
 	$('body').tree({
		id:'tree'
 	});
 *
 */
 (function($){
	function Tree(opt){
		this.defaultSetting=$.extend( this, this.defaultSetting, opt ||{});
		this.init();
	}
	Tree.prototype={
		defaultSetting:{
			id:'',
			//传过来的json数据中对应的key:treeId;
			treeId:"id1",
			//传过来的json数据中对应的key:parentId;
			parentId:"parentId1",
			//传过来的json数据中对应的key:content;
			content:"content1",
			//通过ajax请求获得数据的url;
			url:"",
			//整理数据时自定义的key:checked,用以判断该选项是否选中;
			checked:"checked",
			//整理数据时自定义的key:children,用以装该对象的子集;
			children:"children",
			//判断复选框的显示状态,默认为true(显示);
			showCheckBox:true,
			//是否显示箭头,默认是显示;
			showArrow:true,
			//子级和父级的宽度差;
			interval:"14",
			//点击树的回调函数;
			treeClick:function(){},
			//数据接口
			htmlContent://null,
			{
				'treeContent':[
					{id1:"1",parentId1:"0",content1:"第一层"},
					{id1:"2",parentId1:"0",content1:"第一层"},
					{id1:"12",parentId1:"1",content1:"第二层"},
					{id1:"13",parentId1:"1",content1:"第二层"},
					{id1:"21",parentId1:"2",content1:"第二层"},
					{id1:"22",parentId1:"2",content1:"第二层"},
					{id1:"124",parentId1:"12",content1:"第三层"},
					{id1:"123",parentId1:"12",content1:"第三层"},
					{id1:"222",parentId1:"22",content1:"第三层"},
					{id1:"223",parentId1:"22",content1:"第三层"},
					{id1:"1231",parentId1:"123",content1:"第四层"},
					{id1:"1232",parentId1:"123",content1:"第四层"}
				],
				'selectTree':[
					{id1:"123"},
					{id1:"12"},
					{id1:"1"},
					{id1:"13"},
					{id1:"2"},
					{id1:"22"},
					{id1:"223"},
					{id1:"1231"}
				]
			},
			strAr:[]
		},
		init:function(){
			var _self=this;
			_self.$div();
			_self.clickEvent()
				 .hoverEvent();
		},
		$div:function(){
			var _self=this;
			var divO=$('<div class="tree" _tree="tree">\
						<ul class="firstUl">'+
							_self.treeModul(_self.treeStructure(),0)
						+'\
					 	</ul>\
					  </div>').appendTo('#'+_self.id)
							  .find('.divStyle:first')
							  .addClass('divStyle_click')
							  .end();
			console.log('-----init success----');
			return divO;
		},
		treeStructure:function(){
			var _self=this;
			var json=_self.htmlContent;
			//参数说明:后台传来的json数据;
			if(json==null||json.length==0){
				return false;
			}
			var data=json['treeContent'];
			//接收后台传来的选中的checkbox的id;
			var checkedIdArry=json['selectTree']||[];
			//数据用id做key,循环的子对象做value生成ob;
			var ob={};
			var arN=[];
			//并给data中的对象添加children为空和checked为0的属性;
			$.each(data,function(){
				ob[this[_self.treeId]]=this;
				this[_self.children] = this[_self.children] || [];
				this[_self.checked] = this[_self.checked] || "0";
			});
			$.each(data,function(){
				var dataO=this;
				//后台传递的选中的checkbox的值不为空时,就根据后台传过来的选中的id来给各分支赋值,选中就赋值为1,没选中就等于默认的结果0;反之则不执行这一操作;
				if(checkedIdArry.length!=0){
					$.each(checkedIdArry,function(){
						if(dataO[_self.treeId]==this[_self.treeId]){
							dataO[_self.checked]= "1";

							return false;
						}
					});
				}
				//寻找父级节点,并把本身添加到父级的children数组中;
				if(this[_self.parentId]!=0){
					ob[this[_self.parentId]][_self.children].push(this);
				}
			});
			//筛选找到根节点,生成树的数据结构;
			$.each(ob,function(){
				if(this[_self.parentId]==0){
					arN.push(this);
				}
			});
			return arN;
		},
		treeModul:function(data,degree){
			var _self=this;
			var strAr=[];
			$.each(data,function(){
					//根据checked属性来判断checkbox的选中状态;
					var ico_class="ico";
					var dataO2=this;
					var checkBoxStr="";
					var boxWidth=0;
					var textLength=0;
					var lastText="";
					var checkboxWidth=0;
					var arrowStr="";
					var txtStr = '<span class="ico-tt"></span>'
					//
					//最终的文字显示;如果大于配置的长度就以省略号显示;
					lastText=_self.content;
					//有子集的时候,添加arrow图标,并递归;
					if(dataO2[_self.children] && dataO2[_self.children].length>0) {
						//当后台传来的值显示为选中时,就进行判断是全选还是部分选中;
						if(dataO2[_self.checked]=="1"){
							//给本身添加选中样式ico_checked;
							ico_class="ico ico_checked";
							//根据子集来判断本身是全选还是部分选中;
							$.each(dataO2[_self.children],function(){
								if(this[_self.checked]==0){
									//只要有一个没选中就把ico_class的值设为部分选中的样式ico_checkedPart;
									ico_class="ico ico_checkedPart";
									return false;
								}
							});
						}
						//如果checkbox显示,就添加checkbox的字符串,否则字符串为空;
						if(_self.showCheckBox){
							checkBoxStr="<span class='"+ico_class+"'></span>";
						}
						//显示箭头
						if(_self.showArrow){
							arrowStr="<span class='arrow'></span>";
						}
						_self.strAr.push("<li><div name='"+dataO2[_self.treeId]+"' class='divStyle'><span style='width:"+(degree*_self.interval)+"px'></span>"+arrowStr+checkBoxStr+txtStr+"<span class='text' title='"+dataO2[_self.content]+"'>"+lastText+"</span></div>");
						_self.strAr.push("<ul style='display:none;'>");
						_self.treeModul(dataO2[_self.children],degree+1);
					}else{
						//本身没有子集就直接查看本身checked属性,并改变相应的样式;
						if(dataO2[_self.checked]=="1"){
							ico_class="ico ico_checked";
						}
						//如果checkbox显示,就添加checkbox的字符串,否则字符串为空;
						if(_self.showCheckBox){
							checkBoxStr="<span class='"+ico_class+"'></span>";
						}
						//显示箭头
						if(_self.showArrow){
							arrowStr="<span class='arrow no_children'></span>";
						}
						//没有子集的时候不添加arrow图标,但要占位;
						_self.strAr.push("<li><div name='"+dataO2[_self.treeId]+"' class='divStyle'><span style='width:"+(degree*_self.interval)+"px'></span>"+arrowStr+checkBoxStr+txtStr+"<span class='text' title='"+dataO2[_self.content]+"'>"+lastText+"</span></div>");
						_self.strAr.push("<ul style='display:none;'>");
					}
					_self.strAr.push("</ul></li>");
				});
			return _self.strAr.join("");
		},
		//父级元素状态的判断;
		judgeChecked:function(obj3){
			//当子元素全选中时,父级中的ico添加ico_checked样式;
			//全未选中时,父级中的ico去掉ico_checked样式;
			//其他情况,父级中的ico添加ico_checkedPart样式;
			//获取第一层父级元素;
			var parentFirst=obj3.parent().parent().parent(),
				//获取执行对象的同级元素的li对象;
				parentLi=parentFirst.children("li"),
				//获取执行对象的同级元素中含有class:ico_checked的元素的个数;
				siblingsElLength=parentLi.find(".ico_checked").length,
				//获取执行对象的所有同级元素中class含有ico的元素的个数;
				spanIcoLength=parentLi.find(".ico").length,
				//获取执行对象的第一层父级元素的prev中class为ico的元素;
				parentPrev=parentFirst.prev().find(".ico");
				//删除选中和部分选中的样式;
				parentPrev.removeClass("ico_checked").removeClass("ico_checkedPart");
				if(siblingsElLength==spanIcoLength){
					//全选中;
					parentPrev.addClass("ico_checked");	
				}else if(siblingsElLength==0){
					//全未选中;
				}else{
					//部分选择;
					parentPrev.addClass("ico_checkedPart");	
				}
				//不包括根元素;
				if(parentFirst.hasClass("firstUl")==false){
					//递归判断;
					_self.judgeChecked(parentPrev);
				}
		},
		//给控件绑定click事件;
		clickEvent:function(){
			var _self=this;
			//获取div对象;
			var divObj=$("#"+_self.id).find(".divStyle");
			//div选中时的样式;
			divObj.unbind('click.div1').bind('click.div1',function(){
				//所有对象添加class:divStyle_click;
				divObj.removeClass("divStyle_click");
				//点击对象移除class:divStyle_hover(先执行hover事件会先添加一个divStyle_hover样式),并添加class:divStyle_click;
				$(this).removeClass("divStyle_hover").addClass("divStyle_click");
				//当没有显示箭头时,则把click事件绑定到div上;
				if(_self.showArrow==false){
					//点击div时切换样式;
					$(this).toggleClass("arrow_selected");
				}
				$(this).next().toggle();
				if($(this).find('.no_children').length==0){
					$(this).find('.arrow').toggleClass("arrow_selected");
				}
				//调用click的回调函数;
				_self.treeClick($(this));
			});
			//控件的click事件;
			$("#"+_self.id).unbind('click.div2').bind('click.div2',function(e){
				//获取执行对象的目标;
				var tg=$(e.target),
					//获取执行对象的所有后代元素;
					childrenEl=tg.parent().next().find(".ico");
				//点击小图标checkbox时,切换样式;并选中所有后代元素;
				if(tg.hasClass("ico")){
					//点击checkbox改变样式;
					//当点击的对象已经选中时,去掉全选或者部分选中的样式;
					//注:部分选中默认为选中状态,只是选中状态的另一种表现形式;
					if(tg.hasClass("ico_checked")||tg.hasClass("ico_checkedPart")){
						tg.removeClass("ico_checked").removeClass("ico_checkedPart")
					}else{
						tg.addClass("ico_checked");
					}
					//图标处于选中状态;选中他的所有后代元素;同时判断他的父级状态(全选/未全选/部分选中);
					if(tg.hasClass("ico_checked")){
						childrenEl.removeClass("ico_checked").addClass("ico_checked");
						_self.judgeChecked(tg);
					}else{
						//当图标未选中时;他的所有后代元素取消全选;同时判断他的父级状态(全选/未全选/部分选中);
						childrenEl.removeClass("ico_checked");
						_self.judgeChecked(tg);
					}
				}else if(tg.hasClass("arrow")){
					//点击箭头时切换样式;
					//tg.toggleClass("arrow_selected");
					//显示其后代元素;
					//当箭头朝下,显示子代元素;
//					if(tg.hasClass("arrow_selected")){
//						tg.parent().next().show();
//					}else{
//						//当箭头朝右,隐藏子元素;
//						tg.parent().next().hide();
//					}
				}
			});
			return this;
		},
		//给控件绑定hover事件;
		hoverEvent:function(){
			var _self=this;
			//鼠标上移div背景变色;
			$("#"+_self.id).find(".divStyle").hover(function(){
				//鼠标上移时,如果是执行了click事件的div则不变色,否则给此div添加divStyle_hover样式;
				if($(this).hasClass("divStyle_click")==false){
					$(this).addClass("divStyle_hover");
				}
			},function(){
				$(this).removeClass("divStyle_hover");
			});
			return this;
		}
	}
	$.fn.tree = function(opt){
		new Tree(opt);
	};
})(jQuery)