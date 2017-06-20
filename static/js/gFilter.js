;$(document).ready(function(){
    ruleList = new RuleList();
    ruleList.render();
    addListener();
});


function addListener(){
    // 还是有点不明白为什么不能在click里直接写回调函数, 明明ruleList已经实例化了...
    // console.dir(ruleList);
    // console.log(ruleList.save);
    // $('.btnSaveRules').click(ruleList.save);
    $('.btnSaveRules').click(function(){
        ruleList.save();
    });
    // $('.btnClearRules').click(ruleList.clear);
    $('.btnClearRules').click(function() {
        ruleList.clear();
    });
    $('.btnAddRules').click(function() {
        ruleList.add();
    });

    // 导入导出模态框行为绑定
    $('#exportModal').on('show.bs.modal', function(e){
        var ruleListText = ruleList.export().join('<br/>');
        $('#exportModal').find('.modal-body').html(ruleListText);
    });
    // 导入模态框关闭回调, 清空文本框内容
    $('#importModal').on('hide.bs.modal', function(e){
        $('#importModal').find('.ruleInText').val('');
    });
    // 导入确认操作
    $('.btnImportConfirm').click(function(){
        var ruleStrList = $('#importModal').find('.ruleInText').val().split('\n');
        ruleList.import(ruleStrList);
        // 用导入的规则重新渲染列表
        ruleList.render();
    });
}
