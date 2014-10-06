/**
 * Created by Aliaksandr_Zanouski on 10/6/2014.
 */
var app = angular.module('app', ['ngRoute']);

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {
        controller: 'articleCtrl',
        templateUrl: 'templates/article-list.html',
        resolve: {
            articles: ['article', function(article) {
                return article.getArticles();
            }]
        }
    });
    $routeProvider.otherwise({redirectTo:'/'});
}]);

app.factory('article', ['$http', '$rootScope', function($http, $rootScope) {
    return {
        getArticles: function() {
            return $http
                .get('articles.json')
                .then(function(res) {
                    return res.data;
                });
        },
        create: function(article) {
            article.date = new Date;
            //$http.post('/create/new/article', article);
            $rootScope.$broadcast('article:create', article);
        }
    }
}]);

app.controller('articleCtrl', ['$scope', 'articles', function($scope, articles) {
    $scope.articles = articles;
    $scope.$on('article:create', function(event, article) {
        $scope.articles.push(article)
    })
}]);

app.directive('articleSection', function() {
    return {
        restrict: 'E',
        templateUrl: 'templates/article.html',
        replace: true,
        scope: {
            article: '='
        },
        link: function($scope, element, attr) {
            //todo: read article functionality
        }
    }
});

app.directive('createArticle', ['$q','$templateCache', '$http', '$compile', function($q, $tC, $http, $compile, article) {
    return {
        restrict: 'A',
        scope: {},
        controller: ['$scope','article', function($scope, article) {
            $scope.article = {};
            $scope.create = function(event) {
                if((event.type === 'keyup' && event.keyCode === 13) || event.type === 'click') {
                    article.create($scope.article);
                    $scope.$destroy();
                }
            }
        }],
        link: function($scope, element, attr) {
            element.click(function() {
                $q.when($tC.get(attr.tmp) || $http.get(attr.tmp))
                    .then(function(res) {
                        if(angular.isObject(res)) {
                            res = $tC.put(attr.tmp, res.data)
                        }
                        return res;
                    })
                    .then(function(tmp) {
                        var modal = $compile(tmp)($scope);
                        $('body').append(modal);
                        modal.find('.close').click(function() {
                            $scope.$destroy();
                        });
                        $scope.$on('$destroy', function() {
                            modal.remove();
                        });
                    });
            });
        }
    };
}]);