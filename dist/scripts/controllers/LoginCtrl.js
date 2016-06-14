(function(){
    function LoginCtrl() {
       this.heroTitle = "Organize your life!"
    } 
    
    angular
        .module('listo')
        .controller('LoginCtrl', LoginCtrl);
})();