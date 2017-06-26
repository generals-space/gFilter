# Chrome扩展-移除监听事件

参考文章

1. [Chrome extension How to remove a Listener on chrome.webRequest.onBeforeRequest](https://stackoverflow.com/questions/40888038/chrome-extension-how-to-remove-a-listener-on-chrome-webrequest-onbeforerequest)

2. [How to remove an anonymous function bound by addEventListener with an event object as argument](https://stackoverflow.com/questions/40668396/how-to-remove-an-anonymous-function-bound-by-addeventlistener-with-an-event-obje)

3. [chrome.events](https://developer.chrome.com/extensions/events)

这个需求还是因为gFilter无法在保存修改后的屏蔽列表后无法即时生效时提出的.

gFilter的background域在扩展启动时全局生效, 当时就绑定了一个`webRequest.onBeforeRequest`的事件监听, filter规则在不触及这个监听事件的时候是不会修改的. 所以无论怎么保存刷新blockRules变量, 都不会影响已经绑定了的监听事件.

解决方法是, 在blockRules变量发生变化时, 移除已经绑定的事件, 重新绑定.

这用到了`Event.removeListener(function callback)`方法. 见参考文章3. `removeListener()`方法没有出现在`webRequest`文档页中, 最初没有发现, 之后找到了参考文章1, 知道了这个方法的存在. 再次查阅时发现它是`Event`的对象, 即所有的事件都继承了这个方法. 于是问题得以解决.