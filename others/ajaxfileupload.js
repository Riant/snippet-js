(function($){
	$.fn.ajaxFile = function(setting){
		$(this).each(function(){
			var opts = $.extend({
				url: 	$(this).data('remote'),
				data: 	null,
				timeout:0,
				secureuri: 	false,
				dataType:	'text',
				global: 	false,
				before: 	false,
				success: 	false,
				error: 		null,
				complete: 	null
			}, setting);
			
			$(this).on('change', function(){
				var fileElement = $(this);
				var newElement = fileElement.clone(true);
				var id = new Date().getTime();
				if( opts.before ) opts.before(fileElement);
				ajaxFileUpload(opts, fileElement, newElement, id);
			});
		});
		
		
		function createUploadIframe(id, uri){
			var frameId = 'jUploadFrame' + id;
			uri = uri || 'http://www.baidu.com';
			var iframeHtml = '<iframe id="' + frameId + '" name="' + frameId + '" style="display:none;"';
			if (window.ActiveXObject) {
				if (typeof uri == 'boolean') {
					iframeHtml += ' src="' + 'javascript:false' + '"';
				} else if (typeof uri == 'string') {
					iframeHtml += ' src="' + uri + '"';
				}
			}
			iframeHtml += ' />';
			$(iframeHtml).appendTo(document.body);
			return $('#' + frameId).get(0);
		}
		   
		function createUploadForm(id, data, fileElement, newElement) {
			var formId = 'jUploadForm' + id;
			var fileId = 'jUploadFile' + id;
			var form = $('<form action="" method="POST" name="' + formId + '" id="' + formId + '" enctype="multipart/form-data" style="display:none;"></form>');
	
			if (data) {
				for (var i in data) {
					$('<input type="hidden" name="' + i + '" value="' + data[i] + '" />').appendTo(form);
				}
			}        
			fileElement.attr('id', fileId).before(newElement).appendTo(form);
			$(form).appendTo('body');
			return form;
		}

		function ajaxFileUpload(s, fileElement, newElement, id) {
			var form = createUploadForm(id, s.data, fileElement, newElement),
				io = createUploadIframe(id, s.secureuri),
				frameId = 'jUploadFrame' + id,
				formId = 'jUploadForm' + id,
				requestDone = false,
				xml = {};
			function  uploadCallback (isTimeout) {
				var io = document.getElementById(frameId);
				if (io.contentWindow) {
					xml.responseText = io.contentWindow.document.body ? io.contentWindow.document.body.innerHTML : null;
					xml.responseXML = io.contentWindow.document.XMLDocument ? io.contentWindow.document.XMLDocument : io.contentWindow.document;

				} else if (io.contentDocument) {
					xml.responseText = io.contentDocument.document.body ? io.contentDocument.document.body.innerHTML : null;
					xml.responseXML = io.contentDocument.document.XMLDocument ? io.contentDocument.document.XMLDocument : io.contentDocument.document;
				}
				if (xml || isTimeout == "timeout") {
					requestDone = true;
					var status = isTimeout != "timeout" ? "success" : "error";
					if (status != "error") {
						var data = uploadHttpData(xml, s.dataType);
						if (s.success) s.success(data, status, newElement);
						if (s.global) jQuery.event.trigger("ajaxSuccess", [xml, s]);
					} else { //s, xml, status
						if( s.error ) 
							s.error( xml.responseText, newElement );
						else 
							alert(xml.responseText);
					}
									
					if (s.global) jQuery.event.trigger("ajaxComplete", [xml, s]); // The request was completed
					if (s.global && !--jQuery.active) jQuery.event.trigger("ajaxStop"); // Handle the global AJAX counter
					if (s.complete) s.complete(xml, status); // Process result

					$(io).unbind();

					setTimeout(function () {
						$(io).remove(); $(form).remove();
					}, 100);
					
					xml = null;
				}
			}
			// Timeout checker
			if (s.timeout > 0) {
				setTimeout(function () {
					if (!requestDone) uploadCallback("timeout");
				}, s.timeout);
			}
			
			var form = $('#' + formId);
			$(form).attr({action: s.url, method: 'POST', target: frameId});
			if (form.encoding) {
				$(form).attr('encoding', 'multipart/form-data');
			} else {
				$(form).attr('enctype', 'multipart/form-data');
			}
			$(form).submit();

			$('#' + frameId).load(uploadCallback);
			return {abort:function () {}};
		}

		function uploadHttpData(r, type) {
			var data = !type;
			data = type == "xml" || data ? r.responseXML : r.responseText;
			if (type == "script") jQuery.globalEval(data);
			if (type == "json") {
				try {
					eval("data = " + data);
				} catch ( e ){
					data = data;
				}
			}
			if (type == "html") $("<div>").html(data).evalScripts();
			return data;
		}
	};
})(jQuery);

