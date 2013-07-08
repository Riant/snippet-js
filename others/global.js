var HS = {
    msgBoxAutoHide: true,
    msgBoxScrollTop: 72
};

;(function ($) {
    $(function () {
        HS.msgBox = $('#msgBox');
        if( $.trim(HS.msgBox.html()) != '' ){
            msgBoxShow();
        }
        $('#quickNav').find('a').each(function(){
            if($(this).is('.showInBox')){
                $(this).lightbox({
                    cache: true,
                    afterShow: function(stage, $this, box){
                        if( ! stage.find('#orderSearchForm').length ) {
                            var url = $this.attr('href').split(' ');
                            $.ajax({
                                url: url[0],
                                type: 'GET',
                                success: function( data ){
                                    var html = $(data).find('#content').html();
                                    stage.html(html);
                                    orderSearchFormBind(stage);
                                }
                            }); 
                        }                      
                    }
                });
            }
        });

        // Page Naviagtion
        $('#syncPageNav').find("select").change(function(){
            var val = $(this).val();
            var url = $('#syncPageNav').attr("data-remote");
                url = url+"/1/"+val;
            window.location = url;
        });
        // Page Naviagtion

        $('#content').find('form').find('.dateinput').dateInput();//{outputFormat:'[month] [dth], [yy]'}
        $('#dataList').find('.remove_item').removeItemBind();

        $('#content').find('.tabNav').tab();
        $('#content').find('.oneOrAnother').oneOrAnother();

        $('#menu').find('li').each(function(){
            if( ! $(this).hasClass('current') ){
                $(this).hover(function(){
                    if( $(this).has('ul').length )
                        $(this).addClass('on');
                }, function(){
                    if( $(this).has('ul').length )
                        $(this).removeClass('on');
                });
            }
        });

        if ($.validator) {	// validator global setting
            $.validator.setDefaults({
                focusInvalid:	false,
                focusCleanup:	true,
                onkeyup:	false,
                errorPlacement:	defalutErrorPlacement
            });

            $.extend($.validator.messages, {
                required: _e('valid_msg_required'),
                remote: _e('valid_msg_remote'),
                email: _e('valid_msg_email'),
                url: _e('valid_msg_url'),
                date: _e('valid_msg_date'),
                dateISO: _e('valid_msg_dateISO'),
                number: _e('valid_msg_number'),
                digits: _e('valid_msg_digits'),
                creditcard: _e('valid_msg_creditcard'),
                equalTo: _e('valid_msg_equalTo'),
                maxlength: $.validator.format( _e('valid_msg_maxlength') ),
                minlength: $.validator.format( _e('valid_msg_minlength') ),
                rangelength: $.validator.format( _e('valid_msg_rangelength') ),
                range: $.validator.format( _e('valid_msg_range') ),
                max: $.validator.format( _e('valid_msg_max') ),
                min: $.validator.format( _e('valid_msg_min') )
            });

            $.validator.addMethod("allSameKeyInOne", function (value, element) {
                var key = $(element).attr('name');
                var eles = $(element).parents('form').find('*[name="'+ key +'"]');
                var mark = true;
                eles.each(function(){
                    if($(this).val() == '' ){
                        mark = false;
                        return false;
                    }
                });
                return mark;
            }, _e('valid_msg_required'));

            $.validator.addMethod("indiaDate", function (value, element) {
                var dates = value.split('/').reverse();
                return this.optional(element) || (dates.length == 3 && !/Invalid|NaN/.test(new Date(dates.join('/'))));
            }, _e('valid_msg_dateIndia'));

            $.validator.addMethod("eqlength", function (value, element, params) {
                return this.optional(element) || $.trim(value).length == Number(params);
            }, _e('valid_msg_eqlength'));

            $.validator.addMethod("dateCompare", function (value, element, params) {
                var theDate = params[1] == 'today' ? Date.parse( new Date() ) : Date.parse($('#' + params[1]).val().split('/').reverse().join('/'));
                var thisDate = Date.parse(value.split('/').reverse().join('/'));

                return this.optional(element) || params[0] == 'earlier' ? thisDate <= theDate : thisDate >= theDate;
            }, '<i></i>{2}');

            $.validator.addMethod("requiredWhenShow", function (value, element, params) {
                return $(element).is(':visible') ? $.trim($(element).val()) != '' : true;
            }, _e('valid_msg_required'));

            $.validator.addMethod("time", function (value, element) {
                var hhmm = $.trim(value).split(':');
                var hh = hhmm[0], mm = hhmm[1];
                var hhValid = ( hh.length == 2 && !isNaN(Number(hh)) && Number(hh) >= 0 && Number(hh) < 24 );
                var mmValid = ( mm.length == 2 && !isNaN(Number(mm)) && Number(mm) >= 0 && Number(mm) < 60 );
                return this.optional(element) || ( hhValid && mmValid );
            }, _e('valid_msg_time'));

            $.validator.addMethod("extension", function(value, element, param) {
                param = typeof param === "string" ? param.replace(/,/g, '|') : "png|jpe?g|gif";
                return this.optional(element) || value.match(new RegExp(".(" + param + ")$", "i"));
            }, $.format("<i></i>Please enter a valid format file ({0})."));
        }

        // auto bind hsValidate: class="hsValidate ajaxform" data-direct="http://..." || data-ajaxsuccess="xxx" => function xxx(){...}
        $('#content').find('form.hsValidate').each(function(){
            var submitHandlerFn = $(this).data('submithandler');
            var submitHandler = submitHandlerFn ? eval(submitHandlerFn) : null;
            var ajaxsuccess;
            if( ! submitHandler ) {
                if( $(this).is('.ajaxform') ){
                    var direct =     $(this).data('direct'),
                        ajaxsuccess =   $(this).data('ajaxsuccess');

                    if( direct ){
                        ajaxsuccess = function(){
                            location.href = direct;
                        }
                    } else if( ajaxsuccess ){
                        ajaxsuccess = eval( ajaxsuccess );
                    }
                    submitHandler = function( form ){
                        $(form).ajaxBind({},{ type: 'auto', onSuccess: ajaxsuccess});
                    }
                }    
            }
            
            $(this).hsValidate({
                submitHandler: submitHandler 
            });
        });

        $(document).scroll(function(){
            var box = HS.msgBox.parent();
            if($(this).scrollTop() >= HS.msgBoxScrollTop) {
                box.addClass('globalMsg');
            } else {
                box.removeClass('globalMsg');
            }
        });
    });
})(jQuery);