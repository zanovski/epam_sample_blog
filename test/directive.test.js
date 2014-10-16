/**
 * Created by Aliaksandr_Zanouski on 10/13/2014.
 */
describe('Unit: directives', function() {
    describe('articleSection directive', function() {
        var article = {
            title: 'Title !',
            body: 'articles should be updated after addition of new article !!!!',
            author: 'Me'
        };
        var scope, element, httpBackend;

        beforeEach(function() {
            module('directives');
            inject(function($rootScope, $compile, $injector) {
                httpBackend = $injector.get('$httpBackend');
                httpBackend.when('GET', 'templates/article.html')
                    .respond(   '<div class="panel-body" style="background-image: url({{article.image}}); background-repeat: no-repeat; background-size: 400px; background-position:  750px 0;">'+
                                    '<button edit-article="article" class="btn btn-default btn-xs pull-right read"><span class="glyphicon glyphicon-pencil"></span></button>'+
                                    '<a ng-href="#/article/{{article._id}}"><h4 style="display: inline-block">{{article.title}}</h4></a>'+
                                    '<p>{{article.body}}</p>'+
                                    '<small>created by: <a ng-href="#/maybe/path/to/user/profile">{{article.author}}</a></small> <small> at {{article.date | date:"dd.MM.yyyy"}}</small>'+
                                '</div>'
                );
                scope = $rootScope.$new();
                element = '<article-section article="article"></article-section>';
                scope.article = article;
                element = $compile(element)(scope);
                httpBackend.flush();
                scope.$digest();
            });
        });

        it('directive element', function() {
            expect(scope).toEqual(element.scope());
            expect(element.find('h4').text()).toBe(article.title);
            expect(element.find('p').text()).toBe(article.body);
        });
    });
});