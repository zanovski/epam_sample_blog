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
        restrict: 'A',
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
                template.getTemplate(attr.tmp)
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