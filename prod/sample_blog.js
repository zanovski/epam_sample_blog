/**
 * Created by Aliaksandr_Zanouski on 10/6/2014.
 */
var app = angular.module('app', ['ngRoute', 'services', 'directives', 'controllers']);

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {
        controller: 'articlesCtrl',
        templateUrl: 'templates/article-list.html',
        resolve: {
            articles: ['article', function(article) {
                return article.getArticles();
            }]
        }
    });
    $routeProvider.when('/article/:id', {
        controller: 'articleCtrl',
        templateUrl: 'templates/read-article.html',
        resolve: {
            currentArticle: ['article', '$route', function(article, $route) {
                return article.getById($route.current.params.id)
            }]
        }
    });
    $routeProvider.otherwise({redirectTo:'/'});
}]);
/**
 * Created by Aliaksandr_Zanouski on 10/7/2014.
 */
angular.module('controllers', ['services'])
.controller('articlesCtrl', ['$scope', 'article', 'articles', function($scope, article, articles) {
    $scope.articles = articles;
    $scope.$on('article:create', function() {
        article.getArticles().then(function(data) {
            $scope.articles = data;
        });
    })
}])
.controller('articleCtrl', ['$scope', 'article', '$location', 'currentArticle', function($scope, article, $location, currentArticle) {
    $scope.article = currentArticle;
    $scope.edit = function() {};
    $scope.save = function() {};
    $scope.remove = function(id) {
        article.remove(id)
            .then(function() {
                $location.path('/');
            });
    };
}]);
/**
 * Created by Aliaksandr_Zanouski on 10/7/2014.
 */
angular.module('directives', ['services'])
.directive('articleSection', function() {
    return {
        restrict: 'E',
        templateUrl: 'templates/article.html',
        replace: true,
        scope: {
            article: '='
        }
    }
})
.directive('createArticle', ['template', '$compile', function(template, $compile) {
    return {
        restrict: 'E',
        template: '<button class="btn btn-success navbar-btn">' +
            '<span class="glyphicon glyphicon-plus"></span> Add article' +
            '</button>',
        scope: {},
        controller: ['$scope','article', function($scope, article) {
            $scope.article = {};
            $scope.create = function(event) {
                if((event.type === 'keyup' && event.keyCode === 13) || event.type === 'click') {
                    article.create($scope.article);
                }
            }
        }],
        link: function($scope, element, attr) {
            element.click(function() {
                template.getTemplate('templates/create_article.html')
                    .then(function(tmp) {
                        var modal = $compile(tmp)($scope);
                        $('body').append(modal);
                        modal.find('.close').click(function() {
                            modal.remove();
                        });
                        $scope.$on('article:create', function() {
                            modal.remove();
                        });
                    });
            });
        }
    };
}]);
/**
 * Created by Aliaksandr_Zanouski on 10/7/2014.
 */
angular.module('services', [])
.factory('article', ['$http', '$rootScope', function($http, $rootScope) {
    return {
        getArticles: function() {
            return $http
                .get(/*'http://54.72.3.96:3000/posts'*/'http://restik.herokuapp.com/post')
                .then(function(res) {
                    return res.data;
                });
        },
        create: function(article) {
            article.date = new Date;
            $http.post(/*'http://54.72.3.96:3000/posts'*/'http://restik.herokuapp.com/post', article)
                .then(function(res) {
                    $rootScope.$broadcast('article:create');
                    return res;
                });

        },
        remove: function(id) {
            return $http.delete('http://restik.herokuapp.com/post/' + id);
        },
        getById: function(id) {
            return $http.get('http://restik.herokuapp.com/post/' + id)
                .then(function(res) {
                    return res.data;
                });
        }
        /*update: function(article) {
            return $http.put('http://54.72.3.96:3000/posts', article);
        }
        }*/
    }
}])
.factory('template', ['$q', '$http', '$templateCache', function($q, $http, $tC) {
    return {
        getTemplate: function(url) {
            return $q.when($tC.get(url) || $http.get(url))
                .then(function(res) {
                    if(angular.isObject(res)) {
                        res = $tC.put(url, res.data)
                    }
                    return res;
                })
        }
    };
}]);