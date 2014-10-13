/**
 * Created by Aliaksandr_Zanouski on 10/9/2014.
 */
describe('Unit: Controllers', function() {

    describe('articlesCtrl', function() {
        var createController, scope;
        var items = [
            {
                title: 'Title !',
                body: 'articles should be updated after addition of new article !!!!',
                author: 'Me'
            },{
                title: 'Title 2!',
                body: 'articles should be updated after addition of new article !!!!',
                author: 'Me 2'
            }
        ];
        beforeEach(function() {
            module('controllers');
            inject(function($rootScope, $controller, article) {
                scope = $rootScope.$new();
                createController = function() {
                    return $controller('articlesCtrl', {
                        $scope: scope,
                        article: article,
                        articles: angular.copy(items, [])
                    });
                };
            });
        });

        it('$scope.articles should be an array', function() {
            createController();
            expect(angular.isArray(scope.articles)).toBe(true);
        });
    });

    describe('articleCtrl', function() {
        var createController, scope;
        var currentArticle = {
                title: 'Title !',
                body: 'articles should be updated after addition of new article !!!!',
                author: 'Me'
            };
        beforeEach(function() {
            module('controllers');
            inject(function($rootScope, $controller, article, $location) {
                scope = $rootScope.$new();
                createController = function() {
                    return $controller('articleCtrl', {
                        $scope: scope,
                        article: article,
                        $location: $location,
                        currentArticle: angular.copy(currentArticle, {})
                    });
                };
            });
        });

        it('$scope.articles should be an array', function() {
            createController();
            expect(angular.isObject(scope.article)).toBe(true);
        });
    });
});