/**
 * Created by Aliaksandr_Zanouski on 10/13/2014.
 */
describe('Unit: services', function() {
    describe('articleService', function() {
        var httpBackend, articleSvc;
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
            module('services');
            inject(function($httpBackend, article) {
                httpBackend = $httpBackend;
                articleSvc = article;
                $httpBackend.when('GET', 'http://restik.herokuapp.com/post')
                    .respond(items);
                $httpBackend.when('POST', 'http://restik.herokuapp.com/post')
                    .respond(201);
                $httpBackend.when('GET', 'http://restik.herokuapp.com/post/1')
                    .respond(items[0]);
                $httpBackend.when('PUT', 'http://restik.herokuapp.com/post/1')
                    .respond(200);
            });
        });

        afterEach(function() {
            httpBackend.verifyNoOutstandingExpectation();
            httpBackend.verifyNoOutstandingRequest();
        });

        it('Should return an array of articles', function() {
            articleSvc.getArticles()
                .then(function(data) {
                    expect(angular.isArray(data)).toBe(true);
                    expect(angular.isObject(data[0])).toBe(true);
                });
            httpBackend.flush();
        });

        it('Should return status 201', function() {
            articleSvc.create({title:'Title', body: 'Body', author:'Author'})
                .then(function(res) {
                    expect(res.status).toBe(201);
                });
            httpBackend.flush();
        });

        it('Sould return an object of article', function() {
            articleSvc.getById(1)
                .then(function(data) {
                    expect('title' in data).toBe(true);
                });
            httpBackend.flush();
        });

        it('Should return status 200', function() {
            articleSvc.update({_id:1, title:'Title', body: 'Body', author:'Author'})
                .then(function(res) {
                    expect(res.status).toBe(200);
                });
            httpBackend.flush();
        });
    });

    describe('template Service', function() {
        var templateString = '<div>Super template</div>';

        it('Should return template string', function() {
            module('services');
            inject(function(template, $httpBackend) {
                $httpBackend.when('GET', '/path/to/template.html')
                    .respond(templateString);
                template('/path/to/template.html')
                    .then(function(template) {
                        expect(template).toBe(templateString);
                    });
                $httpBackend.flush();
            });
        });
    });

    describe('makeShortPreview service', function() {
        var articles = [{
            title: 'Title 1',
            body: 'Коды этого класса сообщают клиенту, что для успешного выполнения операции необходимо сделать другой запрос, ' +
                'как правило, по другому URI. Из данного класса пять кодов 301, 302, 303, 305 и 307 относятся непосредственно к ' +
                'перенаправлениям. Адрес, по которому клиенту следует произвести запрос, сервер указывает в заголовке Location. ' +
                'При этом допускается использование фрагментов в целевом URI. По последним стандартам клиент может производить ' +
                'перенаправление без запроса пользователя только если второй ресурс будет запрашиваться методом GET или HEAD[6]. ' +
                'В предыдущих спецификациях говорилось, что для избежания круговых переходов пользователя следует спрашивать после ' +
                '5-го подряд перенаправления[14]. При всех перенаправлениях, если метод запроса был не HEAD, то в тело ответа следует ' +
                'включить короткое гипертекстовое сообщение с целевым адресом, чтобы в случае ошибки пользователь смог сам произвести ' +
                'переход. Разработчики HTTP отмечают, что многие клиенты при перенаправлениях с кодами 301 и 302 ошибочно применяют ' +
                'метод GET ко второму ресурсу, несмотря на то, что к первому запрос был с иным методом (чаще всего PUT)[15]. Чтобы ' +
                'избежать недоразумений, в версии HTTP/1.1 были введены коды 303 и 307 и их рекомендовано использовать вместо 302. ' +
                'Изменять метод нужно только если сервер ответил 303. В остальных случаях следующий запрос производить с исходным методом.',
            author: 'Author'
        },{
            title: 'Title 1',
            body: 'Коды этого класса сообщают клиенту, что для успешного выполнения операции необходимо сделать другой запрос, ' +
                'как правило, по другому URI. Из данного класса пять кодов 301, 302, 303, 305 и 307 относятся непосредственно к ' +
                'перенаправлениям. Адрес, по которому клиенту следует произвести запрос, сервер указывает в заголовке Location. ' +
                'При этом допускается использование фрагментов в целевом URI. По последним стандартам клиент может производить ' +
                'перенаправление без запроса пользователя только если второй ресурс будет запрашиваться методом GET или HEAD[6]. ' +
                'В предыдущих спецификациях говорилось, что для избежания круговых переходов пользователя следует спрашивать после ' +
                '5-го подряд перенаправления[14]. При всех перенаправлениях, если метод запроса был не HEAD, то в тело ответа следует ' +
                'включить короткое гипертекстовое сообщение с целевым адресом, чтобы в случае ошибки пользователь смог сам произвести ' +
                'переход. Разработчики HTTP отмечают, что многие клиенты при перенаправлениях с кодами 301 и 302 ошибочно применяют ' +
                'метод GET ко второму ресурсу, несмотря на то, что к первому запрос был с иным методом (чаще всего PUT)[15]. Чтобы ' +
                'избежать недоразумений, в версии HTTP/1.1 были введены коды 303 и 307 и их рекомендовано использовать вместо 302. ' +
                'Изменять метод нужно только если сервер ответил 303. В остальных случаях следующий запрос производить с исходным методом.',
            author: 'Author'
        }];

        it('Should return an article object with preview field', function() {
            module('services');
            inject(function(makeShortPreview) {
                var articlesWithPreview = makeShortPreview(articles);
                expect('preview' in articles).toBeFalsy();
                expect('preview' in articlesWithPreview[0]).toBeTruthy();
                expect(articlesWithPreview[0].preview.length).toEqual(100);
            });
        });
    });
});