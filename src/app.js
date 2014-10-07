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