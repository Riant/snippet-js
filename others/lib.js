;(function($){
    $.extend({
        ajaxBind:   function(setting, stringify){
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
                opts.contentType = "application/json; charset=utf-8";
                opts.processData = false;
            }
            if( opts.type == 'GET' && (/\{*\}/).test(opts.url)){
                $.extend(opts, rewrite(opts.url, opts.data));
            }
            $.ajax(opts);
        },
        stringify:  function stringify(obj) { //$.parseJSON() is available in jQuery1.4+;
            if ("JSON" in window)  return JSON.stringify(obj);

            var t = typeof (obj);
            if (t != "object" || obj === null) {
                if (t == "string") obj = '"' + obj + '"';
                return String(obj);
            } else {
                var n, v, json = [], arr = (obj && obj.constructor == Array);
                for (n in obj) {
                    v = obj[n];
                    t = typeof(v);
                    if (obj.hasOwnProperty(n)) {
                        if (t == "string") {
                            v = '"' + v + '"';
                        } else if (t == "object" && v !== null){
                            v = jQuery.stringify(v);
                        }
                        json.push((arr ? "" : '"' + n + '":') + String(v));
                    }
                }
                return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
            }
        },
        format: function (source, params) {
            if (arguments.length == 1)
                return function () {
                    var args = $.makeArray(arguments);
                    args.unshift(source);
                    return $.format.apply(this, args);
                };
            if (arguments.length > 2 && params.constructor != Array) {
                params = $.makeArray(arguments).slice(1);
            }
            if (params.constructor != Array) {
                params = [params];
            }
            $.each(params, function (i, n) {
                source = source.replace(new RegExp("\\{" + i + "\\}", "g"), n);
            });
            return source;
        },
        extendObj: function(datas, temp, prefix){
            temp = $.trim(temp.replace(/(\s*)?(\n|\r)(\s*)?/g,''));
            prefix = prefix || '';
            var html = '';
            if( temp.length ){
                if( typeof datas == 'string' && datas.length ){
                    html += temp.split( '{'+ prefix +'value}' ).join( datas );
                } else if( typeof datas == 'object' && datas.length ){  // if it is an array
                    if( typeof datas[0] == 'string' ){
                        for(var i = 0; i < datas.length; i++){
                            html += temp.split( '{'+ prefix +'value}' ).join( datas[i] );
                        }
                    } else {
                        for(var i = 0; i < datas.length; i++){
                            html += objectToHtml(datas[i], null, i);
                        }
                    }
                } else if( typeof datas == 'object' ) {
                    html += objectToHtml(datas);
                }
                return html;    
            }
            return html;

            function replace(item, from, to){
                if( item.indexOf(from) > -1 ){
                    return item.split(from).join(to === null ? '' : to);
                }
                return item;
            }

            function objectToHtml(data, item, itemIndex){
                item = $.trim(item || temp);
                
                for(var p in data){
                    var theval = data[p];
                    if( theval && typeof theval == 'object' && !theval.length ) {    // data is a object
                        for(var objAttr in theval ){
                            item = replace(item, '{' + p + '.' + objAttr + '}', theval[objAttr]);                    
                        }
                    } else if ( theval == null || typeof theval != 'object' ) {
                        item = replace(item, '{'+ prefix + p +'}', theval);
                    }
                }
                
                var testReg = (/\{@test\s+([^@]+)\s+@\}/);
                var inlayReg = (/\{@getTemplate\s*=\s*"([^"]*)"\}/);
                var foreachReg = (/\{@foreach\s+items="([^"]+)"\s*\}(.*)(?=\{\/)\{\/@foreach\}/);
                
                while( inlayReg.test(item) ){
                    var test = inlayReg.exec(item);
                    item = item.split( test[0] ).join( $('#' + test[1]).extendObj(data) );
                }                
                while(foreachReg.test(item)){
                    var test = foreachReg.exec(item);
                    var items = data[test[1]], itemTemp = test[2]
                        itemsHtml = '';
                    if( typeof items == 'object' && items.length ){
                        itemsHtml += $.extendObj(items, itemTemp, '.');
                    }
                    item = item.split( test[0] ).join( itemsHtml );
                }
                while( testReg.test(item) ){
                    var test = testReg.exec(item);
                    item = item.split( test[0] ).join( (function($index, $data){ return eval(test[1]); })(itemIndex, data) );
                }                
                return item;
            }
        }
    });

    $.fn.extend({
        checkStyle: function(onChanged){
            if( !$(this).length ) return $(this);
            return $(this).each(function(){
                var item = $(this),
                    checkbox = item.find('input'),
                    label = item.find('label');
                label.append('<i class="checkbox"></i>');
                if( checkbox.attr('checked') )
                    item.addClass('on');

                checkbox.on('change', function(){
                    $('#brandsForVendorBtn').removeAttr('disabled');
                    if( $(this).attr('checked') ) {
                        item.addClass('on');
                    } else {
                        item.removeClass('on');
                    }
                    if( onChanged ) onChanged($(this).attr('checked'), item);
                });
            });
        },
        hsValidate: function( setting ){
            setting = setting || {};
            return $(this).each(function(){
                var opts = $.extend({}, setting);
                opts.rules = getValidateRulesByForm($(this), ( typeof opts.rules != 'undefined' ? opts.rules : null));
                var mulitValids = $(this).find('.mulitValid');
                if( mulitValids.length ){
                    $(this).attr('novalidate', true);
                    $(this).submit(function(){                        
                        var validator = $(this).validate( { rules: opts.rules} );
                        var mulitKeys = {};
                        mulitValids = $(this).find('.mulitValid');
                        mulitValids.each(function(i){
                            var oldName = $(this).data('name') ? $(this).data('name') : $(this).attr('name');
                            if( opts.rules[oldName] ){
                                if( mulitKeys[oldName] ) {
                                    $(this).data('name', oldName).attr('name', oldName + '_' + i);
                                    $(this).rules('add', opts.rules[oldName]);
                                } else 
                                    mulitKeys[oldName] = true;
                            }
                        });
                        var valid = $(this).valid();
                        if( valid ){
                            mulitValids.each(function(i){
                                var name = $(this).data('name');
                                if( name ) 
                                    $(this).attr('name', name);
                            });
                            if( opts.submitHandler ) opts.submitHandler( this );
                        }
                        return false;
                    });
                } else {
                    $(this).validate( opts );
                }
            });
        },
        tab:function(){
            var show_id = $(this).children('.cur').attr('rel');
            $('#' + show_id).show();
            $(this).children().click(function () {
                var cont_id = $(this).attr('rel');
                $(this).addClass('cur').siblings().removeClass('cur');
                $('#' + cont_id).show().siblings().hide();
            })
        },
        inputFileBox:   function( ajaxUploadBind, onUploaded, text ){
            var inputs = $(this);
            if( !inputs.length ) return;
            $(this).each(function(){
                var input = $(this);
                if( input.is('.btnDone') ) return;
                var textshow = text || input.data('show') || _e('upload_image');
                //var height = input.innerHeight();
                var img = input.prev('img').addClass('imgPreview'), note = input.next('.fieldNote');
                var className = input.attr('class');
                input.addClass('btnDone').wrap('<i class="inputFileBtn"></i>')
                    .after('<a href="javascript:;">'+ textshow +'</a>');
                var inputFileBtn = input.parent();

                if( ajaxUploadBind ) {
                    var urlInputId = input.data('imgsaveto'), urlInput;
                    var loading = {};
                    
                    inputFileBtn.wrap('<span class="imgUpdateBox '+ className +'"></span>');
                    input.ajaxFile({
                        dataType: 'json',
                        before: function( elem ){
                            var imgBox = elem.parent().parent();
                            loading = loadingBox(imgBox);
                            // imgBox.addClass('uploading').append('<i class="loading"><img src="" /></i>');
                        },
                        success: function( data, status, elem ){
                            var
								imgBox,
								oRes,
								$imgEl,
								sSrc
							;

							data = data || {};

                            loading.close();
                            // imgBox.removeClass('uploading').find('.loading').remove();

							if(!data.status){
								alert(data.errorMsg);
								return;
							}

							imgBox = elem.parent().parent();
							oRes = data.imageResponse;
							$imgEl = imgBox.find('.imgPreview');
							sSrc = uploadPath + oRes.imageUrl + '?v=' + Date.parse(new Date());

							if($imgEl.length){
								$imgEl.attr('src', sSrc);
							}else{
								imgBox.addClass('hasImg').prepend('<img src="' + sSrc + '" class="imgPreview" />');
							}

                            urlInput = urlInputId ? $('#' + urlInputId ) : imgBox.prev('input');
							urlInput.length && urlInput.val(oRes.imageId);

							"function" === typeof onUploaded && onUploaded(input);
                        }
                    });
                    if ( note ) {
                        inputFileBtn.append('<em>' + note.hide().text() + '</em>');
                    };
                }
                if( img.length )
                    inputFileBtn.before(img).parent().addClass('hasImg');
                else
                    inputFileBtn.addClass('btn');
            });
            return {
                changeText: function(ele, newText){
                    ele.next().text(newText);
                }
            }
        },
        extendObj: function(datas){
            var html = '';
            if( $(this).length ){
                html = $.extendObj(datas, $(this).html());
            }
            return html;
        },
        ajaxBind:   function(ajaxSetting, others){
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
        },
        removeItemBind: function(item, data, backFunc){
            $(this).each(function(){
                var $this = $(this);
                var theItem = item ? (typeof item == 'function' ? item($this) : item) : $('#' + $this.data('item'));
                var ajaxSetting = { type: 'DELETE' };
                if( data )
                    ajaxSetting.data = typeof data == 'function' ? data($this) : data;

                $this.ajaxBind(ajaxSetting, {
                    onBegin: function(){
                        theItem.addClass('removing');
                        if( ! confirm( _e('confirm_delete') ) ){
                            theItem.removeClass('removing');
                            return false;
                        }
                        return true;
                    },
                    onSuccess: function( status, elem, pushData ){
                        theItem.fadeOut(500, function(){
                            $(this).remove();
                        });
                        var records = elem.data('recordsupdate');
                        if( records ) $(records).text(function(){ return Number($(this).text()) - 1});
                        if( backFunc ) backFunc( true, elem, pushData );
                    },
                    onError: function( status ){
                        theItem.removeClass('removing');
                        if( backFunc ) backFunc( false, $this, data );
                    }
                });
            });
        },
        floatBoxShow:   function(){
            if( $(this).length ){
                $(this).each(function(){
                    var box = $('#' + this.id + 'Box');
                    if( box.length ) {
                        var boxH = box.innerHeight();
                        box.css({top: '-' + boxH + 'px'});

                        box.append('<a href="#" class="close">Close</a>');
                        box.find('.close').click(function(){
                            box.show().animate({ top: '-' + boxH, opacity: 0 }, 300, function(){
                                $(this).hide();
                            });
                            return false;
                        });

                        $(this).click(function(){
                            box.show().animate({ top: 0, opacity: 1 }, 300);
                        });
                    } else {
                        return false;
                    }
                });
            }
        },
        lightbox: function(setting){
            if( $(this).length ) {
                var opts = $.extend({
                    className: '',
                    title: null,
                    type: 'side',
                    shade: true,
                    width: 500,
                    afterShow: null,
                    cache:  false,
                    onClose: null
                },setting);

                init();

                $(this).each(function(){
                    // opts.title = opts.title ? ( typeof opts.title == 'function' ? opts.title($(this)) : opts.title) : $(this).attr('title');
                    opts.title=$(this).attr("title");
      
                    $(this).on('click', function(){
                        var theBox = new box(opts, $(this));
                        theBox.show();
                        return false;
                    });
                });
            }
            function box( opts, $this ){
                var ele = {
                    box: $('#lightbox'),
                    shade: $('#shade')
                }
                ele.stage = ele.box.children('.stage');

                this.init = function(){
                    var thebox   = this;
                    var closeBtn = ele.box.children('.close');
                    ele.box.css({ width: isNaN(opts.width) ? opts.width : (opts.width + 'px')}).addClass('lightbox' + opts.type);
                    ele.box.children('.title').text(opts.title);
                    closeBtn.on('click', thebox.close);
                    ele.shade.on('click', thebox.close);
                };
                this.show = function(){
                    this.init();
                    if( opts.shade ){
                        ele.shade.show();
                    }
                    ele.box.show();
                    HS.msgBox.parent().addClass('lightboxMsg').hide();
                    if( opts.afterShow ) opts.afterShow( ele.stage, $this, this );
                };
                this.close = function(){
                    if( opts.onClose ) opts.onClose( ele.stage, $this, this );
                    ele.shade.hide();
                    ele.box.hide();
                    if( ! opts.cache ) {
                        HS.msgBox.parent().removeClass('lightboxMsg').hide();
                        ele.stage.html('');
                    }
                }
            }
            function init( type ){
                var boxHeaderH = 67 + 15,
                    windowH = parseInt($(window).height());
                var shade = $('#shade'),
                    lightbox = $('#lightbox');

                if( ! lightbox.length ){
                    var lightbox = $('<div id="lightbox" class="lightbox"></div>').append( '<h2 class="title"></h2><a href="javascript:;" class="close btn btnLarge">X</a><div class="stage"></div>');
                    var shade = $('<div id="shade" class="shade"></div>');
                    $('body').append(shade).append(lightbox);
                    lightbox = $('#lightbox');

                    $(window).resize(function(){
                        init('resize');
                    });
                }
                
                lightbox.children('.stage').height( windowH - boxHeaderH );
            }
        },
        refreshBySelect: function( refreshBox, optBank ){
            if( ! $(this).length || ! refreshBox.length || ! optBank.length ) return;
            optBank.hide();
            checkAndRefresh( $(this), refreshBox);
            $(this).on('change', function(){
                checkAndRefresh($(this), refreshBox);
            });
            
            function checkAndRefresh( select, refreshBox ){
                var optionsIds = select.children(':selected').data('options').split(' ');
                refreshBox.children().appendTo(optBank);
                for( var i = 0; i < optionsIds.length; i++ ){
                    var opts = $('#' + optionsIds[i]);
                    refreshBox.append( opts );                      
                }
            }
        },
        showByTree: function(setting, onFinished){
            if( !$(this).length ) return;
            var opts = $.extend({
                    itemTag:    'li',
                    groupTag:   'ul',
                    groupIdPrefix: 'childrenOf_',
                    itemBodyTag: 'div',
                    itemIdPrefix: 'item_',
                    showButtonInsert: 'after'
                }, setting || {});
            
            return $(this).each(function(){
                    $(this).children(opts.itemTag).each(function(){
                        var pId = $(this).data('pid');
                        if( pId > 0 ) {
                            var parent = $('#' + opts.itemIdPrefix + pId);
                            if( ! parent.children(opts.groupTag).length ) {
                                var toggleButton = $('<i class="showChildren">+</i>');
                                var childrenBox = $('<'+ opts.groupTag +'>').attr('id', opts.groupIdPrefix + pId);
                                if( opts.showButtonInsert == 'after' ){
                                    parent.append(toggleButton);
                                } else if( opts.showButtonInsert == 'inbody' ){
                                    parent.children(opts.itemBodyTag).prepend(toggleButton);
                                } else {
                                    parent.prepend(toggleButton);
                                }
                                parent.addClass('hasChild').append(childrenBox);

                                toggleButton.on('click', function(){
                                    $(this).toggleClass('isOn');
                                    childrenBox.toggleClass('on');
                                    if($(this).is('.isOn')) $(this).text('-');
                                    else $(this).text('+');
                                });
                            } else {
                                parent.addClass('hasChildren');
                            }
                            $(this).appendTo( parent.children(opts.groupTag) );
                        }
                    });
                    $(this).children(opts.itemTag).each(function(){
                        setLevel( $(this), 0 );
                    });
                    if( onFinished )
                        onFinished( $(this) );
                });
            function setLevel( item, i ){
                var subItem = item.children(opts.groupTag);
                if( subItem.length ){
                    subItem.addClass('deepth_' + (++i));
                    subItem.children(opts.itemTag).each(function(){
                        setLevel($(this), i);
                    });                 
                }
            }
        },
        refreshSubOptions: function(setting) {
            if(! $(this).length) return;
            $(this).each(function(){
            	var select = $(this);
            	var opts = $.extend({
            		defaultOptText: _e('select_placeholder'),
            		url: 			$(this).data('remote'), 
            		subSelectId: 	$(this).data('submenu'),  
                    optionsHtml:    null,
            		onFinished: 	null, 
            		autoInit: 		false,
            		errorMsg: 		_e('ajax_error_msg'),
            		valueName: 		'id',
            		labelName: 		'name'
            	}, setting);
				
            	if( opts.autoInit )
            		getThenInitBy( opts, select );
            	else
            		select.children(':selected').data('subOptions', $('#' + opts.subSelectId).html());
        		$(this).on('change', function(){
                    getThenInitBy( opts, select );
                });
            });
            function getThenInitBy( opts, select ){
                if( ! opts.url ) return;
                var subSelect = opts.subSelectId ? $('#' + opts.subSelectId) : select.next('select');
                if( !subSelect.length ) return;

                var html = opts.defaultOptText ? '<option value="">'+ opts.defaultOptText +'</option>' : '';               
                var selectVal = select.val(); 
                var url = typeof opts.url == 'function' ? opts.url( select, selectVal ) : (opts.url + '/' + selectVal);
                var selectedOpt = select.children(':selected');

                if( selectVal == '' || selectVal == -1 ){
                    subSelect.html(html).show().trigger('change');
                    return;
                }
                if( selectedOpt.data('subOptions') != undefined ){
                    subSelect.html(selectedOpt.data('subOptions'));
                    if(opts.onFinished) opts.onFinished(select, subSelect);
                    return;
                }

                $.ajaxBind({
                    url: url,
                    type: "GET",
                    success: function (result) {
                        if (!result) return;
                        
                        if( opts.optionsHtml ){
                            html += opts.optionsHtml( result );
                        } else {
                            for (var i = 0; i < result.length; i++) {
                                html += '<option value="'+ result[i][opts.valueName] +'">'+ result[i][opts.labelName] +'</option>';
                            }    
                        }
                        
                        subSelect.html(html).show().trigger('change');
                        selectedOpt.data('subOptions', html);
                        if(opts.onFinished) opts.onFinished(select, subSelect);
                    },
                    error: function (error) {
                        alert(opts.errorMsg);
                    }
                });
            }
        },
        oneOrAnother: function(){
            if( ! $(this).length ) return;
            $(this).each(function(){
                $(this).children('li').each(function(){
                    var $this = $(this);
                    var handler = $this.find(':radio').eq(0);
                    handler.on('change', function(){
                        if($(this).attr('checked')){
                            $this.find(':input').removeAttr('disabled').eq('1').focus();
                            $this.siblings('li').each(function(){
                                $(this).find(':input').attr('disabled', 'disabled').eq(0).removeAttr('disabled'); 
                            });
                        }
                    });
                });
            });
        }
    });
})(jQuery);

