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
            replace: true,
            template: '<button class="btn btn-success navbar-btn">' +
                '<span class="glyphicon glyphicon-plus"></span> Add article' +
                '</button>',
            scope: {},
            controller: ['$scope','article', function($scope, article) {
                $scope.article = {};
                $scope.save = function(event) {
                    if((event.type === 'keyup' && event.keyCode === 13) || event.type === 'click') {
                        article.create($scope.article);
                    }
                };
                $scope.$on('article:create', function() {
                    $scope.article = {};
                });
            }],
            link: function($scope, element) {
                element.click(function() {
                    template('templates/create_article.html')
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
    }])
    .directive('editArticle', ['template', '$compile', function(template, $compile) {
        return {
            restrict:'A',
            scope: {
                article: '=editArticle'
            },
            controller: ['$scope', 'article', function($scope, article) {
                $scope.save = function(event) {
                    if((event.type === 'keyup' && event.keyCode === 13) || event.type === 'click') {
                        article.update($scope.article);
                    }
                };
            }],
            link: function($scope, element) {
                element.click(function() {
                    template('templates/create_article.html')
                        .then(function(tmp) {
                            var modal = $compile(tmp)($scope);
                            $('body').append(modal);
                            modal.find('.close').click(function() {
                                modal.remove();
                            });
                            $scope.$on('article:update', function() {
                                modal.remove();
                            });
                        });
                })
            }
        }
    }]);
/**
 * Created by Aliaksandr_Zanouski on 10/7/2014.
 */
angular.module('services', [])
    .service('article', ['$http', '$rootScope', 'makeShortPreview', function($http, $rootScope, makeShortPreview) {
        this.getArticles = function() {
            return $http
                .get(/*'http://54.72.3.96:3000/posts'*/'http://restik.herokuapp.com/post')
                .then(function(res) {
                    return makeShortPreview(res.data);
                });
        };
        this.create = function(article) {
            article.date = new Date;
            $http.post(/*'http://54.72.3.96:3000/posts'*/'http://restik.herokuapp.com/post', article)
                .then(function(res) {
                    $rootScope.$broadcast('article:create');
                    return res;
                });

        };
        this.remove = function(id) {
            return $http.delete('http://restik.herokuapp.com/post/' + id);
        };
        this.getById = function(id) {
            return $http.get('http://restik.herokuapp.com/post/' + id)
                .then(function(res) {
                    return res.data;
                });
        };
        this.update = function(article) {
            return $http.put('http://restik.herokuapp.com/post/' + article._id, article)
                .then(function() {
                    $rootScope.$broadcast('article:update');
                });
        };
    }])
    .factory('template', ['$q', '$http', '$templateCache', function($q, $http, $tC) {
        return function(url) {
            return $q.when($tC.get(url) || $http.get(url))
                .then(function(res) {
                    if(angular.isObject(res)) {
                        res = $tC.put(url, res.data)
                    }
                    return res;
                })
        }
    }])
    .factory('makeShortPreview', function() {//наверно сюда подойдёт лучше фильтр <p>{{article.body | limitTo: 100}}</p>
        return function(articles) {
            return angular.isArray(articles)
            ? articles.map(function(article) {
                article.preview = article.body.substring(0, 100);
                return article;
            })
            : articles;
        }
    });