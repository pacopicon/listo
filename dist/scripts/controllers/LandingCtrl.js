
(function(){
    function LoginCtrl() {
       this.heroTitle = "Organize your life!"
    } 
    
    angular
        .module('listo', ['ui.router', 'firebase'])
        .controller('LoginCtrl', LoginCtrl);
})();