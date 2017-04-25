var app = angular.module('myApp', []);

app.value('user', { token:'' });

app.controller('signinCtrl',['$scope','$http','$window','user', function($scope,$http,$window,user) { 
    $scope.username = "test"; 
    $scope.password = "test"; 
    $scope.error_hidden = true;
    $scope.login_hidden = false;

    $scope.do_signin = function () {
        $http.post('./authenticate',  { 'username' : $scope.username, 'password' : $scope.password}).then(
            function (response) { 
                if (response.data.success == true) { 
                    user.token = response.data.token;
                    $scope.login_hidden = true;
                    $window.location.href= '/page/timeline';
                } else { 
                    console.log('failed to get token');
                    $scope.error_hidden = false;
                }                  
            },
            function (failure) { 
                console.log("failed"); 
            });
    }
    
}]);

