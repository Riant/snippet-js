;(function($){
	$.extend({
		logOut: function(){
			tools.ajax({
			 	url: 'logout.action',
			 	successCallback: function(data){
			 		tools.session.destroy();
			 	}
			});
		},
		afterLogin: function(data, _self){
			if(data.resultCode == "01010000"){
 			tools.session.set("area",data.userInfoBean.area);
 			tools.session.set("dept",data.userInfoBean.dept);
 			tools.session.set("userLoginName",data.userInfoBean.loginName);
 			tools.session.set("userName",data.userInfoBean.user_name);
 			$.locationHash('index');
 			$('#wrap').load(_self.templateRequests.index);
 		} else {
 			tools.pop.info({
 				html : resultCode['code_'+data.resultCode]
 			});
 		}
		}
	});

	$.fn.extend({
		ajaxBind: function(setting, opts){
			setting = setting || {};
			opts = opts || {};

			$(this).each(function(){
				var form = $(this);
				var isForm = form.is('form');					

				var ajaxOpts = {
					async: false,
					url: setting.url || isForm ? form.attr('action') : form.attr('href'),
					type: setting.type || isForm ? form.attr('method').toUpperCase() : 'GET',
					dataType: setting.dataType || 'json'
				}

				if( ! setting.data && isForm )
					ajaxOpts.data = form.formParams();

				if( opts.onSuccess )
					ajaxOpts.success = opts.onSuccess;
				if( opts.onError )
					ajaxOpts.error = opts.onError;

				if( opts.type && opts.type === 'auto' ){
					$.ajax($.extend({}, ajaxOpts, setting));
				} else {
					form.on(( opts.type || (isForm ? 'submit' : 'click') ), function(){
						$.ajax($.extend({}, ajaxOpts, setting));
						return false;
					});
				}

			});
		}
	});

	$(function(){
		// login 

	});
})(jQuery);