$.fn.extend({
    serializeToObj: function( setting ){
        if( !$(this).length ) return;
        var opts = $.extend({
            splitStr: null,
            ignoreIgnoreSet: false,
            includeDisabled: false
        }, setting);
        var data = {};
        $(this).find('input,select,textarea').each(function(){
            var name = $(this).attr('name') || this.id, type = $(this).attr('type');
            if( ( ! opts.ignoreIgnoreSet && $(this).data('ignore')) || 'reset-button-submit-file'.indexOf(type) > -1 || ( ! includeDisabled && $(this).is(':disabled'))) return true;
            if( name ){
                var value = $(this).val();
                if( type == 'radio' && $(this).is(':checked') )
                    return true;
                if( type == 'checkbox' && data[name] == 'undefined' )
                    data[name] = opts.splitStr ? '' : [];
                else if ( typeof data[name] == 'undefined' ) 
                    data[name] = value;
                else {
                    opts.splitStr ? (data[name] += (opts.splitStr + value)) : data[name].push(value);
                }
            }
        });
        
        return data;
    }
});