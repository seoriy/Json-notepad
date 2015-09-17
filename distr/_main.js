/*
    Copyright 2015 © Sergii Kovalchuk
    File is provided under Apache License 2.0 (http://www.apache.org/licenses/LICENSE-2.0)
*/

(function () {
    'use strict';

function toJson(o) {
    var str = JSON.stringify(o);
    return str;
}
function fieldService() {
    return {
        isSimpleField: function (obj) { return angular.isString(obj) || angular.isNumber(obj) || angular.isDate(obj); },
        isStringField: function (obj) { return angular.isString(obj); },
        isNumberField: function (obj) { return angular.isNumber(obj); },
        isDateField: function (obj) { return angular.isDate(obj); },
        isArrayField: function (obj) { return angular.isArray(obj); },
        isObjectField: function (obj) { return !angular.isArray(obj) && angular.isObject(obj); },
        isLabelDefined: function (f) { return f == 0 || f; },
        isLink: function (str) { return angular.isString(str) && (str.trim().indexOf('http://') === 0 || str.trim().indexOf('https://') === 0); }
    }
}

function sampleData() {
    return [
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
}
function butCollapse() { 
            return {    
                restrict: 'AE',
                scope: {},
                link: function (scope, element, attr) {
                    element.on("click", function () {
                        alert("del field");
                        $(element).parentsUntil("div.row-container").find("field").toggle();
                    });
                }
            };
        }
function appendJQuery($compile, $scope) {
    $scope.apply(function () {                 
        var gen = function(tmlVar){ $('div.label-' + tmlVar)
            .hover(
            function () {
                alert(this);
                $(this).append("<div ng-include=\"'parts/toolbar-label-" + tmlVar + ".html\"'");
                $compile($(this));
            },
            function () { 
                $(this).remove(".toolbar");
                $compile($(this));
            });
        };
        gen('obj');
        gen('array');
    });
} 

function RootObj(
        $scope,
        $http,
        $q,
        $timeout,
        $compile,
        $analytics,
        fieldService,  
        sampleData)
{
    $scope.samples = sampleData;
    $scope.fieldService = fieldService;

    function init() {
        $scope.toJson = toJson;
        if (!$scope.targetObj)
            $scope.targetObj = $scope.sample;

        $scope.editScope = {
            editingField: "",
            editingItemIndex: -1,
            editValue: ""
        };
    }
    init();
    $scope.jsonText = JSON.stringify($scope.targetObj);

    $scope.loadSample = function (sampleName) {
        if (sampleName && sampleName != '') {
            if ($scope.sampleName == "<None>") {
                $scope.jsonText = "{}";
                $scope.parseObject();
            } else {
                $http.get('data/samples/sample-' + sampleName + '.json', { transformResponse: [] }).then(function (resp) {
                    $scope.jsonText = resp.data;
                    $scope.parseObject();
                    $analytics.eventTrack('loadSample', { category: 'samples', label: sampleName });
                });
            }
        }
    };           

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
        $scope.jsonText = JSON.stringify($scope.sample);
        $scope.parseObject();
    }

    $scope.parseObject = function () {
        init();
        $scope.targetObj = null;
        if ($scope.jsonText) {
            var defer = $q.defer();
            defer.promise.then(function (val) {
                $scope.errorMessage = null;
                if ($scope.jsonText) {
                    $scope.targetObj = val;
                }
                $timeout(function () { appendJQuery($compile, $scope); });
            }, function (err) {
                $scope.errorMessage = err;
            });
            $timeout(function () {
                try {
                    var val = angular.fromJson($scope.jsonText)
                    defer.resolve(val);
                }
                catch (e) {
                    defer.reject(e);
                }
            });
        }
    };
    
    // editing
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
}
angular.module("jsonEditor", ['angulartics', 'angulartics.google.analytics'])
    .factory("fieldService", fieldService)
    .factory("sampleData", sampleData)
    .directive("butCollapse", butCollapse)
    .controller("RootObj", RootObj);
})();