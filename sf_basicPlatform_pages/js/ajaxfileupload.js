// JavaScript Document
jQuery.extend({
	
	createUploadIframe : function (id, uri) {
		//create frame
		var frameId = 'jUploadFrame' + id;
		var io;
		/*
		if ( window.ActiveXObject ) {
			try{
				// old ie
				io = document.createElement('<iframe id="' + frameId + '" name="' + frameId + '" /></iframe>');
			} catch(e) {
				// ie9
				io  = document.createElement('iframe');
				io.id   = frameId;
				io.name = frameId;
			}
			
		} else {
			io  = document.createElement('iframe');
			io.id   = frameId;
			io.name = frameId;
		}
		 */
		var str = !+'\v1' ? '<iframe name="'+ frameId + '" id="'+ frameId +'"></iframe>' : 'iframe';
		io = document.createElement(str);

		io.name = io.id = frameId;

		if (typeof uri == 'boolean') {
			io.src = 'javascript:false';
		} else if (typeof uri == 'string') {
			io.src = uri;
		}

		io.style.position = 'absolute';
		io.style.top      = '-1000px';
		io.style.left     = '-1000px';
		
		document.body.appendChild(io);
		
		return io;
	},
	createUploadForm : function (id, fileElementId) {
		//create form
		var formId = 'jUploadForm' + id;
		var fileId = 'jUploadFile' + id;
		var form = jQuery('<form  action="" method="POST" name="' + formId + '" id="' + formId + '" enctype="multipart/form-data"></form>');
		var oldElement = jQuery('#' + fileElementId);
		var newElement = $(oldElement).clone();
		$(oldElement)
			.attr ( 'id', fileId )
			.before(newElement)
			.appendTo(form);
		//set attributes
		$(form)
			.css({
				'position': 'absolute',
				'top'     : '-1200px',
				'left'    : '-1200px'
			})
			.appendTo('body');
		return form;
	},
	
	ajaxFileUpload : function (s) {
		// TODO introduce global settings, allowing the client to modify them for all requests, not only timeout
		s = jQuery.extend({}, jQuery.ajaxSettings, s);
		var id = s.fileElementId;
		var form = jQuery.createUploadForm(id, s.fileElementId);
		var io = jQuery.createUploadIframe(id, s.secureuri);
		var frameId = 'jUploadFrame' + id;
		var formId = 'jUploadForm' + id;
		if (s.global && !jQuery.active++) {
			// Watch for a new set of requests
			jQuery.event.trigger("ajaxStart");
		}
		var requestDone = false;
		// Create the request object
		var xml = {};
		if (s.global) {
			jQuery.event.trigger("ajaxSend", [xml, s]);
		}
		var uploadCallback = function (isTimeout) {
			// Wait for a response to come back
			var io = document.getElementById(frameId);
			try {
				if (io.contentWindow) {
					xml.responseText = io.contentWindow.document.body ? io.contentWindow.document.body.innerHTML : null;
					xml.responseXML = io.contentWindow.document.XMLDocument ? io.contentWindow.document.XMLDocument : io.contentWindow.document;
					
				} else if (io.contentDocument) {
					xml.responseText = io.contentDocument.document.body ? io.contentDocument.document.body.innerHTML : null;
					xml.responseXML = io.contentDocument.document.XMLDocument ? io.contentDocument.document.XMLDocument : io.contentDocument.document;
				}
			} catch (e) {
				"function" === typeof s.error && s.error (s, xml, null, e);
			}
			if (xml || isTimeout == "timeout") {
				requestDone = true;
				var status;
				try {
					status = isTimeout != "timeout" ? "success" : "error";
					// Make sure that the request was successful or notmodified
					if (status != "error") {
						// process the data (runs the xml through httpData regardless of callback)
						var data = jQuery.uploadHttpData(xml, s.dataType);
						if (s.success) {
							// ifa local callback was specified, fire it and pass it the data
							s.success(data, status);
						};
						if (s.global) {
							// Fire the global callback
							jQuery.event.trigger("ajaxSuccess", [xml, s]);
						};
					} else {
						"function" === typeof s.error && s.error(s, xml, status);
					}
				} catch (e) {
					status = "error";
					"function" === typeof s.error && s.error(s, xml, status, e);
				};
				if (s.global) {
					// The request was completed
					jQuery.event.trigger("ajaxComplete", [xml, s]);
				};
				// Handle the global AJAX counter
				if (s.global && !--jQuery.active) {
					jQuery.event.trigger("ajaxStop");
				};
				if (s.complete) {
					s.complete(xml, status);
				};
				jQuery(io).unbind();
				setTimeout(function () {
					try {
						jQuery(io).remove();
						jQuery(form).remove();
					} catch (e) {
						"function" === typeof s.error && s.error(s, xml, null, e);
					}
				}, 100);
				xml = null;
			};
		}
		// Timeout checker
		if (s.timeout > 0) {
			setTimeout(function () {
				if (!requestDone) {
					// Check to see ifthe request is still happening
					uploadCallback("timeout");
				}
			}, s.timeout);
		}
		try {
			var form = jQuery('#' + formId);
			jQuery(form).attr('action', s.url);
			jQuery(form).attr('method', 'POST');
			jQuery(form).attr('target', frameId);
			if (form.encoding) {
				form.encoding = 'multipart/form-data';
			} else {
				form.enctype = 'multipart/form-data';
			}
			jQuery(form).submit();
		} catch (e) {
			"function" === typeof s.error && s.error (s, xml, null, e);
		}
		if (window.attachEvent) {
			document.getElementById(frameId).attachEvent('onload', uploadCallback);
		} else {
			document.getElementById(frameId).addEventListener('load', uploadCallback, false);
		}
		return {
			abort : function () {}
		};
	},
	
	uploadHttpData : function (r, type) {
		var data = !type;
		data = type == "xml" || data ? r.responseXML : r.responseText;
		// ifthe type is "script", eval it in global context
		if (type == "script") {
			jQuery.globalEval(data);
		}
		
		// Get the JavaScript object, ifJSON is used.
		if (type == "json") {
			eval("data = " + data);
		}
		
		// evaluate scripts within html
		if (type == "html") {
			jQuery("<div>").html(data).evalScripts();
		}
		
		return data;
	}
});
