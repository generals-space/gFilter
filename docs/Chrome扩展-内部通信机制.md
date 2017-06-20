# Chrome扩展-内部通信机制

参考文章

1. [官方文档](#)

    - [chrome.runtime.sendMessage](https://developer.chrome.com/extensions/runtime#method-sendMessage)

    - [chrome.tabs.sendMessage](https://developer.chrome.com/extensions/tabs#method-sendMessage)

    - [chrome.runtime.onMessage](https://developer.chrome.com/extensions/runtime#event-onMessage)

2. [关于chrome插件编写的小结](http://www.cnblogs.com/meteoric_cry/p/3574457.html)

chrome扩展分为background, popup, content这3个域.

除了popup无法与content直接通信, 而是需要使用background中转外, popup与background, content与background域都是可以进行通信的.

background -> content: chrome.tabs.sendMessage()

content -> background: chrome.runtime.sendMessage()

这2种通信方式都可以通过`chrome.runtime.onMessage.addListener()`方法在接收端进行消息处理.

同样是通过`runtime.sendMessage()`传递信息到background, 但从popup与从content传来的sender对象不一样, popup包含的信息比较少.

至于popup与background的通信, 可以在popup中使用`chrome.extension.getBackgroundPage()`方法得到background域对象, 然后通过这个对象访问background的方法和变量.