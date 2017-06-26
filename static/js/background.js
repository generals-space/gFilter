var blocked = {};
var blockRules = [];
applyRules();
function applyRules(){
    var ruleList = new RuleList();
    blockRules = ruleList.export();
    // 如果一条规则为空, chrome会阻挡所有的连接, 我们需要将其改写为一个无法生效的规则
    if(!blockRules || blockRules == '') 
        blockRules = ['http://j/k/i'];
    var reqOpts = {
        //urls中的元素格式有限制, 一旦有一个出错, 拦截插件整个就失效了
        //可以在manifest.json中的permissions字段中检查一下, 更新插件时如果有错误会提示
        urls: blockRules,
        types: ["main_frame", "sub_frame", "stylesheet", "script", "image", "object", "xmlhttprequest"]
    };
    // 监听发送请求
    chrome.webRequest.onBeforeRequest.removeListener(reqProc);
    chrome.webRequest.onBeforeRequest.addListener(reqProc, reqOpts, ["blocking"]);
}

/*
    监听来自content_scripts消息, 被动
*/
chrome.runtime.onMessage.addListener(requestHandler);

/*
    request: 请求传入的数据, 可以是任何类型
    sender: 是一个对象, 包含传入消息的插件id, 当前标签页tab对象, 当前tab页的url等信息.
        但是要注意, 从popup与从content传来的sender对象不一样, popup包含的信息比较少.
    sendReponse: ...也是回调函数, 跟content_scripts中的sendMessage()一样, 直接发送消息对象
*/
function requestHandler(request, sender, sendResponse){
    if(request.type == 'getBlocked'){
        console.dir(blocked);
        sendResponse({
            result: {
                type: 'getBlocked',
                blocked: blocked[request.tabId],
                all: blocked
            }
        });
    }else{
        sendResponse({
            result: {
                msg: 'Invalid request type',
                request: request,
                sender: sender
            }
        });
    }
}
function getBlockedList(tabId){
    return blocked[tabId];
}

function reqProc(request){
    if (!blocked[request.tabId]){
        blocked[request.tabId] = new Set();
    }
    blocked[request.tabId].add(request.url);
    //注意这里返回的是一个对象
    return {cancel: true};
}


chrome.tabs.onActivated.addListener(onTabActivated);
chrome.tabs.onUpdated.addListener(onTabUpdated);

/*
    activeInfo: 是一个对象, 包含当前激活的标签页的tabId与windowId
*/
function onTabActivated(activeInfo){
    chrome.tabs.get(activeInfo.tabId, function(tab){
        updateBadge(tab);
    });
}

function onTabUpdated(tabId, changeInfo, tab){
    if(changeInfo.status != "loading") return;
    updateBadge(tab);
}

function updateBadge(tab){
    chrome.browserAction.setBadgeBackgroundColor({color: '#000'});
    var interval = setInterval(function(){
        if(blocked[tab.id]){
            var blockedLen = blocked[tab.id].size;
            chrome.browserAction.setBadgeText({
                tabId: tab.id,
                text: blockedLen.toString()
            });
        }else{
            chrome.browserAction.setBadgeText({text: ''});
        }
        chrome.tabs.get(tab.id, function(tab){
            if(tab.status == 'complete') clearInterval(interval);
        });
    }, 200);
}