// for validate rules
function getValidateRulesByForm(form, customRules){  
    // maxlength, required
    var rules = {};
    var inputs = form.find(':input');
    inputs.each(function(){
        var input = $(this), key = input.attr('name');
        if( input.attr('name') && 'reset-button-submit-checkbox-radio'.indexOf(input.attr('type')) == -1){
            var maxLen = input.attr('maxlength'),
                required = input.attr('required'),
                otherRules = input.data('rules');
            if( maxLen || required || otherRules ){
                rules[key] = {};
                if( maxLen ) rules[key]['maxlength'] = maxLen;
                if( required ) rules[key]['required'] = true;
                if( otherRules ) {
                    theOtherRules = otherRules.split(',');
                    for (var i = theOtherRules.length - 1; i >= 0; i--) {
                        var rule = theOtherRules[i].split(':');
                        var attrs = $.trim( rule[1] );
                        rules[key][$.trim( rule[0] )] = attrs.indexOf('--') > 0 ? attrs.split('--') : attrs;
                    };
                }
            }
        }
        if( customRules && typeof customRules[key] != 'undefined'){
            rules[key] = $.extend( customRules[key], rules[key] );
        }
    });

    return rules;
}
function createData( form, splitStr ){
    if( !$(this).length ) return;
    var data = {}, mulitBlockTemp = $('<div></div>');

    if( form.find('.mulit_block').length ){
        form.find('.mulit_block').each(function(i){
            $.extend(data, serializeByChildren($(this)));
            $(this).after('<div id="mulitTemp_'+ i +'"></div>').appendTo(mulitBlockTemp);
        });
    }

    $.extend(data, serializeAsObj(form, splitStr));
    mulitBlockTemp.children().each(function(i){
        $('#mulitTemp_' + i).replaceWith($(this));
    });
    return data;
}

