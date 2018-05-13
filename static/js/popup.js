;(function(){
    // popup与background域通信的方法, 可以通过这个对象直接调用其中的方法与变量
    var bgField = chrome.extension.getBackgroundPage();
    // 获取当前标签页对象
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        tab = tabs[0];
        var opts = {
            tabId: tab.id,
            type: 'getBlocked'
        }

        var interval = setInterval(function(){
            var blockedList = bgField.getBlockedList(tab.id);
            var renderData = {
                blockedListLen: 0,
                blockedList: []
            };
            if(!blockedList){
                renderData.blockedListLen = 0;
            }else{
                renderData.blockedListLen = blockedList.size;
                // 不能用for语句吗? forEach应该也是js内置语句吧
                blockedList.forEach(function(item) {
                    console.log(item);
                    renderData.blockedList.push(item);
                });
            }

            $('#blocked-sum').text(renderData.blockedListLen);

            var plainHtml = template('tpl-blockedItem', renderData);
            $('.blocked-list').html(plainHtml);

            chrome.tabs.get(tab.id, function(tab){
                if(tab.status == 'complete') clearInterval(interval);
            });
        }, 200);
    });

})();

// chrome.runtime.sendMessage(opts, responseHandlerFromBG);
// function responseHandlerFromBG(response){
//     console.log(response);
// }