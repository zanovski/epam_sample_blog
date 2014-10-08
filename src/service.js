/**
 * Created by Aliaksandr_Zanouski on 10/7/2014.
 */
angular.module('services', [])
    .service('article', ['$http', '$rootScope', function($http, $rootScope) {
        this.getArticles = function() {
            return $http
                .get(/*'http://54.72.3.96:3000/posts'*/'http://restik.herokuapp.com/post')
                .then(function(res) {
                    return res.data;
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
    }]);