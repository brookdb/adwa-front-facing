var mainNav = [
  {
    id: "6492005808824565061",
    href: "about-us",
    title: "ABOUT US"
  },
  {
    id: "7627553939322551164",
    href: "LMS-project",
    title: "LMS PROJECT"
  },
  {
    id: "6592589197778723529",
    href: "join-us",
    title: "JOIN US"
  }
];
var app = angular.module("main", ["ngRoute", "ngSanitize", "ui.bootstrap"]);
app.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "./src/pages/home.htm",
        controller: "defaultCtrl"
    })
    .when("/:mainpage", {
      templateUrl : "./src/pages/mainpages.htm",
      controller: "mainpagesCtrl"
    })
});

app.controller('defaultCtrl', ['$scope', '$http', '$sce', '$location', function($scope, $http, $sce, $location){
  //load main navigation
  $scope.pages = mainNav;


  //sanitizing function
  $scope.trustSrc = function(src){
    return $sce.trustAsResourceUrl(src);
  }


  //switch between mobile view and desktop view
  $scope.mainNav = document.getElementById( 'mainNav' ) ;
  $scope.container = document.getElementById( 'container' );

  $scope.showOpts = function(){
    $scope.mainNav.classList.toggle("showOptions");
    $scope.container.classList.toggle("change");
  }
  //welcome message

  $scope.isActive = function(route){
    console.log(route);
    console.log($location.path());
    return route === $location.path();
  }

}]);

app.controller('mainpagesCtrl',  ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams){
  let pagelink = $routeParams.mainpage;
  $scope.isActive = function(href){
    console.log("is selected clicked in mainpagesCtrl");
    console.log("href: "+href+", pagelink: "+pagelink);
    if(href === pagelink){
      let c = {"color": "white"};
      return c;
    }
  };
  let pageID = mainNav.filter(obj=> {
    return obj.href === pagelink;
  })[0].id;
  let content = "";
  let reqHead = {path: "pages/"+pageID};
  $http.post("./scripts/getcontents.php", reqHead)
  .then((response)=>
  {
    $scope.page = response.data;
    $scope.cnt = angular.element($scope.page.content)[0];
  });
  $scope.isH2 = function(incomingText) {
    if(incomingText === "H2")
    {return true;}
    else{return false;}
  }

  $scope.isP = function(incomingText) {
    if(incomingText === "P")
    {return true;}
    else{return false;}
  }

  $scope.isImg = function(incomingText) {
    if(incomingText === "IMG" || incomingText === "FIGURE")
    {return true;}
    else{return false;}
  }



}])

app.controller('CarouselCtrl', function ($scope, $http) {
  $scope.gallery_imgs=[];
  $http.get("https://ethiopeace.org/wp-json/wp/v2/media/?categories=6")
  .then((response)=>
  {
      $scope.resp = response;
      $scope.links = $scope.resp.data;
      $scope.noWrapSlides = false;

      for(let i=0;i<$scope.links.length; i++){
        $scope.gallery_imgs.push(
          {
            id: $scope.links[i].id,
            source: $scope.links[i].guid.rendered,
            alt_text: $scope.links[i].alt_text,
          }
        )
      }
      });
      //initiate slideshow
      $scope.setActiveSlide = function (idx) {
        $scope.gallery_imgs[idx].active=true;
      };


});
app.directive("icon", function() {
    return {
      restrict: 'E',
      scope: {
        val: "@"
      },
      link: function(scope, element, attrs){
        scope.getContentUrl = function(){
          return './src/icons/'+attrs.val+'.svg';
        }
      },
        template : '<div ng-include="getContentUrl()"></div>'
    }
});
