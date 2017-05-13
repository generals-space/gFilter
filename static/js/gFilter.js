;$(document).ready(function(){
    ruleListHandler = new RuleList();
    ruleListHandler.render();
    addListener();
});


function addListener(){
    // 还是有点不明白为什么不能在click里直接写回调函数, 明明ruleListHandler已经实例化了...
    // console.dir(ruleListHandler);
    // console.log(ruleListHandler.save);
    // $('.btnSaveRules').click(ruleListHandler.save);
    $('.btnSaveRules').click(function(){
        ruleListHandler.save();
    });
    // $('.btnClearRules').click(ruleListHandler.clear);
    $('.btnClearRules').click(function() {
        ruleListHandler.clear();
    });
    $('.btnAddRules').click(function() {
        ruleListHandler.add();
    });

    // 导入导出模态框绑定
    $('#btnImportModal').click(function() {
        $('#importModal').modal('show');
    });
    $('#btnExportModal').click(function() {
        var ruleListText = ruleListHandler.export().join('<br/>');
        $('#exportModal').find('.modal-body').html(ruleListText);
        $('#exportModal').modal('show');
    });
    // 导入模态框关闭回调, 清空文本框内容
    $('#importModal').on('hide.bs.modal', function(e){
        $('#importModal').find('.ruleInText').val('');
    });
    // 导入确认操作
    $('.btnImportConfirm').click(function(){
        var ruleStrList = $('#importModal').find('.ruleInText').val().split('\n');
        ruleListHandler.import(ruleStrList);
        // 用导入的规则重新渲染列表
        ruleListHandler.render();
    });
}
