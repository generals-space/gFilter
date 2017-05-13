// http, https这些schema规则必须与://分开写
// 这些规则应该是严格匹配, 所以需要最后有通配符*的存在
var url_rules = [
    "*://hm.baidu.com/*",
    "*://cpro.baidu.com/*",
    "*://*.baidustatic.com/*",
    "*://bdimg.share.baidu.com/*",
    "*://zhannei.baidu.com/*",
    "*://znsv.baidu.com/*",
    "*://api.share.baidu.com/*",
    "*://push.zhanzhang.baidu.com/*",
    "*://nsclick.baidu.com/*",
    "*://pos.baidu.com/*",
    "*://wn.pos.baidu.com/*",
    "*://rplog.baidu.com/*",
    "*://crs.baidu.com/*",
    "*://ecma.bdimg.com/*",
    
    "*://fonts.googleapis.com/*",
    "*://www.google-analytics.com/*",
    "*://static.doubleclick.net/*",
    "*://www.googletagservices.com/*",
    "*://pagead2.googlesyndication.com/*",
    "*://tpc.googlesyndication.com/*",

    // 私有广告
    "*://changyan.sohu.com/*",
    "*://www.wangchao.net.cn/baitai/*",
    "*://image.wangchao.net.cn/middle/baitai/*",
    "*://image.wangchao.net.cn/*/article_*/*",
    "*://ads.csdn.net/*",
    //广告平台
    "*://recs.goingnative.cn/*",
    "*://*.dsxdn.com/*",

    //分享平台
    "*://id.jiathis.com/*",
    "*://td.xue163.com/ajs/newjs/*",
    
    //统计平台
    "*://*.cnzz.com/*",
]
ruleListHandler = new RuleList();
var block_rules = ruleListHandler.export();
// 监听发送请求
chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
        console.dir(details);
        //返回的是一个对象
        return {cancel: true};
    },{
        //urls中的元素格式有限制, 一旦有一个出错, 拦截插件整个就失效了
        //可以在manifest.json中的permissions字段中检查一下, 更新插件时如果有错误会提示
        urls: block_rules,
        types: ["main_frame", "sub_frame", "stylesheet", "script", "image", "object", "xmlhttprequest"]
        //types: ["script", "sub_frame"]
    },
    ["blocking"]
);