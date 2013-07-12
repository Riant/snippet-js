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
        }