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