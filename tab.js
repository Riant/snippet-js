tab:function(){
            var show_id = $(this).children('.cur').attr('rel');
            $('#' + show_id).show();
            $(this).children().click(function () {
                var cont_id = $(this).attr('rel');
                $(this).addClass('cur').siblings().removeClass('cur');
                $('#' + cont_id).show().siblings().hide();
            })
        }