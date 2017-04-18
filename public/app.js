var app = angular.module('myApp', []);

app.value('user', { token:'' });

app.controller('signinCtrl',['$scope','$http','user', function($scope,$http,user) { 
    $scope.username = "start"; 
    $scope.password = "strt"; 
    $scope.error_hidden = true;
    $scope.login_hidden = false;

    $scope.do_signin = function () {
        console.log('signing in');
        $http.post('./authenticate',  { 'username' : $scope.username, 'password' : $scope.password}).then(
            function (response) { 
                if (response.data.success == true) { 
                    user.token = response.data.token;
                    $scope.login_hidden = true;
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

app.controller('messageCtrl', ['$scope', '$http', function ($scope, $http) {
    $scope.message = {name:""};
    $scope.update = function(pname) {
        $scope.message = { name : pname };
    };    
    $scope.add = function () {
        $http.post('/your/url/search', { params: $scope.message },
            function (response) { console.log("success"); },
            function (failure) { console.log("failed"); });
    }
}]);

app.controller('qaCtrl', ['$scope', '$http', function ($scope, $http) {
    $scope.qa = {question:"",answer:""};
    $scope.update = function(pquestion, panswer) {
        $scope.qa = { question: pquestion, answer: panswer };
    };    
    $scope.add = function () {
        $http.post('/your/url/search', { params: $scope.qa },
                function (response) { console.log("success"); },
                function (failure) { console.log("failed"); });
    }
}]);

app.controller('todoCtrl', ['$scope', '$http', function ($scope, $http) {
    $scope.todo = {name:"",completed:""};
    $scope.update = function(name, pcompleted) {
        $scope.todo = { name: pname, completed: pcompleted};
    };    
    $scope.add = function () {
        alert(1);
        $http.post('/your/url/search', { params: $scope.todo },
                function (response) { console.log("success"); },
                function (failure) { console.log("failed"); });
    }
}]);



