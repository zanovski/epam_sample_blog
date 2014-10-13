/**
 * Created by Aliaksandr_Zanouski on 10/13/2014.
 */
describe('Unit: directives', function() {
    describe('articleSection directive', function() {
        it('directive element', function() {
            var article = {
                title: 'Title !',
                body: 'articles should be updated after addition of new article !!!!',
                author: 'Me'
            };
            module('directives');
            inject(function($rootScope, $compile) {
                var scope = $rootScope.$new();
                var element = '<article-section article="article"></article-section>';
                scope.article = article;
                element = $compile(element)(scope);
                expect(scope).toEqual(element.scope());
                expect(element.find('h4')).toBeTruthy();
            });
        });
    });
});