function serializeAsObj(form, splitStr){
    var data = {}, arrayNames = [];
    form.find(':input').each(function(){
        var name = $(this).attr('name') || this.id, 
            type = $(this).attr('type');

        if( $(this).data('ignore') || 'reset-button-submit-file'.indexOf(type) > -1 || ($(this).is(':disabled') && ! $(this).is('.data_include')) ) 
            return true;

        if( name ){
            var value = $(this).val();

            if( type == 'checkbox' ){
                var singleCheck = $(this).is('.single_check');
                if( !singleCheck && typeof data[name] == 'undefined' ) {
                    data[name] = [];
                    arrayNames.push(name);
                }

                if( $(this).is(':checked') ){
                    if( singleCheck ) data[name] = value;
                    else data[name].push(value);
                }
            } else if ( type == 'radio' ) {  // radio
            	if( $(this).is(':checked') )
            		data[name] = value;
            } else {
            	var mulitInput = $(this).is('.mulit_input');
                if( mulitInput ) {
                	if(typeof data[name] == 'undefined'){
                		data[name] = [];
                        arrayNames.push(name);	
                	}
                    data[name].push(value);
                } else 
                	data[name] = value;
            }
        }
    });
    if( splitStr ){
        for (var i = arrayNames.length - 1; i >= 0; i--) {
            data[arrayNames[i]] = data[arrayNames[i]].join(',');
        };
    }
    return data;
}

