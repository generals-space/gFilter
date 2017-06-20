# Chrome扩展-关于徽章

```js
chrome.browserAction.setBadgeBackgroundColor({color: '#0000FF'});
chrome.browserAction.setBadgeText({text: 'Dog'});
```

对徽章的操作无法在content域中调用, 只能在background与popup域中. 但是在popup中使用需要点击触发, 所以一般的使用方法一定是在background中使用, 切换标签页时使用content域通知background进行更改.