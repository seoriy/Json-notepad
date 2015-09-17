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