/*
    获取剪切板内容

    在chrome扩展中使用这getFromClipboard()方法时, 需要在manifest.json文件中的permissions字段声明'clipboardRead'的权限.
*/

/*
    @function: 将指定文本拷贝到剪切板
    @textStr: 目标字符串
*/
function addToClipboard(textStr){
    var buf = document.querySelector('#G_CopyBuf');
    if (!buf) {
        buf = document.createElement('textarea');
        buf.id = 'G_CopyBuf';
        buf.style.position = 'absolute';
        buf.style.left = '-9999px';
        buf.style.top = '-9999px';
        document.body.appendChild(buf);
    }
    buf.value = textStr;
    buf.focus();
    buf.select();
    document.execCommand('Copy', false, null);
    document.body.removeChild(buf);
}

/*
    @function: 读取并返回系统剪切板的内容(只有字符串)
    @return: 返回从系统剪切板读取的字符串.
*/
function getFromClipboard(){
    var buf = document.querySelector('#G_PasteBuf');
    if (!buf) {
        buf = document.createElement('textarea');
        buf.id = 'G_PasteBuf';
        buf.style.position = 'absolute';
        buf.style.left = '-9999px';
        buf.style.top = '-9999px';
        document.body.appendChild(buf);
    }
    buf.focus();
    document.execCommand('Paste');
    var textStr = buf.value;
    document.body.removeChild(buf);
    return textStr;
}