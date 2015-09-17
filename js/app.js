angular.module("jsonEditor", ['angulartics', 'angulartics.google.analytics'])
    .factory("fieldService", fieldService)
    .factory("sampleData", sampleData)
    .directive("butCollapse", butCollapse)
    .controller("RootObj", RootObj);