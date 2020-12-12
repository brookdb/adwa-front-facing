var app = angular.module("main", ["ngRoute", "ngSanitize", "ui.bootstrap"]);

app.factory("bloggerService", ['$http',
  function($http){
    let serviceBase = './API/blogger/';
    var obj = {};

    obj.get = function(q){
      return $http.get(serviceBase + q).then(function(results){
        obj.pages = results.data;
        return results.data;
      });
    }
    obj.post = function(q, object){
      return $http.post(serviceBase + q, object).then(function(results){
        return results.data;
      });
    };
    return obj;
}]);
app.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "./src/pages/home.htm",
        controller: "landingCtrl"
    })
    .when("/:mainpage", {
      templateUrl : "./src/pages/mainpages.htm",
      controller: "mainpagesCtrl"
    })
}).run(function($rootScope, $location, bloggerService){
  $rootScope.$on("$routeChangeStart", function (event, next, current) {
    $rootScope.defaultCtrlLoaded = false;
    //load main navigation
    bloggerService.get('navigation').then(function (results) {
      $rootScope.pages = results;
      console.log($rootScope.pages);
      $rootScope.defaultCtrlLoaded = true;
    });

  });
}).controller('defaultCtrl', ['$rootScope', '$scope', '$http', '$sce', '$location', 'bloggerService', function($rootScope, $scope, $http, $sce, $location, bloggerService){
  $rootScope.defaultCtrlLoaded = false;
  //load main navigation
  bloggerService.get('navigation').then(function (results) {
    $rootScope.pages = results;
    console.log($rootScope.pages);
    $rootScope.defaultCtrlLoaded = true;
  });


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
    return route === $location.path();
  }
}]).controller('landingCtrl', function($scope, bloggerService){

}).controller('mainpagesCtrl',  ['$rootScope','$scope', '$http', '$routeParams', 'bloggerService', '$controller', function($rootScope, $scope, $http, $routeParams, bloggerService, $controller){
  let pagelink = $routeParams.mainpage;
  $scope.isActive = function(href){
    if(href === pagelink){
      let c = {"color": "white"};
      return c;
    }
  };

    let pageID = $rootScope.pages.filter(obj=> {
      return obj.href === pagelink;
    })[0].id;
    console.log(pageID);
    let content = "";
    let post = {'post' : {'postID': pageID}};

    bloggerService.post("page", post)
    .then((response)=>
    {
      console.log(response);
      $scope.page = response;
      $scope.hasCnt=true;
      if($scope.page.content){
          $scope.hasCnt=true;
          $scope.cnt = angular.element($scope.page.content)[0];
      }
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
