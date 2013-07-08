function urlSearchObj(url){
    var obj = {};
    var search = url.split('?').pop();
    if (search != '') {
        var searchs = search.split('&');
        for (var i = 0; i < searchs.length; i++) {
            var parameter = searchs[i].split("=");
            if (parameter.length > 0 && parameter[0]) {
                var name = unescape(parameter[0]);
                var value = "";
                if (parameter.length > 1 && parameter[1]) {
                    value = unescape(parameter[1]);
                }
                obj[name] = value;
            }
        }
    }
    return obj;
}