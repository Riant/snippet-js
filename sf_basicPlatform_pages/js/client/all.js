$(function(){
	var url = location.href;
        url = url.replace(/^.*#/, '');
    function load(num) {
    	if($.locationHash()=='index' ){
			$('#wrap').empty().load('index.html',function(){
				$('#container').empty().load( 'firstPage.html');
			});
		}else if($.locationHash()=='login'||$.trim($.locationHash()).length==''){
			$('#wrap').empty().load('login.html');
		}else{
			$('#wrap').empty().load('index.html',function(){
				$('#container').empty().load( $.locationHash() +'.html');
			});
		}
    }
	$.history.init(function(url) {
        load(url == "" ? "login" : url);
    });
})
