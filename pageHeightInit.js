function pageHeightInit(){
    var page = $('#wrap'),
        heightCol = $('#main');
    if( page.length ){
        var headerH = page.prev('header').length ? page.prev('header').innerHeight() : 0;
        var footerH = page.next('footer').length ? page.next('footer').innerHeight() : 0;
        var contentH = headerH + footerH + page.innerHeight();

        function setMinHeight(){
            var windowH = $(window).height();
            if( contentH < windowH ){
                mainHeight = windowH - headerH - footerH;
                heightCol.css({ minHeight: mainHeight});
            }
        }

        setMinHeight();
        $(window).resize(setMinHeight);
    }
}