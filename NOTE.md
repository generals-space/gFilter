chrome版本: 53.0.2785.143

## 1. mainfest.json

参考链接

[Manifest Version](https://developer.chrome.com/extensions/manifestVersion)

`mainfest_version`: **必选**. `manifest.json`文件中需要指定这个键, 应该是用以标识使用哪一种结构解析此扩展.

`version`: **必选**. `当前扩展版本号`


> 在Manifest中指定`background`域可以使扩展常驻后台. `background`可以包含三种属性, 分别是`scripts`、`page`和`persistent`. 如果指定了`scripts`属性, 则Chrome会在扩展启动时自动创建一个包含所有指定脚本的页面; 如果指定了`page`属性, 则Chrome会将指定的HTML文件作为后台页面运行. 通常我们只需要使用`scripts`属性即可, 除非在后台页面中需要构建特殊的HTML——但一般情况下后台页面的HTML我们是看不到的. `persistent`属性定义了常驻后台的方式——当其值为`true`时, 表示扩展将一直在后台运行, 无论其是否正在工作; 当其值为`false`时, 表示扩展在后台按需运行, 这就是Chrome后来提出的`Event Page`. `Event Page`可以有效减小扩展对内存的消耗, 如非必要, 请将`persistent`设置为`false`. `persistent`的默认值为`true`. 

```json
    "background": {
        "scripts": [
            "background.js"
        ]
    },
```

但是`background`域与`options.html`没办法直接通信, 其实`background`相当于另一个html文件. 为options.html编写的js中的变量和函数自然没办法直接从background获取到. 但是它们都同属于当前插件所在的域, 所以`localStorage`是互通的. 借鉴`Switch Omega`中的`manifest.json`, 通过一个html引用所有需要的js文件就好了...

```json
    "background": {
        "page": "background.html"
    },
```

`chrome://extensions/`控制台中, 重新加载一次目标扩展, 相当于运行一次background域代表的操作.

`art-template.js`应该是需要将模板文件加载入当前dom才可以进行渲染的, 所以无法通过src从模板文件内引入, 也是没办法的事.

