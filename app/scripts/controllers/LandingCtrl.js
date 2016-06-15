(function(){
    function LandingCtrl() {
       this.heroTitle = "Organize your life!"
    } 
    
    angular
        .module('listo')
        .controller('LandingCtrl', LandingCtrl);
})();