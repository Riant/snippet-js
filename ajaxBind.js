;(function($){
    $(function(){
        $.ajaxBind:   function(setting, stringify){
            var opts = $.extend({
                type:   'POST',
                dataType:   "json",
                cache:      false,
                data:       null
            }, setting);
            if( stringify ){
                if( opts.type != 'GET' && opts.data ){
                    opts.data = JSON.stringify( opts.data );
                }
            }
            if( opts.type == 'GET' && (/\{*\}/).test(opts.url)){
                $.extend(opts, rewrite(opts.url, opts.data));
            }
            $.ajax(opts);
        };
        
        $.fn.ajaxBind:   function(ajaxSetting, others){
            ajaxSetting = ajaxSetting || {};
            others = others || {};

            if($(this).length){
                $(this).each(function(){
                    var $this = $(this),
                        isForm = $this.is('form') ? true : false,
                        isA = $this.is('a') ? true : false;
                    var funs = {
                        onBegin:    null,
                        onSuccess:  null,
                        onError:    null
                    };
                    var ajaxOpts = {
                        type:   ajaxSetting.type ? ajaxSetting.type : (isForm ? $this.attr('method').toUpperCase() : 'GET')
                    };

                    var setting = {
                        loading:    true,
                        stringify:  ajaxOpts.type != 'GET',
                        type:       isForm ? 'submit' : (isA ? 'click' : 'change'),
                        cache:      $this.data('cache') ? $this.data('cache') : null,
                        messageBox: null,
                        onBegin:    null,
                        successMsg: _e('ajax_success_msg'),
                        onSuccess:  null,
                        errorMeg:   '',
                        onError: null
                    };

                    setting = $.extend(setting, others);

                    if( setting.loading ){
                        var loading = {};
                        if( setting.loading == 'disabled' || $this.is('input') ){
                            ajaxOpts.beforeSend = function(){
                                $this.attr('disabled', 'disabled');
                            }
                            loading.close = function(){
                                $this.removeAttr('disabled');
                            }
                        } else {
                            ajaxOpts.beforeSend = function(){ 
                                var loadingArea;
                                if( typeof setting.loading == 'function' ){
                                    loadingArea = setting.loading($this);
                                } else {
                                    loadingArea = typeof setting.loading == 'object' ? setting.loading : $this;
                                }
                                loading = loadingBox( loadingArea ); 
                            }    
                        }                        
                        funs.onError = function(){ loading.close(); }
                        funs.onSuccess = function(){ loading.close();}
                    }
                    var ajaxSettingExtend = function( onBegin ){
                        ajaxOpts = $.extend(ajaxOpts, ajaxSetting);
                        if( ajaxSetting.data ){
                            ajaxOpts.data = typeof ajaxSetting.data == 'function' ? ajaxSetting.data($this) : ajaxSetting.data;
                        } else if ( isForm ){
                            ajaxOpts.data = createData($this);
                        } else if ( !isA ){
                            ajaxOpts.data = {};
                            ajaxOpts.data[$this.attr('name')] = $this.val();
                        }

                        if( ajaxSetting.url ){
                            ajaxOpts.url = typeof(ajaxSetting.url) == 'function' ? ajaxSetting.url($this, ajaxOpts.data) : ajaxSetting.url;
                        } else if( isForm ){
                            ajaxOpts.url = $this.attr('action');
                        } else if ( isA ) {
                            ajaxOpts.url = $this.attr('href');
                        } else {
                            ajaxOpts.url = $this.data('remote');
                        }

                        return (! onBegin || onBegin( ajaxOpts.data, $this, setting.loading ? loading : null ));
                    };
                    var backFuncExtend = function(ajaxOpts){
                        return {
                            success: function(data){
                                if( setting.successMsg ){
                                    msgBoxShow(setting.successMsg, 'success', setting.messageBox);
                                }
                                if( setting.cache ){
                                    if( $this.is('select') ) 
                                        $this.children(':selected').data('temp', data);
                                    else 
                                        $this.data('temp', data);
                                }
                                if(others.onSuccess) others.onSuccess(data, $this, ajaxOpts.data);
                                if(funs.onSuccess) funs.onSuccess();
                            },
                            error: function(backData, errorInfo){
                                if( !setting.errorMeg ){
                                    try{
                                        var response = JSON.parse(backData.responseText);
                                    } catch(err){
                                        var response = { message: ''};
                                    }
                                    var errorMsg = (response.message ? response.message : _e('ajax_error_msg'));
                                } else {
                                    var errorMsg = _e('ajax_error_msg');
                                }

                                msgBoxShow(errorMsg, 'faild', setting.messageBox);
                                if(setting.onError) setting.onError(errorMsg, $this, ajaxOpts.data);
                                if(funs.onError) funs.onError();
                            }
                        }
                    }

                    if( setting.type == "auto" ){
                        if( ajaxSettingExtend( setting.onBegin )){
                            ajaxOpts = $.extend(backFuncExtend(ajaxOpts), ajaxOpts);
                            $.ajaxBind(ajaxOpts, setting.stringify);
                        }
                    } else {
                        $this.on(setting.type, function(){
                            var getTemp = setting.cache ? ($this.is('select') ? $this.children(':selected').data('temp') : $this.data('temp')) : false;
                            if( getTemp ){
                                if( setting.onBegin ){
                                    setting.onBegin($this, null);
                                }
                                setting.onSuccess($this.data('temp'), $this);
                            } else {
                                if( ajaxSettingExtend( setting.onBegin )){
                                    ajaxOpts = $.extend(backFuncExtend(ajaxOpts), ajaxOpts);
                                    $.ajaxBind(ajaxOpts, setting.stringify);
                                }
                            }
                            return false;
                        });
                    }
                });
            }
        }

        function loadingBox(block){
            var close;
            if( block.is('a') ){
                block.addClass('disabled');
                close = function(){
                    block.removeClass('disabled');
                }
            } else {
                if(! block.find('.loadingBox').length){
                    block.append('<div class="loadingBox"><img src="'+ staticPath +'/css/images/loading.gif" class="loading" /></div>');
                    block.css({position: 'relative'});
                }
                var loadingBox = block.find('.loadingBox');
                var width = block.innerWidth();
                var height = block.innerHeight();
                loadingBox.css({ width: width, height: height, top:0, left:0, position:'absolute'}).show();

                close = function(){
                    loadingBox.fadeOut(200);
                }
            }
            return {
                mseeage:    function(html, className){
                    var htmlBox = loadingBox.children('span');
                    if( ! htmlBox.length ){
                        htmlBox = $('<span></span>');
                        htmlBox.appendTo(loadingBox);
                    }
                    
                    htmlBox.attr('class', className).html(html).css({marginLeft: parseInt(htmlBox.innerWidth())/-2}).show();
                },
                close:  close
            }
        };

        function rewrite(url, data){
            var ret = {};
            if( (/\{*\}/).test(url) ) {
                for( i in data ){
                    if( url.indexOf('{'+ i +'}') > -1 ) {
                        url = url.split('{'+ i +'}').join(data[i]);
                        delete data[i];
                    }
                }    
            }
            return { url:  url, data: data };
        }
    });
})(jQuery);