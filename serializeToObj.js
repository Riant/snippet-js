$.fn.extend({
    serializeToObj: function( setting ){
        if( !$(this).length ) return;
        var opts = $.extend({
            splitStr: null,
            ignoreIgnoreSet: false,
            includeDisabled: false
        }, setting);
        var data = {};
        $(this).find(':input').each(function(){
            var name = $(this).attr('name') || this.id, 
                type = $(this).attr('type');

            if( ( ! opts.ignoreIgnoreSet && $(this).data('ignore')) || 'reset-button-submit-file'.indexOf(type) > -1 || ( ! opts.includeDisabled && $(this).is(':disabled'))) 
                    return true;

            if( name ){
                var value = $(this).val();

                if( data[name] == undefined ){
                    if( ! opts.splitStr && type == 'checkbox' ){
                        data[name] = $(this).is(':checked') ? [value] : [];
                    } else {
                        data[name] = value;
                    }
                } else {
                    if( opts.splitStr ){
                        data[name] += (opts.splitStr + value);
                    } else {
                        if( typeof data[name] != 'object' )
                            data[name] = [data[name]];
                        else
                            data[name].push(value);
                    }
                }
            }
        });
        
        return data;
    }
});