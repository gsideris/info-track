app = angular.module('myApp', [])

app.factory 'Token', ->
  { token: '' }




app.controller 'messageCtrl', [
  '$scope'
  '$http'
  ($scope, $http) ->
    $scope.message = name: ''

    $scope.update = (pname) ->
      $scope.message = name: pname
      return

    $scope.add = ->
      $http.post '/your/url/search', { params: $scope.message }, ((response) ->
        console.log 'success'
        return
      ), (failure) ->
        console.log 'failed'
        return
      return

    return
]
app.controller 'qaCtrl', [
  '$scope'
  '$http'
  ($scope, $http) ->
    $scope.qa =
      question: ''
      answer: ''

    $scope.update = (pquestion, panswer) ->
      $scope.qa =
        question: pquestion
        answer: panswer
      return

    $scope.add = ->
      $http.post '/your/url/search', { params: $scope.qa }, ((response) ->
        console.log 'success'
        return
      ), (failure) ->
        console.log 'failed'
        return
      return

    return
]
app.controller 'todoCtrl', [
  '$scope'
  '$http'
  ($scope, $http) ->
    $scope.todo =
      name: ''
      completed: ''

    $scope.update = (name, pcompleted) ->
      $scope.todo =
        name: pname
        completed: pcompleted
      return

    $scope.add = ->
      alert 1
      $http.post '/your/url/search', { params: $scope.todo }, ((response) ->
        console.log 'success'
        return
      ), (failure) ->
        console.log 'failed'
        return
      return

    return
]


