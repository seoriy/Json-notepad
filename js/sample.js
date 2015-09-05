(function () {
    function toJson(o) {
        var str = JSON.stringify(o);
        // alert(str);
        return str;
    }

    var app = angular.module("sample", [])
        .controller("RootObj", ["$scope", function ($scope) {
            $scope.data = { name: "1", children: [{ name: "11", children: [{ name: "111" }] }, { name: "12", children: [{ name: "121" }] }] };
            // alert(toJson($scope.data));
            
            
            
            $scope.category = {
                title: 'Root',
                categories: [
                    {
                        title: 'Компьютеры',
                        categories: [
                            {
                                title: 'Ноутбуки',
                                categories: [
                                    {
                                        title: 'Ультрабуки'
                                    },
                                    {
                                        title: 'Макбуки'
                                    }
                                ]
                            },
                            {
                                title: 'Настольные компьютеры'
                            },
                            {
                                title: 'Планшеты',
                                categories: [
                                    {
                                        title: 'Apple'
                                    },
                                    {
                                        title: 'Android'
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        title: 'Принтеры'
                    }
                ]
            };
        }]);
})();