function serializeByChildren(block){
    var data = {}, name = block.data('name');
    data[name] = [];
    block.children().each(function(){
        data[name].push( serializeAsObj($(this)) );
    });
    return data;
}

function creatData(form, splitStr, ignoreIgnoreSet, includeDisabled){
    var data = {};
    form.find('input').each(function(){
        var name = $(this).attr('name');
        var type = $(this).attr('type');
        if( ( ! ignoreIgnoreSet && $(this).data('ignore')) || 'reset-button-submit-file'.indexOf(type) > -1 || ( ! includeDisabled && $(this).is(':disabled'))) 
        	return true;
        if( name ){
            var value = $(this).val();
            if( ! $(this).val() || ((type == 'radio') && !$(this).is(':checked') ) ){
                return true;
            }
            if( type == 'checkbox' && !splitStr ){
            	if( typeof data[name] == 'undefined' ){
                    if( $(this).is(':checked') )
                        data[name] = value;
                } else if( $(this).is(':checked') ) {
                    data[name] = typeof data[name] == 'string' ? [data[name]] : data[name]; 
                    data[name].push(value);
                }
            } else if ( typeof data[name] == 'undefined' ){
            	data[name] = value;
            } else {
                if( splitStr ) {
                    data[name] += (splitStr + value);
                } else {
                    if( typeof data[name] != 'object' ){
                        data[name] = [data[name]];
                    }
                    data[name].push(value);
                }
            }
        }
    });
    form.find('select').each(function(){
        if(! ignoreIgnoreSet && $(this).data('ignore') || ( ! includeDisabled && $(this).is(':disabled'))) return true;
        var name = $(this).attr('name');
        if( name ){
            data[name] = $(this).val();
        }
    });
    form.find('textarea').each(function(){
        if(! ignoreIgnoreSet && $(this).data('ignore') || ( ! includeDisabled && $(this).is(':disabled'))) return true;
        var name = $(this).attr('name');
        if( name ){
            data[name] = $(this).val();
        }
    });
    return data;
}

