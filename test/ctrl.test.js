/**
 * Created by Aliaksandr_Zanouski on 10/9/2014.
 */
describe('Unit: Controllers', function() {

    describe('articlesCtrl', function() {
        var createController, scope, rootScope, article;
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
            inject(function($rootScope, $controller, $injector) {
                rootScope = $rootScope;
                article = $injector.get('article');
                scope = $rootScope.$new();
                createController = function() {
                    return $controller('articlesCtrl', {
                        $scope: scope,
                        article: article,
                        articles: angular.copy(items, [])
                    });
                };
            });
            spyOn(article, 'getArticles').andCallThrough();
        });

        it('$scope.articles should be an array', function() {
            createController();
            rootScope.$broadcast('article:create');
            expect(article.getArticles).toHaveBeenCalled();
            expect(angular.isArray(scope.articles)).toBe(true);
        });
    });

    describe('articleCtrl', function() {
        var createController, scope, article, rootScope;
        var currentArticle = {
                title: 'Title !',
                body: 'articles should be updated after addition of new article !!!!',
                author: 'Me'
            };
        beforeEach(function() {
            module('controllers');
            inject(function($rootScope, $controller, $location, $injector) {
                scope = $rootScope.$new();
                article = $injector.get('article');
                rootScope = $rootScope;
                createController = function() {
                    return $controller('articleCtrl', {
                        $scope: scope,
                        article: article,
                        $location: $location,
                        currentArticle: angular.copy(currentArticle, {})
                    });
                };
            });
            spyOn(article, 'remove').andCallThrough();
        });

        it('$scope.articles should be an array', function() {
            createController();
            scope.remove(12);
            expect(article.remove).toHaveBeenCalled();
            expect(angular.isObject(scope.article)).toBe(true);
        });
    });
});