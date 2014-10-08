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