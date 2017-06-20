# Chrome扩展-获得当前标签对象

参考文章

1. [chrome 插件如何获取当前页面的URL title 等信息？](https://www.zhihu.com/question/19908126)

2. [Chrome Tab Extensions: getCurrent vs. getSelected?](https://stackoverflow.com/questions/4619219/chrome-tab-extensions-getcurrent-vs-getselected)

3. []

## 1. getCurrent

[chrome.tabs.getCurrent](https://developer.chrome.com/extensions/tabs#method-getCurrent)的官方文档没看懂, 按照参考文章2中所讲述的, 才明白它只能在option.html中使用, 无法在background与popup域中使用.

```js
// 在options域的使用方法
chrome.tabs.getCurrent(function(tab){
    console.log(tab);
});
```

## 2. getSelected与query

`chrome.tabs.getSelected()`到是可以在popup中使用. 它的使用方法为

```js
chrome.tabs.getSelected(null, function(tab) { 
    var myTabUrl = tab.url; 
    console.log(tab);
});
```

但它已经被废弃了(但是最新版的chrome58.0.3029.110还可以用...), 取代它的是`chrome.tabs.query()`. 根据[query](https://developer.chrome.com/extensions/tabs#method-query)的官方文档, 其语法如下


```js
chrome.tabs.query(object queryInfo, function callback)
```

`queryInfo`是一个对象, query()方法可以看是专门用来获取窗口内标签页的方法, 而`queryInfo`则是过滤条件, 可以根据url, title, 以及活动状态取得, 所以这个方法传递给callback回调的是一个列表类型对象. 

也正因为queryInfo的存在, query()方法可以通过设置queryInfo不同选项代替`getSelected`, `getLastFocused`等方法.

使用方法如下

```js
// 在popup中使用, 得到点击popup图标时所在标签页对象
chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
    console.log(tabs);
});
```