function _e(translateName){
    try{
        return hsLang[translateName];
    } catch(e) {
		return translateName;
    }
}

function isNull(str) {
    return (null == str || "NULL" == str || "" == str || '' == str || " " == str || null === str);
}

Array.prototype.arrayToObject = function(keyName){
    if( !this.length || ! this[0][keyName] ) retrun;
    var obj = {};
    for( var i = 0; i < this.length; i++ ){
        obj[this[i][keyName]] = this[i];
    }
    return obj;
}

function getImageBySize(imagePath, toSize, fromSize){
    fromSize = fromSize || 'full';
    return imagePath ? imagePath.replace('_'+ fromSize +'.', '_'+ toSize +'.') : '#';
}

function replaceNullVal(str) {
    if(str != 0 && isNull(str)) {
        return "";
    }
    return str;
}

function validateIdConvert(attrs){
    var optInName = {};
    for(var id in attrs){
        var element = document.getElementById(id);
        var name = element != null ? element.name : name;
        optInName[name] = attrs[id];
    }
    return optInName;
}

function defalutErrorPlacement(error, element) {
    if (element.is(":radio"))
        error.appendTo(element.parent().next().next());
    else
        error.wrap('<span class="msgValid"></span>').parent().insertAfter(element);
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
}

function mulitpleItemsInit(itemTemp, itemsBox, item, addedFunc, manualAdd){            
    if( ! item ){
        item = {};
        var fields = itemTemp.data('fields').split(' ');
        for (var i = fields.length - 1; i >= 0; i--) {
            item[fields[i]] = '';
        };
    } else if ( typeof item == 'object' && item.length ) {
    	for (var i = 0; i < item.length; i++) {
            mulitpleItemsInit(itemTemp, itemsBox, item[i], addedFunc);
		}
		return;
    }

    var index = itemsBox.find('.add').length ? parseInt(itemsBox.data('index')) : 0;
    var itemElemment = $(itemTemp.extendObj( $.extend({i: index}, item) ));

    itemElemment.appendTo( itemsBox );
    itemsBox.data('index', (index+1));
    if( addedFunc ){ addedFunc(itemElemment, index, manualAdd); }

    var operation = itemElemment.children('.operation');

    operation.children('a').on('click', function(){
        if( $(this).is('.add') ){
            mulitpleItemsInit( itemTemp, itemsBox, null, addedFunc, true );
        } else if( $(this).is('.remove') ){
            if( confirm( _e('confirm_delete') ) )
                itemElemment.remove();
        }
    });
}

