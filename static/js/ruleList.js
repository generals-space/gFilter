// ruleTable中的列表操作类
function RuleList(){
    self = this;
    self.ruleTable = $('#ruleTable');
    self._ruleList = [];

    // 监听器: 删除表格当前行所表示的规则
    self.ruleTable.on('click', '.btnDelRule', function(){
        $(this).parents('.ruleInRow').remove();
    });
    // 监听器: 拷贝表格当前行所表示的规则(有效字符串类型)
    self.ruleTable.on('click', '.btnCpRule', function(){
        var currRow = $(this).parents('.ruleInRow');
        var currRuleObj = self.getCurrRule(currRow);
        currRule = self.convertToStr(currRuleObj);
        addToClipboard(currRule);
        $(this).tooltip('show');
    });
    self.ruleTable.on('hidden.bs.tooltip', '.btnCpRule', function(){
        /* 
            这里控制台会报错, 但是没办法, 如果不加这个事件, 
            tooltip通过点击'复制'按钮触发一次后, 下次只要鼠标悬停就会再次触发.
            这不是我想要的效果. 使用popover插件也一样.
            但总归我的目标达到了, 只是不知道是否有隐患.
        */
        $(this).tooltip('destroy');
    });
    /*
        @function: 将从html的规则列表取出来的字典对象, 
            转换成有效的字符串类型变量(主要是指把select标签中的value转换成字符串)
        @return: 目标规则的字符串对象
    */
    self.convertToStr = function(ruleObj){
        var ruleStr = '';
        if(ruleObj['schema'] == 0){
            ruleStr += '*://';
        }else if(ruleObj['schema'] == 1){
            ruleStr += 'http://';
        }else if(ruleObj['schema'] == 2 ){
            ruleStr += 'https://';
        }else{
            console.error('Invalid schema: ' + ruleObj['schema']);
            ruleStr = '';
        }
        
        if(ruleObj['url'] != '')
            ruleStr += ruleObj['url'];
        else
            ruleStr = null;
            
        if(ruleObj['uri'] != '')
            ruleStr += ruleObj['uri'];
        else
            ruleStr += '/*';

        if(ruleObj['status'] == 0)
            ruleStr = '';
        return ruleStr;
    }
    /*
        @function: 从localStorage中取出ruleList字符串, 
            并将其赋值给self._ruleList成员对象.
    */
    self.load = function(){
        ruleList = localStorage.ruleList;
        if(ruleList) {
            ruleList = JSON.parse(ruleList)
        }else{
            ruleList = '';
        }
        self._ruleList = ruleList;
    };
    // 将self._ruleList的内容渲染到DOM文档中.
    self.render = function(){
        var renderData = {
            ruleList: self._ruleList
        };
        var plainHtml = template('tpl-ruleInRow', renderData);
        self.ruleTable.find('tbody').html(plainHtml);
    };

    /*
        @function:
            从DOM文档中得到规则列表对象并返回
    */
    self.parse = function(){
        var ruleInRows   = self.ruleTable.find('.ruleInRow');
        tmpRuleList = [];
        ruleInRows.each(function(){
            var ruleItem = {
                'schema'    : $(this).find('.ruleSchema').val(),
                'url'       : $(this).find('.ruleUrl').val(),
                'uri'       : $(this).find('.ruleUri').val(),
                'status'    : $(this).find('.ruleStatus').val()
            }
            // 不保存空行.
            if(ruleItem.url != '')
                tmpRuleList.push(ruleItem);
        });
        return tmpRuleList;
    };

    self.getCurrRule = function(currRow){
        var currRule = {
            'schema'    : currRow.find('.ruleSchema').val(),
            'url'       : currRow.find('.ruleUrl').val(),
            'uri'       : currRow.find('.ruleUri').val(),
            'status'    : currRow.find('.ruleStatus').val()
        }
        // 不保存空行.
        if(currRule.url != '')
            return currRule;
        else
            console.error('The schema field can not be empty! ');
            return null;
    }

    /*
        @function: 
            将DOM文档中的规则列表新增一行. 
            做法是, 构造一个空行数据, 使用artTemplate渲染并追加到表格tbody后.
            所以将空行渲染到DOM中是可行的, 但是空行不应该被保存.
    */
    self.add = function(){
        self.ruleTable.find('tbody').append(plainHtml);
        var renderData = {
            ruleList: ''
        };
        var plainHtml = template('tpl-ruleInRow', renderData);
        self.ruleTable.find('tbody').append(plainHtml);
    };

    /*
        @function: 
            删除DOM文档中所有规则.
            然后再次调用渲染函数, 为DOM文档的列表中添加一个空的输入框.
    */
    self.clear = function(){
        self._ruleList = '';
        self.render();
    };

    /*
        @function: 
            将当前DOM文档中显示的规则列表, 
            以字符串形式存储在localStroage中, 并赋值给self._ruleList成员变量
            只能通过DOM文档中的'保存'功能被调用.
    */
    self.save = function(){
        tmpRuleList = JSON.stringify(self.parse());
        localStorage.ruleList = tmpRuleList;
        self._ruleList = tmpRuleList;
    };

    /*
        function: 将self._ruleList格式化成chrome可识别的数组模式.
    */
    self.export = function(){
        tmpRuleList = [];
        for(var index in self._ruleList){
            var ruleItem = self._ruleList[index];
            var ruleStr = self.convertToStr(ruleItem);
            
            tmpRuleList.push(ruleStr);
        }

        return tmpRuleList;
    }

    /*
        function: 
            导入字符串形式的规则列表, 赋值给self._ruleList
        @ruleStrList示例: 
            *://cpro.baidu.com/*
            *://hm.baidu.com/*
            *://*.cnzz.com/*
    */
    self.import = function(ruleStrList){
        var urlPatten = new RegExp('(.)+://([^\]+)(/.*)', 'i');
        var tmpRuleList = [];
        for(var index in ruleStrList){
            var tmpRuleItem = {};
            var ruleRegObj = urlPatten.exec(ruleStrList[index]);
            tmpRuleItem = {
                'schema': ruleRegObj[1],
                'url': ruleRegObj[2],
                'uri': ruleRegObj[3],
                'status': 1,
            };
            tmpRuleList.push(tmpRuleItem);
            console.log(tmpRuleItem);
        }
        self._ruleList = tmpRuleList;
    }

    // 这种构造方式需要前向声明...
    // 但是成员方法间的相互调用不需要...
    self.load();
}
