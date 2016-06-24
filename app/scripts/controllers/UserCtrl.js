(function() {
    function UserCtrl(ItemCrud) {
        this.itemCrud = ItemCrud;
    }
    
    angular
        .module('listo')
        .controller('UserCtrl', ['ItemCrud', 'firebase' UserCtrl]);
})();