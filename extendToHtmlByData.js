;(function($){
    $(function(){
        $.extend({
            tmpl: function(datas, temp, prefix){
                var reg = {
                        clean: /(\s*)?(\n|\r)(\s*)?/g,
                        js:    (/\{@test\s+([^@]+)\s+@\}/),
                        inlay:   (/\{@getTemplate\s*=\s*"([^"]*)"\}/),
                        each: (/\{@foreach\s+items="([^"]+)"\s*\}(.*)(?=\{\/)\{\/@foreach\}/),
                        if:      (/\{@if\s*=\s*"([^"]+)"\s*\}(.*)(?=\{\/)\{\/@if\}/),
                        else:    (/(.*)\{@else\}(.*)/)
                    },
                    html = '';

                temp = $.trim(temp.replace(reg.clean,' '));
                prefix = prefix || '';

                if( temp.length ){
                    if( typeof datas == 'string' && datas.length ){
                        html += replaceAll(temp, '{'+ prefix +'value}', datas);
                    } else if( typeof datas == 'object' && datas.length ){  // if it is an array
                        if( typeof datas[0] == 'string' ){
                            for(var i = 0; i < datas.length; i++){
                                html += replaceAll(temp, '{'+ prefix +'value}', datas[i]);
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

                function replaceAll(item, from, to){
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
                                item = replaceAll(item, '{' + p + '.' + objAttr + '}', theval[objAttr]);                    
                            }
                        } else if ( theval == null || typeof theval != 'object' ) {
                            item = replaceAll(item, '{'+ prefix + p +'}', theval);
                        }
                    }

                    while( reg.if.test(item) ){
                        var test = reg.if.exec(item);
                        var check = (function($index, $data){ return eval(test[1]); })(itemIndex, data);
                        var testResult = '';
                        
                        if( reg.else.test(test[2]) ){
                            var elseTest = reg.else.exec(test[2]);
                            testResult = check ? elseTest[1] : elseTest[2];
                        } else {
                            testResult = check ? test[2] : '';
                        }
                        
                        item = replaceAll(item, test[0], testResult);
                    }
                    
                    while( reg.inlay.test(item) ){
                        var test = reg.inlay.exec(item);
                        item = replaceAll(item, test[0], $('#' + test[1]).extendObj(data));
                    }                
                    while(reg.each.test(item)){
                        var test = reg.each.exec(item);
                        var items = data[test[1]], itemTemp = test[2],
                            itemsHtml = '';
                        if( typeof items == 'object' && items.length ){
                            itemsHtml += $.extendObj(items, itemTemp, '.');
                        }
                        item = replaceAll(item, test[0], itemsHtml);
                    }

                    while( reg.js.test(item) ){
                        var test = reg.js.exec(item);
                        item = replaceAll(item, test[0], (function($index, $data){ return eval(test[1]); })(itemIndex, data));
                    }

                    return item;
                }
            }
        });
        $.fn.extend({
            tmpl: function(datas){
                var html = '';
                if( $(this).length ){
                    html = $.tmpl(datas, $(this).html());
                }
                return html;
            }
        });
    });
})(jQuery);