function pageNavHtml(pageNavBox, pageData){
    var temp = $.format(_e('page_nav_line'), '{totalRecords}', '{pageSizeSelect}', '{pageLinks}');
    var html = '';
    var remoteUrl = pageNavBox.data('remote');
    var pageSize = '<select id="pageSize" name="pageSize">\
                <option value="2">2</option>\
                <option value="5">5</option>\
                <option value="10" selected="selected">10</option>\
                <option value="15">15</option>\
                <option value="20">20</option>\
                <option value="30">30</option>\
                <option value="50">50</option>\
            </select>';
    var pageLinks = '<p>'+ pageLinksInit(pageData, remoteUrl) +'</p>';
    html = temp.split('{totalRecords}').join(pageData.totalRecords).split('{pageSizeSelect}').join(pageSize).split('{pageLinks}').join(pageLinks);
    return html;
}
function pageLinksInit(pageData, remotePathBasic){
    var html = '';
    var pageFrom = pageData.current - pageData.step > 0 ? pageData.current - pageData.step : 1;
    var pageTo = pageData.current + pageData.step <= pageData.total ? pageData.current + pageData.step : pageData.total;
    if( pageFrom != 1 ){
        html += '<a href="'+ remotePathBasic + 1 + '/' + pageData.pageStep +'">1</a>';
        html += (pageFrom == 2) ? '' : '<span>...</span>';
    }
    for( var i = pageFrom; i <= pageTo; i++ ){
        var pageurl = remotePathBasic + i + '/' + pageData.pageStep;
        html += i == pageData.current ? '<strong data-page="'+ i +'">' + i + '</strong>' : '<a href="'+ pageurl +'">'+ i +'</a>';
    }
    if( pageTo != pageData.total ){
        html += (pageTo + 1 == pageData.total) ? '' : '<span>...</span>';
        html += '<a href="'+ remotePathBasic + pageData.total + '/' + pageData.pageStep +'">'+ pageData.total +'</a>';
    }
    return html;
}
function listRefresh(data, temp, target, listName, backFunc){
    var list = listName ? data[listName] : data;
    if (list.length == 0) {
        var msg = _e('no_result');
        if( target.is('tbody') ){
            target.html('<tr class="emptyNote"><td colspan="100">'+ msg +'</td></tr>');
        } else {
            target.html('<div class="emptyNote">'+ msg +'</div>');
        }
        if( target.data('pagenav') ){
            var pageNav = $('#' + target.data('pagenav'));
            pageNav.hide();
        }
    } else {
        var listHtml = temp.extendObj(list);
        target.html(listHtml);
        if( target.data('pagenav') ){
            var pageNav = $('#' + target.data('pagenav'));
            var remotePathBasic = pageNav.data('remote');
            var pageData = {
                    current:    data.pageNo,
                    total:      data.totalPages,
                    totalRecords: data.totalRecords,
                    step:       3,
                    pageStep:   data.pageSize
                };
            // pageNav.find('#totalRecords').text(data.totalRecords);
            var oldRecords = pageNav.data('total');
            if( oldRecords && parseInt(oldRecords) == pageData.totalRecords ){
                pageNav.show().children('p').html(pageLinksInit(pageData, remotePathBasic));
            } else {
                pageNav.data('total', pageData.totalRecords).html(pageNavHtml(pageNav, pageData)).show();
                //  pageNav.find('select').HSselect();
                pageNav.find('select').ajaxBind({
                    type:   'GET',
                    url:    function(elem){
                        var pageSize = elem.val();
                        var pageNo = 1;
                        return remotePathBasic + pageNo + "/" + pageSize;
                    }
                }, {
                    type:   'change',
                    successMsg: false,
                    onSuccess:  function(data){
                        listRefresh(data, temp, target, listName, backFunc); 
                    }
                });
            }
            pageNav.children('p').children('a').ajaxBind({}, {
                successMsg: false,
                onSuccess:  function(data){
                    listRefresh(data, temp, target, listName, backFunc);
                }
            });
        }
    }
    if(backFunc) backFunc(target);
}
function pageHeightInit(){
    var page = $('#wrap'),
        heightCol = $('#main');
    if( page.length ){
        var headerH = page.prev('header').length ? page.prev('header').innerHeight() : 0;
        var footerH = page.next('footer').length ? page.next('footer').innerHeight() : 0;
        var contentH = headerH + footerH + page.innerHeight();

        function setMinHeight(){
            var windowH = $(window).height();
            if( contentH < windowH ){
                mainHeight = windowH - headerH - footerH;
                heightCol.css({ minHeight: mainHeight});
            }
        }

        setMinHeight();
        $(window).resize(setMinHeight);
    }
}

