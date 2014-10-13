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
            return $http.post(/*'http://54.72.3.96:3000/posts'*/'http://restik.herokuapp.com/post', article)
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
                .then(function(res) {
                    $rootScope.$broadcast('article:update');
                    return res;
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