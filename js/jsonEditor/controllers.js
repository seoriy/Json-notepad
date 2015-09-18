// function appendJQuery($compile, $scope) {
//     $scope.apply(function () {                 
//         var gen = function(tmlVar){ $('div.label-' + tmlVar)
//             .hover(
//             function () {
//                 alert(this);
//                 $(this).append("<div ng-include=\"'parts/toolbar-label-" + tmlVar + ".html\"'");
//                 $compile($(this));
//             },
//             function () { 
//                 $(this).remove(".toolbar");
//                 $compile($(this));
//             });
//         };
//         gen('obj');
//         gen('array');
//     });
// } 

function RootObj(
    $scope,
    $http,
    $q,
    $timeout,
    $compile,
    $analytics,
    fieldService,
    sampleData) {
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

    $scope.loadSample = function loadSample(sampleName) {
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

    $scope.iterateObj = function iterateObj(obj) {
        var fields = [];
        angular.forEach(obj, function (v, k) { fields.push({ field: k, value: v }) }, fields);
        return fields;
    };

    $scope.parseArray = function parseArray(arr) {
        if (!arr || !arr.length)
            return null;

        var fields = [];

        for (var i = 0; i < arr.length; i++) {
            var o = arr[i];
            if (o && angular.isObject(o)) {
                for (var key in o) {
                    if (o.hasOwnProperty(key) && fields.indexOf(key) == -1) {
                        fields.push(key);
                    }
                }
            }
        }

        return { fields: fields, array: arr, isSimple: fields.length == 0 };
    };

    // editor methods
    $scope.resetInput = function resetInput() {
        $scope.jsonText = JSON.stringify($scope.sample);
        $scope.parseObject();
    }

    $scope.parseObject = function parseObject() {
        init();
        $scope.targetObj = null;
        if ($scope.jsonText) {
            var defer = $q.defer();
            defer.promise.then(
                function (val) {
                    $scope.errorMessage = null;
                    if ($scope.jsonText) {
                        $scope.targetObj = val;
                    }
                    //$timeout(function () { appendJQuery($compile, $scope); });
                },
                function (err) {
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
    $scope.editField = function editField(field, itemIndex) {
        $scope.editScope.editingField = field;
        $scope.editScope.editingItemIndex = itemIndex;
        return true;
    };

    $scope.isEditingField = function isEditingField(f, itemIndex) {
        return $scope.editScope.editingField == f && $scope.editScope.editingItemIndex == itemIndex;
    };

    $scope.submitValue = function submitValue(val, target, field, index) {
        if (field)
            target[field] = val;
        else if (index != -1)
            target[index] = val;
        return true;
    };
}