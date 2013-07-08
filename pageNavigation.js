
function pageNavHtml(pageNavBox, pageData){
    var temp = $.format(_e('page_nav_line'), '{totalRecords}', '{pageSizeSelect}', '{pageLinks}');
    var html = '';
    var remoteUrl = pageNavBox.data('remote');
    var pageSize = '<select id="pageSize" name="pageSize">\
                <option value="2">2</option>\
                <option value="5">5</option>\
                <option value="10" selected="selected">10</option>\
                <option value="15">15</option>\
                <option value="20">20</option>\
                <option value="30">30</option>\
                <option value="50">50</option>\
            </select>';
    var pageLinks = '<p>'+ pageLinksInit(pageData, remoteUrl) +'</p>';
    html = temp.split('{totalRecords}').join(pageData.totalRecords).split('{pageSizeSelect}').join(pageSize).split('{pageLinks}').join(pageLinks);
    return html;
}
function pageLinksInit(pageData, remotePathBasic){
    var html = '';
    var pageFrom = pageData.current - pageData.step > 0 ? pageData.current - pageData.step : 1;
    var pageTo = pageData.current + pageData.step <= pageData.total ? pageData.current + pageData.step : pageData.total;
    if( pageFrom != 1 ){
        html += '<a href="'+ remotePathBasic + 1 + '/' + pageData.pageStep +'">1</a>';
        html += (pageFrom == 2) ? '' : '<span>...</span>';
    }
    for( var i = pageFrom; i <= pageTo; i++ ){
        var pageurl = remotePathBasic + i + '/' + pageData.pageStep;
        html += i == pageData.current ? '<strong data-page="'+ i +'">' + i + '</strong>' : '<a href="'+ pageurl +'">'+ i +'</a>';
    }
    if( pageTo != pageData.total ){
        html += (pageTo + 1 == pageData.total) ? '' : '<span>...</span>';
        html += '<a href="'+ remotePathBasic + pageData.total + '/' + pageData.pageStep +'">'+ pageData.total +'</a>';
    }
    return html;
}

function listRefresh(data, temp, target, listName, backFunc){
    var list = listName ? data[listName] : data;
    if (list.length == 0) {
        var msg = _e('no_result');
        if( target.is('tbody') ){
            target.html('<tr class="emptyNote"><td colspan="100">'+ msg +'</td></tr>');
        } else {
            target.html('<div class="emptyNote">'+ msg +'</div>');
        }
        if( target.data('pagenav') ){
            var pageNav = $('#' + target.data('pagenav'));
            pageNav.hide();
        }
    } else {
        var listHtml = temp.extendObj(list);
        target.html(listHtml);
        if( target.data('pagenav') ){
            var pageNav = $('#' + target.data('pagenav'));
            var remotePathBasic = pageNav.data('remote');
            var pageData = {
                    current:    data.pageNo,
                    total:      data.totalPages,
                    totalRecords: data.totalRecords,
                    step:       3,
                    pageStep:   data.pageSize
                };
            // pageNav.find('#totalRecords').text(data.totalRecords);
            var oldRecords = pageNav.data('total');
            if( oldRecords && parseInt(oldRecords) == pageData.totalRecords ){
                pageNav.show().children('p').html(pageLinksInit(pageData, remotePathBasic));
            } else {
                pageNav.data('total', pageData.totalRecords).html(pageNavHtml(pageNav, pageData)).show();
                //  pageNav.find('select').HSselect();
                pageNav.find('select').ajaxBind({
                    type:   'GET',
                    url:    function(elem){
                        var pageSize = elem.val();
                        var pageNo = 1;
                        return remotePathBasic + pageNo + "/" + pageSize;
                    }
                }, {
                    type:   'change',
                    successMsg: false,
                    onSuccess:  function(data){
                        listRefresh(data, temp, target, listName, backFunc); 
                    }
                });
            }
            pageNav.children('p').children('a').ajaxBind({}, {
                successMsg: false,
                onSuccess:  function(data){
                    listRefresh(data, temp, target, listName, backFunc);
                }
            });
        }
    }
    if(backFunc) backFunc(target);
}