$.fn.extend({
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
    }
})