function msgBoxShow(message, type, msgBox, timeout){
    msgBox = msgBox ? msgBox : HS.msgBox;

    timeout = timeout || ( type == 'success' ? 3 : 0);
    var newClass = type;
    if( newClass )
        msgBox.attr('class', newClass);
    if( message )
        msgBox.html(message);

    msgBox.parent().show();

    if( HS.msgBoxAutoHide ) clearTimeout(HS.msgBoxAutoHide);

    if( timeout ){
        HS.msgBoxAutoHide = setTimeout(function(){
            msgBox.parent().fadeOut(800, function(){
                msgBox.removeClass(type);
            });
        }, timeout * 1000); 
    } else if ( ! msgBox.is('.unclose') ) {
        msgBox.append('<a href="#" class="esc">x</a>')
            .find('.esc').on('click', function(){
                msgBox.removeClass(type).parent().fadeOut(300);
                return false;
            });
    }
}

function get_gravatar(email, size) { 
    // MD5 (Message-Digest Algorithm) by WebToolkit
    function MD5(a){function b(a,b){return a<<b|a>>>32-b}function c(a,b){var c,d,e,f,g;return e=2147483648&a,f=2147483648&b,c=1073741824&a,d=1073741824&b,g=(1073741823&a)+(1073741823&b),c&d?2147483648^g^e^f:c|d?1073741824&g?3221225472^g^e^f:1073741824^g^e^f:g^e^f}function d(a,b,c){return a&b|~a&c}function e(a,b,c){return a&c|b&~c}function f(a,b,c){return a^b^c}function g(a,b,c){return b^(a|~c)}function h(a,e,f,g,h,i,j){return a=c(a,c(c(d(e,f,g),h),j)),c(b(a,i),e)}function i(a,d,f,g,h,i,j){return a=c(a,c(c(e(d,f,g),h),j)),c(b(a,i),d)}function j(a,d,e,g,h,i,j){return a=c(a,c(c(f(d,e,g),h),j)),c(b(a,i),d)}function k(a,d,e,f,h,i,j){return a=c(a,c(c(g(d,e,f),h),j)),c(b(a,i),d)}function l(a){for(var b,c=a.length,d=c+8,e=(d-d%64)/64,f=16*(e+1),g=Array(f-1),h=0,i=0;c>i;)b=(i-i%4)/4,h=8*(i%4),g[b]=g[b]|a.charCodeAt(i)<<h,i++;return b=(i-i%4)/4,h=8*(i%4),g[b]=g[b]|128<<h,g[f-2]=c<<3,g[f-1]=c>>>29,g}function m(a){var d,e,b="",c="";for(e=0;3>=e;e++)d=255&a>>>8*e,c="0"+d.toString(16),b+=c.substr(c.length-2,2);return b}function n(a){a=a.replace(/\r\n/g,"\n");for(var b="",c=0;a.length>c;c++){var d=a.charCodeAt(c);128>d?b+=String.fromCharCode(d):d>127&&2048>d?(b+=String.fromCharCode(192|d>>6),b+=String.fromCharCode(128|63&d)):(b+=String.fromCharCode(224|d>>12),b+=String.fromCharCode(128|63&d>>6),b+=String.fromCharCode(128|63&d))}return b}var p,q,r,s,t,u,v,w,x,o=[],y=7,z=12,A=17,B=22,C=5,D=9,E=14,F=20,G=4,H=11,I=16,J=23,K=6,L=10,M=15,N=21;for(a=n(a),o=l(a),u=1732584193,v=4023233417,w=2562383102,x=271733878,p=0;o.length>p;p+=16)q=u,r=v,s=w,t=x,u=h(u,v,w,x,o[p+0],y,3614090360),x=h(x,u,v,w,o[p+1],z,3905402710),w=h(w,x,u,v,o[p+2],A,606105819),v=h(v,w,x,u,o[p+3],B,3250441966),u=h(u,v,w,x,o[p+4],y,4118548399),x=h(x,u,v,w,o[p+5],z,1200080426),w=h(w,x,u,v,o[p+6],A,2821735955),v=h(v,w,x,u,o[p+7],B,4249261313),u=h(u,v,w,x,o[p+8],y,1770035416),x=h(x,u,v,w,o[p+9],z,2336552879),w=h(w,x,u,v,o[p+10],A,4294925233),v=h(v,w,x,u,o[p+11],B,2304563134),u=h(u,v,w,x,o[p+12],y,1804603682),x=h(x,u,v,w,o[p+13],z,4254626195),w=h(w,x,u,v,o[p+14],A,2792965006),v=h(v,w,x,u,o[p+15],B,1236535329),u=i(u,v,w,x,o[p+1],C,4129170786),x=i(x,u,v,w,o[p+6],D,3225465664),w=i(w,x,u,v,o[p+11],E,643717713),v=i(v,w,x,u,o[p+0],F,3921069994),u=i(u,v,w,x,o[p+5],C,3593408605),x=i(x,u,v,w,o[p+10],D,38016083),w=i(w,x,u,v,o[p+15],E,3634488961),v=i(v,w,x,u,o[p+4],F,3889429448),u=i(u,v,w,x,o[p+9],C,568446438),x=i(x,u,v,w,o[p+14],D,3275163606),w=i(w,x,u,v,o[p+3],E,4107603335),v=i(v,w,x,u,o[p+8],F,1163531501),u=i(u,v,w,x,o[p+13],C,2850285829),x=i(x,u,v,w,o[p+2],D,4243563512),w=i(w,x,u,v,o[p+7],E,1735328473),v=i(v,w,x,u,o[p+12],F,2368359562),u=j(u,v,w,x,o[p+5],G,4294588738),x=j(x,u,v,w,o[p+8],H,2272392833),w=j(w,x,u,v,o[p+11],I,1839030562),v=j(v,w,x,u,o[p+14],J,4259657740),u=j(u,v,w,x,o[p+1],G,2763975236),x=j(x,u,v,w,o[p+4],H,1272893353),w=j(w,x,u,v,o[p+7],I,4139469664),v=j(v,w,x,u,o[p+10],J,3200236656),u=j(u,v,w,x,o[p+13],G,681279174),x=j(x,u,v,w,o[p+0],H,3936430074),w=j(w,x,u,v,o[p+3],I,3572445317),v=j(v,w,x,u,o[p+6],J,76029189),u=j(u,v,w,x,o[p+9],G,3654602809),x=j(x,u,v,w,o[p+12],H,3873151461),w=j(w,x,u,v,o[p+15],I,530742520),v=j(v,w,x,u,o[p+2],J,3299628645),u=k(u,v,w,x,o[p+0],K,4096336452),x=k(x,u,v,w,o[p+7],L,1126891415),w=k(w,x,u,v,o[p+14],M,2878612391),v=k(v,w,x,u,o[p+5],N,4237533241),u=k(u,v,w,x,o[p+12],K,1700485571),x=k(x,u,v,w,o[p+3],L,2399980690),w=k(w,x,u,v,o[p+10],M,4293915773),v=k(v,w,x,u,o[p+1],N,2240044497),u=k(u,v,w,x,o[p+8],K,1873313359),x=k(x,u,v,w,o[p+15],L,4264355552),w=k(w,x,u,v,o[p+6],M,2734768916),v=k(v,w,x,u,o[p+13],N,1309151649),u=k(u,v,w,x,o[p+4],K,4149444226),x=k(x,u,v,w,o[p+11],L,3174756917),w=k(w,x,u,v,o[p+2],M,718787259),v=k(v,w,x,u,o[p+9],N,3951481745),u=c(u,q),v=c(v,r),w=c(w,s),x=c(x,t);var O=m(u)+m(v)+m(w)+m(x);return O.toLowerCase()};
    var size = size || 80; 
    return 'http://www.gravatar.com/avatar/' + MD5(email.trim().toLowerCase()) + '.jpg?s=' + size;
}

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

function urlSearchObj(url){
    var obj = {};
    var search = url.split('?').pop();
    if (search != '') {
        var searchs = search.split('&');
        for (var i = 0; i < searchs.length; i++) {
            var parameter = searchs[i].split("=");
            if (parameter.length > 0 && parameter[0]) {
                var name = unescape(parameter[0]);
                var value = "";
                if (parameter.length > 1 && parameter[1]) {
                    value = unescape(parameter[1]);
                }
                obj[name] = value;
            }
        }
    }
    return obj;
}

function getObjByVal(value, opt, theArray){
    var a = -1;
    for (var i = 0; i < theArray.length; i++) {
        if( opt ? theArray[i][opt] == value : theArray[i] == value ){
            a = i;
            break;
        }
    };
    return a != -1 ? theArray[a] : undefined;
}