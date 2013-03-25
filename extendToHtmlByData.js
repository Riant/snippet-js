$.extend({
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
	extendObj: function(datas){
        var html = '';
        if( $(this).length ){
            html = $.extendObj(datas, $(this).html());
        }
        return html;
    }
});