
var app = angular.module('app',['ngRoute'])

//routes
app.config(function($routeProvider){
  $routeProvider
  .when('/:username/:appName',{controller: 'initialController', templateUrl: '../views/view.html', reloadOnSearch: false})
  .when('/:username/:appName/:viewName',{templateUrl:'../views/view.html', controller: 'viewController', reloadOnSearch: false})
})

app.service('appProperties', function(){
  var property;

  return {
    getData : function() {
      return property;
    },
    setData : function(value) {
      property = value;
    }
  }
})

//gets app data and saves initial view data
app.controller('initialController', ['$scope','$http','$routeParams','$location', 'appProperties', '$rootScope', function($scope,$http,$routeParams,$location,appProperties, $rootScope){
  //$scope.$on('$routeChangeSuccess', function() {
    console.log('in initialcontroller');
    $http.get('/api/'+$routeParams.username+'/'+$routeParams.appName).success(function(data){
      //appProperties.setData(data);
      $rootScope.appData = data
      $location.path('/'+$routeParams.username+'/'+$routeParams.appName+'/'+data.initialViewName)
    }, function(err){
      console.log(err);
    });
  //});
}])

//loads views
app.controller('viewController', ['$scope','$http','$routeParams','appProperties', '$rootScope','$location',function($scope,$http,$routeParams,appProperties,$rootScope,$location){
  if($rootScope.appData == null){
    $location.path('/'+$routeParams.username+'/'+$routeParams.appName);
    return;
  }
  console.log('viewController loaded');
  $scope.viewName = $routeParams.viewName;
  for(var i = 0; i < $rootScope.appData.views.length; i++) {
    if($rootScope.appData.views[i].viewName === $scope.viewName)
      $scope.view = $rootScope.appData.views[i];
  }

  $scope.redirectToViewByName = function(targetViewName){
    console.log('going to '+targetViewName);
    $location.path('/'+$routeParams.username+'/'+$routeParams.appName+'/'+targetViewName)
  }
}]);   