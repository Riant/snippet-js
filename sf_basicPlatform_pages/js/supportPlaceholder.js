/* 各浏览器兼容支持placeholder */
var tools = tools || {};
(function(){
    //判断是否支持placeholder
    var isPlaceholer = (function isPlaceholer(){
        var input = document.createElement('input');
        return "placeholder" in input;
    })();
    //创建一个类
    function Placeholder(obj){
        this.input = obj;
        var label = this.label =
            $('<div name="placeholder-txt"></div>')
                .appendTo( 
                    $(this.input.parentNode).css({position : 'relative'}) 
                )[0];
        var placeholder = $(obj).attr('placeholder');
        $(label).html( placeholder );
        $(label).css ({
                'position'      : 'absolute',
                'text-indent'   : 4,
                'color'         : '#999999',
                'font-size'     : 12,
                'display'       : obj.value == '' ? '' : 'none',
                'left'          : 0,
                'top'           : 0,//外层样式影响;
                'width'         : $(this.input).width(),
                'height'        : 25,
                'lineHeight'    : '25px'
            });
        this.init();
    }
    Placeholder.prototype = {
        init : function(){
            var label = $(this.label);
            var input = $(this.input);
            input.css({"position":"absolute","top":"0","left":"0"});
            label
                .appendTo( input.parent().css({position : 'relative'}) )
                .click(function(){
                	if($(label).parent().hasClass("addNumBox-input")){//特殊处理
                		label.hide();
                    	input.click();
                	}else{
                		input.focus();
                	}
                })
            input.on('input propertychange', function  ( e ) {
                // 对付ie 在用户输入时立刻响应
                console.log('-- placeholder input test --');
                if ( e.type == 'propertychange' ) {
                    if ( e.originalEvent.propertyName != 'value' ) {
                        return;
                    }
                }
                // 如果内容没变化
                if ( this.value == '' ) {
                    return ;
                }
                console.log('-- hide --');
                label.hide();
            });
            
            input.blur(function(){
                if(this.value == ""){
                    label.show();
                }
            });
            ec.on('i18n',function() {
                setTimeout(function() {
                   $(label).text( $(input).attr('placeholder') );
                },0)
            });
        }
    }
    // 添加placeholder
    tools.doPlaceholder = function( options ) {
        // 如果不支持placeholder
        if( !isPlaceholer ){
            // 添加placeholder
            $('[msgplus-placeholder]').each(function() {
                if (!$.data(this, 'plugin_placeholder')) {
                    $.data(this, 'plugin_placeholder', new Placeholder( this, options ));
                }
            })
        }
    }
})()