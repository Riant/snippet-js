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
                    if( data[p] && typeof data[p] == 'object' && !data[p].length ) {    // data is a object
                        for(var objAttr in data[p] ){
                            item = replace(item, '{' + p + '.' + objAttr + '}', data[p][objAttr]);                    
                        }
                    } else if ( data[p] == null || typeof data[p] != 'object' ) {
                        item = replace(item, '{'+ prefix + p +'}', data[p]);
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
        hsValidate: function( setting ){
            setting = setting || {};
            $(this).each(function(){
                var opts = $.extend({}, setting);
                opts.rules = getValidateRulesByForm($(this), ( typeof opts.rules != 'undefined' ? opts.rules : null));
                $(this).validate( opts );
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
                var textshow = text || input.data('show') || '选择图片';
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
                            var imgBox = elem.parent().parent(), imagePath;
                            loading.close();
                            // imgBox.removeClass('uploading').find('.loading').remove();
                            if( typeof data == 'object' ){
                                if( ! data.status ){
                                    alert(data.errorMsg);
                                    return;
                                } else {
                                    imagePath = data.imageResponse.imagePath;
                                }
                            } else {
                                imagePath = $('<div>').html(data).text();
                            }

                            var theImg = imgBox.find('.imgPreview'), src = uploadPath + imagePath;
                            if( theImg.length ){
                                theImg.attr('src', src);
                            } else {
                                imgBox.addClass('hasImg').prepend('<img src="'+ src +'" class="imgPreview" />');
                            }
                            urlInput = urlInputId ? $('#' + urlInputId ) : imgBox.prev('input');
                            if( urlInput.length ) urlInput.val( imagePath );

                            if (onUploaded) onUploaded(input);
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
            if($(this).length){
                $(this).each(function(){
                    var $this = $(this),
                        isForm = $this.attr('action') ? true : false;
                    var funs = {
                        onBegin:    null,
                        onSuccess:  null,
                        onError:    null
                    };
                    var ajaxOpts = {
                        type:   isForm ? $this.attr('method').toUpperCase() : 'GET',
                        success: function(data){
                            if( setting.successMsg ){
                                msgBoxShow(setting.successMsg, 'success', setting.messageBox);
                            }
                            if($this.data('cache')){
                                $this.data('temp', data);
                            }
                            if(others.onSuccess) others.onSuccess(data, $this);
                            if(funs.onSuccess) funs.onSuccess();
                        },
                        error: function(backData, errorInfo){
                            if( !setting.errorMeg ){
                                try{
                                    var response = JSON.parse(backData.responseText);
                                } catch(err){
                                    var response = { message: ''};
                                }
                                var errorMsg = (response.message ? response.message : 'Sorry, something wrong, try again later please...');
                            } else {
                                var errorMsg = setting.errorMeg
                            }

                            msgBoxShow(errorMsg, 'faild', setting.messageBox);
                            if(setting.onError) setting.onError(errorMsg, $this);
                            if(funs.onError) funs.onError();
                        }
                    };

                    var setting = {
                        loading:    true,
                        stringify:  true,
                        type:       isForm ? 'submit' : 'click',
                        messageBox: null,
                        onBegin:    null,
                        onSuccess:  null,
                        errorMeg:   null
                    };

                    setting = $.extend(setting, others);

                    if( setting.loading ){
                        var loading = {};
                        ajaxOpts.beforeSend = function(){ loading = loadingBox( typeof setting.loading == 'object' ? setting.loading : $this); }
                        funs.onError = function(){ loading.close(); }
                        funs.onSuccess = function(){ loading.close();}
                    }
                    var ajaxSettingExtend = function( onBegin ){
                        ajaxOpts = $.extend(ajaxOpts, ajaxSetting);
                        if( ajaxSetting.data ){
                            ajaxOpts.data = typeof ajaxSetting.data == 'function' ? ajaxSetting.data($this) : ajaxSetting.data;
                        } else if ( isForm ){
                            ajaxOpts.data = creatData($this);
                        }

                        if( ajaxSetting.url ){
                            ajaxOpts.url = typeof(ajaxSetting.url) == 'function' ? ajaxSetting.url($this) : ajaxSetting.url;
                        } else if( isForm ){
                            ajaxOpts.url = $this.attr('action');
                        } else {
                            ajaxOpts.url = $this.attr('href');
                        }

                        return (! onBegin || onBegin( $this, ajaxOpts.data, setting.loading ? loading : null ));
                    };

                    if( setting.type == "auto" ){
                        if( ajaxSettingExtend( setting.onBegin )){
                            $.ajaxBind(ajaxOpts, setting.stringify);
                        }
                    } else {
                        $this.on(setting.type, function(){
                            if( $this.data('temp') ){
                                if( setting.onBegin ){
                                    setting.onBegin($this, null);
                                }
                                setting.onSuccess($this.data('temp'), $this);
                            } else {
                                if( ajaxSettingExtend( setting.onBegin )){
                                    $.ajaxBind(ajaxOpts, setting.stringify);
                                }
                            }
                            return false;
                        });
                    }
                });
            }
        },
        removeItemBind: function(item_prefix){
            $(this).each(function(){
                var id = $(this).data('id');
                $(this).ajaxBind({
                    type: 'DELETE',
                    data: id
                }, {
                    onBegin: function(  ){
                        return confirm('你确定要删除？');
                    },
                    onSuccess: function( data ){
                        if( data )
                            $('#' + (item_prefix ? 'item' : item_prefix) + id).remove();
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
                    onClose: null
                },setting);

                init();

                $(this).each(function(){
                    opts.title = opts.title ? ( typeof opts.title == 'function' ? opts.title($(this)) : opts.title) : $(this).attr('title');
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
                    ele.box.css({ width: opts.width + 'px'}).addClass('lightbox' + opts.type);
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
                    if( opts.afterShow ) opts.afterShow( ele.stage, $this, this );
                };
                this.close = function(){
                    if( opts.onClose ) opts.onClose( ele.stage, $this, this );
                    ele.shade.hide();
                    ele.box.hide();
                    ele.stage.html('');
                }
            }
            function init( type ){
                var boxHeaderH = 67 + 15,
                    windowH = parseInt($(window).height());
                var shade = $('#shade'),
                    lightbox = $('#lightbox');

                if( ! lightbox.length ){
                    var lightbox = $('<div id="lightbox" class="lightbox"></div>').append('<h2 class="title"></h2><a href="javascript:;" class="close btn btnLarge">X</a><div class="stage"></div>');
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
            		defaultOptText: '- 请选择 -',
            		url: 			$(this).data('remote'), 
            		subSelectId: 	$(this).data('submenu'),  
                    optionsHtml:    null,
            		onFinished: 	null, 
            		autoInit: 		false,
            		errorMsg: 		'Something Wrong, try again later.',
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
               
                var selectVal = select.val(); 
                var url = typeof opts.url == 'function' ? opts.url( select, selectVal ) : (opts.url + '/' + selectVal);

                var selectedOpt = select.children(':selected');
                if( selectedOpt.data('subOptions') != undefined ){
                    subSelect.html(selectedOpt.data('subOptions'));
                    if(opts.onFinished) opts.onFinished(select, subSelect);
                    return;
                }

                var errorInfo = "Sorry, the operation anomalies, please refresh the page try again.";

                $.ajaxBind({
                    url: url,
                    type: "GET",
                    success: function (result) {
                        if (!result) return;
                        var html = opts.defaultOptText ? '<option value="-1">'+ opts.defaultOptText +'</option>' : '';
                        if( opts.optionsHtml ){
                            html += opts.optionsHtml( result );
                        } else {
                            for (var i = 0; i < result.length; i++) {
                                html += '<option value="'+ result[i][opts.valueName] +'">'+ result[i][opts.labelName] +'</option>';
                            }    
                        }
                        
                        subSelect.html(html).show();
                        selectedOpt.data('subOptions', html);
                        if(opts.onFinished) opts.onFinished(select, subSelect);
                    },
                    error: function (error) {
                        alert(opts.errorMsg);
                    }
                });
            }
        }
    });
})(jQuery);

// for validate rules
function getValidateRulesByForm(form, customRules){  
    // maxlength, required
    var rules = {};
    var inputs = form.find('input');
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
                        rules[key][$.trim( rule[0] )] = $.trim( rule[1] );
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

function creatData(form, splitStr, ignoreIgnoreSet, includeDisabled){
    var data = {};
    form.find('input').each(function(){
        var name = $(this).attr('name');
        var type = $(this).attr('type');
        if( ( ! ignoreIgnoreSet && $(this).data('ignore')) || 'reset-button-submit-file'.indexOf(type) > -1 || ( ! includeDisabled && $(this).is(':disabled'))) return true;
        if( name ){
            var value = $(this).val();
            if( ! ($(this).val() && ((type != 'radio' && type != 'checkbox') || $(this).is(':checked') )) ){
                return true;
            }
            if ( typeof data[name] == 'undefined' ) data[name] = value;
            else {
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
    if(! block.find('.loadingBox').length){
        block.append('<div class="loadingBox"><img src="'+ staticPath +'/css/images/loading.gif" class="loading" /></div>');
        block.css({position: 'relative'});
    }
    var loadingBox = block.find('.loadingBox');
    var width = block.innerWidth();
    var height = block.innerHeight();
    loadingBox.css({ width: width, height: height, top:0, left:0, position:'absolute'}).show();
    return {
        mseeage:    function(html, className){
            var htmlBox = loadingBox.children('span');
            if( ! htmlBox.length ){
                htmlBox = $('<span></span>');
                htmlBox.appendTo(loadingBox);
            }
            
            htmlBox.attr('class', className).html(html).css({marginLeft: parseInt(htmlBox.innerWidth())/-2}).show();
        },
        close:  function(){
            loadingBox.fadeOut(200);
        }
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
            if( confirm('确定要删除吗？') )
                itemElemment.remove();
        }
    });
}

function pageNavHtml(pageNavBox, pageData){
    var temp = '<span class="totalPages">Total {totalRecords} items</span> {pageSizeSelect} {pageLinks}';
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
        var msg = '没有记录.';
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
            var pageData = {};
            pageData.current = data.pageNo;
            pageData.total = data.totalPages;
            pageData.totalRecords = data.totalRecords;
            pageData.step = 3;
            pageData.pageStep = data.pageSize;

            // pageNav.find('#totalRecords').text(data.totalRecords);
            if( pageNav.find('select').length ){
                pageNav.show().children('p').html(pageLinksInit(pageData, remotePathBasic));
            } else {
                pageNav.html(pageNavHtml(pageNav, pageData)).show();
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
                    onSuccess:  function(data){
                        listRefresh(data, temp, target, listName, backFunc); 
                    }
                });
            }
            pageNav.children('p').children('a').ajaxBind({}, {
                onSuccess:  function(data){
                    listRefresh(data, temp, target, listName, backFunc);
                }
            });
        }
        if(backFunc) backFunc(target);
    }
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
    timeout = timeout || ( type == 'success' ? 5 : 0);
    var newClass = type;
    if( msgBox.is('.globalMsg') )
        newClass += ' globalMsg';
    if( newClass )
        msgBox.attr('class', newClass);
    if( message )
        msgBox.html(message);

    msgBox.parent().slideDown(); 

    if( timeout ){
        if( HS.msgBoxAutoHide ) clearTimeout(HS.msgBoxAutoHide);
        HS.msgBoxAutoHide = setTimeout(function(){
            msgBox.parent().fadeOut(800, function(){
                msgBox.removeClass(type);
            });
        }, timeout * 1000); 
    } else if ( msgBox.is('#msgBox') ) {
        msgBox.append('<a href="#" class="esc">关闭</a>')
            .find('a.esc').on('click', function(){
                msgBox.removeClass(type).parent().fadeOut(300);
                return false;
            });
    }
}