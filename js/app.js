(function () {
    'use strict';
    function toJson(o) {
        var str = JSON.stringify(o);
        // alert(str);
        return str;
    }

    var app = angular.module("jsonEditor", [])  //["sf.treeRepeat"])
        .controller("RootObj", ["$scope", "$q", "$http", function ($scope, $q, $http) {
            $scope.samples = [
                { name: "", descr: "<None>" },
                { name: "colors", descr: "colors" },
                { name: "customer", descr: "customer" },
                { name: "facebook", descr: "facebook" },
                { name: "flikr", descr: "flikr" },
                { name: "google-maps", descr: "google-maps" },
                { name: "iphone", descr: "iphone" },
                { name: "microsoft", descr: "microsoft" },
                { name: "twitter", descr: "twitter" },
                { name: "youtube", descr: "youtube" },
            ];

            //$scope.sample = { "name": "foundation", "version": "5.5.2", "main": ["css/foundation.css", "css/foundation.css.map", "js/foundation.js"], "ignore": [], "dependencies": { "jquery": ">= 2.1.0", "modernizr": ">= 2.7.2", "fastclick": ">=0.6.11", "jquery.cookie": "~1.4.0", "jquery-placeholder": "~2.0.7" }, "devDependencies": { "jquery.autocomplete": "devbridge/jQuery-Autocomplete#1.2.9", "lodash": "~2.4.1" }, "private": true, "homepage": "https://github.com/zurb/bower-foundation", "_release": "5.5.2", "_resolution": { "type": "version", "tag": "5.5.2", "commit": "9bad0646cb1c41d230e79ffe381491b7f703fc52" }, "_source": "git://github.com/zurb/bower-foundation.git", "_target": "~5.5.2", "_originalSource": "foundation", "_direct": true };
            function init() {
                $scope.toJson = toJson;
                //$scope.sample = { name: "Nikola", lastName: "Tesla", Pattents: [{ name: "Electric psubmitValueropulsion", year: 1879 }, { name: "Tesla Generator", year: 1894 }] };
                // use some bower config for example
                if (!$scope.targetObj)
                    $scope.targetObj = $scope.sample;

                $scope.editScope = {
                    editingField: "",
                    editingItemIndex: -1,
                    editValue: ""
                };
            }
            init();
            $scope.jsonObj = JSON.stringify($scope.targetObj);

            $scope.loadSample = function (sampleName) {
                if (sampleName && sampleName != '') {
                    if ($scope.sampleName == "<None>") {
                        $scope.jsonObj = "{}";
                        $scope.parseObject();
                    } else {
                        $http.get('data/samples/sample-' + sampleName + '.json', { transformResponse: [] }).then(function (resp) {
                            $scope.jsonObj = resp.data;
                            $scope.parseObject();
                        });
                    }
                }
            };

            $scope.editField = function (field, itemIndex) {
                $scope.editScope.editingField = field;
                $scope.editScope.editingItemIndex = itemIndex;
                return true;
            };

            $scope.isEditingField = function (f, itemIndex) {
                return $scope.editScope.editingField == f && $scope.editScope.editingItemIndex == itemIndex;
            };

            $scope.submitValue = function (val, target, field, index) {
                if (field)
                    target[field] = val;
                else if (index != -1)
                    target[index] = val;
                return true;
            };

            $scope.isSimpleField = function (obj) { return angular.isString(obj) || angular.isNumber(obj) || angular.isDate(obj); };
            $scope.isStringField = function (obj) { return angular.isString(obj); };
            $scope.isNumberField = function (obj) { return angular.isNumber(obj); };
            $scope.isDateField = function (obj) { return angular.isDate(obj); };

            $scope.isLabelDefined = function (f) { return f == 0 || f; };
            $scope.isArrayField = function (obj) { return angular.isArray(obj); };
            $scope.isObjectField = function (obj) { return !angular.isArray(obj) && angular.isObject(obj); };
            $scope.isLink = function (str) {
                return angular.isString(str) && (str.trim().indexOf('http://') === 0 || str.trim().indexOf('https://') === 0);
            }

            $scope.iterateObj = function (obj) {
                var fields = [];
                angular.forEach(obj, function (v, k) { fields.push({ field: k, value: v }) }, fields);
                return fields;
            };

            $scope.parseArray = function (arr) {
                if (!arr || !arr.length)
                    return null;

                var fields = [];

                for (var i = 0; i < arr.length; i++) {
                    var o = arr[i];
                    if (o && angular.isObject(o)) {
                        for (var key in o) {
                            key = key.toLowerCase();
                            if (o.hasOwnProperty(key) && fields.indexOf(key) == -1) {
                                fields.push(key);
                            }
                        }
                    }
                }

                return { fields: fields, array: arr, isSimple: fields.length == 0 };
            };

            // editor methods            
            $scope.resetInput = function () {
                init();
                $scope.jsonObj = JSON.stringify($scope.sample);
            }

            $scope.parseObject = function () {
                init();
                $scope.targetObj = null;
                if ($scope.jsonObj) {

                    var defer = $q.defer();
                    defer.promise.then(function (val) {
                        // alert($scope.jsonObj);
                        $scope.errorMessage = null;
                        if ($scope.jsonObj) {
                            $scope.targetObj = val;
                        }
                    }, function (err) {
                        $scope.errorMessage = err;
                    });
                    setTimeout(function () {
                        try {
                            var val = angular.fromJson($scope.jsonObj)
                            defer.resolve(val);
                        }
                        catch (e) {
                            defer.reject(e);
                        }
                    }, $scope.jsonObj.length / 10000 + 5);//Math.abs(Math.log($scope.jsonObj)) + 5);
                }
            };


            $http.get('data/samples/sample-colors.json', { transformResponse: [] }).then(function (resp) {
                $scope.jsonObj = resp.data;
                $scope.parseObject();
            });
        }]);
})();